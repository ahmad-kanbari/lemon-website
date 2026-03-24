import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

/**
 * Site-wide footer with navigation links and contact information.
 */
function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="container footer__grid">
        {/* Brand */}
        <section className="footer__brand" aria-label="About Little Lemon">
          <h2 className="footer__logo">
            <span aria-hidden="true">🍋</span> Little Lemon
          </h2>
          <p>
            A family-owned Mediterranean restaurant focused on traditional recipes
            served with a modern twist.
          </p>
        </section>

        {/* Site links */}
        <nav aria-label="Footer navigation">
          <h3 className="footer__heading">Navigation</h3>
          <ul role="list">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/booking">Reservations</Link></li>
            <li><a href="#menu">Menu</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>

        {/* Contact */}
        <address className="footer__contact" aria-label="Contact information">
          <h3 className="footer__heading">Contact Us</h3>
          <ul role="list">
            <li>
              <a href="tel:+13125550187" aria-label="Phone: 312-555-0187">
                📞 (312) 555-0187
              </a>
            </li>
            <li>
              <a href="mailto:info@littlelemon.com" aria-label="Email: info@littlelemon.com">
                ✉️ info@littlelemon.com
              </a>
            </li>
            <li>742 Evergreen Terrace, Chicago, IL 60601</li>
          </ul>
        </address>

        {/* Hours */}
        <section aria-label="Opening hours">
          <h3 className="footer__heading">Opening Hours</h3>
          <ul role="list">
            <li><time>Mon – Fri: 17:00 – 22:00</time></li>
            <li><time>Sat – Sun: 16:00 – 23:00</time></li>
          </ul>
        </section>
      </div>

      <div className="footer__bottom">
        <p>&copy; {new Date().getFullYear()} Little Lemon. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
