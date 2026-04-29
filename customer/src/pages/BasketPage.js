import '../App.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';
import { apiFetch } from '../api';

function BasketPage() {
  const { basket, clearBasket, setCurrentOrderId, user } = useApp();
  const navigate = useNavigate();
  const [guestName, setGuestName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const total = basket.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  async function handlePlaceOrder() {
    if (!user && !guestName.trim()) {
      setError('Please enter your name to place a guest order.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const order = await apiFetch('/api/orders/order', {
        method: 'POST',
        body: JSON.stringify({
          guestName: user ? null : guestName.trim(),
          menuItemIds: basket.map(i => i.menuItemId),
          sizes: basket.map(i => i.size),
          quantities: basket.map(i => i.quantity),
        }),
      });
      setCurrentOrderId(order.id);
      clearBasket();
      navigate('/status');
    } catch (err) {
      setError('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="basket-page">
      <Navbar />

      <section className="basket-content">
        <h1>Checkout</h1>

        {basket.length === 0 && <p>Your basket is empty.</p>}

        {basket.map((item, idx) => (
          <div className="basket-item" key={idx}>
            {item.image && <img src={item.image} alt={item.name} />}
            <div>
              <h2>{item.name}</h2>
              <p>x{item.quantity} {item.size}</p>
            </div>
            <span>£{(item.unitPrice * item.quantity).toFixed(2)}</span>
          </div>
        ))}

        {basket.length > 0 && (
          <>
            <div className="basket-total">
              <strong>Total:</strong>
              <strong>£{total.toFixed(2)}</strong>
            </div>

            {!user && (
              <div className="guest-name-input">
                <label>Your name (for collection)</label>
                <input
                  type="text"
                  value={guestName}
                  onChange={e => setGuestName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
            )}

            {error && <p className="error-message">{error}</p>}

            <button
              className="payment-button"
              onClick={handlePlaceOrder}
              disabled={loading}
            >
              {loading ? 'Placing order...' : 'Place Order'}
            </button>
          </>
        )}
      </section>
    </main>
  );
}

export default BasketPage;
