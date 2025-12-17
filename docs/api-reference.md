# API Reference

This document provides a comprehensive reference for the Physical AI & Humanoid Robotics textbook API.

## Base URL

```
https://your-domain.com/api/v1
```

For local development, the base URL is:
```
http://localhost:8000/api/v1
```

## Authentication

Most endpoints do not require authentication, however, the backend may use API keys for external services like OpenAI internally. Requests to the backend should not require explicit authentication.

## Endpoints

### Chapters

#### Get All Chapters

- **Endpoint**: `GET /chapters/`
- **Description**: Retrieve a list of all textbook chapters
- **Parameters**:
  - `skip` (optional, int): Number of chapters to skip (default: 0)
  - `limit` (optional, int): Maximum number of chapters to return (default: 100)
- **Response**:
```json
{
  "chapters": [
    {
      "id": "string (UUID)",
      "title": "string",
      "slug": "string",
      "order": "int",
      "section": "string (nullable)",
      "word_count": "int",
      "reading_time": "int"
    }
  ],
  "total": "int"
}
```

#### Get Chapter by ID

- **Endpoint**: `GET /chapters/{chapter_id}`
- **Description**: Retrieve a specific textbook chapter by its ID
- **Parameters**:
  - `chapter_id` (path): Unique identifier of the chapter (UUID)
- **Response**:
```json
{
  "id": "string (UUID)",
  "title": "string",
  "slug": "string",
  "order": "int",
  "section": "string (nullable)",
  "word_count": "int",
  "reading_time": "int"
}
```

#### Get Chapter Content by ID

- **Endpoint**: `GET /chapters/{chapter_id}/content`
- **Description**: Retrieve the full content of a specific textbook chapter
- **Parameters**:
  - `chapter_id` (path): Unique identifier of the chapter (UUID)
- **Response**:
```json
{
  "id": "string (UUID)",
  "title": "string",
  "slug": "string",
  "order": "int",
  "section": "string (nullable)",
  "word_count": "int",
  "reading_time": "int",
  "content": "string (Markdown content)"
}
```

#### Get Chapter by Slug

- **Endpoint**: `GET /chapters/slug/{slug}`
- **Description**: Retrieve a specific textbook chapter by its slug
- **Parameters**:
  - `slug` (path): URL-friendly identifier of the chapter
- **Response**:
```json
{
  "id": "string (UUID)",
  "title": "string",
  "slug": "string",
  "order": "int",
  "section": "string (nullable)",
  "word_count": "int",
  "reading_time": "int"
}
```

#### Get Chapter Content by Slug

- **Endpoint**: `GET /chapters/slug/{slug}/content`
- **Description**: Retrieve the full content of a specific textbook chapter by its slug
- **Parameters**:
  - `slug` (path): URL-friendly identifier of the chapter
- **Response**:
```json
{
  "id": "string (UUID)",
  "title": "string",
  "slug": "string",
  "order": "int",
  "section": "string (nullable)",
  "word_count": "int",
  "reading_time": "int",
  "content": "string (Markdown content)"
}
```

### Chat (RAG)

#### Submit Question to Chat

- **Endpoint**: `POST /chat/`
- **Description**: Submit a question to the RAG system and receive an AI-generated answer
- **Request Body**:
```json
{
  "question": "string",
  "session_id": "string",
  "context": {
    "selectedText": "string (optional)",
    "chapterId": "string (optional)"
  }
}
```
- **Response**:
```json
{
  "id": "string",
  "questionId": "string",
  "answer": "string",
  "sources": [
    {
      "contentId": "string",
      "chapter": "string",
      "url": "string",
      "position": "int",
      "excerpt": "string"
    }
  ],
  "confidence": "float",
  "timestamp": "string (ISO 8601 datetime)"
}
```

#### Submit Chat Feedback

- **Endpoint**: `POST /chat/feedback`
- **Description**: Submit feedback on a chat response
- **Request Body**:
```json
{
  "responseId": "string",
  "rating": "int (1-5)",
  "comment": "string (optional)"
}
```
- **Response**:
```json
{
  "status": "string",
  "message": "string"
}
```

### Search

#### Search Textbook

- **Endpoint**: `GET /search/`
- **Description**: Search for content within the textbook
- **Parameters**:
  - `q` (query): Search query string (required, 1-200 characters)
  - `limit` (query, optional): Maximum number of results (1-50, default: 10)
  - `chapter_id` (query, optional): Limit search to specific chapter
- **Response**:
```json
{
  "query": "string",
  "results": [
    {
      "id": "string",
      "title": "string",
      "chapter": "string",
      "excerpt": "string",
      "relevance": "float",
      "url": "string"
    }
  ],
  "totalResults": "int",
  "searchId": "string"
}
```

#### Advanced Search

- **Endpoint**: `POST /search/advanced`
- **Description**: Advanced search with more options
- **Request Body**:
```json
{
  "query": "string",
  "limit": "int (optional)",
  "chapter_id": "string (optional)"
}
```
- **Response**:
```json
{
  "query": "string",
  "results": [
    {
      "id": "string",
      "title": "string",
      "chapter": "string",
      "excerpt": "string",
      "relevance": "float",
      "url": "string"
    }
  ],
  "totalResults": "int",
  "searchId": "string"
}
```

#### Re-index Content

- **Endpoint**: `POST /search/reindex`
- **Description**: Re-index textbook content for improved search (admin only)
- **Parameters**:
  - `chapter_id` (optional, query): Re-index only a specific chapter
- **Response**:
```json
{
  "status": "string",
  "message": "string",
  "details": {
    "total_chapters": "int",
    "successful": "int",
    "failed": "array",
    "details": "array"
  }
}
```

### Health Check

#### API Health

- **Endpoint**: `GET /health`
- **Description**: Check the health of the API
- **Response**:
```json
{
  "status": "string",
  "service": "string"
}
```

## Error Responses

All API endpoints return structured error responses in the following format:

```json
{
  "error": {
    "type": "string",
    "code": "string or number",
    "message": "string",
    "details": "any (optional)"
  }
}
```

### Common Error Codes

- `400 Bad Request`: Invalid request parameters or body
- `404 Not Found`: Requested resource does not exist
- `500 Internal Server Error`: Unexpected server error

## Request/Response Examples

### Example Chat Request:

```curl
curl -X POST http://localhost:8000/api/v1/chat/ \\
  -H "Content-Type: application/json" \\
  -d '{
    "question": "What are the key principles of humanoid robot locomotion?",
    "session_id": "session-12345",
    "context": {
      "selectedText": "In dynamic walking, the center of mass moves outside the support polygon",
      "chapterId": "chapter-uuid-here"
    }
  }'
```

### Example Search Request:

```curl
curl "http://localhost:8000/api/v1/search/?q=locomotion&limit=5"
```

## Common Headers

- `Content-Type: application/json` (for POST requests)