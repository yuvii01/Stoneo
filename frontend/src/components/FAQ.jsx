import React, { useState } from 'react';
import '../styles/faq.css';

const faqs = [
  {
    question: "What is the difference between Granite and Marble?",
    answer: "Granite is an igneous rock celebrated for exceptional durability, scratch resistance, and heat tolerance—making it ideal for high-traffic zones, heavy-wear surfaces, and low-maintenance requirements (not just kitchens). Marble is a metamorphic rock prized for its timeless elegance, luminous surface, and distinctive veining, best suited for sophisticated, low-abrasion spaces requiring delicate care."
  },
  {
    question: "How do I clean and maintain my natural stone countertops?",
    answer: "For daily cleaning, use a mild, pH-neutral soap with warm water and a soft microfiber cloth. Avoid acidic cleaners (like vinegar or lemon), abrasive scrubs, or ammonia-based products, as they can etch the surface or dull the stone's luxurious polish."
  },
  {
    question: "Can natural stones be used for outdoor applications?",
    answer: "Absolutely. Stones such as Granite, Sandstone, and Slate are incredibly resilient to weathering and temperature fluctuations. They are excellent, long-lasting choices for outdoor flooring, elevation cladding, driveways, and landscaping."
  },
  {
    question: "Are natural stones heat resistant?",
    answer: "Natural stones, particularly Granite and Quartzite, have excellent natural heat resistance. However, to protect the sealant and prevent any potential thermal shock or surface discoloration, we always recommend using trivets or hot pads under hot cookware."
  },
  {
    question: "How long does a premium natural stone installation last?",
    answer: "When properly maintained, a premium natural stone installation can easily last a lifetime. It is one of the most durable, sustainable, and timeless building materials available, often outlasting the building itself while adding permanent value to your property."
  }
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <div className="faq-container">
        <div className="faq-header">
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <p className="faq-subtitle">Expert Insights on Choosing, Installing, and Maintaining Premium Natural Stones.</p>
        </div>
        
        <div className="faq-accordion">
          {faqs.map((faq, index) => {
            const isActive = activeIndex === index;
            return (
              <div 
                key={index} 
                className={`faq-item ${isActive ? 'active' : ''}`}
                onClick={() => toggleAccordion(index)}
              >
                <div className="faq-question-container">
                  <h3 className="faq-question">{faq.question}</h3>
                  <span className={`faq-icon ${isActive ? 'open' : ''}`}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        transform: isActive ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </span>
                </div>
                <div 
                  className="faq-answer-container"
                  style={{
                    maxHeight: isActive ? '300px' : '0',
                    opacity: isActive ? 1 : 0,
                    overflow: 'hidden',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <p className="faq-answer">{faq.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
