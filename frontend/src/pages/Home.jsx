import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const Home = () => {
  return (
    <div className="hero">
      <h1>Experience the <span>Future</span> of Shopping</h1>
      <p>Discover premium products curated just for you. Seamless checkout, lightning-fast delivery, and an unparalleled aesthetic experience.</p>
      <Link to="/products" className="btn btn-primary" style={{padding: '1rem 2.5rem', fontSize: '1.2rem', borderRadius: '30px'}}>
        <Sparkles size={20} /> Shop Collection
      </Link>
    </div>
  );
};

export default Home;
