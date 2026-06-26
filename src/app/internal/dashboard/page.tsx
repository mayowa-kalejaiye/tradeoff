import React from 'react';
import { getDashboardMetrics } from './actions';
import { Activity, Clock, FileWarning, TrendingUp } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const metrics = await getDashboardMetrics();

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
          <KPICard title="Total Reviews" value={metrics.totalReviews} icon={<TrendingUp className="w-5 h-5" />} />
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
        </div>

        {/* Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ListCard title="Top Domains" items={metrics.topDomains} color="purple" />
          <ListCard title="Top Existential Risks" items={metrics.topRisks} color="red" />
          <ListCard title="Top Blind Spots" items={metrics.topBlindSpots} color="blue" />
        </div>

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
