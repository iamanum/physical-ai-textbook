# Quickstart Guide: AI Physical AI & Humanoid Robotics Textbook with RAG Chatbot

**Feature**: 001-ai-textbook-rag-chatbot
**Date**: 2025-12-07

## Prerequisites

Before setting up the Physical AI & Humanoid Robotics textbook with RAG chatbot, ensure your system meets the following requirements:

- **Docker** (version 20.10 or higher)
- **Docker Compose** (version 2.0 or higher)
- **Node.js** (version 18 or higher)
- **Python** (version 3.11 or higher)
- **Git**

You will also need:
- OpenAI API key for embeddings and chat functionality
- (Optional) Qdrant API key if using hosted Qdrant
- (Optional) Neon PostgreSQL connection details

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/physical-ai-textbook.git
cd physical-ai-textbook
```

### 2. Environment Configuration

Create a `.env` file in the project root with your API keys:

```bash
# .env file
OPENAI_API_KEY=your_openai_api_key_here
QDRANT_URL=your_qdrant_url_here
QDRANT_API_KEY=your_qdrant_api_key_here
NEON_DATABASE_URL=your_neon_database_url_here
```

### 3. Initialize the Development Environment

Use Docker Compose to set up all services:

```bash
# Start all services (Docusaurus frontend, FastAPI backend, Qdrant, PostgreSQL)
docker-compose up --build
```

Alternatively, set up components individually:

#### Frontend Setup (Docusaurus)

```bash
# Navigate to the textbook directory
cd textbook

# Install dependencies
npm install

# Start the Docusaurus development server
npm start
```

#### Backend Setup (FastAPI)

```bash
# Navigate to the backend directory
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn main:app --reload --port 8000
```

### 4. Initialize the Database and Vector Storage

Run the database migrations and populate the vector database with textbook content:

```bash
# From the backend directory
cd backend

# Activate your virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Run database migrations
python -m alembic upgrade head

# Populate the vector database with textbook content
python scripts/vectorize.py
```

## Running the Application

### Development Mode

To work with the application in development mode:

1. Start all services with Docker Compose:
   ```bash
   docker-compose up
   ```

2. Access the textbook at `http://localhost:3000`
3. Access the API documentation at `http://localhost:8000/docs`

### Production Mode

To run in production mode:

```bash
# Build and start production containers
docker-compose -f docker-compose.prod.yml up -d
```

## Adding New Textbook Content

To add new chapters to the textbook:

1. Create a new Markdown file in the `textbook/docs/` directory
2. Add the file to the `sidebars.js` configuration
3. Rebuild the vector database:
   ```bash
   cd backend
   # Activate virtual environment
   python scripts/vectorize.py
   ```

## Testing the RAG Functionality

1. Visit the textbook website at `http://localhost:3000`
2. Use the chatbot interface to ask questions about the textbook content
3. Verify that responses are sourced from the actual textbook content

## Troubleshooting

**Issue**: "Cannot connect to Qdrant vector database"
- **Solution**: Verify your QDRANT_URL and QDRANT_API_KEY in the `.env` file

**Issue**: "OpenAI API returns authentication error"
- **Solution**: Check that your OPENAI_API_KEY is correctly set in the `.env` file

**Issue**: "Backend service fails to start"
- **Solution**: Ensure all required environment variables are set and the database is accessible

## Next Steps

- Review the full documentation in the `docs/` directory
- Explore the API endpoints in the interactive documentation at `/docs`
- Learn about content creation and management in the `docs/content-creation.md` guide