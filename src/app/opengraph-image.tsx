import { ImageResponse } from 'next/og'

export const alt = 'Tradeoff - Technical Feasibility Advisor'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #18181b, #09090b)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '80px',
          fontFamily: 'sans-serif',
          color: 'white',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '60px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '20px',
              border: '4px solid #333333'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
          </div>
          <span style={{ fontSize: '42px', fontWeight: 'bold', color: '#e4e4e7', letterSpacing: '-1px', textTransform: 'uppercase' }}>TRADEOFF</span>
        </div>

        <div style={{ display: 'flex', fontSize: '28px', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '24px', fontWeight: 600 }}>
          // ARCHITECTURE ENGINE
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', fontSize: '72px', fontWeight: 'bold', lineHeight: 1.1, marginBottom: '40px', color: 'white', maxWidth: '1000px', letterSpacing: '-2px' }}>
          <div style={{ display: 'flex' }}>Engineering judgment</div>
          <div style={{ display: 'flex' }}>at scale.</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginTop: 'auto' }}>
           <div style={{ fontSize: '28px', color: '#000000', fontWeight: 'bold', display: 'flex', alignItems: 'center', background: '#00ff00', padding: '12px 24px', border: '2px solid #000000', boxShadow: '4px 4px 0px 0px rgba(255,255,255,0.2)' }}>
             Uncover existential risks & architectural debt
           </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
