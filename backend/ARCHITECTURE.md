# Architecture Notes

## Overview

This document outlines the architecture decisions and future enhancements for the irdnl backend.

## Current Architecture

### Tech Stack
- **NestJS**: Modular, scalable Node.js framework
- **PostgreSQL**: Relational database with TypeORM
- **Redis**: Caching and session storage
- **JWT**: Stateless authentication
- **Docker**: Containerization for development and deployment

### Module Structure

The application follows NestJS module-based architecture:

- **Auth Module**: Handles authentication (JWT, refresh tokens)
- **Users Module**: User management and profiles
- **Content Module**: Content browsing and retrieval
- **Admin Module**: CMS operations for content management
- **Video Assets Module**: Video file management and storage
- **Watch History Module**: User watch progress tracking
- **Watchlist Module**: User watchlist management
- **Jobs Module**: Background job processing
- **Health Module**: System health checks

## Database Schema

### Core Tables
- `users`: User accounts with role-based access
- `content`: Movies and series metadata
- `series`: Series-specific data (linked to content)
- `seasons`: Season information for series
- `episodes`: Episode information with video asset links
- `video_assets`: Video files with quality variants
- `watch_history`: User watch progress
- `watchlist`: User saved content
- `subscriptions`: User subscription information
- `jobs`: Background job queue

## Future Enhancements

### 1. DRM Integration

**Status**: Code-level TODOs added, interfaces prepared

**Implementation Plan**:
- Add `drm_protected` boolean flag to `video_assets` table
- Create `DRMService` to handle DRM packaging
- Integrate with DRM providers (Widevine, PlayReady, FairPlay)
- Add DRM job type to `jobs` table
- Implement license server endpoints

**Location**: `src/modules/video-assets/drm.service.ts` (to be created)

### 2. Transcoding Workers

**Status**: Job queue implemented, worker skeleton needed

**Implementation Plan**:
- Create separate worker service (NestJS microservice or standalone Node.js)
- Use job queue to process transcoding tasks
- Integrate with FFmpeg or cloud transcoding service (AWS MediaConvert, etc.)
- Update `video_assets` status as transcoding progresses
- Support multiple quality profiles (1080p, 720p, 480p, etc.)

**Location**: `src/workers/transcoding.worker.ts` (to be created)

### 3. CDN Signed URLs

**Status**: Basic signed URL service implemented, CDN integration needed

**Implementation Plan**:
- Integrate with CDN provider (CloudFront, Cloudflare, etc.)
- Generate short-lived signed URLs for HLS playlists
- Implement URL signing with CDN-specific methods
- Add TTL configuration per content type

**Location**: `src/modules/video-assets/signed-url.service.ts` (enhance existing)

### 4. Payment Processing

**Status**: Subscription table exists, payment integration needed

**Implementation Plan**:
- Integrate payment gateway (Stripe, PayPal, etc.)
- Create payment webhook handlers
- Implement subscription renewal logic
- Add billing history tracking
- Support multiple subscription tiers

**Location**: `src/modules/payments/` (to be created)

### 5. Device Management

**Status**: Not implemented

**Implementation Plan**:
- Create `devices` table to track user devices
- Implement device registration endpoint
- Add device limits per subscription tier
- Implement device authentication tokens
- Add device management UI in admin panel

**Location**: `src/modules/devices/` (to be created)

### 6. Email/SMS OTP Verification

**Status**: Stubs exist in auth service

**Implementation Plan**:
- Integrate SendGrid for email
- Integrate Kavenegar for SMS
- Create OTP verification endpoints
- Add OTP expiration logic
- Store OTP codes in Redis

**Location**: `src/modules/auth/otp.service.ts` (to be created)

### 7. S3 Storage Adapter

**Status**: Interface exists, implementation needed

**Implementation Plan**:
- Complete `S3StorageAdapter` implementation
- Add AWS SDK integration
- Implement multipart upload for large files
- Add storage bucket configuration
- Support multiple storage regions

**Location**: `src/modules/video-assets/storage.service.ts` (enhance existing)

### 8. Advanced Features

#### Search with Elasticsearch
- Index content in Elasticsearch
- Implement full-text search
- Add search filters and facets
- Support multi-language search

#### Analytics and Reporting
- Track content views, watch time
- User engagement metrics
- Revenue reporting
- Content performance analytics

#### Rate Limiting
- Per-endpoint rate limits
- Per-user rate limits
- IP-based rate limiting
- Configurable limits per subscription tier

#### Sentry Integration
- Error tracking
- Performance monitoring
- Release tracking
- User context

## Deployment Considerations

### Production Checklist
- [ ] Set up production PostgreSQL database
- [ ] Configure Redis cluster for high availability
- [ ] Set up CDN for media delivery
- [ ] Configure S3 buckets for video storage
- [ ] Set up monitoring (Prometheus, Grafana)
- [ ] Configure logging (ELK stack or similar)
- [ ] Set up CI/CD pipeline
- [ ] Configure SSL certificates
- [ ] Set up backup strategy
- [ ] Configure auto-scaling

### Security Hardening
- [ ] Enable rate limiting in production
- [ ] Configure CORS properly
- [ ] Set up WAF (Web Application Firewall)
- [ ] Implement DDoS protection
- [ ] Regular security audits
- [ ] Dependency vulnerability scanning
- [ ] Secrets management (AWS Secrets Manager, etc.)

## Scaling Strategy

### Horizontal Scaling
- Stateless API design allows multiple instances
- Use load balancer (nginx, AWS ALB)
- Database connection pooling
- Redis cluster for distributed caching

### Database Scaling
- Read replicas for read-heavy operations
- Partition large tables if needed
- Consider read-through caching strategy

### Media Delivery
- CDN for static assets and video files
- Multiple CDN regions for global audience
- Adaptive bitrate streaming (HLS/DASH)

## Monitoring and Observability

### Metrics to Track
- API response times
- Database query performance
- Cache hit rates
- Error rates
- User authentication success/failure
- Video streaming metrics
- Job queue processing times

### Logging Strategy
- Structured logging (JSON format)
- Log aggregation (ELK, CloudWatch, etc.)
- Log retention policies
- Sensitive data masking

## API Versioning

Current API is v1. For future versions:
- Use URL versioning: `/api/v2/...`
- Maintain backward compatibility
- Deprecation notices in headers
- Version-specific documentation

