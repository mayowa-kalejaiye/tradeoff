'use client';

export function CodeBlock({ language, code }: { language: string, code: string }) {
  return (
    <div className="rounded-xl overflow-hidden my-8 shadow-2xl border border-zinc-800 bg-[#1e1e1e]">
      <div className="flex items-center px-4 py-3 bg-[#2d2d2d] border-b border-zinc-800">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
        </div>
        <div className="flex-1 text-center font-mono text-[12px] text-zinc-400">
          {language}
        </div>
      </div>
      <pre className="m-0 p-6 bg-transparent text-[#d4d4d4] font-mono text-sm overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
}
