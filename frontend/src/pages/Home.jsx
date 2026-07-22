import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
import { Link, useNavigate } from 'react-router-dom';
import CountUpPkg from 'react-countup';
const CountUp = CountUpPkg.default || CountUpPkg;
import { COMPANY_INFO, GRANITE_TYPES, PROJECTS } from '../utils/constants';
import { useDemand } from '../context/DemandContext';
import '../styles/pages.css';
import SEOHead from '../components/SEOHead';
import { getOrganizationSchema, getLocalBusinessSchema } from '../utils/seo';

import GraniteCarousel from './corousal/GraniteCorousal';
import MarbleCarousel from './corousal/MarbleCorousal';
import TilesCarousel from './corousal/IndianMarbleCorousal';
import IndianMarbleCarousel from './corousal/IndianMarbleCorousal';
import SandStoneCarousel from './corousal/SandStoneCorousal';
import ReviewsCarousel from './corousal/ReviewsCorousal';

export default function Home() {
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
                <CountUp end={28} duration={2.5} enableScrollSpy scrollSpyOnce />
              </div>
              <div style={{ fontSize: "clamp(12px, 3vw, 16px)", textTransform: "uppercase", letterSpacing: "2px", color: "#666" }}>States we are available</div>
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
          <IndianMarbleCarousel />
        </section>

        {/* <section>
          <SandStoneCarousel />
        </section> */}


        <section>
          <ReviewsCarousel />
        </section>

        {/* Featured Products */}
        <section className="featured-products">
          <div style={styles.section} className="container">

            <h2 style={{ fontSize: '40px', fontWeight: '300', marginBottom: '20px' }}>Popular Granite Types</h2>

            <p className="section-subtitle">Browse our collection of premium granite varieties</p>
            <div className="products-grid">
              {GRANITE_TYPES.slice(0, 6).map((product) => (
                <div key={product.id} className="product-card" style={{ cursor: 'pointer' }} onClick={() => navigate(`/products/${product.id || product._id}`, { state: { product } })}>
                  <div className="product-image">
                    <img src={product.image} alt={product.name} />
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="product-description">{product.description}</p>
                    <div className="product-features">
                      {product.features.slice(0, 2).map((feature, idx) => (
                        <span key={idx} className="feature-tag">✓ {feature}</span>
                      ))}
                    </div>
                    <button
                      className="get-quote-btn"
                      style={{
                        backgroundColor: demands.some(d => d.name === product.name) ? '#d9534f' : '',
                        color: demands.some(d => d.name === product.name) ? '#fff' : ''
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (demands.some(d => d.name === product.name)) {
                          removeDemand(product.name);
                        } else {
                          addDemand(product);
                        }
                      }}
                    >
                      {demands.some(d => d.name === product.name) ? "Remove from Quote" : "Add to Quote"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Projects */}
        {/* <section className="recent-projects">
        <div className="container">
          <h2>Recent Projects</h2>
          <p className="section-subtitle">Showcasing our finest granite installations</p>
          <div className="projects-grid">
            {PROJECTS.slice(0, 4).map((project) => (
              <div key={project.id} className="project-card">
                <div className="project-image">
                  <img src={project.image} alt={project.title} />
                </div>
                <div className="project-info">
                  <h3>{project.title}</h3>
                  <p className="project-location">📍 {project.location}</p>
                  <p className="project-type">Granite: {project.graniteType}</p>
                  <p className="project-area">Area: {project.area}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}


        {/* Showroom Section */}
        <section className="showroom-section">
          <div className="container">
            <div className="showroom-content">
              <div className="showroom-text">
                <h2>Visit Our Showroom</h2>
                {/* <p>
          See our complete collection of premium granite samples. Our experts
          are ready to help you find the perfect stone for your project.
        </p> */}

                <div className="showroom-info">
                  <div className="info-item">
                    <span className="info-label">📍 Location:</span>
                    <p>{COMPANY_INFO.address}</p>
                  </div>
                  <div className="info-item">
                    <span className="info-label">🕐 Hours:</span>
                    <p>{COMPANY_INFO.businessHours}</p>
                  </div>
                  <div className="info-item">
                    <span className="info-label">📞 Call Us:</span>
                    <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                      <a href={`tel:${COMPANY_INFO.phone}`}>+91-{COMPANY_INFO.phone}</a>
                    </p>
                  </div>
                </div>

                <Link to="/get-quote" style={{ paddingInline: '30px' }} className="get-quote-btn">
                  Contact Us
                </Link>
              </div>

              <div className="showroom-map">
                <div
                  className="map-link"
                  onClick={() =>
                    window.open(
                      "https://www.google.com/maps/dir//KM+Stonex,+Kali+Dungri,+Khatoli,+Rajasthan+305801/",
                      "_blank"
                    )
                  }
                  style={{ cursor: "pointer" }}
                >
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.4872!2d74.8455201!3d26.6497679!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39695ef1819f25f_!2sKM+Stonex!5e0!3m2!1sen!2sin!4v1714000000000!5m2!1sen!2sin"
                    width="100%"
                    height="350"
                    style={{
                      border: 0,
                      borderRadius: "12px",
                      display: "block",
                      pointerEvents: "none",
                    }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="K.M Stonex Showroom Location"
                  />
                  <div className="map-overlay">
                    <div className="map-overlay-content">
                      <span className="map-pin-icon">📍</span>
                      <span className="map-overlay-text">Open in Google Maps</span>
                      <span className="map-overlay-address">
                        K.M. Stonex, Khatoli, Kishangarh, Rajasthan 305801
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}

      </div>
    </>
  );
}
