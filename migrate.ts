import { config } from 'dotenv';
import path from 'path';
config({ path: path.resolve(__dirname, '.env.local') });
import { db } from './src/db';
import { sql } from 'drizzle-orm';

async function run() {
  console.log('Running manual schema migration...');
  try {
    await db.execute(sql`
      ALTER TABLE "architecture_reviews" ADD COLUMN IF NOT EXISTS "is_misclassified" boolean DEFAULT false;
      ALTER TABLE "architecture_reviews" ADD COLUMN IF NOT EXISTS "feedback_notes" varchar(2000);
    `);
    console.log('Migration successful.');
  } catch (err) {
    console.error('Migration failed:', err);
  }
  process.exit(0);
}
run();
