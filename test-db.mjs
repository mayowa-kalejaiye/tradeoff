import postgres from 'postgres';
const sql = postgres(process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/postgres');
async function run() {
  const res = await sql`SELECT id, status, raw_output FROM architecture_reviews ORDER BY created_at DESC LIMIT 5`;
  console.log(JSON.stringify(res, null, 2));
  process.exit(0);
}
run();
