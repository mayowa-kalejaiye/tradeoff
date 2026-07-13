'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export default function MethodologyPage() {
  const currentYear = new Date().getFullYear();
  const [isNavVisible, setIsNavVisible] = useState(true);
  const lastScrollY = useRef(0);

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

  return (
    <div className="bg-[#f9f9f9] blueprint-bg min-h-screen text-on-background font-body-lg overflow-x-hidden relative w-full">
      <style dangerouslySetInnerHTML={{
        __html: `
        .blueprint-bg {
            background-color: #f9f9f9;
            background-image: radial-gradient(#c6c6c6 1px, transparent 1px);
            background-size: 24px 24px;
        }
        .brutal-shadow {
            box-shadow: 8px 8px 0px 0px rgba(0,0,0,1);
        }
        .vertical-text {
            writing-mode: vertical-rl;
            text-orientation: mixed;
        }
        `
      }} />

      {/* Meta Tags Sides */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 vertical-text font-label-caps text-[12px] tracking-widest text-secondary rotate-180 hidden xl:block z-10">
        SYS:ACTIVE // PIPELINE 01
      </div>
      <div className="fixed right-4 top-1/2 -translate-y-1/2 vertical-text font-label-caps text-[12px] tracking-widest text-secondary hidden xl:block z-10">
        ENGINE_V6.0.2 // TRADEOFF
      </div>

      {/* Top Navbar */}
      <header className={`w-full top-0 sticky z-50 bg-[#ffffff] flex justify-between items-center px-[40px] h-20 max-w-full transition-transform duration-300 ${isNavVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <Link href="/" className="flex items-center gap-3 no-underline">
          <img src="/logo.svg" alt="Tradeoff Logo" className="w-8 h-8" />
          <h1 className="font-sans text-[28px] tracking-tighter font-[900] text-[#000000] uppercase mt-1">TRADEOFF</h1>
        </Link>
        <div className="hidden md:flex gap-8">
          <span className="font-mono text-[12px] leading-[1] font-[700] tracking-widest text-[#5d5f5f] font-medium px-2 border-b-[2px] border-[#000000]">
            EVALUATION METHODOLOGY v6.0.2
          </span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/app" className="font-mono text-[12px] leading-[1] font-[700] tracking-[0.1em] border-[2px] border-[#000000] px-6 py-2 hover:bg-[#000000] hover:text-[#ffffff] active:scale-100 transition-colors uppercase bg-[#ffffff] flex items-center gap-2">
            Review <span className="w-2 h-2 bg-[#000000] rounded-full animate-pulse"></span>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-margin-edge py-16 relative">
        {/* Global Header */}
        <header className="mb-24 border-b-thick border-primary pb-8 relative">
          <div className="absolute -top-4 -left-4 w-4 h-4 border-l-thick border-t-thick border-primary"></div>
          <div className="absolute -top-4 -right-4 w-4 h-4 border-r-thick border-t-thick border-primary"></div>
          <p className="font-code-md text-[14px] text-secondary mb-4 uppercase tracking-widest">// ENGINE SPECS</p>
          <h1 className="font-headline-lg text-[32px] md:text-[48px] text-primary uppercase font-black leading-tight tracking-tighter">
            EVALUATION METHODOLOGY
          </h1>
        </header>

        {/* Pipeline Container */}
        <div className="relative flex flex-col gap-16">
          {/* Connecting dashed line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0 border-l-thick border-dashed border-primary -z-10 hidden lg:block"></div>

          {/* Phase 1: HEURISTIC PARSING */}
          <section className="bg-white border-thick border-primary brutal-shadow p-8 lg:w-[48%] self-start relative">
            <div className="absolute -right-16 top-1/2 border-b-thick border-dashed border-primary w-16 hidden lg:block"></div>
            <div className="flex items-center gap-4 mb-6 pb-4 border-b-thin border-primary">
              <div className="bg-primary text-white p-2">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>account_tree</span>
              </div>
              <div>
                <h2 className="font-headline-md text-[24px] font-bold uppercase">PHASE 01</h2>
                <h3 className="font-label-caps text-[12px] tracking-widest">HEURISTIC PARSING</h3>
              </div>
            </div>
            <p className="font-body-lg text-[16px] text-[#4c4546] mb-6 leading-relaxed">
              Extracting constraints (Cost, Velocity, Latency, Reliability) from natural language inputs to map the initial bounded context.
            </p>
            <div className="bg-primary text-white p-4 font-code-md text-[14px] border-thick border-primary">
              <p className="text-[#dadada]">&gt; INIT_PARSER v2.0</p>
              <p className="text-[#dadada]">&gt; ANALYZING INPUT STREAM...</p>
              <p className="text-[#ff291a] mt-2">[EXTRACTED] COST_CEILING = $500/mo</p>
              <p className="text-[#0047AB]">[EXTRACTED] LATENCY_REQ &lt; 50ms</p>
              <p className="text-[#e2e2e2] mt-2">&gt; GENERATING CONSTRAINT MATRIX: DONE</p>
            </div>
          </section>

          {/* Phase 2: THE PRESSURE MAP */}
          <section className="bg-white border-thick border-primary brutal-shadow p-8 lg:w-[48%] self-end relative">
            <div className="absolute -left-16 top-1/2 border-b-thick border-dashed border-primary w-16 hidden lg:block"></div>
            <div className="flex items-center gap-4 mb-6 pb-4 border-b-thin border-primary">
              <div className="bg-primary text-white p-2">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>memory</span>
              </div>
              <div>
                <h2 className="font-headline-md text-[24px] font-bold uppercase">PHASE 02</h2>
                <h3 className="font-label-caps text-[12px] tracking-widest">THE PRESSURE MAP</h3>
              </div>
            </div>
            <p className="font-body-lg text-[16px] text-[#4c4546] mb-6 leading-relaxed">
              Plotting competing drivers. "You can't have 100% Reliability and 100% Velocity—we force the tradeoff."
            </p>
            <div className="border-thick border-primary h-48 relative overflow-hidden bg-[#eeeeee]">
              {/* Minimalist stark grid representation */}
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
              <div className="absolute bottom-4 left-4 right-4 h-[2px] bg-primary"></div>
              <div className="absolute bottom-4 left-4 top-4 w-[2px] bg-primary"></div>
              <div className="absolute bottom-[20%] left-[20%] w-[60%] h-[60%] border-thick border-dashed border-[#0047AB] bg-[#0047AB]/10 flex items-center justify-center">
                <span className="font-label-caps text-[12px] font-bold bg-white px-2 border-thin border-primary">FEASIBLE ZONE</span>
              </div>
            </div>
          </section>

          {/* Phase 3: EXISTENTIAL RISK INJECTION */}
          <section className="bg-[#ffdad6] border-thick border-[#ba1a1a] brutal-shadow p-8 lg:w-[48%] self-start relative">
            <div className="absolute -right-16 top-1/2 border-b-thick border-dashed border-primary w-16 hidden lg:block"></div>
            <div className="flex items-center gap-4 mb-6 pb-4 border-b-thin border-[#ba1a1a]">
              <div className="bg-[#ba1a1a] text-white p-2">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
              </div>
              <div>
                <h2 className="font-headline-md text-[24px] font-bold text-[#93000a] uppercase">PHASE 03</h2>
                <h3 className="font-label-caps text-[12px] tracking-widest text-[#ba1a1a]">EXISTENTIAL RISK INJECTION</h3>
              </div>
            </div>
            <div className="bg-[#93000a] text-white px-3 py-1 inline-block font-label-caps text-[12px] tracking-widest mb-4">
              SEV:CRITICAL ALERT
            </div>
            <p className="font-body-lg text-[16px] text-[#93000a] mb-6 font-bold leading-relaxed">
              Predicting catastrophic failure modes (Split-Brain, Connection Exhaustion) using historical post-mortems.
            </p>
            <ul className="font-code-md text-[14px] text-[#93000a] space-y-2">
              <li className="border-b-thin border-[#ba1a1a]/30 pb-2">01 - INJECT: NETWORK PARTITION [EU-WEST-1]</li>
              <li className="border-b-thin border-[#ba1a1a]/30 pb-2">02 - SIMULATE: CACHE AVALANCHE (t+10s)</li>
              <li className="pb-2">03 - RESULT: 100% DATA LOSS PROBABILITY</li>
            </ul>
          </section>

          {/* Phase 4: SCALE LIMIT PROJECTIONS */}
          <section className="bg-white border-thick border-primary brutal-shadow p-8 lg:w-[48%] self-end relative">
            <div className="absolute -left-16 top-1/2 border-b-thick border-dashed border-primary w-16 hidden lg:block"></div>
            <div className="flex items-center gap-4 mb-6 pb-4 border-b-thin border-primary">
              <div className="bg-primary text-white p-2">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>speed</span>
              </div>
              <div>
                <h2 className="font-headline-md text-[24px] font-bold uppercase">PHASE 04</h2>
                <h3 className="font-label-caps text-[12px] tracking-widest">SCALE LIMIT PROJECTIONS</h3>
              </div>
            </div>
            <p className="font-body-lg text-[16px] text-[#4c4546] mb-6 leading-relaxed">
              Calculating breaking points. Defining strict architectural boundaries before implementation begins.
            </p>
            <table className="w-full text-left border-collapse border-thick border-primary font-code-md text-[14px]">
              <thead>
                <tr className="bg-[#eeeeee] border-b-thick border-primary">
                  <th className="p-2 border-r-thick border-primary">METRIC</th>
                  <th className="p-2 border-r-thick border-primary">PROJECTED LIMIT</th>
                  <th className="p-2">STATUS</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b-thin border-primary">
                  <td className="p-2 border-r-thick border-primary">CONC. WRITES (PG)</td>
                  <td className="p-2 border-r-thick border-primary">~15k/sec</td>
                  <td className="p-2 text-[#ba1a1a] font-bold">BOTTLENECK</td>
                </tr>
                <tr className="border-b-thin border-primary">
                  <td className="p-2 border-r-thick border-primary">READ LATENCY (P99)</td>
                  <td className="p-2 border-r-thick border-primary">12ms</td>
                  <td className="p-2 text-primary font-bold">NOMINAL</td>
                </tr>
                <tr>
                  <td className="p-2 border-r-thick border-primary">CONN. POOL</td>
                  <td className="p-2 border-r-thick border-primary">1000 MAX</td>
                  <td className="p-2 text-[#0047AB] font-bold">WARNING</td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white w-full border-t-thick border-primary flex flex-col md:flex-row justify-between items-center px-margin-edge py-gutter gap-4 mt-24">
        <div className="font-label-caps text-[12px] tracking-widest font-bold">
          © {currentYear} TRADEOFF SYSTEMS. ALL RIGHTS RESERVED.
        </div>
        <div className="flex gap-4 font-label-caps text-[12px] tracking-widest text-secondary">
          <Link className="hover:text-primary transition-colors" href="/methodology">METHODOLOGY</Link>
          <Link className="hover:text-primary transition-colors" href="/api">API REFERENCE</Link>
          <Link className="hover:text-primary transition-colors" href="/changelog">CHANGELOG</Link>
          <Link className="hover:text-primary transition-colors" href="/privacy">PRIVACY</Link>
        </div>
      </footer>
    </div>
  );
}
