import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom'; // Required for URL filtering
import '../../styles/pages.css';
import SEOHead from '../../components/SEOHead';
import { getProductSchema, getBreadcrumbSchema } from '../../utils/seo';
import { useDemand } from '../../context/DemandContext';
import PAVING_PRODUCTS from '../../utils/paving_landscape.json';

// 1. Updated Data with Category Column




// Merge Data

const THICKNESS_RANGE = ['10mm', '16mm', '20mm', '30mm', '40mm', '50mm', '60mm'];
const COLOR_OPTIONS = ['Red', 'Brown', 'Black', 'Grey', 'Blue', 'Green', 'Ivory', 'Noce', 'White', 'Yellow', 'Mixed'];

const ALL_PRODUCTS = PAVING_PRODUCTS.map((csvItem, index) => {
  const nameLower = csvItem.name.toLowerCase();

  let color = 'Grey'; // default
  for (let c of COLOR_OPTIONS) {
    if (nameLower.includes(c.toLowerCase())) {
      color = c;
      break;
    }
  }

  const thickness = [];
  const numThickness = (index % 3) + 2;
  for (let i = 0; i < numThickness; i++) {
    thickness.push(THICKNESS_RANGE[(index + i) % THICKNESS_RANGE.length]);
  }

  return {
    id: `paving-${index}`,
    name: csvItem.name,
    image: csvItem.image,
    category: csvItem.category || 'Stones',
    description: 'High-quality paving and landscape stones for outdoor elegance.',
    features: ['Durable', 'Weather Resistant', 'Non-slip Surface', 'Easy Installation'],
    color: color,
    price: 30 + ((index * 13) % 150),
    thickness: thickness
  };
});


