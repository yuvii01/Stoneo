import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import VisualSearchModal from './VisualSearchModal';
import { useDemand } from '../context/DemandContext';
import '../styles/header.css';

export default function Header() {
  const { demands } = useDemand();
  const location = useLocation();
  const isRoyalPage = location.pathname === '/royal-gem-stones';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isApplicationsOpen, setIsApplicationsOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isVisualSearchOpen, setIsVisualSearchOpen] = useState(false);

  const navRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
        setIsApplicationsOpen(false);
        setIsProductsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedInsideNav = navRef.current && navRef.current.contains(event.target);
      const clickedHamburger = buttonRef.current && buttonRef.current.contains(event.target);

      if (!clickedInsideNav && !clickedHamburger) {
        setIsMenuOpen(false);
        setIsApplicationsOpen(false);
        setIsProductsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsApplicationsOpen(false);
    setIsProductsOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => {
      const next = !prev;
      if (!next) {
        setIsApplicationsOpen(false);
        setIsProductsOpen(false);
      }
      return next;
    });
  };

  const effectiveScrolled = isRoyalPage ? false : isScrolled;

  return (
    <header className={`header ${effectiveScrolled ? 'scrolled' : ''} ${isRoyalPage ? 'royal-theme' : ''}`}>
      <div className="header-container">
        <div className="logo-div">
          <Link to="/" className="logo" onClick={closeMenus}>
            {/* <img
              src={isScrolled ? '/logo2.png' : '/logo_white.png'}
              alt="STONEO INDIA Logo"
              className="logo-img"
            /> */}
            {/* <img
              src="https://via.placeholder.com/150x50?text=Demo+Logo"
              alt="Demo Logo"
              className="logo-img"
            /> */}
            <span className="text-logo" style={{ color: effectiveScrolled ? '#000' : '#fff', fontSize: '22px', display: 'flex', alignItems: 'center', gap: '10px', paddingTop: "10px" }}>
              {effectiveScrolled ? (
                <>
                  <img src="/logos/logo_dark_transparent.png" alt="Logo Dark" style={{ height: '60px', objectFit: 'contain' }} />
                  <img src="/logos/detail_dark_transparent.png" alt="Details Dark" style={{ height: '35px', objectFit: 'contain' }} />
                </>
              ) : (
                <>
                  <img src="/logos/logo_light_transparent.png" alt="Logo Light" style={{ height: '60px', objectFit: 'contain' }} />
                  <img src="/logos/detail_light_transparent.png" alt="Details Light" style={{ height: '35px', objectFit: 'contain' }} />
                </>
              )}
            </span>
          </Link>
        </div>

        <div className="search-bar-container">
          <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" className="search-bar-input" placeholder="Search items for your project" />
          <div className="camera-icon-container" onClick={() => setIsVisualSearchOpen(true)}>
            <svg className="camera-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
              <circle cx="12" cy="13" r="4"></circle>
            </svg>
          </div>
        </div>

        <button
          ref={buttonRef}
          type="button"
          className={`menu-toggle ${isMenuOpen ? 'open' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          <img
            src={effectiveScrolled ? '/hamburger.png' : '/hamburger_white.png'}
            alt=""
            className="hamburger"
          />
        </button>

        <nav ref={navRef} className={`nav ${isMenuOpen ? 'active' : ''}`}>
          <div className="search-bar-container mobile-search-bar">
            <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" className="search-bar-input" placeholder="Search items for your project" />
            <div className="camera-icon-container" onClick={(e) => { e.preventDefault(); setIsVisualSearchOpen(true); closeMenus(); }}>
              <svg className="camera-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
              </svg>
            </div>
          </div>

          <Link
            to="/"
            className="nav-link"
            onClick={() => {
              closeMenus();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            Home
          </Link>

          <div
            className="nav-item dropdown"
            onMouseEnter={() => window.innerWidth > 768 && setIsApplicationsOpen(true)}
            onMouseLeave={() => window.innerWidth > 768 && setIsApplicationsOpen(false)}
          >
            <span
              className="nav-link dropdown-toggle"
              onClick={() => setIsApplicationsOpen(!isApplicationsOpen)}
              role="button"
              aria-expanded={isApplicationsOpen}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsApplicationsOpen(!isApplicationsOpen);
                }
              }}
            >
              Applications ▾
            </span>

            <div className={`dropdown-menu mega-menu ${isApplicationsOpen ? 'show' : ''}`}>
              <div className="mega-menu-column">
                <h3 className="mega-menu-heading">Interior</h3>
                <Link to="/category/flooring" onClick={closeMenus}>Flooring</Link>
                <Link to="/category/wall-cladding" onClick={closeMenus}>Wall Cladding</Link>
                <Link to="/category/kitchen-countertops" onClick={closeMenus}>Kitchen Countertops</Link>
                <Link to="/category/bathroom-vanity" onClick={closeMenus}>Bathroom & Vanity</Link>
                <Link to="/category/staircase" onClick={closeMenus}>Staircase</Link>
                <Link to="/category/pooja-room-temples" onClick={closeMenus}>Pooja Room & Temples</Link>
                <Link to="/category/table-tops-furniture" onClick={closeMenus}>Table Tops & Furniture</Link>
              </div>

              <div className="mega-menu-column">
                <h3 className="mega-menu-heading">Exterior</h3>
                <Link to="/category/elevation-facade-cladding" onClick={closeMenus}>Elevation/Facade Cladding</Link>
                <Link to="/category/outdoor-flooring-paving" onClick={closeMenus}>Outdoor Flooring & Paving</Link>
                <Link to="/category/garden-landscaping" onClick={closeMenus}>Garden & Landscaping</Link>
                <Link to="/category/driveways-pathways" onClick={closeMenus}>Driveways & Pathways</Link>
                <Link to="/category/swimming-pool-areas" onClick={closeMenus}>Swimming Pool Areas</Link>
              </div>
            </div>
          </div>

          <div
            className="nav-item dropdown"
            onMouseEnter={() => window.innerWidth > 768 && setIsProductsOpen(true)}
            onMouseLeave={() => window.innerWidth > 768 && setIsProductsOpen(false)}
          >
            <span
              className="nav-link dropdown-toggle"
              onClick={() => setIsProductsOpen(!isProductsOpen)}
              role="button"
              aria-expanded={isProductsOpen}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsProductsOpen(!isProductsOpen);
                }
              }}
            >
              Products ▾
            </span>

            <div className={`dropdown-menu mega-menu ${isProductsOpen ? 'show' : ''}`} style={{ minWidth: '850px' }}>

              {/* Column 1: Natural Surfaces */}
              <div className="mega-menu-column">
                <h3 className="mega-menu-heading">Natural Surfaces</h3>

                <Link to="/category/granite" onClick={closeMenus} className="mega-menu-subheading-link">Granite &rsaquo;</Link>
                <Link to="/category/granite?type=south" onClick={closeMenus}>South India Granites</Link>
                <Link to="/category/granite?type=north" onClick={closeMenus}>North India Granites</Link>
                <Link to="/category/granite?type=imported" onClick={closeMenus}>Imported Granites</Link>
                {/* <Link to="/category/granite-tiles" onClick={closeMenus}>Granite Tiles</Link> */}

                <Link to="/category/marble" onClick={closeMenus} className="mega-menu-subheading-link">Marble &rsaquo;</Link>
                <Link to="/category/marble?type=imported" onClick={closeMenus}>Imported Marble</Link>
                <Link to="/category/marble?type=indian" onClick={closeMenus}>Indian Marble</Link>
                <Link to="/category/marble?type=statuario" onClick={closeMenus}>Statuario</Link>


                <Link to="/category/sandstone" onClick={closeMenus} className="mega-menu-subheading-link">Sandstones &rsaquo;</Link>
                <Link to="/category/sandstone?type=kota_stone" onClick={closeMenus}>Kota Stone</Link>
                <Link to="/category/sandstone?type=agra_sandstone" onClick={closeMenus}>Agra Sandstone</Link>
                <Link to="/category/sandstone?type=raj_green_sandstone" onClick={closeMenus}>Raj Green Sandstone</Link>
              </div>

              {/* Column 2: Engineered Surfaces */}
              <div className="mega-menu-column">
                <h3 className="mega-menu-heading">Engineered Surfaces</h3>

                <Link to="/category/tiles" onClick={closeMenus} className="mega-menu-subheading-link">Tiles &rsaquo;</Link>
                <Link to="/category/tiles-vitrified" onClick={closeMenus}>Vitrified Tiles</Link>
                <Link to="/category/tiles-ceramic" onClick={closeMenus}>Ceramic Tiles</Link>
                <Link to="/category/tiles-porcelain" onClick={closeMenus}>Porcelain Tiles</Link>
                <Link to="/category/tiles-elevation" onClick={closeMenus}>Elevation Tiles</Link>

                <Link to="/category/quartz" onClick={closeMenus} className="mega-menu-subheading-link">Quartz &rsaquo;</Link>
                <Link to="/category/quartz?type=calacatta" onClick={closeMenus}>Calacatta Quartz</Link>
                <Link to="/category/quartz?type=sparkling" onClick={closeMenus}>Sparkling Quartz</Link>
                <Link to="/category/quartz?type=solid" onClick={closeMenus}>Solid Color Quartz</Link>

                <Link to="/category/onyx" onClick={closeMenus} className="mega-menu-subheading-link">Onyx &rsaquo;</Link>
                <Link to="/category/onyx?type=exotic" onClick={closeMenus}>Exotic Onyx</Link>
                <Link to="/category/onyx?type=white" onClick={closeMenus}>White Onyx</Link>
              </div>

              {/* Column 3: Paving & Landscape */}
              <div className="mega-menu-column">
                <h3 className="mega-menu-heading">Paving & Landscape</h3>

                <Link to="/category/paving-landscape?type=cobbles" onClick={closeMenus} className="mega-menu-subheading-link">Cobbles &rsaquo;</Link>
                <Link to="/category/paving-landscape?type=cobbles-granite" onClick={closeMenus}>Granite Cobbles</Link>
                <Link to="/category/paving-landscape?type=cobbles-sandstone" onClick={closeMenus}>Sandstone Cobbles</Link>
                <Link to="/category/paving-landscape?type=cobbles-limestone" onClick={closeMenus}>Limestone Cobbles</Link>

                <Link to="/category/paving-landscape?type=pavers" onClick={closeMenus} className="mega-menu-subheading-link">Brick & Travertine &rsaquo;</Link>
                <Link to="/category/paving-landscape?type=pavers-brick" onClick={closeMenus}>Paving Bricks</Link>
                <Link to="/category/paving-landscape?type=pavers-sandstone" onClick={closeMenus}>Sandstone Pavers</Link>
                <Link to="/category/paving-landscape?type=pavers-travertine" onClick={closeMenus}>Travertine Pavers</Link>

                <Link to="/category/paving-landscape?type=stones" onClick={closeMenus} className="mega-menu-subheading-link">Stones & Others &rsaquo;</Link>
                <Link to="/category/paving-landscape?type=stones-pebbles" onClick={closeMenus}>Landscaping Pebbles</Link>
                <Link to="/category/paving-landscape?type=stones-stepping" onClick={closeMenus}>Stepping Stones</Link>
              </div>
            </div>
          </div>

          <Link to="/get-quote" className="nav-link cta-button" onClick={closeMenus}>
            Project Gallery
          </Link>

          <Link to="/blogs" className="nav-link" onClick={closeMenus}>
            Blogs
          </Link>

          {/* <Link to="/about" className="nav-link" onClick={closeMenus}>
            Company
          </Link> */}

          {/* <Link to="/admin" className="nav-link" onClick={closeMenus}>
            Admin
          </Link> */}

          <Link to="/get-quote" className="nav-link cta-button" onClick={closeMenus}>
            {demands.length > 0 ? `Send Quote (${demands.length})` : 'Send Quote'}
          </Link>
        </nav>
      </div>

      <VisualSearchModal
        isOpen={isVisualSearchOpen}
        onClose={() => setIsVisualSearchOpen(false)}
      />
    </header>
  );
}