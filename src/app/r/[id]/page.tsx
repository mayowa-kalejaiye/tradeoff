import { db } from '@/db';
import { architectureReviews } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { ReviewMemo } from '@/components/ReviewMemo';
import { notFound } from 'next/navigation';
import { ArchitectureOutput } from '@/engine/types';
import Link from 'next/link';

export default async function PublicReviewPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const { debug } = await searchParams;
  const isDebugMode = debug === 'true';

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

  if (!review || review.status !== 'success') {
    notFound();
  }

  if (!review.rawOutput) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-8">
        <div className="max-w-md text-center space-y-4">
          <div className="w-12 h-12 bg-zinc-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <h1 className="text-xl font-bold text-zinc-900">Review Unavailable</h1>
          <p className="text-sm text-zinc-600">This architecture review was generated with an older version of the engine and cannot be shared. Please generate a new review to share it.</p>
          <div className="pt-4">
            <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white text-sm font-bold rounded hover:bg-zinc-800 transition-colors">
              Start New Review
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const data = review.rawOutput as ArchitectureOutput;
  const rawInput = review.rawInput as any;
  const inputArchetypes = rawInput?.archetypes || [];
  const rawPrompt = rawInput?.brief || '';

  return (
    <div className="min-h-screen bg-white">
      <div className="print:hidden bg-zinc-900 text-zinc-100 py-3 px-6 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-indigo-500 rounded flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
          </div>
          <span className="font-bold text-sm">Tradeoff AI</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/?remix=${id}`} className="flex items-center gap-2 text-xs font-bold bg-indigo-500 text-white px-4 py-1.5 rounded hover:bg-indigo-600 transition-colors shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
            Remix this Architecture
          </Link>
          <Link href="/" className="hidden sm:block text-xs font-bold bg-white text-zinc-900 px-3 py-1.5 rounded hover:bg-zinc-200 transition-colors">
            Start Fresh
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-8">
        <ReviewMemo data={data} inputCapabilities={inputArchetypes.map((a: any) => ({...a, source: 'llm'}))} debugMode={isDebugMode} rawPrompt={rawPrompt} />
      </div>
    </div>
  );
}
