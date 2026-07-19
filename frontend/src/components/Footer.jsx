import React from 'react';
import { useNavigate } from 'react-router-dom';
import { COMPANY_INFO } from '../utils/constants';
import '../styles/footer.css';

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="footer-container">
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
