import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Quartz_products } from '../../utils/constants';
import '../../styles/pages.css';
import SEOHead from '../../components/SEOHead';
import StonePriceSlider from '../../components/StonePriceSlider';
import { getBreadcrumbSchema } from '../../utils/seo';
import { useDemand } from '../../context/DemandContext';
import ProductLoader from '../../components/ProductLoader';
import NoProductsFound from '../../components/NoProductsFound';
import { useDbProducts } from '../../utils/useDbProducts';
import FadeUp from '../../components/animations/FadeUp';
import StaggerGroup from '../../components/animations/StaggerGroup';

const DEFAULT_DESCRIPTION = 'Premium quality quartz, engineered for perfection.';
const DEFAULT_FEATURES = ['Scratch resistant', 'Stain resistant', 'Easy to maintain', 'Durable'];

const TOUCH_OPTIONS = ["Polished", "Honed (Matte)", "Leather", "Brushed"];
const THICKNESS_RANGE = [16, 18, 20, 22, 24, 26, 28, 30];
const TYPE_OPTIONS = ["Calacatta", "Sparkling", "Solid Color"];

const ALL_PRODUCTS = Quartz_products.map((item, index) => {
  let type = "Solid Color";
  if (item.name.toLowerCase().includes("calacatta")) type = "Calacatta";
  else if (item.name.toLowerCase().includes("sparkling")) type = "Sparkling";
  else if (index % 3 === 0) type = "Calacatta";
  else if (index % 3 === 1) type = "Sparkling";

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
    id: `quartz-${index}`,
    name: item.name,
    image: item.image,
    category: item.category || 'Quartz',
    type,
    color,
    touch,
    price: 60 + ((index * 13) % 180),
    minPrice: Math.max(50, 60 + ((index * 13) % 180) - 40),
    maxPrice: Math.min(300, 60 + ((index * 13) % 180) + 40),
    thickness: THICKNESS_RANGE,
    description: DEFAULT_DESCRIPTION,
    features: DEFAULT_FEATURES
  };
});

const EXTRACTED_COLORS = [...new Set(ALL_PRODUCTS.map(p => p.color))];
const MIN_PRICE = 50;
const MAX_PRICE = 100;

