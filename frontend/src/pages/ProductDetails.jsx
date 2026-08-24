import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingBag, CreditCard, ArrowLeft, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

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

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products/${id}`);
        setProduct(res.data);
      } catch (error) {
        // Backend not running — find from static list
        const found = STATIC_PRODUCTS.find(p => p._id === id);
        setProduct(found || null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);


  if (loading) return <div style={{textAlign: 'center', marginTop: '5rem'}}>Loading details...</div>;
  if (!product) return <div style={{textAlign: 'center', marginTop: '5rem'}}>Product not found</div>;

  const handleAdd = () => addToCart(product);
  const handleBuyNow = () => {
    addToCart(product);
    navigate('/checkout');
  };

  return (
    <div>
      <button onClick={() => navigate(-1)} className="btn btn-outline" style={{marginBottom: '2rem'}}>
        <ArrowLeft size={18} /> Back to Shopping
      </button>

      <div className="details-grid">
        <img src={product.imageUrl} alt={product.name} className="details-image" />
        
        <div>
          <span style={{color: 'var(--primary-color)', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px'}}>{product.category}</span>
          <h1 style={{fontSize: '2.5rem', marginBottom: '1rem', marginTop: '0.5rem'}}>{product.name}</h1>
          <p style={{fontSize: '2rem', color: 'var(--primary-color)', fontWeight: 'bold', marginBottom: '1.5rem'}}>${product.price.toFixed(2)}</p>
          
          <p style={{color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: '1.8'}}>{product.description}</p>
          
          <div style={{display: 'flex', gap: '1.5rem', marginBottom: '2rem'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)'}}>
              <ShieldCheck size={20} color="var(--success)" />
              <span>1 Year Warranty</span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)'}}>
              <Truck size={20} color="var(--primary-color)" />
              <span>Free Fast Delivery</span>
            </div>
          </div>

          <p style={{marginBottom: '1rem', color: product.stock > 0 ? 'var(--success)' : 'var(--danger)', fontWeight: '500'}}>
            {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
          </p>

          <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
            <button 
              className="btn btn-primary" 
              style={{flex: 1, justifyContent: 'center', padding: '1rem', fontSize: '1.1rem'}}
              onClick={handleAdd}
              disabled={product.stock <= 0}
            >
              <ShoppingBag size={20} /> Add to Cart
            </button>
            <button 
              className="btn btn-success" 
              style={{flex: 1, justifyContent: 'center', padding: '1rem', fontSize: '1.1rem'}}
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
            >
              <CreditCard size={20} /> Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
