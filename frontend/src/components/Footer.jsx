import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { COMPANY_INFO } from '../utils/constants';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/footer.css';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const navigate = useNavigate();
  const footerRef = useRef(null);
  const stonesRef = useRef([]);

  useEffect(() => {
    if (footerRef.current && stonesRef.current.length > 0) {
      stonesRef.current.forEach((stone) => {
        if (!stone) return;
        
        const tl = gsap.timeline({
          delay: Math.random() * 4,
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 85%",
            once: true,
            toggleActions: "play none none none"
          }
        });

        const rot = Math.random() * 360 - 180;
        
        tl.fromTo(stone,
          { 
            y: -(Math.random() * 800 + 400), 
            opacity: 0, 
            rotation: rot 
          },
          {
            y: 0,
            opacity: 1,
            rotation: rot,
            duration: Math.random() * 2 + 3.0, // 3 to 5 seconds fall
            ease: "power3.in" // Dead stop feel, before the manual bounce
          }
        )
        // Small, heavy bounce (goes up just a little, then back down fast)
        .to(stone, { y: -12, duration: 0.15, ease: "power1.out" })
        .to(stone, { y: 0, duration: 0.12, ease: "power1.in" });
      });
    }
  }, []);

  const stoneShapes = [
    "M12 25 C12 10 32 5 42 25 C48 35 38 45 22 45 C8 45 6 35 12 25 Z", // Rounded
    "M18 12 Q32 2 45 18 T38 42 Q22 52 12 38 T18 12 Z", // Egg-like asymmetric
    "M10 25 C10 15 25 5 40 15 C55 25 50 45 35 45 C20 45 5 45 10 25 Z", // Flat
    "M12 25 L 28 8 L 48 18 L 42 38 L 28 48 L 8 38 Z", // Angular / rough cut
  ];

  const stoneColors = [
    '#4a4a4a', // Dark Gray / Slate
    '#7a7a7a', // Gray / Granite
    '#bfa386', // Tan / Sandstone
    '#d6d6d6', // Light Gray / Marble
    '#594236', // Dark Brown
    '#8a5a44', // Reddish Brown
    '#c7c2b3'  // Pale Beige
  ];

  // Generate 100 stones with random positions, sizes, shapes, and colors
  const stoneIcons = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    bottom: `${Math.random() * 30 - 10}px`,
    size: Math.random() * 25 + 15, // 15 to 40
    shape: stoneShapes[Math.floor(Math.random() * stoneShapes.length)],
    color: stoneColors[Math.floor(Math.random() * stoneColors.length)]
  }));

  return (
    <footer className="footer" ref={footerRef} style={{ position: 'relative', overflow: 'hidden' }}>
      
      {/* Falling Stones Overlay */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
        {stoneIcons.map((stone, i) => (
          <div
            key={stone.id}
            ref={el => stonesRef.current[i] = el}
            style={{
              position: 'absolute',
              bottom: stone.bottom,
              left: stone.left,
              width: stone.size,
              height: stone.size,
              opacity: 0,
            }}
          >
            <svg viewBox="0 0 50 50" style={{ width: '100%', height: '100%' }}>
              <path d={stone.shape} fill={stone.color} stroke="rgba(0,0,0,0.4)" strokeWidth="1" />
            </svg>
          </div>
        ))}
      </div>

      <div className="footer-container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="footer-grid">
          <div className="footer-section">
            <div className="footer-logo">
              {/* <img src="/logo2.png" alt="STONEO INDIA Logo" className="footer-logo-img" /> */}
              {/* <img src="https://via.placeholder.com/150x50?text=Demo+Logo" alt="Demo Logo" className="footer-logo-img" /> */}
              <span className="text-logo" style={{ color: '#fff', fontSize: '32px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <img src="/logos/logo_light_transparent.png" alt="Logo Light" style={{ height: '80px', objectFit: 'contain' }} />
                <img src="/logos/detail_light_transparent.png" alt="Details Light" style={{ height: '45px', objectFit: 'contain' }} />
              </span>
            </div>
            <p className="footer-tagline">{COMPANY_INFO.tagline}</p>
            <p className="footer-description">{COMPANY_INFO.description}</p>
          </div>

          {/* <div className="footer-section">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/products">Granite Types</a></li>
              <li><a href="/projects">Projects</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/faqs">FAQs</a></li>
            </ul>
          </div> */}

          <div className="footer-section">
            <h3
              onClick={() => navigate('/get-quote')}
              style={{ cursor: 'pointer', display: 'inline-block' }}
              title="Click to get a quote"
            >
              Get in Touch
            </h3>
            <div className="footer-contact">
              <p>
                <strong>📍 Address</strong>
                {COMPANY_INFO.address}
              </p>
              <p style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <strong>📞 Call Us</strong>
                <a style={{ display: 'flex', alignItems: 'top' }} href={`tel:${COMPANY_INFO.phone}`}>+91-{COMPANY_INFO.phone}</a>
              </p>
              <p style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <strong>✉️ Email</strong>
                <a href={`mailto:${COMPANY_INFO.email}`}>{COMPANY_INFO.email}</a>
              </p>
            </div>
          </div>

          <div className="footer-section">
            <h3>Business Hours</h3>
            <p style={{ lineHeight: '1.8' }}>
              ⏰ {COMPANY_INFO.businessHours}
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          {/* <p>&copy; 2024 Stoneo India. All rights reserved. | Premium Granite Supplier</p> */}
          {/* <p>&copy; 2024 Demo Company. All rights reserved. | Demo Subtitle</p> */}
          <p>&copy; 2024 Stoneo India. All rights reserved. | Premium Granite Supplier</p>
        </div>
      </div>
    </footer>
  );
}
