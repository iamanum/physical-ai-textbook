import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from qdrant_client import QdrantClient
from openai import OpenAI
from typing import Optional, Dict

# Comment: User database aur models import karein
from users import UserModel, AuthRequest, signup_user, signin_user, get_user

# Comment: .env file se keys load karein
load_dotenv()

# Environment variables se keys load karein
QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# --- Configuration ---
QDRANT_COLLECTION = "physical_ai_textbook"
EMBEDDING_MODEL = "text-embedding-3-small"
CHAT_MODEL = "gpt-4o-mini" 

# Qdrant Client (indexing ke waqt set kiya tha)
QDRANT_CLIENT = QdrantClient(
    url=QDRANT_URL,
    api_key=QDRANT_API_KEY,
    https=True,
    check_compatibility=False 
)
# OpenAI Client
OPENAI_CLIENT = OpenAI(api_key=OPENAI_API_KEY)

# FastAPI app initialize karein
app = FastAPI()

# CORS settings: Docusaurus ko API access dene ke liye zaroori hai
origins = [
    "http://localhost:3000", # Comment: Local Docusaurus URL
    "https://iamanum.github.io" # Comment: Deployment URL yahan aayega
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Model for RAG query
class QueryRequest(BaseModel):
    query: str
    context_override: str = None # Bonus Feature 2 ke liye (selected text)
    username: Optional[str] = None # Personalization ke liye

# Pydantic Model for Signup Request
class SignupRequest(AuthRequest):
    software_background: str
    hardware_background: str

# Pydantic Model for Translation Request
class TranslateRequest(BaseModel):
    text: str
    target_lang: str = "Urdu (Roman script)"

@app.get("/")
def read_root():
    # Comment: Basic health check endpoint
    return {"status": "RAG API is running"}

# --- AUTH ENDPOINTS (BONUS +50) ---

@app.post("/signup")
def handle_signup(request: SignupRequest):
    return signup_user(request, request.software_background, request.hardware_background)

@app.post("/signin")
def handle_signin(request: AuthRequest):
    return signin_user(request)

@app.get("/user/{username}")
def get_user_data(username: str) -> Optional[Dict]:
    # Comment: User ka background data nikalne ke liye
    user = get_user(username)
    if user:
        return user.model_dump() # Pydantic model ko dictionary mein convert karein
    return None

# --- RAG CORE FUNCTIONS ---

def retrieve_context(query: str, client: QdrantClient):
    # Comment: Sawal ko vector mein convert karein
    embedding_response = OPENAI_CLIENT.embeddings.create(
        input=query,
        model=EMBEDDING_MODEL
    )
    query_embedding = embedding_response.data[0].embedding
    
    # Comment: Qdrant se top 5 relevant chunks dhoondein
    search_result = client.search(
        collection_name=QDRANT_COLLECTION,
        query_vector=query_embedding,
        limit=5,
        score_threshold=0.7 
    )
    
    # Comment: Context strings ko combine karein
    context = "\n\n".join([hit.payload['text'] for hit in search_result])
    return context

@app.post("/query")
async def rag_query(request: QueryRequest):
    user = get_user(request.username) if request.username else None
    
    try:
        if not OPENAI_API_KEY:
            raise ValueError("OpenAI Key is missing or invalid.")

        if request.context_override:
            context = request.context_override
            source = "User Selected Text (Context Override)"
        else:
            context = retrieve_context(request.query, QDRANT_CLIENT)
            source = "Qdrant Index Search (Full RAG)"
        
        # --- PERSONALIZATION LOGIC START (BONUS +50) ---
        user_info = ""
        if user and user.is_authenticated:
            # Expert Tip: Logic ko complex banayein
            if user.hardware_background == "RTX_GPU":
                 user_info = "The user has an RTX GPU. Provide code examples optimized for GPU acceleration and focus on performance tuning for NVIDIA Isaac Sim."
            elif user.hardware_background == "Laptop":
                 user_info = "The user has a standard laptop. Emphasize cloud options (AWS RoboMaker) and troubleshooting latency issues. Avoid large memory concepts."

        # Expert System Prompt
        system_prompt = (
            f"You are a helpful teaching assistant for a 'Physical AI & Humanoid Robotics' textbook. {user_info} " 
            "Use ONLY the provided context to answer the user's question. If the answer is not "
            "found in the context, state: 'The answer is not available in the current textbook modules.'"
        )
        # --- PERSONALIZATION LOGIC END ---

        # Chat Completion call karein
        response = OPENAI_CLIENT.chat.completions.create(
            model=CHAT_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Context from Textbook: {context}\n\nUser Question: {request.query}"}
            ],
            temperature=0.1
        )
        
        return {
            "answer": response.choices[0].message.content,
            "source": source,
            "context_used": context
        }

    except Exception as e:
        error_str = str(e)
        print(f"RAG Error: {error_str}")
        if "API key provided" in error_str or "invalid_api_key" in error_str:
             raise HTTPException(status_code=500, detail="OpenAI API Key is invalid or expired. Check billing.")
        if "timeout" in error_str:
             raise HTTPException(status_code=500, detail="RAG service timed out. Check network or server load.")
             
        raise HTTPException(status_code=500, detail=f"An internal error occurred: {error_str}")

# --- URDU TRANSLATION ENDPOINT (BONUS +50) ---

@app.post("/translate")
async def translate_content(request: TranslateRequest):
    try:
        if not OPENAI_API_KEY:
            raise HTTPException(status_code=500, detail="OpenAI Key missing for translation.")

        system_prompt = (
            f"You are a professional technical translator. Translate the provided textbook content into "
            f"the requested target language ({request.target_lang}). The tone must be educational "
            f"and formal. Use Roman script for Urdu translation."
        )

        response = OPENAI_CLIENT.chat.completions.create(
            model=CHAT_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Translate this text: {request.text}"}
            ],
            temperature=0.1
        )
        
        return {
            "translation": response.choices[0].message.content,
        }

    except Exception as e:
        error_str = str(e)
        print(f"Translation Error: {error_str}")
        raise HTTPException(status_code=500, detail=f"Translation API Error: {error_str}")