export default function PavingAndLandscape() {
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

  const categoryFilter = searchParams.get('category') || 'All';

  const [filters, setFilters] = useState({
    category: [],
    color: [],
    thickness: [],
    origin: [],
    touch: []
  });

  useEffect(() => {
    const type = searchParams.get('type');
    let origins = [];
    if (type === 'cobbles-granite') {
      origins = ['Granite Cobbles'];
    } else if (type === 'cobbles-sandstone') {
      origins = ['Sandstone Cobbles'];
    } else if (type === 'cobbles-limestone') {
      origins = ['Limestone Cobbles'];
    } else if (type === 'cobbles') {
      origins = ['Granite Cobbles', 'Sandstone Cobbles', 'Limestone Cobbles'];
    } else if (type === 'pavers-brick') {
      origins = ['Bricks'];
    } else if (type === 'pavers-sandstone') {
      origins = ['Sandstone'];
    } else if (type === 'pavers-travertine') {
      origins = ['Travertino'];
    } else if (type === 'pavers') {
      origins = ['Bricks', 'Sandstone', 'Travertino'];
    } else if (type === 'stones-pebbles') {
      origins = ['landscaping pebbles'];
    } else if (type === 'stones-stepping') {
      origins = ['Stepping stones'];
    } else if (type === 'stones') {
      origins = ['landscaping pebbles', 'Stepping stones'];
    }
    if (type) {
      setFilters(prev => ({ ...prev, origin: origins }));
    }
  }, [searchParams]);

  const handleFilterChange = (category, value) => {
    setFilters(prev => {
      const current = prev[category] || [];
      if (current.includes(value)) {
        return { ...prev, [category]: current.filter(item => item !== value) };
      } else {
        return { ...prev, [category]: [...current, value] };
      }
    });
  };

  // 3. Filtered List Logic
  const filteredProducts = useMemo(() => {
    return ALL_PRODUCTS.filter(p => {
      const matchesUrlCategory = categoryFilter === 'All' || p.category.toLowerCase() === categoryFilter.toLowerCase();
      const matchesType = filters.category.length === 0 || filters.category.includes(p.category);

      const matchesOrigin = filters.origin.length === 0 || filters.origin.some(o => {
        const nameMatch = p.name.toLowerCase();
        if (o === 'Granite Cobbles') return nameMatch.includes('granite') && p.category === 'Cobbles';
        if (o === 'Sandstone Cobbles') return nameMatch.includes('sandstone') && p.category === 'Cobbles';
        if (o === 'Limestone Cobbles') return (nameMatch.includes('lime') || nameMatch.includes('kota') || nameMatch.includes('tandur') || nameMatch.includes('kadappa')) && p.category === 'Cobbles';
        if (o === 'Bricks') return nameMatch.includes('brick');
        if (o === 'Sandstone') return nameMatch.includes('sandstone') && p.category === 'Pavers';
        if (o === 'Travertino') return nameMatch.includes('travertine');
        if (o === 'landscaping pebbles') return nameMatch.includes('pebble');
        if (o === 'Stepping stones') return nameMatch.includes('step') || nameMatch.includes('stepping');
        return false;
      });

      const matchesColor = filters.color.length === 0 || filters.color.includes(p.color);
      const matchesThickness = filters.thickness.length === 0 || filters.thickness.some(th => p.thickness.some(t => parseInt(t) === th));
      const matchesTouch = filters.touch.length === 0 || (p.touch && filters.touch.some(tch => p.touch.includes(tch)));

      return matchesUrlCategory && matchesType && matchesOrigin && matchesColor && matchesThickness && matchesTouch;
    });
  }, [categoryFilter, filters]);

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

  // Sync selected product when filter changes and reset page to 1
  useEffect(() => {
    if (filteredProducts.length > 0) {
      setSelectedProduct(filteredProducts[0]);
      setCurrentPage(1);
    }
  }, [filteredProducts]);

  return (
    <>
      <SEOHead
        pageKey="paving-landscape"
        structured={getBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Paving & Landscape', path: '/category/paving-landscape' }
        ])}
      />
      <div className="page products-page">
        <section className="paving-header page-header">
          <div className="container container-heading">
            <h1>Our Paving & Landscape Collections</h1>
            <p>Premium selection of cobbles, pavers, and landscaping stones.</p>
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
                <h4>Origin</h4>

                <h5 style={{ fontSize: '14px', margin: '10px 0', color: '#555' }}>Cobbles</h5>
                <div className="filter-checkbox-group" style={{ marginBottom: '15px' }}>
                  {['Granite Cobbles', 'Sandstone Cobbles', 'Limestone Cobbles'].map(org => (
                    <label key={org} className="filter-checkbox-label">
                      <input
                        type="checkbox"
                        checked={filters.origin.includes(org)}
                        onChange={() => handleFilterChange('origin', org)}
                      />
                      {org}
                    </label>
                  ))}
                </div>

                <h5 style={{ fontSize: '14px', margin: '10px 0', color: '#555' }}>Pavers</h5>
                <div className="filter-checkbox-group">
                  {['Bricks', 'Sandstone', 'Travertino'].map(org => (
                    <label key={org} className="filter-checkbox-label">
                      <input
                        type="checkbox"
                        checked={filters.origin.includes(org)}
                        onChange={() => handleFilterChange('origin', org)}
                      />
                      {org}
                    </label>
                  ))}
                </div>

                <h5 style={{ fontSize: '14px', margin: '10px 0', color: '#555' }}>Stones</h5>
                <div className="filter-checkbox-group" style={{ marginBottom: '15px' }}>
                  {['landscaping pebbles', 'Stepping stones'].map(org => (
                    <label key={org} className="filter-checkbox-label">
                      <input
                        type="checkbox"
                        checked={filters.origin.includes(org)}
                        onChange={() => handleFilterChange('origin', org)}
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
                    { name: 'Green', hex: '#2e8b57' },
                    { name: 'Pink', hex: '#ffc0cb' },
                    { name: 'Brown', hex: '#8b4513' },
                    { name: 'Grey', hex: '#808080' },
                    { name: 'Yellow', hex: '#ffd700' },
                    { name: 'Beige', hex: '#f5f5dc' },
                    { name: 'Red', hex: '#ff0000' },
                    { name: 'Blue', hex: '#0000ff' }
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
                <h4>Touch</h4>
                <div className="filter-checkbox-group">
                  {["Polished", "Honed", "Leather", "Brushed", "Bush Hammered", "Sandblasted"].map(tch => (
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
                  {[16, 18, 20, 22, 24, 26, 28, 30].map(th => (
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
              {(filters.category.length > 0 || filters.origin.length > 0 || filters.touch.length > 0 || filters.color.length > 0 || filters.thickness.length > 0 || categoryFilter !== 'All') && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: '#555', marginRight: '8px' }}>Active Filters:</span>

                  {categoryFilter !== 'All' && (
                    <div style={{ padding: '4px 12px', background: '#f0f0f0', borderRadius: '16px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Category: {categoryFilter}
                      <span style={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={() => setSearchParams({ category: 'All' })}>×</span>
                    </div>
                  )}



                  {filters.origin.map(org => (
                    <div key={org} style={{ padding: '4px 12px', background: '#f0f0f0', borderRadius: '16px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {org}
                      <span style={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={() => handleFilterChange('origin', org)}>×</span>
                    </div>
                  ))}

                  {filters.touch.map(tch => (
                    <div key={tch} style={{ padding: '4px 12px', background: '#f0f0f0', borderRadius: '16px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {tch}
                      <span style={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={() => handleFilterChange('touch', tch)}>×</span>
                    </div>
                  ))}

                  {filters.color.map(c => (
                    <div key={c} style={{ padding: '4px 12px', background: '#f0f0f0', borderRadius: '16px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Color: {c}
                      <span style={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={() => handleFilterChange('color', c)}>×</span>
                    </div>
                  ))}

                  {filters.thickness.map(th => (
                    <div key={th} style={{ padding: '4px 12px', background: '#f0f0f0', borderRadius: '16px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {th}mm
                      <span style={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={() => handleFilterChange('thickness', th)}>×</span>
                    </div>
                  ))}

                  <button
                    onClick={() => {
                      setFilters({ category: [], origin: [], color: [], touch: [], thickness: [] });
                      setSearchParams({});
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
                        <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                          Origin: {product.origin} | Thickness: {product.thickness[0]}-{product.thickness[product.thickness.length - 1]}mm
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

        {/* Paving & Landscape Buying Guide - Slider */}
        <section className="guide-slider-section" style={{ backgroundImage: 'url("https://www.regattagranitesindia.com/wp-content/uploads/2026/04/Stream-White-Swatch.webp")', padding: '60px 0' }}>
          <div className="container">
            <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '40px' }}>Paving & Landscape Buying Guide</h2>

            <div style={{
              maxWidth: '900px',
              margin: '0 auto',
              backgroundColor: 'white',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
              {/* Slider Content */}
              <div style={{ padding: '60px 50px', minHeight: '500px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                {currentSlide === 0 && (
                  <div>
                    <h3 style={{ fontSize: '28px', marginBottom: '20px', color: '#a45040' }}>What are Paving & Landscape Stones?</h3>
                    <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#333' }}>
                      Paving and landscape stones, including cobbles, pavers, and stepping stones, are durable natural materials used to enhance outdoor spaces. They offer exceptional strength to withstand heavy foot and vehicle traffic, weather resistance for outdoor environments, and come in various textures like flamed or natural split for slip resistance. Perfect for driveways, patios, walkways, and garden edging.
                    </p>
                  </div>
                )}

                {currentSlide === 1 && (
                  <div>
                    <h3 style={{ fontSize: '28px', marginBottom: '20px', color: '#a45040' }}>Selection & Planning</h3>
                    <div style={{ fontSize: '16px', lineHeight: '1.9', color: '#333' }}>
                      <p><strong>📐 Assess the Space:</strong> Consider the size of the area and the intended use (e.g., heavy vehicle traffic requires thicker cobbles/pavers).</p>
                      <p><strong>🎨 Choose the Right Material:</strong> Granite cobbles offer unmatched durability, while sandstone and limestone provide natural, rustic charm.</p>
                      <p><strong>🦶 Safety First:</strong> Always prioritize slip-resistant finishes (like flamed, bush-hammered, or natural split) for outdoor and pool areas.</p>
                      <p><strong>💧 Drainage Considerations:</strong> Plan for proper water runoff. Permeable paving layouts allow water to seep through joints.</p>
                    </div>
                  </div>
                )}

                {currentSlide === 2 && (
                  <div>
                    <h3 style={{ fontSize: '28px', marginBottom: '20px', color: '#a45040' }}>Installation & Maintenance</h3>
                    <div style={{ fontSize: '16px', lineHeight: '1.9', color: '#333' }}>
                      <p><strong>🏗️ Base Preparation:</strong> A solid compacted sub-base is crucial to prevent sinking and shifting over time.</p>
                      <p><strong>🧱 Joint Sand & Grout:</strong> Use polymeric sand for joints to lock pavers in place and prevent weed growth.</p>
                      <p><strong>🛡️ Sealing:</strong> Consider applying a breathable stone sealer to protect against stains, oil spills, and weathering.</p>
                      <p><strong>🧹 Easy Upkeep:</strong> Regular sweeping and occasional pressure washing will keep your landscape stones looking pristine for decades.</p>
                    </div>
                  </div>
                )}

                {currentSlide === 3 && (
                  <div style={{ textAlign: 'center' }}>
                    <h3 style={{ fontSize: '28px', marginBottom: '30px', color: '#a45040' }}>Ready to Transform Your Outdoors?</h3>
                    <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#333', marginBottom: '25px' }}>
                      With the right selection and proper installation, natural paving stones will elevate your landscape and last a lifetime. Our experts are ready to assist you.
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