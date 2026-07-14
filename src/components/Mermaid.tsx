import mermaid from 'mermaid';
import { useEffect, useRef } from 'react';

export function Mermaid({ chart }: { chart: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
    });
    
    // Strip markdown code block if present
    const cleanChart = chart.replace(/```mermaid/g, '').replace(/```/g, '').trim();
    
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      mermaid.render('mermaid-diagram-' + Math.random().toString(36).substring(7), cleanChart)
        .then((result) => {
          if (containerRef.current) {
            containerRef.current.innerHTML = result.svg;
          }
        })
        .catch(err => {
          console.error('Mermaid render error:', err);
        });
    }
  }, [chart]);

  return <div ref={containerRef} className="mermaid-container w-full flex justify-center" />;
}
