import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [paymentId, setPaymentId] = useState('');

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mock payment gateway delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const orderData = {
        items: cart.map(item => ({ productId: item.product._id, quantity: item.quantity, price: item.product.price })),
        shippingAddress: {
          fullName: formData.fullName,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode
        }
      };

      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await axios.post(`${apiBase}/orders/checkout`, orderData);
      
      setPaymentId(res.data.paymentId);
      setSuccess(true);
      clearCart();
    } catch (error) {
      console.error("Checkout failed", error);
      alert(error.response?.data?.message || "Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0 && !success) {
    navigate('/products');
    return null;
  }

  if (success) {
    return (
      <div style={{textAlign: 'center', marginTop: '5rem'}}>
        <CheckCircle size={64} color="var(--success)" style={{marginBottom: '1rem'}} />
        <h2>Payment Successful!</h2>
        <p style={{color: 'var(--text-muted)', margin: '1rem 0'}}>Your order has been placed. Payment ID: {paymentId}</p>
        <button onClick={() => navigate('/products')} className="btn btn-primary">Continue Shopping</button>
      </div>
    );
  }

  return (
    <div style={{maxWidth: '600px', margin: '0 auto'}}>
      <h2 style={{marginBottom: '2rem'}}>Checkout</h2>
      
      <div style={{backgroundColor: 'var(--surface-color)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem'}}>
        <h3 style={{marginBottom: '1rem'}}>Order Summary</h3>
        <p style={{fontSize: '1.2rem', fontWeight: 'bold'}}>Total to Pay: ${getCartTotal().toFixed(2)}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <h3 style={{marginBottom: '1rem'}}>Shipping Details</h3>
        <div className="form-group">
          <label>Full Name</label>
          <input type="text" name="fullName" required className="form-control" onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Address</label>
          <input type="text" name="address" required className="form-control" onChange={handleChange} />
        </div>
        <div style={{display: 'flex', gap: '1rem'}}>
          <div className="form-group" style={{flex: 1}}>
            <label>City</label>
            <input type="text" name="city" required className="form-control" onChange={handleChange} />
          </div>
          <div className="form-group" style={{flex: 1}}>
            <label>Zip Code</label>
            <input type="text" name="zipCode" required className="form-control" onChange={handleChange} />
          </div>
        </div>

        <h3 style={{marginBottom: '1rem', marginTop: '2rem'}}>Payment Details (Mock)</h3>
        <div className="form-group">
          <label>Card Number</label>
          <input type="text" name="cardNumber" required placeholder="0000 0000 0000 0000" className="form-control" onChange={handleChange} />
        </div>
        <div style={{display: 'flex', gap: '1rem'}}>
          <div className="form-group" style={{flex: 1}}>
            <label>Expiry Date</label>
            <input type="text" name="expiry" required placeholder="MM/YY" className="form-control" onChange={handleChange} />
          </div>
          <div className="form-group" style={{flex: 1}}>
            <label>CVV</label>
            <input type="text" name="cvv" required placeholder="123" className="form-control" onChange={handleChange} />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '1rem', justifyContent: 'center'}} disabled={loading}>
          {loading ? 'Processing Payment...' : 'Pay Now'}
        </button>
      </form>
    </div>
  );
};

export default Checkout;
