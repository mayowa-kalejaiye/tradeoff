'use client';

import { useState, useTransition, useEffect, Suspense, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { processArchitectureRequest, getReviewInputById } from '../actions';
import { EngineResponse } from '@/engine/types';
import { ReviewMemo } from '@/components/ReviewMemo';

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface-container-lowest flex items-center justify-center"><Loader className="w-6 h-6 text-primary animate-spin" /></div>}>
      <HomeEditor />
    </Suspense>
  );
}

function HomeEditor() {
  const searchParams = useSearchParams();
  const remixId = searchParams.get('remix');

  const [prompt, setPrompt] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<EngineResponse | null>(null);
  const [error, setError] = useState('');
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isNavVisible, setIsNavVisible] = useState(true);
  const lastScrollY = useRef(0);

  const wordCount = prompt.trim() ? prompt.trim().split(/\s+/).length : 0;
  const isOverLimit = wordCount > 150;

  useEffect(() => {
    if (remixId) {
      getReviewInputById(remixId).then(brief => {
        if (brief) {
          setPrompt(brief);
        }
      }).catch(console.error);
    }
  }, [remixId]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setIsNavVisible(false);
      } else {
        setIsNavVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isOverLimit) return;

    setError('');
    setResult(null);

    startTransition(async () => {
      try {
        const output = await processArchitectureRequest(prompt, isPrivate);
        if (output.status === 'error') {
          setError(output.message);
        } else {
          setResult(output);
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred.');
      }
    });
  };

  const handleRetryWithAnswers = (e: React.MouseEvent) => {
    e.preventDefault();
    if (result?.status !== 'uncertainty') return;

    const answerText = Object.entries(answers)
      .filter(([_, ans]) => ans.trim() !== '')
      .map(([index, ans]) => `Q: ${result.questions[parseInt(index)]}\nA: ${ans}`)
      .join('\n\n');
    
    if (!answerText) return;

    const newPrompt = prompt + '\n\n=== CLARIFICATIONS ===\n' + answerText;
    setPrompt(newPrompt);
    setAnswers({});
    setError('');
    setResult(null);
    
    startTransition(async () => {
      try {
        const output = await processArchitectureRequest(newPrompt, isPrivate);
        if (output.status === 'error') {
          setError(output.message);
        } else {
          setResult(output);
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred.');
      }
    });
  };

  const handleExport = () => {
    if (result?.status !== 'success') return;
    const data = result.data;
    
    const md: string[] = [];
    md.push(`# Architecture Review Memo`);
    md.push(`\n**Project Brief:**\n> ${prompt.split('\n').join('\n> ')}\n`);
    md.push(`\n## Layer 1: Core Architecture`);
    md.push(`### Recommended Architecture: ${data.architectureStyle}`);
    
    if (data.recommended[0]?.reasons) {
      md.push(`\n### Primary Reasoning`);
      data.recommended[0].reasons.forEach((r: string) => md.push(`- ${r}`));
    }

    const blob = new Blob([md.join('\n')], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `architecture-review.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-surface-container-lowest text-on-surface font-body-lg selection:bg-primary selection:text-on-primary min-h-screen flex flex-col">
      {/* TopAppBar */}
      <header className={`w-full top-0 sticky bg-surface border-b-thick border-primary flex justify-between items-center px-margin-edge h-20 max-w-full z-50 transition-transform duration-300 ease-in-out ${isNavVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="flex items-center gap-gutter">
          <span className="material-symbols-outlined text-[24px] font-bold text-primary cursor-pointer hover:bg-primary hover:text-on-primary border-thick border-transparent hover:border-primary p-1 transition-none">architecture</span>
          <div className="font-headline-md text-[24px] tracking-tighter font-black text-primary uppercase mt-1">
            TRADEOFF
          </div>
        </div>
        <button className="font-label-caps text-[12px] border-thick border-primary px-unit py-unit uppercase tracking-widest text-primary hover:bg-primary hover:text-on-primary transition-none">
          Review
        </button>
      </header>

      {/* Main Layout: Split Screen */}
      <main className="flex-1 flex flex-col md:flex-row w-full max-w-[1920px] mx-auto border-x-thick border-primary relative">
        {/* Left Pane: Input (1/3) */}
        <motion.aside 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full md:w-1/3 border-b-thick md:border-b-0 md:border-r-thick border-primary flex flex-col bg-surface relative min-h-[500px]"
        >
          <div className="absolute top-2 left-2 text-primary font-code-md text-[14px] opacity-30 pointer-events-none">+</div>
          <div className="absolute top-2 right-2 text-primary font-code-md text-[14px] opacity-30 pointer-events-none">+</div>
          <div className="p-margin-edge flex-1 flex flex-col">
            <h1 className="font-headline-lg text-[48px] leading-tight font-black uppercase tracking-tighter border-b-thick border-primary pb-unit mb-gutter">
              New Architecture<br />Review
            </h1>
            <div className="flex-1 flex flex-col group">
              <label className="font-code-md text-[14px] text-secondary uppercase mb-unit flex justify-between" htmlFor="architecture-input">
                <span>Input Hypothesis</span>
                <span className="text-primary font-bold opacity-0 group-focus-within:opacity-100 transition-none">[ACTIVE]</span>
              </label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className={`w-full flex-1 min-h-[300px] border-thick p-gutter font-code-md text-[14px] bg-surface-container-lowest text-primary resize-none focus:outline-none focus:ring-0 focus:border-primary rounded-none placeholder:text-outline ${isOverLimit ? 'border-error text-error' : 'border-primary'}`}
                id="architecture-input" 
                placeholder="Describe your technical constraints, anticipated scale, and core functional requirements here. Use explicit technical language for optimal parsing."
              ></textarea>
              <div className="flex justify-between items-center mt-unit">
                <label className="flex items-center gap-unit cursor-pointer group/cb">
                  <div className="w-5 h-5 border-thick border-primary flex items-center justify-center bg-surface-container-lowest group-hover/cb:bg-surface-variant transition-none relative">
                    <input 
                      checked={isPrivate}
                      onChange={(e) => setIsPrivate(e.target.checked)}
                      className="absolute opacity-0 w-full h-full cursor-pointer peer" 
                      type="checkbox" 
                    />
                    <div className="w-3 h-3 bg-primary hidden peer-checked:block"></div>
                  </div>
                  <span className="font-code-md text-[14px] text-primary">Keep brief private</span>
                </label>
                <span className={`font-code-md text-[14px] tracking-widest ${isOverLimit ? 'text-error font-bold' : 'text-secondary'}`}>{wordCount} / 150</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => handleSubmit()}
            disabled={isPending || !prompt.trim() || isOverLimit}
            className="w-full bg-primary text-on-primary p-margin-edge border-t-thick border-primary hover:bg-surface-container-lowest hover:text-primary transition-none flex justify-between items-center group relative overflow-hidden disabled:opacity-50 disabled:hover:bg-primary disabled:hover:text-on-primary disabled:cursor-not-allowed"
          >
            <span className="font-headline-md text-[32px] leading-[0.95] font-black uppercase tracking-tighter relative z-10 text-left">
              {isPending ? 'Analyzing...' : isOverLimit ? 'Limit Exceeded' : 'Run\nArchitecture\nReview'}
            </span>
            <span className={`material-symbols-outlined text-[64px] relative z-10 transition-transform duration-0 ${isPending ? 'animate-spin' : 'group-hover:rotate-90'}`}>
              {isPending ? 'progress_activity' : 'arrow_forward'}
            </span>
          </button>
        </motion.aside>

        {/* Right Pane: Output Canvas (2/3) */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          className="w-full md:w-2/3 bg-surface-container-lowest flex flex-col p-margin-edge gap-margin-edge relative blueprint-dots-bg min-h-screen"
        >
          {/* Canvas Header */}
          <div className="flex justify-between items-end border-b-thick border-primary pb-unit bg-surface-container-lowest relative z-10">
            <div>
              <div className="font-code-md text-[14px] text-secondary mb-1 uppercase tracking-widest">OUTPUT CANVAS // SYS-GEN</div>
              <h2 className="font-headline-md text-[24px] font-black uppercase tracking-tighter">Architecture Specification</h2>
            </div>
            <div className={`font-label-caps text-[12px] border-thick border-primary px-unit py-1 uppercase flex items-center gap-2 ${!result ? 'bg-surface-variant text-primary' : (result.status === 'success' ? 'bg-[#00ff00] text-primary' : 'bg-surface-variant text-primary')}`}>
              Status: {isPending ? 'Processing' : result ? (result.status === 'success' ? 'Generated' : 'Awaiting Input') : 'Idle'}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!result && !error && !isPending && (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-surface-container-lowest border-thick border-primary shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative z-10 min-h-[400px]"
              >
                <span className="material-symbols-outlined text-[48px] text-primary mb-4 opacity-30">science</span>
                <h3 className="text-primary font-bold text-[24px] uppercase font-headline-md tracking-tighter">Awaiting Parameters</h3>
                <p className="text-secondary text-[14px] mt-2 font-code-md max-w-md">Input technical constraints on the left and initialize the generation sequence.</p>
              </motion.div>
            )}

            {isPending && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex-1 flex flex-col relative z-10"
              >
                <div className="border-thick border-primary bg-surface-container-lowest p-8 flex flex-col items-center justify-center min-h-[400px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <span className="material-symbols-outlined text-[64px] text-primary animate-spin mb-6">progress_activity</span>
                  <span className="font-code-md text-[14px] uppercase text-primary tracking-widest font-bold">Synthesizing Architecture...</span>
                </div>
              </motion.div>
            )}

            {error && !isPending && (
              <motion.div 
                key="error"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="border-thick border-error bg-error-container p-gutter flex items-start gap-3 shadow-[8px_8px_0px_0px_rgba(186,26,26,1)] relative z-10"
              >
                <span className="material-symbols-outlined text-error text-[24px]">error</span>
                <p className="text-[14px] font-bold text-on-error-container uppercase font-code-md">{error}</p>
              </motion.div>
            )}

            {result && result.status === 'uncertainty' && !isPending && (
              <motion.div 
                key="uncertainty"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="border-thick border-primary bg-surface-container-lowest relative z-10 flex flex-col shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
              >
                <div className="bg-primary text-on-primary font-label-caps text-[12px] px-unit py-unit border-b-thick border-primary flex items-center gap-unit uppercase">
                  <span className="material-symbols-outlined text-[16px]">help</span> Clarification Required
                </div>
                <div className="p-gutter border-b-thick border-primary bg-surface-variant font-code-md text-[14px] leading-relaxed">
                  {result.reason}
                </div>
                <div className="p-gutter flex flex-col gap-gutter">
                  <h3 className="font-label-caps text-[12px] text-primary uppercase border-b-thin border-primary pb-1 inline-block w-fit">Questions I Need Answered</h3>
                  <div className="space-y-6">
                    {result.questions.map((q, i) => (
                      <div key={i} className="flex flex-col gap-2">
                        <label className="flex items-start gap-3 font-code-md text-[14px] text-primary font-bold">
                          <span className="text-primary mt-0.5">Q{i+1}:</span> {q}
                        </label>
                        <input 
                          type="text"
                          value={answers[i] || ''}
                          onChange={(e) => setAnswers({...answers, [i]: e.target.value})}
                          placeholder="Your answer..."
                          className="w-full border-thick border-primary bg-surface p-3 font-code-md text-[14px] focus:outline-none focus:ring-0 focus:border-primary placeholder:text-outline transition-none rounded-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-gutter border-t-thick border-primary bg-surface flex justify-between items-center">
                  <span className="font-code-md text-[10px] text-error uppercase font-bold max-w-[200px]">Without these answers, recommendations have low confidence.</span>
                  <button 
                    onClick={handleRetryWithAnswers}
                    disabled={Object.values(answers).every(a => !a.trim())}
                    className="font-label-caps text-[12px] bg-primary text-on-primary px-6 py-3 uppercase hover:bg-surface-container-lowest hover:text-primary border-thick border-primary transition-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Update & Retry
                  </button>
                </div>
              </motion.div>
            )}

            {result && result.status === 'success' && !isPending && (
              <motion.div key="success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-margin-edge w-full">
                <ReviewMemo 
                  data={result.data} 
                  inputCapabilities={result.inputCapabilities} 
                  reviewId={result.reviewId}
                  onExportMarkdown={handleExport}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-surface border-t-thick border-primary flex flex-col md:flex-row justify-between items-center px-margin-edge py-gutter gap-unit z-50">
        <div className="font-label-caps text-[12px] text-primary uppercase">
          © 2024 TRADEOFF SYSTEMS. ALL RIGHTS RESERVED.
        </div>
        <div className="flex gap-gutter font-label-caps text-[12px] text-primary">
          <a className="no-underline hover:text-on-tertiary-container hover:underline transition-none uppercase" href="#">Documentation</a>
          <a className="no-underline hover:text-on-tertiary-container hover:underline transition-none uppercase" href="#">Methodology</a>
          <a className="no-underline hover:text-on-tertiary-container hover:underline transition-none uppercase" href="#">API</a>
          <a className="no-underline hover:text-on-tertiary-container hover:underline transition-none uppercase" href="#">Privacy</a>
        </div>
      </footer>
    </div>
  );
}

function Loader({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
  );
}
