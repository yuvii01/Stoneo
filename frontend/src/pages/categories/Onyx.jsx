import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Onyx_products } from '../../utils/constants';
import '../../styles/pages.css';
import SEOHead from '../../components/SEOHead';
import { getBreadcrumbSchema } from '../../utils/seo';
import { useDemand } from '../../context/DemandContext';

const DEFAULT_DESCRIPTION = 'Premium quality onyx, engineered for perfection.';
const DEFAULT_FEATURES = ['Scratch resistant', 'Stain resistant', 'Easy to maintain', 'Durable'];

const TOUCH_OPTIONS = ["Polished", "Honed (Matte)", "Leather", "Brushed"];
const THICKNESS_RANGE = [16, 18, 20, 22, 24, 26, 28, 30];
const TYPE_OPTIONS = ["Exotic", "White", "Solid Color"];

const ALL_PRODUCTS = Onyx_products.map((item, index) => {
  let type = "Solid Color";
  if (item.name.toLowerCase().includes("exotic")) type = "Exotic";
  else if (item.name.toLowerCase().includes("white")) type = "White";
  else if (index % 3 === 0) type = "Exotic";
  else if (index % 3 === 1) type = "White";

  let color = "White";
  const lowerName = item.name.toLowerCase();
  if (lowerName.includes("black")) color = "Black";
  else if (lowerName.includes("grey")) color = "Grey";
  else if (lowerName.includes("beige") || lowerName.includes("tan")) color = "Beige";
  else if (lowerName.includes("brown") || lowerName.includes("mocha")) color = "Brown";
  else if (lowerName.includes("red")) color = "Red";
  else if (lowerName.includes("blue")) color = "Blue";
  else if (lowerName.includes("green")) color = "Green";
  else if (lowerName.includes("yellow") || lowerName.includes("gold")) color = "Yellow";

  const numTouches = (index % 3) + 2;
  const touch = [];
  for (let i = 0; i < numTouches; i++) {
    touch.push(TOUCH_OPTIONS[(index + i) % TOUCH_OPTIONS.length]);
  }

  return {
    id: `onyx-${index}`,
    name: item.name,
    image: item.image,
    category: item.category || 'Onyx',
    type,
    color,
    touch,
    thickness: THICKNESS_RANGE,
    description: DEFAULT_DESCRIPTION,
    features: DEFAULT_FEATURES
  };
});

const EXTRACTED_COLORS = [...new Set(ALL_PRODUCTS.map(p => p.color))];

