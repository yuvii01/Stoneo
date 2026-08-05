import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { COMPANY_INFO } from '../utils/constants';
import '../styles/pages.css';
import '../styles/GetQuote.css';
import SEOHead from '../components/SEOHead';
import { getOrganizationSchema } from '../utils/seo';
import { useDemand } from '../context/DemandContext';
import { useDbProducts } from '../utils/useDbProducts';
import FadeUp from '../components/animations/FadeUp';
import StaggerGroup from '../components/animations/StaggerGroup';

const PROJECT_SCOPES = [
  "Residential Flooring",
  "Kitchen & Vanity Countertop",
  "Commercial Facade",
  "Custom Interior Decor",
  "Outdoor Landscaping"
];

const AREA_OPTIONS = [
  "< 500 sq.ft",
  "500 - 2,000 sq.ft",
  "2,000 - 5,000 sq.ft",
  "5,000+ sq.ft (Commercial)"
];

const RECOMMENDED_GRANITES = [
  {
    name: "Absolute Black Granite",
    image: "/granite_images/Absolute Black Granite.webp",
    category: "Black",
    finish: "Polished",
    price: 110,
    features: ["Deep black uniformity", "High durability", "Scratch resistant"]
  },
  {
    name: "Black Galaxy Granite",
    image: "/granite_images/Black Galaxy Granite.webp",
    category: "Black",
    finish: "Polished",
    price: 140,
    features: ["Golden speckles", "Premium gloss", "Heat resistant"]
  },
  {
    name: "Alaska White Granite",
    image: "/granite_images/Alaska White Granite.webp",
    category: "White",
    finish: "Polished",
    price: 135,
    features: ["Exotic vein patterns", "Stain resistant", "Modern aesthetic"]
  },
  {
    name: "Colonial Gold Granite",
    image: "/granite_images/Colonial Gold Granite.webp",
    category: "Gold",
    finish: "Polished",
    price: 125,
    features: ["Warm golden tones", "Classic luxury", "Weather resistant"]
  },
  {
    name: "Tan Brown Granite",
    image: "/granite_images/Tan Brown Granite.jpg",
    category: "Brown",
    finish: "Polished",
    price: 95,
    features: ["Rich brown mineral crystals", "Low maintenance", "All-weather surface"]
  },
  {
    name: "Kashmir White Granite",
    image: "/granite_images/Kashmir White Granite.jpg",
    category: "White",
    finish: "Polished",
    price: 105,
    features: ["Subtle grey & garnet specks", "Architectural grade", "Stain resistant"]
  },
  {
    name: "Black Forest Granite",
    image: "/granite_images/Black Forest Granite.webp",
    category: "Black",
    finish: "Polished",
    price: 130,
    features: ["Striking white veins on black", "Exotic look", "Zero absorption"]
  },
  {
    name: "Blue Dunes Granite",
    image: "/granite_images/Blue Dunes Granite.jpg",
    category: "Blue",
    finish: "Polished",
    price: 120,
    features: ["Unique earth & blue dunes", "Designer favorite", "High density"]
  },
  {
    name: "Viscon White Granite",
    image: "/granite_images/Viscon White Granite.webp",
    category: "White",
    finish: "Polished",
    price: 115,
    features: ["Swirling grey & white waves", "Architectural grade", "Easy to clean"]
  },
  {
    name: "Imperial Gold Granite",
    image: "/granite_images/Imperial Gold Granite.webp",
    category: "Gold",
    finish: "Polished",
    price: 135,
    features: ["Rich golden veins", "Royal elegance", "High durability"]
  }
];

