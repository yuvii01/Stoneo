import React from 'react';

export default function Exterior() {
    return (
        <section style={{
            height: '100vh',
            overflow: 'hidden',
            margin: 0,
            paddingTop: '100px', /* Offset for the fixed header */
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',

        }}>

            {/* Main Heading at the top of the page */}
            <div style={{
                textAlign: 'center',
                padding: '2vh 0',
                borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
                <h1 style={{
                    fontFamily: '"Playfair Display", "Georgia", serif',
                    fontSize: '2.5rem',
                    fontWeight: '300',
                    color: '#654321', /* Elegant off-white/gold */
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    margin: 0
                }}>
                    Exterior
                </h1>
            </div>

            {/* Grid Container */}
            <div style={{
                flex: 1,
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gridTemplateRows: '1fr 1fr',
                gap: '20px',
                borderRadius: '100px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '20px', backgroundColor: '#1a1a2e', color: 'white', position: 'relative' }}>
                    <h2 style={{ fontSize: '3rem', opacity: 0.8, margin: 0, fontWeight: 300, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Flooring</h2>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '20px', backgroundColor: '#16213e', color: 'white', position: 'relative' }}>
                    <h2 style={{ fontSize: '3rem', opacity: 0.8, margin: 0, fontWeight: 300, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Home decor</h2>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '20px', backgroundColor: '#0f3460', color: 'white', position: 'relative' }}>
                    <h3 style={{ fontSize: '3rem', opacity: 0.5, margin: 0 }}>3</h3>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '20px', backgroundColor: '#e94560', color: 'white', position: 'relative' }}>
                    <h4 style={{ fontSize: '3rem', opacity: 0.5, margin: 0 }}>4</h4>
                </div>
            </div>
        </section>
    );
}
