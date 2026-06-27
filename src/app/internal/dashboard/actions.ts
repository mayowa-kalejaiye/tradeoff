'use server';

import { db } from '@/db';
import { architectureReviews, engineUpdates } from '@/db/schema';
import { desc, sql, gte } from 'drizzle-orm';

export async function getDashboardMetrics() {
  try {
    // 1. Total Reviews (includes started/success/error)
    const totalReviewsResult = await db.select({ count: sql<number>`count(*)` }).from(architectureReviews);
    const totalStartedReviews = Number(totalReviewsResult[0]?.count || 0);

    // 2. Reviews Today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const reviewsTodayResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(architectureReviews)
      .where(gte(architectureReviews.createdAt, today));
    const reviewsToday = Number(reviewsTodayResult[0]?.count || 0);

    // 3. Status breakdown
    const successReviewsResult = await db.select({ count: sql<number>`count(*)` }).from(architectureReviews).where(sql`${architectureReviews.status} = 'success'`);
    const successReviewsCount = Number(successReviewsResult[0]?.count || 0);
    
    const failedReviewsResult = await db.select({ count: sql<number>`count(*)` }).from(architectureReviews).where(sql`${architectureReviews.status} = 'error'`);
    const failedReviews = Number(failedReviewsResult[0]?.count || 0);

    // Completion Rate
    const completionRate = totalStartedReviews > 0 ? Math.round((successReviewsCount / totalStartedReviews) * 100) : 0;

    // 4. Averages over successful reviews
    const avgMetricsResult = await db
      .select({ 
        avgTime: sql<number>`avg(${architectureReviews.generationTimeMs})`,
        avgConfidence: sql<number>`avg(${architectureReviews.confidenceScore})`,
        avgPromptLength: sql<number>`avg(${architectureReviews.promptLength})`,
        avgCost: sql<number>`avg(${architectureReviews.totalCost})`,
        maxCost: sql<number>`max(${architectureReviews.totalCost})`,
        minCost: sql<number>`min(${architectureReviews.totalCost})`,
      })
      .from(architectureReviews)
      .where(sql`${architectureReviews.status} = 'success'`);
    
    const avgGenerationTimeMs = Math.round(Number(avgMetricsResult[0]?.avgTime || 0));
    const avgConfidence = Math.round(Number(avgMetricsResult[0]?.avgConfidence || 0));
    const avgPromptLength = Math.round(Number(avgMetricsResult[0]?.avgPromptLength || 0));
    const avgCost = Number(avgMetricsResult[0]?.avgCost || 0);
    const maxCost = Number(avgMetricsResult[0]?.maxCost || 0);
    const minCost = Number(avgMetricsResult[0]?.minCost || 0);

    // 5. Token Usage Today
    const tokenUsageTodayResult = await db
      .select({ 
        totalInput: sql<number>`sum(${architectureReviews.inputTokens})`,
        totalOutput: sql<number>`sum(${architectureReviews.outputTokens})`,
        totalCostToday: sql<number>`sum(${architectureReviews.totalCost})`
      })
      .from(architectureReviews)
      .where(gte(architectureReviews.createdAt, today));
      
    const tokenUsageToday = {
      input: Number(tokenUsageTodayResult[0]?.totalInput || 0),
      output: Number(tokenUsageTodayResult[0]?.totalOutput || 0),
      cost: Number(tokenUsageTodayResult[0]?.totalCostToday || 0)
    };

    // 6. Fetch all success reviews for aggregation 
    const successReviews = await db
      .select()
      .from(architectureReviews)
      .where(sql`${architectureReviews.status} = 'success'`);

    const domainCounts: Record<string, number> = {};
    const riskCounts: Record<string, number> = {};
    const blindSpotCounts: Record<string, number> = {};
    const architectureCounts: Record<string, number> = {};
    const unknownTechCounts: Record<string, number> = {};
    const missingNicheCounts: Record<string, number> = {};

    for (const review of successReviews) {
      if (review.architectureStyle) {
        architectureCounts[review.architectureStyle] = (architectureCounts[review.architectureStyle] || 0) + 1;
      }
      
      if (Array.isArray(review.extractedDomains)) {
        for (const domain of review.extractedDomains) {
          domainCounts[domain] = (domainCounts[domain] || 0) + 1;
        }
      }
      if (Array.isArray(review.topRisks)) {
        for (const risk of review.topRisks) {
          riskCounts[risk] = (riskCounts[risk] || 0) + 1;
        }
      }
      if (Array.isArray(review.blindSpots)) {
        for (const spot of review.blindSpots) {
          blindSpotCounts[spot] = (blindSpotCounts[spot] || 0) + 1;
        }
      }
      if (Array.isArray(review.unknownTechnologies)) {
        for (const tech of review.unknownTechnologies) {
          unknownTechCounts[tech] = (unknownTechCounts[tech] || 0) + 1;
        }
      }
      if (Array.isArray(review.missingNiches)) {
        for (const niche of review.missingNiches) {
          missingNicheCounts[niche] = (missingNicheCounts[niche] || 0) + 1;
        }
      }
    }

    const sortObject = (obj: Record<string, number>) => {
      return Object.entries(obj)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }));
    };

    // 7. Knowledge Growth
    const updates = await db.select().from(engineUpdates).orderBy(desc(engineUpdates.createdAt)).limit(5);

    return {
      totalStartedReviews,
      successReviewsCount,
      reviewsToday,
      failedReviews,
      completionRate,
      avgGenerationTimeMs,
      avgConfidence,
      avgPromptLength,
      avgCost,
      maxCost,
      minCost,
      tokenUsageToday,
      topDomains: sortObject(domainCounts),
      topRisks: sortObject(riskCounts),
      topBlindSpots: sortObject(blindSpotCounts),
      topArchitectures: sortObject(architectureCounts),
      unknownTechnologies: sortObject(unknownTechCounts),
      missingNiches: sortObject(missingNicheCounts),
      engineUpdates: updates.map(u => ({ description: u.description, date: u.createdAt }))
    };
  } catch (error) {
    console.error("Failed to fetch dashboard metrics", error);
    return null;
  }
}
