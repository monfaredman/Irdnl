// backend/src/sentry.ts
// Initialize Sentry error tracking — import this FIRST in main.ts
import * as Sentry from '@sentry/node';

export function initSentry(): void {
  const dsn = process.env.SENTRY_DSN;

  if (!dsn || process.env.NODE_ENV !== 'production') {
    console.log('ℹ️  Sentry disabled (no DSN or non-production environment)');
    return;
  }

  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV || 'production',
    release: `irdnl-api@${process.env.npm_package_version || '1.0.0'}`,

    // Performance Monitoring
    tracesSampleRate: 0.1, // 10% of transactions

    // Limit breadcrumbs to reduce payload
    maxBreadcrumbs: 50,

    // Filter out expected errors
    beforeSend(event) {
      // Don't send 4xx client errors
      const statusCode = event.contexts?.response?.status_code;
      if (typeof statusCode === 'number' && statusCode >= 400 && statusCode < 500) {
        return null;
      }
      return event;
    },

    // Ignore common non-errors
    ignoreErrors: [
      'ECONNRESET',
      'EPIPE',
      'ECANCELED',
      /^NotFoundException/,
      /^UnauthorizedException/,
    ],
  });

  console.log('✅ Sentry initialized');
}
