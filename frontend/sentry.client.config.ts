/**
 * Sentry Client-side Configuration (runs in the browser).
 *
 * This file is automatically picked up by @sentry/nextjs when the
 * Sentry webpack plugin processes the client bundle.
 *
 * @see https://docs.sentry.io/platforms/javascript/guides/nextjs/
 */

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,

  // ── Tracing ────────────────────────────────────────────────────────────
  // Sample 10 % of page-loads for performance monitoring.
  tracesSampleRate: 0.1,

  // ── Session Replay ─────────────────────────────────────────────────────
  // Record 5 % of normal sessions, 100 % of sessions that hit an error.
  replaysSessionSampleRate: 0.05,
  replaysOnErrorSampleRate: 1.0,

  integrations: [
    Sentry.replayIntegration({
      maskAllText: false, // keep text readable in replays
      blockAllMedia: false,
    }),
  ],

  // ── Error filtering ────────────────────────────────────────────────────
  // Drop noisy or irrelevant errors before they count against quota.
  beforeSend(event) {
    const message = event.exception?.values?.[0]?.value ?? '';

    // Browser-extension and ad-blocker noise
    if (/ResizeObserver loop/i.test(message)) return null;
    if (/Loading chunk \d+ failed/i.test(message)) return null;
    if (/Script error\.?$/i.test(message)) return null;

    return event;
  },

  // Ignore common third-party / browser errors
  ignoreErrors: [
    'Network request failed',
    'Failed to fetch',
    'Load failed',
    'AbortError',
    'ChunkLoadError',
    'Non-Error promise rejection captured',
  ],

  // Only report errors from our own code
  allowUrls: [
    /https?:\/\/monfaredman\.github\.io/,
    /https?:\/\/localhost/,
  ],
});
