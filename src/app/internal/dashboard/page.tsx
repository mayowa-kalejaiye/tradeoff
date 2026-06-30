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
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">
        <p className="text-red-400">Failed to load dashboard metrics. Check database connection.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 p-8 font-sans selection:bg-purple-500/30">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <header className="border-b border-white/10 pb-6 mb-8">
          <h1 className="text-3xl font-light text-white tracking-tight flex items-center gap-3">
            <Activity className="w-8 h-8 text-purple-400" />
            Tradeoff <span className="font-semibold">Intelligence</span>
          </h1>
          <p className="text-neutral-400 mt-2">Internal telemetry and domain analysis feedback loop.</p>
        </header>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KPICard title="Total Reviews" value={metrics.totalStartedReviews} icon={<TrendingUp className="w-5 h-5" />} />
          <KPICard title="Completion Rate" value={`${metrics.completionRate}%`} icon={<CheckCircle className="w-5 h-5" />} />
          <KPICard title="Avg Confidence" value={`${metrics.avgConfidence}%`} icon={<Brain className="w-5 h-5" />} />
          <KPICard title="Avg Prompt Length" value={`${metrics.avgPromptLength} chars`} icon={<Target className="w-5 h-5" />} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <KPICard title="Reviews Today" value={metrics.reviewsToday} icon={<Activity className="w-5 h-5" />} />
          <KPICard 
            title="Avg Gen Time" 
            value={`${(metrics.avgGenerationTimeMs / 1000).toFixed(1)}s`} 
            icon={<Clock className="w-5 h-5" />} 
          />
          <KPICard 
            title="Failed Requests" 
            value={metrics.failedReviews} 
            icon={<FileWarning className="w-5 h-5" />} 
            valueClass={metrics.failedReviews > 0 ? "text-red-400" : "text-green-400"}
          />
          <KPICard title="Avg Cost/Review" value={`$${metrics.avgCost.toFixed(3)}`} icon={<Coins className="w-5 h-5" />} />
        </div>

        {/* Token Usage Summary */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col md:flex-row gap-8 justify-between mt-8 mb-8 items-center">
          <div>
            <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider flex items-center gap-2"><Database className="w-4 h-4"/> Token Usage Today</h3>
            <p className="text-sm text-neutral-500 mt-1">Total tokens processed today across all requests</p>
          </div>
          <div className="flex gap-8">
            <div className="text-right">
              <p className="text-xs text-neutral-400 uppercase tracking-wider mb-1">Input Tokens</p>
              <p className="text-xl font-semibold text-white">{(metrics.tokenUsageToday.input / 1000).toFixed(1)}k</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-neutral-400 uppercase tracking-wider mb-1">Output Tokens</p>
              <p className="text-xl font-semibold text-white">{(metrics.tokenUsageToday.output / 1000).toFixed(1)}k</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-neutral-400 uppercase tracking-wider mb-1">Total Cost</p>
              <p className="text-xl font-semibold text-emerald-400">${metrics.tokenUsageToday.cost.toFixed(3)}</p>
            </div>
          </div>
        </div>

        {/* Breakdown Grid Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <ListCard title="Recommendation Frequency" items={metrics.topArchitectures} color="purple" />
          <ListCard title="Top Domains" items={metrics.topDomains} color="blue" />
          <ListCard title="Top Existential Risks" items={metrics.topRisks} color="red" />
        </div>

        {/* Breakdown Grid Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <ListCard title="Missing Niches" items={metrics.missingNiches} color="emerald" />
          <ListCard title="Unknown Technologies" items={metrics.unknownTechnologies} color="amber" />
          <ListCard title="Top Blind Spots" items={metrics.topBlindSpots} color="neutral" />
        </div>

        {/* Knowledge Growth */}
        <div className="mt-8 bg-white/5 border border-white/10 p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-6 h-6 text-emerald-400" />
            <h3 className="text-lg font-medium text-white tracking-tight">Knowledge Growth</h3>
          </div>
          {metrics.engineUpdates.length === 0 ? (
            <p className="text-neutral-500 text-sm">No recent engine updates.</p>
          ) : (
            <div className="space-y-4">
              {metrics.engineUpdates.map((update, i) => (
                <div key={i} className="flex items-start gap-4 pb-4 border-b border-white/5 last:border-0 last:pb-0">
                  <div className="mt-1 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                  <div>
                    <p className="text-sm text-neutral-300 leading-relaxed">{update.description}</p>
                    <p className="text-xs text-neutral-500 mt-1">{new Date(update.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Feedback Loop Feed */}
        <ReviewFeed initialReviews={recentReviews} />

      </div>
    </div>
  );
}

function KPICard({ title, value, icon, valueClass = "text-white" }: { title: string; value: string | number; icon: React.ReactNode; valueClass?: string }) {
  return (
    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col gap-4 relative overflow-hidden group hover:border-white/20 transition-colors">
      <div className="absolute top-0 right-0 p-4 text-white/10 group-hover:text-white/20 transition-colors">
        {icon}
      </div>
      <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">{title}</h3>
      <p className={`text-4xl font-semibold tracking-tight ${valueClass}`}>
        {value}
      </p>
    </div>
  );
}

function ListCard({ title, items, color }: { title: string; items: { name: string; count: number }[]; color: string }) {
  const colorMap = {
    purple: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    red: "bg-red-500/20 text-red-300 border-red-500/30",
    blue: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    emerald: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    amber: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    neutral: "bg-neutral-500/20 text-neutral-300 border-neutral-500/30",
  };

  return (
    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
      <h3 className="text-lg font-medium text-white mb-6 tracking-tight">{title}</h3>
      
      {items.length === 0 ? (
        <p className="text-neutral-500 text-sm">No data yet.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((item, index) => (
            <li key={index} className="flex items-start justify-between gap-4">
              <span className="text-neutral-300 text-sm flex-1 leading-snug">{item.name}</span>
              <span className={`text-xs px-2 py-1 rounded-md border ${colorMap[color as keyof typeof colorMap]} font-medium`}>
                {item.count}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
