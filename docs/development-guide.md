# Development Guide

This guide is intended for developers contributing to the Physical AI & Humanoid Robotics textbook project.

## Getting Started

Follow the steps in [Getting Started](getting-started.md) to set up your local development environment.

## Project Structure

Review the [Architecture Overview](architecture.md) to understand the project structure and components.

## Development Workflow

### 1. Code Style & Conventions

- **Backend (Python)**: Follow PEP 8 style guide
- **Frontend (JavaScript/TypeScript)**: Use ESLint with the project's configuration
- **Documentation (Markdown)**: Use standard Markdown formatting

### 2. Branch Naming

- Use the format: `{issue-number}-{short-description}`
  - Example: `12-add-authentication`, `23-fix-navigation-bug`

### 3. Commits

- Use conventional commits format: `<type>: <description>`
  - Examples:
    - `feat: add RAG chatbot functionality`
    - `fix: resolve issue with content search`
    - `docs: update API documentation`

### 4. Code Review Process

- Submit a pull request to the `main` branch
- Ensure all tests pass before requesting review
- Assign reviewers to examine your changes
- Address feedback promptly and make requested changes
- Squash commits if necessary before merging

## Development Practices

### Backend Development (FastAPI)

1. **API Endpoints**: Place new endpoints in appropriate modules in `backend/src/api/`
2. **Services**: Business logic should be placed in `backend/src/services/`
3. **Models**: Database models in `backend/src/models/`
4. **Utilities**: Helper functions in `backend/src/utils/`
5. **Testing**: Write tests for services in the `backend/tests/` directory

### Frontend Development (Docusaurus/React)

1. **Components**: Create new components in `textbook/src/components/`
2. **Pages**: Standalone pages go in `textbook/src/pages/`
3. **CSS**: Add styles to `textbook/src/css/custom.css` or component-specific CSS modules
4. **Documentation**: Add or update markdown files in `textbook/docs/`
5. **Testing**: Docusaurus provides built-in MDX validation

### Database Schema Changes

1. Use Alembic for database migrations
2. Create migration files for any schema changes
3. Update models in `backend/src/models/` to reflect schema changes
4. Test migrations in a development environment before applying to production

## Testing

### Backend Tests

Run backend tests using pytest:

```bash
cd backend
python -m pytest
```

### Frontend Testing

Docusaurus provides built-in capabilities for MDX validation:

```bash
cd textbook
npm run build
```

### API Testing

Use the built-in FastAPI documentation at `/docs` to test API endpoints, or use tools like Postman.

## Performance Optimization

### Backend
- Implement caching for frequently accessed data
- Optimize database queries using indexes and eager loading
- Use pagination for large datasets
- Monitor slow queries using the performance utilities

### Frontend
- Use ideal image plugin for optimized image loading
- Implement lazy loading where appropriate
- Minimize bundle sizes by optimizing dependencies

## Debugging

### Backend Debugging
- Use the `logging` module for debugging information
- Enable debug mode by setting `DEBUG=true` in the environment
- Check application logs for error information

### Frontend Debugging
- Use browser developer tools to inspect elements and network requests
- Check browser console for JavaScript errors
- Use React developer tools for component inspection

## Troubleshooting Common Issues

### API Requests Fail
1. Check that the backend server is running
2. Verify that the correct API endpoints are being called
3. Check the browser or server logs for error messages

### Slow Performance
1. Enable the performance monitoring tools
2. Check for uncached API endpoints
3. Verify that database queries are optimized

### Build Fails
1. Check that all dependencies are installed
2. Verify that there are no syntax errors in the code
3. Check the build logs for specific error messages

## Deployment

See the [Deployment Guide](deployment.md) for instructions on deploying the application.

## Contribution Guidelines

1. Check the project board for available issues
2. Fork the repository and create a feature branch
3. Follow the development practices outlined above
4. Create comprehensive tests for your changes
5. Submit a pull request with a clear description of the changes