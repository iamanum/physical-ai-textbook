# Architecture Overview

This document provides a detailed overview of the Physical AI & Humanoid Robotics textbook architecture.

## System Architecture

The Physical AI & Humanoid Robotics textbook project consists of several interconnected components:

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Textbook      │    │   FastAPI        │    │   PostgreSQL    │
│   Frontend      │───▶│   Backend        │───▶│   Database      │
│   (Docusaurus)  │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                            │    ▲
                            │    │
                            ▼    │
                       ┌─────────────┐
                       │   Qdrant    │
                       │ Vector DB   │
                       └─────────────┘
```

### Frontend (Docusaurus)

- **Framework**: Docusaurus 2.x
- **Language**: React/MDX
- **Purpose**: Serve textbook content and provide user interface
- **Directory**: `textbook/`

### Backend (FastAPI)

- **Framework**: FastAPI
- **Language**: Python 3.11+
- **Purpose**: Serve API endpoints for RAG functionality, chapter retrieval, etc.
- **Directory**: `backend/`

### Vector Database (Qdrant)

- **Technology**: Qdrant
- **Purpose**: Store vector embeddings for semantic search and RAG
- **Access**: Through Python Qdrant client

### Relational Database (PostgreSQL)

- **Technology**: PostgreSQL with Neon
- **Purpose**: Store structured metadata, user sessions, questions and responses
- **Access**: Through SQLAlchemy ORM

## Directory Structure

```
physical-ai-textbook/
├── textbook/                 # Docusaurus frontend
│   ├── docs/                 # Textbook content (Markdown)
│   ├── src/                  # Custom components and styling
│   │   ├── components/       # React components (e.g., ChatInterface)
│   │   ├── pages/            # Standalone pages (e.g., search page)
│   │   └── css/              # Custom styles
│   ├── static/               # Static assets
│   ├── package.json          # Frontend dependencies
│   └── docusaurus.config.js  # Docusaurus configuration
├── backend/                  # FastAPI backend
│   ├── src/                  # Backend source code
│   │   ├── models/           # Database models
│   │   ├── services/         # Business logic (RAG, embeddings, search)
│   │   ├── api/              # FastAPI endpoints
│   │   └── lib/              # Utility functions
│   ├── main.py               # FastAPI application entry point
│   └── requirements.txt      # Python dependencies
├── scripts/                  # Utility scripts
│   └── vectorize.py          # Content vectorization script
├── vector-db/                # Vector database configuration
├── deployment/               # Deployment configurations
└── specs/                    # Feature specifications
```

## Data Flow

### Content Creation and Storage

1. Textbook content is written in Markdown format in `textbook/docs/`
2. Content is embedded using OpenAI embeddings and stored in Qdrant vector database
3. Metadata is stored in PostgreSQL database

### RAG Query Process

1. User submits question via frontend
2. Question is sent to backend API
3. Backend retrieves embeddings for question
4. Performs semantic search in Qdrant to find relevant content
5. Uses relevant content to generate AI response
6. Response is sent back to frontend

## API Structure

### Backend Endpoints

- `GET /api/v1/chapters/` - Get a list of all textbook chapters
- `GET /api/v1/chapters/{chapter_id}` - Get a specific chapter's metadata
- `GET /api/v1/chapters/{chapter_id}/content` - Get a specific chapter's content
- `POST /api/v1/chat/` - Submit a question and receive AI-generated answer
- `GET /api/v1/search/` - Search through textbook content

### Frontend Components

- `ChatInterface.js` - Interactive chat component for asking questions
- `SearchBar.js` - Search functionality component
- Docusaurus-based documentation system

## Technologies & Libraries

### Backend
- **FastAPI**: Web framework with automatic API documentation
- **SQLAlchemy**: ORM for PostgreSQL database
- **Qdrant Client**: Vector database client
- **OpenAI**: Embeddings and language model API
- **Pydantic**: Data validation and settings management

### Frontend
- **Docusaurus**: Static site generator optimized for documentation
- **React**: Component-based UI library
- **@easyops-cn/docusaurus-search-local**: Local search functionality

## Performance Considerations

- **Caching**: Content is cached to reduce database and API calls
- **Embeddings**: Pre-computed embeddings for faster similarity search
- **Pagination**: Large datasets are paginated to improve response times
- **Compression**: API responses are compressed for faster transfers

## Security Considerations

- **Authentication**: API keys for external services stored securely
- **Input Sanitization**: User inputs are validated and sanitized
- **Rate Limiting**: API endpoints include rate limiting to prevent abuse
- **HTTPS**: All communications should be over HTTPS in production