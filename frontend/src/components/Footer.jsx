import React from 'react';
import { COMPANY_INFO } from '../utils/constants';
import '../styles/footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-section">
            <div className="footer-logo">
              <img src="/logo2.png" alt="KM STONEX Logo" className="footer-logo-img" />
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
            <h3>Get in Touch</h3>
            <div className="footer-contact">
              <p>
                <strong>📍 Address</strong>
                {COMPANY_INFO.address}
              </p>
              <p style={{ display: 'flex', alignItems: 'center', gap: '10px'}}>
                <strong>📞 Call Us</strong>
                <a style={{display : 'flex' , alignItems : 'top'}} href={`tel:${COMPANY_INFO.phone}`}>+91-{COMPANY_INFO.phone}</a>
              </p>
              <p style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
                <strong>✉️ Email</strong>
                <a href={`mailto:${COMPANY_INFO.email}`}>{COMPANY_INFO.email}</a>
              </p>
            </div>
          </div>

          <div className="footer-section">
            <h3>Business Hours</h3>
            <p style={{ marginBottom: '25px', lineHeight: '1.8' }}>
              ⏰ {COMPANY_INFO.businessHours}
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 KM Stonex. All rights reserved. | Premium Granite Supplier</p>
        </div>
      </div>
    </footer>
  );
}
