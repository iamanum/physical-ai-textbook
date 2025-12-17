# Getting Started with the Physical AI & Humanoid Robotics Textbook

This guide will help you get started with the Physical AI & Humanoid Robotics textbook project.

## Prerequisites

- Node.js (version 18 or higher)
- Python (version 3.11 or higher)
- Docker and Docker Compose
- An OpenAI API key
- (Optional) Qdrant API key if using hosted Qdrant

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-organization/physical-ai-textbook.git
cd physical-ai-textbook
```

### 2. Environment Configuration

Create a `.env` file in the root directory with your API keys:

```bash
# Copy the example file
cp .env.example .env

# Edit the file with your actual keys
OPENAI_API_KEY=your_openai_api_key_here
QDRANT_URL=your_qdrant_url_here  # Default for Docker setup
QDRANT_API_KEY=your_qdrant_api_key_here  # If using hosted Qdrant
DATABASE_URL=postgresql://textbook_user:textbook_password@db:5432/textbook_db
```

### 3. Initialize the Development Environment

Use Docker Compose to set up all services:

```bash
# Start all services (Docusaurus frontend, FastAPI backend, Qdrant, PostgreSQL)
docker-compose up --build
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

### Running Services Separately

If you prefer to run services separately:

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

## First Steps

1. Explore the textbook chapters via the navigation menu
2. Try out the RAG chatbot functionality to ask questions about the textbook content
3. Use the search functionality to find relevant content
4. Modify existing chapters or add new content to the textbook

## Next Steps

- Review the [Architecture Overview](architecture.md) to understand the project structure
- Check the [API Reference](api-reference.md) for backend endpoints
- Look at the [Development Guide](development-guide.md) for contribution guidelines