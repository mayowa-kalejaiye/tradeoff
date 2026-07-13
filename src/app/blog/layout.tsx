'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { BlogSearch } from '@/components/BlogSearch';

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  useEffect(() => {
    // Reveal animation on scroll (needs a tiny delay for Next.js soft navs to render the DOM)
    let timeoutId = setTimeout(() => {
      const observerOptions = {
        threshold: 0.1
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      }, observerOptions);

      const elements = document.querySelectorAll('.reveal-up');
      elements.forEach(el => observer.observe(el));

      return () => {
        elements.forEach(el => observer.unobserve(el));
      };
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col font-body-md text-on-background selection:bg-primary selection:text-on-primary">
      <style dangerouslySetInnerHTML={{ __html: `
        .blog-wrapper {
            background-color: #faf9f9;
            background-image: radial-gradient(#d1d1d1 1px, transparent 1px);
            background-size: 16px 16px;
        }

        .reveal-up {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .reveal-up.active {
            opacity: 1;
            transform: translateY(0);
        }

        .hard-shadow {
            box-shadow: 8px 8px 0px 0px #000000;
        }

        .reg-mark::before, .reg-mark::after {
            content: '+';
            position: absolute;
            font-family: 'JetBrains Mono', monospace;
            font-weight: bold;
            color: #000;
            font-size: 14px;
        }

        .cursor-crosshair-custom {
            cursor: crosshair;
        }
      `}} />
      
      <div className="blog-wrapper flex-1 flex flex-col">
        {/* TopNavBar */}
        <header className="bg-background border-b-[2px] border-primary sticky top-0 z-50">
          <nav className="flex justify-between items-center w-full px-4 md:px-10 py-4 max-w-[1280px] mx-auto">
            <Link href="/" className="flex items-center gap-3">
              <img src="/logo.svg" alt="Tradeoff Logo" className="w-8 h-8" />
              <h1 className="font-headline-md text-[24px] md:text-[28px] tracking-tighter font-black text-primary uppercase mt-1">TRADEOFF</h1>
            </Link>
            <div className="flex items-center gap-4 md:gap-6 ml-auto">
              <BlogSearch />
              <Link href="/blog#subscribe" className="bg-primary text-on-primary font-label-caps text-[10px] md:text-[12px] font-bold uppercase px-4 md:px-6 py-2 border-[2px] border-primary hover:bg-background hover:text-primary transition-all duration-150 active:translate-x-1 active:translate-y-1 cursor-crosshair-custom inline-block">
                SUBSCRIBE
              </Link>
            </div>
          </nav>
        </header>

        <main className="flex-1 flex flex-col">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-primary text-on-primary mt-8 border-t-[2px] border-primary">
          <div className="w-full px-10 py-12 flex flex-col md:flex-row justify-between items-start max-w-[1280px] mx-auto gap-12">
            <div className="space-y-6 max-w-sm">
              <div className="font-label-caps text-[12px] font-bold text-on-primary">TRADEOFF_ENGINEERING</div>
              <p className="font-mono text-[12px] tracking-widest opacity-80 uppercase leading-relaxed">
                A technical ledger dedicated to the rigorous documentation of architectural choices, system failures, and the pursuit of calibrated engineering efficiency.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-16">
              <div>
                <h4 className="font-label-caps text-[12px] font-bold uppercase mb-6 text-primary-fixed-dim">NAVIGATE</h4>
                <div className="flex flex-col gap-3">
                  <Link className="font-mono text-[12px] hover:text-surface-bright transition-colors cursor-pointer uppercase" href="/app">APP</Link>
                  <Link className="font-mono text-[12px] hover:text-surface-bright transition-colors cursor-pointer uppercase" href="/blog">BLOG</Link>
                  <Link className="font-mono text-[12px] hover:text-surface-bright transition-colors cursor-pointer uppercase" href="/pricing">PRICING</Link>
                  <Link className="font-mono text-[12px] hover:text-surface-bright transition-colors cursor-pointer uppercase" href="/privacy">PRIVACY</Link>
                </div>
              </div>
              <div>
                <h4 className="font-label-caps text-[12px] font-bold uppercase mb-6 text-primary-fixed-dim">SYSTEM</h4>
                <div className="font-mono text-[12px] space-y-2 uppercase opacity-80">
                  <p>NODE: v6.0.2-STABLE</p>
                  <p>STATUS: ACTIVE</p>
                  <p>LOAD: 0.22%</p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full px-10 py-6 border-t border-on-primary/20 max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center opacity-60 gap-4">
            <span className="font-mono text-[10px] text-center">© {new Date().getFullYear()} TRADEOFF_ENGINEERING. ALL RIGHTS RESERVED.</span>
            <span className="font-mono text-[10px]">DESIGN_SPEC: SYS.REV.06</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
