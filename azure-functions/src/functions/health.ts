import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 1,
});

async function healthCheck(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  const checks: Record<string, 'ok' | 'error'> = {};

  // Database check
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    checks.database = 'ok';
  } catch {
    checks.database = 'error';
  }

  // Backend API check
  try {
    const response = await fetch(`${process.env.BACKEND_API_URL}/health`);
    checks.backendApi = response.ok ? 'ok' : 'error';
  } catch {
    checks.backendApi = 'error';
  }

  const allOk = Object.values(checks).every((v) => v === 'ok');

  return {
    status: allOk ? 200 : 503,
    jsonBody: {
      status: allOk ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      checks,
    },
  };
}

app.http('health', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: healthCheck,
});
