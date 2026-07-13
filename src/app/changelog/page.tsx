'use client';

import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';

export default function ChangelogPage() {
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
    <div className="bg-[#f9f9f9] text-[#000000] flex-grow flex flex-col font-sans text-[16px] leading-[1.6]">
      <style dangerouslySetInnerHTML={{
        __html: `
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
        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
        }
        .animate-blink {
            animation: blink 1s step-end infinite;
        }
        `
      }} />

      {/* Top Navbar */}
      <header className={`w-full top-0 sticky z-50 bg-[#ffffff] flex justify-between items-center px-[40px] h-20 max-w-full transition-transform duration-300 ${isNavVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <Link href="/" className="flex items-center gap-3 no-underline">
          <img src="/logo.svg" alt="Tradeoff Logo" className="w-8 h-8" />
          <h1 className="font-sans text-[28px] tracking-tighter font-[900] text-[#000000] uppercase mt-1">TRADEOFF</h1>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/app" className="font-mono text-[12px] leading-[1] font-[700] border-[2px] border-[#000000] px-6 py-2 hover:bg-[#000000] hover:text-[#ffffff] active:scale-100 transition-colors uppercase bg-[#ffffff] flex items-center gap-2 tracking-[0.1em]">
            Review <span className="w-2 h-2 bg-[#000000] rounded-full animate-pulse"></span>
          </Link>
        </div>
      </header>

      <main className="flex-grow flex flex-col p-[40px] lg:p-16 max-w-[1440px] mx-auto w-full">
        <header className="mb-[24px] pb-[24px] flex flex-col md:flex-row md:justify-between md:items-end gap-[8px]">
          <div>
            <div className="flex items-center gap-2 mb-2 font-mono text-[12px] leading-[1] font-[700]">
              <span className="w-2 h-2 bg-[#000000] block animate-blink"></span>
              <span>[ENGINE: ONLINE]</span>
            </div>
            <h1 className="font-sans text-[32px] md:text-[48px] leading-[1.1] tracking-[-0.02em] font-[800]">SYSTEM CHANGELOG<br/>// ENGINE UPDATES</h1>
          </div>
          <div className="font-mono text-[14px] leading-[1.4] font-[500] text-[#5d5f5f] border-t-[1px] border-[#000000] pt-2 md:border-t-0 md:pt-0">
            <p>SYS_VER: 6.0.2</p>
            <p>ENV: PRODUCTION</p>
          </div>
        </header>

        <section className="relative">
          <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[2px] bg-[repeating-linear-gradient(to_bottom,black,black_4px,transparent_4px,transparent_8px)] md:-translate-x-1/2"></div>
          <div className="flex flex-col gap-12 pt-8">
            {/* Release 01 */}
            <article className="relative flex flex-col md:flex-row items-start w-full">
              <div className="hidden md:flex w-1/2 justify-end pr-12 pt-1 font-mono text-[12px] leading-[1] font-[700] text-[#5d5f5f] text-right">
                <span>TIMESTAMP: 2026-07-02T08:00:00Z</span>
              </div>
              <div className="absolute left-[14px] md:left-1/2 w-4 h-4 bg-[#f9f9f9] border-[2px] border-[#000000] z-10 md:-translate-x-1/2 mt-2"></div>
              <div className="w-full pl-12 md:w-1/2 md:pl-12">
                <div className="bg-[#ffffff] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex flex-wrap items-center gap-2 mb-4 font-mono text-[12px] leading-[1] font-[700]">
                    <span className="bg-[#000000] text-[#ffffff] px-2 py-1">[PATCH]</span>
                    <span className="bg-[#000000] text-[#ffffff] px-2 py-1">[STABLE]</span>
                    <span className="ml-auto text-[#5d5f5f]">+</span>
                  </div>
                  <h2 className="font-sans text-[24px] leading-[1.2] font-[700] mb-2">v6.0.2-STABLE</h2>
                  <ul className="font-mono text-[14px] leading-[1.4] font-[500] space-y-2 mt-4">
                    <li className="flex items-start border-b-[1px] border-[#cfc4c5] pb-2">
                      <span className="mr-2 text-[#000000] font-bold">01.</span>
                      <span>Refactored edge telemetry aggregation</span>
                    </li>
                    <li className="flex items-start pb-2">
                      <span className="mr-2 text-[#000000] font-bold">02.</span>
                      <span>Optimized zero-trust memory shredding down to 0ms.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </article>

            {/* Release 02 */}
            <article className="relative flex flex-col md:flex-row items-start w-full">
              <div className="w-full pl-12 md:w-1/2 md:pl-0 md:pr-12 md:text-right order-2 md:order-1">
                <div className="bg-[#ffffff] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-left md:text-right">
                  <div className="flex flex-wrap items-center gap-2 mb-4 font-mono text-[12px] leading-[1] font-[700] md:justify-end">
                    <span className="border-[1px] border-[#000000] px-2 py-1 text-[#000000]">[MAJOR]</span>
                    <span className="border-[1px] border-[#000000] px-2 py-1 text-[#000000]">[DEPRECATED]</span>
                    <span className="mr-auto text-[#5d5f5f] md:mr-0 md:ml-auto">+</span>
                  </div>
                  <h2 className="font-sans text-[24px] leading-[1.2] font-[700] mb-2 text-[#5d5f5f]">v5.8.9-DEPRECATED</h2>
                  <ul className="font-mono text-[14px] leading-[1.4] font-[500] space-y-2 mt-4">
                    <li className="flex items-start border-b-[1px] border-[#cfc4c5] pb-2 md:flex-row-reverse md:text-right">
                      <span className="mr-2 md:mr-0 md:ml-2 text-[#5d5f5f] font-bold">01.</span>
                      <span className="text-[#5d5f5f]">Legacy architecture evaluation thresholds adjusted.</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="absolute left-[14px] md:left-1/2 w-4 h-4 bg-[#f9f9f9] border-[2px] border-[#000000] z-10 md:-translate-x-1/2 mt-2 order-1 md:order-2"></div>
              <div className="hidden md:flex w-1/2 pl-12 pt-1 font-mono text-[12px] leading-[1] font-[700] text-[#5d5f5f] order-3">
                <span>TIMESTAMP: 2026-07-01T14:30:00Z</span>
              </div>
            </article>

            {/* Release 03 */}
            <article className="relative flex flex-col md:flex-row items-start w-full">
              <div className="hidden md:flex w-1/2 justify-end pr-12 pt-1 font-mono text-[12px] leading-[1] font-[700] text-[#5e5e5e] text-right">
                <span>TIMESTAMP: 2026-06-30T09:15:00Z</span>
              </div>
              <div className="absolute left-[14px] md:left-1/2 w-4 h-4 bg-[#e2e2e2] border-[2px] border-[#7e7576] z-10 md:-translate-x-1/2 mt-2"></div>
              <div className="w-full pl-12 md:w-1/2 md:pl-12 opacity-50 hover:opacity-100 transition-opacity">
                <div className="bg-[#e8e8e8] p-6">
                  <div className="flex flex-wrap items-center gap-2 mb-4 font-mono text-[12px] leading-[1] font-[700]">
                    <span className="border-[1px] border-[#7e7576] px-2 py-1">[MAJOR]</span>
                    <span className="border-[1px] border-[#7e7576] px-2 py-1">[ARCHIVED]</span>
                    <span className="ml-auto text-[#7e7576]">+</span>
                  </div>
                  <h2 className="font-sans text-[24px] leading-[1.2] font-[700] mb-2 text-[#7e7576]">v4.1.0-ARCHIVED</h2>
                  <p className="font-mono text-[14px] leading-[1.4] font-[500] mt-4 text-[#7e7576] border-t-[1px] border-[#7e7576] pt-2">
                    [DATA EXPUNGED // ARCHIVE STATE]
                  </p>
                </div>
              </div>
            </article>
            {/* Release 04 */}
            <article className="relative flex flex-col md:flex-row items-start w-full">
              <div className="w-full pl-12 md:w-1/2 md:pl-0 md:pr-12 md:text-right order-2 md:order-1 opacity-50 hover:opacity-100 transition-opacity">
                <div className="bg-[#e8e8e8] p-6 text-left md:text-right">
                  <div className="flex flex-wrap items-center gap-2 mb-4 font-mono text-[12px] leading-[1] font-[700] md:justify-end">
                    <span className="border-[1px] border-[#7e7576] px-2 py-1 text-[#7e7576]">[MINOR]</span>
                    <span className="border-[1px] border-[#7e7576] px-2 py-1 text-[#7e7576]">[ARCHIVED]</span>
                    <span className="mr-auto text-[#7e7576] md:mr-0 md:ml-auto">+</span>
                  </div>
                  <h2 className="font-sans text-[24px] leading-[1.2] font-[700] mb-2 text-[#7e7576]">v3.2.1-ARCHIVED</h2>
                  <p className="font-mono text-[14px] leading-[1.4] font-[500] mt-4 text-[#7e7576] border-t-[1px] border-[#7e7576] pt-2">
                    [DATA EXPUNGED // ARCHIVE STATE]
                  </p>
                </div>
              </div>
              <div className="absolute left-[14px] md:left-1/2 w-4 h-4 bg-[#e2e2e2] border-[2px] border-[#7e7576] z-10 md:-translate-x-1/2 mt-2 order-1 md:order-2"></div>
              <div className="hidden md:flex w-1/2 pl-12 pt-1 font-mono text-[12px] leading-[1] font-[700] text-[#5e5e5e] order-3">
                <span>TIMESTAMP: 2026-06-29T11:00:00Z</span>
              </div>
            </article>

            {/* Release 05 */}
            <article className="relative flex flex-col md:flex-row items-start w-full">
              <div className="hidden md:flex w-1/2 justify-end pr-12 pt-1 font-mono text-[12px] leading-[1] font-[700] text-[#5e5e5e] text-right">
                <span>TIMESTAMP: 2026-06-27T16:45:00Z</span>
              </div>
              <div className="absolute left-[14px] md:left-1/2 w-4 h-4 bg-[#e2e2e2] border-[2px] border-[#7e7576] z-10 md:-translate-x-1/2 mt-2"></div>
              <div className="w-full pl-12 md:w-1/2 md:pl-12 opacity-50 hover:opacity-100 transition-opacity">
                <div className="bg-[#e8e8e8] p-6">
                  <div className="flex flex-wrap items-center gap-2 mb-4 font-mono text-[12px] leading-[1] font-[700]">
                    <span className="border-[1px] border-[#7e7576] px-2 py-1 text-[#7e7576]">[MAJOR]</span>
                    <span className="border-[1px] border-[#7e7576] px-2 py-1 text-[#7e7576]">[ARCHIVED]</span>
                    <span className="ml-auto text-[#7e7576]">+</span>
                  </div>
                  <h2 className="font-sans text-[24px] leading-[1.2] font-[700] mb-2 text-[#7e7576]">v2.0.0-ARCHIVED</h2>
                  <p className="font-mono text-[14px] leading-[1.4] font-[500] mt-4 text-[#7e7576] border-t-[1px] border-[#7e7576] pt-2">
                    [DATA EXPUNGED // ARCHIVE STATE]
                  </p>
                </div>
              </div>
            </article>

            {/* Release 06 */}
            <article className="relative flex flex-col md:flex-row items-start w-full">
              <div className="w-full pl-12 md:w-1/2 md:pl-0 md:pr-12 md:text-right order-2 md:order-1 opacity-50 hover:opacity-100 transition-opacity">
                <div className="bg-[#e8e8e8] p-6 text-left md:text-right">
                  <div className="flex flex-wrap items-center gap-2 mb-4 font-mono text-[12px] leading-[1] font-[700] md:justify-end">
                    <span className="border-[1px] border-[#7e7576] px-2 py-1 text-[#7e7576]">[GENESIS]</span>
                    <span className="border-[1px] border-[#7e7576] px-2 py-1 text-[#7e7576]">[ARCHIVED]</span>
                    <span className="mr-auto text-[#7e7576] md:mr-0 md:ml-auto">+</span>
                  </div>
                  <h2 className="font-sans text-[24px] leading-[1.2] font-[700] mb-2 text-[#7e7576]">v1.0.0-INITIAL</h2>
                  <p className="font-mono text-[14px] leading-[1.4] font-[500] mt-4 text-[#7e7576] border-t-[1px] border-[#7e7576] pt-2">
                    [SYSTEM INCEPTION // CORE LOOP ESTABLISHED]
                  </p>
                </div>
              </div>
              <div className="absolute left-[14px] md:left-1/2 w-4 h-4 bg-[#e2e2e2] border-[2px] border-[#7e7576] z-10 md:-translate-x-1/2 mt-2 order-1 md:order-2"></div>
              <div className="hidden md:flex w-1/2 pl-12 pt-1 font-mono text-[12px] leading-[1] font-[700] text-[#5e5e5e] order-3">
                <span>TIMESTAMP: 2026-06-24T00:00:00Z</span>
              </div>
            </article>
          </div>
        </section>
      </main>

      <footer className="flex flex-col md:flex-row justify-between items-center px-[40px] py-[24px] w-full bg-[#ffffff] border-t-[2px] border-[#000000] mt-auto z-10 relative">
        <div className="font-mono text-[14px] leading-[1.4] font-[500] text-[#5d5f5f] mb-4 md:mb-0">
          © {currentYear} TRADEOFF SYSTEMS AG. ALL RIGHTS RESERVED.
        </div>
        <nav className="flex gap-6">
          <Link className="font-mono text-[14px] leading-[1.4] font-[500] text-[#5d5f5f] hover:text-[#000000] transition-none" href="/methodology">METHODOLOGY</Link>
          <Link className="font-mono text-[14px] leading-[1.4] font-[500] text-[#5d5f5f] hover:text-[#000000] transition-none" href="/api">API REFERENCE</Link>
          <Link className="font-mono text-[14px] leading-[1.4] font-[500] text-[#000000] underline transition-none" href="/changelog">CHANGELOG</Link>
          <Link className="font-mono text-[14px] leading-[1.4] font-[500] text-[#5d5f5f] hover:text-[#000000] transition-none" href="/privacy">PRIVACY</Link>
        </nav>
      </footer>
    </div>
  );
}
