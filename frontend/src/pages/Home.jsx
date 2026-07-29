import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
import { Link, useNavigate } from 'react-router-dom';
import CountUpPkg from 'react-countup';
const CountUp = CountUpPkg.default || CountUpPkg;
import { COMPANY_INFO, GRANITE_TYPES, PROJECTS } from '../utils/constants';
import { useDemand } from '../context/DemandContext';
import { useDbProducts } from '../utils/useDbProducts';
import '../styles/pages.css';
import SEOHead from '../components/SEOHead';
import { getOrganizationSchema, getLocalBusinessSchema } from '../utils/seo';

import GraniteCarousel from './corousal/GraniteCorousal';
import MarbleCarousel from './corousal/MarbleCorousal';
import IndianMarbleCarousel from './corousal/IndianMarbleCorousal';
import SandStoneCarousel from './corousal/SandStoneCorousal';
import ReviewsCarousel from './corousal/ReviewsCorousal';
import ProjectGallery from '../components/ProjectGallery';

export default function Home() {
  const graniteProducts = useDbProducts('Granite', GRANITE_TYPES);
  const styles = {
    section: { backgroundColor: '#fdfbf8', padding: '50px 0', textAlign: 'center', overflow: 'hidden' },
  };
  const navigate = useNavigate();
  const { addDemand, demands, removeDemand } = useDemand();

  const intExtContainerRef = useRef(null);
  const interiorRef = useRef(null);
  const exteriorRef = useRef(null);

  useEffect(() => {
    if (intExtContainerRef.current && interiorRef.current && exteriorRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: intExtContainerRef.current,
          start: "top 80%",
        }
      });

      tl.fromTo(interiorRef.current,
        { xPercent: -100, opacity: 0 },
        { xPercent: 0, opacity: 1, duration: 1.2, ease: "power3.out" },
        0
      );

      tl.fromTo(exteriorRef.current,
        { xPercent: 100, opacity: 0 },
        { xPercent: 0, opacity: 1, duration: 1.2, ease: "power3.out" },
        0
      );

      gsap.to(interiorRef.current, {
        x: -3,
        y: -2,
        duration: 12,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1.2
      });

      gsap.to(exteriorRef.current, {
        x: 3,
        y: 2,
        duration: 15,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1.2
      });
    }
  }, []);

  return (
    <>
      <SEOHead
        pageKey="home"
        structured={{
          '@context': 'https://schema.org',
          '@graph': [
            getOrganizationSchema(),
            getLocalBusinessSchema()
          ]
        }}
      />
      <div className="rotate-on-load page home-page">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-background">
            <video
              src="/hero.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="none"
              className="hero-video"
            ></video>
            <div className="hero-overlay"></div>
          </div>
        </section>

        <section className="containerr">
          <div
            onClick={() => navigate('/royal-gem-stones')}
            style={{ cursor: "pointer", position: "relative", width: "100%", height: "100%", borderRadius: "20px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <video
              src="/royal_gem_stones.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="none"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                zIndex: 1
              }}
            ></video>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                zIndex: 2
              }}
            ></div>
            <h1 style={{ position: "relative", zIndex: 3, color: "white", margin: 0 }}>Royal Stones</h1>
          </div>
        </section>

        <section className="containerr" id="application">
          {/* <h1>Applications</h1> */}

          <div ref={intExtContainerRef} style={{
            position: "relative",
            width: "100%",
            height: "100%",
            borderRadius: "20px",
            overflow: "hidden",
            border: "0.5px solid rgba(0,0,0,0.15)",
            // backgroundColor: "#111"
          }}>
            {/* Interior */}
            <div ref={interiorRef} onClick={() => { navigate('application/interior') }} style={{
              position: "absolute",
              inset: 0,
              clipPath: "polygon(0 0, 60% 0, 40% 100%, 0 100%)",
              cursor: "pointer",
              transformOrigin: "center center"
            }}>
              <img src="https://thethekedaar.in/assets/images/moreInfo/5.webp" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.45)" }}></div>
              <div style={{
                position: "absolute",
                top: 0, left: 0, bottom: 0, width: "45%",
                display: "flex", flexDirection: "column",
                alignItems: "flex-start", justifyContent: "center",
                padding: "clamp(12px, 4%, 40px)", gap: "6px",
                pointerEvents: "none"
              }}>
                <span style={{ fontSize: "clamp(11px, 2.5vw, 15px)", fontWeight: 500, color: "rgba(255,255,255,0.7)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Interior</span>
                <span style={{ fontSize: "clamp(13px, 3vw, 18px)", fontWeight: 500, color: "#fff", lineHeight: 1.3 }}>Indoor spaces &<br />built environments</span>
              </div>
            </div>

            {/* Exterior */}
            <div ref={exteriorRef} onClick={() => { navigate('application/exterior') }} style={{
              position: "absolute",
              inset: 0,
              clipPath: "polygon(60% 0, 100% 0, 100% 100%, 40% 100%)",
              cursor: "pointer",
              transformOrigin: "center center"
            }}>
              <img src="https://www.maramani.com/cdn/shop/articles/house-2252301_640_4a79bfef-9331-4a70-a3ff-34fc1d2dd9ff.jpg" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.45)" }}></div>
              <div style={{
                position: "absolute",
                top: 0, right: 0, bottom: 0, width: "55%",
                display: "flex", flexDirection: "column",
                alignItems: "flex-end", justifyContent: "center",
                padding: "clamp(12px, 4%, 40px)", gap: "6px",
                textAlign: "right",
                pointerEvents: "none"
              }}>
                <span style={{ fontSize: "clamp(11px, 2.5vw, 15px)", fontWeight: 500, color: "rgba(255,255,255,0.7)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Exterior</span>
                <span style={{ fontSize: "clamp(13px, 3vw, 18px)", fontWeight: 500, color: "#fff", lineHeight: 1.3 }}>Outdoor spaces &<br />open environments</span>
              </div>
            </div>
          </div>
        </section>

        <section style={{ backgroundColor: "#ffffff", color: "#111", padding: "clamp(40px, 8vw, 80px) 20px", fontFamily: "'Jost', sans-serif" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "30px", textAlign: "center" }}>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ fontSize: "clamp(36px, 8vw, 56px)", fontWeight: 300, letterSpacing: "2px" }}>
                <CountUp end={1000} duration={2.5} enableScrollSpy scrollSpyOnce />+
              </div>
              <div style={{ fontSize: "clamp(12px, 3vw, 16px)", textTransform: "uppercase", letterSpacing: "2px", color: "#666" }}>Projects</div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ fontSize: "clamp(36px, 8vw, 56px)", fontWeight: 300, letterSpacing: "2px" }}>
                <CountUp end={25} duration={2.5} enableScrollSpy scrollSpyOnce />+
              </div>
              <div style={{ fontSize: "clamp(12px, 3vw, 16px)", textTransform: "uppercase", letterSpacing: "2px", color: "#666" }}>Years in Industry</div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ fontSize: "clamp(36px, 8vw, 56px)", fontWeight: 300, letterSpacing: "2px" }}>
                <CountUp end={8} duration={2.5} enableScrollSpy scrollSpyOnce />
              </div>
              <div style={{ fontSize: "clamp(12px, 3vw, 16px)", textTransform: "uppercase", letterSpacing: "2px", color: "#666" }}>Countries we are available</div>
            </div>

          </div>
        </section>
        <section>
          <GraniteCarousel />
        </section>


        {/* <section>
          <MarbleCarousel />
        </section> */}

        <section>
          <MarbleCarousel />
        </section>

        {/* <section>
          <SandStoneCarousel />
        </section> */}


        <section>
          <ReviewsCarousel />
        </section>

        <ProjectGallery />

        {/* Showroom Section */}
        <section className="luxury-showroom-section">
          <div className="showroom-luxury-card">
            <div className="showroom-info-col">
              <h2>Visit Our Experience Center</h2>
              <p>
                Explore thousands of premium natural stone slabs in person. Our architectural consultants are there for private tours and sample viewing.
              </p>
              {/* <div className="showroom-details-grid">
                <div className="showroom-detail-item">
                  <div className="detail-icon-circle">📍</div>
                  <div className="detail-text">
                    <h4>Atelier & Showroom Address</h4>
                    <p>{COMPANY_INFO.address}</p>
                  </div>
                </div>
                <div className="showroom-detail-item">
                  <div className="detail-icon-circle">🕐</div>
                  <div className="detail-text">
                    <h4>Visiting Hours</h4>
                    <p>{COMPANY_INFO.businessHours}</p>
                  </div>
                </div>
                <div className="showroom-detail-item">
                  <div className="detail-icon-circle">📞</div>
                  <div className="detail-text">
                    <h4>Direct Specialist Line</h4>
                    <p>
                      <a href={`tel:${COMPANY_INFO.phone}`}>+91 {COMPANY_INFO.phone}</a>
                    </p>
                  </div>
                </div>
              </div> */}
            </div>

            <div className="showroom-map-col">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3567.89!2d74.8561584!3d26.6515181!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396bf3f8a9d2a777%3A0x8d0b3b4755a1b485!2sAdhunik%20Granites!5e0!3m2!1sen!2sin!4v1714000000000!5m2!1sen!2sin"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Adhunik Granites Showroom Location"
              />
              <div className="map-hover-banner">
                <div className="map-banner-text">
                  <span className="map-banner-title">Adhunik Granites</span>
                  <span className="map-banner-address">Makrana Rd, Kali Dungri, Kishangarh, Rajasthan 305801</span>
                </div>
                <a
                  href="https://www.google.com/maps/dir//Adhunik+Granites,+Makrana+Rd,+Kali+Dungri,+Kishangarh,+Rajasthan+305801/@26.8743907,75.7549361,14z/data=!4m8!4m7!1m0!1m5!1m1!1s0x396bf3f8a9d2a777:0x8d0b3b4755a1b485!2m2!1d74.8561584!2d26.6515181?entry=ttu&g_ep=EgoyMDI2MDcyMi4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="open-maps-chip"
                >
                  <span>📍</span> Open Google Maps
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}

      </div>
    </>
  );
}
