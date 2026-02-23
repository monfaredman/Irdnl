import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Logs slow requests (> 2 seconds) and optionally reports them to Sentry.
 *
 * Usage in main.ts:
 *   app.useGlobalInterceptors(new PerformanceInterceptor());
 */
@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  private readonly slowThresholdMs: number;

  constructor(slowThresholdMs = 2000) {
    this.slowThresholdMs = slowThresholdMs;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const start = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - start;

          if (duration > this.slowThresholdMs) {
            console.warn(
              `🐌 Slow request: ${method} ${url} took ${duration}ms (threshold: ${this.slowThresholdMs}ms)`,
            );

            // Report to Sentry if available
            try {
              const Sentry = require('@sentry/node');
              Sentry.withScope((scope: any) => {
                scope.setTag('slow_request', 'true');
                scope.setContext('performance', { method, url, duration });
                Sentry.captureMessage(
                  `Slow request: ${method} ${url} (${duration}ms)`,
                  'warning',
                );
              });
            } catch {
              // Sentry not available
            }
          }
        },
        error: (error) => {
          const duration = Date.now() - start;
          console.error(
            `❌ ${method} ${url} failed after ${duration}ms: ${error.message}`,
          );
        },
      }),
    );
  }
}
