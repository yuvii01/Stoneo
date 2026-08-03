import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import '../../styles/pages.css';
import SEOHead from '../../components/SEOHead';
import { getBreadcrumbSchema } from '../../utils/seo';
import { useDemand } from '../../context/DemandContext';

const INTERIOR_APPLICATIONS = [
  "Interior Flooring",
  "Wall Cladding",
  "Kitchen Countertops",
  "Bathroom & Vanity",
  "Staircase",
  "Table Tops & Furniture",
  "Home Decor"
];

const COLORS = ["White", "Black", "Grey", "Gold", "Brown", "Beige", "Multicolor"];
const MATERIALS = ["Granite", "Marble", "Quartz", "Sandstone", "Agate", "Gemstone"];

// Generate dummy interior products
const generateDummyProducts = () => {
  const products = [];
  const images = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1600585154526-990dced4ea0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1599696848652-f0ff23bc911f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1620626011761-996317b8d101?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1604578762246-41134e37f9cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1577140917170-285929fb55b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  ];

  for (let i = 0; i < 40; i++) {
    const appType = INTERIOR_APPLICATIONS[i % INTERIOR_APPLICATIONS.length];
    const color = COLORS[i % COLORS.length];
    const material = MATERIALS[i % MATERIALS.length];
    const image = images[i % images.length];

    products.push({
      id: `interior-${i}`,
      name: `${color} ${material} ${appType}`,
      image: image,
      category: color,
      applicationType: appType,
      material: material,
      description: `Premium quality ${color.toLowerCase()} ${material.toLowerCase()} perfectly suited for ${appType.toLowerCase()}.`,
      origin: "Imported"
    });
  }
  return products;
};

const ALL_PRODUCTS = generateDummyProducts();

export default function Interior() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addDemand, removeDemand, demands } = useDemand();
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
    applicationType: [],
    color: [],
    material: []
  });

  // Map URL params to filters
  useEffect(() => {
    const type = searchParams.get('type');
    const filter = searchParams.get('filter');
    if (type) {
      const typeMap = {
        'interior-flooring': 'Interior Flooring',
        'wall-cladding': 'Wall Cladding',
        'kitchen-countertops': 'Kitchen Countertops',
        'bathroom-vanity': 'Bathroom & Vanity',
        'staircase': 'Staircase',
        'table-tops-furniture': 'Table Tops & Furniture',
        'home-decor': 'Home Decor'
      };
      const mappedType = typeMap[type];
      if (mappedType) {
        setFilters(prev => ({ ...prev, applicationType: [mappedType] }));
      }
    } else if (filter) {
      setFilters(prev => ({ ...prev, applicationType: [filter] }));
    } else {
      setFilters(prev => ({ ...prev, applicationType: [] }));
    }
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

  const filteredProducts = useMemo(() => {
    return ALL_PRODUCTS.filter(p => {
      const matchesApp = filters.applicationType.length === 0 || filters.applicationType.includes(p.applicationType);
      const matchesColor = filters.color.length === 0 || filters.color.includes(p.category);
      const matchesMaterial = filters.material.length === 0 || filters.material.includes(p.material);
      return matchesApp && matchesColor && matchesMaterial;
    });
  }, [filters]);

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
        pageKey="interior"
        structured={getBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Interior', path: '/application/interior' }
        ])}
      />
      <div className="page products-page">
        <section className="granite-header page-header" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)' }}>
          <div className="container container-heading">
            <h1>Interior Collections</h1>
            <p>Browse our premium selection of interior stones and applications</p>
          </div>
        </section>

        <section className="products-section" style={{ paddingTop: '40px' }}>
          <div className="container category-layout-container">
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
                <h4>Application Type</h4>
                <div className="filter-checkbox-group">
                  {INTERIOR_APPLICATIONS.map(app => (
                    <label key={app} className="filter-checkbox-label">
                      <input
                        type="checkbox"
                        checked={filters.applicationType.includes(app)}
                        onChange={() => handleFilterChange('applicationType', app)}
                      />
                      {app}
                    </label>
                  ))}
                </div>
              </div>

              <div className="filter-section">
                <h4>Material</h4>
                <div className="filter-checkbox-group">
                  {MATERIALS.map(mat => (
                    <label key={mat} className="filter-checkbox-label">
                      <input
                        type="checkbox"
                        checked={filters.material.includes(mat)}
                        onChange={() => handleFilterChange('material', mat)}
                      />
                      {mat}
                    </label>
                  ))}
                </div>
              </div>

              <div className="filter-section">
                <h4>Color</h4>
                <div className="color-swatches">
                  {[
                    { name: 'Black', hex: '#000000' },
                    { name: 'White', hex: '#ffffff' },
                    { name: 'Grey', hex: '#808080' },
                    { name: 'Gold', hex: '#d4af37' },
                    { name: 'Brown', hex: '#8b4513' },
                    { name: 'Beige', hex: '#f5f5dc' },
                    { name: 'Multicolor', hex: 'linear-gradient(45deg, red, blue, green)' }
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
            </aside>

            <div style={{ flex: 1 }}>
              {(filters.applicationType.length > 0 || filters.color.length > 0 || filters.material.length > 0) && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: '#555', marginRight: '8px' }}>Active Filters:</span>

                  {filters.applicationType.map(app => (
                    <div key={app} style={{ padding: '4px 12px', background: '#f0f0f0', borderRadius: '16px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {app}
                      <span style={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={() => handleFilterChange('applicationType', app)}>×</span>
                    </div>
                  ))}

                  {filters.material.map(mat => (
                    <div key={mat} style={{ padding: '4px 12px', background: '#f0f0f0', borderRadius: '16px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {mat}
                      <span style={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={() => handleFilterChange('material', mat)}>×</span>
                    </div>
                  ))}

                  {filters.color.map(c => (
                    <div key={c} style={{ padding: '4px 12px', background: '#f0f0f0', borderRadius: '16px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Color: {c}
                      <span style={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={() => handleFilterChange('color', c)}>×</span>
                    </div>
                  ))}

                  <button
                    onClick={() => {
                      setFilters({ applicationType: [], color: [], material: [] });
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
                          {product.applicationType}
                        </div>
                      </div>
                      <div className="product-info">
                        <h3>{product.name}</h3>
                        <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                          Material: {product.material}
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
      </div>
    </>
  );
}
