'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const currentYear = new Date().getFullYear();
  // Using a static ISO string for initial render to prevent hydration mismatch, 
  // but it can be updated on client if strictly needed. I'll just use a recent date.
  const lastSync = new Date().toISOString().split('T')[0] + 'T14:30:00Z';

  const textareaRef = useRef<HTMLTextAreaElement>(null);
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

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const handleFocus = () => {
        textarea.parentElement?.parentElement?.classList.add('ring-2', 'ring-primary', 'ring-offset-2', 'ring-offset-surface');
    };
    const handleBlur = () => {
        textarea.parentElement?.parentElement?.classList.remove('ring-2', 'ring-primary', 'ring-offset-2', 'ring-offset-surface');
    };

    textarea.addEventListener('focus', handleFocus);
    textarea.addEventListener('blur', handleBlur);

    const placeholder = "We are building an ultra-low latency crypto trading bot...";
    let i = 0;
    textarea.placeholder = "";
    
    let timeoutId: NodeJS.Timeout;
    
    function typeWriter() {
        if (i < placeholder.length) {
            if (textarea) textarea.placeholder += placeholder.charAt(i);
            i++;
            timeoutId = setTimeout(typeWriter, 40);
        }
    }
    
    // Start typing effect with slight delay to ensure fonts are loaded
    const initialTimeoutId = setTimeout(typeWriter, 500);

    return () => {
      textarea.removeEventListener('focus', handleFocus);
      textarea.removeEventListener('blur', handleBlur);
      clearTimeout(timeoutId);
      clearTimeout(initialTimeoutId);
    };
  }, []);

  return (
    <div className="flex-grow flex flex-col w-full">
      {/* TopAppBar */}
      <header className={`w-full top-0 sticky z-50 bg-white border-b-thick border-primary flex justify-between items-center px-margin-edge h-20 max-w-full transition-transform duration-300 ${isNavVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="Tradeoff Logo" className="w-8 h-8" />
          <h1 className="font-headline-md text-[28px] tracking-tighter font-black text-primary uppercase mt-1">TRADEOFF</h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="font-label-caps text-[10px] text-outline hidden md:block">SYS.REV.06 // ACTIVE</div>
          <Link href="/app" className="font-label-caps text-[12px] border-thick border-primary px-6 py-2 hover:bg-primary hover:text-white active:scale-100 transition-colors uppercase bg-white flex items-center gap-2">
            Review <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
          </Link>
        </div>
      </header>

      <main className="flex-grow flex flex-col w-full">
        {/* Hero Section */}
        <section className="px-margin-edge py-24 border-b-thick border-primary bg-transparent relative">
          <div className="registration-mark bottom-0 right-margin-edge translate-y-[1px]"></div>
          <div className="registration-mark bottom-0 left-margin-edge translate-y-[1px]"></div>
          <div className="meta-tag left-4 top-12">DOC_ID: TRD-MN-01</div>
          <div className="meta-tag right-4 top-12">PAGE: 01/04</div>
          <div className="max-w-full relative z-10">
            <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-8">
              <div className="font-label-caps text-[11px] text-primary border-thick border-primary px-2 py-1 bg-white whitespace-nowrap">[SYSTEM_STATUS: ACTIVE]</div>
              <div className="font-label-caps text-[11px] text-outline whitespace-nowrap">|| v6.0.2-STABLE</div>
              <div className="flex-grow border-b border-dashed border-outline-variant h-px opacity-50 min-w-[20px]"></div>
            </div>
            <div className="overflow-hidden mb-10 pb-2">
              <motion.h2 
                initial={{ y: '100%' }} 
                animate={{ y: 0 }} 
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} 
                className="font-headline-lg text-[40px] md:text-[64px] uppercase tracking-tighter font-black max-w-4xl text-primary leading-none"
              >
                ENGINEERING JUDGMENT AT SCALE.
              </motion.h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
              <div className="md:col-span-8 overflow-hidden">
                <motion.p 
                  initial={{ y: '100%' }} 
                  animate={{ y: 0 }} 
                  transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }} 
                  className="font-body-lg text-secondary max-w-2xl border-l-thick border-primary pl-6 py-2 text-lg leading-relaxed"
                >
                  Tradeoff is your virtual Staff Engineer. Uncover existential risks and avoid $100k architecture mistakes before writing a single line of code. Real engineering judgment powered by deterministic reasoning—zero LLM hallucinations.
                </motion.p>
              </div>
              <div className="md:col-span-4 flex items-end justify-end hidden md:flex">
                <div className="font-code-md text-[10px] text-outline text-right uppercase">
                  LAST_SYNC: {lastSync}<br />
                  TARGET: ARCHITECTURE_REVIEW
                </div>
              </div>
            </div>
            <Link href="/app" className="w-full md:w-max bg-primary text-white font-headline-md text-[28px] font-black px-10 py-6 hover:bg-transparent hover:text-primary border-thick border-primary transition-colors uppercase flex md:inline-flex items-center justify-center gap-4 group">
              RUN ARCHITECTURE REVIEW <span className="material-symbols-outlined font-black transform group-hover:translate-x-2 transition-transform">arrow_forward</span>
            </Link>
          </div>
        </section>

        {/* Input Stream Section */}
        <section className="px-margin-edge py-24 border-b-thick border-primary bg-surface relative blueprint-bg">
          <div className="registration-mark top-0 right-margin-edge translate-y-[-1px]"></div>
          <div className="registration-mark bottom-0 left-margin-edge translate-y-[1px]"></div>
          <div className="meta-tag left-4 top-12">SEC: INPUT_STREAM</div>
          <div className="meta-tag right-4 top-12">PAGE: 02/04</div>
          <div className="max-w-4xl mx-auto">
            <div className="border-thick border-primary p-0 flex flex-col bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="border-b-thick border-primary bg-primary text-white px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <span className="w-3 h-3 bg-[#00ff00] border border-white"></span>
                  <span className="font-label-caps text-sm tracking-widest">INPUT_STREAM</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-code-md text-[10px] opacity-70">PORT: 8080</span>
                  <span className="material-symbols-outlined text-lg" data-icon="terminal">terminal</span>
                </div>
              </div>
              <div className="p-8 md:p-12 relative">
                <div className="absolute left-8 top-12 bottom-12 w-px bg-outline-variant opacity-30"></div>
                <textarea 
                  ref={textareaRef}
                  className="w-full h-48 bg-transparent border-none focus:ring-0 font-code-md text-base text-primary resize-none placeholder:text-outline-variant pl-6 leading-relaxed outline-none" 
                  placeholder="We are building an ultra-low latency crypto trading bot..."
                ></textarea>
                <div className="mt-8 flex justify-between items-end border-t-thick border-primary pt-6">
                  <div className="font-code-md text-[10px] text-outline uppercase hidden sm:block">Awaiting input...</div>
                  <Link href="/app" className="font-label-caps text-[12px] flex items-center gap-3 hover:bg-primary hover:text-white border-thick border-primary px-8 py-4 transition-colors bg-white group">
                    SUBMIT <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform" data-icon="keyboard_return">keyboard_return</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Output (Bento Grid) */}
        <section className="px-margin-edge py-24 border-b-thick border-primary bg-white relative">
          <div className="meta-tag left-4 top-12">SEC: ANALYSIS_OUT</div>
          <div className="meta-tag right-4 top-12">PAGE: 03/04</div>
          
          <div className="mb-24">
            <div className="flex items-center justify-between mb-8">
              <div className="font-label-caps text-sm flex items-center gap-3 text-primary border-thick border-primary px-3 py-1 inline-flex bg-surface">
                <span className="w-2 h-2 bg-primary block"></span> [01] EXECUTIVE_SUMMARY
              </div>
              <div className="font-code-md text-[10px] text-outline uppercase">Generated in 1.42s</div>
            </div>
            <h3 className="font-headline-lg-mobile text-[40px] uppercase mb-10 font-black tracking-tighter text-primary">EVENT-DRIVEN MICROSERVICES</h3>
            <div className="space-y-6 border-l-thick border-primary pl-8 ml-2">
              <div className="flex items-start gap-6">
                <span className="font-code-md text-lg font-bold text-primary mt-0.5">+</span>
                <span className="font-code-md text-base text-primary">Decoupled scaling of ingestion vs. execution nodes.</span>
              </div>
              <div className="flex items-start gap-6">
                <span className="font-code-md text-lg font-bold text-primary mt-0.5">+</span>
                <span className="font-code-md text-base text-primary">Eventual consistency acceptable for non-critical audit trails.</span>
              </div>
              <div className="flex items-start gap-6">
                <span className="font-code-md text-lg font-bold text-primary mt-0.5">+</span>
                <span className="font-code-md text-base text-primary">Backpressure handling via distributed message buffers.</span>
              </div>
            </div>
          </div>

          <div className="border-t-thick border-b-thick border-primary py-20 mb-24 blueprint-bg-dense bg-surface -mx-margin-edge px-margin-edge relative">
            <div className="registration-mark top-0 left-1/2 translate-x-[-50%] translate-y-[-1px]"></div>
            <div className="registration-mark bottom-0 left-1/2 translate-x-[-50%] translate-y-[1px]"></div>
            <div className="font-label-caps text-sm mb-10 text-primary bg-white inline-block px-3 py-1 border-thick border-primary">[02] ARCHITECTURE_DRIVERS (PRESSURE_MAP)</div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-0 relative z-10 bg-white border-thick border-primary shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="border-b-thick md:border-b-0 md:border-r-thick border-primary p-8 hover:bg-surface transition-colors">
                <div className="font-headline-lg text-[64px] font-black tracking-tighter mb-4 text-primary leading-none">100<span className="text-3xl text-outline-variant">%</span></div>
                <div className="font-label-caps text-xs text-primary uppercase font-bold">RELIABILITY</div>
                <div className="font-code-md text-[10px] text-outline mt-2">Forced Redundancy</div>
              </div>
              <div className="border-b-thick md:border-b-0 md:border-r-thick border-primary p-8 hover:bg-surface transition-colors">
                <div className="font-headline-lg text-[64px] font-black tracking-tighter mb-4 text-primary leading-none">95<span className="text-3xl text-outline-variant">%</span></div>
                <div className="font-label-caps text-xs text-primary uppercase font-bold">LATENCY</div>
                <div className="font-code-md text-[10px] text-outline mt-2">Edge Processing</div>
              </div>
              <div className="border-b-thick border-r-thick md:border-b-0 border-primary p-8 hover:bg-surface transition-colors bg-surface-container-low">
                <div className="font-headline-lg text-[64px] font-black tracking-tighter mb-4 text-outline leading-none">40<span className="text-3xl text-outline-variant">%</span></div>
                <div className="font-label-caps text-xs text-secondary uppercase font-bold">COST</div>
                <div className="font-code-md text-[10px] text-outline mt-2">High-Compute Tradeoff</div>
              </div>
              <div className="p-8 hover:bg-surface transition-colors">
                <div className="font-headline-lg text-[64px] font-black tracking-tighter mb-4 text-primary leading-none">80<span className="text-3xl text-outline-variant">%</span></div>
                <div className="font-label-caps text-xs text-primary uppercase font-bold">VELOCITY</div>
                <div className="font-code-md text-[10px] text-outline mt-2">Modular Schema</div>
              </div>
            </div>
          </div>

          <div className="mb-24">
            <div className="flex items-center justify-between mb-10">
              <div className="font-label-caps text-sm flex items-center gap-3 text-primary border-thick border-primary px-3 py-1 inline-flex bg-surface">
                <span>[03] RISK_ANALYSIS (INCIDENT_REPORT)</span>
              </div>
              <div className="font-code-md text-[10px] text-primary border border-primary px-2 py-1 bg-surface">ID:TRD-8910-XX | TS:1698243001</div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              <div className="border-thick border-primary p-10 relative bg-white">
                <div className="absolute -top-[2px] left-10 w-24 h-thick bg-white"></div>
                <div className="absolute top-0 left-0 w-2 h-full bg-error"></div>
                <div className="flex gap-3 mb-8">
                  <div className="bg-error text-white px-3 py-1 font-label-caps text-xs border-thick border-error tracking-wider">[SEV:CRITICAL]</div>
                  <div className="border-thick border-primary px-3 py-1 font-label-caps text-xs tracking-wider text-primary">[TYPE:PARTITION]</div>
                </div>
                <p className="font-code-md text-lg text-primary font-bold leading-relaxed">Network split between Region-A and Region-B causes 500ms drift in state synchronization.</p>
              </div>
              
              <div className="bg-surface border-thick border-primary p-10 blueprint-bg-dense relative">
                <div className="absolute top-4 right-4 font-code-md text-[10px] text-outline">AUTO-GENERATED</div>
                <div className="font-label-caps text-sm mb-6 flex items-center gap-2 text-primary bg-white inline-flex px-3 py-1.5 border-thick border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <span className="material-symbols-outlined text-[18px]" data-icon="psychology">psychology</span> AI_INSIGHT
                </div>
                <p className="font-code-md text-base italic bg-white p-6 border-thick border-primary text-primary leading-relaxed">"The current topology prioritizes availability over consistency. In a high-volatility event, this may lead to double-spend risks on the ledger edge."</p>
              </div>
            </div>
          </div>

          <div>
            <div className="font-label-caps text-sm mb-10 text-primary border-thick border-primary px-3 py-1 inline-flex bg-surface">[04] SYSTEM_TOPOLOGY (DECISION_CARDS)</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              <div className="border-thick border-primary flex flex-col bg-white">
                <div className="bg-primary text-white px-8 py-5 font-label-caps text-sm tracking-widest flex justify-between items-center border-b-thick border-primary">
                  <span>POSTGRESQL (PERSISTENCE)</span>
                  <span className="material-symbols-outlined text-[20px]">storage</span>
                </div>
                <div className="p-10 flex-grow flex flex-col gap-10">
                  <div className="space-y-6">
                    <div className="font-code-md text-base text-primary font-bold flex items-start"><span className="mr-4 text-outline mt-0.5">&gt;</span> Wins When: ACID compliance required</div>
                    <div className="font-code-md text-base text-secondary flex items-start"><span className="mr-4 text-outline mt-0.5">&gt;</span> Loses When: Write-heavy global scaling</div>
                  </div>
                  <div className="border-thick border-error mt-auto">
                    <div className="bg-error text-white px-4 py-2 font-label-caps text-xs flex justify-between items-center border-b-thick border-error tracking-wider">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px]">warning</span> SCALE_LIMITS
                      </div>
                      <span className="font-code-md text-[10px]">ERR_C_15K</span>
                    </div>
                    <div className="p-5 bg-[#fff0f0] font-code-md text-sm text-error font-bold leading-relaxed">
                      Max connections reached at 15k concurrent users.
                    </div>
                  </div>
                  <div className="border-t border-dashed border-outline-variant pt-6">
                    <div className="font-label-caps text-[10px] text-outline mb-3 tracking-widest">WHY NOT?</div>
                    <div className="font-code-md text-sm text-primary"><span className="strikethrough-clean">MongoDB</span> (Schema flexibility not worth data integrity risk)</div>
                  </div>
                </div>
              </div>
              
              <div className="border-thick border-primary flex flex-col bg-white">
                <div className="bg-primary text-white px-8 py-5 font-label-caps text-sm tracking-widest flex justify-between items-center border-b-thick border-primary">
                  <span>EDGE MQTT (MESSAGING)</span>
                  <span className="material-symbols-outlined text-[20px]">router</span>
                </div>
                <div className="p-10 flex-grow flex flex-col gap-10">
                  <div className="space-y-6">
                    <div className="font-code-md text-base text-primary font-bold flex items-start"><span className="mr-4 text-outline mt-0.5">&gt;</span> Wins When: Low-bandwidth IoT telemetry</div>
                    <div className="font-code-md text-base text-secondary flex items-start"><span className="mr-4 text-outline mt-0.5">&gt;</span> Loses When: Large payload transfers</div>
                  </div>
                  <div className="border-thick border-error mt-auto">
                    <div className="bg-error text-white px-4 py-2 font-label-caps text-xs flex justify-between items-center border-b-thick border-error tracking-wider">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px]">warning</span> SCALE_LIMITS
                      </div>
                      <span className="font-code-md text-[10px]">ERR_M_1M</span>
                    </div>
                    <div className="p-5 bg-[#fff0f0] font-code-md text-sm text-error font-bold leading-relaxed">
                      Central MQTT broker CPU saturation at 1M topics.
                    </div>
                  </div>
                  <div className="border-t border-dashed border-outline-variant pt-6">
                    <div className="font-label-caps text-[10px] text-outline mb-3 tracking-widest">WHY NOT?</div>
                    <div className="font-code-md text-sm text-primary"><span className="strikethrough-clean">Redis Pub/Sub</span> (Lack of persistent session state)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Authority Section */}
        <section className="border-b-thick border-primary bg-white overflow-hidden relative">
          <div className="registration-mark top-0 left-1/2 translate-x-[-50%] translate-y-[-1px]"></div>
          <div className="grid grid-cols-2 xl:grid-cols-4 border-l-thick border-primary">
            <div className="border-r-thick border-b-thick border-primary p-4 sm:p-8 xl:p-16 flex flex-col items-center justify-center grayscale hover:grayscale-0 transition-all bg-white relative hover:bg-surface text-center">
              <div className="registration-mark bottom-0 right-0 translate-x-[1px] translate-y-[1px]"></div>
              <div className="font-label-caps text-[8px] sm:text-[10px] text-outline mb-2 sm:mb-6 tracking-widest">COGNITIVE_ENGINE</div>
              <div className="font-headline-md text-base sm:text-xl xl:text-3xl tracking-tighter font-black text-primary break-words">SYNTHETIC_STAFF</div>
            </div>
            <div className="border-r-thick border-b-thick border-primary p-4 sm:p-8 xl:p-16 flex flex-col items-center justify-center grayscale hover:grayscale-0 transition-all bg-white relative hover:bg-surface text-center">
              <div className="registration-mark bottom-0 right-0 translate-x-[1px] translate-y-[1px]"></div>
              <div className="font-label-caps text-[8px] sm:text-[10px] text-outline mb-2 sm:mb-6 tracking-widest">THREAT_DETECTION</div>
              <div className="font-headline-md text-base sm:text-xl xl:text-3xl tracking-tighter font-black text-primary break-words">PRE_COMMIT</div>
            </div>
            <div className="border-r-thick border-b-thick border-primary p-4 sm:p-8 xl:p-16 flex flex-col items-center justify-center grayscale hover:grayscale-0 transition-all bg-white relative hover:bg-surface text-center">
              <div className="registration-mark bottom-0 right-0 translate-x-[1px] translate-y-[1px]"></div>
              <div className="font-label-caps text-[8px] sm:text-[10px] text-outline mb-2 sm:mb-6 tracking-widest">KNOWLEDGE_BASE</div>
              <div className="font-headline-md text-base sm:text-xl xl:text-3xl tracking-tighter font-black text-primary break-words">1M+ PATTERNS</div>
            </div>
            <div className="border-r-thick border-b-thick border-primary p-4 sm:p-8 xl:p-16 flex flex-col items-center justify-center grayscale hover:grayscale-0 transition-all bg-surface-container-low relative text-center">
              <div className="font-label-caps text-[8px] sm:text-[10px] text-outline mb-2 sm:mb-6 tracking-widest">SYSTEM_OUTPUT</div>
              <div className="font-headline-md text-base sm:text-xl xl:text-3xl tracking-tighter font-black text-primary flex items-center justify-center gap-1 sm:gap-2 flex-wrap break-words">
                <span className="material-symbols-outlined text-[16px] sm:text-xl md:text-2xl">verified</span> DETERMINISTIC
              </div>
            </div>
          </div>
        </section>

        {/* Technical Blueprint Decorative Image */}
        <section className="p-margin-edge bg-surface blueprint-bg border-b-thick border-primary relative">
          <div className="meta-tag left-4 top-12">SEC: SCHEMATIC</div>
          <div className="meta-tag right-4 top-12">PAGE: 04/04</div>
          <div className="w-full aspect-[21/9] border-thick border-primary relative overflow-hidden bg-white max-w-6xl mx-auto shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            <div className="absolute inset-0 blueprint-bg-dense opacity-20"></div>
            <div className="absolute top-4 right-4 flex gap-2 z-20">
              <div className="w-3 h-3 border-thick border-primary rounded-full bg-white"></div>
              <div className="w-3 h-3 border-thick border-primary rounded-full bg-white"></div>
            </div>
            <img className="w-full h-full object-cover mix-blend-multiply grayscale contrast-125 p-8" alt="A highly technical Swiss architectural blueprint drawing of a complex server infrastructure." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAy5DwOvESkAvaBOZapRuOsIxznKAeTK9suCqx-09W0miP5UWEmWJWZv6gTMKyZkJ_I2mj63UP_wHt9IrOX-p7B4a8f8a8ibX2LBaSoKi3-XBkc20vEYgDLCaJuBsRMil5WvxVZEfhjC0FtYxjKDm-1SUer1xd0WdhDyfswAeD_yP6K4xNExZjZN3GfEbxfG_tXCEk8IN8rMqMY6nfmSl2S4nfq4jIGbU-88YYSR64U66_Te60n6h-C" />
            <div className="absolute bottom-6 left-6 bg-primary text-white px-5 py-3 font-label-caps text-xs border-thick border-primary tracking-widest flex items-center gap-3">
              <span className="material-symbols-outlined text-[16px]">visibility</span> SYS_ARCH_DET_01
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t-thick border-primary px-margin-edge py-12 flex flex-col md:flex-row justify-between items-center bg-white z-10 relative">
        <div className="font-label-caps text-[12px] font-bold">
          © {currentYear} TRADEOFF SYSTEMS. ALL RIGHTS RESERVED.
        </div>
        <div className="flex gap-4 mt-4 md:mt-0 font-label-caps text-[12px] text-secondary">
          <Link href="/methodology" className="hover:text-primary transition-colors">METHODOLOGY</Link>
          <Link href="/api" className="hover:text-primary transition-colors">API REFERENCE</Link>
          <Link href="/changelog" className="hover:text-primary transition-colors">CHANGELOG</Link>
          <Link href="/privacy" className="hover:text-primary transition-colors">PRIVACY</Link>
        </div>
      </footer>
    </div>
  );
}
