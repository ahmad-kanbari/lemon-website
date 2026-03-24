import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Header.css';

/**
 * Site-wide header with logo and responsive navigation.
 * Includes a hamburger menu for mobile viewports.
 */
function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu  = () => setMenuOpen(false);

  return (
    <header className="header" role="banner">
      <div className="container header__inner">
        {/* Logo */}
        <Link to="/" aria-label="Little Lemon – go to homepage" onClick={closeMenu}>
          <div className="header__logo">
            <span className="logo-lemon" aria-hidden="true">🍋</span>
            <span className="logo-text">
              <span className="logo-name">Little Lemon</span>
              <span className="logo-place">Chicago</span>
            </span>
          </div>
        </Link>

        {/* Hamburger button (mobile) */}
        <button
          className={`header__hamburger${menuOpen ? ' open' : ''}`}
          aria-expanded={menuOpen}
          aria-controls="primary-nav"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={toggleMenu}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>

        {/* Primary navigation */}
        <nav
          id="primary-nav"
          className={`header__nav${menuOpen ? ' header__nav--open' : ''}`}
          aria-label="Primary navigation"
        >
          <ul role="list">
            {[
              { to: '/',        label: 'Home'     },
              { to: '/booking', label: 'Reservations' },
              { to: '/#menu',   label: 'Menu'     },
              { to: '/#about',  label: 'About'    },
              { to: '/#contact',label: 'Contact'  },
            ].map(({ to, label }) => (
              <li key={label}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    isActive && to !== '/#menu' && to !== '/#about' && to !== '/#contact'
                      ? 'active'
                      : ''
                  }
                  onClick={closeMenu}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
