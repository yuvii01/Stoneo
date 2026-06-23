import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom'; // Required for URL filtering

import '../../styles/pages.css';
import { GRANITE_TYPES } from '../../utils/constants';
import SEOHead from '../../components/SEOHead';
import { getBreadcrumbSchema } from '../../utils/seo';
import { useDemand } from '../../context/DemandContext';

// 1. Updated Data with Category Column
const CSV_PRODUCTS = [
  
  { "name": "Agra Red Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/agra-red/agra-red-sawn-wet-sandstone-tiles.jpg", "color": "Red" },
  { "name": "Autumn Brown Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/autumn-brown/automn-brown-sandstone-honed-surface-cut-to-size-tiles.jpg", "color": "Brown" },
  { "name": "Bansi Pink Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/bansi-pink/bansi-pink-sandstone-honed-finish-tiles.jpg", "color": "Pink" },
  { "name": "Camel Dust Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/camel-dust/camel-dust-sandstone-natural-paving-tiles.jpg", "color": "Beige" },
  { "name": "Chocolate Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/chocolate/chocolate-sandstone-natural-finish-calibrated-tiles.jpg", "color": "Brown" },
  { "name": "Sagar Black Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/sagar-black/sagar-black-natural-wet-sandstone-paving-exterior-tiles.jpg", "color": "Black" },

  { "name": "Dholpur Beige Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/dholpur-beige/dholpur-beige-sandstone-natural-finish-tiles.jpg", "color": "Beige" },
  { "name": "Modak Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/modak/modak-sandstone-natural-surface-hand-split-tiles.jpg", "color": "Brown" },
  { "name": "Mandana Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/mandana/mandana-red-sandstone-natural-tile-exporter-india.jpg", "color": "Red" },

  { "name": "Jodhpur Pink Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/jodhpur-pink/jodhpur-pink-sandstone-honed-tiles.jpg", "color": "Pink" },
  { "name": "Jodhpur Brown Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/jodhpur-brown/jodhpur-brown-sandstone-honed-finish-tiles.jpg", "color": "Brown" },
  { "name": "Jaisalmer Yellow Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/jaisalmer-yellow/jaisalmer-yellow-sandstone-honed-polished-cut-to-size-tiles.jpg", "color": "Yellow" },

  { "name": "Mint Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/mint/white-mint-natural-split-surface-sandstone-tile.jpg", "color": "Light Green" },
  { "name": "Yellow Mint Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/yellow-mint/yellow-mint-sandstone-natural-finish-calibrated-tiles.jpg", "color": "Yellow" },
  { "name": "Pink Mint Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/pink-mint/pink-mint-sandstone-cut-to-size-natural-tiles.jpg", "color": "Pink" },

  { "name": "Lalitpur Grey Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/lalitpur-grey/lalitpur-grey-sandstone-natural-patio-pack-tiles.jpg", "color": "Grey" },
  { "name": "Lalitpur Yellow Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/lalitpur-yellow/lalitpur-yellow-sandstone-natural-split-finish-tiles.jpg", "color": "Yellow" },
  { "name": "Raveena Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/raveena/raveena-sandstone-natural-paving-tile-setts.jpg", "color": "Brown" },

  { "name": "Kandla Grey Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/kandla-grey/kandla-grey-sandstone-natural-finish-tiles.jpg", "color": "Grey" },
  { "name": "Raj Green Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/raj-green/raj-green-natural-sandstone-floor-covering-tiles.jpg", "color": "Green" },
  { "name": "Fossil Mint Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/fossil-mint/fossil-mint-sandstone-paving-tiles.jpg", "color": "Green" },

  { "name": "Teak Wood Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/teak-wood/teakwood-sandstone-honed-paving-tiles.jpg", "color": "Brown" },
  { "name": "Rainbow Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/rainbow/rainbow-sandstone-swan-finish-paving-tiles.jpg", "color": "Multicolor" },
  { "name": "Panther Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/panther/panter-sandstone-patio-pack-paving-tiles.jpg", "color": "Brown" }

]


