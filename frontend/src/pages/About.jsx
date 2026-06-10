import React from 'react';
import { COMPANY_INFO } from '../utils/constants';
import '../styles/pages.css';
import SEOHead from '../components/SEOHead';
import { getOrganizationSchema } from '../utils/seo';
import CEOQuote from './CEOQuote';

export default function About() {
  return (
    <>
      <SEOHead 
        pageKey="about"
        structured={getOrganizationSchema()}
      />
      <div className="page about-page">
      {/* Page Header */}
      <section className="about-header page-header">
        <div className="container">
          <h1>About KM Stonex</h1>
          <p>India's Premium Stone Supplier</p>
        </div>
      </section>


 <section className="company-story">
        <div className="container">
         
            <div className="story-content">
              <h2>Our Story</h2>
              <div style={{fontSize : '20px'}}>
                <p>
                Founded in 2008, KM Stonex has grown to become one of the most trusted granite suppliers in India. 
                Located in the heart of Kishangarh, Rajasthan - the granite capital of India - we have direct access 
                to the finest quarries and have built a reputation for quality, reliability, and exceptional service.
              </p>
              <p>
                With over 25 years of combined experience in the stone industry, our team brings expertise and 
                dedication to every project. We believe in building long-term relationships with our clients through 
                consistent quality and honest business practices.
              </p>
              <p>
                Today, KM Stonex serves residential, commercial, and industrial clients across India and beyond, 
                delivering not just stone, but premium solutions for spaces that matter.
              </p>
              </div>
            </div>
           
        
        </div>
      </section>


      <section>
      <CEOQuote />
    </section>

      {/* Quality Pillars */}
      <section style={{ backgroundColor: '#f5f5f5', padding: '60px 0', marginBottom: '40px' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '50px' }}>Quality You Can Rely On</h2>
          <div className="grid-container">

  <div className="card">
    <div className="card-bg" style={{ backgroundImage: "url(https://alliancegranimarmo.com/wp-content/uploads/2022/06/Infra-Page_Image-2-1-scaled.jpg)" }}></div>
    <div className="card-content">
      <h3> Manufacturing</h3>
      <p>Advanced quarrying and precision cutting technology</p>
    </div>
  </div>

  <div className="card">
    <div className="card-bg" style={{ backgroundImage: "url(https://nakulinternational.com/wp-content/uploads/2024/12/How-to-Export-Granite-Marble-from-India-1.jpg)" }}></div>
    <div className="card-content">
      <h3> Quality</h3>
      <p>Strict inspection at every stage of production</p>
    </div>
  </div>

  <div className="card">
    <div className="card-bg" style={{ backgroundImage: "url(https://www.stonegalleria.in/assets/images/granite-packaging-Wooden-Box-Granite-Packing.webp)" }}></div>
    <div className="card-content">
      <h3> Packaging</h3>
      <p>Secure packaging for safe transport</p>
    </div>
  </div>

  <div className="card">
    <div className="card-bg" style={{ backgroundImage: "url(https://thumbs.dreamstime.com/b/body-truck-loaded-marble-slabs-stone-cutting-factory-transport-huge-stone-slabs-transport-huge-stone-slabs-195447566.jpg)" }}></div>
    <div className="card-content">
      <h3> Delivery</h3>
      <p>Timely delivery to your doorstep</p>
    </div>
  </div>

</div>
</div>
      </section>

      {/* Customized Solutions */}
      {/* <section className="mission-vision">
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '40px' }}>Customized Solutions for Every Project Stage</h2>
          <div style={{ fontSize: '18px', lineHeight: '1.9', textAlign: 'center', maxWidth: '800px', margin: '0 auto', marginBottom: '40px' }}>
            <p>
              With <strong>25+ years</strong> as an Indian granite manufacturer and global exporter, we work closely with our clients to support their projects with tailored pricing and dedicated services. We offer <strong>complete customization</strong> including:
            </p>
          </div>
          <div className="mission-vision-grid">
            <div className="mission-card">
              <div className="card-icon">📐</div>
              <h3>Custom Dimensions</h3>
              <p>Cut to your exact specifications and project requirements</p>
            </div>
            <div className="mission-card">
              <div className="card-icon">✨</div>
              <h3>Edge Profiles</h3>
              <p>Choose from various edge finishes to match your design</p>
            </div>
            <div className="mission-card">
              <div className="card-icon">🎨</div>
              <h3>Custom Finishes</h3>
              <p>Polished, honed, flamed, leathered, and more</p>
            </div>
            <div className="mission-card">
              <div className="card-icon">🔗</div>
              <h3>Combined Products</h3>
              <p>Mix and match to meet your exact project needs</p>
            </div>
          </div>
        </div>
      </section> */}

      {/* Indian Granite Info */}
      <section className="values-section" style={{ backgroundColor: '#f9f9f9', padding: '80px 0' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '40px' }}>Indian Stone: Strength, Beauty & Performance</h2>
          <div style={{ maxWidth: '900px', margin: '0 auto', fontSize: '17px', lineHeight: '2' }}>
            <p style={{ marginBottom: '25px' }}>
              Indian Stone is globally recognized as one of the most <strong>durable and visually striking natural building materials</strong>. Known for its exceptional hardness, low porosity, and resistance to heat, stains, and abrasion, granite delivers long-term performance in both interior and exterior applications.
            </p>

            <h3 style={{ fontSize: '24px', marginBottom: '20px', color: '#654321' }}>What Sets Indian Stone Apart</h3>
            <p style={{ marginBottom: '25px' }}>
              Indian Stone offers a <strong>remarkable range of colors, grain patterns, and mineral compositions</strong>—formed naturally over millions of years. From classic neutrals to bold exotic shades, each slab offers unique character combined with structural strength.
            </p>

            <h3 style={{ fontSize: '24px', marginBottom: '20px', color: '#654321' }}>Complete Processing & Finishing</h3>
            <p style={{ marginBottom: '25px' }}>
              Through advanced quarrying, precision cutting, and modern surface processing, Indian stone is transformed into:
            </p>
            <div style={{ marginLeft: '20px', marginBottom: '25px' }}>
              <p>✓ Slabs and tiles</p>
              <p>✓ Countertops and vanities</p>
              <p>✓ Steps and pavers</p>
              <p>✓ Architectural elements</p>
            </div>

            <h3 style={{ fontSize: '24px', marginBottom: '20px', color: '#654321' }}>Available Finishes</h3>
            <p style={{ marginBottom: '25px' }}>
              A wide variety of finishes enhance both aesthetics and functionality:
            </p>
            <div style={{ marginLeft: '20px', marginBottom: '25px' }}>
              <p>• Polished - High shine and mirror-like reflectivity</p>
              <p>• Honed - Matte finish for contemporary looks</p>
              <p>• Flamed - Textured, rustic appearance</p>
              <p>• Leathered - Soft, natural texture</p>
              <p>• Bush-hammered - Aged, dramatic finish</p>
            </div>

            <h3 style={{ fontSize: '24px', marginBottom: '20px', color: '#654321' }}>Trusted Worldwide</h3>
            <p>
              Trusted by architects, builders, and importers across the globe, Indian stone continues to define spaces with <strong>unmatched reliability, timeless beauty, and proven performance</strong> in residential, commercial, and large-scale infrastructure projects.
            </p>
          </div>
        </div>
      </section>

      {/* Achievements */}
      {/* <section className="achievements" style={{ padding: '60px 0' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '50px' }}>Our Expertise</h2>
          <div className="achievements-grid">
            <div className="achievement">
              <div className="achievement-icon">⏱️</div>
              <h4>25+ Years</h4>
              <p>Manufacturing & Export Experience</p>
            </div>
            <div className="achievement">
              <div className="achievement-icon">🌍</div>
              <h4>60+ Countries</h4>
              <p>Global client base served</p>
            </div>
            <div className="achievement">
              <div className="achievement-icon">⚙️</div>
              <h4>Advanced Processing</h4>
              <p>Modern quarrying & cutting technology</p>
            </div>
            <div className="achievement">
              <div className="achievement-icon">✨</div>
              <h4>Multiple Finishes</h4>
              <p>Polished, honed, flamed & more</p>
            </div>
            <div className="achievement">
              <div className="achievement-icon">📦</div>
              <h4>Safe Packaging</h4>
              <p>Professional shipping worldwide</p>
            </div>
            <div className="achievement">
              <div className="achievement-icon">💼</div>
              <h4>Full Customization</h4>
              <p>Dimensions, edges, finishes, more</p>
            </div>
          </div>
        </div>
      </section> */}

      {/* Contact CTA */}
      {/* <section style={{ backgroundColor: '#a45040', color: 'white', padding: '80px 0', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: '36px', marginBottom: '20px' }}>Get In Touch</h2>
          <p style={{ fontSize: '18px', lineHeight: '1.8', marginBottom: '40px', maxWidth: '700px', margin: '0 auto 40px auto' }}>
            Ready to find the perfect granite for your project? Our team of experts is here to help with tailored solutions and competitive pricing.
          </p>
          <a href="/contact" style={{
            display: 'inline-block',
            backgroundColor: 'white',
            color: '#a45040',
            padding: '15px 50px',
            borderRadius: '8px',
            fontSize: '18px',
            fontWeight: '600',
            textDecoration: 'none',
            transition: 'all 0.3s ease'
          }}>
            Contact Us Now
          </a>
        </div>
      </section> */}
      </div>
    </>
  );
}
