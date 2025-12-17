# RAG Chatbot System Architecture and Process Guide

## Table of Contents
1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Frontend Components](#frontend-components)
4. [Backend Components](#backend-components)
5. [Database Systems](#database-systems)
6. [RAG Process Flow](#rag-process-flow)
7. [How the Chatbot Works](#how-the-chatbot-works)
8. [Deployment and Setup](#deployment-and-setup)

## Overview

This project implements a Retrieval-Augmented Generation (RAG) chatbot system for a Physical AI & Humanoid Robotics textbook. The system combines a Docusaurus-based frontend, a FastAPI backend, and multiple databases to enable users to ask questions about textbook content and receive AI-generated answers based on the specific textbook material.

## System Architecture

```
┌─────────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│   Frontend (React)  │    │   FastAPI        │    │   PostgreSQL        │
│   (Docusaurus)      │───▶│   Backend        │───▶│   Metadata DB       │
│                     │    │                  │    │                     │
└─────────────────────┘    └──────────────────┘    └─────────────────────┘
         │                         │    ▲                      │
         │                         │    │                      │
         │                         ▼    │                      │
         │                    ┌─────────────┐                  │
         │                    │   Qdrant    │                  │
         │                    │ Vector DB   │                  │
         │                    └─────────────┘                  │
         │                         │                           │
         │                         │                           │
         └─────────────────────────┴───────────────────────────┘
```

**Key Components:**
- **Frontend**: Docusaurus-based React application that renders textbook content and includes the chat interface
- **Backend**: FastAPI service that handles the RAG logic and API requests
- **PostgreSQL**: Stores metadata about textbook chapters, content blocks, and user sessions
- **Qdrant**: Vector database that stores embeddings for semantic search
- **Google Gemini API**: Used for generating embeddings and for the language model in the chatbot

## Frontend Components

The frontend is built with Docusaurus, a modern static site generator optimized for documentation and educational content.

### Key Frontend Files:
- `textbook/docs/`: Contains all textbook content in Markdown format
- `textbook/src/components/ChatInterface.js`: React component for the chat interface
- `textbook/docusaurus.config.js`: Configuration for the Docusaurus site
- `textbook/sidebars.js`: Navigation structure for the textbook

### ChatInterface.js:
- Allows users to type questions about the textbook content
- Detects selected text on the page to provide context
- Makes API calls to the backend `/api/v1/chat/` endpoint
- Displays AI-generated responses with source citations
- Provides feedback buttons (👍/👎) for quality assessment

### Key Frontend Features:
- Responsive design that works on desktop, tablet, and mobile
- Textbook content with proper navigation and search
- Real-time chat interface integrated into textbook pages
- Context awareness (users can ask questions about selected text)

## Backend Components

The backend is built with FastAPI, which provides high-performance APIs with automatic documentation.

### Key Backend Files:
- `backend/main.py`: FastAPI application entry point
- `backend/src/api/`: API route definitions
  - `chapters.py`: Endpoints for textbook chapter content
  - `chat.py`: Chat and RAG functionality endpoints
  - `search.py`: Search functionality endpoints
- `backend/src/services/`: Business logic implementation
  - `rag_service.py`: Core RAG pipeline coordination
  - `embedding_service.py`: Text embedding generation
  - `vector_search.py`: Qdrant vector database operations
  - `qa_service.py`: Question answering logic
  - `response_service.py`: Response formatting and management

### Chat API (chat.py):
- Handles POST requests to `/api/v1/chat/`
- Validates user input and session information
- Calls the RAG service to process the question
- Returns structured responses with answers and sources

### Key Backend Features:
- Input validation and sanitization
- Session management
- Error handling and logging
- Integration with multiple external services (Google Gemini, Qdrant)

## Database Systems

### PostgreSQL (Metadata Storage)
- Stores textbook chapter information
- Maintains user sessions and conversation history
- Keeps track of content block metadata
- Stores feedback data for quality improvement

### Qdrant (Vector Database)
- Stores text embeddings for semantic search
- Enables semantic similarity matching
- Houses content blocks with their vector representations
- Provides fast vector search capabilities

#### Content Processing:
1. Textbook content is chunked into smaller blocks
2. Each block is converted to a vector embedding using Google's Gemini API
3. Embeddings are stored in Qdrant with metadata
4. When users ask questions, their query is embedded and compared against stored vectors

## RAG Process Flow

The Retrieval-Augmented Generation (RAG) process follows these steps:

### 1. Content Indexing (One-time Process)
```
Textbook Content (Markdown) → Chunking → Embedding → Storage in Qdrant
```

1. **Content Loading**: Textbook content from `textbook/docs/` is loaded
2. **Chunking**: Content is broken into smaller, searchable blocks using `content_processor.py`
3. **Embedding**: Each content block is converted to a vector embedding using Google's embedding-001 model
4. **Storage**: Embeddings and metadata are stored in Qdrant with content IDs, chapter information, etc.

### 2. Question Processing (Real-time Process)
```
User Question → Embedding → Vector Search → Answer Generation → Response
```

1. **Question Reception**: User submits a question through the chat interface
2. **Input Validation**: Question is validated and sanitized
3. **Embedding**: Question text is converted to a vector embedding
4. **Vector Search**: Qdrant is queried for content blocks with similar embeddings
5. **Context Assembly**: Relevant content blocks are retrieved and formatted as context
6. **Answer Generation**: Google's Gemini language model generates an answer based on the question and context
7. **Response Formatting**: Answer is formatted with sources and returned to the user

### 3. Context-Aware Processing
- The system can use selected text as additional context
- Users can ask questions about specific chapters or content sections
- Search can be limited to specific chapters if requested

## How the Chatbot Works

### User Interaction Flow:
1. **User visits the textbook website**: The Docusaurus frontend renders the textbook content
2. **User types a question**: In the chat interface, the user asks a question about the textbook content
3. **Context capture**: The system captures any selected text as additional context
4. **API request**: The frontend sends a POST request to `/api/v1/chat/` with the question and context
5. **RAG processing**: The backend processes the question through the RAG pipeline
6. **Response generation**: An AI-generated answer is created based on textbook content
7. **Response display**: The answer is displayed in the chat interface with source citations

### RAG Mechanism Explained:
The RAG (Retrieval-Augmented Generation) mechanism enhances the language model by grounding its responses in specific, relevant content from the textbook:

1. **Retrieval Phase**:
   - When a user asks a question, the system first searches for relevant content in the textbook
   - The question is converted to a vector embedding
   - This embedding is compared against all stored embeddings in Qdrant
   - The most semantically similar content chunks are retrieved

2. **Generation Phase**:
   - The retrieved content chunks are provided to the language model as context
   - The model generates an answer based on the question and this specific context
   - This ensures the response is grounded in the actual textbook content

3. **Benefits of RAG**:
   - **Factually Accurate**: Responses are based on actual textbook content
   - **Up-to-Date**: Can be updated by re-indexing new content
   - **Explainable**: Sources of information are cited in responses
   - **Controllable**: Only textbook content is used, avoiding hallucinations

### API Endpoints:
- `POST /api/v1/chat/`: Process a user question using RAG
- `POST /api/v1/chat/feedback`: Submit feedback on a response
- `GET /api/v1/chapters/`: Get list of textbook chapters
- `GET /api/v1/search/`: Search textbook content (keyword-based)

### Technology Stack:
- **Frontend**: React, Docusaurus, JavaScript/TypeScript
- **Backend**: Python, FastAPI, Pydantic
- **Vector DB**: Qdrant
- **SQL DB**: PostgreSQL
- **AI/ML**: Google Gemini API (embeddings and language model)
- **Infrastructure**: Docker, Docker Compose

## Deployment and Setup

### Local Development:
1. **Prerequisites**:
   - Node.js (v18+)
   - Python (v3.11+)
   - Docker and Docker Compose
   - Google API key

2. **Setup**:
   ```bash
   # Clone the repository
   git clone <repository-url>
   cd <repository-name>

   # Create environment file
   cp .env.example .env
   # Edit .env with your API keys

   # Start all services
   docker-compose up --build
   ```

3. **Services**:
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:8000`
   - API Documentation: `http://localhost:8000/docs`
   - Qdrant: `http://localhost:6333`

### Production Deployment:
- The frontend is deployed to GitHub Pages
- The backend can be deployed to cloud platforms (AWS, GCP, Azure)
- Databases need to be hosted on appropriate services

### Environment Variables:
- `GOOGLE_API_KEY`: Required for embeddings and language model
- `QDRANT_URL`: URL for Qdrant vector database
- `QDRANT_API_KEY`: API key for hosted Qdrant (if applicable)
- `DATABASE_URL`: Connection string for PostgreSQL database