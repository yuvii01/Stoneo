import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import TextSearchModal from './TextSearchModal';
import VisualSearchModal from './VisualSearchModal';
import { useDemand } from '../context/DemandContext';
import '../styles/header.css';

export default function Header() {
  const { demands } = useDemand();
  const location = useLocation();
  const isRoyalPage = location.pathname.includes('/royal-gem-stones');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isApplicationsOpen, setIsApplicationsOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isVisualSearchOpen, setIsVisualSearchOpen] = useState(false);
  const [isTextSearchOpen, setIsTextSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
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

  useEffect(() => {
    if (isMenuOpen && window.innerWidth <= 768) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

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

  const toggleApplications = () => {
    setIsApplicationsOpen((prev) => {
      const next = !prev;
      if (next) {
        setIsProductsOpen(false);
      }
      return next;
    });
  };

  const toggleProducts = () => {
    setIsProductsOpen((prev) => {
      const next = !prev;
      if (next) {
        setIsApplicationsOpen(false);
      }
      return next;
    });
  };

  const effectiveScrolled = isRoyalPage ? false : isScrolled;

  return (
    <>
      <div
        className="page-scroll-progress-bar"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '3px',
          width: `${scrollProgress}%`,
          background: 'linear-gradient(90deg, #d4af37 0%, #f5e3a9 50%, #aa820a 100%)',
          boxShadow: '0 0 10px rgba(212, 175, 55, 0.8)',
          zIndex: 999999,
          transition: 'width 0.08s ease-out',
          pointerEvents: 'none'
        }}
      />
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
              <span className="text-logo" style={{ color: effectiveScrolled ? '#000' : '#fff' }}>
                {effectiveScrolled ? (
                  <>
                    <img src="/logos/logo_dark_transparent.png" alt="Logo Dark" className="logo-main-img" />
                    <img src="/logos/detail_dark_transparent.png" alt="Details Dark" className="logo-detail-img" />
                  </>
                ) : (
                  <>
                    <img src="/logos/logo_light_transparent.png" alt="Logo Light" className="logo-main-img" />
                    <img src="/logos/detail_light_transparent.png" alt="Details Light" className="logo-detail-img" />
                  </>
                )}
              </span>
            </Link>
          </div>

          <div className="search-bar-container">
            <input
              type="text"
              className="search-bar-input"
              placeholder="Search items for your project"
              style={{ outline: 'none', border: 'none', boxShadow: 'none' }}
              value={searchQuery}
              onChange={(e) => {
                const val = e.target.value;
                setSearchQuery(val);
                if (val.trim().length > 0) {
                  setIsTextSearchOpen(true);
                } else {
                  setIsTextSearchOpen(false);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim().length > 0) {
                  setIsTextSearchOpen(true);
                }
              }}
            />
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
              <input
                type="text"
                className="search-bar-input"
                placeholder="Search items for your project"
                style={{ outline: 'none', border: 'none', boxShadow: 'none' }}
                value={searchQuery}
                onChange={(e) => {
                  const val = e.target.value;
                  setSearchQuery(val);
                  if (val.trim().length > 0) {
                    setIsTextSearchOpen(true);
                  } else {
                    setIsTextSearchOpen(false);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim().length > 0) {
                    setIsTextSearchOpen(true);
                    closeMenus();
                  }
                }}
              />
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
                className={`nav-link dropdown-toggle ${isApplicationsOpen ? 'active' : ''}`}
                onClick={toggleApplications}
                role="button"
                aria-expanded={isApplicationsOpen}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleApplications();
                  }
                }}
              >
                <span>Applications</span>
                <svg
                  className={`dropdown-chevron ${isApplicationsOpen ? 'open' : ''}`}
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </span>

              <div className={`dropdown-menu mega-menu ${isApplicationsOpen ? 'show' : ''}`}>
                <div className="mega-menu-column">
                  <h3 className="mega-menu-heading">
                    <Link to="/application/interior" onClick={closeMenus} style={{ textDecoration: 'none', color: 'inherit' }}>Interior &rsaquo;</Link>
                  </h3>

                  <Link to="/application/interior?type=interior-flooring" onClick={closeMenus}>Interior Flooring</Link>
                  <Link to="/application/interior?type=wall-cladding" onClick={closeMenus}>Wall Cladding</Link>
                  <Link to="/application/interior?type=kitchen-countertops" onClick={closeMenus}>Kitchen Countertops</Link>
                  <Link to="/application/interior?type=bathroom-vanity" onClick={closeMenus}>Bathroom & Vanity</Link>
                  <Link to="/application/interior?type=staircase" onClick={closeMenus}>Staircase</Link>
                  {/* <Link to="/application/interior?type=pooja-room-temples" onClick={closeMenus}>Pooja Room & Temples</Link> */}
                  <Link to="/application/interior?type=table-tops-furniture" onClick={closeMenus}>TableTop & Furniture</Link>
                  <Link to="/home-decor" onClick={closeMenus}>Home Decor</Link>

                </div>

                <div className="mega-menu-column">
                  <h3 className="mega-menu-heading">
                    <Link to="/application/exterior" onClick={closeMenus} style={{ textDecoration: 'none', color: 'inherit' }}>Exterior &rsaquo;</Link>
                  </h3>
                  <Link to="/application/exterior?type=outdoor-flooring" onClick={closeMenus}>Outdoor Flooring & Paving</Link>
                  <Link to="/application/exterior?type=elevation-cladding" onClick={closeMenus}>Elevation Cladding</Link>

                  <Link to="/application/exterior?type=garden-landscaping" onClick={closeMenus}>Garden & Landscaping</Link>
                  <Link to="/application/exterior?type=driveways-pathways" onClick={closeMenus}>Driveways & Pathways</Link>
                  <Link to="/application/exterior?type=swimming-pool" onClick={closeMenus}>Swimming Pool Areas</Link>
                </div>
              </div>
            </div>

            <div
              className="nav-item dropdown"
              onMouseEnter={() => window.innerWidth > 768 && setIsProductsOpen(true)}
              onMouseLeave={() => window.innerWidth > 768 && setIsProductsOpen(false)}
            >
              <span
                className={`nav-link dropdown-toggle ${isProductsOpen ? 'active' : ''}`}
                onClick={toggleProducts}
                role="button"
                aria-expanded={isProductsOpen}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleProducts();
                  }
                }}
              >
                <span>Products</span>
                <svg
                  className={`dropdown-chevron ${isProductsOpen ? 'open' : ''}`}
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </span>

              <div className={`dropdown-menu mega-menu products-mega-menu ${isProductsOpen ? 'show' : ''}`}>

                {/* Column 1: Natural Surfaces */}
                <div className="mega-menu-column">
                  <h3 className="mega-menu-heading">Natural Surfaces</h3>

                  <Link to="/category/granite" onClick={closeMenus} className="mega-menu-subheading-link">Granite &rsaquo;</Link>
                  <Link to="/category/granite?type=south" onClick={closeMenus}>South India Granites</Link>
                  <Link to="/category/granite?type=north" onClick={closeMenus}>North India Granites</Link>
                  <Link to="/category/granite?type=alaska" onClick={closeMenus}>Alaska Granite</Link>
                  {/* <Link to="/category/granite?type=imported" onClick={closeMenus}>Imported Granites</Link> */}
                  {/* <Link to="/category/granite-tiles" onClick={closeMenus}>Granite Tiles</Link> */}

                  <Link to="/category/marble" onClick={closeMenus} className="mega-menu-subheading-link">Marble &rsaquo;</Link>
                  <Link to="/category/marble?type=imported" onClick={closeMenus}>Imported Marble</Link>
                  <Link to="/category/marble?type=indian" onClick={closeMenus}>Indian Marble</Link>
                  <Link to="/category/marble?type=statuario" onClick={closeMenus}>Statuario</Link>

                  <Link to="/category/sandstone" onClick={closeMenus} className="mega-menu-subheading-link">Sandstone &rsaquo;</Link>
                  <Link to="/category/sandstone?type=kandla_grey" onClick={closeMenus}>Kandla Grey</Link>

                  {/* <Link to="/category/sandstone?type=agra_sandstone" onClick={closeMenus}>Agra Sandstone</Link>
                <Link to="/category/sandstone?type=raj_green_sandstone" onClick={closeMenus}>Raj Green Sandstone</Link> */}
                </div>

                <div className="mega-menu-column">

                  <Link to="/category/other-natural-stones" onClick={closeMenus} className="mega-menu-subheading-link">Other Natural Stones &rsaquo;</Link>
                  <Link to="/category/other-natural-stones?type=quartzite" onClick={closeMenus}>Quarzite</Link>
                  <Link to="/category/other-natural-stones?type=limestone" onClick={closeMenus}>Limestone</Link>
                  <Link to="/category/other-natural-stones?type=slate_stone" onClick={closeMenus}>Slate Stone</Link>
                  <Link to="/category/other-natural-stones?type=basalt" onClick={closeMenus}>Basalt</Link>

                  <h3 className="mega-menu-heading">Engineered Surfaces</h3>

                  {/* <Link to="/category/tiles" onClick={closeMenus} className="mega-menu-subheading-link">Tiles &rsaquo;</Link>
                <Link to="/category/tiles-vitrified" onClick={closeMenus}>Vitrified Tiles</Link>
                <Link to="/category/tiles-ceramic" onClick={closeMenus}>Ceramic Tiles</Link>
                <Link to="/category/tiles-porcelain" onClick={closeMenus}>Porcelain Tiles</Link>
                <Link to="/category/tiles-elevation" onClick={closeMenus}>Elevation Tiles</Link> */}

                  <Link to="/category/quartz" onClick={closeMenus} className="mega-menu-subheading-link">Quartz &rsaquo;</Link>
                  <Link to="/category/quartz?type=calacatta" onClick={closeMenus}>Calacatta Quartz</Link>
                  <Link to="/category/quartz?type=sparkling" onClick={closeMenus}>Sparkling Quartz</Link>

                  <Link to="/category/onyx" onClick={closeMenus} className="mega-menu-subheading-link">Onyx &rsaquo;</Link>
                  <Link to="/category/onyx?type=white" onClick={closeMenus}>White Onyx</Link>
                </div>

                {/* Column 3: Paving & Landscape */}
                <div className="mega-menu-column">
                  <h3 className="mega-menu-heading">Paving & Landscape</h3>

                  <Link to="/category/paving-landscape?type=cobbles" onClick={closeMenus} className="mega-menu-subheading-link">Cobbles &rsaquo;</Link>
                  <Link to="/category/paving-landscape?type=cobbles-granite" onClick={closeMenus}>Granite Cobbles</Link>
                  <Link to="/category/paving-landscape?type=cobbles-sandstone" onClick={closeMenus}>Sandstone Cobbles</Link>
                  {/* <Link to="/category/paving-landscape?type=cobbles-limestone" onClick={closeMenus}>Limestone Cobbles</Link> */}

                  <Link to="/category/paving-landscape?type=pavers" onClick={closeMenus} className="mega-menu-subheading-link">Bricks and Pavers &rsaquo;</Link>
                  {/* <Link to="/category/paving-landscape?type=pavers-brick" onClick={closeMenus}>Paving Bricks</Link> */}
                  <Link to="/category/paving-landscape?type=pavers-sandstone" onClick={closeMenus}>Sandstone </Link>
                  <Link to="/category/paving-landscape?type=pavers-granite" onClick={closeMenus}>Granite </Link>
                  <Link to="/category/paving-landscape?type=pavers-marble" onClick={closeMenus}>Marble </Link>
                  <Link to="/category/paving-landscape?type=pavers-travertine" onClick={closeMenus}>Other Natural Stones </Link>

                  <Link to="/category/paving-landscape?type=stones" onClick={closeMenus} className="mega-menu-subheading-link">Stones & Others &rsaquo;</Link>
                  <Link to="/category/paving-landscape?type=stones-pebbles" onClick={closeMenus}>Landscaping Pebbles</Link>
                  {/* <Link to="/category/paving-landscape?type=stones-stepping" onClick={closeMenus}>Stepping Stones</Link> */}
                </div>
              </div>
            </div>

            <Link
              to="/#project-gallery"
              className="nav-link"
              onClick={() => {
                closeMenus();
                const el = document.getElementById('project-gallery');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Project Gallery
            </Link>

            <Link to="/blogs" className="nav-link" onClick={closeMenus}>
              Blogs
            </Link>

            {/* <Link to="/about" className="nav-link" onClick={closeMenus}>
            Company
          </Link> */}

            <Link to="/about" className="nav-link" onClick={closeMenus}>
              About Us
            </Link>

            <Link to="/get-quote" className="nav-link cta-button" onClick={closeMenus}>
              {demands.length > 0 ? `Get Quote (${demands.length})` : 'Get Quote'}
            </Link>
          </nav>
        </div>

        <VisualSearchModal
          isOpen={isVisualSearchOpen}
          onClose={() => setIsVisualSearchOpen(false)}
        />
        <TextSearchModal
          isOpen={isTextSearchOpen}
          onClose={() => {
            setIsTextSearchOpen(false);
            setSearchQuery('');
          }}
          initialQuery={searchQuery}
          onQueryChange={(newQuery) => {
            setSearchQuery(newQuery);
            if (newQuery.trim().length === 0) {
              setIsTextSearchOpen(false);
            }
          }}
        />
      </header>
    </>
  );
}