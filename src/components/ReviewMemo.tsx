'use client';

import { ArchitectureOutput } from '@/engine/types';

interface ReviewMemoProps {
  data: ArchitectureOutput;
  inputCapabilities?: { name: string; score: number; source: 'llm' | 'deterministic' }[];
  reviewId?: string;
  onExportMarkdown?: () => void;
}

export function ReviewMemo({ data, reviewId, onExportMarkdown }: ReviewMemoProps) {
  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Action Bar (Top) */}
      {onExportMarkdown && (
        <div className="flex justify-end w-full border-b-[2px] border-[#000000] pb-2">
          <button 
            onClick={onExportMarkdown}
            className="font-mono text-[10px] sm:text-[12px] font-bold border-[2px] border-[#000000] px-4 py-2 uppercase tracking-widest bg-[#ffffff] hover:bg-[#000000] hover:text-[#ffffff] transition-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[14px]">download</span> EXPORT_MARKDOWN
          </button>
        </div>
      )}

      {/* 1. Executive Summary */}
      <div className="border-[2px] border-[#000000] bg-[#ffffff] relative z-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full flex flex-col">
        <div className="bg-[#000000] text-[#ffffff] font-mono text-[10px] sm:text-[12px] font-bold px-4 py-3 border-b-[2px] border-[#000000] flex items-center gap-2 uppercase tracking-widest">
          <span className="text-[#5d5f5f]">01.</span> EXECUTIVE_SUMMARY
        </div>
        <div className="p-6 md:p-8 border-b-[2px] border-[#000000] bg-[#f9f9f9]">
          <h3 className="font-sans text-[24px] md:text-[32px] font-black uppercase tracking-tighter leading-tight break-words">{data.architectureStyle}</h3>
        </div>
        <div className="p-6 md:p-8 font-code-md text-[14px] md:text-[16px] text-[#000000] leading-relaxed">
          <ul className="space-y-4 list-none m-0 p-0">
            {data.recommended[0]?.reasons.map((reason, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="text-[#000000] font-bold mt-1 border-[1px] border-[#000000] w-4 h-4 flex items-center justify-center shrink-0 bg-[#00ff00]">+</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 2. Architecture Drivers */}
      {data.pressureMap && data.pressureMap.length > 0 && (
        <div className="border-[2px] border-[#000000] bg-[#ffffff] relative z-10 w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="bg-[#000000] text-[#ffffff] font-mono font-bold text-[10px] sm:text-[12px] px-4 py-3 border-b-[2px] border-[#000000] flex items-center gap-2 uppercase tracking-widest">
            <span className="text-[#5d5f5f]">02.</span> ARCHITECTURE_DRIVERS
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 bg-[#000000] border-b-[2px] border-[#000000]">
            {data.pressureMap.map((p, i) => (
              <div key={i} className="bg-[#ffffff] border-r-[2px] border-b-[2px] border-[#000000] p-4 sm:p-6 flex flex-col justify-between aspect-square lg:aspect-auto lg:h-48 hover:bg-[#e8e8e8] transition-none group">
                <div className="font-mono font-bold text-[10px] sm:text-[12px] text-[#5d5f5f] uppercase tracking-widest break-words leading-tight">{p.dimension}</div>
                <div className="font-sans text-[48px] sm:text-[64px] leading-[0.9] font-black tracking-tighter mt-auto text-[#000000] group-hover:text-[#ba1a1a]">
                  {p.pressure}<span className="text-[20px] sm:text-[24px] text-[#5d5f5f]">%</span>
                </div>
                {p.influencedDecisions && p.influencedDecisions.length > 0 && (
                  <div className="font-mono font-bold text-[8px] sm:text-[10px] uppercase text-[#000000] mt-2 truncate bg-[#00ff00] px-1 border-[1px] border-[#000000] w-fit">
                    {p.influencedDecisions[0].replace(/_/g, ' ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Section Grid (Risk & Topology) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10 w-full">
        
        {/* 3. Risk Analysis */}
        {data.businessRisks && data.businessRisks.length > 0 && (
          <div className="border-[2px] border-[#000000] bg-[#ffffff] flex flex-col shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="bg-[#000000] text-[#ffffff] font-mono font-bold text-[10px] sm:text-[12px] px-4 py-3 border-b-[2px] border-[#000000] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 uppercase tracking-widest">
              <div className="flex items-center gap-2"><span className="text-[#5d5f5f]">03.</span> RISK_ANALYSIS</div>
              <div className="text-[8px] sm:text-[10px] text-[#5d5f5f] bg-[#ffffff] px-2 py-0.5 border-[1px] border-[#5d5f5f] truncate max-w-full">INCIDENT_ID: {reviewId || 'TRD-8910-XX'}</div>
            </div>
            <div className="p-4 sm:p-6 flex flex-col gap-6 flex-1 bg-[#f9f9f9]">
              {data.businessRisks.map((risk, i) => (
                <div key={i} className="border-[2px] border-[#000000] flex flex-col bg-[#ffffff] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="p-3 border-b-[2px] border-[#000000] flex items-center gap-3 bg-[#e8e8e8] overflow-hidden">
                    <span className={`font-mono text-[10px] font-bold px-2 py-1 uppercase tracking-widest border-[2px] border-[#000000] whitespace-nowrap shrink-0 ${risk.level.toUpperCase() === 'HIGH' || risk.level.toUpperCase() === 'CRITICAL' ? 'bg-[#ba1a1a] text-[#ffffff]' : 'bg-[#000000] text-[#ffffff]'}`}>
                      [SEV:{risk.level}]
                    </span>
                    <span className="font-code-md text-[12px] sm:text-[14px] font-bold uppercase truncate">{risk.risk}</span>
                  </div>
                  <div className="p-4 font-code-md text-[12px] sm:text-[14px] text-[#000000] leading-relaxed">
                    {risk.reason}
                  </div>
                  {risk.trace?.patched && (
                    <div className="mt-auto border-t-[2px] border-[#000000] bg-[#000000] p-4 flex gap-4 items-start relative overflow-hidden group">
                      <div className="absolute inset-0 opacity-20 blueprint-bg pointer-events-none"></div>
                      <span className="material-symbols-outlined text-[24px] text-[#ffffff] relative z-10 group-hover:animate-spin">memory</span>
                      <div className="relative z-10 text-[#ffffff]">
                        <div className="font-mono text-[10px] font-bold uppercase tracking-widest mb-1 border-b-[1px] border-[#ffffff] pb-1 inline-block">SYS_INSIGHT</div>
                        <p className="font-code-md text-[12px] leading-tight italic mt-1">"{risk.trace.reason}"</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. System Topology */}
        {data.decisionCards && data.decisionCards.length > 0 && (
          <div className="border-[2px] border-[#000000] bg-[#ffffff] flex flex-col shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="bg-[#000000] text-[#ffffff] font-mono font-bold text-[10px] sm:text-[12px] px-4 py-3 border-b-[2px] border-[#000000] flex items-center gap-2 uppercase tracking-widest">
              <span className="text-[#5d5f5f]">04.</span> TOPOLOGY_CONSTRAINTS
            </div>
            <div className="flex flex-col bg-[#f9f9f9]">
              {data.decisionCards.map((card, i) => (
                <div key={i} className="border-b-[2px] border-[#000000] last:border-b-0 flex flex-col group">
                  <div className="p-4 border-b-[2px] border-[#000000] bg-[#e8e8e8] flex justify-between items-center group-hover:bg-[#ffffff] transition-none">
                    <span className="font-code-md text-[12px] sm:text-[14px] font-bold uppercase flex items-center gap-2 truncate pr-2">
                      <span className="material-symbols-outlined text-[18px] shrink-0">developer_board</span> 
                      <span className="truncate">{card.recommendation}</span>
                    </span>
                    <span className="font-mono text-[8px] sm:text-[10px] border-[2px] border-[#000000] px-2 py-1 bg-[#ffffff] shrink-0 font-bold uppercase tracking-widest">
                      {card.systemGroup.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 divide-y-[2px] md:divide-y-0 md:divide-x-[2px] divide-[#000000] font-code-md text-[10px] sm:text-[11px] bg-[#ffffff]">
                    
                    <div className="p-4 flex flex-col justify-start hover:bg-[#f9f9f9] transition-none">
                      <span className="text-[#5d5f5f] uppercase mb-2 font-bold font-mono tracking-widest border-b-[1px] border-[#cfc4c5] pb-1">WINS WHEN:</span>
                      <span className="leading-relaxed">{card.winsWhen && card.winsWhen.length > 0 ? card.winsWhen[0] : card.rationale}</span>
                    </div>

                    <div className="p-4 flex flex-col justify-start bg-error-container border-y-[2px] md:border-y-0 border-[#000000] relative overflow-hidden group/warn">
                      <div className="absolute top-0 right-0 p-1 opacity-10 group-hover/warn:opacity-20 transition-none"><span className="material-symbols-outlined text-[48px] text-error">warning</span></div>
                      <span className="text-error uppercase mb-2 font-bold font-mono tracking-widest border-b-[1px] border-error pb-1 flex items-center gap-1 relative z-10"><span className="material-symbols-outlined text-[14px]">warning</span> SCALE LIMITS:</span>
                      <span className="relative z-10 leading-relaxed text-error font-bold">{card.scaleLimit ? card.scaleLimit.breaksFirst : 'UNKNOWN_CEILING.'}</span>
                    </div>

                    <div className="p-4 flex flex-col justify-start hover:bg-[#f9f9f9] transition-none text-[#5d5f5f]">
                      <span className="uppercase mb-2 font-bold font-mono tracking-widest border-b-[1px] border-[#cfc4c5] pb-1">WHY NOT:</span>
                      {card.alternatives && card.alternatives.length > 0 ? (
                        <div className="flex flex-col gap-2">
                          {card.alternatives.map((alt, altIdx) => (
                            <span key={altIdx} className="line-through leading-relaxed">{alt.name}</span>
                          ))}
                        </div>
                      ) : (
                        <span className="line-through leading-relaxed">{card.losesWhen && card.losesWhen.length > 0 ? card.losesWhen[0] : 'N/A'}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
