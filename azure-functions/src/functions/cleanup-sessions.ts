import { app, InvocationContext, Timer } from '@azure/functions';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 2,
});

async function cleanupSessions(
  timer: Timer,
  context: InvocationContext,
): Promise<void> {
  context.log('🧹 Session cleanup started');

  try {
    const client = await pool.connect();

    try {
      // 1. Clean old notifications (> 90 days, already read)
      const { rowCount: oldNotifications } = await client.query(`
        DELETE FROM notification
        WHERE created_at < NOW() - INTERVAL '90 days'
          AND is_read = true
      `);
      context.log(`Cleaned ${oldNotifications || 0} old notifications`);

      // 2. Clean completed/failed jobs older than 30 days
      const { rowCount: oldJobs } = await client.query(`
        DELETE FROM job
        WHERE status IN ('completed', 'failed')
          AND created_at < NOW() - INTERVAL '30 days'
      `);
      context.log(`Cleaned ${oldJobs || 0} old jobs`);

      // 3. Mark stale watch sessions as abandoned
      const { rowCount: staleHistory } = await client.query(`
        UPDATE watch_history
        SET status = 'abandoned'
        WHERE status = 'watching'
          AND updated_at < NOW() - INTERVAL '7 days'
      `);
      context.log(`Marked ${staleHistory || 0} stale watch sessions`);

      context.log('✅ Cleanup complete');
    } finally {
      client.release();
    }
  } catch (error: any) {
    context.error('❌ Cleanup failed:', error);
    throw error;
  }
}

// Run every day at 3:00 AM UTC
app.timer('cleanup-sessions', {
  schedule: '0 0 3 * * *',
  handler: cleanupSessions,
});
