require('dotenv').config({path: '.env.local'});
const postgres = require('postgres');
const sql = postgres(process.env.DATABASE_URL);

async function run() {
  try {
    await sql`ALTER TABLE architecture_reviews ADD COLUMN IF NOT EXISTS graph_schema_version varchar(50)`;
    await sql`ALTER TABLE architecture_reviews ADD COLUMN IF NOT EXISTS resolver_version varchar(50)`;
    await sql`ALTER TABLE architecture_reviews ADD COLUMN IF NOT EXISTS llm_version varchar(50)`;
    await sql`ALTER TABLE architecture_reviews ADD COLUMN IF NOT EXISTS prompt_version varchar(50)`;
    await sql`ALTER TABLE architecture_reviews ADD COLUMN IF NOT EXISTS activated_nodes jsonb`;
    await sql`ALTER TABLE architecture_reviews ADD COLUMN IF NOT EXISTS suppressed_nodes jsonb`;
    await sql`ALTER TABLE architecture_reviews ADD COLUMN IF NOT EXISTS conflicts jsonb`;
    await sql`ALTER TABLE architecture_reviews ADD COLUMN IF NOT EXISTS insight_patches jsonb`;
    console.log('Successfully ran ALTER TABLEs');
  } catch (e) {
    console.error('Migration failed', e);
  } finally {
    process.exit(0);
  }
}

run();
