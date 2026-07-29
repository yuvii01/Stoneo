import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/About.css';
import SEOHead from '../components/SEOHead';
import { getOrganizationSchema } from '../utils/seo';
import CEOQuote from './CEOQuote';

const TIMELINE_DATA = [
  {
    year: '2008',
    title: 'Quarry Foundations in Kishangarh',
    subtitle: 'Where Our Legacy Began',
    desc: 'Founded in Kishangarh, Rajasthan—the heart of India’s natural stone industry—Stoneo India started with a singular mission: to source the most enduring and visually striking granite and marble directly from the finest Indian quarries without compromise.',
    milestones: [
      'Established direct quarry access in North & South India',
      'Installed first high-precision slab cutting unit',
      'Supplied landmark commercial projects across Rajasthan'
    ],
    image: 'https://alliancegranimarmo.com/wp-content/uploads/2022/06/Infra-Page_Image-2-1-scaled.jpg'
  },
  {
    year: '2013',
    title: 'Italian Processing Automation',
    subtitle: 'Engineering Millimeter Precision',
    desc: 'Recognizing that world-class stone requires world-class technology, we invested heavily in state-of-the-art Italian multi-wire diamond gang-saws and 24-head automatic polishing lines, elevating our surface finishes to international mirror-gloss standards.',
    milestones: [
      '0.5mm thickness calibration accuracy achieved',
      'Automated epoxy resin infusion for structural fortification',
      'Expanded catalog to 50+ granite and natural stone varieties'
    ],
    image: 'https://www.stonegalleria.in/assets/images/granite-packaging-Wooden-Box-Granite-Packing.webp'
  },
  {
    year: '2018',
    title: 'Global Export Expansion',
    subtitle: 'Indian Excellence on the World Stage',
    desc: 'Stoneo India expanded its international footprint, exporting premium Indian granite, marble, and quartz to architects, developers, and luxury distributors across more than 40 countries in Europe, North America, the Middle East, and Oceania.',
    milestones: [
      'ISPM-15 certified fumigated wooden crate packaging',
      'Zero-breakage international maritime transit record',
      'Recognized as a premier export partner for large-scale infrastructure'
    ],
    image: 'https://nakulinternational.com/wp-content/uploads/2024/12/How-to-Export-Granite-Marble-from-India-1.jpg'
  },
  {
    year: '2023',
    title: 'The Royal Gemstone Collection',
    subtitle: 'Where Geology Meets Haute Couture',
    desc: 'We launched the bespoke Royal Gemstones & Luxury Agate collection—handcrafting semi-precious agate, amethyst, quartz, and jasper into backlit bar tops, feature walls, and opulent architectural centerpieces for ultra-luxury residences.',
    milestones: [
      'Bespoke gemstone slab curation & custom inlay engineering',
      'Backlit translucent luxury slab processing',
      'Collaborations with renowned global interior architects'
    ],
    image: 'https://thumbs.dreamstime.com/b/body-truck-loaded-marble-slabs-stone-cutting-factory-transport-huge-stone-slabs-transport-huge-stone-slabs-195447566.jpg'
  },
  {
    year: '2026',
    title: 'The Future of Sustainable Luxury',
    subtitle: 'Crafting the Next Century of Stone',
    desc: 'Today, Stoneo India leads the industry with eco-conscious processing, 100% water recycling, and a living catalog of over 150 varieties of natural stone. We continue to bridge 4 billion years of geological history with modern architectural perfection.',
    milestones: [
      '100% closed-loop water recycling across all facilities',
      'Over 60+ export destinations worldwide',
      'Unrivaled custom fabrication for bespoke architectural demands'
    ],
    image: 'https://alliancegranimarmo.com/wp-content/uploads/2022/06/Infra-Page_Image-2-1-scaled.jpg'
  }
];

