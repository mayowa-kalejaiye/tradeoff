import Link from 'next/link';
import { NewsletterOptIn } from '@/components/NewsletterOptIn';
import { BLOG_LIST } from '@/lib/blog-data';

export const metadata = {
  title: 'Blog | Tradeoff AI',
  description: 'Read the latest insights on software architecture, engineering tradeoffs, and startup technical feasibility.',
};

export default function BlogIndex() {
  return (
    <div className="w-full px-10 py-24 max-w-[1280px] mx-auto reveal-up">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Left Column - Blog List */}
        <div className="lg:col-span-7 xl:col-span-8">
          <h1 className="font-sans text-[4rem] font-black uppercase mb-4 border-b-[2px] border-primary pb-4">
            ARCHIVE
          </h1>
          <p className="font-mono text-secondary mb-12">Thoughts on architecture, tradeoffs, and building pragmatic software.</p>

          <div className="space-y-8 pb-12">
            {BLOG_LIST.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="block bg-white border-[2px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all">
                <div className="text-xs font-mono font-bold text-zinc-500 mb-2 uppercase tracking-widest">{post.date}</div>
                <h2 className="text-2xl font-black mb-3">{post.title}</h2>
                <p className="text-zinc-700 font-code-md">{post.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Right Column - Sticky Sidebar */}
        <div className="lg:col-span-5 xl:col-span-4 relative" id="subscribe">
          <div className="sticky top-32">
            <h3 className="font-mono text-sm font-bold text-secondary uppercase tracking-widest mb-4">
              [ TRANSMISSION.SUBSCRIBE ]
            </h3>
            <NewsletterOptIn />
          </div>
        </div>

      </div>
    </div>
  );
}
