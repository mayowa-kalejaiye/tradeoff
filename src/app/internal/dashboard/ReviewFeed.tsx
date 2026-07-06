'use client';

import React, { useState } from 'react';
import { RecentReview, markAsMisclassified } from './actions';
import Link from 'next/link';

export function ReviewFeed({ initialReviews }: { initialReviews: RecentReview[] }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [flaggingId, setFlaggingId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  const submitFlag = async (id: string) => {
    if (!notes.trim()) return;
    const res = await markAsMisclassified(id, notes);
    if (res.success) {
      setReviews(reviews.map(r => r.id === id ? { ...r, isMisclassified: true, feedbackNotes: notes } : r));
      setFlaggingId(null);
      setNotes('');
    } else {
      alert('Failed to flag review');
    }
  };

  return (
    <div className="bg-[#ffffff] border-[2px] border-[#000000] flex flex-col shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <div className="bg-[#000000] text-[#ffffff] font-mono text-[12px] px-4 py-3 border-b-[2px] border-[#000000] uppercase tracking-widest font-bold flex items-center gap-2">
        <span className="material-symbols-outlined text-[16px]">forum</span>
        RECENT_REVIEWS_AND_FEEDBACK
      </div>
      
      {reviews.length === 0 ? (
        <div className="p-6 text-[#5d5f5f] text-[12px] font-mono uppercase tracking-widest">No recent reviews found.</div>
      ) : (
        <div className="flex flex-col bg-[#f9f9f9]">
          {reviews.map((review) => (
            <div key={review.id} className="p-6 border-b-[1px] border-[#cfc4c5] last:border-b-0 hover:bg-[#ffffff] transition-none group flex flex-col md:flex-row gap-8">
              
              {/* Left Side: Prompt & Metadata */}
              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="text-[12px] text-[#5d5f5f] font-mono font-bold uppercase tracking-widest bg-[#e8e8e8] px-2 py-1 border-[1px] border-[#cfc4c5]">
                    {new Date(review.createdAt).toLocaleString()}
                  </span>
                  <Link href={`/r/${review.id}?debug=true`} target="_blank" className="text-[12px] font-mono text-[#000000] font-bold uppercase tracking-widest flex items-center gap-1 border-b-[2px] border-[#000000] hover:bg-[#000000] hover:text-[#ffffff] transition-none px-1">
                    VIEW_REPORT <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                  </Link>
                </div>
                <div className="text-[14px] text-[#000000] font-code-md leading-relaxed p-4 border-[2px] border-[#000000] bg-[#ffffff] relative">
                  <div className="absolute top-0 left-0 w-2 h-full bg-[#000000]"></div>
                  <span className="pl-2">
                    "{review.brief.length > 250 ? review.brief.substring(0, 250) + '...' : review.brief}"
                  </span>
                </div>
              </div>

              {/* Right Side: AI Output & Actions */}
              <div className="md:w-80 shrink-0 space-y-4">
                <div className="bg-[#ffffff] p-4 border-[2px] border-[#000000]">
                  <div className="text-[10px] font-mono text-[#5d5f5f] uppercase tracking-widest font-bold mb-1 border-b-[1px] border-[#cfc4c5] pb-1">REC_ARCH</div>
                  <div className="text-[16px] font-sans font-black text-[#000000] mb-4 uppercase">{review.architectureStyle}</div>
                  
                  <div className="flex items-center justify-between border-t-[1px] border-[#cfc4c5] pt-2">
                    <div className="text-[10px] font-mono text-[#5d5f5f] uppercase tracking-widest font-bold">CONFIDENCE</div>
                    <div className={`text-[12px] font-mono font-bold px-2 py-1 border-[1px] ${review.confidenceScore > 80 ? 'bg-[#00ff00] border-[#000000] text-[#000000]' : review.confidenceScore > 50 ? 'bg-amber-400 border-[#000000] text-[#000000]' : 'bg-error text-on-error border-error'}`}>
                      {review.confidenceScore}%
                    </div>
                  </div>
                </div>

                {review.isMisclassified ? (
                  <div className="bg-error-container border-[2px] border-error p-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-10">
                      <span className="material-symbols-outlined text-[48px] text-error">flag</span>
                    </div>
                    <div className="flex items-center gap-2 text-error text-[12px] font-mono font-bold uppercase tracking-widest mb-2 relative z-10 border-b-[1px] border-error pb-1">
                      <span className="material-symbols-outlined text-[14px]">flag</span> FLAGGED
                    </div>
                    <p className="text-[12px] font-code-md text-error relative z-10 font-bold">{review.feedbackNotes}</p>
                  </div>
                ) : flaggingId === review.id ? (
                  <div className="bg-[#e8e8e8] border-[2px] border-[#000000] p-4 space-y-3">
                    <textarea
                      autoFocus
                      placeholder="WHAT DID THE SYSTEM GET WRONG?"
                      className="w-full bg-[#ffffff] border-[2px] border-[#000000] p-3 text-[12px] font-code-md text-[#000000] placeholder:text-[#5d5f5f] focus:outline-none focus:ring-0 resize-none rounded-none uppercase"
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                    <div className="flex gap-2 font-mono text-[12px] font-bold">
                      <button 
                        onClick={() => submitFlag(review.id)}
                        className="flex-1 bg-[#000000] text-[#ffffff] py-2 uppercase border-[2px] border-[#000000] hover:bg-[#ffffff] hover:text-[#000000] transition-none"
                      >
                        SUBMIT
                      </button>
                      <button 
                        onClick={() => { setFlaggingId(null); setNotes(''); }}
                        className="flex-1 bg-[#ffffff] text-[#000000] py-2 uppercase border-[2px] border-[#000000] hover:bg-[#e8e8e8] transition-none"
                      >
                        CANCEL
                      </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => setFlaggingId(review.id)}
                    className="w-full flex items-center justify-center gap-2 py-3 border-[2px] border-[#000000] bg-[#ffffff] text-[10px] font-mono font-bold text-[#000000] uppercase tracking-widest hover:bg-[#000000] hover:text-[#ffffff] transition-none"
                  >
                    <span className="material-symbols-outlined text-[14px]">flag</span> FLAG_MISCLASSIFICATION
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
