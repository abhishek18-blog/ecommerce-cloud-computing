import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingBag, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';

const categories = ['All', 'Electronics', 'Furniture', 'Home', 'Fitness'];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  const currentCategory = searchParams.get('category') || 'All';
  const currentSearch = searchParams.get('search') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        let url = `${apiBase}/products?`;
        if (currentCategory !== 'All') url += `category=${currentCategory}&`;
        if (currentSearch) url += `search=${currentSearch}&`;
        
        const res = await axios.get(url);
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [currentCategory, currentSearch]);

  const handleCategoryClick = (cat) => {
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  const handleBuyNow = (product) => {
    addToCart(product);
    navigate('/checkout');
  };

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
        <h2 style={{fontSize: '2rem'}}>
          {currentSearch ? `Search results for "${currentSearch}"` : 'Our Collection'}
        </h2>
        {currentSearch && (
          <button className="btn btn-outline" onClick={() => {
            searchParams.delete('search');
            setSearchParams(searchParams);
          }}>Clear Search</button>
        )}
      </div>

      <div className="categories-filter">
        {categories.map(cat => (
          <button 
            key={cat} 
            className={`category-pill ${currentCategory === cat ? 'active' : ''}`}
            onClick={() => handleCategoryClick(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{textAlign: 'center', marginTop: '3rem'}}>Loading...</div>
      ) : products.length === 0 ? (
        <div style={{textAlign: 'center', marginTop: '3rem', color: 'var(--text-muted)'}}>No products found.</div>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <div key={product._id} className="product-card">
              <Link to={`/products/${product._id}`} style={{display: 'block'}}>
                <img src={product.imageUrl} alt={product.name} className="product-image" />
              </Link>
              <div className="product-info">
                <Link to={`/products/${product._id}`}>
                  <h3 className="product-title">{product.name}</h3>
                </Link>
                <p className="product-desc">{product.description}</p>
                <div className="product-meta">
                  <span className="product-price">${product.price.toFixed(2)}</span>
                </div>
                <div className="card-actions">
                  <button 
                    className="btn btn-primary" 
                    onClick={() => addToCart(product)}
                  >
                    <ShoppingBag size={16} /> Cart
                  </button>
                  <button 
                    className="btn btn-success" 
                    onClick={() => handleBuyNow(product)}
                  >
                    <CreditCard size={16} /> Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
