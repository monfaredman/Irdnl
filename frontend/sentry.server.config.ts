/**
 * Sentry Server-side Configuration (runs in Node.js SSR).
 *
 * @see https://docs.sentry.io/platforms/javascript/guides/nextjs/
 */

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,

  // Sample 20 % of server-side transactions for performance.
  tracesSampleRate: 0.2,

  // Capture 100 % of server errors (they are usually more critical).
  beforeSend(event) {
    return event;
  },
});
