import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom'; // Required for URL filtering
import { GRANITE_TYPES, CSV_PRODUCTS } from '../utils/constants';

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
    price: csvItem.price,
    category: csvItem.category || 'Luxury', // Fallback
    description: existing ? existing.description : DEFAULT_DESCRIPTION,
    features: existing ? existing.features : DEFAULT_FEATURES,
  };
});

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // 2. Get category from URL (e.g. ?category=Black)
  const categoryFilter = searchParams.get('category') || 'All';

  // 3. Filtered List Logic
  const filteredProducts = useMemo(() => {
    if (categoryFilter === 'All') return ALL_PRODUCTS;
    return ALL_PRODUCTS.filter(p => p.category.toLowerCase() === categoryFilter.toLowerCase());
  }, [categoryFilter]);

  const [selectedProduct, setSelectedProduct] = useState(filteredProducts[0] || ALL_PRODUCTS[0]);

  // Sync selected product when filter changes
  useEffect(() => {
    if (filteredProducts.length > 0) {
      setSelectedProduct(filteredProducts[0]);
    }
  }, [filteredProducts]);

  return (
    <div className="page products-page">
      <section className="page-header">
        <div className="container">
          <h1>Our {categoryFilter !== 'All' ? categoryFilter : ''} Granite Collections</h1>
          <p>Browse our premium selection of {categoryFilter.toLowerCase()} imported varieties</p>
        </div>
      </section>

      {/* Category Tabs (Optional but good for UX) */}
      <section className="filter-bar">
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginBottom: '40px' }}>
          {['All', 'Black', 'White', 'Blue', 'Gold', 'Green', 'Brown', 'Red'].map(cat => (
            <button 
              key={cat}
              className={`filter-btn ${categoryFilter === cat ? 'active' : ''}`}
              onClick={() => setSearchParams({ category: cat })}
              style={{
                padding: '8px 20px',
                borderRadius: '20px',
                border: '1px solid #ddd',
                background: categoryFilter === cat ? '#a45040' : 'white',
                color: categoryFilter === cat ? 'white' : '#333',
                cursor: 'pointer'
              }}
            >
              {cat}
            </button>
          ))}
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Granite Guide */}
      <section className="granite-guide">
        <div className="container">
          <h2>Granite Buying Guide</h2>
          <div className="guide-grid">
            <div className="guide-card">
              <h3>🏠 For Home Projects</h3>
              <p>Ideal granite types for kitchens, bathrooms, and living spaces. Durable and easy to maintain.</p>
              <ul>
                <li>Indian Black Granite</li>
                <li>Kashmir White Granite</li>
                <li>Green Granite</li>
              </ul>
            </div>
            <div className="guide-card">
              <h3>🏢 For Commercial Use</h3>
              <p>Heavy-duty granite suitable for high-traffic commercial areas and office buildings.</p>
              <ul>
                <li>Multicolor Granite</li>
                <li>Red Granite</li>
                <li>Indian Black Granite</li>
              </ul>
            </div>
            <div className="guide-card">
              <h3>✨ Premium Selection</h3>
              <p>Our finest collections for luxury projects and statement designs.</p>
              <ul>
                <li>Pink Granite</li>
                <li>Multicolor Granite</li>
                <li>Kashmir White Granite</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="container">
          <h2>Why Choose Our Granite?</h2>
          <div className="benefits-grid">
            <div className="benefit-item">
              <div className="benefit-icon">💎</div>
              <h4>Premium Quality</h4>
              <p>Sourced directly from verified quarries</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">🔧</div>
              <h4>Professional Installation</h4>
              <p>Expert installation with proper sealing</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">⏱️</div>
              <h4>Quick Turnaround</h4>
              <p>Fast processing and delivery</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">🛡️</div>
              <h4>Guaranteed Quality</h4>
              <p>1-year warranty on installation</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}