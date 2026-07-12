import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

const Navbar = () => {
  const { cart } = useCart();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearch = (e) => {
    e.preventDefault();
    if(searchTerm.trim()) {
      navigate(`/products?search=${searchTerm}`);
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">NexusCart</Link>
      
      <form className="nav-search" onSubmit={handleSearch}>
        <Search size={18} color="var(--text-muted)" />
        <input 
          type="text" 
          placeholder="Search products..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>

      <div className="nav-links">
        <Link to="/products" className="nav-link">Shop</Link>
        <Link to="/cart" className="nav-link cart-icon">
          <ShoppingCart size={24} />
          {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
