import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL!;
console.log('Connecting to', connectionString.substring(0, 30) + '...');

const client = postgres(connectionString, { prepare: false });
const db = drizzle(client);

async function check() {
  try {
    const result = await client`SELECT 1`;
    console.log("SUCCESS:", result);
  } catch (err) {
    console.error("ERROR:", err);
  } finally {
    await client.end();
  }
}

check();
