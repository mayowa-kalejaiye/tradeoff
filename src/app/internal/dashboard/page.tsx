import React from 'react';
import { getDashboardMetrics, getRecentReviews } from './actions';
import { Activity, Clock, FileWarning, TrendingUp, CheckCircle, Brain, Target, Coins, BarChart3, Database } from 'lucide-react';
import { ReviewFeed } from './ReviewFeed';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const [metrics, recentReviews] = await Promise.all([
    getDashboardMetrics(),
    getRecentReviews(50)
  ]);

  if (!metrics) {
    return (
      <div className="min-h-screen bg-[#f9f9f9] blueprint-bg flex items-center justify-center text-[#000000] font-code-md">
        <div className="border-thick border-error bg-error-container p-margin-edge shadow-[8px_8px_0px_0px_rgba(186,26,26,1)]">
          <p className="text-error font-bold uppercase">Failed to load telemetry metrics. Check database connection.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f9f9] blueprint-bg text-[#000000] font-sans selection:bg-[#000000] selection:text-[#ffffff] pb-24">
      {/* Top Navbar */}
      <header className="w-full top-0 sticky z-50 bg-[#ffffff] border-b-[2px] border-[#000000] flex justify-between items-center px-[40px] h-20 max-w-full">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[#000000] text-3xl" data-icon="architecture">architecture</span>
          <h1 className="font-sans text-[28px] tracking-tighter font-[900] text-[#000000] uppercase mt-1">TRADEOFF // TELEMETRY</h1>
        </div>
        <div className="font-mono text-[12px] leading-[1] font-[700] tracking-widest text-[#5d5f5f] flex items-center gap-2">
          <span className="w-2 h-2 bg-[#00ff00] rounded-full animate-pulse"></span> SYSTEM ACTIVE
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto p-[40px] lg:p-16 space-y-12">
        <header className="border-b-[2px] border-[#000000] pb-6 mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-[48px] font-black uppercase tracking-tighter leading-none mb-2">
              Internal Telemetry
            </h1>
            <p className="font-mono text-[14px] text-[#5d5f5f] uppercase tracking-widest">Global Engine diagnostics and feedback loop.</p>
          </div>
          <div className="hidden md:block font-mono text-[12px] text-[#000000] border-[2px] border-[#000000] px-4 py-2 bg-[#ffffff]">
            SYS_VER: 6.0.2-STABLE
          </div>
        </header>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <KPICard title="TOTAL_REVIEWS" value={metrics.totalStartedReviews} icon="trending_up" />
          <KPICard title="COMPLETION_RATE" value={`${metrics.completionRate}%`} icon="check_circle" />
          <KPICard title="AVG_CONFIDENCE" value={`${metrics.avgConfidence}%`} icon="psychology" />
          <KPICard title="AVG_PROMPT_LEN" value={`${metrics.avgPromptLength}`} icon="track_changes" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-6">
          <KPICard title="REVIEWS_TODAY" value={metrics.reviewsToday} icon="activity_zone" />
          <KPICard 
            title="AVG_GEN_TIME" 
            value={`${(metrics.avgGenerationTimeMs / 1000).toFixed(1)}s`} 
            icon="schedule" 
          />
          <KPICard 
            title="FAILED_REQS" 
            value={metrics.failedReviews} 
            icon="warning" 
            valueClass={metrics.failedReviews > 0 ? "text-error" : "text-[#00ff00]"}
          />
          <KPICard title="AVG_COST/REV" value={`$${metrics.avgCost.toFixed(3)}`} icon="payments" />
        </div>

        {/* Token Usage Summary */}
        <div className="bg-[#ffffff] border-[2px] border-[#000000] p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row gap-8 justify-between mt-12 mb-12 items-center relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-5 pointer-events-none">
            <span className="material-symbols-outlined text-[200px]">database</span>
          </div>
          <div className="relative z-10">
            <h3 className="text-[12px] font-mono font-bold text-[#000000] uppercase tracking-widest flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-[16px]">database</span> TOKEN_USAGE_TODAY
            </h3>
            <p className="text-[14px] font-mono text-[#5d5f5f] uppercase">Total LLM volume processed across all active modules.</p>
          </div>
          <div className="flex gap-8 lg:gap-16 relative z-10 font-mono">
            <div className="text-right">
              <p className="text-[12px] text-[#5d5f5f] uppercase tracking-widest mb-1">INPUT_TOKENS</p>
              <p className="text-[24px] font-black text-[#000000]">{(metrics.tokenUsageToday.input / 1000).toFixed(1)}k</p>
            </div>
            <div className="text-right">
              <p className="text-[12px] text-[#5d5f5f] uppercase tracking-widest mb-1">OUTPUT_TOKENS</p>
              <p className="text-[24px] font-black text-[#000000]">{(metrics.tokenUsageToday.output / 1000).toFixed(1)}k</p>
            </div>
            <div className="text-right">
              <p className="text-[12px] text-[#5d5f5f] uppercase tracking-widest mb-1">TOTAL_COST</p>
              <p className="text-[24px] font-black text-[#000000] bg-[#00ff00] px-2 py-1 border-[2px] border-[#000000]">${metrics.tokenUsageToday.cost.toFixed(3)}</p>
            </div>
          </div>
        </div>

        {/* Breakdown Grid Row 1 */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-12">
          <ListCard title="ARCH_FREQ_DIST" items={metrics.topArchitectures} />
          <ListCard title="TOP_DOMAINS" items={metrics.topDomains} />
          <ListCard title="TOP_EXISTENTIAL_RISKS" items={metrics.topRisks} />
        </div>

        {/* Breakdown Grid Row 2 */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-8">
          <ListCard title="MISSING_NICHES" items={metrics.missingNiches} />
          <ListCard title="UNKNOWN_TECH" items={metrics.unknownTechnologies} />
          <ListCard title="TOP_BLIND_SPOTS" items={metrics.topBlindSpots} />
        </div>

        {/* Knowledge Growth */}
        <div className="mt-12 bg-[#ffffff] border-[2px] border-[#000000] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col">
          <div className="bg-[#000000] text-[#ffffff] font-mono text-[12px] px-4 py-3 border-b-[2px] border-[#000000] flex items-center gap-2 uppercase tracking-widest">
            <span className="material-symbols-outlined text-[16px]">bar_chart</span> SYSTEM_KNOWLEDGE_GROWTH
          </div>
          <div className="p-8">
            {metrics.engineUpdates.length === 0 ? (
              <p className="text-[#5d5f5f] font-mono text-[14px] uppercase tracking-widest">No recent engine updates.</p>
            ) : (
              <div className="space-y-0">
                {metrics.engineUpdates.map((update, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 border-b-[1px] border-[#cfc4c5] last:border-0 hover:bg-[#f9f9f9] transition-none group">
                    <div className="mt-1 w-3 h-3 border-[2px] border-[#000000] bg-[#ffffff] group-hover:bg-[#000000] transition-none shrink-0"></div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-4">
                      <p className="font-sans text-[16px] text-[#000000] font-bold">{update.description}</p>
                      <p className="font-mono text-[12px] text-[#5d5f5f] bg-[#e8e8e8] px-2 py-1 shrink-0 uppercase border-[1px] border-[#cfc4c5]">
                        {new Date(update.date).toISOString().split('T')[0]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Feedback Loop Feed */}
        <div className="mt-12">
          <ReviewFeed initialReviews={recentReviews} />
        </div>

      </div>
    </div>
  );
}

function KPICard({ title, value, icon, valueClass = "text-[#000000]" }: { title: string; value: string | number; icon: string; valueClass?: string }) {
  return (
    <div className="bg-[#ffffff] border-[2px] border-[#000000] p-6 flex flex-col gap-4 relative overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all duration-0 cursor-default">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <span className="material-symbols-outlined text-[48px]">{icon}</span>
      </div>
      <h3 className="font-mono text-[12px] font-bold text-[#5d5f5f] uppercase tracking-widest z-10">{title}</h3>
      <p className={`font-sans text-[40px] font-black tracking-tighter leading-none z-10 ${valueClass}`}>
        {value}
      </p>
    </div>
  );
}

function ListCard({ title, items }: { title: string; items: { name: string; count: number }[] }) {
  return (
    <div className="bg-[#ffffff] border-[2px] border-[#000000] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col h-full">
      <div className="bg-[#000000] text-[#ffffff] font-mono text-[12px] px-4 py-3 border-b-[2px] border-[#000000] uppercase tracking-widest font-bold">
        {title}
      </div>
      <div className="p-0 flex-grow bg-[#f9f9f9]">
        {items.length === 0 ? (
          <p className="text-[#5d5f5f] text-[12px] font-mono p-4 uppercase tracking-widest">No data available.</p>
        ) : (
          <ul className="space-y-0 m-0 p-0 list-none font-mono text-[12px]">
            {items.map((item, index) => (
              <li key={index} className="flex items-center justify-between gap-4 p-4 border-b-[1px] border-[#cfc4c5] last:border-b-0 hover:bg-[#ffffff] transition-none group">
                <span className="text-[#000000] font-bold uppercase truncate">{item.name}</span>
                <span className="text-[#ffffff] bg-[#000000] px-2 py-1 font-bold border-[1px] border-[#000000] shrink-0">
                  {item.count}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
