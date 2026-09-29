import React, { useState } from 'react';
import '../styles/faq.css';

const faqs = [
  {
    question: "What is the difference between Granite and Marble?",
    answer: "Granite is an igneous rock, known for its incredible durability, heat resistance, and scratch resistance, making it ideal for kitchens. Marble is a metamorphic rock, prized for its classic elegance, luminous surface, and unique veining, but it is generally softer and requires more delicate maintenance."
  },
  {
    question: "Do natural stone surfaces need to be sealed?",
    answer: "Yes, most natural stones are inherently porous and should be sealed periodically to prevent staining and water absorption. For high-use areas like kitchens, we recommend sealing your premium stones every 1-2 years to maintain their pristine appearance."
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
          <p className="faq-subtitle">Expert insights on choosing, maintaining, and understanding premium natural stones.</p>
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
                  <span className="faq-icon">
                    {isActive ? '−' : '+'}
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
