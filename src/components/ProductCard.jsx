import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/ProductCard.css';

const ProductCard = ({ product }) => {
  const [imageError, setImageError] = useState(false);
  const discountPercent = Math.floor(Math.random() * 25) + 5;

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-image-container">
        {!imageError ? (
          <img 
            src={product.image} 
            alt={product.title}
            className="product-image"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="product-image-fallback">
            <span className="fallback-icon">📦</span>
          </div>
        )}
        <div className="product-badge">-{discountPercent}%</div>
      </div>
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-title">{product.title}</h3>
        <div className="product-rating">
          <span className="stars">★★★★☆</span>
          <span className="rating-count">(245)</span>
        </div>
        <div className="product-price-section">
          <p className="product-price">${product.price.toFixed(2)}</p>
          <p className="product-original-price">${(product.price * 1.3).toFixed(2)}</p>
        </div>
        <button className="product-btn">Add to Cart</button>
      </div>
    </Link>
  );
};

export default ProductCard;