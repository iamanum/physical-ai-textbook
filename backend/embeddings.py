import os
import requests
import xml.etree.ElementTree as ET
import trafilatura
from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance, PointStruct
import cohere

from dotenv import load_dotenv, find_dotenv

load_dotenv()

cohere_api_key = os.getenv("COHERE_API_KEY")
qdrant_url = os.getenv("QDRANT_URL")
qdrant_url_key = os.getenv("QDRANT_API_KEY")

# -------------------------------------
# CONFIG
# -------------------------------------
# Your Deployment Link:
SITEMAP_URL = os.getenv("SITE_URL")
COLLECTION_NAME = "physical-ai-textbook"

cohere_client = cohere.Client(cohere_api_key)
EMBED_MODEL = "embed-english-v3.0"

# Connect to Qdrant Cloud
qdrant = QdrantClient(
    url=qdrant_url,
    api_key=qdrant_url_key
)

# -------------------------------------
# Step 1 — Extract URLs from sitemap
# -------------------------------------
def get_all_urls(sitemap_url):
    xml = requests.get(sitemap_url).text
    root = ET.fromstring(xml)

    urls = []
    for child in root:
        loc_tag = child.find("{http://www.sitemaps.org/schemas/sitemap/0.9}loc")
        if loc_tag is not None:
            urls.append(loc_tag.text)

    print("\nFOUND URLS:")
    for u in urls:
        print(" -", u)

    return urls


# -------------------------------------
# Step 2 — Download page + extract text
# -------------------------------------
def extract_text_from_url(url):
    html = requests.get(url).text
    text = trafilatura.extract(html)

    if not text:
        print("[WARNING] No text extracted from:", url)

    return text


# -------------------------------------
# Step 3 — Chunk the text
# -------------------------------------
def chunk_text(text, max_chars=1200):
    chunks = []
    while len(text) > max_chars:
        # Try to find the last sentence ending within the max_chars limit
        split_pos = text[:max_chars].rfind(". ")
        # If no sentence ending found, try other punctuation
        if split_pos == -1:
            split_pos = text[:max_chars].rfind("! ")
        if split_pos == -1:
            split_pos = text[:max_chars].rfind("? ")
        # If still no sentence ending, try comma
        if split_pos == -1:
            split_pos = text[:max_chars].rfind(", ")
        # If still no punctuation, just split at max_chars
        if split_pos == -1:
            split_pos = max_chars
        
        chunks.append(text[:split_pos + 1].strip() if split_pos != max_chars else text[:split_pos].strip())
        text = text[split_pos + 1:].lstrip()  # Remove leading whitespace from remaining text
    
    # Add the remaining text as the final chunk if it's not empty
    if text.strip():
        chunks.append(text.strip())
    
    return chunks


# -------------------------------------
# Step 4 — Create embedding
# -------------------------------------
def embed(text):
    response = cohere_client.embed(
        model=EMBED_MODEL,
        input_type="search_document",  # Use search_document for document chunks
        texts=[text],
    )
    return response.embeddings[0]  # Return the first embedding


# -------------------------------------
# Step 5 — Store in Qdrant
# -------------------------------------
def create_collection():
    print("\nCreating Qdrant collection...")
    qdrant.recreate_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=VectorParams(
        size=1024,        # Cohere embed-english-v3.0 dimension
        distance=Distance.COSINE
        )
    )

def save_chunk_to_qdrant(chunk, chunk_id, url):
    vector = embed(chunk)

    qdrant.upsert(
        collection_name=COLLECTION_NAME,
        points=[
            PointStruct(
                id=chunk_id,
                vector=vector,
                payload={
                    "url": url,
                    "text": chunk,
                    "chunk_id": chunk_id
                }
            )
        ]
    )


# -------------------------------------
# MAIN INGESTION PIPELINE
# -------------------------------------
def ingest_book():
    urls = get_all_urls(SITEMAP_URL)

    create_collection()

    global_id = 1

    for url in urls:
        print("\nProcessing:", url)
        text = extract_text_from_url(url)

        if not text:
            continue

        chunks = chunk_text(text)

        for ch in chunks:
            if ch.strip():  # Only process non-empty chunks
                save_chunk_to_qdrant(ch, global_id, url)
                print(f"Saved chunk {global_id} (length: {len(ch)})")
                global_id += 1
            else:
                print(f"Skipping empty chunk for URL: {url}")

    print("\n✔️ Ingestion completed!")
    print("Total chunks stored:", global_id - 1)


if __name__ == "__main__":
    ingest_book()