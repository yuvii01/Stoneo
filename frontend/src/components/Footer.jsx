import React from 'react';
import { Link } from 'react-router-dom';
import { COMPANY_INFO } from '../utils/constants';
import '../styles/footer.css';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-v2">
      <div className="footer-v2-container">
        <div className="footer-v2-grid">
          {/* Quick Links Column */}
          <div className="footer-v2-col quick-links-col">
            <h3 className="footer-v2-heading">QUICK LINKS</h3>
            <div className="quick-links-grid">
              <ul className="footer-v2-list">
                <li><Link to="/" onClick={scrollToTop}>Home</Link></li>
                <li><Link to="/about" onClick={scrollToTop}>The Company</Link></li>
                <li><Link to="/category/granite" onClick={scrollToTop}>Granites</Link></li>
                <li><Link to="/royal-gem-stones" onClick={scrollToTop}>Royal Gem Stones</Link></li>
                <li><Link to="/home-decor" onClick={scrollToTop}>Home Decor</Link></li>
              </ul>
              <ul className="footer-v2-list">
                <li><Link to="/application/interior" onClick={scrollToTop}>Interior</Link></li>
                <li><Link to="/application/exterior" onClick={scrollToTop}>Exterior</Link></li>
                <li><Link to="/get-quote" onClick={scrollToTop}>Contact Us</Link></li>
                <li><Link to="/blogs" onClick={scrollToTop}>Blog</Link></li>
                <li><Link to="/get-quote" onClick={scrollToTop}>Get Quote</Link></li>
              </ul>
            </div>
          </div>

          {/* Collections Column */}
          <div className="footer-v2-col">
            <h3 className="footer-v2-heading">COLLECTIONS</h3>
            <ul className="footer-v2-list">
              <li><Link to="/category/marble?type=imported" onClick={scrollToTop}>Imported Marble</Link></li>
              <li><Link to="/category/granite" onClick={scrollToTop}>Granites</Link></li>
              <li><Link to="/category/marble?type=statuario" onClick={scrollToTop}>Statuario Marble</Link></li>
              <li><Link to="/category/marble?type=italian" onClick={scrollToTop}>Italian Marble</Link></li>
              <li><Link to="/category/marble?type=indian" onClick={scrollToTop}>White Marble</Link></li>
              <li><Link to="/application/interior?type=kitchen-countertops" onClick={scrollToTop}>Countertops</Link></li>
              <li><Link to="/category/quartz" onClick={scrollToTop}>Quartz Surfaces</Link></li>
            </ul>
          </div>

          {/* Contact Us Column */}
          <div className="footer-v2-col contact-col">
            <h3 className="footer-v2-heading">CONTACT US</h3>
            <ul className="contact-v2-list">
              <li>
                <a
                  href="https://maps.google.com/?q=Makrana+Rd,+Kali+Dungri,+Kishangarh,+Rajasthan+305801"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link"
                >
                  <svg className="contact-v2-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span>{COMPANY_INFO.address || 'Makrana Rd, Kali Dungri, Kishangarh, Rajasthan 305801'}</span>
                </a>
              </li>
              {/* <li>
                <a href="tel:+919119118118" className="contact-link">
                  <svg className="contact-v2-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 6 2 18 2 18 9"></polyline>
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                    <rect x="6" y="14" width="12" height="8"></rect>
                  </svg>
                  <span>+91-9119118118</span>
                </a>
              </li> */}
              <li>
                <a href={`tel:+91${COMPANY_INFO.phone || '9602386590'}`} className="contact-link">
                  <svg className="contact-v2-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <span>+91-{COMPANY_INFO.phone || '9602386590'}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${COMPANY_INFO.email || 'sales@stoneoindia.com'}`} className="contact-link">
                  <svg className="contact-v2-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <span>{COMPANY_INFO.email || 'sales@stoneoindia.com'}</span>
                </a>
              </li>
            </ul>
            <div className="social-v2-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.17 1 12 1 12s0 3.83.42 5.58a2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.83 23 12 23 12s0-3.83-.42-5.58z"></path>
                  <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"></polygon>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-v2-bottom">
        <div className="footer-v2-bottom-container">
          <p>
            &copy; Copyright {new Date().getFullYear()} Stoneo India. All rights reserved. | <Link to="/about" onClick={scrollToTop}>Privacy Policy</Link> | <Link to="/about" onClick={scrollToTop}>Terms & Conditions</Link> | <Link to="/" onClick={scrollToTop}>Sitemap</Link> | Powered by Stoneo
          </p>
        </div>
      </div>
    </footer>
  );
}
