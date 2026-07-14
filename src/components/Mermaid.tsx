import mermaid from 'mermaid';
import { useEffect, useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

export function Mermaid({ chart }: { chart: string }) {
  const [svgContent, setSvgContent] = useState<string>('');

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
    });
    
    // Strip markdown code block if present
    const cleanChart = chart.replace(/```mermaid/g, '').replace(/```/g, '').trim();
    
    mermaid.render('mermaid-diagram-' + Math.random().toString(36).substring(7), cleanChart)
      .then((result) => {
        setSvgContent(result.svg);
      })
      .catch(err => {
        console.error('Mermaid render error:', err);
      });
  }, [chart]);

  return (
    <div className="w-full h-[600px] print:h-auto bg-[#f9f9f9] print:bg-white border-[2px] print:border-0 border-[#000000] relative cursor-move print:cursor-auto group overflow-hidden print:overflow-visible">
      <div className="absolute top-2 right-2 z-10 flex items-center gap-2 text-[10px] sm:text-[12px] font-mono font-bold bg-[#ffffff] px-2 py-1 border-[2px] border-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase tracking-widest opacity-70 group-hover:opacity-100 transition-opacity print:hidden">
        <span className="material-symbols-outlined text-[14px]">pan_tool</span>
        <span className="hidden sm:inline">SCROLL_ZOOM / DRAG_PAN</span>
      </div>
      {svgContent ? (
        <TransformWrapper
          initialScale={1}
          minScale={0.1}
          maxScale={10}
          centerOnInit={true}
          wheel={{ step: 0.1 }}
        >
          <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }} contentStyle={{ width: '100%', height: '100%' }}>
            <div 
              dangerouslySetInnerHTML={{ __html: svgContent }} 
              className="flex justify-center items-center p-8 [&>svg]:w-full [&>svg]:h-auto [&>svg]:min-w-[800px] print:[&>svg]:min-w-0" 
            />
          </TransformComponent>
        </TransformWrapper>
      ) : (
        <div className="w-full h-full flex items-center justify-center font-mono text-[12px] uppercase tracking-widest text-[#000000]">
          RENDERING_DIAGRAM...
        </div>
      )}
    </div>
  );
}
