import { ImageResponse } from 'next/og'
import { db } from '@/db'
import { architectureReviews } from '@/db/schema'
import { eq } from 'drizzle-orm'

export const alt = 'Architecture Review - Tradeoff AI'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let review;
  try {
    const result = await db.select().from(architectureReviews).where(eq(architectureReviews.id, id)).limit(1);
    review = result[0];
  } catch (err) {
    console.error("Failed to fetch review for OG image:", err);
  }

  const domains = review?.extractedDomains?.join(' / ') || 'Software Project';
  const style = review?.architectureStyle || 'Technical Architecture Review';
  const confidence = review?.confidenceScore ? `${review.confidenceScore}% Confidence Score` : 'AI Generated';

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #18181b, #09090b)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '80px',
          fontFamily: 'sans-serif',
          color: 'white',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '60px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              background: '#8b5cf6',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '20px',
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
          </div>
          <span style={{ fontSize: '42px', fontWeight: 'bold', color: '#e4e4e7', letterSpacing: '-1px' }}>Tradeoff AI</span>
        </div>

        <div style={{ fontSize: '28px', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '24px', fontWeight: 600 }}>
          {domains}
        </div>

        <div style={{ fontSize: '72px', fontWeight: 'bold', lineHeight: 1.1, marginBottom: '40px', color: 'white', maxWidth: '1000px', letterSpacing: '-2px' }}>
          {style}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginTop: 'auto' }}>
           <div style={{ fontSize: '28px', color: '#10b981', fontWeight: 'bold', display: 'flex', alignItems: 'center', background: 'rgba(16, 185, 129, 0.1)', padding: '12px 24px', borderRadius: '100px' }}>
             {confidence}
           </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
