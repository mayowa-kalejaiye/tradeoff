const fs = require('fs');
const { convertToNextJs } = require('./convert');

const privacyHtml = `
<body class="bg-[#f9f9f9] text-[#1b1b1b] min-h-screen flex flex-col font-sans relative w-full">
<style>
        .blueprint-bg-privacy {
            background-color: #f9f9f9;
            background-image: 
                radial-gradient(#c6c6c6 1px, transparent 1px),
                linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px);
            background-size: 24px 24px, 100px 100px, 100px 100px;
        }
        .brutalist-shadow {
            box-shadow: 8px 8px 0px 0px #000000;
        }
        .registration-mark {
            position: relative;
        }
        .registration-mark::after {
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
        @keyframes purge {
            0% { transform: translateX(-100%); }
            10% { transform: translateX(0); }
            90% { transform: translateX(0); opacity: 1; }
            100% { transform: translateX(0); opacity: 0; }
        }
</style>
<!-- TopNavBar: Suppressed per intent rules (Linear/Task focused document view) -->
<header class="w-full top-0 sticky z-50 bg-[#ffffff] border-b-[2px] border-[#000000] flex justify-between items-center px-[40px] h-20 max-w-full">
  <a href="/" class="flex items-center gap-3 no-underline">
    <span class="material-symbols-outlined text-[#000000] text-3xl" data-icon="architecture">architecture</span>
    <h1 class="font-sans text-[28px] tracking-tighter font-[900] text-[#000000] uppercase mt-1">TRADEOFF</h1>
  </a>
  <div class="flex items-center gap-6">
    <a href="/app" class="font-mono text-[12px] leading-[1] font-[700] tracking-[0.1em] border-[2px] border-[#000000] px-6 py-2 hover:bg-[#000000] hover:text-[#ffffff] active:scale-100 transition-colors uppercase bg-[#ffffff] flex items-center gap-2">
      Review <span class="w-2 h-2 bg-[#000000] rounded-full animate-pulse"></span>
    </a>
  </div>
</header>
<main class="flex-grow flex flex-col items-center w-full px-[40px] py-[48px] md:py-[96px] max-w-[1440px] mx-auto blueprint-bg-privacy z-10">
<!-- Hero Header -->
<header class="w-full border-[2px] border-[#000000] bg-[#ffffff] p-8 md:p-12 mb-[24px] brutalist-shadow relative registration-mark">
<div class="flex flex-col gap-[16px] border-b-[2px] border-[#000000] pb-8 mb-8">
<span class="font-mono text-[12px] leading-[1] font-[700] tracking-[0.1em] text-[#5d5f5f] uppercase bg-[#e8e8e8] px-2 py-1 w-max border-[1px] border-[#000000]">[STATUS: SECURE]</span>
<h1 class="font-sans md:font-sans text-[32px] leading-[1.2] font-[800] md:text-[48px] text-[#000000] uppercase break-words">DATA PRIVACY PROTOCOL // TRADEOFF</h1>
</div>
<div class="grid grid-cols-1 md:grid-cols-3 gap-[24px]">
<div class="col-span-1 border-r-0 md:border-r-[2px] border-[#000000] md:pr-[24px] pb-4 md:pb-0 border-b-[2px] md:border-b-0">
<p class="font-mono text-[14px] leading-[1.4] font-[500] text-[#1b1b1b]">DOCUMENT ID: TRD-PRV-901</p>
<p class="font-mono text-[14px] leading-[1.4] font-[500] text-[#5d5f5f] mt-2">LAST REVISION: 2024-10-24</p>
</div>
<div class="col-span-1 md:col-span-2">
<p class="font-sans text-[16px] leading-[1.6] font-[400] text-[#4c4546] max-w-2xl">
                        This document details the exact technical mechanisms employed by Tradeoff Systems to guarantee the inviolability of user data. We operate on a strict Zero-Trust architecture where data persistence is treated as a critical vulnerability.
                    </p>
</div>
</div>
</header>
<!-- Technical Modules Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-[24px] w-full">
<!-- Module 1: Ephemeral Execution -->
<section class="border-[2px] border-[#000000] bg-[#ffffff] flex flex-col brutalist-shadow registration-mark">
<div class="border-b-[2px] border-[#000000] p-6 bg-[#000000] text-[#ffffff] flex justify-between items-center">
<h2 class="font-sans text-[24px] leading-[1.2] font-[700] uppercase tracking-tighter">01. EPHEMERAL EXECUTION</h2>
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">delete</span>
</div>
<div class="p-8 flex-grow flex flex-col gap-[24px]">
<p class="font-sans text-[14px] leading-[1.5] font-[400] text-[#1b1b1b]">
                        All computational workloads involving proprietary client data are executed in isolated, volatile memory enclaves. Upon task completion or session termination, the memory allocation is cryptographically shredded.
                    </p>
<div class="mt-auto border-t-[1px] border-[#000000] pt-6">
<div class="flex justify-between items-center mb-2">
<span class="font-mono text-[12px] leading-[1] font-[700] tracking-[0.1em] text-[#5d5f5f]">MEMORY RETENTION CYCLE</span>
<span class="font-mono text-[14px] leading-[1.4] font-[500] text-[#000000] font-bold">0 ms</span>
</div>
<div class="w-full h-8 border-[1px] border-[#000000] relative bg-[#f3f3f3] overflow-hidden">
<div class="absolute inset-y-0 left-0 bg-[#ba1a1a] w-full transform -translate-x-full" style="animation: purge 2s infinite;"></div>
</div>
</div>
</div>
</section>
<!-- Module 2: No LLM Training -->
<section class="border-[2px] border-[#000000] bg-[#ffffff] flex flex-col brutalist-shadow registration-mark">
<div class="border-b-[2px] border-[#000000] p-6 bg-[#000000] text-[#ffffff] flex justify-between items-center">
<h2 class="font-sans text-[24px] leading-[1.2] font-[700] uppercase tracking-tighter">02. NO LLM TRAINING</h2>
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">block</span>
</div>
<div class="p-8 flex-grow flex flex-col gap-[24px]">
<p class="font-sans text-[14px] leading-[1.5] font-[400] text-[#1b1b1b]">
                        Under no circumstances is client input, architectural telemetry, or output generated by Tradeoff systems utilized to fine-tune, train, or optimize any underlying foundational models. Data boundaries are enforced via strict contractual and technical air-gaps.
                    </p>
<ul class="mt-auto border-t-[1px] border-[#000000] pt-6 flex flex-col gap-3 font-mono text-[14px] leading-[1.4] font-[500]">
<li class="flex items-center gap-3">
<span class="material-symbols-outlined text-[#5d5f5f] text-sm">close</span>
<span>Model Weights Unaltered</span>
</li>
<li class="flex items-center gap-3">
<span class="material-symbols-outlined text-[#5d5f5f] text-sm">close</span>
<span>Data Sandboxing Active</span>
</li>
</ul>
</div>
</section>
<!-- Module 3: Telemetry & Logging -->
<section class="border-[2px] border-[#000000] bg-[#ffffff] flex flex-col brutalist-shadow registration-mark">
<div class="border-b-[2px] border-[#000000] p-6 bg-[#e2e2e2] flex justify-between items-center">
<h2 class="font-sans text-[24px] leading-[1.2] font-[700] uppercase tracking-tighter text-[#000000]">03. TELEMETRY &amp; LOGGING</h2>
<span class="material-symbols-outlined text-[#000000]" style="font-variation-settings: 'FILL' 1;">analytics</span>
</div>
<div class="p-8 flex-grow flex flex-col gap-[24px]">
<p class="font-sans text-[14px] leading-[1.5] font-[400] text-[#1b1b1b]">
                        System telemetry is restricted to operational vitals required for uptime maintenance. All event tracing occurs at the edge, where payloads are stripped of PII (Personally Identifiable Information) before being aggregated into macro-level performance metrics.
                    </p>
<div class="mt-auto border-t-[1px] border-[#000000] pt-6">
<div class="data-viz-line mb-4"></div>
<div class="flex justify-between font-mono text-[12px] leading-[1] font-[700] tracking-[0.1em]">
<span class="text-[#5d5f5f]">EDGE AGGREGATION</span>
<span class="text-[#000000] font-bold">ANONYMIZED</span>
</div>
</div>
</div>
</section>
<!-- Module 4: Infrastructure Security -->
<section class="border-[2px] border-[#000000] bg-[#ffffff] flex flex-col brutalist-shadow registration-mark">
<div class="border-b-[2px] border-[#000000] p-6 bg-[#e2e2e2] flex justify-between items-center">
<h2 class="font-sans text-[24px] leading-[1.2] font-[700] uppercase tracking-tighter text-[#000000]">04. INFRASTRUCTURE SEC.</h2>
<span class="material-symbols-outlined text-[#000000]" style="font-variation-settings: 'FILL' 1;">shield</span>
</div>
<div class="p-8 flex-grow flex flex-col gap-[24px]">
<p class="font-sans text-[14px] leading-[1.5] font-[400] text-[#1b1b1b]">
                        The physical and virtual network perimeters are fortified utilizing military-grade cryptographic standards. We enforce AES-256 encryption for any transient data at rest, and mandate TLS 1.3 for all data in transit across our internal microservices.
                    </p>
<div class="mt-auto grid grid-cols-2 gap-4 border-t-[1px] border-[#000000] pt-6">
<div class="border-[1px] border-[#000000] p-3 flex flex-col gap-1 items-center bg-[#f3f3f3]">
<span class="font-mono text-[12px] leading-[1] font-[700] tracking-[0.1em] text-[#5d5f5f] text-center">AT REST</span>
<span class="font-mono text-[14px] leading-[1.4] font-[500] font-bold">AES-256</span>
</div>
<div class="border-[1px] border-[#000000] p-3 flex flex-col gap-1 items-center bg-[#f3f3f3]">
<span class="font-mono text-[12px] leading-[1] font-[700] tracking-[0.1em] text-[#5d5f5f] text-center">IN TRANSIT</span>
<span class="font-mono text-[14px] leading-[1.4] font-[500] font-bold">TLS 1.3</span>
</div>
</div>
</div>
</section>
</div>
</main>
<!-- Footer Component -->
<footer class="flex flex-col md:flex-row justify-between items-center px-[40px] py-[24px] w-full bg-[#ffffff] border-t-[2px] border-[#000000] mt-auto z-10 relative">
<div class="font-sans text-[24px] leading-[1.2] font-[700] font-black text-[#000000] mb-4 md:mb-0">
            TRADEOFF
        </div>
<nav class="flex gap-6 mb-4 md:mb-0">
<a class="font-mono text-[14px] leading-[1.4] font-[500] text-[#5d5f5f] hover:text-[#000000] transition-none" href="/methodology">DOCUMENTATION</a>
<a class="font-mono text-[14px] leading-[1.4] font-[500] text-[#5d5f5f] hover:text-[#000000] transition-none" href="/api">API REFERENCE</a>
<a class="font-mono text-[14px] leading-[1.4] font-[500] text-[#5d5f5f] hover:text-[#000000] transition-none" href="/changelog">CHANGELOG</a>
<a class="font-mono text-[14px] leading-[1.4] font-[500] text-[#000000] underline transition-none" href="/privacy">COMPLIANCE</a>
</nav>
<div class="font-mono text-[14px] leading-[1.4] font-[500] text-[#5d5f5f]">
            ©2024 TRADEOFF SYSTEMS AG. ALL RIGHTS RESERVED.
        </div>
</footer>
</body>
`;

const jsCode = `
import Link from 'next/link';
import React from 'react';

export default function PrivacyPage() {
  return (
    ${privacyHtml.replace(/class=/g, 'className=').replace(/style="([^"]*)"/g, (match, p1) => {
      return \`style={{ \${p1.split(';').filter(Boolean).map(s => {
        let [k, v] = s.split(':');
        k = k.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
        return \`\${k}: "\${v.trim()}"\`;
      }).join(', ')} }}\`;
    }).replace(/<!--[\s\S]*?-->/g, '').replace(/<a\s/g, '<Link ').replace(/<\/a>/g, '</Link>').replace(/<br>/g, '<br/>')}
  );
}
`;

fs.writeFileSync('src/app/privacy/page.tsx', jsCode);

console.log("Privacy page replaced");
