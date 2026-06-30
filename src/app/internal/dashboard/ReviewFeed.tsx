'use client';

import React, { useState } from 'react';
import { RecentReview, markAsMisclassified } from './actions';
import { Flag, ExternalLink, MessageSquare } from 'lucide-react';
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
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden mt-8">
      <div className="p-6 border-b border-white/10 flex items-center gap-3">
        <MessageSquare className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-medium text-white tracking-tight">Recent Reviews & Feedback Loop</h3>
      </div>
      
      {reviews.length === 0 ? (
        <div className="p-6 text-neutral-500 text-sm">No recent reviews found.</div>
      ) : (
        <div className="divide-y divide-white/5">
          {reviews.map((review) => (
            <div key={review.id} className="p-6 hover:bg-white/5 transition-colors group">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                
                {/* Left Side: Prompt & Metadata */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-neutral-500 font-mono">
                      {new Date(review.createdAt).toLocaleString()}
                    </span>
                    <Link href={`/r/${review.id}`} target="_blank" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                      View full report <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                  <div className="text-sm text-neutral-200 leading-relaxed bg-black/20 p-3 rounded-lg border border-white/5 italic">
                    "{review.brief.length > 250 ? review.brief.substring(0, 250) + '...' : review.brief}"
                  </div>
                </div>

                {/* Right Side: AI Output & Actions */}
                <div className="md:w-72 shrink-0 space-y-4">
                  <div className="bg-black/30 p-4 rounded-lg border border-white/10">
                    <div className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">Recommended Architecture</div>
                    <div className="text-sm font-semibold text-white mb-3">{review.architectureStyle}</div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] text-neutral-500 uppercase tracking-wider">Confidence</div>
                      <div className={`text-xs font-bold ${review.confidenceScore > 80 ? 'text-emerald-400' : review.confidenceScore > 50 ? 'text-amber-400' : 'text-red-400'}`}>
                        {review.confidenceScore}%
                      </div>
                    </div>
                  </div>

                  {review.isMisclassified ? (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
                        <Flag className="w-3 h-3" /> Flagged
                      </div>
                      <p className="text-xs text-red-200/70">{review.feedbackNotes}</p>
                    </div>
                  ) : flaggingId === review.id ? (
                    <div className="bg-neutral-900 border border-white/10 rounded-lg p-3 space-y-3">
                      <textarea
                        autoFocus
                        placeholder="What did the AI get wrong?"
                        className="w-full bg-black/50 border border-white/10 rounded p-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-blue-500"
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <button 
                          onClick={() => submitFlag(review.id)}
                          className="flex-1 bg-red-500/20 text-red-400 text-xs font-bold py-1.5 rounded hover:bg-red-500/30 transition-colors"
                        >
                          Submit
                        </button>
                        <button 
                          onClick={() => { setFlaggingId(null); setNotes(''); }}
                          className="flex-1 bg-white/5 text-neutral-400 text-xs font-bold py-1.5 rounded hover:bg-white/10 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setFlaggingId(review.id)}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-white/10 text-xs font-bold text-neutral-400 hover:bg-white/5 hover:text-red-400 hover:border-red-500/30 transition-all"
                    >
                      <Flag className="w-3 h-3" /> Flag Misclassification
                    </button>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
