import { app, InvocationContext, Timer } from '@azure/functions';
import axios from 'axios';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 3,
});

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

async function syncTmdb(
  timer: Timer,
  context: InvocationContext,
): Promise<void> {
  context.log('🎬 TMDB sync started');

  if (!TMDB_API_KEY) {
    context.warn('⚠️ TMDB_API_KEY not set — skipping sync');
    return;
  }

  try {
    const client = await pool.connect();

    try {
      // Get content items that need TMDB data refresh
      const { rows: content } = await client.query(`
        SELECT id, tmdb_id, type, title
        FROM content
        WHERE tmdb_id IS NOT NULL
          AND (tmdb_updated_at IS NULL OR tmdb_updated_at < NOW() - INTERVAL '7 days')
        LIMIT 50
      `);

      context.log(`Found ${content.length} items to sync`);

      let updated = 0;
      for (const item of content) {
        try {
          const endpoint = item.type === 'movie' ? 'movie' : 'tv';
          const { data } = await axios.get(
            `${TMDB_BASE_URL}/${endpoint}/${item.tmdb_id}`,
            { params: { api_key: TMDB_API_KEY, language: 'fa-IR' } },
          );

          await client.query(
            `
            UPDATE content SET
              rating = $1,
              vote_count = $2,
              tmdb_updated_at = NOW()
            WHERE id = $3
          `,
            [data.vote_average, data.vote_count, item.id],
          );

          updated++;

          // Rate limiting: TMDB allows ~40 requests per 10 seconds
          await new Promise((resolve) => setTimeout(resolve, 300));
        } catch (err: any) {
          context.warn(`Failed to sync ${item.title}: ${err.message}`);
        }
      }

      context.log(`✅ TMDB sync complete: ${updated}/${content.length} updated`);
    } finally {
      client.release();
    }
  } catch (error: any) {
    context.error('❌ TMDB sync failed:', error);
    throw error;
  }
}

// Run every 6 hours
app.timer('sync-tmdb', {
  schedule: '0 0 */6 * * *',
  handler: syncTmdb,
});
