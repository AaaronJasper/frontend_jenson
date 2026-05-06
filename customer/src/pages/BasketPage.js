import '../App.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';

function BasketPage() {
  const {
    basket,
    user,
    arrivalTime,
    increaseBasketItem,
    decreaseBasketItem,
    removeBasketItem
  } = useApp();

  const navigate = useNavigate();
  const [guestName, setGuestName] = useState('');
  const [error, setError] = useState('');

  const total = basket.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  function handleContinueToPayment() {
    if (!arrivalTime) {
      navigate('/arrival-time');
      return;
    }

    if (!user && !guestName.trim()) {
      setError('Please enter your name to place a guest order.');
      return;
    }

    const checkoutData = {
      guestName: user ? null : guestName.trim(),
      total,
    };

    sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));
    setError('');
    navigate('/payment');
  }

  return (
    <main className="basket-page">
      <Navbar />

      <section className="basket-content">
        <h1>Checkout</h1>

        {basket.length === 0 && <p>Your basket is empty.</p>}

        {basket.map(item => (
          <div className="basket-item" key={`${item.menuItemId}-${item.size}`}>
            {item.image && <img src={item.image} alt={item.name} />}

            <div className="basket-item-info">
              <h2>{item.name}</h2>
              <p>{item.size.charAt(0).toUpperCase() + item.size.slice(1)}</p>

              <div className="basket-controls">
                <div className="basket-quantity-control">
                  <button onClick={() => decreaseBasketItem(item.menuItemId, item.size)}>
                    −
                  </button>

                  <span>{item.quantity}</span>

                  <button onClick={() => increaseBasketItem(item.menuItemId, item.size)}>
                    +
                  </button>
                </div>

                <button
                  className="remove-item-button"
                  onClick={() => removeBasketItem(item.menuItemId, item.size)}
                >
                  Remove
                </button>
              </div>
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

            {arrivalTime && (
              <section className="selected-arrival-box change-arrival-wrapper">
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
              onClick={handleContinueToPayment}
            >
              Continue to Payment
            </button>
          </>
        )}
      </section>
    </main>
  );
}

export default BasketPage;