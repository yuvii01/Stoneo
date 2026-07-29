import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import '../../styles/pages.css';
import SEOHead from '../../components/SEOHead';
import StonePriceSlider from '../../components/StonePriceSlider';
import { getBreadcrumbSchema } from '../../utils/seo';
import { useDemand } from '../../context/DemandContext';
import { OTHER_NATURAL_STONES } from '../../utils/constants';
import { useDbProducts } from '../../utils/useDbProducts';
import ProductLoader from '../../components/ProductLoader';

const DEFAULT_DESCRIPTION = 'Exquisite natural stone sourced from verified quarries, engineered for architectural excellence.';
const DEFAULT_FEATURES = ['Authentic natural texture', 'Weather & frost resistant', 'High compressive strength', 'Low maintenance'];

const TOUCH_OPTIONS = ["Polished", "Honed", "Leather", "Tumbled", "Sandblasted", "Natural Cleft", "Bush Hammered", "Brushed"];
const TYPE_OPTIONS = ["Quartzite", "Limestone", "Slate Stone", "Basalt", "Kota Stone", "Travertine"];
const THICKNESS_RANGE = [16, 18, 20, 22, 24, 26, 28, 30];

// Prepare full product dataset with rich attributes
const ALL_PRODUCTS = OTHER_NATURAL_STONES.map((item, index) => {
  const numTouches = (index % 3) + 2;
  const touch = [];
  for (let i = 0; i < numTouches; i++) {
    touch.push(TOUCH_OPTIONS[(index + i) % TOUCH_OPTIONS.length]);
  }

  return {
    id: `other-stone-${index}`,
    name: item.name,
    image: item.image,
    category: item.category || 'Grey',
    type: item.type || TYPE_OPTIONS[index % TYPE_OPTIONS.length],
    price: 60 + ((index * 11) % 120),
    minPrice: Math.max(40, 60 + ((index * 11) % 120) - 30),
    maxPrice: Math.min(250, 60 + ((index * 11) % 120) + 30),
    touch,
    thickness: THICKNESS_RANGE,
    origin: 'India / Global Quarries',
    description: DEFAULT_DESCRIPTION,
    features: DEFAULT_FEATURES
  };
});

const MIN_PRICE = 40;
const MAX_PRICE = 100;

