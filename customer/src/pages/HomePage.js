import '../App.css';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { mockMenu } from '../data/mockMenu';

function HomePage() {
  const navigate = useNavigate();
  const { arrivalTime } = useApp();

  const popularDrinks = mockMenu.filter(drink =>
    ['Latte', 'Cappuccino', 'Hot Chocolate'].includes(drink.name)
  );

  function handleStartOrder() {
    navigate(arrivalTime ? '/order' : '/arrival-time');
  }

  function handlePopularDrinkClick(drinkId) {
    if (!arrivalTime) {
      navigate('/arrival-time');
      return;
    }

    navigate(`/drink-order/${drinkId}`);
  }

  return (
    <main className="home-page">
      <Navbar />

      <section className="hero-section">
        <h1>Welcome to Whistlestop Coffee Hut</h1>
        <p>Order ahead and collect fresh coffee at Cramlington Station.</p>

        <button
        className="primary-button homepage-action-button"
        onClick={handleStartOrder}
        >
          Start Order
        </button>
      </section>

      {arrivalTime && (
        <section className="selected-arrival-box home-arrival-box">
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

      <section className="quick-order-section">
        <div>
          <h2>Quick Order</h2>
          <p>In a rush? Reorder your usual coffee in seconds.</p>
        </div>

        <button className="quick-order-button homepage-action-button">
          Quick Order
        </button>
      </section>

      <section className="popular-section">
        <h2>Popular Drinks</h2>

        <div className="popular-grid">
          {popularDrinks.map(drink => (
            <button
              key={drink.itemId}
              type="button"
              className="popular-card popular-card-button"
              onClick={() => handlePopularDrinkClick(drink.itemId)}
              disabled={!drink.isAvailable}
              aria-label={`Order ${drink.name}`}
            >
              <img src={drink.imgUrl} alt={drink.name} />
              <h3>{drink.name}</h3>

              {!drink.isAvailable && (
                <span className="out-of-stock-badge">Out of stock</span>
              )}
            </button>
          ))}
        </div>
      </section>

      <section className="offer-section">
        <h2>Today’s Offer</h2>
        <p>Free extra shot with any large coffee.</p>
      </section>

      <section className="story-section">
        <h2>Our Story</h2>
        <p>
          Whistlestop Coffee Hut serves quick, warm drinks for commuters,
          students and travellers passing through Cramlington Station.
        </p>
      </section>
    </main>
  );
}

export default HomePage;