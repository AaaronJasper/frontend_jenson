import '../App.css';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '../api';
import { useApp } from '../context/AppContext';

function DrinkOrderPage() {
  const { drinkId } = useParams();
  const navigate = useNavigate();
  const { addToBasket } = useApp();

  const [drink, setDrink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    apiFetch(`/api/menu/${drinkId}`)
      .then(data => {
        setDrink(data);
        const first = data.sizePrices?.[0]?.size || '';
        setSelectedSize(first.toLowerCase());
      })
      .catch(() => setError('Could not load drink details.'))
      .finally(() => setLoading(false));
  }, [drinkId]);

  function getUnitPrice() {
    if (!drink) return 0;
    const sp = drink.sizePrices?.find(s => s.size.toLowerCase() === selectedSize);
    return sp ? parseFloat(sp.price) : 0;
  }

  function handleConfirm() {
    addToBasket({
      menuItemId: drink.itemId,
      name: drink.name,
      image: drink.imgUrl,
      size: selectedSize,
      quantity,
      unitPrice: getUnitPrice(),
    });
    navigate('/order');
  }

  if (loading) return <main className="drink-order-page"><p>Loading...</p></main>;
  if (error) return <main className="drink-order-page"><p className="error-message">{error}</p></main>;

  const total = (getUnitPrice() * quantity).toFixed(2);

  return (
    <main className="drink-order-page">
      <nav className="navbar">
        <div className="nav-left">
          <img src="/images/logo.png" alt="logo" className="nav-logo" />
        </div>
        <div className="nav-actions">
          <div className="nav-item" onClick={() => navigate(-1)} style={{ cursor: 'pointer' }}>
            <span className="nav-icon">←</span>
            <span>back</span>
          </div>
        </div>
      </nav>

      <section className="drink-order-card">
        <img src={drink.imgUrl} alt={drink.name} className="drink-order-image" />
        <h1>{drink.name}</h1>
        <p className="drink-description">{drink.description}</p>

        <div className="option-section">
          <h2>Choose size</h2>
          <div className="option-buttons">
            {drink.sizePrices?.map(sp => (
              <button
                key={sp.size}
                className={selectedSize === sp.size.toLowerCase() ? 'selected' : ''}
                onClick={() => setSelectedSize(sp.size.toLowerCase())}
              >
                {sp.size.charAt(0).toUpperCase() + sp.size.slice(1)} £{parseFloat(sp.price).toFixed(2)}
              </button>
            ))}
          </div>
        </div>

        <div className="option-section">
          <h2>Quantity</h2>
          <div className="quantity-row">
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(q => q + 1)}>+</button>
          </div>
        </div>

        <div className="order-summary">
          <span>Total</span>
          <strong>£{total}</strong>
        </div>

        <button className="confirm-button" onClick={handleConfirm}>
          Add to Basket
        </button>
      </section>
    </main>
  );
}

export default DrinkOrderPage;
