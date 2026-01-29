import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <div className="logo-icon">🛒</div>
          <div className="logo-text">
            <h1>Product Catalog</h1>
            <span className="logo-tagline">Shop Your Favorites</span>
          </div>
        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link">
            <span className="nav-icon">🏠</span>
            Home
          </Link>
          <div className="cart-badge">
            <span className="cart-icon">🛍️</span>
            <span className="badge-count">0</span>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;