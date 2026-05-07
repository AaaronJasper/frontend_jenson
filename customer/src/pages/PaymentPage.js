import '../App.css';
import { useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';
import { apiFetch, makeHorsePayPayment } from '../api';

function PaymentPage() {
  const navigate = useNavigate();

  const {
    basket,
    clearBasket,
    setCurrentOrderId,
    user,
    arrivalTime
  } = useApp();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const checkoutData = useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem('checkoutData'));
    } catch {
      return null;
    }
  }, []);

  const total = basket.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  if (!arrivalTime) {
    return <Navigate to="/arrival-time" replace />;
  }

  if (basket.length === 0 || !checkoutData) {
    return <Navigate to="/basket" replace />;
  }

  function getPaymentDateParts() {
    const now = new Date();

    const date = now.toLocaleDateString('en-GB').replace(/\//g, '/');

    const time = now.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    return { date, time };
  }

  function createCustomerId() {
    if (user?.id) return `C${user.id}`;

    const safeName = checkoutData.guestName
      .replace(/\s+/g, '')
      .slice(0, 20)
      .toUpperCase();

    return `GUEST${safeName}${Date.now().toString().slice(-5)}`;
  }

  function validateBasketBeforePayment() {
    const invalidItem = basket.find(
      item => !item.size || item.size.trim() === ''
    );

    if (invalidItem) {
      return `${invalidItem.name} is missing a valid size. Please remove it and add it again.`;
    }

    const invalidQuantity = basket.find(
      item => !item.quantity || item.quantity <= 0
    );

    if (invalidQuantity) {
      return `${invalidQuantity.name} has an invalid quantity.`;
    }

    const invalidPrice = basket.find(
      item => item.unitPrice === undefined || item.unitPrice === null || item.unitPrice <= 0
    );

    if (invalidPrice) {
      return `${invalidPrice.name} has an invalid price.`;
    }

    if (!arrivalTime || arrivalTime.trim() === '') {
      return 'Please select a valid collection arrival time.';
    }

    return null;
  }

  async function handlePayment() {
    setError('');

    const validationError = validateBasketBeforePayment();

    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    setLoading(true);

    try {
      const { date, time } = getPaymentDateParts();

      const paymentPayload = {
        storeID: 'Team08',
        customerID: createCustomerId(),
        date,
        time,
        timeZone: 'GMT',
        transactionAmount: Number(total.toFixed(2)),
        currencyCode: 'GBP',

        // Remove this before final submission if your lecturer wants random success/failure.
        forcePaymentSatusReturnType: true,
      };

      const paymentResult = await makeHorsePayPayment(paymentPayload);

      if (!paymentResult?.paymetSuccess?.Status) {
        throw new Error(
          paymentResult?.paymetSuccess?.reason || 'Payment declined.'
        );
      }

      const orderPayload = {
        guestName: user ? null : checkoutData.guestName,
        menuItemIds: basket.map(i => i.menuItemId),
        sizes: basket.map(i => i.size),
        quantities: basket.map(i => i.quantity),
        pickupTime: arrivalTime,
      };

      const order = await apiFetch('/api/orders/order', {
        method: 'POST',
        body: JSON.stringify(orderPayload),
      });

      setCurrentOrderId(order.id);
      clearBasket();
      sessionStorage.removeItem('checkoutData');

      toast.success('Payment successful. Order placed!');
      navigate('/status');
    } catch (err) {
      const message = err.message || 'Payment failed. Please try again.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="payment-page">
      <Navbar />

      <section className="payment-card">
        <div className="payment-header">
          <span className="payment-secure-badge">Secure payment</span>
          <h1>Secure checkout</h1>
          <p>Complete payment now so your drinks can be prepared before you arrive.</p>
        </div>

        <div className="payment-summary">
          <h2>Order summary</h2>

          {basket.map(item => (
            <div className="payment-summary-row" key={`${item.menuItemId}-${item.size}`}>
              <span>
                {item.quantity} × {item.name}
                <small>
                  {item.size
                    ? item.size.charAt(0).toUpperCase() + item.size.slice(1)
                    : 'No size selected'}
                </small>
              </span>

              <strong>£{(item.unitPrice * item.quantity).toFixed(2)}</strong>
            </div>
          ))}

          <div className="payment-summary-arrival">
            <span>Collection arrival time</span>
            <strong>{arrivalTime}</strong>
          </div>

          <div className="payment-summary-total">
            <span>Total to pay</span>
            <strong>£{total.toFixed(2)}</strong>
          </div>
        </div>

        <div className="payment-method-box">
          <h2>Payment method</h2>
          <p>HorsePay dummy online payment</p>

          <div className="fake-card-preview">
            <span>HorsePay</span>
            <strong>•••• •••• •••• 8019</strong>
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="payment-actions">
          <button
            className="secondary-button"
            onClick={() => navigate('/basket')}
            disabled={loading}
          >
            Back to basket
          </button>

          <button
            className="payment-button"
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? 'Processing payment...' : `Pay £${total.toFixed(2)}`}
          </button>
        </div>
      </section>
    </main>
  );
}

export default PaymentPage;