import Link from 'next/link';
import { notFound } from 'next/navigation';

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

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = POSTS[params.slug];
  if (!post) return { title: 'Post Not Found' };
  return {
    title: `${post.title} | Tradeoff Blog`,
    description: post.content.substring(0, 150) + '...',
  };
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = POSTS[params.slug];
  
  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col p-8 md:p-16">
      <div className="max-w-3xl mx-auto w-full">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-500 hover:text-black mb-12">
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          All Posts
        </Link>
        
        <div className="bg-white border-[2px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 md:p-12">
          <div className="text-xs font-mono font-bold text-zinc-500 mb-4 uppercase tracking-widest">{post.date}</div>
          <h1 className="text-3xl md:text-5xl font-black mb-8 leading-tight">{post.title}</h1>
          
          <div className="prose prose-zinc prose-lg max-w-none prose-headings:font-black prose-headings:uppercase prose-a:text-blue-600 prose-a:font-bold">
            {/* In a real app we would use markdown-to-jsx or next-mdx-remote here */}
            {post.content.split('\n\n').map((paragraph: string, i: number) => (
              <div key={i} className="mb-6 whitespace-pre-wrap">{paragraph}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
