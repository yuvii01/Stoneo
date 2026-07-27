import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom'; // Required for URL filtering
import { GRANITE_TYPES } from '../../utils/constants';
import '../../styles/pages.css';
import SEOHead from '../../components/SEOHead';
import StonePriceSlider from '../../components/StonePriceSlider';
import { getProductSchema, getBreadcrumbSchema } from '../../utils/seo';
import { useDemand } from '../../context/DemandContext';

// 1. Updated Data with Category Column
const CSV_PRODUCTS = [

  { name: "Absolute Black Granite", "image": "/granite_images/Absolute Black Granite.webp", category: "Black" },
  { name: "Black Galaxy Granite", "image": "/granite_images/Black Galaxy Granite.webp", category: "Black" },
  { name: "Black Marine Granite", "image": "/granite_images/Black Marine Granite.webp", category: "Black" },
  { name: "Black Marcino Granite", "image": "/granite_images/Black Marcino Granite.webp", category: "Black" },
  { name: "Blue Dunes Granite", image: "/granite_images/Blue Dunes Granite.jpg", category: "Blue" },
  { name: "Colonial White Granite", "image": "/granite_images/Colonial White Granite.webp", category: "White" },
  { name: "Desert Brown Granite", "image": "/granite_images/Desert Brown Granite.webp", category: "Brown" },
  { name: "Steel Grey Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Steel-grey-granite.webp", category: "Grey" },


  { name: "P White Granite (Lunar Pearl)", "image": "/granite_images/P White Granite (Lunar Pearl).webp", category: "White" },
  { name: "Alaska White Granite", "image": "/granite_images/Alaska White Granite.webp", category: "White" },
  { name: "Black Forest Granite", "image": "/granite_images/Black Forest Granite.webp", category: "Black" },
  { name: "Viscon White Granite", "image": "/granite_images/Viscon White Granite.webp", category: "White" },
  { name: "Tan Brown Granite", image: "/granite_images/Tan Brown Granite.jpg", category: "Brown" },
  { name: "Colonial Gold Granite", "image": "/granite_images/Colonial Gold Granite.webp", category: "Gold" },
  { name: "Kuppam Green Granite", "image": "/granite_images/Kuppam Green Granite.webp", category: "Green" },
  { name: "Lavender Blue Granite", "image": "/granite_images/Lavender Blue Granite.webp", category: "Blue" },
  { name: "Coffee Brown Granite", "image": "/granite_images/Coffee Brown Granite.webp", category: "Brown" },
  { name: "Classic Paradiso Granite", "image": "/granite_images/Classic Paradiso Granite.webp", category: "Multicolor" },
  { name: "Bash Paradiso Granite", "image": "/granite_images/Bash Paradiso Granite.webp", category: "Multicolor" },
  { name: "Red Multicolor Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Red-multicolor-granite.webp", category: "Red" },
  { name: "New Kashmir White Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/New-kashmir-white-granite-1.webp", category: "White" },
  { name: "Himalayan Blue Granite", "image": "/granite_images/Himalayan Blue Granite.webp", category: "Blue" },
  { name: "Colombo Juparana Granite", "image": "/granite_images/Colombo Juparana Granite.webp", category: "Multicolor" },
  { name: "Crystal Yellow Granite", "image": "/granite_images/Crystal Yellow Granite.webp", category: "Yellow" },
  { name: "Malwada Yellow Granite", "image": "/granite_images/Malwada Yellow Granite.webp", category: "Yellow" },
  { name: "Astoria Granite", "image": "/granite_images/Astoria Granite.webp", category: "Multicolor" },
  { name: "Bala Flower Granite", "image": "/granite_images/Bala Flower Granite.webp", category: "Multicolor" },
  { name: "Copper Silk Granite", "image": "/granite_images/Copper Silk Granite.webp", category: "Brown" },
  { name: "Kotkasta Granite", "image": "/granite_images/Kotkasta Granite.webp", category: "Multicolor" },
  { name: "Maliwada Granite", "image": "/granite_images/Maliwada Granite.webp", category: "Yellow" },
  { name: "Monte Cristo Granite", "image": "/granite_images/Monte Cristo Granite.webp", category: "Multicolor" },
  { name: "Onida Orange Granite", "image": "/granite_images/Onida Orange Granite.webp", category: "Orange" },
  { name: "Royal Cream Granite", "image": "/granite_images/Royal Cream Granite.webp", category: "Cream" },
  { name: "Rue Classic Granite", "image": "/granite_images/Rue Classic Granite.webp", category: "Multicolor" },
  { name: "Tiger Skin Granite", "image": "/granite_images/Tiger Skin Granite.webp", category: "Brown" },
  { name: "Bahama Ivory Granite", "image": "/granite_images/Bahama Ivory Granite.webp", category: "Cream" },
  { name: "Cats Eye Granite", "image": "/granite_images/Cats Eye Granite.webp", category: "Brown" },
  { name: "Black Premium Granite", "image": "/granite_images/Black Premium Granite.webp", category: "Black" },
  { name: "Colonial Cream Granite", "image": "/granite_images/Colonial Cream Granite.webp", category: "Cream" },
  { name: "Ghiblee Granite", "image": "/granite_images/Ghiblee Granite.webp", category: "Multicolor" },
  { name: "Indian Aurora Granite", "image": "/granite_images/Indian Aurora Granite.webp", category: "Multicolor" },
  { name: "Ivory Fantasy Granite", "image": "/granite_images/Ivory Fantasy Granite.webp", category: "Cream" },
  { name: "Millennium Cream Granite", "image": "/granite_images/Millennium Cream Granite.webp", category: "Cream" },
  { name: "Rose Wood Granite", "image": "/granite_images/Rose Wood Granite.webp", category: "Brown" },
  { name: "Sea Waves Granite", "image": "/granite_images/Sea Waves Granite.webp", category: "Grey" },
  { name: "Mango Granite", "image": "/granite_images/Mango Granite.webp", category: "Yellow" },


  { name: "Lava Oro Granite", "image": "/granite_images/Lava Oro Granite.webp", category: "Gold" },
  { name: "Donna Grey Granite", "image": "/granite_images/Donna Grey Granite.webp", category: "Grey" },
  { name: "Indian Copacabana Granite", "image": "/granite_images/Indian Copacabana Granite.webp", category: "Multicolor" },
  { name: "Alabaster White Granite", "image": "/granite_images/Alabaster White Granite.webp", category: "White" },
  { name: "Alpinus White Granite", "image": "/granite_images/Alpinus White Granite.webp", category: "White" },
  { name: "Bianco White Granite", "image": "/granite_images/Bianco White Granite.webp", category: "White" },
  { name: "Crystal White Granite", "image": "/granite_images/Crystal White Granite.webp", category: "White" },
  { name: "French White Granite", "image": "/granite_images/French White Granite.webp", category: "White" },
  { name: "Imperial White Granite", "image": "/granite_images/Imperial White Granite.webp", category: "White" },
  { name: "Indian Cappuccino White Granite", "image": "/granite_images/Indian Cappuccino White Granite.webp", category: "White" },
  { name: "Kuppam White Granite", "image": "/granite_images/Kuppam White Granite.webp", category: "White" },
  { name: "Moon White Granite", "image": "/granite_images/Moon White Granite.webp", category: "White" },
  { name: "River White Granite", "image": "/granite_images/River White Granite.webp", category: "White" },
  { name: "Thunder White Granite", "image": "/granite_images/Thunder White Granite.webp", category: "White" },
  { name: "Titanium White Granite", "image": "/granite_images/Titanium White Granite.webp", category: "White" },
  { name: "New Ivory White Granite", "image": "/granite_images/New Ivory White Granite.webp", category: "White" },
  { name: "S White Granite", "image": "/granite_images/S White Granite.webp", category: "White" },
  { name: "Sadarali Granite", "image": "/granite_images/Sadarali Granite.webp", category: "Grey" },
  { name: "Epic White Granite", "image": "/granite_images/Epic White Granite.webp", category: "White" },
  { name: "Monalisa Granite", "image": "/granite_images/Monalisa Granite.webp", category: "Multicolor" },
  { name: "Sunset Canyon Granite", "image": "/granite_images/Sunset Canyon Granite.webp", category: "Brown" },
  { name: "Stream White Granite", "image": "/granite_images/Stream White Granite.webp", category: "White" },
  { name: "Mariyam White Granite", "image": "/granite_images/Mariyam White Granite.webp", category: "White" },
  { name: "Atlantic White Granite", "image": "/granite_images/Atlantic White Granite.webp", category: "White" },
  { name: "Alaska Red Granite", "image": "/granite_images/Alaska Red Granite.webp", category: "Red" },
  { name: "Bruno Red Granite", "image": "/granite_images/Bruno Red Granite.webp", category: "Red" },
  { name: "Jhansi Red Granite", "image": "/granite_images/Jhansi Red Granite.webp", category: "Red" },
  { name: "Lakha Red Granite", "image": "/granite_images/Lakha Red Granite.webp", category: "Red" },
  { name: "New Imperial Red Granite", "image": "/granite_images/New Imperial Red Granite.webp", category: "Red" },
  { name: "Wine Red Granite", "image": "/granite_images/Wine Red Granite.webp", category: "Red" },
  { name: "Chima Pink Granite", "image": "/granite_images/Chima Pink Granite.webp", category: "Pink" },


  { name: "Rosy Pink Granite", "image": "/granite_images/Rosy Pink Granite.webp", category: "Pink" },
  { name: "Astoria Pink Granite", "image": "/granite_images/Astoria Pink Granite.webp", category: "Pink" },
  { name: "Ghiblee Pink Granite", "image": "/granite_images/Ghiblee Pink Granite.webp", category: "Pink" },
  { name: "Imperial Pink Granite", "image": "/granite_images/Imperial Pink Granite.webp", category: "Pink" },
  { name: "Romantic Pink Granite", "image": "/granite_images/Romantic Pink Granite.webp", category: "Pink" },
  { name: "Strawberry Pink Granite", "image": "/granite_images/Strawberry Pink Granite.webp", category: "Pink" },
  { name: "Alaska Pink Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/03/Alaska-pink-granite.webp", category: "Pink" },
  { name: "Narlai Grey Granite", "image": "/granite_images/Narlai Grey Granite.webp", category: "Grey" },
  { name: "Kuppam Grey Granite", "image": "/granite_images/Kuppam Grey Granite.webp", category: "Grey" },
  { name: "Apple Green Granite", "image": "/granite_images/Apple Green Granite.webp", category: "Green" },
  { name: "Desert Green Granite", "image": "/granite_images/Desert Green Granite.webp", category: "Green" },
  { name: "French Green Granite", "image": "/granite_images/French Green Granite.webp", category: "Green" },
  { name: "Green Pearl Granite", "image": "/granite_images/Green Pearl Granite.webp", category: "Green" },
  { name: "Royal Green Granite", "image": "/granite_images/Royal Green Granite.webp", category: "Green" },
  { name: "Hassan Green Granite", image: "/granite_images/Hassan Green Granite.jpg", category: "Green" },
  { name: "Mungaria Green Granite", "image": "/granite_images/Mungaria Green Granite.webp", category: "Green" },
  { name: "Olivia Green Granite", "image": "/granite_images/Olivia Green Granite.webp", category: "Green" },
  { name: "Alaska Gold Granite", "image": "/granite_images/Alaska Gold Granite.webp", category: "Gold" },
  { name: "Bianco Gold Granite", "image": "/granite_images/Bianco Gold Granite.webp", category: "Gold" },
  { name: "Desert Gold Granite", "image": "/granite_images/Desert Gold Granite.webp", category: "Gold" },
  { name: "Magma Gold Granite", "image": "/granite_images/Magma Gold Granite.webp", category: "Gold" },
  { name: "Merry Gold Granite", "image": "/granite_images/Merry Gold Granite.webp", category: "Gold" },
  { name: "Titanium Gold Granite", "image": "/granite_images/Titanium Gold Granite.webp", category: "Gold" },
  { name: "Astoria Gold Granite", "image": "/granite_images/Astoria Gold Granite.webp", category: "Gold" },
  { name: "Fusion Gold Granite", "image": "/granite_images/Fusion Gold Granite.webp", category: "Gold" },
  { name: "Golden Oak Granite", "image": "/granite_images/Golden Oak Granite.webp", category: "Gold" },
  { name: "Imperial Gold Granite", "image": "/granite_images/Imperial Gold Granite.webp", category: "Gold" },
  { name: "Ivory Gold Granite", "image": "/granite_images/Ivory Gold Granite.webp", category: "Gold" },
  { name: "Parada Gold Granite", "image": "/granite_images/Parada Gold Granite.webp", category: "Gold" },
  { name: "River Gold Granite", "image": "/granite_images/River Gold Granite.webp", category: "Gold" },
  { name: "Shivakashi Gold Granite", "image": "/granite_images/Shivakashi Gold Granite.webp", category: "Gold" },
  { name: "Ivory Chiffon Granite", "image": "/granite_images/Ivory Chiffon Granite.webp", category: "Cream" },
  { name: "Exotic Gold Granite", "image": "/granite_images/Exotic Gold Granite.webp", category: "Gold" },
  { name: "Armani Gold Granite", "image": "/granite_images/Armani Gold Granite.webp", category: "Gold" },
  { name: "Bhama Gold Granite", "image": "/granite_images/Bhama Gold Granite.webp", category: "Gold" },
  { name: "Z Brown Granite", "image": "/granite_images/Z Brown Granite.webp", category: "Brown" },
  { name: "Baltic Brown Granite", "image": "/granite_images/Baltic Brown Granite.webp", category: "Brown" },


  { name: "Ivory Brown Granite", "image": "/granite_images/Ivory Brown Granite.webp", category: "Brown" },
  { name: "Sapphire Brown Granite", "image": "/granite_images/Sapphire Brown Granite.webp", category: "Brown" },
  { name: "Sparkle Brown Granite", "image": "/granite_images/Sparkle Brown Granite.webp", category: "Brown" },
  { name: "Imperial Blue Granite", "image": "/granite_images/Imperial Blue Granite.webp", category: "Blue" },
  { name: "Koliwada Blue Granite", "image": "/granite_images/Koliwada Blue Granite.webp", category: "Blue" },
  { name: "Flash Blue Granite", "image": "/granite_images/Flash Blue Granite.webp", category: "Blue" },
  { name: "Indian Blue Pearl Granite", "image": "/granite_images/Indian Blue Pearl Granite.webp", category: "Blue" },
  { name: "Vizag Blue Granite", "image": "/granite_images/Vizag Blue Granite.webp", category: "Blue" },
  { name: "Blue Ocean Granite", "image": "/granite_images/Blue Ocean Granite.jpg", category: "Blue" },
  { name: "Black Beauty Granite", "image": "/granite_images/Black Beauty Granite.webp", category: "Black" },
  { name: "Black Marquina Granite", "image": "/granite_images/Black Marquina Granite.webp", category: "Black" },
  { name: "Wave Black Granite", "image": "/granite_images/Wave Black Granite.webp", category: "Black" },
  { name: "Zebra Black Granite", "image": "/granite_images/Zebra Black Granite.webp", category: "Black" },
  { name: "Fusion Black Granite", "image": "/granite_images/Fusion Black Granite.webp", category: "Black" },
  { name: "Impala Black Granite", "image": "/granite_images/Impala Black Granite.webp", category: "Black" },
  { name: "Jet Black Granite", "image": "/granite_images/Jet Black Granite.webp", category: "Black" },
  { name: "Nova Black Granite", "image": "/granite_images/Nova Black Granite.webp", category: "Black" },
  { name: "Fish Black Granite", "image": "/granite_images/Fish Black Granite.webp", category: "Black" },
  { name: "Titanium Black Granite", "image": "/granite_images/Titanium Black Granite.webp", category: "Black" },
  { name: "Silver Waves Granite", "image": "/granite_images/Silver Waves Granite.webp", category: "Grey" },

];

