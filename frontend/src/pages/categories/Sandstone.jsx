import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom'; // Required for URL filtering

import '../../styles/pages.css';
import SEOHead from '../../components/SEOHead';
import { getProductSchema, getBreadcrumbSchema } from '../../utils/seo';
import { useDemand } from '../../context/DemandContext';

// 1. Updated Data with Category Column
const CSV_PRODUCTS = [
  { "name": "Agra Red Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/agra-red/agra-red-sawn-wet-sandstone-tiles.jpg", "category": "Red" },
  { "name": "Autumn Brown Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/autumn-brown/automn-brown-sandstone-honed-surface-cut-to-size-tiles.jpg", "category": "Brown" },
  { "name": "Bansi Pink Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/bansi-pink/bansi-pink-sandstone-honed-finish-tiles.jpg", "category": "Pink" },
  { "name": "Camel Dust Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/camel-dust/camel-dust-sandstone-natural-paving-tiles.jpg", "category": "Beige" },
  { "name": "Chocolate Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/chocolate/chocolate-sandstone-natural-finish-calibrated-tiles.jpg", "category": "Brown" },
  { "name": "Sagar Black Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/sagar-black/sagar-black-natural-wet-sandstone-paving-exterior-tiles.jpg", "category": "Black" },
  { "name": "Dholpur Beige Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/dholpur-beige/dholpur-beige-sandstone-natural-finish-tiles.jpg", "category": "Beige" },
  { "name": "Modak Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/modak/modak-sandstone-natural-surface-hand-split-tiles.jpg", "category": "Brown" },
  { "name": "Mandana Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/mandana/mandana-red-sandstone-natural-tile-exporter-india.jpg", "category": "Red" },
  { "name": "Jodhpur Pink Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/jodhpur-pink/jodhpur-pink-sandstone-honed-tiles.jpg", "category": "Pink" },
  { "name": "Jodhpur Brown Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/jodhpur-brown/jodhpur-brown-sandstone-honed-finish-tiles.jpg", "category": "Brown" },
  { "name": "Jaisalmer Yellow Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/jaisalmer-yellow/jaisalmer-yellow-sandstone-honed-polished-cut-to-size-tiles.jpg", "category": "Yellow" },
  { "name": "Mint Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/mint/white-mint-natural-split-surface-sandstone-tile.jpg", "category": "Green" },
  { "name": "Yellow Mint Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/yellow-mint/yellow-mint-sandstone-natural-finish-calibrated-tiles.jpg", "category": "Yellow" },
  { "name": "Pink Mint Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/pink-mint/pink-mint-sandstone-cut-to-size-natural-tiles.jpg", "category": "Pink" },
  { "name": "Lalitpur Grey Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/lalitpur-grey/lalitpur-grey-sandstone-natural-patio-pack-tiles.jpg", "category": "Grey" },
  { "name": "Lalitpur Yellow Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/lalitpur-yellow/lalitpur-yellow-sandstone-natural-split-finish-tiles.jpg", "category": "Yellow" },
  { "name": "Raveena Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/raveena/raveena-sandstone-natural-paving-tile-setts.jpg", "category": "Brown" },
  { "name": "Kandla Grey Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/kandla-grey/kandla-grey-sandstone-natural-finish-tiles.jpg", "category": "Grey" },
  { "name": "Raj Green Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/raj-green/raj-green-natural-sandstone-floor-covering-tiles.jpg", "category": "Green" },
  { "name": "Fossil Mint Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/fossil-mint/fossil-mint-sandstone-paving-tiles.jpg", "category": "Green" },
  { "name": "Teak Wood Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/teak-wood/teakwood-sandstone-honed-paving-tiles.jpg", "category": "Brown" },
  { "name": "Rainbow Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/rainbow/rainbow-sandstone-swan-finish-paving-tiles.jpg", "category": "Multicolor" },
  { "name": "Panther Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/panther/panter-sandstone-patio-pack-paving-tiles.jpg", "category": "Brown" },
  { "name": "Kota Stone", "image": "https://www.bhandarimarblecompany.com/wp-content/uploads/2024/05/Kota-stone-300x224.png", "category": "Grey" }
];

const DEFAULT_DESCRIPTION = 'Premium quality sandstone, sourced from verified quarries.';
const DEFAULT_FEATURES = ['Natural stone finish', 'Scratch resistant', 'Easy to maintain'];

// Build Lookup Map
const sandstoneTypesMap = {};

const TOUCH_OPTIONS = ["Polished", "Honed", "Leather", "Flamed", "Lapato", "Bush Hammered", "Antique", "Sandblasted"];
const TYPE_OPTIONS = ["Kota Stone", "Agra Sandstone", "Raj Green Sandstone", "Teakwood Sandstone", "Dholpur Sandstone"];
const THICKNESS_RANGE = [16, 18, 20, 22, 24, 26, 28, 30];

