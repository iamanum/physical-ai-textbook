#!/usr/bin/env python3
"""
Script to vectorize textbook content and store in Qdrant for RAG operations.
This script processes all the textbook markdown files and creates vector embeddings.
"""

import os
import sys
import argparse
from typing import List, Dict, Any
import logging
from pathlib import Path
import hashlib
import asyncio

# Add the backend src to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend', 'src'))

from models.database import SessionLocal, engine
from models import TextbookChapter, ContentBlock
from src.vector_db import qdrant_config
from src.config import settings
from src.lib.content_utils import extract_text_from_markdown, chunk_text, generate_content_id
from qdrant_client.http import models
from openai import OpenAI
import json

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def get_openai_client():
    """Create and return an OpenAI client"""
    if not settings.openai_api_key:
        raise ValueError("OPENAI_API_KEY environment variable is required")
    
    return OpenAI(api_key=settings.openai_api_key)

def get_text_embedding(text: str, client: OpenAI) -> List[float]:
    """Get embedding for a text using OpenAI API"""
    try:
        response = client.embeddings.create(
            input=text,
            model="text-embedding-3-small"  # Using a smaller model for efficiency
        )
        return response.data[0].embedding
    except Exception as e:
        logger.error(f"Error getting embedding for text: {e}")
        raise

def process_chapter(chapter: TextbookChapter, client: OpenAI):
    """Process a textbook chapter to extract content blocks and create embeddings"""
    logger.info(f"Processing chapter: {chapter.title}")
    
    # Extract plain text from the markdown content
    plain_text = extract_text_from_markdown(chapter.content)
    
    # Split content into chunks
    content_chunks = chunk_text(plain_text, max_chunk_size=settings.max_content_chunk_size)
    
    db = SessionLocal()
    qdrant_client = qdrant_config.get_client()
    
    try:
        content_blocks = []
        points = []
        
        for idx, chunk in enumerate(content_chunks):
            if not chunk.strip():  # Skip empty chunks
                continue
                
            # Generate embedding for the chunk
            embedding = get_text_embedding(chunk, client)
            
            # Generate a unique ID for storing in Qdrant
            content_hash = generate_content_id(chunk, f"ch{chapter.id}")
            
            # Save to database as a content block
            content_block = ContentBlock(
                chapter_id=chapter.id,
                type="paragraph",  # Simplified type for now
                content=chunk,
                position=idx,
                vector_id=content_hash
            )
            db.add(content_block)
            content_blocks.append(content_block)
            
            # Prepare point for Qdrant
            point = models.PointStruct(
                id=content_hash,
                vector=embedding,
                payload={
                    "content": chunk,
                    "chapter_id": str(chapter.id),
                    "chapter_title": chapter.title,
                    "position": idx,
                    "type": "paragraph"
                }
            )
            points.append(point)
        
        # Commit the content blocks to the database
        db.commit()
        logger.info(f"Saved {len(content_blocks)} content blocks to database for chapter: {chapter.title}")
        
        # Add points to Qdrant
        if points:
            qdrant_client.upsert(
                collection_name=qdrant_config.content_collection_name,
                points=points
            )
            logger.info(f"Added {len(points)} vectors to Qdrant for chapter: {chapter.title}")
    
    except Exception as e:
        logger.error(f"Error processing chapter {chapter.title}: {e}")
        db.rollback()
        raise
    finally:
        db.close()

def vectorize_all_content():
    """Vectorize all textbook content"""
    logger.info("Starting vectorization of all textbook content...")
    
    # Initialize OpenAI client
    client = get_openai_client()
    
    # Get all chapters from the database
    db = SessionLocal()
    try:
        chapters = db.query(TextbookChapter).all()
        logger.info(f"Found {len(chapters)} chapters to process")
        
        for chapter in chapters:
            try:
                process_chapter(chapter, client)
            except Exception as e:
                logger.error(f"Failed to process chapter {chapter.title}: {e}")
                # Continue with other chapters even if one fails
        
        logger.info("Vectorization completed successfully!")
    
    except Exception as e:
        logger.error(f"Error during vectorization: {e}")
        raise
    finally:
        db.close()

def main():
    parser = argparse.ArgumentParser(description="Vectorize textbook content for RAG operations")
    parser.add_argument(
        "--force", 
        action="store_true", 
        help="Force re-vectorization even if content is already in the database"
    )
    
    args = parser.parse_args()
    
    try:
        vectorize_all_content()
        logger.info("Vectorization process completed successfully!")
    except Exception as e:
        logger.error(f"Vectorization process failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()