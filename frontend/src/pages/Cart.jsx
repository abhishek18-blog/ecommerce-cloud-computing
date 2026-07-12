import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div style={{textAlign: 'center', marginTop: '5rem'}}>
        <h2>Your Cart is Empty</h2>
        <p style={{color: 'var(--text-muted)', margin: '1rem 0'}}>Looks like you haven't added anything yet.</p>
        <Link to="/products" className="btn btn-primary">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2 style={{marginBottom: '2rem'}}>Your Cart</h2>
      <div>
        {cart.map(item => (
          <div key={item.product._id} className="cart-item">
            <img src={item.product.imageUrl} alt={item.product.name} />
            <div className="cart-item-info">
              <h4>{item.product.name}</h4>
              <p style={{color: 'var(--text-muted)'}}>${item.product.price.toFixed(2)} each</p>
            </div>
            <div className="cart-item-actions">
              <button className="qty-btn" onClick={() => updateQuantity(item.product._id, -1)}><Minus size={14}/></button>
              <span>{item.quantity}</span>
              <button className="qty-btn" onClick={() => updateQuantity(item.product._id, 1)}><Plus size={14}/></button>
              <button className="btn btn-danger" style={{padding: '0.5rem', marginLeft: '1rem'}} onClick={() => removeFromCart(item.product._id)}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 'bold'}}>
          <span>Total:</span>
          <span>${getCartTotal().toFixed(2)}</span>
        </div>
        <Link to="/checkout" className="btn btn-primary" style={{width: '100%', justifyContent: 'center'}}>
          Proceed to Checkout <ArrowRight size={20} />
        </Link>
      </div>
    </div>
  );
};

export default Cart;
