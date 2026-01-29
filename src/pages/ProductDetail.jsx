import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductById } from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import '../styles/ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProductById(id);
      setProduct(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    navigate('/');
  };

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleQuantityChange = (e) => {
    const val = parseInt(e.target.value);
    if (val > 0) setQuantity(val);
  };

  const incrementQuantity = () => setQuantity(q => q + 1);
  const decrementQuantity = () => setQuantity(q => q > 1 ? q - 1 : 1);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadProduct} />;
  }

  if (!product) {
    return <ErrorMessage message="Product not found" />;
  }

  const discountPercentage = Math.floor(Math.random() * 30) + 5;
  const originalPrice = (product.price / (1 - discountPercentage / 100)).toFixed(2);

  return (
    <div className="product-detail-page">
      <div className="container">
        <div className="product-detail-wrapper">
          <div className="product-detail-content">
            <div className="product-detail-image-container">
              <div className="image-badge">Sale</div>
              <img 
                src={product.image} 
                alt={product.title}
                className="product-detail-image"
              />
            </div>

            <div className="product-detail-info">
              <div className="product-detail-header">
                <span className="product-detail-category">{product.category}</span>
                <button 
                  className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  title="Add to Wishlist"
                >
                  ♡
                </button>
              </div>
              
              <h1 className="product-detail-title">{product.title}</h1>
              
              <div className="product-detail-rating">
                <span className="rating-stars">
                  {'★'.repeat(Math.round(product.rating?.rate || 0))}
                  {'☆'.repeat(5 - Math.round(product.rating?.rate || 0))}
                </span>
                <span className="rating-text">
                  {product.rating?.rate} stars
                </span>
                <span className="review-count">({product.rating?.count} reviews)</span>
              </div>

              <div className="price-section">
                <div className="price-container">
                  <span className="current-price">${product.price.toFixed(2)}</span>
                  <span className="original-price">${originalPrice}</span>
                  <span className="discount-badge">-{discountPercentage}%</span>
                </div>
                <p className="price-note">Free delivery on orders above $50</p>
              </div>

              <div className="product-detail-description">
                <h3>Description</h3>
                <p>{product.description}</p>
              </div>

              <div className="quantity-section">
                <label>Quantity:</label>
                <div className="quantity-control">
                  <button onClick={decrementQuantity} className="qty-btn">−</button>
                  <input 
                    type="number" 
                    min="1" 
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="qty-input"
                  />
                  <button onClick={incrementQuantity} className="qty-btn">+</button>
                </div>
              </div>

              <div className="product-detail-actions">
                <button 
                  className={`add-to-cart-btn ${addedToCart ? 'success' : ''}`}
                  onClick={handleAddToCart}
                >
                  {addedToCart ? '✓ Added to Cart' : 'Add to Cart'}
                </button>
                <button className="buy-now-btn">Buy Now</button>
              </div>

              <div className="product-features">
                <div className="feature">
                  <span className="feature-icon">📦</span>
                  <span>Free Shipping</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">↩️</span>
                  <span>Easy Returns</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">🛡️</span>
                  <span>Secure Payment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;