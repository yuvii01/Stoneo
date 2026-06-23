import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { COMPANY_INFO, GRANITE_TYPES, PROJECTS } from '../utils/constants';
import '../styles/pages.css';
import SEOHead from '../components/SEOHead';
import { getOrganizationSchema } from '../utils/seo';
import { useDemand } from '../context/DemandContext';

export default function GetQuote() {
  const SEOHeadComponent = (
    <SEOHead 
      pageKey="getQuote"
      structured={getOrganizationSchema()}
    />
  );
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { demands, clearDemands } = useDemand();

  const graniteName = searchParams.get('stone') || '';
  const graniteImage = searchParams.get('image') || 'http://petrosstone.com/wp-content/uploads/2021/06/Calacatta-Oro-Italian-Marble-for-Flooring.jpg';
  const fromCart = searchParams.get('from') === 'cart';

  // Format demands if they exist
  let initialRequirements = graniteName ? `Interested in: ${graniteName}` : 'I am looking for...';
  let displayTitle = graniteName || 'Custom Requirement';

  if (demands && demands.length > 0) {
    const demandList = demands.map((d, index) => {
      let params = [];
      if (d.color) params.push(`Color: ${d.color}`);
      if (d.finish) params.push(`Finish: ${d.finish}`);
      if (d.features && d.features.length) params.push(`Features: ${d.features.join(', ')}`);
      
      const paramStr = params.length > 0 ? ` (${params.join(' | ')})` : '';
      return `${index + 1}. ${d.name}${paramStr}`;
    }).join('\n');
    
    initialRequirements = `I am interested in the following demands:\n${demandList}`;
    displayTitle = `Selected Demands (${demands.length})`;
  }

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    requirements: initialRequirements,
  });

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
    // Format the message for WhatsApp
    const whatsappMessage =
      `New Quote Request\n\n` +
      `Name: ${data.name}\n` +
      // `Email: ${data.email}\n` +
      // `Phone: ${data.phone}\n` +
      `Granite: ${graniteName}\n\n` +
      `Requirements:\n${data.requirements}`;

    // Encode the message for URL
    const encodedMessage = encodeURIComponent(whatsappMessage);

    // YOUR WhatsApp number (recipient)
    const yourNumber = '919256901351'; // 91 = India country code

    // Open WhatsApp with pre-filled message directed to your number
    const whatsappUrl = `https://wa.me/${yourNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      // Send WhatsApp message directly — no backend needed
      sendWhatsAppMessage(formData);

      setMessage('WhatsApp is opening! Please send the message to complete your quote request.');

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        requirements: initialRequirements,
      });

      // Clear demands upon successful submission intent
      clearDemands();

      // Redirect to products after a short delay
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
      <div className="page get-quote-page">
      <section className="quote-header page-header">
        <div className="container">
          <h1>Get a Quote</h1>
          <p>Request a custom quote for {displayTitle}</p>
        </div>
      </section>

      <section className="quote-section">
        <div className="container">
          <div className="quote-container">
            <div className="quote-info">
              <p className="granite-name">{displayTitle}</p>
              
              {demands && demands.length > 0 ? (
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                  {demands.map((d, i) => (
                    <div key={i} style={{ width: '80px', height: '80px', borderRadius: '10px', overflow: 'hidden' }}>
                      <img src={d.image || d.url} alt={d.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{borderRadius : '10px'}} className='product-image'>
                  <img src={graniteImage} alt={displayTitle} />
                </div>
              )}
             
              
              <p className="granite-note">
                Fill out the form below. Clicking "Send Quote Request" will open WhatsApp
                with your details pre-filled — just hit send!
              </p>
            </div>

            <form className="quote-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your Name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="requirements">Requirements </label>
                <textarea
                  id="requirements"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  placeholder="Describe your project requirements..."
                  rows="6"
                  required
                />
              </div>

              {message && (
                <div className={`message ${message.includes('opening') ? 'success' : 'error'}`}>
                  {message}
                </div>
              )}

              <button
                type="submit"
                className="send-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Opening WhatsApp...' : 'Send Quote Request'}
              </button>
            </form>
          </div>
        </div>
      </section>



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
            <p>
              <a href={`tel:${COMPANY_INFO.phone}`}>+91-{COMPANY_INFO.phone}</a>
            </p>
          </div>
        </div>

      </div>

      <div className="showroom-map">
        <div
          className="map-link"
          onClick={() =>
            window.open(
              "https://www.google.com/maps/dir//B.G.+Stonex,+JRXW%2BW6,+Khatoli,+Rajasthan+305801/",
              "_blank"
            )
          }
          style={{ cursor: "pointer" }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.4872!2d74.8455201!3d26.6497679!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39695ef1819f25f_!2sB.G.+Stonex!5e0!3m2!1sen!2sin!4v1714000000000!5m2!1sen!2sin"
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
            title="B.G. Stonex Showroom Location"
          />
          <div className="map-overlay">
            <div className="map-overlay-content">
              <span className="map-pin-icon">📍</span>
              <span className="map-overlay-text">Open in Google Maps</span>
              <span className="map-overlay-address">
                K.M Stonex, Khatoli, Kishangarh, Rajasthan 305801
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

      </div>
    </>
  );
}