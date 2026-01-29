import React, { useState, useEffect } from 'react';
import { fetchProducts, fetchCategories } from '../services/api';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import '../styles/ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [viewType, setViewType] = useState('grid');

  // Fetch products and categories on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Filter and sort products when category, search term, or sort changes
  useEffect(() => {
    filterAndSortProducts();
  }, [selectedCategory, searchTerm, sortBy, products]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch both products and categories
      const [productsData, categoriesData] = await Promise.all([
        fetchProducts(),
        fetchCategories()
      ]);
      
      setProducts(productsData);
      setFilteredProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort products
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    setFilteredProducts(filtered);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadData} />;
  }

  return (
    <div className="product-list-page">
      <div className="container">
        {/* Search and Filter Section */}
        <div className="filters-section">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search products by name or description..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>

          <div className="filters-toolbar">
            <div className="category-filters">
              <button
                className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('all')}
              >
                All Products
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>

            <div className="sort-view-controls">
              <div className="sort-container">
                <label htmlFor="sort">Sort by:</label>
                <select 
                  id="sort"
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Product Name</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results count and stats */}
        <div className="results-header">
          <div className="results-info">
            <h2 className="results-title">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'} Found
            </h2>
            <p className="results-subtitle">
              {selectedCategory !== 'all' && `in ${selectedCategory} • `}
              Showing {filteredProducts.length} of {products.length} total products
            </p>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="no-results">
            <div className="no-results-icon">📭</div>
            <h3>No products found</h3>
            <p>Try adjusting your search or category filters</p>
            <button 
              className="reset-filters-btn"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className={`products-grid ${viewType}`}>
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;