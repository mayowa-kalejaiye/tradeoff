'use server';

import { db } from '@/db';
import { architectureReviews } from '@/db/schema';
import { desc, sql, gte } from 'drizzle-orm';

export async function getDashboardMetrics() {
  try {
    // 1. Total Reviews
    const totalReviewsResult = await db.select({ count: sql<number>`count(*)` }).from(architectureReviews);
    const totalReviews = Number(totalReviewsResult[0]?.count || 0);

    // 2. Reviews Today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const reviewsTodayResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(architectureReviews)
      .where(gte(architectureReviews.createdAt, today));
    const reviewsToday = Number(reviewsTodayResult[0]?.count || 0);

    // 3. Failed Reviews
    const failedReviewsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(architectureReviews)
      .where(sql`${architectureReviews.status} = 'error'`);
    const failedReviews = Number(failedReviewsResult[0]?.count || 0);

    // 4. Average Generation Time
    const avgTimeResult = await db
      .select({ avg: sql<number>`avg(${architectureReviews.generationTimeMs})` })
      .from(architectureReviews)
      .where(sql`${architectureReviews.status} = 'success'`);
    const avgGenerationTimeMs = Math.round(Number(avgTimeResult[0]?.avg || 0));

    // 5. Fetch all success reviews for aggregation (since JSON aggregation in Postgres can be complex, we can aggregate in memory for MVP)
    const successReviews = await db
      .select()
      .from(architectureReviews)
      .where(sql`${architectureReviews.status} = 'success'`);

    const domainCounts: Record<string, number> = {};
    const riskCounts: Record<string, number> = {};
    const blindSpotCounts: Record<string, number> = {};

    for (const review of successReviews) {
      // Aggregate Domains
      if (Array.isArray(review.extractedDomains)) {
        for (const domain of review.extractedDomains) {
          domainCounts[domain] = (domainCounts[domain] || 0) + 1;
        }
      }
      // Aggregate Risks
      if (Array.isArray(review.topRisks)) {
        for (const risk of review.topRisks) {
          riskCounts[risk] = (riskCounts[risk] || 0) + 1;
        }
      }
      // Aggregate Blind Spots
      if (Array.isArray(review.blindSpots)) {
        for (const spot of review.blindSpots) {
          blindSpotCounts[spot] = (blindSpotCounts[spot] || 0) + 1;
        }
      }
    }

    const sortObject = (obj: Record<string, number>) => {
      return Object.entries(obj)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }));
    };

    return {
      totalReviews,
      reviewsToday,
      failedReviews,
      avgGenerationTimeMs,
      topDomains: sortObject(domainCounts),
      topRisks: sortObject(riskCounts),
      topBlindSpots: sortObject(blindSpotCounts),
    };
  } catch (error) {
    console.error("Failed to fetch dashboard metrics", error);
    return null;
  }
}
