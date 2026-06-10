import React, { useState } from 'react';
import { FAQS } from '../utils/constants';
import '../styles/pages.css';

export default function FAQs() {
  const [expandedId, setExpandedId] = useState(null);

  const toggleFAQ = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="page faqs-page">
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1>Frequently Asked Questions</h1>
          <p>Find answers to common questions about granite and our services</p>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="faqs-section">
        <div className="container">
          <div className="faqs-container">
            {FAQS.map((faq) => (
              <div key={faq.id} className="faq-item">
                <button
                  className={`faq-question ${expandedId === faq.id ? 'expanded' : ''}`}
                  onClick={() => toggleFAQ(faq.id)}
                >
                  <span className="faq-number">{faq.id}</span>
                  <span className="faq-text">{faq.question}</span>
                  <span className="faq-toggle">{expandedId === faq.id ? '−' : '+'}</span>
                </button>
                {expandedId === faq.id && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search CTA */}
      <section className="search-cta">
        <div className="container">
          <p>Didn't find what you're looking for?</p>
          <a href="/contact" className="btn btn-primary">Contact Our Experts</a>
        </div>
      </section>

      {/* Categories */}
      <section className="faq-categories">
        <div className="container">
          <h2>Browse by Category</h2>
          <div className="categories-list">
            <div className="category">
              <h3>💎 About Granite</h3>
              <ul>
                <li><a href="#faq-1">Types of granite</a></li>
                <li><a href="#faq-2">Granite vs marble</a></li>
                <li><a href="#faq-3">Durability</a></li>
              </ul>
            </div>
            <div className="category">
              <h3>🏠 Installation</h3>
              <ul>
                <li><a href="#faq-4">Installation process</a></li>
                <li><a href="#faq-5">Cost estimation</a></li>
                <li><a href="#faq-6">Time required</a></li>
              </ul>
            </div>
            <div className="category">
              <h3>🧹 Maintenance</h3>
              <ul>
                <li><a href="#faq-7">Cleaning methods</a></li>
                <li><a href="#faq-8">Sealing frequency</a></li>
                <li><a href="#faq-9">Stain removal</a></li>
              </ul>
            </div>
            <div className="category">
              <h3>📦 About Us</h3>
              <ul>
                <li><a href="#faq-10">Location</a></li>
                <li><a href="#faq-11">Samples</a></li>
                <li><a href="#faq-12">Warranty</a></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Maintenance Tips */}
      <section className="maintenance-tips">
        <div className="container">
          <h2>Quick Maintenance Tips</h2>
          <div className="tips-grid">
            <div className="tip-card">
              <div className="tip-icon">💧</div>
              <h3>Daily Cleaning</h3>
              <p>Wipe spills immediately with a soft cloth. Use pH-neutral cleaners only.</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">🛡️</div>
              <h3>Annual Sealing</h3>
              <p>Reseal your granite once a year to maintain protection against stains and moisture.</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">❌</div>
              <h3>Avoid Acidic</h3>
              <p>Don't use vinegar or acidic cleaners. These can damage the polished surface.</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">🚫</div>
              <h3>Use Coasters</h3>
              <p>Use coasters under glasses to prevent staining and protect the surface.</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">🔥</div>
              <h3>Trivets for Heat</h3>
              <p>While heat-resistant, use trivets for hot cookware to prevent thermal shock.</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">🧊</div>
              <h3>Cool Surface</h3>
              <p>Allow hot items to cool slightly before placing on granite surfaces.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="faqs-cta">
        <div className="container">
          <h2>Still Have Questions?</h2>
          <p>Our expert team is ready to help you choose the perfect granite for your project</p>
          <div className="cta-buttons">
            <a href="/contact" className="btn btn-primary">Send Message</a>
            <a href="tel:9928172190" className="btn btn-secondary">Call Now</a>
          </div>
        </div>
      </section>
    </div>
  );
}
