import Link from 'next/link';
import { NewsletterOptIn } from '@/components/NewsletterOptIn';

export const metadata = {
  title: 'Pricing | Tradeoff AI',
  description: 'Simple, transparent pricing for architectural guidance.',
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col p-8 md:p-16">
      <div className="max-w-5xl mx-auto w-full">
        <div className="flex items-center justify-between mb-12 border-b-[2px] border-black pb-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-500 hover:text-black">
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to Generator
          </Link>
          <div className="font-black text-2xl tracking-tighter">TRADEOFF AI</div>
        </div>
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black uppercase mb-4 tracking-tighter">
            Architectural Guidance
          </h1>
          <p className="text-xl text-zinc-600 font-mono max-w-2xl mx-auto">
            Stop building the wrong thing. Run your architecture past an objective, senior engineering intelligence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
          
          {/* Indie / Bootstrap Tier */}
          <div className="bg-white border-[2px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 flex flex-col">
            <div className="font-mono text-zinc-500 font-bold uppercase tracking-widest mb-2">INDIE / HOBBYIST</div>
            <div className="text-5xl font-black mb-2">$5 <span className="text-lg text-zinc-500 font-normal">/ report</span></div>
            <p className="font-code-md text-zinc-700 mb-8 flex-1">Pay as you go. Perfect for side-projects, hackathons, and early ideation.</p>
            
            <ul className="space-y-4 mb-8 font-mono text-sm">
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-green-600">check_circle</span> 1 In-depth Architecture Report</li>
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-green-600">check_circle</span> Shareable link</li>
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-green-600">check_circle</span> PDF Export</li>
            </ul>

            <form action="/api/checkout/bachs" method="POST">
              <input type="hidden" name="tier" value="single" />
              <button type="submit" className="w-full bg-black text-white border-[2px] border-black px-6 py-4 font-mono font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-none flex items-center justify-center gap-2">
                Buy 1 Report Credit <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </form>
          </div>

          {/* Startup / Pro Tier */}
          <div className="bg-amber-400 border-[2px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 flex flex-col relative transform md:-translate-y-4">
            <div className="absolute top-0 right-0 bg-black text-white font-mono text-[10px] font-bold px-3 py-1 uppercase tracking-widest border-b-[2px] border-l-[2px] border-black">
              MOST POPULAR
            </div>
            <div className="font-mono text-black font-bold uppercase tracking-widest mb-2">FOUNDER / STUDIO</div>
            <div className="text-5xl font-black mb-2">$49 <span className="text-lg text-black/60 font-normal">/ month</span></div>
            <p className="font-code-md text-zinc-900 mb-8 flex-1">Unlimited reports. For founders and dev agencies constantly iterating on ideas.</p>
            
            <ul className="space-y-4 mb-8 font-mono text-sm">
              <li className="flex items-center gap-2"><span className="material-symbols-outlined">check_circle</span> Unlimited Architecture Reports</li>
              <li className="flex items-center gap-2"><span className="material-symbols-outlined">check_circle</span> Private (Unlisted) Reports</li>
              <li className="flex items-center gap-2"><span className="material-symbols-outlined">check_circle</span> Priority Engine Processing</li>
              <li className="flex items-center gap-2"><span className="material-symbols-outlined">check_circle</span> Export to Markdown</li>
            </ul>

            <form action="/api/checkout/bachs" method="POST">
              <input type="hidden" name="tier" value="pro" />
              <button type="submit" className="w-full bg-white text-black border-[2px] border-black px-6 py-4 font-mono font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-none flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-[4px] hover:translate-x-[4px]">
                Subscribe Now <span className="material-symbols-outlined">bolt</span>
              </button>
            </form>
          </div>

        </div>

        <NewsletterOptIn />

      </div>
    </div>
  );
}
