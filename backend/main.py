import os
import asyncio
from dotenv import load_dotenv
from retrieving import get_embedding

from agents import (
    Agent,
    Runner,
    RunConfig,
    AsyncOpenAI,
    OpenAIChatCompletionsModel,
    function_tool
)

import cohere
from qdrant_client import QdrantClient

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv()

# ================================
# FastAPI
# ================================
app = FastAPI(title="RAG ChatBot")

allowed_origins = [
    "http://localhost:3000/",
    "https://muhammadtayyab8.github.io/physical-ai-textbook/",
    "http://192.168.43.129:3000"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://muhammadtayyab8.github.io",
        "https://muhammadtayyab8.github.io/physical-ai-textbook",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ================================
# API Keys
# ================================
gemini_api_key = os.getenv("GEMINI_API_KEY")
cohere_api_key = os.getenv("COHERE_API_KEY")
qdrant_url = os.getenv("QDRANT_URL")
qdrant_url_key = os.getenv("QDRANT_API_KEY")

if not gemini_api_key:
    raise ValueError("Gemini key missing")

# ================================
# Providers
# ================================
provider = AsyncOpenAI(
    api_key=gemini_api_key,
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
)

model = OpenAIChatCompletionsModel(
    model="gemini-2.5-flash",
    openai_client=provider
)

run_config = RunConfig(
    model_provider=provider,
    model=model,
    tracing_disabled=True,
)

cohere_client = cohere.Client(cohere_api_key)

qdrant = QdrantClient(
    url=qdrant_url,
    api_key=qdrant_url_key
)

# ================================
# Tool for Retrieval
# ================================
@function_tool
def retrieve(query: str):
    """
    Retrieve relevant textbook chapters using semantic search.

    This function:
    - Searches the Qdrant vector database
    - Retrieves the most relevant chunks from the
      Physical AI & Humanoid Robotics textbook chapters

    The returned text is used as context for answering
    the user's question.
    """
    embedding = get_embedding(query)
    result = qdrant.query_points(
        collection_name="physical-ai-textbook",
        query=embedding,
        limit=5
    )
    return [point.payload["text"] for point in result.points]


# ================================
# Agent
# ================================
agent = Agent(
    name="Assistant",
    instructions="""
        You are an AI tutor for the *Physical AI & Humanoid Robotics* textbook.

        Your job:
        1. ALWAYS call the `retrieve` tool first using the user query.
        2. Only use the retrieved textbook chunks to answer.
        3. If the retrieved text does NOT contain the answer, respond with:
        "I don't know based on the textbook."
        4. Do NOT use outside knowledge.
        5. Do NOT guess or hallucinate.
        6. If user asks something outside robotics / the textbook,
        politely say it is not covered and encourage asking another topic.
        7. Keep answers short, clear, and factual.
    """,
    model=model,
    tools=[retrieve]
)

# ================================
# Routes
# ================================
@app.get("/")
def home():
    return {"message": "🚀 FastAPI running!"}


class ChatBotQuery(BaseModel):
    query: str


@app.post("/chat")
async def generate(req: ChatBotQuery):

    try:
        print("🔥 Gemini call happening")

        result = await Runner.run(
            starting_agent=agent,
            input=req.query,
            run_config=run_config,
        )

        return {
            "success": True,
            "response": result.final_output
        }

    except Exception as e:
        print("❌ Error:", str(e))
        raise HTTPException(status_code=500, detail=str(e))
