'use client';

import { ArchitectureOutput } from '@/engine/types';

interface ReviewMemoProps {
  data: ArchitectureOutput;
  inputCapabilities?: { name: string; score: number; source: 'llm' | 'deterministic' }[];
  reviewId?: string;
  onExportMarkdown?: () => void;
}

export function ReviewMemo({ data, reviewId }: ReviewMemoProps) {
  return (
    <>
      {/* 1. Executive Summary */}
      <div className="border-thick border-primary bg-surface-container-lowest relative z-10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-0 w-full">
        <div className="bg-primary text-on-primary font-label-caps text-[12px] px-unit py-unit border-b-thick border-primary flex items-center gap-unit uppercase">
          <span className="font-code-md opacity-50">01.</span> Executive Summary
        </div>
        <div className="p-gutter border-b-thin border-primary">
          <h3 className="font-headline-md text-[24px] font-bold uppercase tracking-tight">{data.architectureStyle}</h3>
        </div>
        <div className="p-gutter font-code-md text-[14px]">
          <ul className="space-y-unit list-none m-0 p-0">
            {data.recommended[0]?.reasons.map((reason, i) => (
              <li key={i} className="flex items-start gap-gutter">
                <span className="text-primary font-bold">+</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 2. Architecture Drivers */}
      {data.pressureMap && data.pressureMap.length > 0 && (
        <div className="border-thick border-primary bg-surface-container-lowest relative z-10 w-full mt-margin-edge">
          <div className="bg-primary text-on-primary font-label-caps text-[12px] px-unit py-unit border-b-thick border-primary flex items-center gap-unit uppercase">
            <span className="font-code-md opacity-50">02.</span> Architecture Drivers
          </div>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-0 bg-primary">
            {data.pressureMap.map((p, i) => (
              <div key={i} className="bg-surface-container-lowest border-r-thin border-b-thin border-primary p-gutter flex flex-col justify-between aspect-[4/3] xl:aspect-square hover:bg-surface-variant transition-none">
                <div className="font-label-caps text-[12px] text-secondary uppercase">{p.dimension}</div>
                <div className="font-headline-lg text-[64px] leading-[0.9] font-black tracking-tighter mt-auto text-primary">
                  {p.pressure}<span className="text-[24px] text-secondary">%</span>
                </div>
                {p.influencedDecisions && p.influencedDecisions.length > 0 && (
                  <div className="font-code-md text-[10px] uppercase text-primary font-bold mt-1 truncate">
                    {p.influencedDecisions[0].replace(/_/g, ' ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Section Grid (Risk & Topology) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-margin-edge relative z-10 mt-margin-edge w-full">
        
        {/* 3. Risk Analysis */}
        {data.businessRisks && data.businessRisks.length > 0 && (
          <div className="border-thick border-primary bg-surface-container-lowest flex flex-col">
            <div className="bg-primary text-on-primary font-label-caps text-[12px] px-unit py-unit border-b-thick border-primary flex justify-between items-center uppercase">
              <div className="flex items-center gap-unit"><span className="font-code-md opacity-50">03.</span> Risk Analysis</div>
              <div className="font-code-md text-[10px] hidden sm:block">INCIDENT ID: {reviewId || 'TRD-8910-XX'}</div>
            </div>
            <div className="p-gutter flex flex-col gap-gutter flex-1">
              {data.businessRisks.map((risk, i) => (
                <div key={i} className="border-thin border-primary flex flex-col bg-surface">
                  <div className="p-unit border-b-thin border-primary flex items-center gap-unit bg-surface-variant overflow-hidden">
                    <span className={`font-label-caps text-[12px] px-2 py-1 uppercase tracking-widest border-thick border-primary whitespace-nowrap shrink-0 ${risk.level.toUpperCase() === 'HIGH' || risk.level.toUpperCase() === 'CRITICAL' ? 'bg-error text-on-error' : 'bg-primary text-on-primary'}`}>
                      [SEV:{risk.level}]
                    </span>
                    <span className="font-code-md text-[14px] font-bold uppercase truncate">{risk.risk}</span>
                  </div>
                  <div className="p-unit font-code-md text-[12px] text-on-surface-variant leading-relaxed">
                    {risk.reason}
                  </div>
                  {risk.trace?.patched && (
                    <div className="mt-auto border-t-thin border-primary bg-surface-container-highest p-unit flex gap-unit items-start relative overflow-hidden group">
                      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--color-primary)_1px,_transparent_1px)] bg-[length:4px_4px]"></div>
                      <span className="material-symbols-outlined text-[32px] text-primary relative z-10 group-hover:animate-spin">memory</span>
                      <div className="relative z-10">
                        <div className="font-label-caps text-[10px] font-bold uppercase mb-1 border-b-thin border-primary inline-block">AI Insight Generation</div>
                        <p className="font-code-md text-[12px] leading-tight text-primary italic">"{risk.trace.reason}"</p>
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
          <div className="border-thick border-primary bg-surface-container-lowest flex flex-col">
            <div className="bg-primary text-on-primary font-label-caps text-[12px] px-unit py-unit border-b-thick border-primary flex items-center gap-unit uppercase">
              <span className="font-code-md opacity-50">04.</span> System Topology Constraints
            </div>
            <div className="flex flex-col border-b-thin border-primary">
              {data.decisionCards.map((card, i) => (
                <div key={i} className="border-b-thin border-primary last:border-b-0 flex flex-col group">
                  <div className="p-unit border-b-thin border-primary bg-surface-variant flex justify-between items-center group-hover:bg-surface-dim transition-none">
                    <span className="font-code-md text-[14px] font-bold uppercase flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">developer_board</span> {card.recommendation}
                    </span>
                    <span className="font-label-caps text-[10px] border border-primary px-1 bg-surface-container-lowest shrink-0 hidden sm:block truncate ml-2">
                      {card.systemGroup.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 divide-y-thin md:divide-y-0 md:divide-x-thin divide-primary font-code-md text-[11px] bg-surface-container-lowest">
                    
                    <div className="p-unit flex flex-col justify-start">
                      <span className="text-secondary uppercase mb-1 font-bold">Wins When:</span>
                      <span>{card.winsWhen && card.winsWhen.length > 0 ? card.winsWhen[0] : card.rationale}</span>
                    </div>

                    <div className="p-unit flex flex-col justify-start bg-error-container text-on-error-container border-y-thin md:border-y-0 border-primary relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-1 opacity-10"><span className="material-symbols-outlined text-[48px]">warning</span></div>
                      <span className="uppercase mb-1 font-bold flex items-center gap-1 relative z-10"><span className="material-symbols-outlined text-[12px]">warning</span> Scale Limits:</span>
                      <span className="relative z-10">{card.scaleLimit ? card.scaleLimit.breaksFirst : 'Unknown ceiling constraints.'}</span>
                    </div>

                    <div className="p-unit flex flex-col justify-start text-secondary">
                      <span className="uppercase mb-1 font-bold">Why Not:</span>
                      {card.alternatives && card.alternatives.length > 0 ? (
                        <div className="flex flex-col gap-1">
                          {card.alternatives.map((alt, altIdx) => (
                            <span key={altIdx} className="line-through">{alt.name}</span>
                          ))}
                        </div>
                      ) : (
                        <span className="line-through">{card.losesWhen && card.losesWhen.length > 0 ? card.losesWhen[0] : 'N/A'}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </>
  );
}
