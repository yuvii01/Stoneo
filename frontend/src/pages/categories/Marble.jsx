import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom'; // Required for URL filtering
import '../../styles/pages.css';
import SEOHead from '../../components/SEOHead';
import { getProductSchema, getBreadcrumbSchema } from '../../utils/seo';
import { useDemand } from '../../context/DemandContext';

const MARBLE_TYPES = [];

// 1. Updated Data with Category Column
const CSV_PRODUCTS = [
  { "name": "Statuario", "image": "https://petrosstone.com/wp-content/uploads/2021/06/Statuario.jpg", "category": "White" },
  { "name": "Statuario Venatino", "image": "https://petrosstone.com/wp-content/uploads/2021/06/Statuarietto-Venatino.jpg", "category": "White" },
  { "name": "Carrara White", "image": "https://petrosstone.com/wp-content/uploads/2021/06/Carrara-Marble.jpg", "category": "White" },
  { "name": "Calacatta White", "image": "https://petrosstone.com/wp-content/uploads/2022/01/8-2.png", "category": "White" },
  { "name": "Carrara Bardiglio", "image": "https://petrosstone.com/wp-content/uploads/2022/04/15.png", "category": "Grey" },
  { "name": "Bianco Beige", "image": "https://petrosstone.com/wp-content/uploads/2022/04/21.png", "category": "Beige" },
  { "name": "Venatino", "image": "https://petrosstone.com/wp-content/uploads/2022/04/1-2.png", "category": "White" },
  { "name": "Botticino Sicilia", "image": "https://petrosstone.com/wp-content/uploads/2022/04/18-1.png", "category": "Beige" },
  { "name": "Armani Brown", "image": "https://petrosstone.com/wp-content/uploads/2022/04/27.png", "category": "Brown" },
  { "name": "Black Portoro Waves", "image": "https://petrosstone.com/wp-content/uploads/2022/04/11.png", "category": "Black" },
  { "name": "Crema Marfil", "image": "https://petrosstone.com/wp-content/uploads/2021/06/Bianco-Marfil-Marble-Best-for-Flooring.jpg", "category": "Beige" },
  { "name": "Dark Emperador", "image": "https://petrosstone.com/wp-content/uploads/2021/12/1-1.png", "category": "Brown" },
  { "name": "Calacatta Gold", "image": "https://petrosstone.com/wp-content/uploads/2021/12/11.png", "category": "White" },
  { "name": "Nero Portoro", "image": "https://petrosstone.com/wp-content/uploads/2021/12/1.png", "category": "Black" },
  { "name": "Golden Portoro Waterfall", "image": "https://petrosstone.com/wp-content/uploads/2022/04/10-1.png", "category": "Black" },
  { "name": "Black Marquina", "image": "https://petrosstone.com/wp-content/uploads/2022/04/7.png", "category": "Black" },
  { "name": "Perlato", "image": "https://petrosstone.com/wp-content/uploads/2022/04/Copy-of-Copyrights-%C2%A9-2021-Petros-Stone-LLP-All-Rights-Reserved.png", "category": "Beige" },
  { "name": "Dyna", "image": "https://petrosstone.com/wp-content/uploads/2022/04/11-1.png", "category": "Beige" },
  { "name": "Michel Angelo", "image": "https://petrosstone.com/wp-content/uploads/2021/06/Michelangelo-Marble.jpg", "category": "White" },
  { "name": "Perlato Royal", "image": "https://petrosstone.com/wp-content/uploads/2022/04/6-4.png", "category": "Beige" },

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





  { "name": "Travertine", "image": "https://petrosstone.com/wp-content/uploads/2022/04/2-2.png", "category": "Beige" },
  { "name": "Arabescato", "image": "https://petrosstone.com/wp-content/uploads/2022/04/30.png", "category": "White" },
  { "name": "Chianti Gray", "image": "https://petrosstone.com/wp-content/uploads/2022/04/12-1.png", "category": "Grey" },
  { "name": "Champagne Brown", "image": "https://petrosstone.com/wp-content/uploads/2022/04/14-1.png", "category": "Brown" },
  { "name": "Brown Emperado", "image": "https://petrosstone.com/wp-content/uploads/2022/04/13-1.png", "category": "Brown" },
  { "name": "Bronzite", "image": "https://petrosstone.com/wp-content/uploads/2022/04/16.png", "category": "Brown" },
  { "name": "Brescia Aurora", "image": "https://petrosstone.com/wp-content/uploads/2022/04/17-1.png", "category": "Beige" },
  { "name": "Brescia Oniciata", "image": "https://petrosstone.com/wp-content/uploads/2022/04/15-2.png", "category": "Brown" },
  { "name": "Botticino Fiorito", "image": "https://petrosstone.com/wp-content/uploads/2022/04/19-1.png", "category": "Beige" },
  { "name": "Bianco Marfil", "image": "https://petrosstone.com/wp-content/uploads/2022/04/22.png", "category": "White" },
  { "name": "Beige Serpeggian", "image": "https://petrosstone.com/wp-content/uploads/2022/04/23.png", "category": "Beige" },
  { "name": "Baltic Sea Wave", "image": "https://petrosstone.com/wp-content/uploads/2022/04/24.png", "category": "Grey" },
  { "name": "Baltic Pink", "image": "https://petrosstone.com/wp-content/uploads/2022/04/25.png", "category": "Pink" },
  { "name": "Armani Grey", "image": "https://petrosstone.com/wp-content/uploads/2022/04/28.png", "category": "Grey" },
  { "name": "Antique Beige", "image": "https://petrosstone.com/wp-content/uploads/2022/04/29.png", "category": "Beige" },
  { "name": "Amazonite", "image": "https://petrosstone.com/wp-content/uploads/2022/04/31.png", "category": "Green" },
  { "name": "Amazon White", "image": "https://petrosstone.com/wp-content/uploads/2022/04/32.png", "category": "White" },
  { "name": "Myra Beige", "image": "https://petrosstone.com/wp-content/uploads/2022/04/7-2.png", "category": "Beige" },
  { "name": "Pink Valencia", "image": "https://petrosstone.com/wp-content/uploads/2022/04/3-2.png", "category": "Pink" },
  { "name": "Autumn Yellow", "image": "https://petrosstone.com/wp-content/uploads/2022/04/26.png", "category": "Yellow" },
  { "name": "Black Forest", "image": "https://petrosstone.com/wp-content/uploads/2021/06/Black-Lava-Marble-3.jpg", "category": "Black" },
  { "name": "Palissandro", "image": "https://petrosstone.com/wp-content/uploads/2022/04/5-2.png", "category": "Grey" },
  { "name": "Botanic Green", "image": "https://petrosstone.com/wp-content/uploads/2022/04/20-1.png", "category": "Green" },
  { "name": "Calacatta Borghini", "image": "https://petrosstone.com/wp-content/uploads/2021/06/Calacatta-Borghini-Marble.jpg", "category": "White" },
  { "name": "Athens Beige", "image": "https://petrosstone.com/wp-content/uploads/2022/04/3-3.png", "category": "Beige" },


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
  { "name": "Udaipur pink marble", "image": "https://www.bhandarimarblecompany.com/wp-content/uploads/2024/05/udaipur-pink-marble-300x300.png", "category": "Pink", "place": "India" },

  { "name": "Golden Spider", "image": "https://petrosstone.com/wp-content/uploads/2022/04/2-3.png", "category": "Brown" },
  { "name": "Equator White", "image": "https://petrosstone.com/wp-content/uploads/2021/06/Equator-White-Marble.jpg", "category": "White" },
  { "name": "Giallo Siena", "image": "https://petrosstone.com/wp-content/uploads/2022/04/1-3.png", "category": "Yellow" },
  { "name": "Oro Calacatta", "image": "https://petrosstone.com/wp-content/uploads/2021/06/Calacatta-Oro-Italian-Marble-for-Flooring.jpg", "category": "White" },
  { "name": "Grigio Carrara", "image": "https://petrosstone.com/wp-content/uploads/2022/04/8-1.png", "category": "Grey" },

];

