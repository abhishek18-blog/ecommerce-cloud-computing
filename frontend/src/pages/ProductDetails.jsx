import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingBag, CreditCard, ArrowLeft, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/products/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.error("Error fetching product", error);
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
