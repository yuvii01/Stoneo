import React, { useState, useRef, useCallback, useEffect } from "react";

const originalItems = [
    { name: "Eleanor Vance", role: "Lead Architect, Nova Designs", date: "2 weeks ago", rating: 5, text: "Stoneo provided us with the most exquisite Calacatta marble for our latest luxury villa project. The veining was pristine, and their attention to detail during delivery was unmatched.", initials: "EV", bg: "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)", color: "#333", avatar: "https://i.pravatar.cc/150?img=1" },
    { name: "Marcus Thorne", role: "Interior Designer", date: "1 month ago", rating: 5, text: "I've sourced granite from dozens of suppliers, but the Black Galaxy from Stoneo is on another level. Flawless finish and exceptional durability. My clients were absolutely thrilled.", initials: "MT", bg: "linear-gradient(135deg, #1a1a1a 0%, #333 100%)", color: "#fff", avatar: "https://i.pravatar.cc/150?img=11" },
    { name: "Sophia Reynolds", role: "Homeowner", date: "2 months ago", rating: 5, text: "Transforming our kitchen was a dream come true thanks to Stoneo. Their team guided us through selecting the perfect quartzite. It looks stunning and has held up beautifully to daily use.", initials: "SR", bg: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)", color: "#fff", avatar: "https://i.pravatar.cc/150?img=5" },
    { name: "James Carter", role: "Property Developer", date: "3 months ago", rating: 5, text: "Reliability is everything in my business. Stoneo delivered top-tier sandstone for a massive landscaping project exactly on schedule. Their quality control is simply world-class.", initials: "JC", bg: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)", color: "#333", avatar: "https://i.pravatar.cc/150?img=15" },
    { name: "Olivia Chen", role: "Boutique Hotel Owner", date: "4 months ago", rating: 5, text: "We used their imported Onyx for our hotel lobby's backlit reception desk. The translucency and color depth are breathtaking. It's the first thing every guest compliments.", initials: "OC", bg: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)", color: "#fff", avatar: "https://i.pravatar.cc/150?img=9" },
    { name: "David Sterling", role: "Custom Home Builder", date: "5 months ago", rating: 5, text: "From the initial consultation to the final installation of the Indian Marble, the entire process was seamless. The precision cutting and polishing were executed to perfection.", initials: "DS", bg: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)", color: "#333", avatar: "https://i.pravatar.cc/150?img=13" },
];

