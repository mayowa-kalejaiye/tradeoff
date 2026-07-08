import Link from 'next/link';
import { NewsletterOptIn } from '@/components/NewsletterOptIn';

export const metadata = {
  title: 'Blog | Tradeoff AI',
  description: 'Read the latest insights on software architecture, engineering tradeoffs, and startup technical feasibility.',
};

const POSTS = [
  {
    slug: 'why-most-startups-overengineer',
    title: 'Why Most Startups Over-Engineer (And How to Avoid It)',
    excerpt: 'Founders often reach for Kubernetes when a simple Postgres database would do. Here is a framework to avoid premature scaling.',
    date: '2026-07-08',
  },
  {
    slug: 'the-true-cost-of-microservices',
    title: 'The True Cost of Microservices for Early Stage Teams',
    excerpt: 'Microservices solve organizational scaling problems, not technical ones. Discover when to break the monolith.',
    date: '2026-06-15',
  }
];

export default function BlogIndex() {
  return (
    <div className="w-full px-10 py-24 max-w-[1280px] mx-auto reveal-up">
      <div className="max-w-3xl">
        <h1 className="font-sans text-[4rem] font-black uppercase mb-4 border-b-[2px] border-primary pb-4">
          ARCHIVE
        </h1>
        <p className="font-mono text-secondary mb-12">Thoughts on architecture, tradeoffs, and building pragmatic software.</p>

        <div className="space-y-8">
          {POSTS.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block bg-white border-[2px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all">
              <div className="text-xs font-mono font-bold text-zinc-500 mb-2 uppercase tracking-widest">{post.date}</div>
              <h2 className="text-2xl font-black mb-3">{post.title}</h2>
              <p className="text-zinc-700 font-code-md">{post.excerpt}</p>
            </Link>
          ))}
        </div>

        <div className="mt-16">
          <NewsletterOptIn />
        </div>
      </div>
    </div>
  );
}
