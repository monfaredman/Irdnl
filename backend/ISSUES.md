# Remaining Issues & Future Enhancements

This document lists all remaining items and future enhancements for the irdnl backend MVP.

## 🔴 High Priority

### 1. DRM Integration
**Status**: Not Implemented  
**Priority**: High  
**Description**: Implement DRM (Digital Rights Management) for content protection.

**Tasks**:
- [ ] Integrate Widevine DRM
- [ ] Integrate PlayReady DRM
- [ ] Integrate FairPlay DRM
- [ ] Create DRM packaging service
- [ ] Implement license server
- [ ] Add DRM metadata to video_assets table
- [ ] Create DRM job processor
- [ ] Add DRM license generation endpoint

**Location**: `src/modules/video-assets/drm.service.ts` (stub exists)

**Estimated Effort**: 2-3 weeks

---

### 2. Transcoding Worker Implementation
**Status**: Job Queue Ready, Worker Needed  
**Priority**: High  
**Description**: Implement background worker to process video transcoding jobs.

**Tasks**:
- [ ] Create transcoding worker service (NestJS microservice or standalone)
- [ ] Integrate FFmpeg or cloud transcoding (AWS MediaConvert)
- [ ] Implement quality profile processing (1080p, 720p, 480p)
- [ ] Add progress tracking for transcoding jobs
- [ ] Implement HLS/DASH playlist generation
- [ ] Add error handling and retry logic
- [ ] Create worker deployment configuration

**Location**: `src/workers/transcoding.worker.ts` (to be created)

**Estimated Effort**: 2-3 weeks

---

### 3. CDN Signed URL Integration
**Status**: Basic Service Exists, CDN Integration Needed  
**Priority**: High  
**Description**: Integrate with CDN provider for signed URL generation.

**Tasks**:
- [ ] Integrate AWS CloudFront signed URLs
- [ ] Or integrate Cloudflare signed URLs
- [ ] Update signed URL service to use CDN
- [ ] Add CDN configuration to environment
- [ ] Test signed URL generation and validation
- [ ] Add TTL configuration per content type

**Location**: `src/modules/video-assets/signed-url.service.ts` (enhance existing)

**Estimated Effort**: 1 week

---

## 🟡 Medium Priority

### 4. Payment Processing
**Status**: Subscription Table Exists, Payment Integration Needed  
**Priority**: Medium  
**Description**: Implement payment gateway integration for subscriptions.

**Tasks**:
- [ ] Integrate Stripe or PayPal
- [ ] Create payment webhook handlers
- [ ] Implement subscription creation flow
- [ ] Add subscription renewal logic
- [ ] Create billing history tracking
- [ ] Add payment failure handling
- [ ] Implement refund processing
- [ ] Add subscription cancellation flow

**Location**: `src/modules/payments/` (to be created)

**Estimated Effort**: 2-3 weeks

---

### 5. Device Management
**Status**: Not Implemented  
**Priority**: Medium  
**Description**: Track and manage user devices for streaming.

**Tasks**:
- [ ] Create devices table
- [ ] Implement device registration endpoint
- [ ] Add device authentication tokens
- [ ] Implement device limits per subscription tier
- [ ] Add device management endpoints
- [ ] Create device removal functionality
- [ ] Add device activity tracking

**Location**: `src/modules/devices/` (to be created)

**Estimated Effort**: 1-2 weeks

---

### 6. Email/SMS OTP Verification
**Status**: Stubs Exist  
**Priority**: Medium  
**Description**: Implement OTP verification for registration and login.

**Tasks**:
- [ ] Integrate SendGrid for email
- [ ] Integrate Kavenegar for SMS
- [ ] Create OTP generation service
- [ ] Implement OTP verification endpoints
- [ ] Add OTP expiration logic
- [ ] Store OTP codes in Redis
- [ ] Add rate limiting for OTP requests

**Location**: `src/modules/auth/otp.service.ts` (to be created)

**Estimated Effort**: 1 week

---

### 7. S3 Storage Adapter
**Status**: Interface Exists, Implementation Needed  
**Priority**: Medium  
**Description**: Complete S3 storage adapter for production use.

**Tasks**:
- [ ] Implement S3 upload functionality
- [ ] Add multipart upload for large files
- [ ] Implement S3 delete functionality
- [ ] Add S3 URL generation
- [ ] Configure S3 bucket policies
- [ ] Add S3 region configuration
- [ ] Test S3 integration

**Location**: `src/modules/video-assets/storage.service.ts` (enhance existing)

**Estimated Effort**: 1 week

---

## 🟢 Low Priority / Future Enhancements

### 8. Advanced Search with Elasticsearch
**Status**: Not Implemented  
**Priority**: Low  
**Description**: Implement full-text search with Elasticsearch.

