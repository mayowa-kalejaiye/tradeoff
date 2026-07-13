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
          <div style={{ display: 'flex', marginRight: '20px', border: '2px solid #ff291a' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 512 512">
              <rect width="512" height="512" fill="#000000" />
              <rect x="128" y="144" width="256" height="64" fill="#ff291a" />
              <rect x="224" y="144" width="64" height="224" fill="#ff291a" />
              <line x1="64" y1="64" x2="96" y2="64" stroke="#ffffff" strokeWidth="8" />
              <line x1="64" y1="64" x2="64" y2="96" stroke="#ffffff" strokeWidth="8" />
              <line x1="448" y1="64" x2="416" y2="64" stroke="#ffffff" strokeWidth="8" />
              <line x1="448" y1="64" x2="448" y2="96" stroke="#ffffff" strokeWidth="8" />
              <line x1="64" y1="448" x2="96" y2="448" stroke="#ffffff" strokeWidth="8" />
              <line x1="64" y1="448" x2="64" y2="416" stroke="#ffffff" strokeWidth="8" />
              <line x1="448" y1="448" x2="416" y2="448" stroke="#ffffff" strokeWidth="8" />
              <line x1="448" y1="448" x2="448" y2="416" stroke="#ffffff" strokeWidth="8" />
              <line x1="128" y1="176" x2="384" y2="176" stroke="#000000" strokeWidth="4" strokeDasharray="8 8" />
              <line x1="256" y1="144" x2="256" y2="368" stroke="#000000" strokeWidth="4" strokeDasharray="8 8" />
            </svg>
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
