import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
import { useApp } from '../context/AppContext';
import { Coffee, MapPin, ShoppingCart, User } from 'lucide-react';

function Navbar() {
  const { basketCount, user, arrivalTime } = useApp();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <Link to="/home" className="nav-left">
        <img src="/images/logo.png" alt="logo" className="nav-logo" />
        <span className="nav-home-text">home</span>
      </Link>

      <div className="nav-actions">
        <div
        className="nav-item"
        onClick={() => navigate(arrivalTime ? '/order' : '/arrival-time')}
        style={{ cursor: 'pointer' }}>
          <div className="nav-icon">
            <Coffee size={28} strokeWidth={2} />
          </div>
          <span>order</span>
        </div>

        <Link to="/status" className="nav-item">
          <div className="nav-icon">
            <MapPin size={28} strokeWidth={2} />
          </div>
          <span>order progress</span>
        </Link>

        <Link to="/basket" className="nav-item basket-nav-item">
          {basketCount > 0 && <span className="basket-count">{basketCount}</span>}
          <div className="nav-icon">
            <ShoppingCart size={32} strokeWidth={2} />
          </div>
          <span>basket</span>
        </Link>

        <Link to={user ? '/account' : '/signin'} className="nav-item">
          <div className="nav-icon">
            <User size={35} strokeWidth={2} />
          </div>
          <span>{user ? (user.name?.split(' ')[0] || user.email.split('@')[0]) : 'sign in'}</span>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
