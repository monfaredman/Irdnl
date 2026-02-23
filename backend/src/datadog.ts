// backend/src/datadog.ts
// Initialize Datadog APM — MUST be imported before all other imports in main.ts
//
// Only activates in production when DD_API_KEY is set.
// Install: npm install dd-trace

const isProduction = process.env.NODE_ENV === 'production';
const hasApiKey = Boolean(process.env.DD_API_KEY);

if (isProduction && hasApiKey) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const tracer = require('dd-trace');
    tracer.init({
      service: process.env.DD_SERVICE || 'irdnl-api',
      env: process.env.DD_ENV || 'production',
      version: process.env.DD_VERSION || process.env.npm_package_version || '1.0.0',
      logInjection: true,
      runtimeMetrics: true,
      sampleRate: 0.2, // 20% of requests
      plugins: true,   // Auto-detect Express, TypeORM, Redis, etc.
    });
    console.log('✅ Datadog APM initialized');
  } catch (error) {
    console.warn('⚠️  Datadog APM failed to initialize:', (error as Error).message);
  }
} else {
  if (!isProduction) {
    console.log('ℹ️  Datadog APM disabled (non-production environment)');
  } else if (!hasApiKey) {
    console.log('ℹ️  Datadog APM disabled (no DD_API_KEY set)');
  }
}

export {};
