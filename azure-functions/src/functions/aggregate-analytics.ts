import { app, InvocationContext, Timer } from '@azure/functions';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 3,
});

async function aggregateAnalytics(
  timer: Timer,
  context: InvocationContext,
): Promise<void> {
  context.log('📊 Analytics aggregation started');

  if (timer.isPastDue) {
    context.log('⚠️ Timer is running late!');
  }

  try {
    const client = await pool.connect();

    try {
      // 1. Aggregate daily view counts
      const viewResult = await client.query(`
        INSERT INTO analytics_daily (content_id, date, view_count, unique_viewers, avg_watch_duration)
        SELECT 
          wh.content_id,
          DATE(wh.watched_at) as date,
          COUNT(*) as view_count,
          COUNT(DISTINCT wh.user_id) as unique_viewers,
          AVG(wh.progress) as avg_watch_duration
        FROM watch_history wh
        WHERE wh.watched_at >= CURRENT_DATE - INTERVAL '1 day'
          AND wh.watched_at < CURRENT_DATE
        GROUP BY wh.content_id, DATE(wh.watched_at)
        ON CONFLICT (content_id, date) 
        DO UPDATE SET
          view_count = EXCLUDED.view_count,
          unique_viewers = EXCLUDED.unique_viewers,
          avg_watch_duration = EXCLUDED.avg_watch_duration
      `);
      context.log(`Aggregated ${viewResult.rowCount} daily view records`);

      // 2. Update content popularity scores
      await client.query(`
        UPDATE content c SET
          popularity_score = sub.score
        FROM (
          SELECT 
            content_id,
            (COUNT(*) * 1.0 + COUNT(DISTINCT user_id) * 2.0) / 
            GREATEST(EXTRACT(EPOCH FROM (NOW() - MIN(watched_at))) / 86400, 1) as score
          FROM watch_history
          WHERE watched_at >= NOW() - INTERVAL '30 days'
          GROUP BY content_id
        ) sub
        WHERE c.id = sub.content_id
      `);

      context.log('✅ Analytics aggregation complete');
    } finally {
      client.release();
    }
  } catch (error: any) {
    context.error('❌ Analytics aggregation failed:', error);
    throw error;
  }
}

// Run every day at 2:00 AM UTC
app.timer('aggregate-analytics', {
  schedule: '0 0 2 * * *', // NCRONTAB: sec min hour day month dayOfWeek
  handler: aggregateAnalytics,
});