const DEFAULT_DESCRIPTION = 'Premium quality granite, sourced from verified quarries.';
const DEFAULT_FEATURES = ['Natural stone finish', 'Scratch resistant', 'Easy to maintain'];

// Build Lookup Map
const graniteTypesMap = Object.fromEntries(
  GRANITE_TYPES.map((g) => [g.name.toLowerCase().trim(), g])
);

const TOUCH_OPTIONS = ["Polished", "Honed", "Leather", "Flamed", "Lapato", "Bush Hammered", "Antique", "Sandblasted"];
const ORIGIN_OPTIONS = ["South India", "North India", "Imported", "Alaska"];
const THICKNESS_RANGE = [16, 18, 20, 22, 24, 26, 28, 30];

// Merge Data
const ALL_PRODUCTS = CSV_PRODUCTS.map((csvItem, index) => {
  const key = csvItem.name.toLowerCase().trim();
  const existing = graniteTypesMap[key];

  const origin = csvItem.name.toLowerCase().includes('alaska')
    ? 'Alaska'
    : ORIGIN_OPTIONS[index % ORIGIN_OPTIONS.length];
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
    origin,
    price,
    minPrice: Math.max(50, price - 40),
    maxPrice: Math.min(300, price + 40),
    touch,
    thickness: THICKNESS_RANGE
  };
});

