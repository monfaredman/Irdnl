import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Global exception filter that reports 5xx errors to Sentry.
 *
 * Usage in main.ts:
 *   app.useGlobalFilters(new SentryExceptionFilter());
 *
 * Requires @sentry/node to be installed:
 *   npm install @sentry/node
 */
@Catch()
export class SentryExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Only report 5xx errors to Sentry
    if (status >= 500) {
      try {
        // Dynamic import so the filter works even without @sentry/node installed
        const Sentry = require('@sentry/node');
        Sentry.withScope((scope: any) => {
          scope.setTag('url', request.url);
          scope.setTag('method', request.method);
          scope.setTag('status', status.toString());
          scope.setUser({
            ip_address: request.ip,
            id: (request as any).user?.id,
          });
          scope.setContext('request', {
            url: request.url,
            method: request.method,
            query: request.query,
            body: request.body
              ? JSON.stringify(request.body).substring(0, 2048)
              : undefined,
          });
          Sentry.captureException(exception);
        });
      } catch {
        // Sentry not available — silently continue
      }
    }

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: 'Internal server error', statusCode: status };

    response.status(status).json(
      typeof message === 'string'
        ? { statusCode: status, message }
        : message,
    );
  }
}