const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Quarry Extraction & Block Grading',
    subtitle: 'Direct from India’s Prime Quarries',
    desc: 'Every Stoneo slab begins with meticulous block selection at the quarry face. Our master geologists evaluate raw blocks for structural soundness, mineral density, chromatic consistency, and vein harmony before extraction.',
    specs: [
      { label: 'Sourcing Method', value: '100% Direct Quarry Selection' },
      { label: 'Block Grading', value: 'Grade-A Prime Monolithic Blocks' },
      { label: 'Origin Diversity', value: 'South India, Rajasthan & Alaska' },
      { label: 'Structural Audit', value: 'Ultra-sonic micro-fissure testing' }
    ],
    image: 'https://alliancegranimarmo.com/wp-content/uploads/2022/06/Infra-Page_Image-2-1-scaled.jpg'
  },
  {
    step: '02',
    title: 'Multi-Wire Diamond Cutting',
    subtitle: 'Zero-Defect Dimensional Accuracy',
    desc: 'Using advanced multi-wire diamond gang-saws, raw stone blocks are sliced into uniform slabs with surgical precision. Our temperature-controlled wet cutting process prevents thermal stress and ensures uniform thickness across every square inch.',
    specs: [
      { label: 'Thickness Tolerance', value: '± 0.5mm Calibrated Accuracy' },
      { label: 'Available Thickness', value: '16mm, 18mm, 20mm, 30mm+' },
      { label: 'Slab Formats', value: 'Jumbo Cutter & Gangsaw Slabs' },
      { label: 'Thermal Safety', value: 'Continuous chilled water immersion' }
    ],
    image: 'https://www.stonegalleria.in/assets/images/granite-packaging-Wooden-Box-Granite-Packing.webp'
  },
  {
    step: '03',
    title: 'Epoxy Resin Infusion & Polishing',
    subtitle: 'Mirror-Gloss & Tactile Finishes',
    desc: 'Slabs undergo vacuum epoxy resin infusion to fortify natural micro-pores, followed by our 24-head automatic polishing lines using diamond abrasives. Choose from high-gloss Polished, tactile Leather, Flamed, or Lapotra finishes.',
    specs: [
      { label: 'Polishing Line', value: '24-Head Italian Automated Line' },
      { label: 'Surface Gloss', value: '95+ Mirror Gloss Index' },
      { label: 'Custom Finishes', value: 'Polished, Leather, Flamed, Honed' },
      { label: 'Stain Resistance', value: 'Deep-pore hydrophobic sealant' }
    ],
    image: 'https://nakulinternational.com/wp-content/uploads/2024/12/How-to-Export-Granite-Marble-from-India-1.jpg'
  },
  {
    step: '04',
    title: '7-Point Audit & Seaworthy Packaging',
    subtitle: 'Guaranteed Damage-Free Global Delivery',
    desc: 'Before dispatch, each slab undergoes a rigorous 7-point quality inspection. Verified slabs are carefully cushioned with polyethylene foam and secured in fumigated, heavy-duty wooden crates designed for international oceanic shipping.',
    specs: [
      { label: 'Inspection Protocol', value: '7-Point Visual & Dimensional Audit' },
      { label: 'Crate Specification', value: 'ISPM-15 Certified Seaworthy Wood' },
      { label: 'Transit Security', value: 'Reinforced corner & steel strapping' },
      { label: 'Global Reach', value: 'Delivered to 60+ countries safely' }
    ],
    image: 'https://thumbs.dreamstime.com/b/body-truck-loaded-marble-slabs-stone-cutting-factory-transport-huge-stone-slabs-transport-huge-stone-slabs-195447566.jpg'
  }
];

