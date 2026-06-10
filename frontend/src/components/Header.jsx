import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../styles/header.css';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
        setIsDropdownOpen(false);
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
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => {
      const next = !prev;
      if (!next) setIsDropdownOpen(false);
      return next;
    });
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <div className="logo-div">
          <Link to="/" className="logo" onClick={closeMenus}>
            <img
              src={isScrolled ? '/logo2.png' : '/logo_white.png'}
              alt="KM STONEX Logo"
              className="logo-img"
            />
          </Link>
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
          <Link to="/" className="nav-link" onClick={closeMenus}>
            Home
          </Link>

          <div className="nav-item dropdown">
            <span
              className="nav-link dropdown-toggle"
              onClick={toggleDropdown}
              role="button"
              aria-expanded={isDropdownOpen}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleDropdown();
                }
              }}
            >
              Products ▾
            </span>

            <div className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
              <Link
                to="/category/granite"
                onClick={closeMenus}
              >
                Granites
              </Link>

              <Link
                to="/category/Imported_Marble"
                onClick={closeMenus}
              >
                Imported Marbles
              </Link>

              <Link
                to="/category/Indian_Marble"
                onClick={closeMenus}
              >
                Indian Marbles
              </Link>

              <Link
                to="/category/sandstone"
                onClick={closeMenus}
              >
                Sandstones
              </Link>
            </div>
          </div>



          <Link to="/about" className="nav-link" onClick={closeMenus}>
            Company
          </Link>

          <Link to="/blogs" className="nav-link" onClick={closeMenus}>
            Blogs
          </Link>

          <Link to="/get-quote" className="nav-link cta-button" onClick={closeMenus}>
            Send Requirement
          </Link>
        </nav>
      </div>
    </header>
  );
}