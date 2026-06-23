import React, { useState } from 'react';
import { COMPANY_INFO } from '../utils/constants';
import '../styles/pages.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    area: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to a backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        phone: '',
        projectType: '',
        area: '',
        message: '',
      });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="page contact-page">
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1>Contact Us</h1>
          <p>We're here to help with your granite needs</p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Information */}
            <div className="contact-info">
              <h2>Get In Touch</h2>
              <p>Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>

              <div className="contact-details">
                <div className="detail-item">
                  <div className="detail-icon">📍</div>
                  <div className="detail-content">
                    <h3>Address</h3>
                    <p>{COMPANY_INFO.address}</p>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">📞</div>
                  <div className="detail-content">
                    <h3>Phone</h3>
                    <p>
                      <a href={`tel:${COMPANY_INFO.phone}`}>{COMPANY_INFO.phone}</a>
                    </p>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">✉️</div>
                  <div className="detail-content">
                    <h3>Email</h3>
                    <p>
                      <a href={`mailto:${COMPANY_INFO.email}`}>{COMPANY_INFO.email}</a>
                    </p>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">🕐</div>
                  <div className="detail-content">
                    <h3>Business Hours</h3>
                    <p>{COMPANY_INFO.businessHours}</p>
                  </div>
                </div>
              </div>

              <div className="contact-methods">
                <h3>Quick Contact</h3>
                <div className="method-buttons">
                  <a href={`tel:${COMPANY_INFO.phone}`} className="method-btn whatsapp">
                    <span>📱</span> WhatsApp
                  </a>
                  <a href={`tel:${COMPANY_INFO.phone}`} className="method-btn call">
                    <span>☎️</span> Call
                  </a>
                  <a href={`mailto:${COMPANY_INFO.email}`} className="method-btn email">
                    <span>✉️</span> Email
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-wrapper">
              <div className={`contact-form ${submitted ? 'submitted' : ''}`}>
                <h2>Send Us a Message</h2>
                
                {submitted && (
                  <div className="success-message">
                    ✓ Thank you! We'll get back to you soon.
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Your Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="email">Email *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">Phone *</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Your phone number"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="projectType">Project Type</label>
                      <select
                        id="projectType"
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleChange}
                      >
                        <option value="">Select a type...</option>
                        <option value="residential">Residential</option>
                        <option value="commercial">Commercial</option>
                        <option value="industrial">Industrial</option>
                        <option value="landscape">Landscape</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="area">Area (sq ft)</label>
                      <input
                        type="number"
                        id="area"
                        name="area"
                        value={formData.area}
                        onChange={handleChange}
                        placeholder="Estimated area"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your project..."
                      rows="5"
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-primary btn-full">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <div className="container">
          <h2>Visit Our Showroom</h2>
          <div className="map-container">
            <div className="map-placeholder">
              <p>📍 Our Location</p>
              <p>{COMPANY_INFO.address}</p>
              <p style={{ marginTop: '20px', fontSize: '14px' }}>
                Interactive map would be displayed here
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Contact */}
      <section className="contact-benefits">
        <div className="container">
          <h2>Why Contact Stoneo India?</h2>
          <div className="benefits-grid">
            <div className="benefit">
              <div className="benefit-icon">⚡</div>
              <h3>Quick Response</h3>
              <p>We respond to all inquiries within 24 hours</p>
            </div>
            <div className="benefit">
              <div className="benefit-icon">💬</div>
              <h3>Expert Advice</h3>
              <p>Professional guidance on granite selection</p>
            </div>
            <div className="benefit">
              <div className="benefit-icon">💰</div>
              <h3>Best Pricing</h3>
              <p>Competitive rates with bulk discounts available</p>
            </div>
            <div className="benefit">
              <div className="benefit-icon">🚚</div>
              <h3>Fast Delivery</h3>
              <p>Quick processing and reliable shipping</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
