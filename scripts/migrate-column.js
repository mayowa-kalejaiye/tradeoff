require('dotenv').config({path: '.env.local'});
const postgres = require('postgres');
const sql = postgres(process.env.DATABASE_URL);

async function run() {
  try {
    await sql`ALTER TABLE architecture_reviews ADD COLUMN knowledge_version varchar(50)`;
    console.log('Successfully added knowledge_version column');
  } catch (e) {
    console.error('Migration failed or column already exists', e);
  } finally {
    process.exit(0);
  }
}

run();
