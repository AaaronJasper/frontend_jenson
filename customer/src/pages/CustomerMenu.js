import '../App.css';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { apiFetch } from '../api';

function CustomerMenu() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch('/api/menu')
      .then(data => setMenuItems(data.filter(item => item.isAvailable !== false)))
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

      <section className="menu-list">
        {loading && <p>Loading menu...</p>}
        {error && <p className="error-message">{error}</p>}
        {menuItems.map(item => (
          <div className="drink-card" key={item.itemId}>
            <div className="drink-info">
              <h2>{item.name}</h2>
              <div className="drink-prices">
                {getPrice(item, 'regular') && <span>Regular: {getPrice(item, 'regular')}</span>}
                {getPrice(item, 'large') && <span>Large: {getPrice(item, 'large')}</span>}
              </div>
              <Link to={`/drink-order/${item.itemId}`} className="drink-add-button">Add</Link>
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
