'use client';

import { useState } from 'react';

export function NewsletterOptIn() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('LOADING');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      if (res.ok) {
        setStatus('SUCCESS');
        setEmail('');
      } else {
        setStatus('ERROR');
      }
    } catch (err) {
      setStatus('ERROR');
    }
  };

  return (
    <div className="bg-amber-400 border-[2px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 max-w-2xl mx-auto my-12">
      <div className="flex items-center gap-2 mb-4 text-black uppercase font-bold tracking-widest text-sm">
        <span className="material-symbols-outlined">mail</span>
        <span>Join the Waitlist</span>
      </div>
      
      <h3 className="text-2xl font-black uppercase mb-2">Build Better Architecture</h3>
      <p className="font-code-md text-zinc-900 mb-6">
        Get weekly tear-downs of how top startups actually scale, and practical engineering advice delivered straight to your inbox.
      </p>

      {status === 'SUCCESS' ? (
        <div className="bg-white border-[2px] border-black p-4 font-bold text-green-700 font-mono uppercase text-center">
          YOU'RE ON THE LIST! Check your inbox soon.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <input 
            type="email" 
            placeholder="ENTER_YOUR_EMAIL" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-white border-[2px] border-black px-4 py-3 font-mono font-bold focus:outline-none focus:ring-4 focus:ring-black/20"
          />
          <button 
            type="submit" 
            disabled={status === 'LOADING'}
            className="bg-black text-white border-[2px] border-black px-6 py-3 font-mono font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-none disabled:opacity-50"
          >
            {status === 'LOADING' ? 'SUBMITTING...' : 'SUBSCRIBE'}
          </button>
        </form>
      )}
      {status === 'ERROR' && (
        <p className="text-red-700 font-bold font-mono text-xs mt-2 uppercase">Failed to subscribe. Please try again.</p>
      )}
    </div>
  );
}
