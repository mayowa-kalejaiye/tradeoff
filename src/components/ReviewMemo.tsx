'use client';

import { motion } from 'framer-motion';
import { 
  Download, Layers, AlertTriangle, CheckCircle2, HelpCircle, 
  XCircle, Server, Terminal, Database, Zap, Cpu, Cloud, ChevronRight, DollarSign, Share
} from 'lucide-react';
import { ArchitectureOutput, ArchetypeScore } from '@/engine/types';

interface ReviewMemoProps {
  data: ArchitectureOutput;
  inputArchetypes?: ArchetypeScore[];
  reviewId?: string;
  onExportMarkdown?: () => void;
}

export function ReviewMemo({ data, inputArchetypes, reviewId, onExportMarkdown }: ReviewMemoProps) {
  
  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = async () => {
    if (reviewId) {
      const url = `${window.location.origin}/r/${reviewId}`;
      await navigator.clipboard.writeText(url);
      alert('Share link copied to clipboard!');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="p-8 lg:p-16 max-w-4xl mx-auto space-y-12 print:p-0 print:m-0 print:space-y-8"
    >
      {/* Report Header */}
      <div className="border-b border-zinc-200 pb-8 print:pb-4">
        <div className="flex items-center justify-between mb-6 print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Review Memo</span>
          </div>
          <div className="flex items-center gap-2">
            {reviewId && (
              <button 
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-zinc-600 bg-white border border-zinc-200 rounded shadow-sm hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
              >
                <Share className="w-3.5 h-3.5" />
                Copy Link
              </button>
            )}
            <button 
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-zinc-600 bg-white border border-zinc-200 rounded shadow-sm hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export to PDF
            </button>
            {onExportMarkdown && (
              <button 
                onClick={onExportMarkdown}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-zinc-600 bg-white border border-zinc-200 rounded shadow-sm hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
              >
                <Terminal className="w-3.5 h-3.5" />
                Export MD
              </button>
            )}
          </div>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900 mb-4 flex items-center gap-3">
          <Layers className="text-indigo-500 shrink-0" />
          {data.architectureStyle}
        </h2>

        {inputArchetypes && inputArchetypes.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {inputArchetypes
              .slice()
              .sort((a, b) => b.score - a.score)
              .map((arch, i) => (
              <div key={i} className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-full shadow-sm print:shadow-none print:border-zinc-300">
                <span className="text-xs font-bold text-zinc-700 capitalize">{arch.name.replace(/_/g, ' ')}</span>
                <span className="text-amber-400 font-mono text-[10px] tracking-widest">{arch.score}</span>
              </div>
            ))}
          </div>
        )}
        
        <div className="pl-4 border-l-2 border-zinc-200 print:border-zinc-400">
          <p className="text-sm font-bold text-zinc-900 mb-2">Primary Reasoning:</p>
          <ul className="space-y-3">
            {data.recommended[0]?.reasons.map((reason, j) => (
              <li key={j} className="text-sm text-zinc-600 leading-relaxed print:text-black">
                {reason}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* --- LAYER 2: Domain-Specific Intelligence --- */}
      <div className="pt-6 print:pt-4 print:break-inside-avoid">
        <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-6 flex items-center gap-2 border-b border-zinc-100 pb-2 print:border-zinc-300">
          <span className="bg-zinc-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs print:bg-zinc-100 print:text-zinc-900 print:border print:border-zinc-300">2</span>
          Domain-Specific Intelligence
        </h2>

        {/* Domain Blind Spots */}
        {data.domainBlindSpots && data.domainBlindSpots.length > 0 && (
          <div className="space-y-4 mb-8">
            <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-4 flex items-center gap-2 print:text-zinc-800">
              <AlertTriangle className="w-4 h-4" /> Domain Blind Spots
            </h3>
            <div className="bg-indigo-50 border border-indigo-200 border-l-4 border-l-indigo-600 rounded-md p-5 shadow-sm print:bg-white print:border-zinc-300 print:border-l-zinc-500">
              <ul className="space-y-3">
                {data.domainBlindSpots.map((spot, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0 print:bg-zinc-400"></div>
                    <span className="text-sm font-medium text-indigo-900 leading-relaxed print:text-black">{spot}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

      {/* Business Risks */}
      {data.businessRisks && data.businessRisks.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-red-600 uppercase tracking-wider mb-4 flex items-center gap-2 print:text-zinc-800">
            <AlertTriangle className="w-4 h-4" /> Existential Business Risks
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {data.businessRisks.map((risk, i) => (
              <div key={i} className="relative bg-white border border-red-100 p-5 rounded-xl shadow-sm hover:shadow-md transition-all print:border-zinc-300 print:break-inside-avoid">
                <div className="absolute top-0 left-0 w-1 h-full bg-red-500 rounded-l-xl print:bg-zinc-400"></div>
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pl-2">
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-zinc-900 mb-1 print:text-black">{risk.risk}</h4>
                    <p className="text-sm text-zinc-600 leading-relaxed print:text-zinc-800">{risk.reason}</p>
                  </div>
                  <div className="flex items-center gap-5 shrink-0 bg-zinc-50 px-4 py-2 rounded-lg border border-zinc-100 print:bg-white print:border-zinc-200">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-0.5 print:text-zinc-500">Severity</span>
                      <span className={`text-xs font-bold ${risk.level === 'Critical' ? 'text-red-600' : 'text-amber-600'} print:text-zinc-800`}>{risk.level}</span>
                    </div>
                    <div className="w-px h-6 bg-zinc-200 print:bg-zinc-300"></div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-0.5 print:text-zinc-500">Likelihood</span>
                      <span className={`text-xs font-bold ${risk.likelihood === 'High' ? 'text-red-600' : 'text-amber-600'} print:text-zinc-800`}>{risk.likelihood}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Domain Constraints */}
      {data.domainConstraints && data.domainConstraints.length > 0 && (
        <div className="space-y-4 mt-8 print:break-inside-avoid">
          <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-zinc-500" /> Hard Domain Constraints
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.domainConstraints.map((constraint, i) => (
              <li key={i} className="flex items-start gap-3 p-3 bg-zinc-50 border border-zinc-200 rounded-md print:bg-white print:border-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                <span className="text-sm text-zinc-700 leading-snug print:text-black">{constraint}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Core Validation Questions */}
      {data.coreValidationQuestions && data.coreValidationQuestions.length > 0 && (
        <div className="space-y-4 mt-8 print:break-inside-avoid">
          <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-4 flex items-center gap-2 print:text-zinc-800">
            <Layers className="w-4 h-4" /> What We Would Validate First
          </h3>
          <div className="bg-indigo-50 border border-indigo-100 rounded-md p-5 shadow-sm print:bg-white print:border-zinc-300">
            <ol className="list-decimal list-inside space-y-3">
              {data.coreValidationQuestions.map((question, i) => (
                <li key={i} className="text-sm font-medium text-indigo-900 leading-relaxed print:text-black">
                  {question}
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}

      {/* Critical Unknowns */}
      {data.criticalUnknowns && data.criticalUnknowns.length > 0 && (
        <div className="space-y-4 mt-8 print:break-inside-avoid">
          <h3 className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-4 flex items-center gap-2 print:text-zinc-800">
            <HelpCircle className="w-4 h-4 text-amber-500" /> Critical Unknowns
          </h3>
          <div className="bg-amber-50/50 border border-amber-200/60 rounded-md p-5 shadow-sm print:bg-white print:border-zinc-300">
            <ul className="space-y-3">
              {data.criticalUnknowns.map((q, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0 print:bg-zinc-400"></div>
                  <span className="text-sm font-medium text-amber-900 leading-snug print:text-black">{q}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Strategic Advantages */}
      {data.strategicAdvantages && data.strategicAdvantages.length > 0 && (
        <div className="space-y-4 mt-8 print:break-inside-avoid">
          <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-4 flex items-center gap-2 print:text-zinc-800">
            <CheckCircle2 className="w-4 h-4" /> Strategic Advantages
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.strategicAdvantages.map((advantage, i) => (
              <li key={i} className="flex items-start gap-3 p-3 bg-emerald-50/50 border border-emerald-100 rounded-md print:bg-white print:border-zinc-300">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0 print:bg-zinc-400"></div>
                <span className="text-sm text-emerald-800 leading-snug print:text-black">{advantage}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      </div>

      {/* --- LAYER 3: Architectural Nuance --- */}
      <div className="pt-8 print:pt-4 print:break-inside-avoid">
        <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-6 flex items-center gap-2 border-b border-zinc-100 pb-2 print:border-zinc-300">
          <span className="bg-zinc-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs print:bg-zinc-100 print:text-zinc-900 print:border print:border-zinc-300">3</span>
          Architectural Nuance & Tradeoffs
        </h2>

      {/* Vetoes and Debt */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
        {/* Deferred Decisions */}
        <div>
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <XCircle className="w-4 h-4 text-zinc-400" /> Intentionally Deferred
          </h3>
          <div className="space-y-4">
            {data.deferredDecisions.length > 0 ? data.deferredDecisions.map((item, i) => (
              <div key={i} className="bg-white border border-zinc-200 border-l-4 border-l-red-500 rounded-md p-4 shadow-sm print:border-zinc-300 print:border-l-zinc-500 print:break-inside-avoid">
                <div className="text-sm font-bold text-zinc-900 mb-1">{item.name}</div>
                <div className="text-sm text-zinc-600 leading-relaxed print:text-zinc-800">{item.reason}</div>
              </div>
            )) : (
              <div className="text-sm text-zinc-400 italic">No major components deferred.</div>
            )}
          </div>
        </div>

        {/* Architecture Debt */}
        <div>
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-zinc-400" /> Accepted Debt
          </h3>
          <div className="space-y-4">
            {data.architectureDebt.length > 0 ? data.architectureDebt.map((item, i) => (
              <div key={i} className="bg-white border border-zinc-200 border-l-4 border-l-amber-500 rounded-md p-4 shadow-sm print:border-zinc-300 print:border-l-zinc-500 print:break-inside-avoid">
                <div className="text-sm font-bold text-zinc-900 mb-1">{item.debt}</div>
                <div className="text-sm text-zinc-600 leading-relaxed print:text-zinc-800">{item.reason}</div>
              </div>
            )) : (
              <div className="text-sm text-zinc-400 italic">No significant architectural debt identified.</div>
            )}
          </div>
        </div>
      </div>

      {/* Assumptions */}
      <div className="pt-6 border-t border-zinc-100 mt-8 print:break-inside-avoid">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-zinc-400" /> Core Assumptions
          </h3>
          {data.assumptionRisk && (
            <div className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border print:border-zinc-300 print:bg-white print:text-zinc-800
              ${data.assumptionRisk.level === 'High' ? 'bg-red-50 text-red-600 border-red-200' : 
                data.assumptionRisk.level === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-200' : 
                'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>
              Risk Level: {data.assumptionRisk.level}
            </div>
          )}
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          {data.assumptions.map((assumption, i) => (
            <li key={i} className="flex items-start gap-3 p-3 bg-zinc-50 border border-zinc-100 rounded-md print:bg-white print:border-zinc-300">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 mt-1.5 shrink-0" />
              <span className="text-sm text-zinc-700 leading-snug print:text-black">{assumption}</span>
            </li>
          ))}
        </ul>
        {data.assumptionRisk && (
          <div className="text-sm text-zinc-600 pl-4 border-l-2 border-zinc-200 print:text-zinc-800 print:border-zinc-400">
            <span className="font-semibold text-zinc-900 print:text-black">Risk Analysis:</span> {data.assumptionRisk.reason}
          </div>
        )}
      </div>

      {/* Non-Negotiable Components */}
      {data.nonNegotiables && data.nonNegotiables.length > 0 && (
        <div className="pt-6 border-t border-zinc-100 mt-8 print:break-inside-avoid">
          <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Server className="w-4 h-4 text-zinc-500" /> Non-Negotiable Infrastructure
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {data.nonNegotiables.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-zinc-900 border border-zinc-800 rounded-md shadow-sm print:bg-white print:border-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 print:text-zinc-500" />
                <span className="text-sm font-medium text-zinc-100 leading-snug print:text-black">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>

      {/* --- LAYER 1: Core Architecture (Implementation Details) --- */}
      <div className="pt-8 print:pt-4 print:break-inside-avoid">
        <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-6 flex items-center gap-2 border-b border-zinc-100 pb-2 print:border-zinc-300">
          <span className="bg-zinc-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs print:bg-zinc-100 print:text-zinc-900 print:border print:border-zinc-300">1</span>
          Core Architecture Details
        </h2>

      {/* Stack & Deployment Overview */}
      <div className="pt-6">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-6 flex items-center gap-2">
          <Server className="w-4 h-4 text-zinc-400" /> Implementation Overview
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Tech Stack List */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-zinc-900 mb-2">Core Stack</h4>
            <div className="divide-y divide-zinc-100 border-y border-zinc-100 print:divide-zinc-300 print:border-zinc-300">
              {data.stack.map((item, i) => (
                <div key={i} className="flex items-center gap-4 py-3">
                  <div className="w-8 h-8 rounded bg-zinc-50 border border-zinc-200 flex items-center justify-center shrink-0 print:bg-white print:border-zinc-300">
                    {item.category === 'frontend' && <Terminal className="w-4 h-4 text-zinc-500" />}
                    {item.category === 'backend' && <Server className="w-4 h-4 text-zinc-500" />}
                    {item.category === 'database' && <Database className="w-4 h-4 text-zinc-500" />}
                    {item.category === 'cache' && <Zap className="w-4 h-4 text-zinc-500" />}
                    {item.category === 'ai' && <Cpu className="w-4 h-4 text-zinc-500" />}
                    {item.category === 'queue' && <Layers className="w-4 h-4 text-zinc-500" />}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-zinc-900">{item.name}</div>
                    <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">{item.category}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Infrastructure Overview */}
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-zinc-900 mb-3 flex items-center gap-2">
                <Cloud className="w-4 h-4 text-zinc-400" /> Target Deployment
              </h4>
              <ul className="space-y-2">
                {data.deployment.map((dep, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-zinc-600 print:text-black">
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-300 print:text-zinc-400" />
                    {dep}
                  </li>
                ))}
              </ul>
            </div>

            {/* Operating Cost Drivers */}
            {data.operatingCostDrivers && data.operatingCostDrivers.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-zinc-900 mb-3 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-zinc-400" /> Estimated Operating Cost Drivers
                </h4>
                <div className="bg-zinc-50 border border-zinc-200 rounded-md p-4 print:bg-white print:border-zinc-300">
                  <ul className="space-y-3">
                    {data.operatingCostDrivers.map((driver, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 mt-2 shrink-0"></div>
                        <span className="text-sm text-zinc-700 leading-snug print:text-black">{driver}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Failure Modes */}
            {data.failureModes && data.failureModes.length > 0 && (
              <div className="pt-6 border-t border-zinc-200 print:border-zinc-300">
                <h4 className="text-sm font-semibold text-zinc-900 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500 print:text-zinc-800" /> Failure Modes
                </h4>
                <div className="space-y-4">
                  {data.failureModes.map((fm, i) => (
                    <div key={i} className="bg-amber-50/50 border border-amber-100 rounded-md p-4 print:bg-white print:border-zinc-300">
                      <div className="font-semibold text-zinc-900 text-sm mb-1">{fm.component}</div>
                      <div className="text-sm text-zinc-700 leading-relaxed flex gap-2 print:text-black">
                        <span className="text-amber-500 shrink-0 print:text-zinc-500">→</span>
                        <span>{fm.impact}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>
      </div>
      </div>
    </motion.div>
  );
}
