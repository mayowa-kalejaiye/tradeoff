import 'dotenv/config';
import { db, client } from './src/db/index';
import { architectureReviews } from './src/db/schema';
import { sql } from 'drizzle-orm';

async function main() {
  try {
    const res = await db.execute(sql`SELECT count(*) FROM architecture_reviews`);
    console.log("Table exists, count:", res);
  } catch (err: any) {
    console.error("Error executing query:", err);
  }

  try {
    console.log("Attempting insert...");
    await db.insert(architectureReviews).values([{
      status: 'success',
      extractedDomains: sql`${JSON.stringify(['internal_tool'])}::jsonb` as any,
      architectureStyle: 'BaaS',
      topRisks: sql`${JSON.stringify(['Shadow IT'])}::jsonb` as any,
      blindSpots: sql`${JSON.stringify([])}::jsonb` as any,
      generationTimeMs: 1234,
    }]);
    console.log("Insert successful!");
  } catch (err: any) {
    console.error("Error inserting:", err);
  }
  
  process.exit(0);
}

main();