export default function OtherNaturalStones() {
  const productsList = useDbProducts('Other Natural Stones', ALL_PRODUCTS);
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

  const categoryFilter = searchParams.get('category') || 'All';

  const [filters, setFilters] = useState({
    type: [],
    color: [],
    touch: [],
    thickness: [],
    maxPrice: 100
  });

  useEffect(() => {
    const type = searchParams.get('type');
    const newType = [];
    const newColor = [];

    if (type === 'slate') newType.push('Slate Stone');
    if (type === 'quartzite') newType.push('Quartzite');
    if (type === 'limestone') newType.push('Limestone');
    if (type === 'travertine') newType.push('Travertine');
    if (type === 'grey') newColor.push('Grey');
    if (type === 'beige') newColor.push('Beige');

    setFilters(prev => {
      if (
        prev.type.length === newType.length &&
        prev.type.every((v, i) => v === newType[i]) &&
        prev.color.length === newColor.length &&
        prev.color.every((v, i) => v === newColor[i])
      ) {
        return prev;
      }
      return { ...prev, type: newType, color: newColor };
    });
  }, [searchParams]);

  const handleFilterChange = (category, value) => {
    setFilters(prev => {
      if (category === 'maxPrice') {
        return { ...prev, maxPrice: value };
      }
      const current = prev[category] || [];
      if (current.includes(value)) {
        return { ...prev, [category]: current.filter(item => item !== value) };
      } else {
        return { ...prev, [category]: [...current, value] };
      }
    });
  };

  const filteredProducts = useMemo(() => {
    return productsList.filter(p => {
      const matchesUrlCategory = categoryFilter === 'All' || (p.category && p.category.toLowerCase() === categoryFilter.toLowerCase());
      const matchesColor = (filters.color || []).length === 0 || (filters.color || []).includes(p.category);
      const matchesType = (filters.type || []).length === 0 || (filters.type || []).includes(p.type);
      const matchesTouch = (filters.touch || []).length === 0 || (filters.touch || []).some(t => p.touch && p.touch.includes(t));
      const selectedPrice = filters.maxPrice !== undefined ? filters.maxPrice : 100;
      const matchesPrice = (p.minPrice || p.price || 100) <= selectedPrice;

      return matchesUrlCategory && matchesColor && matchesType && matchesTouch && matchesPrice;
    });
  }, [categoryFilter, filters, productsList]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
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
        pageKey="other_natural_stones"
        title="Other Natural Stones - Quartzite, Limestone, Slate & Basalt | Stoneo"
        description="Explore Stoneo's collection of specialty natural stones including Quartzite, Limestone, Slate, Basalt, and Kota Stone for luxury architectural landscaping and interiors."
        structured={getBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Other Natural Stones', path: '/category/other-natural-stones' }
        ])}
      />
      <div className="page products-page">
        <section
          className="other-stones-header page-header"
          style={{
            backgroundImage: 'linear-gradient(rgba(15, 16, 19, 0.65), rgba(15, 16, 19, 0.75)), url("/granite_images/Fish%20Black%20Granite.webp")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="container container-heading">
            <h1>Our {categoryFilter !== 'All' ? categoryFilter : ''} Specialty Natural Stones</h1>
            <p>Discover Quartzite, Limestone, Slate Stone, Basalt, and Kota Stone for enduring architectural design</p>
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
                <h4>Stone Type</h4>
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
                    { name: 'Black', hex: '#000000' },
                    { name: 'Green', hex: '#2e8b57' },
                    { name: 'Brown', hex: '#8b4513' },
                    { name: 'Red', hex: '#b22222' },
                    { name: 'Yellow', hex: '#ffd700' },
                    { name: 'Multicolor', hex: 'linear-gradient(45deg, red, blue, green)' },
                    { name: 'Beige', hex: '#f5f5dc' },
                    { name: 'Grey', hex: '#808080' },
                    { name: 'Blue', hex: '#4169e1' },
                    { name: 'White', hex: '#ffffff' }
                  ].map(c => (
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
                <h4>Finish / Touch</h4>
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
              {(filters.type.length > 0 || filters.color.length > 0 || filters.touch.length > 0 || filters.maxPrice < dynamicMaxPrice || categoryFilter !== 'All') && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: '#555', marginRight: '8px' }}>Active Filters:</span>

                  {categoryFilter !== 'All' && (
                    <div style={{ padding: '4px 12px', background: '#f0f0f0', borderRadius: '16px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Category: {categoryFilter}
                      <span style={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={() => setSearchParams({ category: 'All' })}>×</span>
                    </div>
                  )}

                  {filters.type.map(org => (
                    <div key={org} style={{ padding: '4px 12px', background: '#f0f0f0', borderRadius: '16px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {org}
                      <span style={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={() => handleFilterChange('type', org)}>×</span>
                    </div>
                  ))}

                  {filters.color.map(c => (
                    <div key={c} style={{ padding: '4px 12px', background: '#f0f0f0', borderRadius: '16px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Color: {c}
                      <span style={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={() => handleFilterChange('color', c)}>×</span>
                    </div>
                  ))}

                  {filters.touch.map(tch => (
                    <div key={tch} style={{ padding: '4px 12px', background: '#f0f0f0', borderRadius: '16px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {tch}
                      <span style={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={() => handleFilterChange('touch', tch)}>×</span>
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
                      setFilters({ type: [], color: [], touch: [], maxPrice: 100 });
                      setSearchParams({});
                      navigate(window.location.pathname, { replace: true });
                    }}
                    style={{ background: 'none', border: 'none', color: '#b48e5d', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Clear All
                  </button>
                </div>
              )}

              <div className="products-grid">
                {productsList.loading ? (
                  <ProductLoader text="Loading products..." />
                ) : paginatedProducts.length === 0 ? (
                  <div style={{ textAlign: 'center', width: '100%', padding: '50px 0', color: '#777' }}>
                    No specialty stones found matching the selected filters.
                  </div>
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
                          {product.type}
                        </div>
                      </div>
                      <div className="product-info">
                        <h3>{product.name}</h3>
                        <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                          Type: {product.type} | Color: {product.category} | Thickness: {product.thickness[0]}-{product.thickness[product.thickness.length - 1]}mm
                        </p>
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

        {/* Specialty Stones Buying Guide - Slider */}
        <section className="guide-slider-section" style={{ backgroundColor: '#f9f8f6', padding: '60px 0' }}>
          <div className="container">
            <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '38px', color: '#111' }}>Specialty Natural Stones Buying Guide</h2>

            <div style={{
              maxWidth: '900px',
              margin: '0 auto',
              backgroundColor: 'white',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
              border: '1px solid #ece8e1'
            }}>
              {/* Slider Content */}
              <div style={{ padding: '60px 50px', minHeight: '420px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                {currentSlide === 0 && (
                  <div>
                    <h3 style={{ fontSize: '26px', marginBottom: '18px', color: '#b48e5d' }}>What are Specialty Natural Stones?</h3>
                    <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#333' }}>
                      Beyond granite and marble lies a prestigious spectrum of natural stones—including Quartzite, Limestone, Slate Stone, Basalt, and Kota Stone. Each stone brings distinct mineral formations, organic textures, and thermal properties tailored for luxury architectural landscaping, cladding, and interior flooring.
                    </p>
                  </div>
                )}

                {currentSlide === 1 && (
                  <div>
                    <h3 style={{ fontSize: '26px', marginBottom: '18px', color: '#b48e5d' }}>Quartzite & Basalt: Maximum Durability</h3>
                    <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#333' }}>
                      Natural Quartzite combines the sophisticated veining of marble with a hardness that exceeds granite, making it ideal for kitchen countertops and high-traffic statement areas. Basalt offers dense volcanic durability and deep charcoal tones, perfect for modern architectural facades and outdoor driveways.
                    </p>
                  </div>
                )}

                {currentSlide === 2 && (
                  <div>
                    <h3 style={{ fontSize: '26px', marginBottom: '18px', color: '#b48e5d' }}>Limestone & Kota Stone: Timeless Heritage</h3>
                    <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#333' }}>
                      Limestone and Kota Stone are renowned for their soothing organic hues, natural thermal insulation, and matte elegance. Whether installed in sunlit courtyards, pool surrounds, or interior living areas, they mature gracefully with an authentic patina over decades.
                    </p>
                  </div>
                )}

                {currentSlide === 3 && (
                  <div>
                    <h3 style={{ fontSize: '26px', marginBottom: '18px', color: '#b48e5d' }}>Slate & Travertine: Texture and Slip Resistance</h3>
                    <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#333' }}>
                      Slate stone features natural cleft textures that provide exceptional slip resistance for patios and walkways, while Travertine brings classic Mediterranean warmth with textured or honed finishes. Both materials offer unmatched visual depth and organic character.
                    </p>
                  </div>
                )}

                {/* Slider Controls */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '40px',
                  paddingTop: '20px',
                  borderTop: '1px solid #eee'
                }}>
                  <button
                    onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
                    disabled={currentSlide === 0}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: currentSlide === 0 ? '#ccc' : '#b48e5d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: currentSlide === 0 ? 'not-allowed' : 'pointer',
                      fontSize: '15px',
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
                          backgroundColor: currentSlide === index ? '#b48e5d' : '#ddd',
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
                      backgroundColor: currentSlide === 3 ? '#ccc' : '#b48e5d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: currentSlide === 3 ? 'not-allowed' : 'pointer',
                      fontSize: '15px',
                      fontWeight: '600'
                    }}
                  >
                    Next →
                  </button>
                </div>
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
