import { Link } from 'react-router-dom';
import '../App.css';
import { useApp } from '../context/AppContext';

function Navbar() {
  const { basketCount, user } = useApp();

  return (
    <nav className="navbar">
      <Link to="/home" className="nav-left">
        <img src="/images/logo.png" alt="logo" className="nav-logo" />
        <span className="nav-home-text">home</span>
      </Link>

      <div className="nav-actions">
        <Link to="/order" className="nav-item">
          <span className="nav-icon">☕</span>
          <span>order</span>
        </Link>

        <Link to="/status" className="nav-item">
          <span className="nav-icon">📍</span>
          <span>order progress</span>
        </Link>

        <Link to="/basket" className="nav-item basket-nav-item">
          {basketCount > 0 && <span className="basket-count">{basketCount}</span>}
          <span className="nav-icon">🛒</span>
          <span>basket</span>
        </Link>

        <Link to={user ? '/account' : '/signin'} className="nav-item">
          <span className="nav-icon">👤</span>
          <span>{user ? (user.name?.split(' ')[0] || user.email.split('@')[0]) : 'sign in'}</span>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