export default function GetQuote() {
  const SEOHeadComponent = (
    <SEOHead
      pageKey="getQuote"
      structured={getOrganizationSchema()}
    />
  );
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { demands, addDemand, clearDemands, removeDemand } = useDemand();

  const graniteName = searchParams.get('stone') || '';
  const graniteImage = searchParams.get('image') || '/granite_images/Alaska White Granite.webp';

  const dbGranites = useDbProducts('Granite', RECOMMENDED_GRANITES);
  const granitePool = useMemo(() => {
    if (dbGranites && Array.isArray(dbGranites) && dbGranites.length >= 3) {
      return dbGranites;
    }
    return RECOMMENDED_GRANITES;
  }, [dbGranites]);

  const availableRecommended = useMemo(() => {
    return granitePool.filter(g => {
      const gName = (g.name || '').toLowerCase();
      const isAlreadyInDemands = (demands || []).some(d => (d.name || '').toLowerCase() === gName);
      const isCurrentStoneParam = graniteName && graniteName.toLowerCase() === gName;
      return !isAlreadyInDemands && !isCurrentStoneParam;
    });
  }, [granitePool, demands, graniteName]);

  const top3Recommended = useMemo(() => {
    return availableRecommended.slice(0, 3);
  }, [availableRecommended]);

  const handleSelectRecommended = (stone) => {
    addDemand({
      name: stone.name,
      image: stone.image || stone.thumbnail,
      color: stone.color || stone.category || '',
      finish: Array.isArray(stone.finish) ? stone.finish[0] : (stone.finish || 'Polished'),
      features: stone.features || ['Premium Grade', 'Custom Cut']
    });
  };
  // Helper to format requirements string from current demands or URL params
  const formatRequirementsText = (currentDemands, stoneName) => {
    if (currentDemands && currentDemands.length > 0) {
      const demandList = currentDemands.map((d, index) => {
        let params = [];
        if (d.color) params.push(`Color: ${d.color}`);
        if (d.finish) params.push(`Finish: ${d.finish}`);
        if (d.features && d.features.length) params.push(`Features: ${d.features.join(', ')}`);

        const paramStr = params.length > 0 ? ` (${params.join(' | ')})` : '';
        return `${index + 1}. ${d.name}${paramStr}`;
      }).join('\n');

      return `I am interested in the following demands:\n${demandList}`;
    }
    return stoneName ? `Interested in: ${stoneName}` : 'I am looking for...';
  };

  const displayTitle = (demands && demands.length > 0)
    ? `Selected Demands (${demands.length})`
    : (graniteName || 'Custom Requirement');

  const [selectedScope, setSelectedScope] = useState('');
  const [selectedArea, setSelectedArea] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    requirements: formatRequirementsText(demands, graniteName),
  });

  // Sync requirements text in real time whenever demands change (e.g. when an item is removed)
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      requirements: formatRequirementsText(demands, graniteName)
    }));
  }, [demands, graniteName]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const sendWhatsAppMessage = (data) => {
    // Format the message for WhatsApp with executive markdown
    const whatsappMessage =
      `*🌟 NEW QUOTE REQUEST 🌟*\n\n` +
      `*Client Name:* ${data.name}\n` +
      (data.phone ? `*Phone / WhatsApp:* ${data.phone}\n` : '') +
      (data.email ? `*Email:* ${data.email}\n` : '') +
      (selectedScope ? `*Project Scope:* ${selectedScope}\n` : '') +
      (selectedArea ? `*Estimated Area:* ${selectedArea}\n` : '') +
      (graniteName ? `*Featured Stone:* ${graniteName}\n` : '') +
      `\n*Project Requirements / Selected Items:*\n${data.requirements}\n\n` +
      `_Sent via Stoneo_`;

    const encodedMessage = encodeURIComponent(whatsappMessage);

    // Recipient WhatsApp number
    const yourNumber = '919256901351';
    const whatsappUrl = `https://wa.me/${yourNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      sendWhatsAppMessage(formData);
      setMessage('WhatsApp is opening! Please send the pre-filled message to complete your quotation request.');

      setFormData({
        name: '',
        email: '',
        phone: '',
        requirements: formatRequirementsText([], graniteName),
      });
      setSelectedScope('');
      setSelectedArea('');

      clearDemands();

      setTimeout(() => {
        navigate('/category/granite');
      }, 3000);

    } catch (error) {
      console.error('Error opening WhatsApp:', error);
      setMessage('Could not open WhatsApp. Please contact us directly at +91 92569 01351.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {SEOHeadComponent}
      <div className="luxury-quote-page">
        {/* ================= HERO HEADER ================= */}
        <section className="luxury-quote-hero">
          <div className="container">
            <FadeUp>
              <div className="quote-badge-pill">
                <span className="quote-pulse-dot"></span>
                Quotation Desk • Instant WhatsApp Dispatch
              </div>
            </FadeUp>
            <FadeUp delay={0.1}>
              <h1>Request a Quotation</h1>
            </FadeUp>
            <FadeUp delay={0.2}>
              <p>
                Review your natural stone portfolio and connect directly with our specialists for pricing & sample dispatch.
              </p>
            </FadeUp>
          </div>
        </section>

        {/* ================= MAIN WORKSPACE (2-COLUMN GRID) ================= */}
        <section className="luxury-quote-workspace">
          <div className="luxury-quote-grid">

            {/* LEFT COLUMN: SELECTED ITEMS */}
            <div className="luxury-panel-card">
              <div className="panel-header-bar">
                <h2 className="panel-title">
                  {/* <span>🏛️</span> */}
                  {displayTitle}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {demands && demands.length > 0 ? (
                    <>
                      <span className="panel-count-badge">
                        {demands.length} {demands.length === 1 ? 'Sample' : 'Samples'} Selected
                      </span>
                      <button
                        type="button"
                        className="clear-portfolio-btn"
                        onClick={(e) => { e.preventDefault(); clearDemands(); }}
                        title="Clear all selections"
                      >
                        <span>✕</span> Clear Portfolio
                      </button>
                    </>
                  ) : (
                    <span className="panel-count-badge">Custom Specification</span>
                  )}
                </div>
              </div>

              {demands && demands.length > 0 ? (
                <div className="portfolio-items-list">
                  {demands.map((d, i) => (
                    <div key={i} className="portfolio-item-card">
                      <div className="item-thumb-wrapper">
                        <img src={d.image || d.url} alt={d.name} />
                      </div>
                      <div className="item-details-col">
                        <h3 className="item-name">{d.name}</h3>
                        <div className="item-specs-tags">
                          {d.color && <span className="spec-tag">Color: {d.color}</span>}
                          {d.finish && <span className="spec-tag">Finish: {d.finish}</span>}
                          {d.features && d.features.map((feat, idx) => (
                            <span key={idx} className="spec-tag">✓ {feat}</span>
                          ))}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="remove-item-btn"
                        onClick={(e) => { e.preventDefault(); removeDemand(d.name); }}
                        title={`Remove ${d.name}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : graniteName ? (
                <div className="featured-slab-card">
                  <img src={graniteImage} alt={graniteName} className="slab-preview-img" />
                  <div className="slab-info-overlay">
                    <h3>{graniteName}</h3>
                    <div className="slab-badges-row">
                      <span className="luxury-badge">100% Premium Grade</span>
                      <span className="luxury-badge">Custom Cut & Polish</span>
                      <span className="luxury-badge">Direct Quarry Pricing</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="empty-portfolio-showcase">
                  <div className="empty-showcase-header">
                    {/* <span className="empty-showcase-icon">🏛️</span> */}
                    <div>
                      <h3 className="empty-showcase-title">Your Quotation Portfolio is Empty</h3>
                      <span className="empty-showcase-subtitle">Stone Selection</span>
                    </div>
                  </div>

                  <p className="empty-showcase-desc">
                    You haven’t added any stone samples yet. Select from our <strong>Recommended Top Granites</strong> below, browse our Collection, or specify custom architectural requirements in the notes on the right.
                  </p>

                  {/* <div className="empty-showcase-steps">
                    <div className="empty-step-card">
                      <span className="empty-step-num">01</span>
                      <div className="empty-step-content">
                        <strong>Curate Samples</strong>
                        <span>Add from recommendations below or browse our gallery.</span>
                      </div>
                    </div>

                    <div className="empty-step-card">
                      <span className="empty-step-num">02</span>
                      <div className="empty-step-content">
                        <strong>Specify Finishes</strong>
                        <span>Note dimensions, edge profiles, or finishes in the form.</span>
                      </div>
                    </div>

                    <div className="empty-step-card">
                      <span className="empty-step-num">03</span>
                      <div className="empty-step-content">
                        <strong>15-Min Dispatch</strong>
                        <span>Receive factory-direct pricing & lot photos via WhatsApp.</span>
                      </div>
                    </div>
                  </div> */}

                  <div className="empty-showcase-actions">
                    <Link to="/category/granite" className="empty-action-btn primary">
                      Browse Granite Collection
                    </Link>
                    <Link to="/category/marble" className="empty-action-btn outline">
                      Explore Marble
                    </Link>
                  </div>
                </div>
              )}

              {/* ================= RECOMMENDED GRANITES SECTION ================= */}
              {top3Recommended.length > 0 && (
                <div className="recommended-granites-section">
                  <div className="recommended-section-header">
                    <h3 className="recommended-title">
                      Recommended Top Granites
                    </h3>
                    <span className="recommended-subtitle">Click "+ Add to Portfolio" to select</span>
                  </div>

                  <StaggerGroup className="recommended-granites-grid" itemSelector=".recommended-stone-card">
                    {top3Recommended.map((stone, idx) => (
                      <div key={stone.id || stone.name || idx} className="recommended-stone-card">
                        <div className="recommended-img-wrapper">
                          <img src={stone.image || stone.thumbnail} alt={stone.name} />
                          <span className="recommended-cat-badge">{stone.category || stone.color || 'Granite'}</span>
                        </div>
                        <div className="recommended-info">
                          <h4 className="recommended-stone-name">{stone.name}</h4>
                          <div className="recommended-stone-meta">
                            <span>{Array.isArray(stone.finish) ? stone.finish[0] : (stone.finish || 'Polished')}</span>
                            {stone.price && <span className="recommended-price">₹{stone.price}/sq.ft</span>}
                          </div>
                          <button
                            type="button"
                            className="add-recommended-btn"
                            onClick={(e) => {
                              e.preventDefault();
                              handleSelectRecommended(stone);
                            }}
                          >
                            + Add to Portfolio
                          </button>
                        </div>
                      </div>
                    ))}
                  </StaggerGroup>
                </div>
              )}

              <div className="portfolio-note-box">
                <strong>Architectural Guarantee:</strong> Every stone sample in your portfolio is sourced from top-tier Indian & international quarries. Our specialists will provide exact lot photos, custom sizing, and logistics quotes within 15 minutes.
              </div>
            </div>

            {/* RIGHT COLUMN: QUOTE FORM */}
            <div className="luxury-panel-card">
              <div className="panel-header-bar">
                <h2 className="panel-title">
                  Project Specifications
                </h2>
                {/* <span
                  className="panel-count-badge"
                  style={{ borderColor: '#25d366', color: '#25d366', background: 'rgba(37, 211, 102, 0.1)' }}
                >
                  ● 15-Min Reply Avg.
                </span> */}
              </div>
              {/* <p className="quote-form-subtitle">
                Customize your project scope below. Hitting "Send via WhatsApp" will launch a pre-formatted inquiry with our senior desk.
              </p> */}

              <form onSubmit={handleSubmit}>
                {/* {message && (
                  <div className={`quote-alert-box ${message.includes('opening') ? 'success' : 'error'}`}>
                    {message}
                  </div>
                )} */}

                {/* Scope Chips */}
                {/* <span className="scope-chips-label">1. Select Project Scope (Optional)</span>
                <div className="scope-chips-row">
                  {PROJECT_SCOPES.map(scope => (
                    <button
                      key={scope}
                      type="button"
                      className={`scope-chip-btn ${selectedScope === scope ? 'active' : ''}`}
                      onClick={() => setSelectedScope(prev => prev === scope ? '' : scope)}
                    >
                      {scope}
                    </button>
                  ))}
                </div> */}

                {/* Area Chips
                <span className="scope-chips-label">2. Estimated Surface Area (Optional)</span>
                <div className="scope-chips-row">
                  {AREA_OPTIONS.map(area => (
                    <button
                      key={area}
                      type="button"
                      className={`scope-chip-btn ${selectedArea === area ? 'active' : ''}`}
                      onClick={() => setSelectedArea(prev => prev === area ? '' : area)}
                    >
                      {area}
                    </button>
                  ))}
                </div> */}

                {/* Inputs */}
                <div className="luxury-form-group">
                  <label htmlFor="name">Your Full Name *</label>
                  <div className="input-icon-wrapper">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="luxury-input"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Yamya Agarwal"
                      required
                    />
                  </div>
                </div>


                <div className="luxury-form-group">
                  <label htmlFor="requirements">Selected Items & Project Notes *</label>
                  <textarea
                    id="requirements"
                    name="requirements"
                    className="luxury-textarea"
                    value={formData.requirements}
                    onChange={handleChange}
                    placeholder="Describe specific finishes, custom sizes, or delivery timelines..."
                    rows="6"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="whatsapp-dispatch-btn"
                  disabled={isSubmitting}
                >
                  <span style={{ fontSize: '22px' }}></span>
                  {isSubmitting ? 'Launching WhatsApp Desk...' : 'Send Quote Request'}
                </button>

                <div className="quote-trust-bar">
                  <div className="trust-item">
                    <span>15-Min Response</span>
                  </div>
                  <div className="trust-item">
                    <span>Factory Direct Pricing</span>
                  </div>
                  <div className="trust-item">
                    <span>Global Sample Dispatch</span>
                  </div>
                </div>
              </form>
            </div>

          </div>
        </section>

        {/* ================= SHOWROOM EXPERIENCE CENTER ================= */}
        <section className="luxury-showroom-section">
          <div className="showroom-luxury-card">
            <div className="showroom-info-col">
              <h2>Visit Our Experience Center</h2>
              <p>
                Explore thousands of premium natural stone slabs in person. Our architectural consultants are on hand for private tours and sample viewing.
              </p>

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
                  Open Google Maps
                </a>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}