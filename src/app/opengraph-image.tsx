import { ImageResponse } from 'next/og'

export const alt = 'Tradeoff AI - Technical Feasibility Advisor'
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
          background: '#ffffff',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '40px',
          fontFamily: 'sans-serif',
          color: '#000000',
          border: '8px solid #000000',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '4px solid #000000', paddingBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#000000', letterSpacing: '-1px' }}>
              TRADEOFF SYSTEMS AG
            </div>
          </div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#ba1a1a', border: '2px solid #ba1a1a', padding: '4px 12px', textTransform: 'uppercase' }}>
            STATUS: ACTIVE
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', padding: '40px 0' }}>
          <div style={{ fontSize: '24px', color: '#666666', textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '20px', fontWeight: 'bold' }}>
            // ARCHITECTURE_REVIEW
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', fontSize: '80px', fontWeight: 900, lineHeight: 1.0, color: '#000000', letterSpacing: '-3px', textTransform: 'uppercase' }}>
            <div style={{ display: 'flex' }}>ENGINEERING JUDGMENT</div>
            <div style={{ display: 'flex' }}>AT SCALE.</div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '4px solid #000000', paddingTop: '20px' }}>
           <div style={{ fontSize: '20px', color: '#000000', fontWeight: 'bold', display: 'flex', alignItems: 'center', background: '#e5e5e5', padding: '8px 16px', border: '2px solid #000000', boxShadow: '4px 4px 0px 0px #ba1a1a' }}>
             Evaluate architecture before writing code.
           </div>
           <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#666666', letterSpacing: '2px' }}>
             SYS.REV.06
           </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
