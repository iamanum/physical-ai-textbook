# Deployment

This guide provides instructions for deploying the Physical AI & Humanoid Robotics textbook application.

## Prerequisites

- Git
- Docker and Docker Compose
- Access to a server with at least 2GB RAM and 5GB disk space
- SSL certificate (for HTTPS)
- Domain name pointing to your server

## Docker-based Deployment

The recommended deployment method uses Docker Compose to orchestrate all services.

### 1. Server Setup

1. **Install Docker and Docker Compose**:
   ```bash
   # Update package index
   sudo apt update
   
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   
   # Install Docker Compose Plugin
   sudo apt install docker-compose-plugin
   ```

2. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-organization/physical-ai-textbook.git
   cd physical-ai-textbook
   ```

3. **Configure Environment Variables**:
   ```bash
   cp .env.example .env
   nano .env  # Edit with your actual configuration
   ```

### 2. Environment Configuration

Edit the `.env` file with your specific configuration:

```
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Qdrant Configuration
QDRANT_URL=http://qdrant:6333
QDRANT_API_KEY=your_qdrant_api_key_here

# Database Configuration
DATABASE_URL=postgresql://textbook_user:textbook_password@db:5432/textbook_db

# Backend Configuration
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000

# Frontend Configuration
FRONTEND_HOST=0.0.0.0
FRONTEND_PORT=3000

# Security
SECRET_KEY=your_secret_key_here
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
```

### 3. Docker Compose Configuration

Adjust the `docker-compose.yml` file if needed for your specific server configuration:

```yaml
version: '3.8'

services:
  textbook:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    volumes:
      - ./textbook:/app/textbook
    working_dir: /app/textbook
    command: npm start
    environment:
      - CHOKIDAR_USEPOLLING=true

  backend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    volumes:
      - ./backend:/app/backend
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - QDRANT_URL=${QDRANT_URL}
      - QDRANT_API_KEY=${QDRANT_API_KEY}
      - DATABASE_URL=${DATABASE_URL}
    depends_on:
      - qdrant
      - db

  qdrant:
    image: qdrant/qdrant:latest
    ports:
      - "6333:6333"
      - "6334:6334"
    volumes:
      - qdrant_data:/qdrant_data

  db:
    image: postgres:15
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: textbook_db
      POSTGRES_USER: textbook_user
      POSTGRES_PASSWORD: textbook_password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  qdrant_data:
  postgres_data:
```

### 4. Deployment

1. **Build and Start Services**:
   ```bash
   docker-compose up --build -d
   ```

2. **Verify the Deployment**:
   ```bash
   # Check running containers
   docker-compose ps
   
   # View logs to ensure services started properly
   docker-compose logs -f
   ```

3. **Initialize the Database**:
   ```bash
   # Run database migrations
   docker-compose exec backend python -m alembic upgrade head
   
   # Populate vector database with textbook content (if not done automatically)
   docker-compose exec backend python scripts/vectorize.py
   ```

## Reverse Proxy Setup (Nginx)

For production, set up Nginx as a reverse proxy with SSL:

1. **Install Nginx**:
   ```bash
   sudo apt install nginx certbot python3-certbot-nginx
   ```

2. **Configure Nginx**:
   ```bash
   sudo nano /etc/nginx/sites-available/textbook
   ```

3. **Add Server Configuration**:
   ```
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
       
       location /api {
           proxy_pass http://localhost:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

4. **Enable the Site**:
   ```bash
   sudo ln -s /etc/nginx/sites-available/textbook /etc/nginx/sites-enabled
   sudo nginx -t
   sudo systemctl restart nginx
   ```

5. **Obtain SSL Certificate**:
   ```bash
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

## GitHub Pages Deployment (Frontend Only)

To deploy only the documentation/frontend to GitHub Pages:

1. **Build the Frontend**:
   ```bash
   cd textbook
   npm run build
   ```

2. **Deploy to GitHub Pages**:
   - Enable GitHub Pages in your repository settings
   - Choose the `gh-pages` branch
   - The build output is in the `build/` directory

## Updating the Deployment

1. **Pull Latest Changes**:
   ```bash
   git pull origin main
   ```

2. **Rebuild and Restart Containers**:
   ```bash
   docker-compose down
   docker-compose up --build -d
   ```

## Monitoring and Maintenance

### Logs

Monitor the application logs:
```bash
# View all logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend
docker-compose logs -f textbook
```

### Backup

Regularly backup your databases:
```bash
# Backup PostgreSQL
docker-compose exec db pg_dump -U textbook_user textbook_db > backup-$(date +%Y%m%d).sql

# Backup Qdrant (stop service first)
docker-compose stop qdrant
sudo tar -czvf qdrant_backup_$(date +%Y%m%d).tar.gz /path/to/qdrant_data
docker-compose start qdrant
```

### Performance Monitoring

Access the performance monitoring dashboard at:
```
http://yourdomain.com:8001/metrics
```

## Troubleshooting

### Common Issues

1. **Application Won't Start**:
   - Check Docker logs: `docker-compose logs -f`
   - Verify environment variables in `.env` file
   - Ensure all required services are running: `docker-compose ps`

2. **Slow Performance**:
   - Check resource usage: `docker stats`
   - Verify that caching is configured properly
   - Consider upgrading your server resources

3. **Connection Issues**:
   - Verify firewall settings allow required ports (80, 443, and optionally 8001 for metrics)
   - Check that your domain properly resolves to the server IP
   - Ensure SSL certificates are valid and correctly configured

### Health Checks

Regular health checks are available at:
- Backend: `http://yourdomain.com/api/v1/health`
- Frontend: `http://yourdomain.com/`

## Scaling

For high-traffic deployments:
- Use a managed PostgreSQL service instead of a container
- Deploy multiple instances of backend services behind a load balancer
- Use CDN for static assets
- Consider implementing additional caching layers