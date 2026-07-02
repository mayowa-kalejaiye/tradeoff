'use client';

import { motion, Variants } from 'framer-motion';
import { 
  Download, Layers, AlertTriangle, CheckCircle2, HelpCircle, 
  XCircle, Server, Zap, ChevronRight, Share, Sparkles, Activity,
  ActivityIcon, Target, Box
} from 'lucide-react';
import { ArchitectureOutput } from '@/engine/types';

interface ReviewMemoProps {
  data: ArchitectureOutput;
  inputCapabilities?: { name: string; score: number; source: 'llm' | 'deterministic' }[];
  reviewId?: string;
  onExportMarkdown?: () => void;
}

const SYSTEM_METADATA: Record<string, { name: string; purpose: string; whyItExists: string; dependsOn: string[] }> = {
  'edge_runtime': {
    name: 'Edge Runtime',
    purpose: 'Guarantees deterministic execution and offline autonomy at the edge.',
    whyItExists: 'Robots must operate locally without network dependency to prevent physical damage or deadlocks.',
    dependsOn: []
  },
  'fleet_communications': {
    name: 'Fleet Communications',
    purpose: 'Facilitates reliable, low-bandwidth synchronization between offline-first agents and the cloud.',
    whyItExists: 'Hospitals have intermittent WiFi. Connections drop continuously, requiring robust buffering and pub/sub.',
    dependsOn: ['edge_runtime']
  },
  'observability': {
    name: 'Safety & Observability',
    purpose: 'Provides cryptographically verifiable logs and immediate fault detection.',
    whyItExists: 'Medical devices are highly regulated. When a robot fails, we must prove what the software knew and when.',
    dependsOn: ['fleet_communications']
  },
  'mission_control': {
    name: 'Mission Control',
    purpose: 'Coordinates fleet-wide tasks, traffic, and hospital API integration.',
    whyItExists: 'Robots cannot optimize fleet-level routing or predict elevator schedules locally.',
    dependsOn: ['fleet_communications']
  }
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.05, duration: 0.4, ease: 'easeOut' }
  })
};