export default function Onyx() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addDemand, removeDemand, demands } = useDemand();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(window.innerWidth <= 768 ? 8 : 20);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth <= 768 ? 8 : 20);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [filters, setFilters] = useState({
    type: [],
    color: [],
    touch: [],
    thickness: []
  });

  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam === 'exotic') {
      setFilters(prev => ({ ...prev, type: ['Exotic'] }));
    } else if (typeParam === 'white') {
      setFilters(prev => ({ ...prev, type: ['White'] }));
    } else if (typeParam === 'solid') {
      setFilters(prev => ({ ...prev, type: ['Solid Color'] }));
    }
  }, [searchParams]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      const current = prev[filterType];
      if (current.includes(value)) {
        return { ...prev, [filterType]: current.filter(item => item !== value) };
      } else {
        return { ...prev, [filterType]: [...current, value] };
      }
    });
  };

  const filteredProducts = useMemo(() => {
    return ALL_PRODUCTS.filter(p => {
      const matchesType = filters.type.length === 0 || filters.type.includes(p.type);
      const matchesColor = filters.color.length === 0 || filters.color.includes(p.color);
      const matchesTouch = filters.touch.length === 0 || filters.touch.some(t => p.touch.includes(t));
      const matchesThickness = filters.thickness.length === 0 || filters.thickness.some(th => p.thickness.includes(th));

      return matchesType && matchesColor && matchesTouch && matchesThickness;
    });
  }, [filters]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
  };

  const [selectedProduct, setSelectedProduct] = useState(filteredProducts[0] || ALL_PRODUCTS[0]);

  useEffect(() => {
    if (filteredProducts.length > 0) {
      setSelectedProduct(filteredProducts[0]);
      setCurrentPage(1);
    }
  }, [filteredProducts]);

  return (
    <>
      <SEOHead
        pageKey="onyx"
        structured={getBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Onyx', path: '/category/onyx' }
        ])}
      />
      <div className="page products-page">
        <section className="onyx-header page-header">
          <div className="container container-heading">
            <h1>Our Onyx Collections</h1>
            <p>Browse our premium selection of engineered onyx varieties</p>
          </div>
        </section>

        <section className="products-section" style={{ paddingTop: '40px' }}>
          <div className="container category-layout-container">
            {/* Mobile Filter Toggle */}
            <button
              className="filter-mobile-toggle"
              onClick={() => {
                const sidebar = document.querySelector('.filter-sidebar');
                if (sidebar) sidebar.classList.toggle('open');
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="21" x2="4" y2="14"></line>
                <line x1="4" y1="10" x2="4" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12" y2="3"></line>
                <line x1="20" y1="21" x2="20" y2="16"></line>
                <line x1="20" y1="12" x2="20" y2="3"></line>
                <line x1="1" y1="14" x2="7" y2="14"></line>
                <line x1="9" y1="8" x2="15" y2="8"></line>
                <line x1="17" y1="16" x2="23" y2="16"></line>
              </svg>
              View Filters
            </button>

            {/* Sidebar Filters */}
            <aside className="filter-sidebar">
              <div className="sidebar-mobile-header">
                <h3>Filters</h3>
                <button
                  className="close-sidebar-btn"
                  onClick={() => {
                    const sidebar = document.querySelector('.filter-sidebar');
                    if (sidebar) sidebar.classList.remove('open');
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <div className="filter-section">
                <h4>Type</h4>
                <div className="filter-checkbox-group">
                  {TYPE_OPTIONS.map(org => (
                    <label key={org} className="filter-checkbox-label">
                      <input
                        type="checkbox"
                        checked={filters.type.includes(org)}
                        onChange={() => handleFilterChange('type', org)}
                      />
                      {org}
                    </label>
                  ))}
                </div>
              </div>

              <div className="filter-section">
                <h4>Color</h4>
                <div className="color-swatches">
                  {[
                    { name: 'White', hex: '#ffffff' },
                    { name: 'Black', hex: '#000000' },
                    { name: 'Grey', hex: '#808080' },
                    { name: 'Beige', hex: '#f5f5dc' },
                    { name: 'Brown', hex: '#8b4513' },
                    { name: 'Red', hex: '#b22222' },
                    { name: 'Blue', hex: '#3a5a9c' },
                    { name: 'Green', hex: '#2e8b57' },
                    { name: 'Yellow', hex: '#ffd700' }
                  ].filter(c => EXTRACTED_COLORS.includes(c.name)).map(c => (
                    <div
                      key={c.name}
                      className={`color-swatch-wrapper ${filters.color.includes(c.name) ? 'active' : ''}`}
                      onClick={() => handleFilterChange('color', c.name)}
                    >
                      <div className="color-swatch" style={{ background: c.hex }}></div>
                      <span className="color-swatch-label">{c.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="filter-section">
                <h4>Touch</h4>
                <div className="filter-checkbox-group">
                  {TOUCH_OPTIONS.map(tch => (
                    <label key={tch} className="filter-checkbox-label">
                      <input
                        type="checkbox"
                        checked={filters.touch.includes(tch)}
                        onChange={() => handleFilterChange('touch', tch)}
                      />
                      {tch}
                    </label>
                  ))}
                </div>
              </div>

              <div className="filter-section">
                <h4>Thickness</h4>
                <div className="filter-checkbox-group">
                  {THICKNESS_RANGE.map(th => (
                    <label key={th} className="filter-checkbox-label">
                      <input
                        type="checkbox"
                        checked={filters.thickness.includes(th)}
                        onChange={() => handleFilterChange('thickness', th)}
                      />
                      {th} mm
                    </label>
                  ))}
                </div>
              </div>
            </aside>

            {/* Products Area */}
            <div style={{ flex: 1 }}>
              {/* Active Filters Display */}
              {(filters.type.length > 0 || filters.color.length > 0 || filters.touch.length > 0 || filters.thickness.length > 0) && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: '#555', marginRight: '8px' }}>Active Filters:</span>

                  {filters.type.map(val => (
                    <div key={val} style={{ padding: '4px 12px', background: '#f0f0f0', borderRadius: '16px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {val}
                      <span style={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={() => handleFilterChange('type', val)}>×</span>
                    </div>
                  ))}

                  {filters.color.map(val => (
                    <div key={val} style={{ padding: '4px 12px', background: '#f0f0f0', borderRadius: '16px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Color: {val}
                      <span style={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={() => handleFilterChange('color', val)}>×</span>
                    </div>
                  ))}

                  {filters.touch.map(val => (
                    <div key={val} style={{ padding: '4px 12px', background: '#f0f0f0', borderRadius: '16px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {val}
                      <span style={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={() => handleFilterChange('touch', val)}>×</span>
                    </div>
                  ))}

                  {filters.thickness.map(val => (
                    <div key={val} style={{ padding: '4px 12px', background: '#f0f0f0', borderRadius: '16px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {val}mm
                      <span style={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={() => handleFilterChange('thickness', val)}>×</span>
                    </div>
                  ))}

                  <button
                    onClick={() => {
                      setFilters({ type: [], color: [], touch: [], thickness: [] });
                    }}
                    style={{ background: 'none', border: 'none', color: 'var(--color-primary, #b48e5d)', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Clear All
                  </button>
                </div>
              )}

              <div className="products-grid">
                {paginatedProducts.length === 0 ? (
                  <div style={{ textAlign: 'center', width: '100%', padding: '50px 0', color: '#777' }}>
                    No products found matching the selected filters.
                  </div>
                ) : (
                  paginatedProducts.map((product) => (
                    <div
                      key={product.id}
                      className={`product-card ${selectedProduct?.id === product.id ? 'selected' : ''}`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/products/${product.id}`, { state: { product } })}
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

                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <button
                            className="get-quote-btn"
                            style={demands.some(d => d.name === product.name) ? { backgroundColor: '#d9534f', color: 'white' } : {}}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (demands.some(d => d.name === product.name)) {
                                removeDemand(product.name);
                              } else {
                                addDemand(product);
                              }
                            }}
                          >
                            {demands.some(d => d.name === product.name) ? "Remove from Quote" : "Add to Quote"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pagination Controls */}
              {filteredProducts.length > itemsPerPage && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '10px',
                  marginTop: '40px',
                  padding: '20px',
                  flexWrap: 'wrap'
                }}>
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    style={{
                      padding: '10px 16px',
                      backgroundColor: currentPage === 1 ? '#ccc' : '#a45040',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  >
                    ← Previous
                  </button>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        style={{
                          width: '40px',
                          height: '40px',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: currentPage === page ? '2px solid #a45040' : '1px solid #ddd',
                          backgroundColor: currentPage === page ? '#a45040' : 'white',
                          color: currentPage === page ? 'white' : '#333',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '600',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    style={{
                      padding: '10px 16px',
                      backgroundColor: currentPage === totalPages ? '#ccc' : '#a45040',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  >
                    Next →
                  </button>
                </div>
              )}

              <div style={{
                textAlign: 'center',
                padding: '15px',
                fontSize: '14px',
                color: '#666'
              }}>
                Page {currentPage} of {totalPages} • Showing {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
              </div>
            </div>
          </div>
        </section>

        {/* Onyx Buying Guide - Slider */}
        <section className="guide-slider-section" style={{ backgroundColor: '#f9f9f9', padding: '60px 0' }}>
          <div className="container">
            <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '40px' }}>Onyx Buying Guide</h2>

            <div style={{
              maxWidth: '900px',
              margin: '0 auto',
              backgroundColor: 'white',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
              {/* Slider Content */}
              <div style={{ padding: '60px 50px', minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                {currentSlide === 0 && (
                  <div>
                    <h3 style={{ fontSize: '28px', marginBottom: '20px', color: '#a45040' }}>What is Onyx?</h3>
                    <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#333' }}>
                      Onyx is an exotic natural stone known for its translucent properties and rich, dramatic patterns. It provides a stunning, luminous surface that elevates any luxury interior.
                    </p>
                  </div>
                )}

                {currentSlide === 1 && (
                  <div>
                    <h3 style={{ fontSize: '28px', marginBottom: '20px', color: '#a45040' }}>Why Choose Onyx?</h3>
                    <div style={{ fontSize: '16px', lineHeight: '1.9', color: '#333' }}>
                      <p><strong>✨ Aesthetics:</strong> Highly dramatic veining and vibrant colors.</p>
                      <p><strong>💡 Translucency:</strong> Can be backlit for stunning visual effects.</p>
                      <p><strong>💎 Exclusivity:</strong> Rare and luxurious natural stone.</p>
                      <p><strong>🎨 Uniqueness:</strong> Every slab is completely unique.</p>
                    </div>
                  </div>
                )}

                {currentSlide === 2 && (
                  <div>
                    <h3 style={{ fontSize: '28px', marginBottom: '20px', color: '#a45040' }}>Care & Maintenance</h3>
                    <div style={{ fontSize: '16px', lineHeight: '1.9', color: '#333' }}>
                      <p><strong>🧽 Daily Cleaning:</strong> Use only mild soap and water.</p>
                      <p><strong>🔥 Heat Warning:</strong> Use trivets under hot pans to prevent damage.</p>
                      <p><strong>🚫 Avoid Harsh Chemicals:</strong> Do not use acidic or abrasive cleaners.</p>
                    </div>
                  </div>
                )}

                {currentSlide === 3 && (
                  <div style={{ textAlign: 'center' }}>
                    <h3 style={{ fontSize: '28px', marginBottom: '30px', color: '#a45040' }}>Ready to Choose Your Onyx?</h3>
                    <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#333', marginBottom: '25px' }}>
                      Our exclusive onyx collection offers unparalleled luxury and beauty. Our experts are ready to help you find the perfect match.
                    </p>
                    <div style={{ fontSize: '16px', color: '#555' }}>
                      <p>📞 <strong>Call:</strong> +91-1234567890</p>
                      <p>✉️ <strong>Email:</strong> demo@example.com</p>
                      <p>💬 <strong>WhatsApp:</strong> +91-1234567890</p>
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
