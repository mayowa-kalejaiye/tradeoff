'use client';

import { useState, useTransition, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { processArchitectureRequest, getReviewInputById } from './actions';
import { EngineResponse } from '@/engine/types';
import { ReviewMemo } from '@/components/ReviewMemo';
import { 
  Terminal, Server, Layers, Cpu, Database, Cloud, 
  CheckCircle2, XCircle, AlertTriangle, ChevronRight, Zap,
  DollarSign, Activity, HelpCircle, MessagesSquare, FileText,
  Search, Bell, User, LayoutTemplate, Download
} from 'lucide-react';

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-50 flex items-center justify-center"><Loader className="w-6 h-6 text-zinc-400 animate-spin" /></div>}>
      <HomeEditor />
    </Suspense>
  );
}

function HomeEditor() {
  const searchParams = useSearchParams();
  const remixId = searchParams.get('remix');

  const [prompt, setPrompt] = useState('');
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<EngineResponse | null>(null);
  const [error, setError] = useState('');
  const [answers, setAnswers] = useState<Record<number, string>>({});

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isOverLimit) return;

    setError('');
    setResult(null);

    startTransition(async () => {
      try {
        const output = await processArchitectureRequest(prompt);
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
        const output = await processArchitectureRequest(newPrompt);
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

    if (data.stack?.length) {
      md.push(`\n### Implementation Overview`);
      md.push(`**Core Stack:**`);
      data.stack.forEach((s: any) => md.push(`- ${s.name} (${s.category})`));
    }

    if (data.deployment?.length) {
      md.push(`\n**Target Deployment:**`);
      data.deployment.forEach((d: string) => md.push(`- ${d}`));
    }

    if (data.operatingCostDrivers?.length) {
      md.push(`\n**Estimated Operating Cost Drivers:**`);
      data.operatingCostDrivers.forEach((c: string) => md.push(`- ${c}`));
    }

    if (data.failureModes?.length) {
      md.push(`\n### Failure Modes`);
      data.failureModes.forEach((f: any) => {
        md.push(`• **${f.component}**`);
        md.push(`→ ${f.impact}\n`);
      });
    }

    md.push(`\n## Layer 2: Domain-Specific Intelligence`);

    if (data.domainBlindSpots?.length) {
      md.push(`\n### Domain Blind Spots`);
      data.domainBlindSpots.forEach((b: string) => md.push(`- ${b}`));
    }
    
    if (data.businessRisks?.length) {
      md.push(`\n### Existential Business Risks`);
      data.businessRisks.forEach((r: any) => {
        md.push(`**${r.risk}** (Severity: ${r.level}, Likelihood: ${r.likelihood})`);
        md.push(`${r.reason}\n`);
      });
    }

    if (data.domainConstraints?.length) {
      md.push(`\n### Hard Domain Constraints`);
      data.domainConstraints.forEach((c: string) => md.push(`- ${c}`));
    }

    if (data.coreValidationQuestions?.length) {
      md.push(`\n### What We Would Validate First`);
      data.coreValidationQuestions.forEach((q: string) => md.push(`- ${q}`));
    }

    if (data.criticalUnknowns?.length) {
      md.push(`\n### Critical Unknowns`);
      data.criticalUnknowns.forEach((q: string) => md.push(`- ${q}`));
    }

    if (data.strategicAdvantages?.length) {
      md.push(`\n### Strategic Advantages`);
      data.strategicAdvantages.forEach((a: string) => md.push(`- ${a}`));
    }

    md.push(`\n## Layer 3: Architectural Nuance`);

    if (data.deferredDecisions?.length) {
      md.push(`\n### Intentionally Deferred`);
      data.deferredDecisions.forEach((d: any) => {
        md.push(`**${d.name}**`);
        md.push(`${d.reason}\n`);
      });
    }

    if (data.architectureDebt?.length) {
      md.push(`\n### Accepted Debt`);
      data.architectureDebt.forEach((d: any) => {
        md.push(`**${d.debt}**`);
        md.push(`${d.reason}\n`);
      });
    }

    if (data.assumptions?.length) {
      md.push(`\n### Core Assumptions`);
      data.assumptions.forEach((a: string) => md.push(`- ${a}`));
    }
    if (data.assumptionRisk) {
      md.push(`\n**Risk Analysis (${data.assumptionRisk.level}):** ${data.assumptionRisk.reason}`);
    }

    if (data.nonNegotiables?.length) {
      md.push(`\n### Non-Negotiable Infrastructure`);
      data.nonNegotiables.forEach((c: string) => md.push(`- ${c}`));
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
    <div className="flex flex-col min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-indigo-500/20">
      
      {/* Top Navbar */}
      <nav className="h-14 bg-white border-b border-zinc-200 flex items-center justify-between px-4 sm:px-6 shrink-0 z-20 sticky top-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-zinc-900 rounded-md flex items-center justify-center shadow-sm">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm tracking-tight text-zinc-900">AI Architect</span>
          </div>
          
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 hover:bg-zinc-100 rounded-md cursor-pointer transition-colors border border-transparent hover:border-zinc-200">
            <LayoutTemplate className="w-4 h-4 text-zinc-500" />
            <span className="text-sm font-medium text-zinc-600">Personal Workspace</span>
            <span className="bg-zinc-200 text-zinc-500 text-[10px] px-1.5 py-0.5 rounded font-mono ml-2 border border-zinc-300 shadow-sm">PRO</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex relative group">
            <Search className="w-4 h-4 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search past reviews..." 
              className="w-64 h-8 pl-9 pr-3 bg-zinc-50 border border-zinc-200 rounded-md text-sm placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-300 transition-shadow"
            />
          </div>
          <button className="p-1.5 text-zinc-400 hover:text-zinc-600 transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 border border-zinc-200 shadow-sm overflow-hidden flex items-center justify-center text-white text-xs font-bold ring-2 ring-white cursor-pointer hover:opacity-90 transition-opacity">
            JS
          </div>
        </div>
      </nav>

      {/* Main Split Layout */}
      <div className="flex flex-col lg:flex-row flex-grow lg:overflow-hidden lg:h-[calc(100vh-3.5rem)]">
        
        {/* LEFT PANE: The Brief (Subtle Background) */}
        <div className="lg:w-1/3 bg-zinc-50 lg:border-r border-zinc-200 lg:h-full lg:overflow-y-auto flex flex-col p-6 lg:p-10 shrink-0">
          <header className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 mb-2">New Architecture Review</h1>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Describe your constraints. The engine will evaluate tradeoffs and return a formal technical brief.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
            <div className="flex flex-col flex-grow mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Project Brief</label>
                <span className={`text-xs font-medium ${isOverLimit ? 'text-red-500 font-bold' : 'text-zinc-400'}`}>
                  {wordCount} / 150 words
                </span>
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                maxLength={1000}
                placeholder="e.g., We're building an internal HR platform. 50 engineers. Expected users: 3,000 employees. Priority: reliability..."
                className={`w-full flex-grow p-4 bg-white border shadow-sm rounded-lg focus:ring-1 transition-all resize-none outline-none text-zinc-900 placeholder-zinc-400 text-sm leading-relaxed min-h-[200px] ${
                  isOverLimit ? 'border-red-300 focus:border-red-400 focus:ring-red-400' : 'border-zinc-200 focus:border-zinc-400 focus:ring-zinc-400'
                }`}
                spellCheck="false"
              />
            </div>
            
            <button
              type="submit"
              onClick={(e) => {
                if (isPending || !prompt.trim() || isOverLimit) {
                  e.preventDefault();
                }
              }}
              className={`w-full flex items-center justify-center gap-2 h-10 rounded-md font-medium transition-colors text-sm shadow-sm ${
                isPending || !prompt.trim() || isOverLimit
                  ? 'bg-zinc-800 text-zinc-400 cursor-not-allowed opacity-50'
                  : 'bg-zinc-900 text-white hover:bg-zinc-800'
              }`}
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                    <Loader className="w-4 h-4" />
                  </motion.div>
                  Running Review...
                </span>
              ) : isOverLimit ? (
                <>
                  <AlertTriangle className="w-4 h-4" />
                  Word Limit Exceeded
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  Run Architecture Review
                </>
              )}
            </button>
          </form>
        </div>

        {/* RIGHT PANE: The Report (Pristine White) */}
        <div className="lg:w-2/3 bg-white lg:h-full lg:overflow-y-auto relative">
          <AnimatePresence mode="wait">
            
            {/* Empty State */}
            {!result && !error && !isPending && (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-center p-8"
              >
                <div className="w-12 h-12 mb-4 rounded-full bg-zinc-50 flex items-center justify-center border border-zinc-100 shadow-sm">
                  <Activity className="w-5 h-5 text-zinc-300" />
                </div>
                <h3 className="text-zinc-900 font-medium text-sm">No review started</h3>
                <p className="text-zinc-500 text-sm mt-1">Submit your project brief to begin the tradeoff analysis.</p>
              </motion.div>
            )}

            {/* Skeleton Loading State */}
            {isPending && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="p-8 lg:p-16 max-w-4xl mx-auto w-full space-y-10"
              >
                {/* Header Skeleton */}
                <div className="space-y-4 border-b border-zinc-100 pb-8">
                  <div className="flex justify-between items-center">
                    <div className="h-6 w-32 bg-zinc-100 rounded animate-pulse"></div>
                    <div className="h-4 w-24 bg-zinc-100 rounded animate-pulse"></div>
                  </div>
                  <div className="h-10 w-3/4 bg-zinc-100 rounded animate-pulse"></div>
                  <div className="h-20 w-full bg-zinc-50 rounded animate-pulse mt-4"></div>
                </div>

                {/* Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="h-32 bg-zinc-50 rounded-lg animate-pulse border-l-4 border-zinc-200"></div>
                  <div className="h-32 bg-zinc-50 rounded-lg animate-pulse border-l-4 border-zinc-200"></div>
                </div>

                {/* List Skeleton */}
                <div className="space-y-4">
                  <div className="h-6 w-48 bg-zinc-100 rounded animate-pulse mb-6"></div>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-zinc-50 rounded animate-pulse"></div>
                      <div className="space-y-2 flex-grow">
                        <div className="h-4 w-1/3 bg-zinc-100 rounded animate-pulse"></div>
                        <div className="h-3 w-1/4 bg-zinc-50 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Error State */}
            {error && !isPending && (
              <motion.div 
                key="error"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="m-8 lg:m-16 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-start gap-3 shadow-sm"
              >
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{error}</p>
              </motion.div>
            )}

            {/* Uncertainty / Pushback State */}
            {result && result.status === 'uncertainty' && !isPending && (
              <motion.div 
                key="uncertainty"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="p-8 lg:p-16 max-w-2xl mx-auto space-y-6"
              >
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                      <HelpCircle className="w-5 h-5 text-amber-600" />
                    </div>
                    <h2 className="text-xl font-bold text-amber-900 tracking-tight">Clarification Required</h2>
                  </div>
                  <p className="text-amber-800/90 text-sm leading-relaxed mb-6 font-medium">
                    {result.reason}
                  </p>
                  
                  <div className="bg-white rounded-md border border-amber-100 p-5 space-y-4">
                    <h3 className="text-xs font-bold text-amber-600 uppercase tracking-wider flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Questions I Need Answered
                    </h3>
                    <ul className="space-y-4">
                      {result.questions.map((q, i) => (
                        <li key={i} className="flex flex-col gap-2">
                          <label className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></div>
                            <span className="text-sm font-medium text-zinc-800 leading-snug">{q}</span>
                          </label>
                          <input 
                            type="text"
                            value={answers[i] || ''}
                            onChange={(e) => setAnswers({...answers, [i]: e.target.value})}
                            placeholder="Your answer..."
                            className="w-full ml-4.5 bg-zinc-50 border border-amber-200 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-md text-sm p-2.5 outline-none transition-all placeholder-zinc-400 text-zinc-900"
                          />
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-amber-200/50 flex items-center justify-between">
                    <p className="text-xs text-amber-700/70 italic">
                      Without these answers, any architecture recommendation has low confidence.
                    </p>
                    <button 
                      onClick={handleRetryWithAnswers}
                      disabled={Object.values(answers).every(a => !a.trim())}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-md shadow-sm transition-colors"
                    >
                      Update Brief & Retry
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Success State */}
            {result && result.status === 'success' && !isPending && (
              <ReviewMemo 
                data={result.data} 
                inputArchetypes={result.inputArchetypes} 
                reviewId={result.reviewId}
                onExportMarkdown={handleExport}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
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
