import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom'; // Required for URL filtering
import { GRANITE_TYPES } from '../utils/constants';
import '../styles/pages.css';
import { useDemand } from '../context/DemandContext';
import { useDbProducts } from '../../utils/useDbProducts';
import ProductLoader from '../../components/ProductLoader';

// 1. Updated Data with Category Column
const CSV_PRODUCTS = [

  { name: "Absolute Black Granite", image: "/granite_images/Absolute Black Granite.webp", category: "Black" },
  { name: "Black Galaxy Granite", image: "/granite_images/Black Galaxy Granite.webp", category: "Black" },
  { name: "Black Marine Granite", image: "/granite_images/Black Marine Granite.webp", category: "Black" },
  { name: "Black Marcino Granite", image: "/granite_images/Black Marcino Granite.webp", category: "Black" },
  { name: "Blue Dunes Granite", image: "/granite_images/Blue Dunes Granite.jpg", category: "Blue" },
  { name: "Colonial White Granite", image: "/granite_images/Colonial White Granite.webp", category: "White" },
  { name: "Desert Brown Granite", image: "/granite_images/Desert Brown Granite.webp", category: "Brown" },
  { name: "Steel Grey Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Steel-grey-granite.webp", category: "Grey" },
  
  { name: "P White Granite (Lunar Pearl)", image: "/granite_images/P White Granite (Lunar Pearl).webp", category: "White" },
  { name: "Alaska White Granite", image: "/granite_images/Alaska White Granite.webp", category: "White" },
  { name: "Black Forest Granite", image: "/granite_images/Black Forest Granite.webp", category: "Black" },
  { name: "Viscon White Granite", image: "/granite_images/Viscon White Granite.webp", category: "White" },
  { name: "Tan Brown Granite", image: "/granite_images/Tan Brown Granite.jpg", category: "Brown" },
  { name: "Colonial Gold Granite", image: "/granite_images/Colonial Gold Granite.webp", category: "Gold" },
  { name: "Kuppam Green Granite", image: "/granite_images/Kuppam Green Granite.webp", category: "Green" },
  { name: "Lavender Blue Granite", image: "/granite_images/Lavender Blue Granite.webp", category: "Blue" },
  { name: "Coffee Brown Granite", image: "/granite_images/Coffee Brown Granite.webp", category: "Brown" },
  { name: "Classic Paradiso Granite", image: "/granite_images/Classic Paradiso Granite.webp", category: "Multicolor" },
  { name: "Bash Paradiso Granite", image: "/granite_images/Bash Paradiso Granite.webp", category: "Multicolor" },
  { name: "Red Multicolor Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Red-multicolor-granite.webp", category: "Red" },
  { name: "New Kashmir White Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/New-kashmir-white-granite-1.webp", category: "White" },
  { name: "Himalayan Blue Granite", image: "/granite_images/Himalayan Blue Granite.webp", category: "Blue" },
  { name: "Colombo Juparana Granite", image: "/granite_images/Colombo Juparana Granite.webp", category: "Multicolor" },
  { name: "Crystal Yellow Granite", image: "/granite_images/Crystal Yellow Granite.webp", category: "Yellow" },
  { name: "Malwada Yellow Granite", image: "/granite_images/Malwada Yellow Granite.webp", category: "Yellow" },
  { name: "Astoria Granite", image: "/granite_images/Astoria Granite.webp", category: "Multicolor" },
  { name: "Bala Flower Granite", image: "/granite_images/Bala Flower Granite.webp", category: "Multicolor" },
  { name: "Copper Silk Granite", image: "/granite_images/Copper Silk Granite.webp", category: "Brown" },
  { name: "Kotkasta Granite", image: "/granite_images/Kotkasta Granite.webp", category: "Multicolor" },
  { name: "Maliwada Granite", image: "/granite_images/Maliwada Granite.webp", category: "Yellow" },
  { name: "Monte Cristo Granite", image: "/granite_images/Monte Cristo Granite.webp", category: "Multicolor" },
  { name: "Onida Orange Granite", image: "/granite_images/Onida Orange Granite.webp", category: "Orange" },
  { name: "Royal Cream Granite", image: "/granite_images/Royal Cream Granite.webp", category: "Cream" },
  { name: "Rue Classic Granite", image: "/granite_images/Rue Classic Granite.webp", category: "Multicolor" },
  { name: "Tiger Skin Granite", image: "/granite_images/Tiger Skin Granite.webp", category: "Brown" },
  { name: "Bahama Ivory Granite", image: "/granite_images/Bahama Ivory Granite.webp", category: "Cream" },
  { name: "Cats Eye Granite", image: "/granite_images/Cats Eye Granite.webp", category: "Brown" },
  { name: "Black Premium Granite", image: "/granite_images/Black Premium Granite.webp", category: "Black" },
  { name: "Colonial Cream Granite", image: "/granite_images/Colonial Cream Granite.webp", category: "Cream" },
  { name: "Ghiblee Granite", image: "/granite_images/Ghiblee Granite.webp", category: "Multicolor" },
  { name: "Indian Aurora Granite", image: "/granite_images/Indian Aurora Granite.webp", category: "Multicolor" },
  { name: "Ivory Fantasy Granite", image: "/granite_images/Ivory Fantasy Granite.webp", category: "Cream" },
  { name: "Millennium Cream Granite", image: "/granite_images/Millennium Cream Granite.webp", category: "Cream" },
  { name: "Rose Wood Granite", image: "/granite_images/Rose Wood Granite.webp", category: "Brown" },
  { name: "Sea Waves Granite", image: "/granite_images/Sea Waves Granite.webp", category: "Grey" },
  { name: "Mango Granite", image: "/granite_images/Mango Granite.webp", category: "Yellow" },
  { name: "Lava Oro Granite", image: "/granite_images/Lava Oro Granite.webp", category: "Gold" },
  { name: "Donna Grey Granite", image: "/granite_images/Donna Grey Granite.webp", category: "Grey" },
  { name: "Indian Copacabana Granite", image: "/granite_images/Indian Copacabana Granite.webp", category: "Multicolor" },
  { name: "Alabaster White Granite", image: "/granite_images/Alabaster White Granite.webp", category: "White" },
  { name: "Alpinus White Granite", image: "/granite_images/Alpinus White Granite.webp", category: "White" },
  { name: "Bianco White Granite", image: "/granite_images/Bianco White Granite.webp", category: "White" },
  { name: "Crystal White Granite", image: "/granite_images/Crystal White Granite.webp", category: "White" },
  { name: "French White Granite", image: "/granite_images/French White Granite.webp", category: "White" },
  { name: "Imperial White Granite", image: "/granite_images/Imperial White Granite.webp", category: "White" },
  { name: "Indian Cappuccino White Granite", image: "/granite_images/Indian Cappuccino White Granite.webp", category: "White" },
  { name: "Kuppam White Granite", image: "/granite_images/Kuppam White Granite.webp", category: "White" },
  { name: "Moon White Granite", image: "/granite_images/Moon White Granite.webp", category: "White" },
  { name: "River White Granite", image: "/granite_images/River White Granite.webp", category: "White" },
  { name: "Thunder White Granite", image: "/granite_images/Thunder White Granite.webp", category: "White" },
  { name: "Titanium White Granite", image: "/granite_images/Titanium White Granite.webp", category: "White" },
  { name: "New Ivory White Granite", image: "/granite_images/New Ivory White Granite.webp", category: "White" },
  { name: "S White Granite", image: "/granite_images/S White Granite.webp", category: "White" },
  { name: "Sadarali Granite", image: "/granite_images/Sadarali Granite.webp", category: "Grey" },
  { name: "Epic White Granite", image: "/granite_images/Epic White Granite.webp", category: "White" },
  { name: "Monalisa Granite", image: "/granite_images/Monalisa Granite.webp", category: "Multicolor" },
  { name: "Sunset Canyon Granite", image: "/granite_images/Sunset Canyon Granite.webp", category: "Brown" },
  { name: "Stream White Granite", image: "/granite_images/Stream White Granite.webp", category: "White" },
  { name: "Mariyam White Granite", image: "/granite_images/Mariyam White Granite.webp", category: "White" },
  { name: "Atlantic White Granite", image: "/granite_images/Atlantic White Granite.webp", category: "White" },
  { name: "Alaska Red Granite", image: "/granite_images/Alaska Red Granite.webp", category: "Red" },
  { name: "Bruno Red Granite", image: "/granite_images/Bruno Red Granite.webp", category: "Red" },
  { name: "Jhansi Red Granite", image: "/granite_images/Jhansi Red Granite.webp", category: "Red" },
  { name: "Lakha Red Granite", image: "/granite_images/Lakha Red Granite.webp", category: "Red" },
  { name: "New Imperial Red Granite", image: "/granite_images/New Imperial Red Granite.webp", category: "Red" },
  { name: "Wine Red Granite", image: "/granite_images/Wine Red Granite.webp", category: "Red" },
  { name: "Chima Pink Granite", image: "/granite_images/Chima Pink Granite.webp", category: "Pink" },
  { name: "Rosy Pink Granite", image: "/granite_images/Rosy Pink Granite.webp", category: "Pink" },
  { name: "Astoria Pink Granite", image: "/granite_images/Astoria Pink Granite.webp", category: "Pink" },
  { name: "Ghiblee Pink Granite", image: "/granite_images/Ghiblee Pink Granite.webp", category: "Pink" },
  { name: "Imperial Pink Granite", image: "/granite_images/Imperial Pink Granite.webp", category: "Pink" },
  { name: "Romantic Pink Granite", image: "/granite_images/Romantic Pink Granite.webp", category: "Pink" },
  { name: "Strawberry Pink Granite", image: "/granite_images/Strawberry Pink Granite.webp", category: "Pink" },
  { name: "Alaska Pink Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/03/Alaska-pink-granite.webp", category: "Pink" },
  { name: "Narlai Grey Granite", image: "/granite_images/Narlai Grey Granite.webp", category: "Grey" },
  { name: "Kuppam Grey Granite", image: "/granite_images/Kuppam Grey Granite.webp", category: "Grey" },
  { name: "Apple Green Granite", image: "/granite_images/Apple Green Granite.webp", category: "Green" },
  { name: "Desert Green Granite", image: "/granite_images/Desert Green Granite.webp", category: "Green" },
  { name: "French Green Granite", image: "/granite_images/French Green Granite.webp", category: "Green" },
  { name: "Green Pearl Granite", image: "/granite_images/Green Pearl Granite.webp", category: "Green" },
  { name: "Royal Green Granite", image: "/granite_images/Royal Green Granite.webp", category: "Green" },
  { name: "Hassan Green Granite", image: "/granite_images/Hassan Green Granite.jpg", category: "Green" },
  { name: "Mungaria Green Granite", image: "/granite_images/Mungaria Green Granite.webp", category: "Green" },
  { name: "Olivia Green Granite", image: "/granite_images/Olivia Green Granite.webp", category: "Green" },
  { name: "Alaska Gold Granite", image: "/granite_images/Alaska Gold Granite.webp", category: "Gold" },
  { name: "Bianco Gold Granite", image: "/granite_images/Bianco Gold Granite.webp", category: "Gold" },
  { name: "Desert Gold Granite", image: "/granite_images/Desert Gold Granite.webp", category: "Gold" },
  { name: "Magma Gold Granite", image: "/granite_images/Magma Gold Granite.webp", category: "Gold" },
  { name: "Merry Gold Granite", image: "/granite_images/Merry Gold Granite.webp", category: "Gold" },
  { name: "Titanium Gold Granite", image: "/granite_images/Titanium Gold Granite.webp", category: "Gold" },
  { name: "Astoria Gold Granite", image: "/granite_images/Astoria Gold Granite.webp", category: "Gold" },
  { name: "Fusion Gold Granite", image: "/granite_images/Fusion Gold Granite.webp", category: "Gold" },
  { name: "Golden Oak Granite", image: "/granite_images/Golden Oak Granite.webp", category: "Gold" },
  { name: "Imperial Gold Granite", image: "/granite_images/Imperial Gold Granite.webp", category: "Gold" },
  { name: "Ivory Gold Granite", image: "/granite_images/Ivory Gold Granite.webp", category: "Gold" },
  { name: "Parada Gold Granite", image: "/granite_images/Parada Gold Granite.webp", category: "Gold" },
  { name: "River Gold Granite", image: "/granite_images/River Gold Granite.webp", category: "Gold" },
  { name: "Shivakashi Gold Granite", image: "/granite_images/Shivakashi Gold Granite.webp", category: "Gold" },
  { name: "Ivory Chiffon Granite", image: "/granite_images/Ivory Chiffon Granite.webp", category: "Cream" },
  { name: "Exotic Gold Granite", image: "/granite_images/Exotic Gold Granite.webp", category: "Gold" },
  { name: "Armani Gold Granite", image: "/granite_images/Armani Gold Granite.webp", category: "Gold" },
  { name: "Bhama Gold Granite", image: "/granite_images/Bhama Gold Granite.webp", category: "Gold" },
  { name: "Z Brown Granite", image: "/granite_images/Z Brown Granite.webp", category: "Brown" },
  { name: "Baltic Brown Granite", image: "/granite_images/Baltic Brown Granite.webp", category: "Brown" },
  { name: "Ivory Brown Granite", image: "/granite_images/Ivory Brown Granite.webp", category: "Brown" },
  { name: "Sapphire Brown Granite", image: "/granite_images/Sapphire Brown Granite.webp", category: "Brown" },
  { name: "Sparkle Brown Granite", image: "/granite_images/Sparkle Brown Granite.webp", category: "Brown" },
  { name: "Imperial Blue Granite", image: "/granite_images/Imperial Blue Granite.webp", category: "Blue" },
  { name: "Koliwada Blue Granite", image: "/granite_images/Koliwada Blue Granite.webp", category: "Blue" },
  { name: "Flash Blue Granite", image: "/granite_images/Flash Blue Granite.webp", category: "Blue" },
  { name: "Indian Blue Pearl Granite", image: "/granite_images/Indian Blue Pearl Granite.webp", category: "Blue" },
  { name: "Vizag Blue Granite", image: "/granite_images/Vizag Blue Granite.webp", category: "Blue" },
  { name: "Blue Ocean Granite", image: "/granite_images/Blue Ocean Granite.jpg", category: "Blue" },
  { name: "Black Beauty Granite", image: "/granite_images/Black Beauty Granite.webp", category: "Black" },
  { name: "Black Marquina Granite", image: "/granite_images/Black Marquina Granite.webp", category: "Black" },
  { name: "Wave Black Granite", image: "/granite_images/Wave Black Granite.webp", category: "Black" },
  { name: "Zebra Black Granite", image: "/granite_images/Zebra Black Granite.webp", category: "Black" },
  { name: "Fusion Black Granite", image: "/granite_images/Fusion Black Granite.webp", category: "Black" },
  { name: "Impala Black Granite", image: "/granite_images/Impala Black Granite.webp", category: "Black" },
  { name: "Jet Black Granite", image: "/granite_images/Jet Black Granite.webp", category: "Black" },
  { name: "Nova Black Granite", image: "/granite_images/Nova Black Granite.webp", category: "Black" },
  { name: "Fish Black Granite", image: "/granite_images/Fish Black Granite.webp", category: "Black" },
  { name: "Titanium Black Granite", image: "/granite_images/Titanium Black Granite.webp", category: "Black" },
  { name: "Silver Waves Granite", image: "/granite_images/Silver Waves Granite.webp", category: "Grey" },


  
  { name: 'Black Forest Granite', image: '/granite_images/Black Forest Granite.webp', price: 52, category: 'Black' },
  { name: 'Black Pearl Granite', image: '/granite_images/Black Pearl Granite.jpg', price: 52, category: 'Black' },
  { name: 'Ash Black Granite', image: '/granite_images/Ash Black Granite.jpg', price: 52, category: 'Black' },
  { name: 'Coin Black Granite', image: '/granite_images/Coin Black Granite.jpg', price: 52, category: 'Black' },
  { name: 'Fusion Black Granite', image: '/granite_images/Fusion Black Granite.webp', price: 52, category: 'Black' },
  { name: 'Impala Black Granite', image: '/granite_images/Impala Black Granite.webp', price: 52, category: 'Black' },
  { name: 'Titanium Black Granite', image: '/granite_images/Titanium Black Granite.webp', price: 52, category: 'Black' },

  { name: 'Classic White Granite', image: '/granite_images/Classic White Granite.jpg', price: 52, category: 'White' },
  { name: 'Andromeda White Granite', image: '/granite_images/Andromeda White Granite.jpg', price: 52, category: 'White' },
  { name: 'Alaska White Granite', image: '/granite_images/Alaska White Granite.webp', price: 52, category: 'White' },
  { name: 'Azul White Granite', image: '/granite_images/Azul White Granite.jpg', price: 52, category: 'White' },
  { name: 'Colonial White Granite', image: '/granite_images/Colonial White Granite.webp', price: 52, category: 'White' },
  { name: 'Kashmir White Granite', image: '/granite_images/Kashmir White Granite.jpg', price: 52, category: 'White' },
  { name: 'Moon White Granite', image: '/granite_images/Moon White Granite.webp', price: 52, category: 'White' },

  { name: 'Alaska Gold Granite', image: '/granite_images/Alaska Gold Granite.webp', price: 52, category: 'Gold' },
  { name: 'Imperial Gold Granite', image: '/granite_images/Imperial Gold Granite.webp', price: 52, category: 'Gold' },
  { name: 'Ghibli Gold Granite', image: '/granite_images/Ghibli Gold Granite.jpg', price: 52, category: 'Gold' },
  { name: 'Desert Gold Granite', image: '/granite_images/Desert Gold Granite.webp', price: 52, category: 'Gold' },

  { name: 'Blue Dunes Granite', image: '/granite_images/Blue Dunes Granite.jpg', price: 52, category: 'Blue' },
  { name: 'Blue Pearl Granite', image: '/granite_images/Blue Pearl Granite.jpg', price: 52, category: 'Blue' },
  { name: 'Flash Blue Granite', image: '/granite_images/Flash Blue Granite.webp', price: 52, category: 'Blue' },
  { name: 'Amadeus Blue Granite', image: '/granite_images/Amadeus Blue Granite.jpg', price: 52, category: 'Blue' },

  { name: 'Nosra Green Granite', image: '/granite_images/Nosra Green Granite.jpg', price: 52, category: 'Green' },
  { name: 'Desert Green Granite', image: '/granite_images/Desert Green Granite.webp', price: 52, category: 'Green' },
  { name: 'Hassan Green Granite', image: '/granite_images/Hassan Green Granite.jpg', price: 52, category: 'Green' },
  { name: 'Apple Green Granite', image: '/granite_images/Apple Green Granite.webp', price: 52, category: 'Green' },

  { name: 'Tan Brown Granite', image: '/granite_images/Tan Brown Granite.jpg', price: 52, category: 'Brown' },
  { name: 'Coffee Brown Granite', image: '/granite_images/Coffee Brown Granite.webp', price: 52, category: 'Brown' },
  { name: 'Desert Brown Granite', image: '/granite_images/Desert Brown Granite.webp', price: 52, category: 'Brown' },

  { name: 'Jhansi Red Granite', image: '/granite_images/Jhansi Red Granite.webp', price: 52, category: 'Red' },
  { name: 'Lakha Red Granite', image: '/granite_images/Lakha Red Granite.webp', price: 52, category: 'Red' },
  { name: 'New Imperiala Red Granite', image: '/granite_images/New Imperiala Red Granite.jpg', category: 'Red' },

  
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


export default function Tiles() {
  const productsList = useDbProducts('Tiles', ALL_PRODUCTS);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addDemand, demands } = useDemand();
  
  // 2. Get category from URL (e.g. ?category=Black)
  const categoryFilter = searchParams.get('category') || 'All';

  // 3. Filtered List Logic
  const filteredProducts = useMemo(() => {
    if (categoryFilter === 'All') return productsList;
    return productsList.filter(p => p.category && p.category.toLowerCase() === categoryFilter.toLowerCase());
  }, [categoryFilter, productsList]);

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
        <div className="container container-heading">
          <h1>Our {categoryFilter !== 'All' ? categoryFilter : ''} Tiles Collections</h1>
          <p>Browse our premium selection of {categoryFilter.toLowerCase()} imported varieties</p>
        </div>
      </section>

      {/* Category Tabs - Responsive Slider */}
      <section className="filter-bar">
        <div className="filter-buttons-wrapper">
          <div className="filter-buttons-container">
            {['All', 'Black', 'White', 'Blue', 'Gold', 'Green', 'Brown', 'Red', 'Yellow' , 'Multicolor', 'Cream', 'Grey', 'Pink', 'Orange'].map(cat => (
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
            {productsList.loading ? (
              <ProductLoader text="Loading products..." />
            ) : filteredProducts.length === 0 ? (
              <div style={{ textAlign: 'center', width: '100%', padding: '50px 0', color: '#777' }}>
                No products found matching the selected filters.
              </div>
            ) : (
              filteredProducts.map((product) => (
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
                  <p>{product.description}</p>
                  <button 
                    className="get-quote-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      addDemand(product);
                    }}
                  >
                    {demands.some(d => d.name === product.name) ? "Remove from Requirement" : "Add to Requirement"}
                  </button>
                </div>
              </div>
            )))}
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