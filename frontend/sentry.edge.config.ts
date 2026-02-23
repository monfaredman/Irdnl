/**
 * Sentry Edge Runtime Configuration (runs in Edge/Middleware).
 *
 * @see https://docs.sentry.io/platforms/javascript/guides/nextjs/
 */

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,

  // Lower sample rate for edge – high volume, low value per request.
  tracesSampleRate: 0.05,
});
