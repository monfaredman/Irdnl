/**
 * Lightweight Datadog Metrics Service
 *
 * Submits custom metrics to Datadog via the HTTP API so we don't
 * need the full Datadog Agent running on Heroku.  Metrics are
 * buffered in memory and flushed every 60 seconds.
 *
 * @see https://docs.datadoghq.com/api/latest/metrics/#submit-metrics
 */

import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';

interface MetricPoint {
  metric: string;
  type: 'count' | 'gauge' | 'rate';
  points: Array<{ timestamp: number; value: number }>;
  tags?: string[];
}

@Injectable()
export class MetricsService implements OnModuleDestroy {
  private readonly logger = new Logger(MetricsService.name);
  private readonly apiKey: string;
  private readonly enabled: boolean;
  private buffer: MetricPoint[] = [];
  private flushInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.apiKey = process.env.DD_API_KEY || '';
    this.enabled =
      process.env.NODE_ENV === 'production' && this.apiKey.length > 0;

    if (this.enabled) {
      this.flushInterval = setInterval(() => this.flush(), 60_000);
      this.logger.log('Datadog metrics enabled — flushing every 60s');
    }
  }

  // ── Public API ───────────────────────────────────────────────────────

  /** Increment a counter metric. */
  increment(metric: string, value = 1, tags?: string[]) {
    this.enqueue(metric, 'count', value, tags);
  }

  /** Set a gauge metric (e.g. queue length). */
  gauge(metric: string, value: number, tags?: string[]) {
    this.enqueue(metric, 'gauge', value, tags);
  }

  /** Record a timing value. */
  timing(metric: string, durationMs: number, tags?: string[]) {
    this.enqueue(`${metric}.duration_ms`, 'gauge', durationMs, tags);
  }

  // ── Convenience helpers ──────────────────────────────────────────────

  /** Track an HTTP request. */
  trackRequest(method: string, route: string, statusCode: number, durationMs: number) {
    const tags = [
      `method:${method}`,
      `route:${route}`,
      `status:${statusCode}`,
      `status_class:${Math.floor(statusCode / 100)}xx`,
    ];

    this.increment('http.request.count', 1, tags);
    this.timing('http.request', durationMs, tags);

    if (statusCode >= 500) {
      this.increment('http.request.errors', 1, tags);
    }
  }

  /** Track a database query. */
  trackQuery(operation: string, entity: string, durationMs: number) {
    this.timing('db.query', durationMs, [
      `operation:${operation}`,
      `entity:${entity}`,
    ]);
  }

  /** Track a cache hit/miss. */
  trackCache(hit: boolean, key: string) {
    this.increment(hit ? 'cache.hit' : 'cache.miss', 1, [`key:${key}`]);
  }

  // ── Internal ─────────────────────────────────────────────────────────

  private enqueue(
    metric: string,
    type: 'count' | 'gauge' | 'rate',
    value: number,
    tags?: string[],
  ) {
    if (!this.enabled) return;

    this.buffer.push({
      metric: `irdnl.${metric}`,
      type,
      points: [{ timestamp: Math.floor(Date.now() / 1000), value }],
      tags: ['service:irdnl-api', `env:${process.env.NODE_ENV || 'production'}`, ...(tags || [])],
    });

    // Emergency flush if the buffer grows too large
    if (this.buffer.length >= 500) {
      this.flush();
    }
  }

  /** Send buffered metrics to Datadog and clear the buffer. */
  private async flush() {
    if (this.buffer.length === 0) return;

    const series = this.buffer.splice(0, this.buffer.length);

    try {
      const response = await fetch(
        'https://api.datadoghq.com/api/v2/series',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'DD-API-KEY': this.apiKey,
          },
          body: JSON.stringify({ series }),
          signal: AbortSignal.timeout(10_000),
        },
      );

      if (!response.ok) {
        this.logger.warn(
          `Datadog metrics flush failed: ${response.status} ${response.statusText}`,
        );
      }
    } catch (error) {
      this.logger.warn(
        `Datadog metrics flush error: ${(error as Error).message}`,
      );
      // Put metrics back so they aren't lost (keep at most 1000)
      this.buffer.unshift(...series.slice(0, 1000 - this.buffer.length));
    }
  }

  /** Flush remaining metrics on app shutdown. */
  async onModuleDestroy() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    await this.flush();
    this.logger.log('Metrics flushed on shutdown');
  }
}
