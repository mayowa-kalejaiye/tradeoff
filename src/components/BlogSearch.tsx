'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { BLOG_LIST } from '@/lib/blog-data';
import { useRouter } from 'next/navigation';

export function BlogSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const filteredPosts = BLOG_LIST.filter(post => 
    post.title.toLowerCase().includes(query.toLowerCase()) || 
    post.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 10);
  };

  return (
    <div className="relative" ref={searchRef}>
      {isOpen ? (
        <div className="flex items-center border-[2px] border-primary bg-white h-10 w-[200px] md:w-[300px]">
          <span className="material-symbols-outlined text-primary px-2 text-[18px]">search</span>
          <input 
            ref={inputRef}
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search logs..." 
            className="w-full h-full outline-none font-mono text-[12px] uppercase text-primary placeholder-outline-variant bg-transparent"
          />
        </div>
      ) : (
        <button onClick={handleOpen} className="material-symbols-outlined text-primary cursor-crosshair-custom hover:opacity-70 transition-opacity">
          search
        </button>
      )}

      {isOpen && query.length > 0 && (
        <div className="absolute right-0 top-12 w-[300px] md:w-[400px] bg-white border-[2px] border-primary hard-shadow z-[100] max-h-[400px] overflow-y-auto">
          {filteredPosts.length > 0 ? (
            <div className="flex flex-col">
              {filteredPosts.map(post => (
                <div 
                  key={post.slug}
                  onClick={() => {
                    setIsOpen(false);
                    setQuery('');
                    router.push(`/blog/${post.slug}`);
                  }}
                  className="p-4 border-b-[2px] border-primary last:border-b-0 hover:bg-surface-container cursor-crosshair-custom"
                >
                  <div className="font-mono text-[10px] text-zinc-500 mb-1">{post.category}</div>
                  <div className="font-sans font-bold text-[14px] leading-tight text-primary uppercase">{post.title}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 font-mono text-[12px] text-zinc-500 uppercase">
              No logs found matching "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
