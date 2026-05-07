import '../App.css';
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { getMenuItem } from '../api';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

function DrinkOrderPage() {
  const { drinkId } = useParams();
  const navigate = useNavigate();
  const { addToBasket, arrivalTime } = useApp();

  const [drink, setDrink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    getMenuItem(drinkId)
      .then(data => {
        if (!data) {
          throw new Error('Drink not found');
        }

        setDrink(data);

        const firstValidSize = data.sizePrices?.[0]?.size || '';
        setSelectedSize(firstValidSize);
      })
      .catch(() => setError('Could not load drink details.'))
      .finally(() => setLoading(false));
  }, [drinkId]);

  if (!arrivalTime) {
    return <Navigate to="/arrival-time" replace />;
  }

  const hasValidSizes = drink?.sizePrices && drink.sizePrices.length > 0;

  function getUnitPrice() {
    if (!drink || !selectedSize) return 0;

    const selectedPrice = drink.sizePrices?.find(
      sp => sp.size === selectedSize
    );

    return selectedPrice ? parseFloat(selectedPrice.price) : 0;
  }

  function handleConfirm() {
    if (!drink?.isAvailable) {
      toast.error('This drink is currently unavailable.');
      return;
    }

    if (!hasValidSizes || !selectedSize.trim()) {
      toast.error('This item cannot be ordered because no size has been configured.');
      return;
    }

    const unitPrice = getUnitPrice();

    if (!unitPrice || unitPrice <= 0) {
      toast.error('This item cannot be ordered because its price is invalid.');
      return;
    }

    addToBasket({
      menuItemId: drink.itemId,
      name: drink.name,
      image: drink.imgUrl,
      size: selectedSize,
      quantity,
      unitPrice,
    });

    toast.success(`${quantity} ${drink.name} added to basket`);

    setTimeout(() => {
      navigate('/order');
    }, 650);
  }

  if (loading) {
    return (
      <main className="drink-order-page">
        <p>Loading...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="drink-order-page">
        <p className="error-message">{error}</p>
        <button className="secondary-button" onClick={() => navigate('/')}>
          Go back
        </button>
      </main>
    );
  }

  if (!drink.isAvailable) {
    return (
      <main className="drink-order-page">
        <p className="error-message">This drink is currently unavailable.</p>
        <button className="secondary-button" onClick={() => navigate('/')}>
          Go back
        </button>
      </main>
    );
  }

  const total = (getUnitPrice() * quantity).toFixed(2);
  const canAddToBasket = drink.isAvailable && hasValidSizes && selectedSize;

  return (
    <main className="drink-order-page">
      <nav className="navbar">
        <div className="nav-left">
          <img src="/images/logo.png" alt="logo" className="nav-logo" />
        </div>

        <div className="nav-actions">
          <div
            className="nav-item"
            onClick={() => navigate(-1)}
            style={{ cursor: 'pointer' }}
          >
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

          {hasValidSizes ? (
            <div className="option-buttons">
              {drink.sizePrices.map(sp => (
                <button
                  key={sp.size}
                  className={selectedSize === sp.size ? 'selected' : ''}
                  onClick={() => setSelectedSize(sp.size)}
                >
                  {sp.size} £{parseFloat(sp.price).toFixed(2)}
                </button>
              ))}
            </div>
          ) : (
            <p className="error-message">
              This item has no size configured and cannot be ordered.
            </p>
          )}
        </div>

        <div className="option-section">
          <h2>Quantity</h2>

          <div className="quantity-row">
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>
              -
            </button>

            <span>{quantity}</span>

            <button onClick={() => setQuantity(q => q + 1)}>
              +
            </button>
          </div>
        </div>

        <div className="order-summary">
          <span>Total</span>
          <strong>£{total}</strong>
        </div>

        <button
          className="confirm-button"
          onClick={handleConfirm}
          disabled={!canAddToBasket}
        >
          {canAddToBasket ? 'Add to Basket' : 'Unavailable'}
        </button>
      </section>
    </main>
  );
}

export default DrinkOrderPage;