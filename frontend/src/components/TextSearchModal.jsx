import React, { useState, useEffect } from 'react';
import { CSV_PRODUCTS } from '../utils/constants';
import '../styles/visual-search.css'; // Reusing visual search styles

export default function TextSearchModal({ isOpen, onClose, initialQuery }) {
  const [query, setQuery] = useState(initialQuery || '');
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  // Sync initial query when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery || '');
      setCurrentPage(1);
      setActiveCategory('All');
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

  return (
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
                    setQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search for granites, marbles, stones..." 
                  autoFocus
                />
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
                    <div key={idx} className="vs-product-card">
                      <img src={product.image} alt={product.name} />
                      <div className="vs-match-badge">{product.matchScore}% match</div>
                      <div className="vs-product-info">
                        <span className="vs-product-cat">{product.category || product.material || ''}</span>
                        <h4>{product.name}</h4>
                        <button className="vs-add-btn">View Details</button>
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
    </div>
  );
}