/* ─── Styles ─────────────────────────────────────────────── */
const css = `
  /* Fonts imported globally in index.html */

  .rev-root {
    --bg-color: #fbfaf8;
    --text-primary: #1a1a1a;
    --text-secondary: #666;
    --accent-gold: #c8a97e;
    --card-bg: #ffffff;
    
    font-family: var(--font-body, 'Manrope', sans-serif);
    width: 100%;
    padding: 100px 0 120px;
    background: var(--bg-color);
    position: relative;
    overflow: hidden;
    user-select: none;
  }

  /* Decorative Background Elements */
  .rev-bg-blob-1 {
    position: absolute;
    top: -10%;
    left: -5%;
    width: 40vw;
    height: 40vw;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(200,169,126,0.06) 0%, rgba(251,250,248,0) 70%);
    z-index: 0;
    pointer-events: none;
  }
  
  .rev-bg-blob-2 {
    position: absolute;
    bottom: -10%;
    right: -5%;
    width: 30vw;
    height: 30vw;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,0,0,0.03) 0%, rgba(251,250,248,0) 70%);
    z-index: 0;
    pointer-events: none;
  }

  .rev-container {
    max-width: 1400px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }

  /* ── Header ── */
  .rev-header {
    text-align: center;
    margin-bottom: 60px;
    padding: 0 20px;
  }
  
  .rev-eyebrow {
    font-family: var(--font-body, 'Manrope', sans-serif);
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.25em;
    color: var(--accent-gold);
    text-transform: uppercase;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }
  
  .rev-eyebrow::before, .rev-eyebrow::after {
    content: '';
    display: block;
    width: 40px;
    height: 1px;
    background: var(--accent-gold);
    opacity: 0.5;
  }
  
  .rev-title {
    font-family: var(--font-heading, 'Cormorant Garamond', serif);
    font-size: clamp(36px, 6vw, 60px);
    font-weight: 600;
    color: var(--text-primary);
    line-height: 1.1;
    margin-bottom: 20px;
  }
  
  .rev-google-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-bottom: 24px;
    background: #fff;
    padding: 10px 20px;
    border-radius: 50px;
    width: max-content;
    margin-left: auto;
    margin-right: auto;
    box-shadow: 0 8px 25px rgba(0,0,0,0.05);
    border: 1px solid rgba(0,0,0,0.03);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;
  }
  
  .rev-google-badge:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 30px rgba(0,0,0,0.08);
  }

  .rev-subtitle {
    font-size: 17px;
    color: var(--text-secondary);
    max-width: 650px;
    margin: 0 auto;
    line-height: 1.6;
    font-weight: 300;
  }

  /* ── Carousel Track ── */
  .rev-track-container {
    position: relative;
    width: 100%;
    height: 480px;
    perspective: 2000px;
    transform-style: preserve-3d;
  }

  /* ── Cards ── */
  .rev-card {
    position: absolute;
    top: 50%;
    left: 50%;
    width: clamp(320px, 85vw, 450px);
    height: 380px;
    border-radius: 24px;
    background: var(--card-bg);
    padding: 45px 40px 40px 40px;
    box-shadow: 0 20px 50px rgba(0,0,0,0.06);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: all 0.7s cubic-bezier(0.25, 1, 0.5, 1);
    cursor: pointer;
    border: 1px solid rgba(0,0,0,0.03);
    will-change: transform, opacity;
  }

  .rev-card::before {
    content: '"';
    position: absolute;
    top: 15px;
    right: 35px;
    font-family: var(--font-heading, 'Cormorant Garamond', serif);
    font-size: 140px;
    color: rgba(200,169,126,0.12);
    line-height: 1;
    pointer-events: none;
    transition: color 0.5s ease;
  }
  
  .rev-card:hover::before {
    color: rgba(200,169,126,0.25);
  }

  .rev-stars {
    display: flex;
    gap: 4px;
    margin-bottom: 24px;
  }
  
  .rev-star {
    color: #fbbc04; /* Google yellow-gold */
    font-size: 20px;
  }

  .rev-text {
    font-family: var(--font-heading, 'Cormorant Garamond', serif);
    font-size: clamp(19px, 2.2vw, 22px);
    line-height: 1.55;
    color: var(--text-primary);
    font-style: italic;
    margin-bottom: 30px;
    flex-grow: 1;
    position: relative;
    z-index: 2;
  }

  .rev-author {
    display: flex;
    align-items: center;
    gap: 16px;
    position: relative;
    z-index: 2;
  }

  .rev-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #fff;
    box-shadow: 0 4px 15px rgba(0,0,0,0.08);
  }

  .rev-avatar-fallback {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 20px;
    border: 3px solid #fff;
    box-shadow: 0 4px 15px rgba(0,0,0,0.08);
  }

  .rev-author-info {
    display: flex;
    flex-direction: column;
  }

  .rev-author-name {
    font-weight: 600;
    font-size: 17px;
    color: var(--text-primary);
    margin-bottom: 2px;
  }

  .rev-author-role {
    font-size: 14px;
    color: var(--text-secondary);
    font-weight: 300;
  }
  
  .rev-date {
    position: absolute;
    bottom: 40px;
    right: 40px;
    font-size: 13px;
    color: #a0a0a0;
    font-weight: 400;
  }

  /* ── Controls ── */
  .rev-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: 1px solid rgba(0,0,0,0.08);
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
    color: var(--text-primary);
    box-shadow: 0 8px 25px rgba(0,0,0,0.04);
    z-index: 20;
  }
  
  .rev-btn.prev {
    left: 20px;
  }
  
  .rev-btn.next {
    right: 20px;
  }

  .rev-btn:hover {
    background: var(--text-primary);
    color: #fff;
    border-color: var(--text-primary);
    transform: translateY(-50%) scale(1.05);
    box-shadow: 0 15px 30px rgba(0,0,0,0.15);
  }
  
  .rev-btn svg {
    width: 22px;
    height: 22px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.5;
    stroke-linecap: round;
    stroke-linejoin: round;
    transition: transform 0.3s ease;
  }

  .rev-btn.prev:hover svg {
    transform: translateX(-3px);
  }
  
  .rev-btn.next:hover svg {
    transform: translateX(3px);
  }

  @media (max-width: 768px) {
    .rev-track-container {
      height: 440px;
    }
    .rev-card {
      padding: 35px 25px 30px 25px;
      height: 400px;
    }
    .rev-date {
      bottom: 30px;
      right: 25px;
    }
    .rev-card::before {
      font-size: 100px;
      top: 10px;
      right: 20px;
    }
    .rev-title {
        font-size: 32px;
    }
  }
`;

function GoogleIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
    );
}

