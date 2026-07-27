import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { CSV_PRODUCTS, ROYAL_GEM_STONE_PRODUCTS } from '../utils/constants';
import '../styles/visual-search.css'; // Reusing visual search styles

export default function TextSearchModal({ isOpen, onClose, initialQuery, onQueryChange }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialQuery || '');
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  const isRoyalGem = (product) => {
    return product && (
      product.isRoyalGemStone ||
      product.category === 'Royal Gemstone' ||
      ['Agate', 'Quartz', 'Gemstone', 'Shellstone', 'Fossil', 'Jasper'].includes(product.material)
    );
  };

  // Sync initial query when modal opens or query updates from Header
  useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery || '');
      setCurrentPage(1);
    }
  }, [isOpen, initialQuery]);

  const handleClose = () => {
    onClose();
  };

  // Fuzzy matching logic: simple text match score
  // We match against product name and category
  const getMatchScore = (product, searchQuery) => {
    if (!searchQuery) return 0;
    const lowerQuery = searchQuery.toLowerCase();
    const lowerName = product.name.toLowerCase();
    const lowerCategory = product.category ? product.category.toLowerCase() : (product.material ? product.material.toLowerCase() : '');
    
    if (lowerName === lowerQuery) return 100;
    if (lowerName.startsWith(lowerQuery)) return 90;
    if (lowerName.includes(lowerQuery)) return 75;
    
    // Check if any word in query matches words in name
    const queryWords = lowerQuery.split(' ').filter(w => w.trim().length > 0);
    let matchedWords = 0;
    for (const word of queryWords) {
      if (lowerName.includes(word) || lowerCategory.includes(word)) {
        matchedWords++;
      }
    }
    
    if (matchedWords > 0) {
      return Math.round((matchedWords / queryWords.length) * 60);
    }
    
    return 0;
  };

  // Filter and sort products
  let matchedProducts = [];
  if (query.trim().length > 0) {
    matchedProducts = CSV_PRODUCTS.map(p => ({
      ...p,
      matchScore: getMatchScore(p, query)
    }))
    .filter(p => p.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);
  }

  // Filter by category
  if (activeCategory !== 'All') {
    matchedProducts = matchedProducts.filter(p => 
      (p.category && p.category.toLowerCase() === activeCategory.toLowerCase()) || 
      (p.material && p.material.toLowerCase() === activeCategory.toLowerCase())
    );
  }

  // Pagination logic
  const totalPages = Math.ceil(matchedProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = matchedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Extract unique matched categories to show in pills
  const categoriesSet = new Set(['All']);
  matchedProducts.forEach(p => {
    if (p.category) categoriesSet.add(p.category);
    if (p.material) categoriesSet.add(p.material);
  });
  const availableCategories = Array.from(categoriesSet).slice(0, 10);

  if (!isOpen) return null;

  return createPortal(
    <div className="vs-modal-overlay" onClick={handleClose}>
      <div className="vs-modal-content vs-results-mode" style={{ maxWidth: '1000px', width: '90%' }} onClick={(e) => e.stopPropagation()}>
        <button className="vs-close-btn" onClick={handleClose}>✕</button>

        <div className="vs-results-view" style={{ gridTemplateColumns: '1fr', padding: '20px' }}>
          <div className="vs-results-right" style={{ padding: '0' }}>
            
            <div className="search-modal-header" style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: '300', color: '#111' }}>
                {query ? (
                  <>Search Results for <span style={{ fontWeight: '600' }}>"{query}"</span></>
                ) : 'Search Products'}
              </h2>
              <div className="search-bar-container" style={{ margin: '0', maxWidth: '100%', backgroundColor: '#f8f9fa', border: '1px solid #eee', padding: '8px 20px', transition: 'all 0.3s ease' }}>
                <svg className="search-icon" style={{ color: '#5f6368', width: '20px', height: '20px' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input 
                  type="text" 
                  className="search-bar-input" 
                  style={{ color: '#333', fontSize: '18px', padding: '10px', outline: 'none', border: 'none', boxShadow: 'none' }}
                  value={query}
                  onChange={(e) => {
                    const val = e.target.value;
                    setQuery(val);
                    if (onQueryChange) onQueryChange(val);
                    setCurrentPage(1);
                  }}
                  placeholder="Search for granites, marbles, stones..." 
                  autoFocus
                />
              </div>
            </div>

            {/* Royal Gem Stones Premium Showcase Section Under Search Bar */}
            <div style={{
              margin: '0 0 30px 0',
              padding: '20px',
              backgroundColor: '#fffcf5',
              border: '1px solid #e8dec8',
              borderRadius: '10px',
              boxShadow: '0 4px 18px rgba(212, 175, 55, 0.12)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '20px' }}>👑</span>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#b48e5d', margin: 0, letterSpacing: '0.5px' }}>
                    Royal Gem Stones Collection
                  </h3>
                  <span style={{
                    fontSize: '11px',
                    background: 'linear-gradient(135deg, #d4af37, #b89728)',
                    color: '#fff',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                    letterSpacing: '0.5px'
                  }}>
                    PREMIUM MATERIAL
                  </span>
                </div>
                <span style={{ fontSize: '12px', color: '#888', fontStyle: 'italic' }}>
                  Exclusive Semi-Precious Slabs & Surfaces
                </span>
              </div>

              <div className="vs-product-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '14px' }}>
                {(query.trim()
                  ? ROYAL_GEM_STONE_PRODUCTS.filter(p =>
                      p.name.toLowerCase().includes(query.toLowerCase()) ||
                      (p.material && p.material.toLowerCase().includes(query.toLowerCase())) ||
                      (p.category && p.category.toLowerCase().includes(query.toLowerCase()))
                    )
                  : ROYAL_GEM_STONE_PRODUCTS.slice(0, 6)
                ).slice(0, 6).map((product, idx) => (
                  <div
                    key={`royal-${idx}`}
                    className="vs-product-card"
                    style={{
                      cursor: 'pointer',
                      border: '2px solid #d4af37',
                      boxShadow: '0 4px 16px rgba(212, 175, 55, 0.32)',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      position: 'relative',
                      background: 'linear-gradient(to bottom, #ffffff, #fffdf8)',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => {
                      onClose();
                      navigate(`/products/${encodeURIComponent(product.name)}`, { state: { product } });
                    }}
                  >
                    <div style={{ position: 'relative' }}>
                      <img src={product.image} alt={product.name} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                      <div style={{
                        position: 'absolute',
                        top: '8px',
                        left: '8px',
                        background: 'linear-gradient(135deg, #d4af37, #b89728)',
                        color: '#fff',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '9px',
                        fontWeight: '700',
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                        zIndex: 5
                      }}>
                        ★ Royal Gem
                      </div>
                    </div>
                    <div className="vs-product-info" style={{ padding: '10px' }}>
                      <span className="vs-product-cat" style={{ color: '#b48e5d', fontWeight: '600', fontSize: '11px' }}>{product.material || 'Gemstone'}</span>
                      <h4 style={{ fontSize: '13px', margin: '4px 0 8px 0', color: '#111' }}>{product.name}</h4>
                      <button
                        className="vs-add-btn"
                        style={{
                          background: 'linear-gradient(135deg, #d4af37, #b89728)',
                          color: '#fff',
                          border: 'none',
                          fontWeight: '600',
                          padding: '6px 0'
                        }}
                      >
                        View Luxury Slab
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {matchedProducts.length > 0 && availableCategories.length > 1 && (
              <div className="vs-category-filters">
                {availableCategories.map(cat => (
                  <button
                    key={cat}
                    className={`vs-filter-pill ${activeCategory === cat ? 'active' : ''}`}
                    onClick={() => {
                      setActiveCategory(cat);
                      setCurrentPage(1);
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {matchedProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                <h3>No products found for "{query}"</h3>
                <p>Try adjusting your search terms or use fewer words.</p>
              </div>
            ) : (
              <>
                <div className="vs-product-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
                  {currentProducts.map((product, idx) => (
                    <div 
                      key={idx} 
                      className="vs-product-card"
                      style={{
                        cursor: 'pointer',
                        border: isRoyalGem(product) ? '2px solid #d4af37' : undefined,
                        boxShadow: isRoyalGem(product) ? '0 4px 16px rgba(212, 175, 55, 0.32)' : undefined,
                        background: isRoyalGem(product) ? 'linear-gradient(to bottom, #ffffff, #fffdf8)' : undefined
                      }}
                      onClick={() => {
                        onClose();
                        navigate(`/products/${encodeURIComponent(product.name)}`, { state: { product } });
                      }}
                    >
                      <div style={{ position: 'relative' }}>
                        <img src={product.image} alt={product.name} />
                        {isRoyalGem(product) && (
                          <div style={{
                            position: 'absolute',
                            top: '8px',
                            left: '8px',
                            background: 'linear-gradient(135deg, #d4af37, #b89728)',
                            color: '#fff',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '9px',
                            fontWeight: '700',
                            letterSpacing: '0.5px',
                            textTransform: 'uppercase',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                            zIndex: 5
                          }}>
                            ★ Royal Gem
                          </div>
                        )}
                      </div>
                      <div className="vs-match-badge">{product.matchScore}% match</div>
                      <div className="vs-product-info">
                        <span className="vs-product-cat" style={isRoyalGem(product) ? { color: '#b48e5d', fontWeight: '600' } : {}}>{product.category || product.material || ''}</span>
                        <h4>{product.name}</h4>
                        <button
                          className="vs-add-btn"
                          style={isRoyalGem(product) ? {
                            background: 'linear-gradient(135deg, #d4af37, #b89728)',
                            color: '#fff',
                            border: 'none',
                            fontWeight: '600'
                          } : {}}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="pagination" style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '30px' }}>
                    <button 
                      onClick={() => handlePageChange(currentPage - 1)} 
                      disabled={currentPage === 1}
                      style={{ padding: '8px 15px', borderRadius: '4px', border: '1px solid #ddd', background: currentPage === 1 ? '#f5f5f5' : '#fff', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button 
                        key={i} 
                        onClick={() => handlePageChange(i + 1)}
                        style={{ 
                          padding: '8px 15px', 
                          borderRadius: '4px', 
                          border: 'none',
                          background: currentPage === i + 1 ? '#000' : '#f5f5f5', 
                          color: currentPage === i + 1 ? '#fff' : '#333',
                          cursor: 'pointer' 
                        }}
                      >
                        {i + 1}
                      </button>
                    ))}
                    
                    <button 
                      onClick={() => handlePageChange(currentPage + 1)} 
                      disabled={currentPage === totalPages}
                      style={{ padding: '8px 15px', borderRadius: '4px', border: '1px solid #ddd', background: currentPage === totalPages ? '#f5f5f5' : '#fff', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
