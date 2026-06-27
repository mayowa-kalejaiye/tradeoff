import { db } from '@/db';
import { architectureReviews } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { ReviewMemo } from '@/components/ReviewMemo';
import { notFound } from 'next/navigation';
import { ArchitectureOutput, ArchetypeScore } from '@/engine/types';
import Link from 'next/link';

export default async function PublicReviewPage({ params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    notFound();
  }

  let review;
  try {
    const result = await db.select().from(architectureReviews).where(eq(architectureReviews.id, id)).limit(1);
    review = result[0];
  } catch (err) {
    console.error("Failed to fetch review:", err);
    notFound();
  }

  if (!review || review.status !== 'success' || !review.rawOutput) {
    notFound();
  }

  const data = review.rawOutput as ArchitectureOutput;
  const rawInput = review.rawInput as any;
  const inputArchetypes = rawInput?.archetypes as ArchetypeScore[] || [];

  return (
    <div className="min-h-screen bg-white">
      <div className="print:hidden bg-zinc-900 text-zinc-100 py-3 px-6 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-indigo-500 rounded flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
          </div>
          <span className="font-bold text-sm">Tradeoff AI</span>
        </div>
        <Link href="/" className="text-xs font-bold bg-white text-zinc-900 px-3 py-1.5 rounded hover:bg-zinc-200 transition-colors">
          Build Your Own Architecture
        </Link>
      </div>

      <div className="max-w-4xl mx-auto py-8">
        <ReviewMemo data={data} inputArchetypes={inputArchetypes} />
      </div>
    </div>
  );
}
