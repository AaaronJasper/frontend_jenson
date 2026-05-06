import '../App.css';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getMenu } from '../api';
import { useApp } from '../context/AppContext';

function CustomerMenu() {
  const navigate = useNavigate();
  const { arrivalTime } = useApp();

  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!arrivalTime) {
      navigate('/arrival-time');
    }
  }, [arrivalTime, navigate]);

  useEffect(() => {
  getMenu()
    .then(data => {
      console.log('MENU DATA:', data);
      setMenuItems(data);
    })
    .catch(() => setError('Failed to load menu. Please try again.'))
    .finally(() => setLoading(false));
}, []);

  function getPrice(item, size) {
    const sp = item.sizePrices?.find(s => s.size.toLowerCase() === size);
    return sp ? `£${parseFloat(sp.price).toFixed(2)}` : null;
  }

  return (
    <main className="customer-menu-page">
      <Navbar />

      <section className="menu-header">
        <h1>Order Menu</h1>
        <p>Choose your coffee and collection time</p>
      </section>

      {arrivalTime && (
        <section className="selected-arrival-box menu-arrival-box">
          <p>
            Train arrival time selected: <strong>{arrivalTime}</strong>
          </p>

          <button
            className="secondary-button"
            onClick={() => navigate('/arrival-time')}
          >
            Change arrival time
          </button>
        </section>
      )}

      <section className="menu-list">
        {loading && <p>Loading menu...</p>}
        {error && <p className="error-message">{error}</p>}

        {menuItems.map(item => (
          <div className={`drink-card ${!item.isAvailable ? 'unavailable' : ''}`}>
            <div className="drink-info">
              <h2>{item.name}</h2>

              <div className="drink-prices">
                {getPrice(item, 'regular') && (
                  <span>Regular: {getPrice(item, 'regular')}</span>
                )}
                {getPrice(item, 'large') && (
                  <span>Large: {getPrice(item, 'large')}</span>
                )}
              </div>

              {!item.isAvailable && (
                <div className="stock-label">Out of stock</div>
                )}

              {item.isAvailable ? (
                <Link to={`/drink-order/${item.itemId}`} className="drink-add-button">
                  Add
                </Link>
              ) : (
              <span className="drink-add-button unavailable">
                Unavailable
              </span>
            )}
            
            </div>

            <div className="drink-image-wrapper">
              <img src={item.imgUrl} alt={item.name} />

              {item.rating && (
                <div className="rating-badge">
                  <span>⭐</span>
                  <span>{parseFloat(item.rating).toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}

export default CustomerMenu;