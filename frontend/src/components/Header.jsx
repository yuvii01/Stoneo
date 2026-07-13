import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import VisualSearchModal from './VisualSearchModal';
import '../styles/header.css';

export default function Header() {
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

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
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
            <span className="text-logo" style={{ color: isScrolled ? '#000' : '#fff', fontSize: '28px' }}>Stoneo India</span>
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
            src={isScrolled ? '/hamburger.png' : '/hamburger_white.png'}
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

          <Link to="/" className="nav-link" onClick={closeMenus}>
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
              <div className="mega-menu-column">
                <h3 className="mega-menu-heading">Granites</h3>
                <Link to="/category/granite-black" onClick={closeMenus}>Black Granites</Link>
                <Link to="/category/granite-white" onClick={closeMenus}>White Granites</Link>
                <Link to="/category/granite-red" onClick={closeMenus}>Red Granites</Link>
                <Link to="/category/granite-brown" onClick={closeMenus}>Brown Granites</Link>
                <Link to="/category/granite-blue" onClick={closeMenus}>Blue Granites</Link>
                
                <h3 className="mega-menu-heading" style={{ marginTop: '20px' }}>Indian Marble</h3>
                <Link to="/category/marble-makrana" onClick={closeMenus}>Makrana Marble</Link>
                <Link to="/category/marble-dungri" onClick={closeMenus}>Dungri Marble</Link>
                <Link to="/category/marble-kumari" onClick={closeMenus}>Kumari Marble</Link>
                <Link to="/category/marble-onyx" onClick={closeMenus}>Onyx Marble</Link>
              </div>

              <div className="mega-menu-column">
                <h3 className="mega-menu-heading">Imported Marble</h3>
                <Link to="/category/marble-italian" onClick={closeMenus}>Italian Marble</Link>
                <Link to="/category/marble-statuario" onClick={closeMenus}>Statuario Marble</Link>
                <Link to="/category/marble-michaelangelo" onClick={closeMenus}>Michaelangelo</Link>
                <Link to="/category/marble-bottochino" onClick={closeMenus}>Bottochino</Link>

                <h3 className="mega-menu-heading" style={{ marginTop: '20px' }}>Quartz & Quartzite</h3>
                <Link to="/category/quartz-white" onClick={closeMenus}>White Quartz</Link>
                <Link to="/category/quartz-grey" onClick={closeMenus}>Grey Quartz</Link>
                <Link to="/category/quartz-calacatta" onClick={closeMenus}>Calacatta Quartz</Link>
                <Link to="/category/quartzite" onClick={closeMenus}>Premium Quartzite</Link>
              </div>

              <div className="mega-menu-column">
                <h3 className="mega-menu-heading">Tiles</h3>
                <Link to="/category/tiles-vitrified" onClick={closeMenus}>Vitrified Tiles</Link>
                <Link to="/category/tiles-ceramic" onClick={closeMenus}>Ceramic Tiles</Link>
                <Link to="/category/tiles-porcelain" onClick={closeMenus}>Porcelain Tiles</Link>
                <Link to="/category/tiles-elevation" onClick={closeMenus}>Elevation Tiles</Link>

                <h3 className="mega-menu-heading" style={{ marginTop: '20px' }}>Sandstone</h3>
                <Link to="/category/sandstone-teak" onClick={closeMenus}>Teakwood Sandstone</Link>
                <Link to="/category/sandstone-dholpur" onClick={closeMenus}>Dholpur Sandstone</Link>
                <Link to="/category/sandstone-kandla" onClick={closeMenus}>Kandla Grey</Link>
                <Link to="/category/sandstone-mint" onClick={closeMenus}>Mint Sandstone</Link>
              </div>

              <div className="mega-menu-column">
                <h3 className="mega-menu-heading">Paving & Landscape</h3>
                <Link to="/category/cobbles-granite" onClick={closeMenus}>Granite Cobbles</Link>
                <Link to="/category/cobbles-sandstone" onClick={closeMenus}>Sandstone Cobbles</Link>
                <Link to="/category/ligerio-paving" onClick={closeMenus}>Ligerio Pavers</Link>
                <Link to="/category/limestone-paving" onClick={closeMenus}>Limestone Paving</Link>
                <Link to="/category/stepping-stones" onClick={closeMenus}>Stepping Stones</Link>
                <Link to="/category/pebbles-gravels" onClick={closeMenus}>Pebbles & Gravels</Link>
                <Link to="/category/kerbstones" onClick={closeMenus}>Kerbstones</Link>
              </div>
            </div>
          </div>



          <Link to="/about" className="nav-link" onClick={closeMenus}>
            Company
          </Link>

          <Link to="/blogs" className="nav-link" onClick={closeMenus}>
            Blogs
          </Link>

          {/* <Link to="/admin" className="nav-link" onClick={closeMenus}>
            Admin
          </Link> */}

          <Link to="/get-quote" className="nav-link cta-button" onClick={closeMenus}>
            Get Quote
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