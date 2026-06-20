import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom'; // Required for URL filtering
import { GRANITE_TYPES } from '../../utils/constants';
import '../../styles/pages.css';
import SEOHead from '../../components/SEOHead';
import { getBreadcrumbSchema } from '../../utils/seo';

// 1. Updated Data with Category Column
const CSV_PRODUCTS = [
     { "name": "Agaria white marble", "image": "https://www.bhandarimarblecompany.com/wp-content/uploads/2024/05/Agaria-white-marble-300x229.png", "category": "White", "place": "India" },
  { "name": "Albeta white marble", "image": "https://www.bhandarimarblecompany.com/wp-content/uploads/2024/05/Albeta-white-marble-300x269.png", "category": "White", "place": "India" },
  { "name": "Arna white marble", "image": "https://www.bhandarimarblecompany.com/wp-content/uploads/2024/05/Arna-white-marble-300x283.png", "category": "White", "place": "India" },
  { "name": "Dungari white marble", "image": "https://www.bhandarimarblecompany.com/wp-content/uploads/2024/05/Dungari-white-marble-300x300.png", "category": "White", "place": "India" },
  { "name": "Indian statuario marble", "image": "https://www.bhandarimarblecompany.com/wp-content/uploads/2024/05/Indian-statuario-marble-300x250.png", "category": "White", "place": "India" },
  { "name": "Indian onyx marble", "image": "https://www.bhandarimarblecompany.com/wp-content/uploads/2024/05/indian-onyx-marble-300x225.png", "category": "White", "place": "India" },
  { "name": "Jhanjhar white marble", "image": "https://www.bhandarimarblecompany.com/wp-content/uploads/2024/05/Jhanjhar-white-marble-300x291.png", "category": "White", "place": "India" },
  { "name": "Morchana white marble", "image": "https://www.bhandarimarblecompany.com/wp-content/uploads/2024/05/Morchana-white-marble.png", "category": "White", "place": "India" },
  { "name": "Morwad white marble", "image": "https://www.bhandarimarblecompany.com/wp-content/uploads/2024/05/Morwad-white-marble-300x231.png", "category": "White", "place": "India" },
  { "name": "Rajnagar white marble", "image": "https://www.bhandarimarblecompany.com/wp-content/uploads/2024/05/Rajnagar-white-marble-300x295.png", "category": "White", "place": "India" },
  { "name": "Wonder white marble", "image": "https://www.bhandarimarblecompany.com/wp-content/uploads/2024/05/Wonder-white-marble-254x300.png", "category": "White", "place": "India" },
  { "name": "Pure White Marble", "image": "https://www.bhandarimarblecompany.com/wp-content/uploads/2024/05/Pure-White-Marble-300x243.png", "category": "White", "place": "India" },
  { "name": "Banswara white marble", "image": "https://www.bhandarimarblecompany.com/wp-content/uploads/2024/05/Banswara-white-marble-300x217.png", "category": "White", "place": "India" },
  { "name": "Indian carrara marble", "image": "https://www.bhandarimarblecompany.com/wp-content/uploads/2024/05/Indian-carrara-marble-300x274.png", "category": "White", "place": "India" },
  { "name": "Ambaji white marble", "image": "https://www.bhandarimarblecompany.com/wp-content/uploads/2024/05/Ambaji-white-marble-300x252.png", "category": "White", "place": "India" },
  { "name": "Dharmeta white marble", "image": "https://www.bhandarimarblecompany.com/wp-content/uploads/2024/05/Dharmeta-white-marble-300x300.png", "category": "White", "place": "India" },
  { "name": "Ardosia black grey marble", "image": "https://www.bhandarimarblecompany.com/wp-content/uploads/2024/05/Ardosia-black-marble-300x264.png", "category": "Grey", "place": "India" },
  { "name": "Brown rainforest marble", "image": "https://www.bhandarimarblecompany.com/wp-content/uploads/2024/05/Brown-rainforest-marble-300x247.png", "category": "Brown", "place": "India" },
  { "name": "Fire red marble", "image": "https://www.bhandarimarblecompany.com/wp-content/uploads/2024/05/Fire-red-marble-300x273.png", "category": "Red", "place": "India" },
  { "name": "Golden rainforest marble", "image": "https://www.bhandarimarblecompany.com/wp-content/uploads/2024/05/Golden-rainforest-marble-300x278.png", "category": "Brown", "place": "India" },
  { "name": "Oman red marble", "image": "https://www.bhandarimarblecompany.com/wp-content/uploads/2024/05/Oman-red-marble-300x287.png", "category": "Red", "place": "India" },
  { "name": "Sawar marble", "image": "https://www.bhandarimarblecompany.com/wp-content/uploads/2024/05/Sawar-marble-300x287.png", "category": "Beige", "place": "India" },
  { "name": "Pink katni marble", "image": "https://www.bhandarimarblecompany.com/wp-content/uploads/2024/05/Pink-katni-marble-300x283.png", "category": "Pink", "place": "India" },
  { "name": "Pink marble", "image": "https://www.bhandarimarblecompany.com/wp-content/uploads/2024/05/Pink-marble-300x209.png", "category": "Pink", "place": "India" },
  { "name": "Kota stone", "image": "https://www.bhandarimarblecompany.com/wp-content/uploads/2024/05/Kota-stone-300x224.png", "category": "Grey", "place": "India" },
  { "name": "Fantasy brown marble", "image": "https://www.bhandarimarblecompany.com/wp-content/uploads/2024/05/Fantasy-brown-marble-300x231.png", "category": "Brown", "place": "India" },
  { "name": "Chak dungri marble", "image": "https://www.bhandarimarblecompany.com/wp-content/uploads/2024/05/Chak-dungri-marble-300x228.png", "category": "White", "place": "India" },
  { "name": "Wonder wood marble", "image": "https://www.bhandarimarblecompany.com/wp-content/uploads/2024/05/Wonder-wood-marble-300x300.png", "category": "Brown", "place": "India" },
  { "name": "Rainbow marble", "image": "https://www.bhandarimarblecompany.com/wp-content/uploads/2024/05/Rainbow-marble-300x241.png", "category": "Beige", "place": "India" },
  { "name": "Jaisalmer Yellow marble", "image": "https://www.bhandarimarblecompany.com/wp-content/uploads/2024/05/jaisalmer-Yellow-marble-300x249.png", "category": "Yellow", "place": "India" },
  { "name": "Teak sandstone", "image": "https://www.bhandarimarblecompany.com/wp-content/uploads/2024/05/Teak-sandstone-300x176.png", "category": "Brown", "place": "India" },
  { "name": "Makrana pink marble", "image": "https://www.bhandarimarblecompany.com/wp-content/uploads/2024/05/Makrana-pink-marble-300x253.png", "category": "Pink", "place": "India" },
  { "name": "Keshairya green marble", "image": "https://www.bhandarimarblecompany.com/wp-content/uploads/2024/05/Keshairya-green-marble-300x280.png", "category": "Green", "place": "India" },
  { "name": "Tobacco black marble", "image": "https://www.bhandarimarblecompany.com/wp-content/uploads/2024/05/Tobacco-black-marble-300x238.png", "category": "Black", "place": "India" },
  { "name": "Cheery red marble", "image": "https://www.bhandarimarblecompany.com/wp-content/uploads/2024/05/Cheery-red-marble-300x297.png", "category": "Red", "place": "India" },
  { "name": "Katni Marble", "image": "https://www.bhandarimarblecompany.com/wp-content/uploads/2024/05/katni-marble-283x300.png", "category": "Beige", "place": "India" },
  { "name": "Brown Albeta Marble", "image": "https://www.bhandarimarblecompany.com/wp-content/uploads/2024/05/Brown-Albeta-Marble-300x280.png", "category": "Brown", "place": "India" },
  { "name": "Bliss White Marble", "image": "https://www.bhandarimarblecompany.com/wp-content/uploads/2024/05/Bliss-White-Marble-290x300.png", "category": "White", "place": "India" },
  { "name": "Pista White Marble", "image": "https://www.bhandarimarblecompany.com/wp-content/uploads/2024/05/Pista-White-Marble-268x300.png", "category": "White", "place": "India" },
  { "name": "Udaipur pink marble", "image": "https://www.bhandarimarblecompany.com/wp-content/uploads/2024/05/udaipur-pink-marble-300x300.png", "category": "Pink", "place": "India" }


]; 


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
    category: csvItem.category || 'Luxury', // Fallback
    description: existing ? existing.description : DEFAULT_DESCRIPTION,
    features: existing ? existing.features : DEFAULT_FEATURES,
  };
});