const DEFAULT_DESCRIPTION = 'Premium quality marble, sourced from verified quarries.';
const DEFAULT_FEATURES = ['Natural stone finish', 'Scratch resistant', 'Easy to maintain'];

// Build Lookup Map
const marbleTypesMap = Object.fromEntries(
  MARBLE_TYPES.map((g) => [g.name.toLowerCase().trim(), g])
);

const TOUCH_OPTIONS = ["Polished", "Honed", "Leathered", "Brushed", "Bush-Hammered", "Sandblasted"];
const ORIGIN_OPTIONS = ["Makrana white", "Katni", "Ambaji", "Rajnagar", "Udaipur green", "Kishangarh", "Jaisalmer Yellow", "Italian", "Spanish", "Vietnamese", "Turkish", "Greece"];
const THICKNESS_RANGE = [16, 18, 20, 22, 24, 26, 28, 30];

// Merge Data
const ALL_PRODUCTS = CSV_PRODUCTS.map((csvItem, index) => {
  const key = csvItem.name.toLowerCase().trim();
  const existing = marbleTypesMap[key];

  const origin = ORIGIN_OPTIONS[index % ORIGIN_OPTIONS.length];
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
    touch,
    thickness: THICKNESS_RANGE
  };
});

export default function Marble() {
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
    origin: [],
    color: [],
    touch: [],
    thickness: []
  });

  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'imported') {
      setFilters(prev => ({ ...prev, origin: ['Italian', 'Spanish', 'Vietnamese', 'Turkish', 'Greece'] }));
    } else if (type === 'indian') {
      setFilters(prev => ({ ...prev, origin: ['Makrana white', 'Katni', 'Ambaji', 'Rajnagar', 'Udaipur green', 'Kishangarh', 'Jaisalmer Yellow'] }));
    } else if (type === 'statuario') {
      setFilters(prev => ({ ...prev, origin: ['Italian'] }));
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

  // 3. Filtered List Logic
  const filteredProducts = useMemo(() => {
    return ALL_PRODUCTS.filter(p => {
      const matchesUrlCategory = categoryFilter === 'All' || p.category.toLowerCase() === categoryFilter.toLowerCase();
      const matchesColor = filters.color.length === 0 || filters.color.includes(p.category);
      const matchesOrigin = filters.origin.length === 0 || filters.origin.includes(p.origin);
      const matchesTouch = filters.touch.length === 0 || filters.touch.some(t => p.touch.includes(t));
      const matchesThickness = filters.thickness.length === 0 || filters.thickness.some(th => p.thickness.includes(th));

      return matchesUrlCategory && matchesColor && matchesOrigin && matchesTouch && matchesThickness;
    });
  }, [categoryFilter, filters]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
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
        pageKey="marble"
        structured={getBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Marble', path: '/category/marble' }
        ])}
      />
      <div className="page products-page">
        <section className="marble-header page-header">
          <div className="container container-heading">
            <h1>Our {categoryFilter !== 'All' ? categoryFilter : ''} Marble Collections</h1>
            <p>Browse our premium selection of {categoryFilter.toLowerCase()} imported varieties</p>
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
                
                <h5 style={{ fontSize: '14px', margin: '10px 0', color: '#555' }}>Imported</h5>
                <div className="filter-checkbox-group" style={{ marginBottom: '15px' }}>
                  {['Italian', 'Spanish', 'Vietnamese', 'Turkish', 'Greece'].map(org => (
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

                <h5 style={{ fontSize: '14px', margin: '10px 0', color: '#555' }}>Indian</h5>
                <div className="filter-checkbox-group">
                  {['Makrana white', 'Katni', 'Ambaji', 'Rajnagar', 'Udaipur green', 'Kishangarh', 'Jaisalmer Yellow'].map(org => (
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

        {/* Marble Buying Guide - Slider */}
        <section className="guide-slider-section" style={{ backgroundImage: 'url("https://www.regattamarblesindia.com/wp-content/uploads/2026/04/Stream-White-Swatch.webp")', padding: '60px 0' }}>
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
                    <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#333' }}>
                      Marble is one of the most popular natural stones, available in 100+ unique varieties worldwide. Each piece has distinctive designs, shades, and color combinations. Prized for exceptional durability, strength, and resistance to acids, alkalis, and extreme temperatures - making it perfect for residential and commercial applications.
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
                    <h3 style={{ fontSize: '28px', marginBottom: '30px', color: '#a45040' }}>Ready to Choose Your Marble?</h3>
                    <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#333', marginBottom: '25px' }}>
                      With proper selection and maintenance, marble lasts for decades. Our experts are ready to help you find the perfect marble for your project.
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