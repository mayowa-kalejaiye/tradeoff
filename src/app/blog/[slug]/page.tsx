import Link from 'next/link';
import { notFound } from 'next/navigation';
import { WebGLBackground } from '@/components/WebGLBackground';
import ReactMarkdown from 'react-markdown';
import { CodeBlock } from '@/components/CodeBlock';
import { POSTS, BLOG_LIST } from '@/lib/blog-data';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = POSTS[slug];
  if (!post) return { title: 'Post Not Found' };
  return {
    title: `${post.title} | Tradeoff Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = POSTS[slug];
  
  if (!post) {
    notFound();
  }

  // Find previous and next posts
  const currentIndex = BLOG_LIST.findIndex(p => p.slug === slug);
  const nextPost = currentIndex > 0 ? BLOG_LIST[currentIndex - 1] : null; // Because list is sorted newest first
  const prevPost = currentIndex < BLOG_LIST.length - 1 ? BLOG_LIST[currentIndex + 1] : null;

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex flex-col justify-end border-b-[2px] border-primary overflow-hidden">
        <div className="absolute inset-0 z-0">
          <WebGLBackground />
        </div>
        <div className="relative z-10 w-full px-4 md:px-10 py-20 max-w-[1280px] mx-auto">
          <div className="flex flex-wrap gap-4 mb-12 reveal-up">
            <Link href="/blog" className="font-mono text-[12px] border-[2px] border-primary px-3 py-1 font-bold bg-background/80 backdrop-blur-sm hover:bg-primary hover:text-on-primary transition-colors cursor-crosshair-custom flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">arrow_back</span>
              [BACK]
            </Link>
            <span className="font-mono text-[12px] bg-primary text-on-primary px-3 py-1">[SYS_VER: 6.0.2]</span>
            <span className="font-mono text-[12px] border-[2px] border-primary px-3 py-1 font-bold bg-background/80 backdrop-blur-sm">[AUTH: STAFF_ENG]</span>
            <span className="font-mono text-[12px] border-[2px] border-primary px-3 py-1 font-bold bg-background/80 backdrop-blur-sm">[DATE: {post.date}]</span>
          </div>
          <h1 className="font-sans text-[2.5rem] md:text-[5rem] font-black leading-none uppercase mb-4 reveal-up" style={{ transitionDelay: '100ms' }}>
            {post.title}
          </h1>
          <p className="font-sans text-[1.5rem] md:text-[3rem] font-bold text-secondary reveal-up" style={{ transitionDelay: '200ms' }}>
            {post.subtitle || '(AN ENGINEERING LOG)'}
          </p>
        </div>
      </section>

      {/* Reading Content */}
      <section className="w-full px-4 md:px-10 py-24 max-w-[1280px] mx-auto grid grid-cols-12 gap-8">
        
        {/* Left Metadata Col (Desktop Only) */}
        <aside className="hidden lg:block col-span-2 border-r-[2px] border-primary pr-6 h-fit sticky top-32">
          <div className="space-y-8">
            <div>
              <p className="font-mono text-[10px] text-zinc-500 mb-2 uppercase font-bold">Category</p>
              <p className="font-mono text-[12px] uppercase font-bold text-primary">{post.category}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] text-zinc-500 mb-2 uppercase font-bold">Read Time</p>
              <p className="font-mono text-[12px] uppercase font-bold text-primary">{post.readTime}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] text-zinc-500 mb-2 uppercase font-bold">References</p>
              <div className="space-y-1 text-primary">
                {post.references.map((ref, idx) => (
                  <p key={idx} className="font-mono text-[12px]">{ref}</p>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Col */}
        <article className="col-span-12 lg:col-span-8 lg:col-start-4 space-y-16">
          
          {/* Introduction */}
          <div className="reveal-up">
            <p className="text-[18px] md:text-[20px] leading-relaxed first-letter:text-7xl first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:text-primary">
              {post.content.split('\n\n')[0]}
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
            <div className="brutalist-prose max-w-none w-full">
              <ReactMarkdown
                components={{
                  code(props: any) {
                    const { children, className, node, ...rest } = props;
                    const match = /language-(\w+)/.exec(className || '');
                    return match ? (
                      <CodeBlock language={match[1]} code={String(children).replace(/\n$/, '')} />
                    ) : (
                      <code className={className} {...rest}>
                        {children}
                      </code>
                    );
                  }
                }}
              >
                {post.content.substring(post.content.indexOf('\n\n') + 2)}
              </ReactMarkdown>
            </div>
          </div>

          {/* Advice Box */}
          {post.systemAdvice && (
            <div className="bg-primary text-on-primary p-8 hard-shadow reveal-up mt-12">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-on-primary">lightbulb</span>
                <span className="font-mono text-[12px] font-bold uppercase">[SYSTEM_ADVICE]</span>
              </div>
              <h3 className="font-sans font-black text-[24px] mb-4 uppercase">{post.systemAdvice.title}</h3>
              <p className="font-sans text-lg opacity-90 leading-relaxed">
                {post.systemAdvice.text}
              </p>
            </div>
          )}

          {/* Conclusion */}
          <div className="pt-12 border-t-[2px] border-primary reveal-up">
            <p className="font-mono text-[12px] font-bold text-zinc-500 mb-4 uppercase tracking-widest text-center">END OF TRANSMISSION</p>
            <div className="flex justify-center gap-8 text-primary">
              
              {/* Prev Button */}
              {prevPost ? (
                <Link href={`/blog/${prevPost.slug}`} className="w-10 h-10 border-[2px] border-primary flex items-center justify-center font-black hover:bg-primary hover:text-white transition-colors cursor-crosshair-custom text-xl" title="Previous Post">
                  +
                </Link>
              ) : (
                <div className="w-10 h-10 border-[2px] border-primary/30 text-primary/30 flex items-center justify-center font-black cursor-not-allowed text-xl">
                  +
                </div>
              )}

              {/* Index Button */}
              <Link href="/blog" className="w-10 h-10 border-[2px] border-primary flex items-center justify-center font-black hover:bg-primary hover:text-white transition-colors cursor-crosshair-custom text-xl" title="All Posts">
                -
              </Link>
              
              {/* Next Button */}
              {nextPost ? (
                <Link href={`/blog/${nextPost.slug}`} className="w-10 h-10 border-[2px] border-primary flex items-center justify-center font-black hover:bg-primary hover:text-white transition-colors cursor-crosshair-custom text-xl" title="Next Post">
                  +
                </Link>
              ) : (
                <div className="w-10 h-10 border-[2px] border-primary/30 text-primary/30 flex items-center justify-center font-black cursor-not-allowed text-xl">
                  +
                </div>
              )}
              
            </div>
          </div>

        </article>
      </section>
    </>
  );
}