// Merge Data
const ALL_PRODUCTS = CSV_PRODUCTS.map((csvItem, index) => {
  const key = csvItem.name.toLowerCase().trim();
  const existing = sandstoneTypesMap[key];

  let type = TYPE_OPTIONS[index % TYPE_OPTIONS.length];
  if (csvItem.name.toLowerCase().includes('kota')) type = 'Kota Stone';
  else if (csvItem.name.toLowerCase().includes('agra')) type = 'Agra Sandstone';
  else if (csvItem.name.toLowerCase().includes('raj green')) type = 'Raj Green Sandstone';
  else if (csvItem.name.toLowerCase().includes('teak')) type = 'Teakwood Sandstone';
  else if (csvItem.name.toLowerCase().includes('dholpur')) type = 'Dholpur Sandstone';
  // Pseudo-random price between 50 and 250 based on index
  const price = 50 + ((index * 17) % 201);

  // Assign 2 to 4 touch options
  const numTouches = (index % 3) + 2;
  const touch = [];
  for (let i = 0; i < numTouches; i++) {
    touch.push(TOUCH_OPTIONS[(index + i) % TOUCH_OPTIONS.length]);
  }

  return {
    id: existing ? existing.id : `csv-${index}`,
    name: csvItem.name,
    image: csvItem.image,
    category: csvItem.category || 'Luxury', // Fallback
    description: existing ? existing.description : DEFAULT_DESCRIPTION,
    features: existing ? existing.features : DEFAULT_FEATURES,
    type,
    price,
    touch,
    thickness: THICKNESS_RANGE
  };
});

