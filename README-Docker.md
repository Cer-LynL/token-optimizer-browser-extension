# Docker Setup for Token Optimizer Extension

This document explains how to run the Token Optimizer Extension server using Docker and Docker Compose.

## Prerequisites

- Docker and Docker Compose installed on your system
- A `.env` file with your environment variables (copy from `.env.example`)

## Quick Start

### Development Environment

1. **Copy environment variables:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` file with your actual values:**
   ```bash
   # Required for Stripe integration
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   
   # Server configuration
   PORT=3000
   NODE_ENV=development
   ```

3. **Start the development server:**
   ```bash
   docker-compose up -d
   ```

4. **View logs:**
   ```bash
   docker-compose logs -f token-optimizer-server
   ```

5. **Test the server:**
   ```bash
   curl http://localhost:3000/health
   ```

### Production Environment

For production deployment with Redis and PostgreSQL:

1. **Set up production environment variables:**
   ```bash
   # Add to your .env file
   NODE_ENV=production
   POSTGRES_PASSWORD=your_secure_password
   DATABASE_URL=postgresql://postgres:your_secure_password@postgres:5432/token_optimizer
   REDIS_URL=redis://redis:6379
   ```

2. **Start production services:**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

## Available Services

### Development (`docker-compose.yml`)
- **token-optimizer-server**: Main Node.js application server
- Port: `3000`
- Includes hot-reload for development

### Production (`docker-compose.prod.yml`)
- **token-optimizer-server**: Main application server
- **redis**: Redis cache for license storage
- **postgres**: PostgreSQL database
- **nginx**: Reverse proxy (optional)

## Docker Commands

### Basic Operations
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart services
docker-compose restart

# View logs
docker-compose logs -f [service-name]

# Execute commands in container
docker-compose exec token-optimizer-server sh
```

### Development Commands
```bash
# Rebuild and start
docker-compose up --build -d

# Start with logs visible
docker-compose up

# Remove containers and volumes
docker-compose down -v
```

### Production Commands
```bash
# Start production environment
docker-compose -f docker-compose.prod.yml up -d

# Scale the application
docker-compose -f docker-compose.prod.yml up -d --scale token-optimizer-server=3

# Update production deployment
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

## Health Checks

The application includes built-in health checks:

- **Application**: `GET /health`
- **Docker health check**: Automatically monitors container health
- **Service dependencies**: Production setup includes health checks for Redis and PostgreSQL

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `STRIPE_SECRET_KEY` | Stripe secret key for payment processing | Yes | - |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret for verification | Yes | - |
| `PORT` | Server port | No | 3000 |
| `NODE_ENV` | Environment (development/production) | No | development |
| `DATABASE_URL` | PostgreSQL connection string | Production | - |
| `REDIS_URL` | Redis connection string | Production | - |
| `POSTGRES_PASSWORD` | PostgreSQL password | Production | - |

## Volumes and Data Persistence

### Development
- Source code is mounted as a volume for hot-reload
- Node modules are preserved in an anonymous volume

### Production
- `redis_data`: Persistent Redis data
- `postgres_data`: Persistent PostgreSQL data

## Networking

All services communicate through the `token-optimizer-network` bridge network:
- Services can communicate using service names as hostnames
- External access only through exposed ports

## Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   # Check what's using port 3000
   lsof -i :3000
   
   # Change port in .env file
   PORT=3001
   ```

2. **Permission issues:**
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   ```

3. **Container won't start:**
   ```bash
   # Check logs
   docker-compose logs token-optimizer-server
   
   # Rebuild container
   docker-compose up --build -d
   ```

4. **Database connection issues (production):**
   ```bash
   # Check PostgreSQL logs
   docker-compose -f docker-compose.prod.yml logs postgres
   
   # Test database connection
   docker-compose -f docker-compose.prod.yml exec postgres psql -U postgres -d token_optimizer
   ```

### Debugging

1. **Access container shell:**
   ```bash
   docker-compose exec token-optimizer-server sh
   ```

2. **Check environment variables:**
   ```bash
   docker-compose exec token-optimizer-server env
   ```

3. **Monitor resource usage:**
   ```bash
   docker stats
   ```

## Security Considerations

- The application runs as a non-root user inside the container
- Sensitive environment variables should be stored securely
- For production, consider using Docker secrets or external secret management
- The `.dockerignore` file excludes sensitive files from the build context

## Browser Extension Integration

The server is configured to accept requests from browser extensions:
- CORS enabled for `chrome-extension://`, `moz-extension://`, and `safari-web-extension://` origins
- Custom headers supported for extension identification

## API Endpoints

- `GET /health` - Health check endpoint
- `POST /v1/license/validate` - License validation
- `POST /webhook` - Stripe webhook handler
- `POST /dev/create-test-license` - Development test license creation

For detailed API documentation, refer to the main README.md file.