**Tasks**:
- [ ] Set up Elasticsearch cluster
- [ ] Create content indexing service
- [ ] Implement search endpoints
- [ ] Add search filters and facets
- [ ] Support multi-language search
- [ ] Add search result ranking

**Estimated Effort**: 2 weeks

---

### 9. Analytics and Reporting
**Status**: Not Implemented  
**Priority**: Low  
**Description**: Track content views, watch time, and user engagement.

**Tasks**:
- [ ] Create analytics events table
- [ ] Implement event tracking
- [ ] Add content view tracking
- [ ] Implement watch time analytics
- [ ] Create user engagement metrics
- [ ] Add revenue reporting
- [ ] Create admin analytics dashboard

**Estimated Effort**: 2-3 weeks

---

### 10. Rate Limiting Enhancement
**Status**: Basic Setup Exists  
**Priority**: Low  
**Description**: Implement per-endpoint and per-user rate limiting.

**Tasks**:
- [ ] Configure per-endpoint rate limits
- [ ] Add per-user rate limits
- [ ] Implement IP-based rate limiting
- [ ] Add subscription tier-based limits
- [ ] Create rate limit configuration
- [ ] Add rate limit headers to responses

**Location**: Enhance existing ThrottlerModule configuration

**Estimated Effort**: 1 week

---

### 11. Sentry Integration
**Status**: Not Implemented  
**Priority**: Low  
**Description**: Add error tracking and performance monitoring.

**Tasks**:
- [ ] Install Sentry SDK
- [ ] Configure Sentry in NestJS
- [ ] Add error tracking
- [ ] Implement performance monitoring
- [ ] Add release tracking
- [ ] Configure user context

**Estimated Effort**: 1-2 days

---

### 12. Advanced Caching Strategy
**Status**: Basic Redis Caching Exists  
**Priority**: Low  
**Description**: Implement advanced caching patterns.

**Tasks**:
- [ ] Add cache warming strategies
- [ ] Implement cache invalidation patterns
- [ ] Add cache hit/miss metrics
- [ ] Create cache layer for expensive queries
- [ ] Implement distributed caching

**Estimated Effort**: 1 week

---

### 13. API Versioning
**Status**: Not Implemented  
**Priority**: Low  
**Description**: Implement API versioning for future changes.

**Tasks**:
- [ ] Add URL-based versioning (`/api/v2/...`)
- [ ] Create version-specific controllers
- [ ] Add deprecation notices
- [ ] Maintain backward compatibility
- [ ] Update documentation

**Estimated Effort**: 1 week

---

### 14. Multi-language Support (i18n)
**Status**: Structure Ready  
**Priority**: Low  
**Description**: Complete i18n implementation for error messages.

**Tasks**:
- [ ] Add English error messages
- [ ] Add Persian (Farsi) error messages
- [ ] Implement language detection
- [ ] Add language switching endpoint
- [ ] Test multi-language responses

**Estimated Effort**: 1 week

---

## 🐛 Bug Fixes & Improvements

### Known Issues
- None currently identified (MVP is functional)

### Performance Improvements
- [ ] Optimize database queries with proper indexes
- [ ] Add query result pagination optimization
- [ ] Implement database connection pooling tuning
- [ ] Add response compression
- [ ] Optimize Redis cache strategies

### Code Quality
- [ ] Increase test coverage to >80%
- [ ] Add integration tests for all endpoints
- [ ] Add E2E tests for critical flows
- [ ] Code review and refactoring
- [ ] Add JSDoc comments to all public methods

---

## 📋 Testing Improvements

- [ ] Add tests for admin endpoints
- [ ] Add tests for video upload
- [ ] Add tests for watch history
- [ ] Add tests for watchlist
- [ ] Add tests for signed URLs
- [ ] Add load testing
- [ ] Add security testing

---

## 📚 Documentation

- [ ] Add API usage examples
- [ ] Create Postman collection
- [ ] Add deployment guide
- [ ] Create troubleshooting guide
- [ ] Add architecture diagrams
- [ ] Document environment variables

---

## 🔒 Security Enhancements

- [ ] Implement CSRF protection
- [ ] Add request signing for sensitive endpoints
- [ ] Implement API key authentication for internal services
- [ ] Add security audit logging
- [ ] Implement content access control per subscription
- [ ] Add IP whitelisting for admin endpoints

---

## Summary

**Total Estimated Effort for High Priority Items**: 5-7 weeks  
**Total Estimated Effort for Medium Priority Items**: 5-7 weeks  
**Total Estimated Effort for Low Priority Items**: 8-12 weeks

**Note**: These estimates are rough and may vary based on team size, experience, and specific requirements.

