# For Dockerized deployments
FROM node:18-alpine AS textbook-build
WORKDIR /app/textbook
COPY textbook/package*.json ./
RUN npm ci
COPY textbook/ ./
RUN npm run build

# Backend stage
FROM python:3.11-slim AS backend
WORKDIR /app/backend
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

# Production image combining both
FROM python:3.11-slim
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy backend
COPY --from=backend /app/backend /app/backend
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# Copy built textbook
COPY --from=textbook-build /app/textbook/build /app/textbook/build

WORKDIR /app/backend
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]