export default function Sandstone() {
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

  // 2. Get category from URL (e.g. ?category=Black)
  const categoryFilter = searchParams.get('category') || 'All';

  const [filters, setFilters] = useState({
    type: [],
    color: [],
    touch: [],
    thickness: []
  });

  useEffect(() => {
    const type = searchParams.get('type');
    setFilters(prev => {
      let newType = [];
      if (type === 'kota_stone') newType = ['Kota Stone'];
      else if (type === 'agra_sandstone') newType = ['Agra Sandstone'];
      else if (type === 'raj_green_sandstone') newType = ['Raj Green Sandstone'];
      else if (type === 'teakwood_sandstone') newType = ['Teakwood Sandstone'];
      else if (type === 'dholpur_sandstone') newType = ['Dholpur Sandstone'];

      // Prevent infinite loop by checking if state actually needs to change
      if (prev.type.length === newType.length && prev.type.every((v, i) => v === newType[i])) {
        return prev;
      }
      return { ...prev, type: newType };
    });
  }, [searchParams]);

  const handleFilterChange = (category, value) => {
    setFilters(prev => {
      const current = prev[category];
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
      const matchesColor = filters.color.length === 0 || filters.color.includes(p.category);
      const matchesType = filters.type.length === 0 || filters.type.includes(p.type);
      const matchesTouch = filters.touch.length === 0 || filters.touch.some(t => p.touch.includes(t));
      const matchesThickness = filters.thickness.length === 0 || filters.thickness.some(th => p.thickness.includes(th));

      return matchesUrlCategory && matchesColor && matchesType && matchesTouch && matchesThickness;
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
        pageKey="sandstone"
        structured={getBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Sandstone', path: '/category/sandstone' }
        ])}
      />
      <div className="page products-page">
        <section className="sandstone-header page-header">
          <div className="container container-heading">
            <h1>Our {categoryFilter !== 'All' ? categoryFilter : ''} Sandstone Collections</h1>
            <p>Browse our premium selection of {categoryFilter.toLowerCase()} sandstone varieties</p>
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
                    { name: 'Black', hex: '#000000' },
                    { name: 'Green', hex: '#2e8b57' },
                    { name: 'Brown', hex: '#8b4513' },
                    { name: 'Red', hex: '#b22222' },
                    { name: 'Yellow', hex: '#ffd700' },
                    { name: 'Multicolor', hex: 'linear-gradient(45deg, red, blue, green)' },
                    { name: 'Beige', hex: '#f5f5dc' },
                    { name: 'Grey', hex: '#808080' },
                    { name: 'Pink', hex: '#ffc0cb' }
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
                  {["Polished", "Honed", "Leather", "Flamed", "Lapato", "Bush Hammered", "Antique", "Sandblasted"].map(tch => (
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
              {(filters.type.length > 0 || filters.color.length > 0 || filters.touch.length > 0 || filters.thickness.length > 0 || filters.minPrice > 50 || filters.maxPrice < 250 || categoryFilter !== 'All') && (
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

                  {filters.thickness.map(th => (
                    <div key={th} style={{ padding: '4px 12px', background: '#f0f0f0', borderRadius: '16px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {th}mm
                      <span style={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={() => handleFilterChange('thickness', th)}>×</span>
                    </div>
                  ))}

                  <button
                    onClick={() => {
                      setFilters({ type: [], color: [], touch: [], thickness: [] });
                      setSearchParams({ category: 'All' });
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
                            style={demands.some(d => d.name === product.name) ? { backgroundColor: '#4CAF50', color: 'white' } : {}}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (demands.some(d => d.name === product.name)) {
                                removeDemand(product.name);
                              } else {
                                addDemand(product);
                              }
                            }}
                          >
                            {demands.some(d => d.name === product.name) ? (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'center' }}>
                                Added! <span style={{ fontSize: '14px', fontWeight: 'bold' }}>✕</span>
                              </span>
                            ) : "Add to Demands"}
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

        {/* Sandstone Buying Guide - Slider */}
        <section className="guide-slider-section" style={{ backgroundImage: 'url("https://www.regattagranitesindia.com/wp-content/uploads/2026/04/Stream-White-Swatch.webp")', padding: '60px 0' }}>
          <div className="container">
            <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '40px' }}>Sandstone Buying Guide</h2>

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
                    <h3 style={{ fontSize: '28px', marginBottom: '20px', color: '#a45040' }}>What is Sandstone?</h3>
                    <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#333' }}>
                      Sandstone is a beautiful and versatile natural stone, available in a wide range of warm, earthy colors and unique textures. Formed over millions of years, each piece features distinctive granular patterns. Prized for its natural aesthetic, slip resistance, and durability, it is perfect for both indoor and outdoor residential and commercial applications.
                    </p>
                  </div>
                )}

                {currentSlide === 1 && (
                  <div>
                    <h3 style={{ fontSize: '28px', marginBottom: '20px', color: '#a45040' }}>Selection & Testing</h3>
                    <div style={{ fontSize: '16px', lineHeight: '1.9', color: '#333' }}>
                      <p><strong>🏢 Visit Showrooms:</strong> Explore varieties under one roof to find the perfect match</p>
                      <p><strong>📦 Collect Samples:</strong> Take samples to your space - compare colors and designs in actual lighting</p>
                      <p><strong>💧 Porosity Test:</strong> Sandstone is naturally porous and requires quality sealants for wet areas.</p>
                      <p><strong>🍋 Acid Test:</strong> Some sandstones can react to acids. Test samples with lemon before kitchen use.</p>
                    </div>
                  </div>
                )}

                {currentSlide === 2 && (
                  <div>
                    <h3 style={{ fontSize: '28px', marginBottom: '20px', color: '#a45040' }}>Finalization</h3>
                    <div style={{ fontSize: '16px', lineHeight: '1.9', color: '#333' }}>
                      <p><strong>📏 Measure Precisely:</strong> Record exact length & width. Use measuring tape, not estimates</p>
                      <p><strong>🔧 Find Fabricators:</strong> Locate 2-3 local options, compare experience & reviews. They'll discuss edge options & provide quotes</p>
                      <p><strong>🧩 Get Seaming Samples:</strong> Two pieces should match perfectly & appear as one continuous piece</p>
                      <p><strong>📋 Check Warranty:</strong> Review coverage thoroughly. Many offer lifetime workmanship warranties</p>
                    </div>
                  </div>
                )}

                {currentSlide === 3 && (
                  <div style={{ textAlign: 'center' }}>
                    <h3 style={{ fontSize: '28px', marginBottom: '30px', color: '#a45040' }}>Ready to Choose Your Sandstone?</h3>
                    <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#333', marginBottom: '25px' }}>
                      With proper selection and maintenance, sandstone lasts for decades. Our experts are ready to help you find the perfect sandstone for your project.
                    </p>
                    <div style={{ fontSize: '16px', color: '#555' }}>
                      {/* <p>📞 <strong>Call:</strong> +91-9256901351</p> */}
                      <p>📞 <strong>Call:</strong> +91-1234567890</p>
                      {/* <p>✉️ <strong>Email:</strong> infokmstonex@gmail.com</p> */}
                      <p>✉️ <strong>Email:</strong> demo@example.com</p>
                      {/* <p>💬 <strong>WhatsApp:</strong> +91-9256901351</p> */}
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