export default function Quartz() {
  const productsList = useDbProducts('Quartz', ALL_PRODUCTS);
  const dynamicMaxPrice = useMemo(() => {
    if (!productsList || productsList.length === 0) return 100;
    const maxVal = Math.max(...productsList.map(p => Number(p.maxPrice || p.price || 100)));
    return Math.max(100, Math.ceil(maxVal));
  }, [productsList]);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addDemand, removeDemand, demands } = useDemand();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(12);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [filters, setFilters] = useState({
    type: [],
    color: [],
    touch: [],
    thickness: [],
    maxPrice: undefined
  });

  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam === 'calacatta') {
      setFilters(prev => ({ ...prev, type: ['Calacatta'] }));
    } else if (typeParam === 'sparkling') {
      setFilters(prev => ({ ...prev, type: ['Sparkling'] }));
    } else if (typeParam === 'solid') {
      setFilters(prev => ({ ...prev, type: ['Solid Color'] }));
    } else {
      setFilters(prev => ({ ...prev, type: [] }));
    }
  }, [searchParams]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      if (filterType === 'maxPrice') {
        return { ...prev, maxPrice: value };
      }
      const current = prev[filterType] || [];
      if (current.includes(value)) {
        return { ...prev, [filterType]: current.filter(item => item !== value) };
      } else {
        return { ...prev, [filterType]: [...current, value] };
      }
    });
  };

  const filteredProducts = useMemo(() => {
    return productsList.filter(p => {
      const matchesType = (filters.type || []).length === 0 || (filters.type || []).some(t => {
        const pName = (p.name || '').toLowerCase();
        if (t === 'Calacatta') return pName.includes('calacatta') || p.type === 'Calacatta';
        if (t === 'Sparkling') return pName.includes('sparkling') || p.type === 'Sparkling';
        if (t === 'Solid Color') return (!pName.includes('calacatta') && !pName.includes('sparkling')) || p.type === 'Solid Color';
        return p.type === t;
      });
      const matchesColor = (filters.color || []).length === 0 || (filters.color || []).includes(p.color);
      const matchesTouch = (filters.touch || []).length === 0 || (filters.touch || []).some(t => p.touch && p.touch.includes(t));
      const selectedPrice = filters.maxPrice !== undefined ? filters.maxPrice : (dynamicMaxPrice || 100);
      const matchesPrice = (p.minPrice || p.price || 100) <= selectedPrice;

      return matchesType && matchesColor && matchesTouch && matchesPrice;
    });
  }, [filters, productsList, dynamicMaxPrice]);

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
        pageKey="quartz"
        structured={getBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Quartz', path: '/category/quartz' }
        ])}
      />
      <div className="page products-page">
        <section className="quartz-header page-header">
          <div className="container container-heading">
            <FadeUp>
              <h1>Our Quartz Collection</h1>
            </FadeUp>
            <FadeUp delay={0.2}>
              <p>Browse our premium selection of engineered quartz varieties</p>
            </FadeUp>
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
                <StonePriceSlider
                  minPrice={MIN_PRICE}
                  maxPrice={dynamicMaxPrice}
                  currentMaxPrice={filters.maxPrice}
                  onChange={(val) => handleFilterChange('maxPrice', val)}
                />
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
            </aside>

            {/* Products Area */}
            <div style={{ flex: 1 }}>
              {/* Active Filters Display */}
              {(filters.type.length > 0 || filters.color.length > 0 || filters.touch.length > 0 || filters.maxPrice < dynamicMaxPrice) && (
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

                  {(filters.maxPrice !== undefined && filters.maxPrice < dynamicMaxPrice) && (
                    <div style={{ padding: '4px 12px', background: '#f0f0f0', borderRadius: '16px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Up to ₹{filters.maxPrice}
                      <span style={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={() => handleFilterChange('maxPrice', dynamicMaxPrice)}>×</span>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setFilters({ type: [], color: [], touch: [], maxPrice: dynamicMaxPrice });
                      setSearchParams({});
                      navigate(window.location.pathname, { replace: true });
                    }}
                    style={{ background: 'none', border: 'none', color: 'var(--color-primary, #b48e5d)', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Clear All
                  </button>
                </div>
              )}

              <StaggerGroup className="products-grid" itemSelector=".product-card">
                {productsList.loading ? (
                  <ProductLoader text="Loading products..." />
                ) : paginatedProducts.length === 0 ? (
                  <NoProductsFound
                    title="No Quartz Varieties Found"
                    description="We couldn't find any quartz varieties matching your selected filters. Try clearing a filter or resetting all selections."
                    onReset={() => {
                      setFilters({ type: [], color: [], touch: [], maxPrice: dynamicMaxPrice });
                      setSearchParams({});
                      navigate(window.location.pathname, { replace: true });
                    }}
                  />
                ) : (
                  paginatedProducts.map((product) => (
                    <div
                      key={product.id}
                      className={`product-card ${selectedProduct?.id === product.id ? 'selected' : ''}`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/products/${encodeURIComponent(product.name || product.id || product._id)}`, { state: { product } })}
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
                            {demands.some(d => d.name === product.name) ? "Remove from Requirement" : "Add to Requirement"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </StaggerGroup>

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
                      backgroundColor: 'white',
                      color: currentPage === 1 ? '#bbb' : '#000',
                      border: currentPage === 1 ? '1px solid #ddd' : '1px solid #000',
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
                          border: currentPage === page ? '2px solid #000' : '1px solid #ddd',
                          backgroundColor: 'white',
                          color: '#000',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: currentPage === page ? '700' : '500',
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
                      backgroundColor: 'white',
                      color: currentPage === totalPages ? '#bbb' : '#000',
                      border: currentPage === totalPages ? '1px solid #ddd' : '1px solid #000',
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

              {filteredProducts.length > 0 && (
                <div style={{
                  textAlign: 'center',
                  padding: '15px',
                  fontSize: '14px',
                  color: '#666'
                }}>
                  Page {currentPage} of {totalPages} • Showing {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Quartz Buying Guide - Slider */}
        <section className="guide-slider-section" style={{ backgroundColor: '#f9f9f9', padding: '60px 0' }}>
          <div className="container">
            <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '40px' }}>Quartz Buying Guide</h2>

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
                    <h3 style={{ fontSize: '28px', marginBottom: '20px', color: '#a45040' }}>What is Quartz?</h3>
                    <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#333' }}>
                      Quartz is an engineered stone made from natural quartz crystals mixed with resins and pigments. It provides a non-porous surface that is highly resistant to staining and scratching.
                    </p>
                  </div>
                )}

                {currentSlide === 1 && (
                  <div>
                    <h3 style={{ fontSize: '28px', marginBottom: '20px', color: '#a45040' }}>Why Choose Quartz?</h3>
                    <div style={{ fontSize: '16px', lineHeight: '1.9', color: '#333' }}>
                      <p><strong>🛡️ Durability:</strong> Highly resistant to scratches and impact.</p>
                      <p><strong>🧼 Low Maintenance:</strong> Non-porous surface never needs sealing.</p>
                      <p><strong>🎨 Consistency:</strong> Uniform patterns and colors throughout the slab.</p>
                      <p><strong>🦠 Hygienic:</strong> Non-porous nature makes it resistant to bacteria and mold.</p>
                    </div>
                  </div>
                )}

                {currentSlide === 2 && (
                  <div>
                    <h3 style={{ fontSize: '28px', marginBottom: '20px', color: '#a45040' }}>Care & Maintenance</h3>
                    <div style={{ fontSize: '16px', lineHeight: '1.9', color: '#333' }}>
                      <p><strong>🧽 Daily Cleaning:</strong> Use mild soap and water.</p>
                      <p><strong>🔥 Heat Warning:</strong> Use trivets under hot pans to prevent resin discoloration.</p>
                      <p><strong>🚫 Avoid Harsh Chemicals:</strong> Do not use abrasive cleaners or bleach.</p>
                    </div>
                  </div>
                )}

                {currentSlide === 3 && (
                  <div style={{ textAlign: 'center' }}>
                    <h3 style={{ fontSize: '28px', marginBottom: '30px', color: '#a45040' }}>Ready to Choose Your Quartz?</h3>
                    <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#333', marginBottom: '25px' }}>
                      Our engineered quartz offers unmatched consistency and ease of use. Our experts are ready to help you find the perfect match.
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
