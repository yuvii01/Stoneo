import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CountUpPkg from 'react-countup';
const CountUp = CountUpPkg.default || CountUpPkg;
import { COMPANY_INFO, GRANITE_TYPES, PROJECTS } from '../utils/constants';
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
            <div className="gradient-bg"></div>
          </div>
        </section>

        <section className="containerr">
          <h1>Royal Stones</h1>
        </section>

        <section className="containerr">
          {/* <h1>Applications</h1> */}

          <div style={{
            position: "relative",
            width: "100%",
            minHeight: "100%",
            borderRadius: "20px",
            overflow: "hidden",
            border: "0.5px solid rgba(0,0,0,0.15)"
          }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <clipPath id="interior-clip">
                  <polygon points="0,0 60,0 40,100 0,100" />
                </clipPath>
                <clipPath id="exterior-clip">
                  <polygon points="60,0 100,0 100,100 40,100" />
                </clipPath>
              </defs>

              {/* Interior: image + dark overlay */}
              <image
                href="https://thethekedaar.in/assets/images/moreInfo/5.webp"
                x="0" y="0" width="60" height="100"
                preserveAspectRatio="xMidYMid slice"
                clipPath="url(#interior-clip)"
              />
              <polygon
                onClick={() => { navigate('application/interior') }}
                points="0,0 60,0 40,100 0,100"
                fill="rgba(0,0,0,0.45)"
                clipPath="url(#interior-clip)"
              />

              {/* Exterior: image + dark overlay */}
              <image
                href="https://www.maramani.com/cdn/shop/articles/house-2252301_640_4a79bfef-9331-4a70-a3ff-34fc1d2dd9ff.jpg"
                x="40" y="0" width="60" height="100"
                preserveAspectRatio="xMidYMid slice"
                clipPath="url(#exterior-clip)"
              />
              <polygon
                onClick={() => { navigate('application/exterior') }}
                points="60,0 100,0 100,100 40,100"
                fill="rgba(0,0,0,0.45)"
                clipPath="url(#exterior-clip)"
              />
            </svg>

            <div style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              pointerEvents: "none"
            }}>
              {/* Interior label */}
              <div style={{
                flex: "0 0 45%",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "center",
                padding: "clamp(12px, 4%, 40px)",
                gap: "6px"
              }}>
                <span style={{ fontSize: "clamp(11px, 2.5vw, 15px)", fontWeight: 500, color: "rgba(255,255,255,0.7)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Interior</span>
                <span style={{ fontSize: "clamp(13px, 3vw, 18px)", fontWeight: 500, color: "#fff", lineHeight: 1.3 }}>Indoor spaces &<br />built environments</span>
              </div>

              {/* Exterior label */}
              <div style={{
                flex: "0 0 55%",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                justifyContent: "center",
                padding: "clamp(12px, 4%, 40px)",
                gap: "6px",
                textAlign: "right"
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

        <section>
          <SandStoneCarousel />
        </section>


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
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/get-quote?stone=${encodeURIComponent(product.name)}&image=${encodeURIComponent(product.image)}`);
                      }}
                    >
                      Get Quote
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
