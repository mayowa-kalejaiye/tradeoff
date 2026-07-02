import { config } from 'dotenv';
import path from 'path';
config({ path: path.resolve(__dirname, '.env.local') });
import { db } from './src/db';
import { architectureReviews } from './src/db/schema';
import { sql, gte } from 'drizzle-orm';

async function run() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tokenUsageTodayResult = await db
      .select({ 
        totalInput: sql<number>`sum(${architectureReviews.inputTokens})`,
        totalOutput: sql<number>`sum(${architectureReviews.outputTokens})`,
        totalCostToday: sql<number>`sum(${architectureReviews.totalCost})`
      })
      .from(architectureReviews)
      .where(gte(architectureReviews.createdAt, today));

    console.log("Token usage raw result:", tokenUsageTodayResult);
    console.log("Parsed:", {
      input: Number(tokenUsageTodayResult[0]?.totalInput || 0),
      output: Number(tokenUsageTodayResult[0]?.totalOutput || 0),
      cost: Number(tokenUsageTodayResult[0]?.totalCostToday || 0)
    });
    
    // Also fetch the raw rows for today to see if they exist
    const rows = await db.select({
      id: architectureReviews.id,
      input: architectureReviews.inputTokens,
      output: architectureReviews.outputTokens,
      cost: architectureReviews.totalCost,
      status: architectureReviews.status,
      createdAt: architectureReviews.createdAt
    }).from(architectureReviews)
      .where(gte(architectureReviews.createdAt, today));
      
    console.log("Raw rows today:", rows);
    
  } catch (err) {
    console.error('Error:', err);
  }
  process.exit(0);
}
run();