export default function MarbleIndian() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;
  
  // 2. Get category from URL (e.g. ?category=Black)
  const categoryFilter = searchParams.get('category') || 'All';

  // 3. Filtered List Logic
  const filteredProducts = useMemo(() => {
    if (categoryFilter === 'All') return ALL_PRODUCTS;
    return ALL_PRODUCTS.filter(p => p.category.toLowerCase() === categoryFilter.toLowerCase());
  }, [categoryFilter]);

  // 4. Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

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
    <div className="page products-page">
      <section className=" marble-header-indian page-header">
        <div className="container container-heading">
          <h1>Our {categoryFilter !== 'All' ? categoryFilter : ''} Indian Marble Collections</h1>
          <p>Browse our premium selection of {categoryFilter.toLowerCase()} Indian marble varieties</p>
        </div>
      </section>

      {/* Category Tabs - Responsive Slider */}
      <section className="filter-bar">
        <div className="filter-buttons-wrapper">
          <div className="filter-buttons-container">
            {['All', 'Black', 'White', 'Green', 'Brown', 'Red', 'Yellow' , 'Grey', 'Pink'].map(cat => (
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
                  <img style={{transform : 'scale(1)'}} src={product.image} alt={product.name} />

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
                       navigate( `/get-quote?stone=${encodeURIComponent(product.name)}&image=${encodeURIComponent(product.image)}`);
                      }}
                    >
                      Get Quote
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marble Buying Guide - Slider */}
      <section className="guide-slider-section" style={{ backgroundImage: 'url("https://petrosstone.com/wp-content/uploads/2021/06/Statuario.jpg")', padding: '60px 0' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '40px' }}>Marble Buying Guide</h2>
          
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
                  <h3 style={{ fontSize: '28px', marginBottom: '20px', color: '#a45040' }}>What is Marble?</h3>
                  <div style={{ fontSize: '16px', lineHeight: '1.8', color: '#333' }}>
                    <p>Premium marble transforms spaces with unparalleled versatility. Formed under intense pressure and heat, marble is a metamorphic stone with exceptional durability and distinctive veining patterns.</p>
                    <p style={{ marginTop: '15px' }}><strong>Grade A:</strong> Superior quality with consistent coloring | <strong>Grade B:</strong> Minor imperfections | <strong>Grade C:</strong> More variations</p>
                    <p style={{ marginTop: '15px', fontStyle: 'italic' }}>Perfect for kitchen worktops, bathroom vanities, flooring, and custom features. Well-maintained marble lasts for decades.</p>
                  </div>
                </div>
              )}

              {currentSlide === 1 && (
                <div>
                  <h3 style={{ fontSize: '28px', marginBottom: '20px', color: '#a45040' }}>Colors & Finishes</h3>
                  <div style={{ fontSize: '15px', lineHeight: '1.9', color: '#333' }}>
                    <p><strong>Colors:</strong> ⚪ White • 🔴 Red • 🟠 Pink • 🟤 Brown • ⬛ Black • 🟩 Green • ⬜ Grey • 🟨 Yellow</p>
                    <p style={{ marginTop: '15px' }}><strong>Finishes Available:</strong></p>
                    <p>✨ <strong>Polished</strong> - Glossy, mirror-like reflectivity</p>
                    <p>🎨 <strong>Honed</strong> - Matte, contemporary look</p>
                    <p>🏔️ <strong>Leathered</strong> - Textured, slip resistant</p>
                  </div>
                </div>
              )}

              {currentSlide === 2 && (
                <div>
                  <h3 style={{ fontSize: '28px', marginBottom: '20px', color: '#a45040' }}>Applications & Thickness</h3>
                  <div style={{ fontSize: '16px', lineHeight: '1.9', color: '#333' }}>
                    <p><strong>Applications:</strong> 🏠 Flooring • 🍽️ Worktops • 🛁 Vanity Tops • 🎨 Cladding</p>
                    <p style={{ marginTop: '15px' }}><strong>Thickness Options:</strong></p>
                    <p>📏 <strong>2cm</strong> - Wall cladding & backsplashes</p>
                    <p>📏 <strong>3cm</strong> - Kitchen worktops & vanities (standard)</p>
                    <p>📏 <strong>5cm</strong> - Premium statement pieces</p>
                    <p style={{ marginTop: '15px', color: '#666' }}><strong>Maintenance:</strong> Use pH-neutral cleaners daily, seal every 12-18 months, wipe spills immediately</p>
                  </div>
                </div>
              )}

              {currentSlide === 3 && (
                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ fontSize: '28px', marginBottom: '30px', color: '#a45040' }}>Get Expert Guidance</h3>
                  <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#333', marginBottom: '25px' }}>
                    Our specialists help you find the perfect marble for your project. Inspect slabs in person to see the unique veining and patterns.
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