export default function About() {
  const [activeTimelineIdx, setActiveTimelineIdx] = useState(0);
  const [activeProcessIdx, setActiveProcessIdx] = useState(0);

  const currentTimeline = TIMELINE_DATA[activeTimelineIdx];
  const currentProcess = PROCESS_STEPS[activeProcessIdx];

  return (
    <>
      <SEOHead 
        pageKey="about"
        structured={getOrganizationSchema()}
      />

      <div className="about-page-wrapper">
        {/* --- HERO SECTION --- */}
        <section className="about-hero-section">
          <div className="about-hero-glow"></div>
          <div className="about-hero-content">
            <div className="about-hero-badge">
              <span>✦</span> India’s Premium Stone Heritage Since 2008
            </div>
            <h1 className="about-hero-title">
              Sculpting Earth’s <span>Timeless Masterpieces</span>
            </h1>
            <p className="about-hero-subtitle">
              From the deep quarries of Kishangarh to architectural landmarks in over 60 countries, 
              Stoneo India transforms 4 billion years of geological heritage into surfaces of unrivaled strength and opulence.
            </p>

            <div className="about-hero-stats-bar">
              <div className="hero-stat-box">
                <span className="hero-stat-number">16+</span>
                <span className="hero-stat-label">Years of Mastery</span>
              </div>
              <div className="hero-stat-box">
                <span className="hero-stat-number">60+</span>
                <span className="hero-stat-label">Countries Exported</span>
              </div>
              <div className="hero-stat-box">
                <span className="hero-stat-number">150+</span>
                <span className="hero-stat-label">Exotic Stone Varieties</span>
              </div>
              <div className="hero-stat-box">
                <span className="hero-stat-number">25,000</span>
                <span className="hero-stat-label">Sq.M Monthly Capacity</span>
              </div>
            </div>
          </div>
        </section>

        {/* --- STORY & ORIGIN SECTION --- */}
        <section className="about-origin-section">
          <div className="origin-grid">
            <div className="origin-text-block">
              <span className="about-section-tag">Our Roots & Heritage</span>
              <h3>Born in Kishangarh: The Stone Capital of India</h3>
              <p>
                Founded in 2008 in Kishangarh, Rajasthan—globally renowned as Asia's largest marble and granite hub—Stoneo India was born out of a passion for authentic natural stone. We recognized early that while India possessed some of the planet's richest stone reserves, architects and developers demanded a supplier who could combine this natural wealth with uncompromising engineering precision.
              </p>
              <p>
                By building direct relationships with quarry owners across South and North India, we eliminated middlemen to ensure our clients receive Grade-A prime blocks with transparent provenance, consistent coloration, and unmatched structural density.
              </p>

              <div className="origin-highlight-box">
                <p>
                  "We don't merely supply stone; we curate permanent geological art that defines the soul of luxury spaces for generations to come."
                </p>
              </div>
            </div>

            <div className="origin-visual-block">
              <div className="origin-image-container">
                <img 
                  src="https://alliancegranimarmo.com/wp-content/uploads/2022/06/Infra-Page_Image-2-1-scaled.jpg" 
                  alt="Stoneo India Quarry Heritage & Processing Facility" 
                />
              </div>
              <div className="origin-badge-float">
                <div className="badge-year">2008</div>
                <div className="badge-text">Year Established in Rajasthan</div>
              </div>
            </div>
          </div>
        </section>

        {/* --- INTERACTIVE TIMELINE / EVOLUTION --- */}
        <section className="about-timeline-section">
          <div className="timeline-container">
            <div className="about-section-header">
              <span className="about-section-tag">Our Chronology</span>
              <h2 className="about-section-title light">The Evolution of Stoneo India</h2>
              <p className="about-section-desc light">
                Explore our milestone journey from a regional granite processor in Rajasthan to a premier international exporter of luxury stone surfaces.
              </p>
            </div>

            <div className="timeline-nav-tabs">
              {TIMELINE_DATA.map((item, idx) => (
                <button
                  key={item.year}
                  className={`timeline-tab-btn ${activeTimelineIdx === idx ? 'active' : ''}`}
                  onClick={() => setActiveTimelineIdx(idx)}
                >
                  {item.year}
                </button>
              ))}
            </div>

            <div className="timeline-card-showcase">
              <div className="timeline-card-content">
                <h3>{currentTimeline.year} — {currentTimeline.title}</h3>
                <h4>{currentTimeline.subtitle}</h4>
                <p>{currentTimeline.desc}</p>
                <ul className="timeline-milestone-list">
                  {currentTimeline.milestones.map((milestone, idx) => (
                    <li key={idx}>{milestone}</li>
                  ))}
                </ul>
              </div>
              <div className="timeline-card-img">
                <img src={currentTimeline.image} alt={`${currentTimeline.year} Stoneo Milestone`} />
              </div>
            </div>
          </div>
        </section>

        {/* --- THE 4 PILLARS OF LUXURY --- */}
        <section className="about-pillars-section">
          <div className="about-section-header">
            <span className="about-section-tag">Why Stoneo India</span>
            <h2 className="about-section-title">The Four Pillars of Stone Distinction</h2>
            <p className="about-section-desc">
              We operate on four foundational commitments that differentiate our stone slabs in the global architectural market.
            </p>
          </div>

          <div className="pillars-grid">
            <div className="pillar-luxury-card">
              <div>
                <div className="pillar-icon-wrap">⛰️</div>
                <h3 className="pillar-title">Direct Quarry Provenance</h3>
                <p className="pillar-desc">
                  Zero intermediaries. We source Grade-A monolithic blocks directly from verified quarries in South India, Rajasthan, and Alaska, ensuring uniform coloration and superior structural integrity.
                </p>
              </div>
              <span className="pillar-tag">100% Authentic Provenance</span>
            </div>

            <div className="pillar-luxury-card">
              <div>
                <div className="pillar-icon-wrap">⚙️</div>
                <h3 className="pillar-title">Automated Italian Precision</h3>
                <p className="pillar-desc">
                  Our advanced multi-wire diamond gang-saws and 24-head automatic polishing lines calibrate slabs to ±0.5mm accuracy with mirror gloss index exceeding 95+.
                </p>
              </div>
              <span className="pillar-tag">Millimeter Calibration</span>
            </div>

            <div className="pillar-luxury-card">
              <div>
                <div className="pillar-icon-wrap">💎</div>
                <h3 className="pillar-title">150+ Exotic Collections</h3>
                <p className="pillar-desc">
                  From robust Indian granites and serene marbles to rare backlit Royal Gemstones like Agate and Amethyst, our catalog caters to residential, commercial, and haute couture spaces.
                </p>
              </div>
              <span className="pillar-tag">Bespoke Curation</span>
            </div>

            <div className="pillar-luxury-card">
              <div>
                <div className="pillar-icon-wrap">🚢</div>
                <h3 className="pillar-title">Seaworthy Export Security</h3>
                <p className="pillar-desc">
                  ISPM-15 certified fumigated wooden crate packaging with polyethylene cushioning and reinforced corner strapping guarantees zero-breakage oceanic transit to over 60 countries.
                </p>
              </div>
              <span className="pillar-tag">Zero Transit Damage</span>
            </div>
          </div>
        </section>

        {/* --- INTERACTIVE CRAFTSMANSHIP PROCESS --- */}
        <section className="about-process-section">
          <div className="about-section-header">
            <span className="about-section-tag">Architectural Mastery</span>
            <h2 className="about-section-title light">From Raw Quarry to Royal Surface</h2>
            <p className="about-section-desc light">
              Discover our four-stage engineering protocol that transforms raw geological stone blocks into precision-crafted architectural slabs.
            </p>
          </div>

          <div className="process-interactive-wrap">
            <div className="process-step-selector">
              {PROCESS_STEPS.map((stepItem, idx) => (
                <div
                  key={stepItem.step}
                  className={`process-step-btn ${activeProcessIdx === idx ? 'active' : ''}`}
                  onClick={() => setActiveProcessIdx(idx)}
                >
                  <div className="step-number-badge">{stepItem.step}</div>
                  <div className="step-btn-text">
                    <h4>{stepItem.title}</h4>
                    <span>{stepItem.subtitle}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="process-display-card">
              <div className="process-display-info">
                <h3>{currentProcess.title}</h3>
                <p>{currentProcess.desc}</p>
                <div className="process-tech-specs">
                  {currentProcess.specs.map((spec, sIdx) => (
                    <div className="tech-spec-item" key={sIdx}>
                      <h5>{spec.label}</h5>
                      <p>{spec.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="process-display-img">
                <img src={currentProcess.image} alt={currentProcess.title} />
              </div>
            </div>
          </div>
        </section>

        {/* --- CEO QUOTE & LEADERSHIP --- */}
        <section className="about-ceo-wrapper">
          <div className="container">
            <CEOQuote />
          </div>
        </section>

        {/* --- VALUES & SUSTAINABILITY --- */}
        <section className="about-values-section">
          <div className="about-section-header">
            <span className="about-section-tag">Ethical Stewardship</span>
            <h2 className="about-section-title">Respecting the Stone, Protecting the Earth</h2>
            <p className="about-section-desc">
              Natural stone is a finite gift from our planet. We combine industrial scale with deep ecological responsibility.
            </p>
          </div>

          <div className="values-cards-grid">
            <div className="value-luxury-item">
              <div className="value-icon-circle">💧</div>
              <h3>100% Water Recycling</h3>
              <p>
                Our cutting and polishing plants operate on closed-loop filtration systems that capture, purify, and reuse 100% of industrial water, zeroing out wastewater discharge.
              </p>
            </div>

            <div className="value-luxury-item">
              <div className="value-icon-circle">🌱</div>
              <h3>Quarry Rehabilitation</h3>
              <p>
                We collaborate closely with quarry partners on post-extraction land restoration, afforestation, and strict adherence to environmental safety protocols.
              </p>
            </div>

            <div className="value-luxury-item">
              <div className="value-icon-circle">🤝</div>
              <h3>Artisan Welfare & Fair Craft</h3>
              <p>
                We uphold strict fair-wage standards, modern safety gear, and comprehensive health programs for our stone cutters, polishers, and logistics teams.
              </p>
            </div>
          </div>
        </section>

        {/* --- LUXURY CALL TO ACTION BANNER --- */}
        <section className="about-cta-section">
          <div className="about-cta-content">
            <h2 className="about-cta-title">Ready to Craft Your Next Landmark?</h2>
            <p className="about-cta-subtitle">
              Connect with our stone specialists for bespoke slab curation, international shipping consultations, or wholesale project pricing.
            </p>
            <div className="about-cta-buttons">
              <Link to="/contact" className="cta-btn-gold">
                Request a Consultation
              </Link>
              <Link to="/royal-collection" className="cta-btn-outline">
                Explore Royal Gemstones
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
