import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingBag, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';

const categories = ['All', 'Electronics', 'Furniture', 'Home', 'Fitness'];

// Static products — displayed when backend is not running
const STATIC_PRODUCTS = [
  { _id: '1', name: 'Premium Wireless Headphones', description: 'High-quality noise-cancelling wireless headphones with 30-hour battery life.', price: 299.99, category: 'Electronics', imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600', stock: 50 },
  { _id: '2', name: 'Minimalist Smartwatch', description: 'Sleek design, fitness tracking, and heart rate monitor.', price: 199.50, category: 'Electronics', imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600', stock: 30 },
  { _id: '3', name: 'Ergonomic Desk Chair', description: 'Adjustable lumbar support and breathable mesh back.', price: 149.99, category: 'Furniture', imageUrl: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=600', stock: 20 },
  { _id: '4', name: 'Mechanical Keyboard', description: 'RGB backlit mechanical keyboard with tactile switches.', price: 120.00, category: 'Electronics', imageUrl: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=600', stock: 45 },
  { _id: '5', name: 'Ceramic Coffee Mug', description: 'Handcrafted ceramic mug, perfect for your morning brew.', price: 24.99, category: 'Home', imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=600', stock: 100 },
  { _id: '6', name: 'Yoga Mat', description: 'Eco-friendly, non-slip yoga mat with alignment lines.', price: 45.00, category: 'Fitness', imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&q=80&w=600', stock: 60 },
  { _id: '7', name: 'Dumbbell Set', description: 'Adjustable dumbbell set with ergonomic grip for home workouts.', price: 89.99, category: 'Fitness', imageUrl: 'https://images.unsplash.com/photo-1586401700818-28564a2da557?auto=format&fit=crop&q=80&w=600', stock: 25 },
  { _id: '8', name: 'Modern Sofa', description: 'Comfortable 3-seater modern sofa with premium fabric.', price: 899.00, category: 'Furniture', imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600', stock: 5 },
  { _id: '9', name: '4K Ultra HD Monitor', description: '27-inch 4K monitor for gaming and professional design.', price: 349.99, category: 'Electronics', imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=600', stock: 15 },
  { _id: '10', name: 'Aesthetic Table Lamp', description: 'Warm LED table lamp for reading and ambient lighting.', price: 39.99, category: 'Home', imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600', stock: 80 },
];

const Products = () => {
  const [products, setProducts] = useState(STATIC_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  const currentCategory = searchParams.get('category') || 'All';
  const currentSearch = searchParams.get('search') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = '/api/products?';
        if (currentCategory !== 'All') url += `category=${currentCategory}&`;
        if (currentSearch) url += `search=${currentSearch}&`;
        
        const res = await axios.get(url);
        if (res.data && res.data.length > 0) setProducts(res.data);
      } catch (error) {
        // Backend not running — filter and show static products
        let filtered = STATIC_PRODUCTS;
        if (currentCategory !== 'All') filtered = filtered.filter(p => p.category === currentCategory);
        if (currentSearch) filtered = filtered.filter(p =>
          p.name.toLowerCase().includes(currentSearch.toLowerCase()) ||
          p.description.toLowerCase().includes(currentSearch.toLowerCase())
        );
        setProducts(filtered);
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
