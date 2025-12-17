# Troubleshooting

This guide provides solutions to common issues faced while setting up and running the Physical AI & Humanoid Robotics textbook project.

## Common Setup Issues

### Node.js/NPM Installation

**Problem**: Node.js version is incompatible.
**Solution**: Ensure you have Node.js version 18 or higher installed. Update using your package manager or download from nodejs.org.

**Problem**: NPM packages fail to install.
**Solution**: 
1. Clear NPM cache: `npm cache clean --force`
2. Delete `node_modules` and `package-lock.json` in the textbook directory
3. Run `npm install` again

### Python Environment Issues

**Problem**: Python version is incompatible.
**Solution**: Ensure you have Python 3.11 or higher installed. Check with `python --version` or `python3 --version`.

**Problem**: Python dependencies fail to install.
**Solution**: 
1. Create a fresh virtual environment: `python -m venv venv`
2. Activate it: `source venv/bin/activate` (Linux/Mac) or `venv\Scripts\activate` (Windows)
3. Upgrade pip: `pip install --upgrade pip`
4. Install dependencies: `pip install -r requirements.txt`

### Docker Issues

**Problem**: Docker won't start.
**Solution**: Check if Docker service is running:
- Linux: `sudo systemctl status docker` and start with `sudo systemctl start docker`
- Mac/Windows: Start Docker Desktop application

**Problem**: Docker Compose fails to build.
**Solution**:
1. Clear Docker cache: `docker system prune -a`
2. Make sure no other processes are using Docker
3. Try building again: `docker-compose build`

## API Related Issues

### 500 Internal Server Error

**Problem**: API returns 500 errors.
**Solution**:
1. Check backend logs: `docker-compose logs backend`
2. Verify environment variables are set correctly
3. Ensure PostgreSQL and Qdrant services are running

### 404 Not Found Errors

**Problem**: API endpoints return 404.
**Solution**:
1. Verify the API server is running on port 8000
2. Check that you're using the correct base URL: `http://localhost:8000/api/v1/`
3. Verify the endpoint exists in the FastAPI documentation at `/docs`

### Database Connection Errors

**Problem**: Cannot connect to database.
**Solution**:
1. Check if PostgreSQL service is up: `docker-compose ps`
2. Verify database connection string in `.env` file
3. Ensure database migrations are run: `docker exec backend python -m alembic upgrade head`

## Frontend Issues

### Docusaurus Build Fails

**Problem**: `npm run build` fails with errors.
**Solution**:
1. Verify node version is compatible
2. Check that all dependencies are installed: `npm install`
3. Clear build cache: `npx docusaurus clear`
4. Check for syntax errors in markdown files

### Page Doesn't Load

**Problem**: Frontend page is blank or shows errors.
**Solution**:
1. Check browser console for JavaScript errors
2. Verify that the API is accessible
3. Clear browser cache and hard-refresh the page (Ctrl+F5 or Cmd+Shift+R)
4. Verify that API endpoints are properly configured

### Images Not Loading

**Problem**: Images fail to load in the textbook.
**Solution**:
1. Check image paths in markdown files
2. Verify images are in the proper location (`textbook/static/img/`)
3. Ensure image files are valid and not corrupted

## RAG and AI Functionality Issues

### OpenAI API Errors

**Problem**: Errors related to OpenAI API.
**Solution**:
1. Verify your OpenAI API key is correct in the `.env` file
2. Check that your OpenAI account has sufficient credits
3. Verify that the API is enabled on your OpenAI account
4. Check OpenAI's status page for service disruptions

### RAG Responses are Poor Quality

**Problem**: AI responses are irrelevant or low quality.
**Solution**:
1. Verify that content has been properly vectorized: `python scripts/vectorize.py`
2. Ensure embeddings are correctly computed
3. Check that retrieved context is relevant to the query
4. Consider adjusting the similarity threshold in vector search

### Search Returns No Results

**Problem**: Search functionality returns no results.
**Solution**:
1. Ensure content has been indexed in Qdrant: `docker-compose logs qdrant`
2. Verify that vectorization script has run successfully
3. Check that search parameters are correct
4. Verify that chapter slugs and IDs match between PostgreSQL and search index

## Performance Issues

### Slow Page Load Times

**Problem**: Pages take too long to load.
**Solution**:
1. Check for uncached API endpoints
2. Optimize database queries
3. Minimize bundle sizes
4. Use performance monitoring tools to identify bottlenecks

### API Response Times

**Problem**: API endpoints take too long to respond.
**Solution**:
1. Check database query performance
2. Verify caching is working properly
3. Monitor system resources (CPU, memory)
4. Check network latency to external services (OpenAI, Qdrant)

## Common Error Messages

### Database Errors

- **Error**: `FATAL: password authentication failed`
  **Cause**: Incorrect database credentials
  **Solution**: Verify the DATABASE_URL in `.env` file

- **Error**: `FATAL: database "textbook_db" does not exist`
  **Solution**: Run database migrations: `docker-compose exec backend python -m alembic upgrade head`

### Backend Errors

- **Error**: `sslmode value "require" invalid when no SSL support`
  **Solution**: Ensure your PostgreSQL client library supports SSL, or change the connection string

- **Error**: `ModuleNotFoundError: No module named 'xyz'`
  **Solution**: Install dependencies: `pip install -r requirements.txt`

### Frontend Errors

- **Error**: `TypeError: Cannot read property 'x' of undefined`
  **Solution**: Check component props and API responses in browser console

- **Error**: `Error: Parse Error: Line X: Unexpected token`
  **Solution**: Check for syntax errors in MDX files

## Debugging Tips

### Backend Debugging

1. Enable debug logging: `DEBUG=1` in environment variables
2. Check application logs: `docker-compose logs -f backend`
3. Use print statements or Python debugger (pdb) for detailed tracing

### Frontend Debugging

1. Use browser developer tools to inspect elements and network requests
2. Check console for JavaScript errors
3. Inspect network tab to see API requests and responses
4. Use React Developer Tools extension for component inspection

## Getting Help

If you encounter an issue not listed here:

1. Check GitHub Issues: Look for existing reports of your problem
2. Search the documentation for relevant topics
3. Create a detailed issue report on GitHub:
   - Include steps to reproduce
   - Include error messages and logs
   - Specify your environment (OS, versions of tools)
   - Include any custom configurations

### Issue Report Template

When creating an issue, include:

```
Environment:
- OS: [e.g., macOS 12.4, Ubuntu 20.04]
- Node.js version: [e.g., 18.12.0]
- Python version: [e.g., 3.11.0]
- Docker version: [e.g., 20.10.21]
- Browser: [e.g., Chrome 119]

Steps to reproduce:
1. [First step]
2. [Second step]
3. [Additional steps...]

Expected behavior:
[What you expected to happen]

Actual behavior:
[What actually happened]

Error messages/logs:
[Copy any relevant error messages or logs]

Additional context:
[Any other relevant information]
```