export default function ReviewsCorousal() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const total = originalItems.length;
    const autoPlayRef = useRef(null);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const next = useCallback(() => {
        setActiveIndex((prev) => (prev + 1) % total);
    }, [total]);

    const prev = useCallback(() => {
        setActiveIndex((prev) => (prev - 1 + total) % total);
    }, [total]);

    const goTo = (index) => {
        setActiveIndex(index);
    };

    useEffect(() => {
        autoPlayRef.current = setInterval(next, 3000);
        return () => clearInterval(autoPlayRef.current);
    }, [next]);

    const handleMouseEnter = () => clearInterval(autoPlayRef.current);
    const handleMouseLeave = () => {
        autoPlayRef.current = setInterval(next, 3000);
    };

    return (
        <section className="rev-root">
            <style>{css}</style>
            
            <div className="rev-bg-blob-1"></div>
            <div className="rev-bg-blob-2"></div>

            <div className="rev-container" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <div className="rev-header">
                    <p className="rev-eyebrow">Excellence Recognized</p>
                    <h2 className="rev-title">Our Clients Testimonials</h2>
                    
                    <div className="rev-google-badge">
                        <GoogleIcon />
                        <span style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)" }}>Google reviews</span>
                        <span style={{ fontSize: "15px", color: "var(--text-secondary)", marginLeft: "4px" }}>4.9 ★ · 154 reviews</span>
                    </div>

                    <p className="rev-subtitle">
                        Discover what architects, designers, and homeowners have to say about their experience with Stoneo's premium natural stone collections.
                    </p>
                </div>

                <div className="rev-track-container">
                    <button className="rev-btn prev" onClick={prev} aria-label="Previous">
                        <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
                    </button>
                    {originalItems.map((item, index) => {
                        let diff = index - activeIndex;
                        
                        // Handle infinite wrap-around visually
                        if (diff > total / 2) diff -= total;
                        if (diff < -total / 2) diff += total;

                        const isActive = diff === 0;
                        const isPrev = diff === -1;
                        const isNext = diff === 1;
                        
                        let translateX = 0;
                        let translateZ = 0;
                        let rotateY = 0;
                        let opacity = 0;
                        let zIndex = 0;

                        // Desktop 3D Coverflow logic
                        if (!isMobile) {
                            if (isActive) {
                                translateX = 0; translateZ = 50; rotateY = 0; opacity = 1; zIndex = 10;
                            } else if (isPrev) {
                                translateX = -60; translateZ = -100; rotateY = 15; opacity = 0.6; zIndex = 5;
                            } else if (isNext) {
                                translateX = 60; translateZ = -100; rotateY = -15; opacity = 0.6; zIndex = 5;
                            } else if (diff === -2) {
                                translateX = -100; translateZ = -250; rotateY = 25; opacity = 0.2; zIndex = 3;
                            } else if (diff === 2) {
                                translateX = 100; translateZ = -250; rotateY = -25; opacity = 0.2; zIndex = 3;
                            } else {
                                translateX = diff > 0 ? 120 : -120; translateZ = -400; opacity = 0; zIndex = 1;
                            }
                        } 
                        // Mobile simplified logic
                        else {
                            if (isActive) {
                                translateX = 0; translateZ = 0; rotateY = 0; opacity = 1; zIndex = 10;
                            } else if (isPrev) {
                                translateX = -85; translateZ = -100; rotateY = 10; opacity = 0.3; zIndex = 5;
                            } else if (isNext) {
                                translateX = 85; translateZ = -100; rotateY = -10; opacity = 0.3; zIndex = 5;
                            } else {
                                opacity = 0; pointerEvents: 'none';
                            }
                        }

                        return (
                            <div
                                key={index}
                                className="rev-card"
                                onClick={() => !isActive && goTo(index)}
                                style={{
                                    transform: `translate(-50%, -50%) translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg)`,
                                    opacity,
                                    zIndex,
                                    pointerEvents: opacity === 0 ? 'none' : 'auto'
                                }}
                            >
                                <div>
                                    <div className="rev-stars">
                                        {[...Array(item.rating)].map((_, i) => (
                                            <span key={i} className="rev-star">★</span>
                                        ))}
                                    </div>
                                    <p className="rev-text">"{item.text}"</p>
                                </div>

                                <div className="rev-author">
                                    {item.avatar ? (
                                        <img src={item.avatar} alt={item.name} className="rev-avatar" />
                                    ) : (
                                        <div className="rev-avatar-fallback" style={{ background: item.bg, color: item.color }}>
                                            {item.initials}
                                        </div>
                                    )}
                                    <div className="rev-author-info">
                                        <span className="rev-author-name">{item.name}</span>
                                        <span className="rev-author-role">{item.role}</span>
                                    </div>
                                </div>
                                <span className="rev-date">{item.date}</span>
                            </div>
                        );
                    })}
                    <button className="rev-btn next" onClick={next} aria-label="Next">
                        <svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
                    </button>
                </div>
            </div>
        </section>
    );
}
