import Link from 'next/link';
import { notFound } from 'next/navigation';
import { WebGLBackground } from '@/components/WebGLBackground';

// Mock database for now
const POSTS: Record<string, any> = {
  'why-most-startups-overengineer': {
    title: 'Why Most Startups Over-Engineer (And How to Avoid It)',
    date: '2026-07-08',
    content: `
# Why You Don't Need Kubernetes

It's the classic founder trap. You're building a simple B2B SaaS, and instead of focusing on product-market fit, you're designing a multi-region, active-active microservices architecture on Kubernetes. 

Your competitor, meanwhile, shipped their MVP on a single VPS with Postgres and is now actively talking to users.

### The Cost of Premature Scaling

The tradeoff is simple: flexibility and extreme scalability come at the cost of **developer velocity**. Every abstraction you add is another layer you have to maintain, debug, and reason about.

When you're small, your biggest risk isn't scaling to millions of users; it's running out of runway before anyone cares.

**Pragmatic Stack Recommendation:**
- Frontend: Next.js or standard React
- Backend: Monolith (Node/Python/Go)
- Database: Postgres (managed)
    `
  },
  'the-true-cost-of-microservices': {
    title: 'The True Cost of Microservices for Early Stage Teams',
    date: '2026-06-15',
    content: `
# Conway's Law in Action

Microservices are often treated as a technical solution, but they are actually an **organizational** solution. They allow independent teams to deploy independently. 

If you are a team of 3 engineers, microservices will only slow you down.

### When to break the monolith?
Only when the pain of coordinating deployments across 20+ engineers outweighs the network overhead, distributed tracing complexity, and debugging nightmares of microservices.
    `
  }
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = POSTS[slug];
  if (!post) return { title: 'Post Not Found' };
  return {
    title: `${post.title} | Tradeoff Blog`,
    description: post.content.substring(0, 150) + '...',
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = POSTS[slug];
  
  if (!post) {
    notFound();
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex flex-col justify-end border-b-[2px] border-primary overflow-hidden">
        <div className="absolute inset-0 z-0">
          <WebGLBackground />
        </div>
        <div className="relative z-10 w-full px-10 py-20 max-w-[1280px] mx-auto">
          <div className="flex flex-wrap gap-4 mb-12 reveal-up">
            <span className="font-mono text-[12px] bg-primary text-on-primary px-3 py-1">[SYS_VER: 6.0.2]</span>
            <span className="font-mono text-[12px] border-[2px] border-primary px-3 py-1 font-bold">[AUTH: STAFF_ENG]</span>
            <span className="font-mono text-[12px] border-[2px] border-primary px-3 py-1 font-bold">[DATE: {post.date}]</span>
          </div>
          <h1 className="font-sans text-[3rem] md:text-[5rem] font-black leading-none uppercase mb-4 reveal-up" style={{ transitionDelay: '100ms' }}>
            {post.title}
          </h1>
          <p className="font-sans text-[2rem] md:text-[3rem] font-bold text-secondary reveal-up" style={{ transitionDelay: '200ms' }}>
            (AN ENGINEERING LOG)
          </p>
        </div>
      </section>

      {/* Reading Content */}
      <section className="w-full px-10 py-24 max-w-[1280px] mx-auto grid grid-cols-12 gap-8">
        
        {/* Left Metadata Col (Desktop Only) */}
        <aside className="hidden lg:block col-span-2 border-r-[2px] border-primary pr-6 h-fit sticky top-32">
          <div className="space-y-8">
            <div>
              <p className="font-mono text-[10px] text-zinc-500 mb-2 uppercase font-bold">Category</p>
              <p className="font-mono text-[12px] uppercase font-bold text-primary">System Architecture</p>
            </div>
            <div>
              <p className="font-mono text-[10px] text-zinc-500 mb-2 uppercase font-bold">Read Time</p>
              <p className="font-mono text-[12px] uppercase font-bold text-primary">12 Minutes</p>
            </div>
            <div>
              <p className="font-mono text-[10px] text-zinc-500 mb-2 uppercase font-bold">References</p>
              <div className="space-y-1 text-primary">
                <p className="font-mono text-[12px]">01. Conway's Law</p>
                <p className="font-mono text-[12px]">02. YAGNI Principle</p>
                <p className="font-mono text-[12px]">03. Second System Effect</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Col */}
        <article className="col-span-12 lg:col-span-8 lg:col-start-4 space-y-16">
          
          {/* Introduction */}
          <div className="reveal-up">
            <p className="text-xl leading-relaxed first-letter:text-7xl first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:text-primary">
              {post.content.split('\n\n')[0] || "Over-engineering is the silent killer of early-stage velocity. In the pursuit of 'scalability' and 'future-proofing,' engineering teams often build complex systems for problems they don't yet have."}
            </p>
          </div>

          {/* Callout 1 */}
          <div className="relative bg-white p-8 border-[2px] border-primary hard-shadow reveal-up">
            <div className="absolute -top-3 -left-3 reg-mark"></div>
            <div className="absolute -bottom-3 -right-3 reg-mark"></div>
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-error">warning</span>
              <span className="font-mono text-[12px] font-bold uppercase text-error">[CRITICAL_WARNING]</span>
            </div>
            <p className="font-sans font-bold text-lg italic text-primary">
              The "Scalability Tax" is paid in time, not infrastructure costs. Every hour spent abstracting a service that serves 10 users as if it serves 10 million is an hour stolen from product discovery.
            </p>
          </div>

          {/* Body Content */}
          <div className="space-y-6 reveal-up">
            <h2 className="font-mono text-[32px] font-bold uppercase border-b-[2px] border-primary pb-2 text-primary">01. THE COMPLEXITY TRAP</h2>
            <div className="prose prose-zinc prose-lg max-w-none text-primary leading-loose">
              {post.content.split('\n\n').slice(1).map((paragraph: string, i: number) => (
                <p key={i} className="mb-6 whitespace-pre-wrap">{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Technical Illustration Image */}
          <div className="reveal-up">
            <div className="border-[2px] border-primary p-2 hard-shadow bg-white relative">
              <img 
                className="w-full aspect-video object-cover grayscale brightness-90" 
                alt="Technical architecture diagram" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqfTD7YFlfLbfbN5iDyk1yhZ0ymu083CtdoijsJZFAMo7TJJIolK31rToA08JjKq45c4Lya3VCUsfiNnhmrfZHbXbGm6jrfdbncEssv0AdOFaf_ildENHL-R3xpoFcdJV8hm6BKUT3ZG2EcT8w6vtAik7uWp6JIT2J96z6z5rPmJajg9LUHcb-BdDDhbru_PE3tsGp1YbO3wgXYN3rIH93-ivYDrpI45Sfe3yxCwsXrfGAHxwRH4DS"
              />
              <div className="mt-4 flex justify-between items-center px-2">
                <span className="font-mono text-[10px] text-zinc-500 font-bold uppercase">FIG_01: Complexity Analysis Flowchart</span>
                <span className="font-mono text-[10px] text-zinc-500 font-bold uppercase">REF_ID: 992-X</span>
              </div>
            </div>
          </div>

          {/* Advice Box */}
          <div className="bg-primary text-on-primary p-8 hard-shadow reveal-up mt-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-on-primary">lightbulb</span>
              <span className="font-mono text-[12px] font-bold uppercase">[SYSTEM_ADVICE]</span>
            </div>
            <h3 className="font-sans font-black text-[24px] mb-4 uppercase">THE ONE-WAY DOOR RULE</h3>
            <p className="font-sans text-lg opacity-90 leading-relaxed">
              Only invest in high-complexity abstractions for "one-way door" decisions—architectural choices that are nearly impossible to reverse later. For "two-way doors" (most database schemas, API structures, or hosting providers), choose the simplest possible path and refactor only when the friction becomes unbearable.
            </p>
          </div>

          {/* Conclusion */}
          <div className="pt-12 border-t-[2px] border-primary reveal-up">
            <p className="font-mono text-[12px] font-bold text-zinc-500 mb-4 uppercase tracking-widest text-center">END OF TRANSMISSION</p>
            <div className="flex justify-center gap-8 text-primary">
              <div className="w-8 h-8 border-[2px] border-primary flex items-center justify-center font-black">+</div>
              <div className="w-8 h-8 border-[2px] border-primary flex items-center justify-center font-black">+</div>
              <div className="w-8 h-8 border-[2px] border-primary flex items-center justify-center font-black">+</div>
            </div>
          </div>

        </article>
      </section>
    </>
  );
}
