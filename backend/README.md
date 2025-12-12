# PersiaPlay Backend API

Production-ready NestJS backend for PersiaPlay streaming platform.

## Features

- 🔐 JWT-based authentication with refresh tokens
- 📺 Content management (movies & series)
- 🎬 Video asset management with upload support
- 👥 User management with role-based access control
- 📊 Watch history and watchlist
- 🎯 Admin CMS for content CRUD operations
- 💾 PostgreSQL database with TypeORM
- ⚡ Redis caching
- 📝 OpenAPI/Swagger documentation
- 🐳 Docker support
- ✅ Comprehensive test coverage

## Tech Stack

- **Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL with TypeORM
- **Cache**: Redis
- **Authentication**: JWT + Passport
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest

## Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose (optional)

## Quick Start

### Using Docker Compose (Recommended)

1. Clone the repository and navigate to the backend directory:
```bash
cd backend
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Start services:
```bash
docker-compose up -d
```

4. Run migrations:
```bash
docker-compose exec backend npm run migration:run
```

5. Seed the database:
```bash
docker-compose exec backend npm run seed
```

6. Access the API:
- API: http://localhost:3001/api
- Swagger: http://localhost:3001/api

### Manual Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (see `.env.example`):
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start PostgreSQL and Redis:
```bash
# Using Docker
docker-compose up -d postgres redis
```

4. Run migrations:
```bash
npm run migration:run
```

5. Seed the database:
```bash
npm run seed
```

6. Start the development server:
```bash
npm run start:dev
```

## Environment Variables

See `.env.example` for all available environment variables. Key variables:

- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - Secret for JWT tokens (min 32 chars)
- `JWT_REFRESH_SECRET` - Secret for refresh tokens (min 32 chars)
- `STORAGE_TYPE` - `local` or `s3` (default: `local`)
- `STORAGE_LOCAL_PATH` - Local storage path (default: `./storage`)

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout (requires auth)

### Content (Public)

- `GET /api/content` - List content with pagination and filters
- `GET /api/content/:id` - Get content details
- `GET /api/content/:id/episodes` - Get episodes for a series
- `GET /api/content/:id/stream` - Get streaming info
- `GET /api/content/trending` - Get trending content

### User (Authenticated)

- `GET /api/user/me` - Get current user profile
- `PUT /api/user/me` - Update current user profile
- `GET /api/user/:id` - Get user by ID (admin only)

### Watch History (Authenticated)

- `POST /api/user/history` - Record watch progress
- `GET /api/user/history` - Get user watch history

### Watchlist (Authenticated)

- `POST /api/user/watchlist` - Add to watchlist
- `DELETE /api/user/watchlist/:contentId` - Remove from watchlist
- `GET /api/user/watchlist` - Get user watchlist

### Admin (Admin Only)

- `POST /api/admin/content` - Create content
- `PUT /api/admin/content/:id` - Update content
- `DELETE /api/admin/content/:id` - Delete content
- `POST /api/admin/videos/upload` - Upload video file
- `POST /api/admin/videos/:assetId/mark-transcoded` - Mark video as transcoded

### Health

- `GET /api/health` - Health check

## Testing

### Unit Tests

```bash
npm run test
```

### E2E Tests

```bash
npm run test:e2e
```

### Coverage

```bash
npm run test:cov
```

## Database Migrations

### Generate Migration

```bash
npm run migration:generate -- src/migrations/MigrationName
```

### Run Migrations

```bash
npm run migration:run
```

### Revert Migration

```bash
npm run migration:revert
```

## Seeding Database

Seed the database with sample data:

```bash
npm run seed
```

This creates:
- Admin user: `admin@persiaplay.local` / `Passw0rd!`
- Regular users: `user1@example.com` / `password123`, `user2@example.com` / `password123`
- 5 published movies
- 1 series with 2 seasons and 3 episodes each
- Sample subscription

## Project Structure

```
backend/
├── src/
│   ├── modules/          # Feature modules
│   │   ├── auth/        # Authentication
│   │   ├── users/       # User management
│   │   ├── content/     # Content browsing
│   │   ├── admin/       # Admin CMS
│   │   ├── video-assets/# Video management
│   │   ├── watch-history/# Watch history
│   │   ├── watchlist/   # Watchlist
│   │   ├── jobs/        # Background jobs
│   │   └── health/      # Health checks
│   ├── config/          # Configuration
│   ├── database/        # Database seeds
│   └── migrations/      # TypeORM migrations
├── test/                # E2E tests
└── package.json
```

## API Documentation

Swagger documentation is available at `/api` when the server is running.

## Example API Calls

### Register User

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!",
    "name": "John Doe"
  }'
```

### Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@persiaplay.local",
    "password": "Passw0rd!"
  }'
```

### Get Content (with token)

```bash
curl -X GET http://localhost:3001/api/content \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Create Content (Admin)

```bash
curl -X POST http://localhost:3001/api/admin/content \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Movie",
    "type": "movie",
    "year": 2024,
    "description": "A great movie",
    "status": "published"
  }'
```

## Development

### Code Style

```bash
npm run lint
npm run format
```

### Build

```bash
npm run build
```

### Production

```bash
npm run start:prod
```

## Security Notes

- All passwords are hashed using bcrypt
- JWT tokens have expiration times
- Admin endpoints require admin role
- Input validation on all endpoints
- Helmet.js for security headers
- CORS configured

## TODO / Future Enhancements

- [ ] DRM integration (code-level TODOs added)
- [ ] Transcoding worker implementation
- [ ] CDN signed URL integration
- [ ] Payment processing
- [ ] Device management
- [ ] Email/SMS OTP verification (stubs exist)
- [ ] S3 storage adapter implementation
- [ ] Rate limiting per endpoint
- [ ] Sentry integration
- [ ] Advanced search with Elasticsearch
- [ ] Analytics and reporting

## License

Private - PersiaPlay Platform

