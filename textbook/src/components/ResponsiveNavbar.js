import React, { useState, useEffect } from 'react';
import { useLocation } from '@docusaurus/router';
import { useColorMode } from '@docusaurus/theme-common';
import Link from '@docusaurus/Link';

const ResponsiveNavbar = ({ items, title, logo }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { colorMode } = useColorMode();

  // Track scroll to apply different styles when scrolled
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Separate left and right items
  const leftItems = items.filter(item => item.position === 'left');
  const rightItems = items.filter(item => item.position === 'right');

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''} ${colorMode}`}>
      <div className="navbar__inner">
        {/* Left side (logo and title) */}
        <div className="navbar__items navbar__items--left">
          <div 
            className="navbar__toggle"
            role="button"
            tabIndex={0}
            onClick={toggleMenu}
            onKeyDown={(e) => e.key === 'Enter' && toggleMenu()}
          >
            <svg className="navbar__toggle-icon" width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeMiterlimit="10"
                strokeWidth="2"
                d={isOpen ? "M6,18L24,6 M6,6l18,18" : "M4,7L26,7 M4,15L26,15 M4,23L26,23"}
              />
            </svg>
          </div>
          
          <Link className="navbar__brand" to="/">
            {logo && (
              <img 
                src={logo.src} 
                alt={logo.alt} 
                className="navbar__logo"
              />
            )}
            {title && <strong className="navbar__title">{title}</strong>}
          </Link>
        </div>

        {/* Right side (navigation items) */}
        <div className={`navbar__items navbar__items--right ${isOpen ? 'navbar__items--show' : ''}`}>
          {leftItems.map((item, index) => (
            <NavbarItem key={index} item={item} />
          ))}
          {rightItems.map((item, index) => (
            <NavbarItem key={index} item={item} />
          ))}
        </div>
      </div>

      {/* Mobile overlay when menu is open */}
      {isOpen && (
        <div 
          className="navbar__overlay"
          onClick={toggleMenu}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && toggleMenu()}
        />
      )}
    </nav>
  );
};

// Navbar Item Component
const NavbarItem = ({ item }) => {
  if (item.type === 'docSidebar') {
    return (
      <Link 
        className="navbar__item navbar__link" 
        to={`/docs/${item.sidebarId}`}
      >
        {item.label}
      </Link>
    );
  } else if (item.type === 'search') {
    return (
      <div className="navbar__search">
        <Link to="/search">
          <span className="search-icon">🔍</span>
        </Link>
      </div>
    );
  } else if (item.to) {
    return (
      <Link 
        className="navbar__item navbar__link" 
        to={item.to}
      >
        {item.label}
      </Link>
    );
  } else if (item.href) {
    return (
      <a 
        className="navbar__item navbar__link" 
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visit ${item.label}`}
      >
        {item.label}
      </a>
    );
  }
  
  // Default to simple text if no action defined
  return <span className="navbar__item navbar__text">{item.label}</span>;
};

export default ResponsiveNavbar;