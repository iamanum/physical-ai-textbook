import os
import glob
from pathlib import Path
from dotenv import load_dotenv

# Qdrant aur OpenAI libraries import karein
from qdrant_client import QdrantClient, models
from openai import OpenAI

# Comment: .env file se keys load karein
load_dotenv()

# Environment variables se keys load karein
QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# --- Configuration ---
QDRANT_COLLECTION = "physical_ai_textbook"
VECTOR_SIZE = 1536 # For model: text-embedding-3-small
EMBEDDING_MODEL = "text-embedding-3-small"
CHAT_MODEL = "gpt-4o-mini" 

# Qdrant Client ko Cloud mode mein set karein (Final Fix for Connection/404 Issues)
# Qdrant Client ko Local Mode mein set karein (Debugging ke liye)
QDRANT_CLIENT = QdrantClient(path="./local_qdrant_storage") 
# Comment: Ab data Cloud ki bajaye local disk par save hoga.

# OpenAI Client ko API key se initialize karein
OPENAI_CLIENT = OpenAI(api_key=OPENAI_API_KEY)

def get_text_chunks(filepath):
    # Comment: Markdown file ko read karein aur '##' headings par chote chunks mein baantein
    try:
        content = Path(filepath).read_text(encoding='utf-8')
        # Expert Tip: Har sub-heading (##) se split karein taake har chunk ka context clear ho
        chunks = content.split("##")
        
        # '##' ko wapis add karein aur extra whitespace hataein
        return [f"##{chunk.strip()}" for chunk in chunks if chunk.strip()]
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
        return []

def generate_embedding(text):
    # Comment: Text se vector banane ke liye OpenAI API call karein
    try:
        response = OPENAI_CLIENT.embeddings.create(
            input=text,
            model=EMBEDDING_MODEL
        )
        return response.data[0].embedding
    except Exception as e:
        # Comment: Agar yahan error aaye toh OpenAI key ya billing check karein
        print(f"Embedding API Error (Check OpenAI Key/Billing): {e}")
        return None

def index_book_content():
    # Comment: Qdrant collection banayein
    try:
        QDRANT_CLIENT.recreate_collection(
            collection_name=QDRANT_COLLECTION,
            vectors_config=models.VectorParams(size=VECTOR_SIZE, distance=models.Distance.COSINE),
        )
        print(f"Collection '{QDRANT_COLLECTION}' recreated successfully on Cloud.")
    except Exception as e:
        # Comment: Agar yahan error aaye toh Qdrant URL ya API Key check karein
        print(f"Qdrant Connection/Creation Error: {e}")
        return

    points = []
    point_id = 0
    # Comment: docs folder mein saari .md files dhoondein (2 levels up jana hoga: rag-service -> physical-ai-textbook -> docs)
    book_dir = Path(__file__).parent.parent / "docs"
    
    # Hum sirf un files ko process karenge jo hamare modules ke andar hain
    for filepath in glob.glob(str(book_dir / "[0-9][0-9]-*/**/*.md"), recursive=True):
        chunks = get_text_chunks(filepath)
        source = Path(filepath).relative_to(book_dir).as_posix() # Source path ko save karein
        
        print(f"Processing {source} ({len(chunks)} chunks)...")
        
        for chunk in chunks:
            embedding = generate_embedding(chunk)
            
            if embedding:
                # Comment: Vector aur metadata ko point ki tarah save karein
                points.append(
                    models.PointStruct(
                        id=point_id,
                        vector=embedding,
                        payload={"source": source, "text": chunk}
                    )
                )
                point_id += 1
        
        if not chunks:
             print(f"Warning: File {source} contained no substantial chunks.")
                
    # Comment: Sab points ko Qdrant mein daal dein
    if points:
        QDRANT_CLIENT.upsert(
            collection_name=QDRANT_COLLECTION,
            wait=True,
            points=points
        )
        print(f"Indexing Complete. Successfully indexed {len(points)} points into Qdrant.")
    else:
        print("Indexing Complete. No valid chunks found to index.")

if __name__ == "__main__":
    index_book_content()