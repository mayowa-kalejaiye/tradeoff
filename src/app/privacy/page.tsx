import Link from 'next/link';
import React from 'react';

export default function PrivacyPage() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex-grow flex flex-col w-full relative blueprint-bg-privacy-page text-on-background bg-background">
      <style dangerouslySetInnerHTML={{
        __html: `
        .blueprint-bg-privacy-page {
            background-color: var(--color-background, #f9f9f9);
            background-image: 
                radial-gradient(var(--color-primary-fixed-dim, #c6c6c6) 1px, transparent 1px),
                linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px);
            background-size: 24px 24px, 100px 100px, 100px 100px;
        }
        .brutalist-shadow-privacy {
            box-shadow: 8px 8px 0px 0px #000000;
        }
        .registration-mark-privacy {
            position: relative;
        }
        .registration-mark-privacy::after {
            content: "+";
            position: absolute;
            bottom: -7px;
            right: -5px;
            font-size: 16px;
            font-family: 'JetBrains Mono', monospace;
            font-weight: 400;
            color: #000000;
            line-height: 1;
            z-index: 10;
        }
        .data-viz-line {
            background-image: linear-gradient(to right, #000 50%, transparent 50%);
            background-size: 16px 2px;
            background-repeat: repeat-x;
            height: 2px;
            width: 100%;
        }
        `
      }} />

      {/* Top Navbar */}
      <header className="w-full top-0 sticky z-50 bg-[#ffffff] border-b-border-thick border-primary flex justify-between items-center px-margin-edge h-20 max-w-full">
        <Link href="/" className="flex items-center gap-3 no-underline">
          <img src="/logo.svg" alt="Tradeoff Logo" className="w-8 h-8" />
          <h1 className="font-sans text-[28px] tracking-tighter font-[900] text-primary uppercase mt-1">TRADEOFF</h1>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/app" className="font-mono text-[12px] leading-[1] font-[700] tracking-[0.1em] border-border-thick border-primary px-6 py-2 hover:bg-primary hover:text-white active:scale-100 transition-colors uppercase bg-white flex items-center gap-2">
            Review <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
          </Link>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center w-full px-margin-edge py-12 md:py-24 max-w-[1440px] mx-auto z-10">
        {/* Hero Header */}
        <header className="w-full border-border-thick border-primary bg-surface-container-lowest p-8 md:p-12 mb-gutter brutalist-shadow-privacy relative registration-mark-privacy">
          <div className="flex flex-col gap-4 border-b-border-thick border-primary pb-8 mb-8">
            <span className="font-label-caps text-label-caps text-secondary uppercase bg-surface-container-high px-2 py-1 w-max border-border-thin border-primary">[STATUS: SECURE]</span>
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary uppercase break-words">DATA PRIVACY PROTOCOL // TRADEOFF</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            <div className="col-span-1 border-r-0 md:border-r-border-thick border-primary md:pr-gutter pb-4 md:pb-0 border-b-border-thick md:border-b-0">
              <p className="font-code-md text-code-md text-on-surface">DOCUMENT ID: TRD-PRV-901</p>
              <p className="font-code-md text-code-md text-secondary mt-2">LAST REVISION: 2026-07-03</p>
            </div>
            <div className="col-span-1 md:col-span-2">
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
                This document details the exact technical mechanisms employed by Tradeoff Systems to guarantee the inviolability of user data. We operate on a strict Zero-Trust architecture where data persistence is treated as a critical vulnerability.
              </p>
            </div>
          </div>
        </header>

        {/* Technical Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter w-full">
          {/* Module 1: Ephemeral Execution */}
          <section className="border-border-thick border-primary bg-surface-container-lowest flex flex-col brutalist-shadow-privacy registration-mark-privacy">
            <div className="border-b-border-thick border-primary p-6 bg-primary text-on-primary flex justify-between items-center">
              <h2 className="font-headline-md text-headline-md uppercase tracking-tighter">01. EPHEMERAL EXECUTION</h2>
              <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>delete</span>
            </div>
            <div className="p-8 flex-grow flex flex-col gap-6">
              <p className="font-body-sm text-body-sm text-on-surface">
                All computational workloads involving proprietary client data are executed in isolated, volatile memory enclaves. Upon task completion or session termination, the memory allocation is cryptographically shredded.
              </p>
              <div className="mt-auto border-t-border-thin border-primary pt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-label-caps text-label-caps text-secondary">MEMORY RETENTION CYCLE</span>
                  <span className="font-code-md text-code-md text-primary font-bold">0 ms</span>
                </div>
                <div className="w-full h-8 border-border-thin border-primary relative bg-surface-container-low overflow-hidden">
                  <div className="absolute inset-y-0 -left-full bg-error w-full animation-purge-custom"></div>
                </div>
              </div>
            </div>
          </section>

          {/* Module 2: No LLM Training */}
          <section className="border-border-thick border-primary bg-surface-container-lowest flex flex-col brutalist-shadow-privacy registration-mark-privacy">
            <div className="border-b-border-thick border-primary p-6 bg-primary text-on-primary flex justify-between items-center">
              <h2 className="font-headline-md text-headline-md uppercase tracking-tighter">02. NO LLM TRAINING</h2>
              <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>block</span>
            </div>
            <div className="p-8 flex-grow flex flex-col gap-6">
              <p className="font-body-sm text-body-sm text-on-surface">
                Under no circumstances is client input, architectural telemetry, or output generated by Tradeoff systems utilized to fine-tune, train, or optimize any underlying foundational models. Data boundaries are enforced via strict contractual and technical air-gaps.
              </p>
              <ul className="mt-auto border-t-border-thin border-primary pt-6 flex flex-col gap-3 font-code-md text-code-md">
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary text-sm">close</span>
                  <span>Model Weights Unaltered</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary text-sm">close</span>
                  <span>Data Sandboxing Active</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Module 3: Telemetry & Logging */}
          <section className="border-border-thick border-primary bg-surface-container-lowest flex flex-col brutalist-shadow-privacy registration-mark-privacy">
            <div className="border-b-border-thick border-primary p-6 bg-surface-container-highest flex justify-between items-center">
              <h2 className="font-headline-md text-headline-md uppercase tracking-tighter text-primary">03. TELEMETRY &amp; LOGGING</h2>
              <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>analytics</span>
            </div>
            <div className="p-8 flex-grow flex flex-col gap-6">
              <p className="font-body-sm text-body-sm text-on-surface">
                System telemetry is restricted to operational vitals required for uptime maintenance. All event tracing occurs at the edge, where payloads are stripped of PII (Personally Identifiable Information) before being aggregated into macro-level performance metrics.
              </p>
              <div className="mt-auto border-t-border-thin border-primary pt-6">
                <div className="data-viz-line mb-4"></div>
                <div className="flex justify-between font-label-caps text-label-caps">
                  <span className="text-secondary">EDGE AGGREGATION</span>
                  <span className="text-primary font-bold">ANONYMIZED</span>
                </div>
              </div>
            </div>
          </section>

          {/* Module 4: Infrastructure Security */}
          <section className="border-border-thick border-primary bg-surface-container-lowest flex flex-col brutalist-shadow-privacy registration-mark-privacy">
            <div className="border-b-border-thick border-primary p-6 bg-surface-container-highest flex justify-between items-center">
              <h2 className="font-headline-md text-headline-md uppercase tracking-tighter text-primary">04. INFRASTRUCTURE SEC.</h2>
              <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>shield</span>
            </div>
            <div className="p-8 flex-grow flex flex-col gap-6">
              <p className="font-body-sm text-body-sm text-on-surface">
                The physical and virtual network perimeters are fortified utilizing military-grade cryptographic standards. We enforce AES-256 encryption for any transient data at rest, and mandate TLS 1.3 for all data in transit across our internal microservices.
              </p>
              <div className="mt-auto grid grid-cols-2 gap-4 border-t-border-thin border-primary pt-6">
                <div className="border-border-thin border-primary p-3 flex flex-col gap-1 items-center bg-surface-container-low">
                  <span className="font-label-caps text-label-caps text-secondary text-center">AT REST</span>
                  <span className="font-code-md text-code-md font-bold">AES-256</span>
                </div>
                <div className="border-border-thin border-primary p-3 flex flex-col gap-1 items-center bg-surface-container-low">
                  <span className="font-label-caps text-label-caps text-secondary text-center">IN TRANSIT</span>
                  <span className="font-code-md text-code-md font-bold">TLS 1.3</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="flex flex-col md:flex-row justify-between items-center px-[40px] py-[24px] w-full bg-[#ffffff] border-t-[2px] border-[#000000] mt-auto z-10 relative">
        <div className="font-mono text-[14px] leading-[1.4] font-[500] text-[#5d5f5f] mb-4 md:mb-0">
          © {currentYear} TRADEOFF SYSTEMS AG. ALL RIGHTS RESERVED.
        </div>
        <nav className="flex gap-6">
          <Link className="font-mono text-[14px] leading-[1.4] font-[500] text-[#5d5f5f] hover:text-[#000000] transition-none" href="/methodology">METHODOLOGY</Link>
          <Link className="font-mono text-[14px] leading-[1.4] font-[500] text-[#5d5f5f] hover:text-[#000000] transition-none" href="/api">API REFERENCE</Link>
          <Link className="font-mono text-[14px] leading-[1.4] font-[500] text-[#5d5f5f] hover:text-[#000000] transition-none" href="/changelog">CHANGELOG</Link>
          <Link className="font-mono text-[14px] leading-[1.4] font-[500] text-[#000000] underline transition-none" href="/privacy">PRIVACY</Link>
        </nav>
      </footer>
    </div>
  );
}