const MIN_PRICE = 50;
const MAX_PRICE = 300;

export default function Granite() {
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

  // 2. Get category from URL (e.g. ?category=Black)
  const categoryFilter = searchParams.get('category') || 'All';

  const [filters, setFilters] = useState({
    origin: [],
    color: [],
    touch: [],
    thickness: [],
    maxPrice: 150
  });

  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'south') {
      setFilters(prev => ({ ...prev, origin: ['South India'] }));
    } else if (type === 'north') {
      setFilters(prev => ({ ...prev, origin: ['North India'] }));
    } else if (type === 'imported') {
      setFilters(prev => ({ ...prev, origin: ['Imported'] }));
    } else if (type === 'alaska') {
      setFilters(prev => ({ ...prev, origin: ['Alaska'] }));
    }
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

  const typeParam = searchParams.get('type');

  // 3. Filtered List Logic
  const filteredProducts = useMemo(() => {
    return ALL_PRODUCTS.filter(p => {
      const matchesUrlCategory = categoryFilter === 'All' || p.category.toLowerCase() === categoryFilter.toLowerCase();
      const matchesColor = (filters.color || []).length === 0 || (filters.color || []).includes(p.category);
      const matchesOrigin = (filters.origin || []).length === 0 || (filters.origin || []).includes(p.origin);
      const matchesTouch = (filters.touch || []).length === 0 || (filters.touch || []).some(t => p.touch.includes(t));
      const matchesThickness = (filters.thickness || []).length === 0 || (filters.thickness || []).some(th => p.thickness && p.thickness.includes(th));
      const selectedPrice = filters.maxPrice !== undefined ? filters.maxPrice : 150;
      const matchesPrice = (p.minPrice || (Number(p.price) - 50)) <= selectedPrice && (p.maxPrice || (Number(p.price) + 50)) >= selectedPrice;
      const matchesType = !typeParam || typeParam !== 'alaska' || p.name.toLowerCase().includes('alaska');

      return matchesUrlCategory && matchesColor && matchesOrigin && matchesTouch && matchesThickness && matchesPrice && matchesType;
    });
  }, [categoryFilter, filters, typeParam]);

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
        pageKey="granite"
        structured={getBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Granite', path: '/category/granite' }
        ])}
      />
      <div className="page products-page">
        <section className="granite-header page-header">
          <div className="container container-heading">
            <h1>Our {typeParam === 'alaska' ? 'Alaska' : categoryFilter !== 'All' ? categoryFilter : ''} Granite Collections</h1>
            <p>Browse our premium selection of {typeParam === 'alaska' ? 'alaska' : categoryFilter.toLowerCase()} varieties</p>
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
                <h4>Types</h4>
                <div className="filter-checkbox-group">
                  {['South India', 'North India', 'Imported', 'Alaska'].map(org => (
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
                <StonePriceSlider
                  minPrice={MIN_PRICE}
                  maxPrice={MAX_PRICE}
                  currentMaxPrice={filters.maxPrice}
                  onChange={(val) => handleFilterChange('maxPrice', val)}
                />
              </div>

              <div className="filter-section">
                <h4>Color</h4>
                <div className="color-swatches">
                  {[
                    { name: 'Black', hex: '#000000' },
                    { name: 'White', hex: '#ffffff' },
                    { name: 'Blue', hex: '#3a5a9c' },
                    { name: 'Gold', hex: '#d4af37' },
                    { name: 'Green', hex: '#2e8b57' },
                    { name: 'Brown', hex: '#8b4513' },
                    { name: 'Red', hex: '#b22222' },
                    { name: 'Yellow', hex: '#ffd700' },
                    { name: 'Multicolor', hex: 'linear-gradient(45deg, red, blue, green)' },
                    { name: 'Cream', hex: '#fffdd0' },
                    { name: 'Grey', hex: '#808080' },
                    { name: 'Pink', hex: '#ffc0cb' },
                    { name: 'Orange', hex: '#ffa500' }
                  ].map(c => (
                    <div
                      key={c.name}
                      className={`color-swatch-wrapper ${(filters.color || []).includes(c.name) ? 'active' : ''}`}
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
                        checked={(filters.touch || []).includes(tch)}
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
                        checked={(filters.thickness || []).includes(th)}
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
              {(filters.origin.length > 0 || filters.color.length > 0 || filters.touch.length > 0 || filters.thickness.length > 0 || filters.minPrice > 50 || filters.maxPrice < 250 || categoryFilter !== 'All') && (
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
                      setFilters({ origin: [], color: [], touch: [], thickness: [] });
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

        {/* Granite Buying Guide - Slider */}
        <section className="guide-slider-section" style={{ backgroundImage: 'url("https://www.regattagranitesindia.com/wp-content/uploads/2026/04/Stream-White-Swatch.webp")', padding: '60px 0' }}>
          <div className="container">
            <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '40px' }}>Granite Buying Guide</h2>

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
                    <h3 style={{ fontSize: '28px', marginBottom: '20px', color: '#a45040' }}>What is Granite?</h3>
                    <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#333' }}>
                      Granite is one of the most popular natural stones, available in 100+ unique varieties worldwide. Each piece has distinctive designs, shades, and color combinations. Prized for exceptional durability, strength, and resistance to acids, alkalis, and extreme temperatures - making it perfect for residential and commercial applications.
                    </p>
                  </div>
                )}

                {currentSlide === 1 && (
                  <div>
                    <h3 style={{ fontSize: '28px', marginBottom: '20px', color: '#a45040' }}>Selection & Testing</h3>
                    <div style={{ fontSize: '16px', lineHeight: '1.9', color: '#333' }}>
                      <p><strong>🏢 Visit Showrooms:</strong> Explore varieties under one roof to find the perfect match</p>
                      <p><strong>📦 Collect Samples:</strong> Take samples to your space - compare colors and designs in actual lighting</p>
                      <p><strong>💧 Porosity Test:</strong> Pour water drops, wait 15 min. If traces remain, too porous for kitchens</p>
                      <p><strong>🍋 Acid Test:</strong> Place lemon overnight. Dullness indicates poor acid resistance</p>
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
                    <h3 style={{ fontSize: '28px', marginBottom: '30px', color: '#a45040' }}>Ready to Choose Your Granite?</h3>
                    <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#333', marginBottom: '25px' }}>
                      With proper selection and maintenance, granite lasts for decades. Our experts are ready to help you find the perfect granite for your project.
                    </p>
                    <div style={{ fontSize: '16px', color: '#555' }}>
                      {/* <p>📞 <strong>Call:</strong> +91-9256901351</p> */}
                      <p>📞 <strong>Call:</strong> +91-1234567890</p>
                      {/* <p>✉️ <strong>Email:</strong> infostoneo@gmail.com</p> */}
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