const DEFAULT_DESCRIPTION = 'Premium quality granite, sourced from verified quarries.';
const DEFAULT_FEATURES = ['Natural stone finish', 'Scratch resistant', 'Easy to maintain'];

// Build Lookup Map
const graniteTypesMap = Object.fromEntries(
  GRANITE_TYPES.map((g) => [g.name.toLowerCase().trim(), g])
);

// Merge Data
const ALL_PRODUCTS = CSV_PRODUCTS.map((csvItem, index) => {
  const key = csvItem.name.toLowerCase().trim();
  const existing = graniteTypesMap[key];
  return {
    id: existing ? existing.id : `csv-${index}`,
    name: csvItem.name,
    image: csvItem.image,
    color: csvItem.color || 'Beige',
    category: csvItem.color || 'Beige', // Use color as category for display
    description: existing ? existing.description : DEFAULT_DESCRIPTION,
    features: existing ? existing.features : DEFAULT_FEATURES,
  };
});


export default function Sandstone() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addDemand, demands } = useDemand();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // 2. Get category from URL (e.g. ?category=Black)
  const categoryFilter = searchParams.get('category') || 'All';

  // 3. Filtered List Logic
  const filteredProducts = useMemo(() => {
    if (categoryFilter === 'All') return ALL_PRODUCTS;
    return ALL_PRODUCTS.filter(p => p.color.toLowerCase() === categoryFilter.toLowerCase());
  }, [categoryFilter]);

  const [selectedProduct, setSelectedProduct] = useState(filteredProducts[0] || ALL_PRODUCTS[0]);

  // Sync selected product when filter changes
  useEffect(() => {
    if (filteredProducts.length > 0) {
      setSelectedProduct(filteredProducts[0]);
    }
  }, [filteredProducts]);

  return (
    <>
    <div className="page products-page">
      <section className="sandstone-header page-header">
        <div className="container container-heading">
          <h1>Our {categoryFilter !== 'All' ? categoryFilter : ''} Sandstone Collections</h1>
          <p>Browse our premium selection of {categoryFilter.toLowerCase()} imported varieties</p>
        </div>
      </section>

      {/* Category Tabs - Responsive Slider */}
      <section className="filter-bar">
        <div className="filter-buttons-wrapper">
          <div className="filter-buttons-container">
            {['All', 'Red' , 'Black','Brown', 'Pink', 'Beige', 'Yellow' , 'Green' , 'Grey' , 'Multicolor' ].map(cat => (
              <button 
                key={cat}
                className={`filter-btn ${categoryFilter === cat ? 'active' : ''}`}
                onClick={() => setSearchParams({ category: cat })}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="products-section">
        <div className="container">
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <div 
                key={product.id}
                  className={`product-card ${selectedProduct?.id === product.id ? 'selected' : ''}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/products/${product.id || product._id}`, { state: { product } })}
                >
                <div className="product-image">
                  <img src={product.image} alt={product.name} />

                  <div className="category-tag" style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    background: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    padding: '4px 10px',
                    fontSize: '10px',
                    borderRadius: '4px',
                    textTransform: 'uppercase'
                  }}>
                    {product.category}
                  </div>
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button 
                      className="get-quote-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        addDemand(product);
                      }}
                    >
                      {demands.some(d => d.name === product.name) ? "Added!" : "Add to Demands"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sandstone Buying Guide - Slider */}
      <section className="guide-slider-section" style={{ backgroundImage : 'url(https://www.royalindianstones.com/assets/img/products/sandstone/camel-dust/camel-dust-sandstone-natural-paving-tiles.jpg)', padding: '60px 0' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '32px' }}>Sandstone Buying Guide</h2>
          
          <div style={{
            maxWidth: '900px',
            margin: '0 auto',
            backgroundColor: 'white',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}>
            {/* Slider Content */}
            <div style={{ padding: '60px 50px', minHeight: '450px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {currentSlide === 0 && (
                <div>
                  <h3 style={{ fontSize: '28px', marginBottom: '20px', color: '#a45040' }}>What is Sandstone?</h3>
                  <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#333' }}>
                    Sandstone is a natural sedimentary rock formed from compressed sand grains. Known for its warm earthy tones and rustic beauty, sandstone offers durability, low porosity, and excellent slip resistance. Perfect for outdoor paving, flooring, and decorative wall cladding, sandstone has been a favored building material for centuries.
                  </p>
                </div>
              )}

              {currentSlide === 1 && (
                <div>
                  <h3 style={{ fontSize: '28px', marginBottom: '20px', color: '#a45040' }}>Colors & Finishes</h3>
                  <div style={{ fontSize: '16px', lineHeight: '1.9', color: '#333' }}>
                    <p><strong>🔴 Red & Warm Tones:</strong> Agra Red, Mandana - Rich, inviting warmth</p>
                    <p><strong>🟤 Browns:</strong> Autumn Brown, Chocolate, Jodhpur Brown - Natural, earthy elegance</p>
                    <p><strong>🟡 Yellows & Creams:</strong> Jaisalmer Yellow, Camel Dust - Bright, welcoming feel</p>
                    <p><strong>⚪ Greens & Grey:</strong> Raj Green, Kandla Grey - Modern, sophisticated look</p>
                    <p style={{ marginTop: '15px', fontStyle: 'italic' }}>Available in Natural Split, Honed, Polished, and Bush-hammered finishes</p>
                  </div>
                </div>
              )}

              {currentSlide === 2 && (
                <div>
                  <h3 style={{ fontSize: '28px', marginBottom: '20px', color: '#a45040' }}>Best Uses & Benefits</h3>
                  <div style={{ fontSize: '16px', lineHeight: '1.9', color: '#333' }}>
                    <p><strong>🌳 Outdoor Paving:</strong> Natural slip resistance, perfect for patios and garden paths</p>
                    <p><strong>🏠 Interior Flooring:</strong> Warm aesthetic, durable for high-traffic areas</p>
                    <p><strong>🎨 Wall Cladding:</strong> Dramatic architectural feature with timeless appeal</p>
                    <p><strong>✨ Low Maintenance:</strong> Easy to clean, long-lasting, eco-friendly material</p>
                  </div>
                </div>
              )}

              {currentSlide === 3 && (
                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ fontSize: '28px', marginBottom: '30px', color: '#a45040' }}>Ready to Select Your Sandstone?</h3>
                  <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#333', marginBottom: '25px' }}>
                    Browse our collection and find the perfect sandstone for your project. Our experts are here to help.
                  </p>
                  <div style={{ fontSize: '16px', color: '#555' }}>
                    {/* <p>📞 <strong>Call:</strong> +91-9256901351</p> */}
                    <p>📞 <strong>Call:</strong> +91-1234567890</p>
                    {/* <p>✉️ <strong>Email:</strong> infokmstonex@gmail.com</p> */}
                    <p>✉️ <strong>Email:</strong> demo@example.com</p>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '20px 30px',
              backgroundColor: '#f9f9f9',
              borderTop: '1px solid #eee'
            }}>
              <button
                onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
                disabled={currentSlide === 0}
                style={{
                  padding: '10px 20px',
                  backgroundColor: currentSlide === 0 ? '#ccc' : '#a45040',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: currentSlide === 0 ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: '600'
                }}
              >
                ← Previous
              </button>

              <div style={{ display: 'flex', gap: '8px' }}>
                {[0, 1, 2, 3].map((index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      border: 'none',
                      backgroundColor: currentSlide === index ? '#a45040' : '#ddd',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  />
                ))}
              </div>

              <button
                onClick={() => setCurrentSlide(Math.min(3, currentSlide + 1))}
                disabled={currentSlide === 3}
                style={{
                  padding: '10px 20px',
                  backgroundColor: currentSlide === 3 ? '#ccc' : '#a45040',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: currentSlide === 3 ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: '600'
                }}
              >
                Next →
              </button>
            </div>

            {/* Slide Counter */}
            <div style={{
              textAlign: 'center',
              padding: '10px',
              backgroundColor: '#f0f0f0',
              fontSize: '14px',
              color: '#666'
            }}>
              Slide {currentSlide + 1} of 4
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}