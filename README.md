# Physical AI & Humanoid Robotics Textbook with RAG Chatbot

This repository implements a Retrieval-Augmented Generation (RAG) chatbot system for a Physical AI & Humanoid Robotics textbook. The system combines a Docusaurus-based frontend with a FastAPI backend to enable users to ask questions about textbook content and receive AI-generated answers based on the specific textbook material.

## Features

- Interactive textbook with Docusaurus frontend
- AI-powered Q&A chatbot with context from textbook content
- Semantic search using vector embeddings
- Session management and conversation history
- Responsive design for multiple device sizes
- Integration with Google's Gemini API for embeddings and language models

## Architecture

The system consists of multiple components working together:

```
┌─────────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│   Textbook      │    │   FastAPI        │    │   PostgreSQL    │
│   Frontend      │───▶│   Backend        │───▶│   Database      │
│                 │    │                  │    │ (Optional)      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
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

- **Frontend**: Docusaurus-based textbook interface with integrated chat UI
- **Backend**: FastAPI service handling RAG logic and API requests
- **PostgreSQL**: Stores metadata about textbook chapters, content blocks, and user sessions (Optional: can be disabled)
- **Qdrant**: Vector database storing embeddings for semantic similarity search (Essential)
- **Google Gemini APIs**: Used for generating embeddings and for the language model in the chatbot

## Technology Stack

- **Frontend**: React, Docusaurus, JavaScript/TypeScript
- **Backend**: Python, FastAPI, Pydantic
- **Vector DB**: Qdrant (Required for RAG functionality)
- **SQL DB**: PostgreSQL (Optional for metadata, sessions, and feedback)
- **AI/ML**: Google Gemini API (embeddings and language model)
- **Infrastructure**: Docker, Docker Compose

## Prerequisites

- Node.js (v18 or higher)
- Python (v3.11 or higher)
- Docker and Docker Compose
- Google API key

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-organization/physical-ai-textbook.git
cd physical-ai-textbook
```

### 2. Environment Configuration

Create a `.env` file in the project root with your API keys:

```bash
# Copy the example file
cp .env.example .env

# Edit the file with your actual keys
GOOGLE_API_KEY=your_google_api_key_here
QDRANT_URL=http://qdrant:6333  # Default for Docker setup
QDRANT_API_KEY=your_qdrant_api_key_here  # If using hosted Qdrant
DATABASE_URL=postgresql://textbook_user:textbook_password@db:5432/textbook_db
USE_POSTGRESQL=true  # Set to "false" to disable PostgreSQL for simplified operation
```

### 3. Initialize the Development Environment

Use Docker Compose to set up all services:

```bash
# Start all services (Docusaurus frontend, FastAPI backend, Qdrant, PostgreSQL)
docker-compose up --build
```

Wait for all services to start. The frontend will be available at `http://localhost:3000` and the backend API at `http://localhost:8000`.

## Running the Application

### Development Mode

To work with the application in development mode:

1. Start all services with Docker Compose:
   ```bash
   docker-compose up
   ```

2. Access the textbook at `http://localhost:3000`
3. Access the API documentation at `http://localhost:8000/docs`

### Adding New Textbook Content

To add new chapters to the textbook:

1. Create a new Markdown file in the `textbook/docs/` directory
2. Add the file to the `textbook/sidebars.js` configuration
3. Rebuild the vector database with the new content:
   ```bash
   # From the project root
   python scripts/vectorize.py
   ```

## API Endpoints

The backend API provides the following endpoints:

- `GET /api/v1/chapters/` - Get a list of all textbook chapters
- `GET /api/v1/chapters/{chapter_id}` - Get a specific chapter's metadata
- `GET /api/v1/chapters/{chapter_id}/content` - Get a specific chapter's content
- `GET /api/v1/chapters/slug/{slug}` - Get a specific chapter by slug
- `GET /api/v1/chapters/slug/{slug}/content` - Get a specific chapter's content by slug
- `POST /api/v1/chat/` - Ask questions about the textbook content
- `GET /api/v1/search/` - Search through textbook content

## Configuration

The system uses environment variables for configuration. You can make PostgreSQL optional by setting the USE_POSTGRESQL environment variable:

```
# Google API Configuration
GOOGLE_API_KEY=your_google_api_key_here

# Qdrant Configuration (Required for RAG functionality)
QDRANT_URL=http://qdrant:6333
QDRANT_API_KEY=your_qdrant_api_key_here

# Database Configuration (Optional - set to false to disable)
DATABASE_URL=postgresql://textbook_user:textbook_password@db:5432/textbook_db
USE_POSTGRESQL=true

# Backend Configuration
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000

# Frontend Configuration
FRONTEND_HOST=0.0.0.0
FRONTEND_PORT=3000
```

When `USE_POSTGRESQL` is set to "false", the system will operate without PostgreSQL. This means:
- Session management will be simplified (no persistent sessions)
- No storage of conversation history
- No persistent feedback storage
- The core RAG functionality (question answering based on textbook content) will still work

## Project Structure

```
physical-ai-textbook/
├── textbook/                 # Docusaurus frontend
│   ├── docs/                 # Textbook content (Markdown)
│   ├── src/                  # Custom components and styling
│   ├── static/               # Static assets
│   ├── package.json          # Frontend dependencies
│   └── docusaurus.config.js  # Docusaurus configuration
├── backend/                  # FastAPI backend
│   ├── src/                  # Backend source code
│   │   ├── models/           # Database models
│   │   ├── services/         # Business logic
│   │   ├── api/              # API endpoints
│   │   └── lib/              # Utility functions
│   ├── requirements.txt      # Python dependencies
│   └── main.py               # FastAPI application entry point
├── scripts/                  # Utility scripts
│   └── vectorize.py          # Content vectorization script
├── vector-db/                # Vector database configuration
├── deployment/               # Deployment configurations
├── specs/                    # Feature specifications
└── docker-compose.yml        # Docker configuration
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## Deployment

The textbook is deployed to GitHub Pages for public access. Follow these steps to deploy or redeploy:

1. Ensure GitHub Pages is enabled in your repository settings
2. The deployment will happen automatically when changes are pushed to the `main` branch
3. Your site will be available at: `https://[your-username].github.io/[repository-name]`

For this repository, the textbook will be available at: `https://MuhammadTayyab8.github.io/hackathon-1`

For detailed deployment instructions, see the [GitHub Pages Deployment Guide](deployment/github-actions/README.md).

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions, please file an issue in the GitHub repository.