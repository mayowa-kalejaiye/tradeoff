'use client';

import { useState, useTransition, useEffect, Suspense, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { processArchitectureRequest, getReviewInputById } from '../actions';
import { EngineResponse } from '@/engine/types';
import { ReviewMemo } from '@/components/ReviewMemo';

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center"><Loader className="w-6 h-6 text-[#000000] animate-spin" /></div>}>
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
    <div className="bg-[#f9f9f9] text-[#000000] font-sans selection:bg-[#000000] selection:text-[#ffffff] min-h-screen flex flex-col">
      {/* TopAppBar */}
      <header className={`w-full top-0 sticky bg-[#ffffff] border-b-[2px] border-[#000000] flex justify-between items-center px-4 md:px-[40px] h-20 max-w-full z-50 transition-transform duration-300 ease-in-out ${isNavVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="Tradeoff Logo" className="w-8 h-8" />
          <div className="font-sans text-[24px] tracking-tighter font-black text-[#000000] uppercase mt-1 hidden sm:block">
            TRADEOFF
          </div>
        </div>
        <button className="font-mono text-[12px] font-bold border-[2px] border-[#000000] px-4 py-2 uppercase tracking-widest text-[#000000] hover:bg-[#000000] hover:text-[#ffffff] transition-none bg-[#ffffff] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]">
          REVIEW
        </button>
      </header>

      {/* Main Layout: Split Screen (Stacks on mobile) */}
      <main className="flex-1 flex flex-col lg:flex-row w-full max-w-[1920px] mx-auto border-x-[2px] border-[#000000] relative">
        {/* Left Pane: Input (1/3 on desktop, full on mobile) */}
        <motion.aside 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full lg:w-1/3 border-b-[2px] lg:border-b-0 lg:border-r-[2px] border-[#000000] flex flex-col bg-[#ffffff] relative min-h-[500px]"
        >
          <div className="absolute top-2 left-2 text-[#000000] font-mono text-[14px] opacity-30 pointer-events-none">+</div>
          <div className="absolute top-2 right-2 text-[#000000] font-mono text-[14px] opacity-30 pointer-events-none">+</div>
          
          <div className="p-6 md:p-[40px] flex-1 flex flex-col">
            <h1 className="font-sans text-[32px] md:text-[48px] leading-[0.9] font-black uppercase tracking-tighter border-b-[2px] border-[#000000] pb-4 mb-6">
              NEW ARCHITECTURE<br />REVIEW
            </h1>
            <div className="flex-1 flex flex-col group">
              <label className="font-mono font-bold text-[12px] md:text-[14px] text-[#5d5f5f] uppercase tracking-widest mb-2 flex justify-between" htmlFor="architecture-input">
                <span>INPUT_HYPOTHESIS</span>
                <span className="text-[#000000] font-bold opacity-0 group-focus-within:opacity-100 transition-none">[ACTIVE]</span>
              </label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className={`w-full flex-1 min-h-[250px] md:min-h-[300px] border-[2px] p-4 font-code-md text-[14px] md:text-[16px] bg-[#f9f9f9] text-[#000000] resize-none focus:outline-none focus:ring-0 focus:border-[#000000] focus:bg-[#ffffff] rounded-none placeholder:text-[#5d5f5f] ${isOverLimit ? 'border-error text-error' : 'border-[#000000]'}`}
                id="architecture-input" 
                placeholder="DESCRIBE YOUR TECHNICAL CONSTRAINTS, ANTICIPATED SCALE, AND CORE FUNCTIONAL REQUIREMENTS HERE."
              ></textarea>
              <div className="flex justify-between items-center mt-4">
                <label className="flex items-center gap-2 cursor-pointer group/cb">
                  <div className="w-5 h-5 border-[2px] border-[#000000] flex items-center justify-center bg-[#ffffff] group-hover/cb:bg-[#e8e8e8] transition-none relative">
                    <input 
                      checked={isPrivate}
                      onChange={(e) => setIsPrivate(e.target.checked)}
                      className="absolute opacity-0 w-full h-full cursor-pointer peer" 
                      type="checkbox" 
                    />
                    <div className="w-3 h-3 bg-[#000000] hidden peer-checked:block"></div>
                  </div>
                  <span className="font-mono text-[12px] font-bold text-[#000000] uppercase tracking-widest">KEEP_PRIVATE</span>
                </label>
                <span className={`font-mono text-[12px] tracking-widest ${isOverLimit ? 'text-error font-bold' : 'text-[#5d5f5f]'}`}>{wordCount} / 150</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => handleSubmit()}
            disabled={isPending || !prompt.trim() || isOverLimit}
            className="w-full bg-[#f9f9f9] text-[#000000] p-6 md:p-8 border-t-[2px] border-[#000000] hover:bg-[#e8e8e8] transition-none flex flex-col items-center justify-center group relative overflow-hidden disabled:opacity-50 disabled:hover:bg-[#f9f9f9] disabled:cursor-not-allowed"
          >
            <span className="font-sans text-[24px] md:text-[32px] leading-[1.1] font-black uppercase tracking-tighter relative z-10 text-center whitespace-pre-line">
              {isPending ? 'ANALYZING...' : isOverLimit ? 'LIMIT EXCEEDED' : 'RUN ARCHITECTURE\nREVIEW'}
            </span>
          </button>
        </motion.aside>

        {/* Right Pane: Output Canvas (2/3 on desktop, full on mobile) */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          className="w-full lg:w-2/3 bg-[#f9f9f9] flex flex-col p-4 md:p-[40px] gap-6 md:gap-[40px] relative blueprint-bg min-h-screen"
        >
          {/* Canvas Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b-[2px] border-[#000000] pb-4 bg-[#ffffff] border-[2px] p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative z-10 gap-4 sm:gap-0">
            <div className="flex-1 pr-2">
              <div className="font-mono font-bold text-[10px] sm:text-[12px] text-[#5d5f5f] mb-1 uppercase tracking-widest">OUTPUT CANVAS // SYS-GEN</div>
              <h2 className="font-sans text-[18px] sm:text-[20px] lg:text-[24px] font-black uppercase tracking-tighter truncate">Architecture Specification</h2>
            </div>
            <div className={`shrink-0 font-mono font-bold text-[10px] sm:text-[12px] border-[2px] border-[#000000] px-3 py-1 uppercase tracking-widest flex items-center gap-2 ${!result ? 'bg-[#ffffff] text-[#000000]' : (result.status === 'success' ? 'bg-[#00ff00] text-[#000000]' : 'bg-amber-400 text-[#000000]')}`}>
              STATUS: {isPending ? 'PROCESSING' : result ? (result.status === 'success' ? 'GENERATED' : 'AWAITING_INPUT') : 'IDLE'}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!result && !error && !isPending && (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-[#ffffff] border-[2px] border-[#000000] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative z-10 min-h-[400px]"
              >
                <span className="material-symbols-outlined text-[64px] text-[#000000] mb-4 opacity-10">science</span>
                <h3 className="text-[#000000] font-black text-[24px] uppercase font-sans tracking-tighter">Awaiting Parameters</h3>
                <p className="text-[#5d5f5f] font-mono text-[12px] uppercase tracking-widest mt-2 max-w-md">Input technical constraints on the left and initialize the generation sequence.</p>
              </motion.div>
            )}

            {isPending && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex-1 flex flex-col relative z-10"
              >
                <div className="border-[2px] border-[#000000] bg-[#ffffff] p-8 flex flex-col items-center justify-center min-h-[400px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <span className="material-symbols-outlined text-[64px] text-[#000000] animate-spin mb-6">progress_activity</span>
                  <span className="font-mono text-[14px] uppercase text-[#000000] tracking-widest font-bold">SYNTHESIZING_ARCHITECTURE...</span>
                </div>
              </motion.div>
            )}

            {error && !isPending && (
              <motion.div 
                key="error"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="border-[2px] border-error bg-error-container p-6 flex items-start gap-4 shadow-[8px_8px_0px_0px_rgba(186,26,26,1)] relative z-10"
              >
                <span className="material-symbols-outlined text-error text-[32px]">error</span>
                <p className="text-[14px] font-bold text-error uppercase font-mono tracking-widest leading-relaxed mt-1">{error}</p>
              </motion.div>
            )}

            {result && result.status === 'uncertainty' && !isPending && (
              <motion.div 
                key="uncertainty"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="border-[2px] border-[#000000] bg-[#ffffff] relative z-10 flex flex-col shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
              >
                <div className="bg-[#000000] text-[#ffffff] font-mono font-bold tracking-widest text-[12px] px-4 py-3 border-b-[2px] border-[#000000] flex items-center gap-2 uppercase">
                  <span className="material-symbols-outlined text-[16px]">help</span> CLARIFICATION_REQUIRED
                </div>
                <div className="p-6 border-b-[2px] border-[#000000] bg-[#f9f9f9] font-code-md text-[14px] text-[#000000] leading-relaxed border-l-4 border-l-amber-400">
                  {result.reason}
                </div>
                <div className="p-6 flex flex-col gap-6">
                  <h3 className="font-mono font-bold tracking-widest text-[12px] text-[#000000] uppercase border-b-[2px] border-[#000000] pb-2 inline-block w-fit">QUESTIONS I NEED ANSWERED:</h3>
                  <div className="space-y-6">
                    {result.questions.map((q, i) => (
                      <div key={i} className="flex flex-col gap-2">
                        <label className="flex items-start gap-3 font-code-md text-[14px] text-[#000000] font-bold">
                          <span className="text-[#000000] bg-[#e8e8e8] px-2 py-1 border-[1px] border-[#000000] font-mono text-[10px]">Q{i+1}:</span> {q}
                        </label>
                        <input 
                          type="text"
                          value={answers[i] || ''}
                          onChange={(e) => setAnswers({...answers, [i]: e.target.value})}
                          placeholder="ENTER ANSWER..."
                          className="w-full border-[2px] border-[#000000] bg-[#ffffff] p-3 font-code-md text-[14px] focus:outline-none focus:ring-0 focus:border-[#000000] focus:bg-[#f9f9f9] placeholder:text-[#5d5f5f] uppercase transition-none rounded-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-6 border-t-[2px] border-[#000000] bg-[#ffffff] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <span className="font-mono text-[10px] text-error uppercase font-bold tracking-widest max-w-[250px] border-[1px] border-error p-2 bg-error-container">WARNING: WITHOUT THESE ANSWERS, RECOMMENDATIONS HAVE LOW CONFIDENCE.</span>
                  <button 
                    onClick={handleRetryWithAnswers}
                    disabled={Object.values(answers).every(a => !a.trim())}
                    className="w-full sm:w-auto font-mono font-bold tracking-widest text-[12px] bg-[#000000] text-[#ffffff] px-6 py-3 uppercase hover:bg-[#ffffff] hover:text-[#000000] border-[2px] border-[#000000] transition-none disabled:opacity-50 disabled:cursor-not-allowed shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]"
                  >
                    UPDATE & RETRY
                  </button>
                </div>
              </motion.div>
            )}

            {result && result.status === 'success' && !isPending && (
              <motion.div key="success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-6 w-full">
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
      <footer className="w-full bg-[#ffffff] border-t-[2px] border-[#000000] flex flex-col md:flex-row justify-between items-center px-4 md:px-[40px] py-6 gap-4 z-50 text-[#000000]">
        <div className="font-mono text-[10px] md:text-[12px] uppercase tracking-widest font-bold">
          © 2026 TRADEOFF SYSTEMS. ALL RIGHTS RESERVED.
        </div>
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 font-mono text-[10px] md:text-[12px] font-bold tracking-widest">
          <a className="no-underline hover:text-[#ba1a1a] hover:underline transition-none uppercase" href="#">DOCUMENTATION</a>
          <a className="no-underline hover:text-[#ba1a1a] hover:underline transition-none uppercase" href="/methodology">METHODOLOGY</a>
          <a className="no-underline hover:text-[#ba1a1a] hover:underline transition-none uppercase" href="/changelog">CHANGELOG</a>
          <a className="no-underline hover:text-[#ba1a1a] hover:underline transition-none uppercase" href="/privacy">PRIVACY</a>
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