export function ReviewMemo({ data, inputCapabilities, reviewId }: ReviewMemoProps) {
  
  const handlePrint = () => window.print();

  const handleCopyLink = async () => {
    if (reviewId) {
      const url = `${window.location.origin}/r/${reviewId}`;
      await navigator.clipboard.writeText(url);
      alert('Share link copied to clipboard!');
    }
  };

  return (
    <motion.div 
      initial="hidden" animate="visible"
      className="p-4 md:p-8 lg:p-12 max-w-[1400px] mx-auto min-h-screen bg-zinc-50 print:p-0 print:m-0"
    >
      <div className="bento-grid mb-12">
        {/* Header Block */}
        <motion.div variants={fadeUp} custom={1} className="col-span-12 lg:col-span-8 flex flex-col justify-end pb-8">
          <div className="flex items-center gap-3 mb-6 print:hidden">
            <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Formal Architecture Review</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-zinc-900 mb-4">
            {data.architectureStyle}
          </h2>

          <div className="flex flex-wrap gap-2 mt-4">
            {inputCapabilities && inputCapabilities
              .slice()
              .sort((a, b) => b.score - a.score)
              .map((arch, i) => (
              <div key={i} className="flex items-center gap-1.5 bg-white border border-zinc-200 px-3 py-1.5 rounded-full shadow-sm text-[11px] font-medium text-zinc-600">
                <Box className="w-3 h-3 text-indigo-400" />
                {arch.name.replace(/_/g, ' ')}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Actions Block */}
        <motion.div variants={fadeUp} custom={2} className="col-span-12 lg:col-span-4 flex items-end justify-start lg:justify-end pb-8 gap-3 print:hidden">
            {reviewId && (
              <button onClick={handleCopyLink} className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:border-zinc-300 hover:shadow-sm transition-all">
                <Share className="w-3.5 h-3.5" /> Copy Link
              </button>
            )}
            <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-zinc-900 rounded-lg hover:bg-zinc-800 shadow-md transition-all">
              <Download className="w-3.5 h-3.5" /> PDF Export
            </button>
        </motion.div>

        {/* Executive Summary */}
        <motion.div variants={fadeUp} custom={3} className="col-span-12 mb-12">
          <div className="border-t-4 border-black pt-6">
            <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-black mb-8">
              // Executive Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
              {data.recommended[0]?.reasons.map((reason, j) => (
                <p key={j} className="text-xl text-black leading-relaxed font-medium">
                  {reason}
                </p>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Pressure Map - Blueprint Metrics */}
        {data.pressureMap && data.pressureMap.length > 0 && (
          <motion.div variants={fadeUp} custom={4} className="col-span-12 mt-16">
            <div className="border-t-4 border-black pt-6 mb-8">
              <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-black">
                // Architecture Drivers
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[2px] bg-black border-t-2 border-b-2 border-black">
              {data.pressureMap.map((p, i) => (
                <div key={i} className="bg-zinc-50 p-6 flex flex-col justify-between">
                  <div>
                    <div className="font-mono text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">{p.dimension}</div>
                    <div className="text-5xl font-black tracking-tighter text-black mb-6">{p.pressure}%</div>
                  </div>
                  
                  <div className="w-full h-2 bg-zinc-200 mb-6">
                    <div 
                      className="h-full bg-black"
                      style={{ width: `${Math.min(100, p.pressure)}%` }}
                    />
                  </div>

                  {p.influencedDecisions && p.influencedDecisions.length > 0 && (
                    <div className="pt-4 border-t border-black/10 flex flex-wrap gap-2">
                      {p.influencedDecisions.slice(0,3).map((dec, idx) => (
                        <span key={idx} className="font-mono text-[9px] uppercase font-bold text-black border border-black px-1.5 py-0.5">
                          {dec.replace(/_/g, ' ')}
                        </span>
                      ))}
                      {p.influencedDecisions.length > 3 && (
                        <span className="font-mono text-[9px] font-bold text-zinc-400 px-1 py-0.5">+{p.influencedDecisions.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Existential Risks */}
        {data.businessRisks && data.businessRisks.length > 0 && (
          <motion.div variants={fadeUp} custom={5} className="col-span-12 mt-16">
            <div className="border-t-4 border-black pt-6 mb-8">
              <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-black">
                // Risk Analysis
              </h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[2px] bg-black border-t-2 border-b-2 border-black">
              {data.businessRisks.map((risk, i) => (
                <div key={i} className="bg-zinc-50 p-8 flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <h4 className="text-2xl font-bold text-black tracking-tight">{risk.risk}</h4>
                    <span className="font-mono text-xs font-bold px-3 py-1 bg-black text-white uppercase tracking-widest shrink-0 ml-4">
                      SEV: {risk.level}
                    </span>
                  </div>
                  
                  <p className="text-base text-zinc-800 leading-relaxed font-medium mb-8 flex-1">{risk.reason}</p>

                  {risk.trace?.patched && (
                    <div className="mt-auto pt-6 border-t border-black/10">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-xs font-bold text-black uppercase tracking-[0.2em] flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-black"></span> AI Insight
                        </span>
                      </div>
                      <p className="text-sm text-zinc-600 leading-relaxed font-serif italic mb-4">"{risk.trace.reason}"</p>
                      {risk.trace.evidence && (
                        <div className="flex flex-wrap gap-2">
                          {risk.trace.evidence.map((ev, eIdx) => (
                            <span key={eIdx} className="font-mono text-[10px] text-black uppercase border border-black px-2 py-1">{ev}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Core Architecture */}
        {data.decisionCards && data.decisionCards.length > 0 && (
          <motion.div variants={fadeUp} custom={6} className="col-span-12 mt-16">
            <div className="border-t-4 border-black pt-6 mb-12">
              <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-black">
                // System Topology
              </h3>
            </div>
            
            {Object.entries(
              data.decisionCards.reduce((acc, card) => {
                if (!acc[card.systemGroup]) acc[card.systemGroup] = [];
                acc[card.systemGroup].push(card);
                return acc;
              }, {} as Record<string, typeof data.decisionCards>)
            ).map(([group, cards], gIdx) => (
              <div key={group} className="mb-16">
                
                {/* Group Header */}
                {SYSTEM_METADATA[group] ? (
                  <div className="mb-8">
                    <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-4xl font-black text-black tracking-tighter uppercase mb-3">{SYSTEM_METADATA[group].name}</h4>
                        <p className="text-lg text-zinc-600 font-medium max-w-2xl">{SYSTEM_METADATA[group].purpose}</p>
                      </div>
                      {SYSTEM_METADATA[group].dependsOn.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                          {SYSTEM_METADATA[group].dependsOn.map(dep => (
                            <div key={dep} className="font-mono flex items-center gap-2 text-[10px] uppercase font-bold text-black border-2 border-black px-3 py-1.5 shrink-0">
                              DEPENDS: {SYSTEM_METADATA[dep]?.name || dep}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <h4 className="text-4xl font-black text-black tracking-tighter uppercase mb-8">
                    {group.replace(/_/g, ' ')}
                  </h4>
                )}
                
                {/* Cards Blueprint Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-[2px] bg-black border-t-2 border-b-2 border-black">
                  {cards.map((card, i) => {
                    const isSingleCard = cards.length === 1;
                    const colSpan = isSingleCard ? 'lg:col-span-12' : (card.rationale?.length > 150 ? 'lg:col-span-8' : 'lg:col-span-4');
                    
                    return (
                    <div 
                      key={i} 
                      className={`bg-zinc-50 p-8 flex flex-col col-span-1 ${colSpan}`}
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h5 className="text-3xl font-bold text-black tracking-tighter mb-2">{card.recommendation}</h5>
                          {card.capability && (
                            <div className="font-mono text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                              // {card.capability.replace(/_/g, ' ')}
                            </div>
                          )}
                        </div>
                        <span className="font-mono text-[10px] uppercase font-bold tracking-widest px-2 py-1 border border-black text-black shrink-0 ml-4">
                          {card.stability}
                        </span>
                      </div>

                      {card.rationale && (
                        <p className="text-base text-zinc-800 leading-relaxed font-medium mb-8 flex-1">
                          {card.rationale}
                        </p>
                      )}

                      <div className="mt-auto space-y-8">
                        {(card.winsWhen?.length || card.losesWhen?.length) ? (
                          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 pt-6 border-t border-black/10">
                            {card.winsWhen && card.winsWhen.length > 0 && (
                              <div>
                                <div className="text-[10px] font-mono uppercase font-bold text-black tracking-widest mb-4">
                                  + Wins When
                                </div>
                                <ul className="text-sm text-zinc-600 space-y-3">
                                  {card.winsWhen.map((w, j) => (
                                    <li key={j} className="flex gap-3 items-start leading-snug">
                                      <span className="text-black shrink-0 font-mono">→</span>
                                      <span>{w}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {card.losesWhen && card.losesWhen.length > 0 && (
                              <div>
                                <div className="text-[10px] font-mono uppercase font-bold text-black tracking-widest mb-4">
                                  - Loses When
                                </div>
                                <ul className="text-sm text-zinc-600 space-y-3">
                                  {card.losesWhen.map((w, j) => (
                                    <li key={j} className="flex gap-3 items-start leading-snug">
                                      <span className="text-black shrink-0 font-mono">→</span>
                                      <span>{w}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ) : null}

                        {card.scaleLimit && (
                          <div className="pt-6 border-t border-black/10">
                            <div className="text-[10px] font-mono uppercase font-bold text-black tracking-widest mb-3">
                              ! Scale Limit
                            </div>
                            <div className="font-mono text-sm text-black font-bold mb-4 bg-zinc-100 p-3">
                              {card.scaleLimit.breaksFirst}
                            </div>
                            {card.scaleLimit.mitigations && card.scaleLimit.mitigations.length > 0 && (
                              <div className="space-y-2">
                                {card.scaleLimit.mitigations.map((m, mIdx) => (
                                  <div key={mIdx} className="flex gap-3 text-xs text-zinc-500 font-mono leading-snug">
                                    <span className="shrink-0">↳</span>
                                    <span>{m}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {card.alternatives && card.alternatives.length > 0 && (
                          <div className="pt-6 border-t border-black/10">
                            <div className="text-[10px] font-mono uppercase font-bold text-zinc-400 tracking-widest mb-4">
                              ? Why Not
                            </div>
                            <div className="space-y-4">
                              {card.alternatives.map((alt, idx) => (
                                <div key={idx}>
                                  <div className="font-mono text-zinc-400 text-xs font-bold line-through mb-1">{alt.name}</div>
                                  <div className="text-sm text-zinc-500 leading-relaxed italic">{alt.reason}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
