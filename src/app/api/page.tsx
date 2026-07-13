'use client';

import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';

export default function ApiPage() {
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
    <div className="bg-[#f9f9f9] text-[#1b1b1b] flex-grow flex flex-col font-sans text-[16px] leading-[1.6] antialiased blueprint-dots-bg">
      <style dangerouslySetInnerHTML={{
        __html: `
        .blueprint-dots-bg {
            background-image: radial-gradient(#c6c6c6 1px, transparent 1px);
            background-size: 20px 20px;
        }
        .offset-shadow-black {
            box-shadow: 8px 8px 0px 0px #000000;
        }
        .offset-shadow-red {
            box-shadow: 8px 8px 0px 0px #ba1a1a;
        }
        .material-symbols-outlined {
            font-family: 'Material Symbols Outlined';
            font-weight: normal;
            font-style: normal;
            font-size: 24px;
            line-height: 1;
            letter-spacing: normal;
            text-transform: none;
            display: inline-block;
            white-space: nowrap;
            word-wrap: normal;
            direction: ltr;
            font-feature-settings: 'liga';
            -webkit-font-feature-settings: 'liga';
            -webkit-font-smoothing: antialiased;
        }
        `
      }} />

      {/* Top Navbar */}
      <header className={`w-full top-0 sticky z-50 bg-[#ffffff] border-b-[2px] border-[#000000] flex justify-between items-center px-[40px] h-20 max-w-full transition-transform duration-300 ${isNavVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <Link href="/" className="flex items-center gap-3 no-underline">
          <img src="/logo.svg" alt="Tradeoff Logo" className="w-8 h-8" />
          <h1 className="font-sans text-[28px] tracking-tighter font-[900] text-[#000000] uppercase mt-1">TRADEOFF</h1>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/app" className="font-mono text-[12px] leading-[1] font-[700] tracking-[0.1em] border-[2px] border-[#000000] px-6 py-2 hover:bg-[#000000] hover:text-[#ffffff] active:scale-100 transition-colors uppercase bg-[#ffffff] flex items-center gap-2">
            Review <span className="w-2 h-2 bg-[#000000] rounded-full animate-pulse"></span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-[40px] py-12 flex flex-col gap-12 relative">
        {/* Vertical Tags */}
        <div className="absolute left-0 top-24 -ml-4 hidden lg:block transform -rotate-90 origin-top-left z-0 opacity-50 pointer-events-none">
          <span className="font-mono text-[14px] leading-[1.4] font-[500] text-[#000000] uppercase tracking-widest">+ CLEARANCE_LVL: 4</span>
        </div>
        <div className="absolute right-0 bottom-24 -mr-4 hidden lg:block transform rotate-90 origin-bottom-right z-0 opacity-50 pointer-events-none">
          <span className="font-mono text-[14px] leading-[1.4] font-[500] text-[#000000] uppercase tracking-widest">+ VPC_PEERING: ENABLED</span>
        </div>

        {/* Hero Section */}
        <section className="w-full border-[2px] border-[#000000] bg-[#ffffff] p-8 offset-shadow-black relative z-10">
          <div className="flex justify-between items-start mb-6 border-b-[1px] border-[#000000] pb-4">
            <h1 className="font-sans text-[32px] md:text-[48px] leading-[1.1] tracking-[-0.02em] font-[800] font-black uppercase text-[#000000]">
              ENTERPRISE INTEGRATION // API ACCESS
            </h1>
            <span className="material-symbols-outlined text-4xl text-[#000000] hidden md:block">api</span>
          </div>
          <p className="font-mono text-[14px] leading-[1.4] font-[500] text-[#4c4546] uppercase tracking-wider max-w-3xl leading-relaxed">
            SYSTEM ARCHITECTURE DOCUMENTATION FOR INSTITUTIONAL CLIENTS. PUBLIC ENDPOINTS DEPRECATED. STRICT PEERING PROTOCOLS ENFORCED.
          </p>
        </section>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[24px] z-10">
          {/* Left Column (Content) */}
          <div className="lg:col-span-7 flex flex-col gap-[24px]">
            {/* Status Block */}
            <div className="w-full border-[2px] border-[#ba1a1a] bg-[#ba1a1a] text-[#ffffff] p-6 offset-shadow-red flex items-start gap-4">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
              <div>
                <h2 className="font-sans text-[24px] leading-[1.2] font-[700] font-bold tracking-tighter uppercase mb-2">ACCESS DENIED: PUBLIC API DISABLED</h2>
                <p className="font-mono text-[14px] leading-[1.4] font-[500] uppercase tracking-wider opacity-90">
                  CRITICAL: ALL PUBLIC REST/GRAPHQL ENDPOINTS HAVE BEEN PERMANENTLY OFFLINED TO PREVENT UNAUTHORIZED DATA EXFILTRATION. INGRESS ONLY PERMITTED VIA AUTHENTICATED TUNNELS.
                </p>
              </div>
            </div>

            {/* Technical Explanation */}
            <div className="w-full border-[2px] border-[#000000] bg-[#ffffff] p-8 offset-shadow-black">
              <h3 className="font-mono text-[12px] leading-[1] font-[700] bg-[#000000] text-[#ffffff] inline-block px-2 py-1 mb-6 uppercase">SYSTEM_ARCHITECTURE.MD</h3>
              <div className="space-y-6">
                <div className="border-b-[1px] border-[#000000] pb-4">
                  <h4 className="font-mono text-[14px] leading-[1.4] font-[500] font-bold uppercase mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-xl">vpn_lock</span>
                    ZERO-TRUST TUNNELING
                  </h4>
                  <p className="font-sans text-[14px] leading-[1.5] font-[400] text-[#4c4546]">
                    Tradeoff integrations bypass public internet endpoints entirely. We establish dedicated, bi-directional, mutually authenticated TLS (mTLS) tunnels. Every request is cryptographically signed and verified at the hardware layer before routing to the application logic. 100% data inviolability guaranteed.
                  </p>
                </div>
                <div>
                  <h4 className="font-mono text-[14px] leading-[1.4] font-[500] font-bold uppercase mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-xl">hub</span>
                    VPC PEERING
                  </h4>
                  <p className="font-sans text-[14px] leading-[1.5] font-[400] text-[#4c4546]">
                    For maximum latency reduction and security, we require direct Virtual Private Cloud (VPC) peering. Your infrastructure integrates natively with our isolated subnets, ensuring traffic never traverses public routing tables.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Terminal & CTA) */}
          <div className="lg:col-span-5 flex flex-col gap-[24px] h-full">
            {/* Terminal */}
            <div className="w-full flex-grow border-[2px] border-[#000000] bg-[#000000] offset-shadow-black flex flex-col">
              <div className="border-b-[1px] border-[#5e5e5e] px-4 py-2 flex justify-between items-center bg-[#ffffff]">
                <span className="font-mono text-[12px] leading-[1] font-[700] text-[#000000] uppercase">bash // root@tradeoff</span>
                <div className="flex gap-2">
                  <div className="w-3 h-3 border-[1px] border-[#000000]"></div>
                  <div className="w-3 h-3 border-[1px] border-[#000000]"></div>
                  <div className="w-3 h-3 border-[1px] border-[#000000] bg-[#000000]"></div>
                </div>
              </div>
              <div className="p-6 font-mono text-[14px] leading-[1.4] font-[500] flex flex-col gap-2 overflow-x-auto text-[#00ff00]">
                <div className="flex">
                  <span className="text-[#5e5e5e] mr-2">$</span>
                  <span className="text-[#ffffff]">ping api.tradeoff.systems...</span>
                </div>
                <div className="text-[#ff0000] mt-4">
                  &gt; 403 FORBIDDEN: MISSING ENTERPRISE CRYPTOGRAPHIC KEY
                </div>
                <div className="text-[#ff0000]">
                  &gt; CONNECTION TERMINATED // REASON: UNAUTHORIZED_PUBLIC_ACCESS_ATTEMPT
                </div>
                <div className="flex mt-4 animate-pulse">
                  <span className="text-[#5e5e5e] mr-2">$</span>
                  <span className="w-2 h-4 bg-[#ffffff] inline-block"></span>
                </div>
              </div>
            </div>
            {/* CTA */}
            <button className="w-full bg-[#000000] text-[#ffffff] border-[2px] border-[#000000] p-6 font-sans text-[24px] leading-[1.2] font-[700] uppercase tracking-tighter hover:bg-[#ffffff] hover:text-[#000000] transition-none offset-shadow-black flex justify-between items-center group">
              <span>REQUEST ENTERPRISE CLEARANCE</span>
              <span className="material-symbols-outlined text-3xl group-hover:translate-x-2 transition-transform">arrow_forward</span>
            </button>
          </div>
        </div>
      </main>

      <footer className="flex flex-col md:flex-row justify-between items-center px-[40px] py-[24px] w-full bg-[#ffffff] border-t-[2px] border-[#000000] mt-auto z-10 relative">
        <div className="font-mono text-[14px] leading-[1.4] font-[500] text-[#5d5f5f] mb-4 md:mb-0">
          © {currentYear} TRADEOFF SYSTEMS AG. ALL RIGHTS RESERVED.
        </div>
        <nav className="flex gap-6">
          <Link className="font-mono text-[14px] leading-[1.4] font-[500] text-[#5d5f5f] hover:text-[#000000] transition-none" href="/methodology">METHODOLOGY</Link>
          <Link className="font-mono text-[14px] leading-[1.4] font-[500] text-[#000000] underline transition-none" href="/api">API REFERENCE</Link>
          <Link className="font-mono text-[14px] leading-[1.4] font-[500] text-[#5d5f5f] hover:text-[#000000] transition-none" href="/changelog">CHANGELOG</Link>
          <Link className="font-mono text-[14px] leading-[1.4] font-[500] text-[#5d5f5f] hover:text-[#000000] transition-none" href="/privacy">PRIVACY</Link>
        </nav>
      </footer>
    </div>
  );
}
