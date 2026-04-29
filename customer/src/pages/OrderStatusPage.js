import '../App.css';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';
import { apiFetch } from '../api';

const STATUS_STEPS = ['ACCEPTED', 'PREPARING', 'READY'];

const STATUS_LABELS = {
  NEW: 'Order Placed',
  ACCEPTED: 'Accepted',
  PREPARING: 'Preparing',
  READY: 'Ready for Collection',
  COLLECTED: 'Collected',
  CANCELLED: 'Cancelled',
};

function getStepIndex(status) {
  if (status === 'NEW') return 0;
  return STATUS_STEPS.indexOf(status) + 1;
}

function OrderStatusPage() {
  const { currentOrderId } = useApp();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentOrderId) {
      setLoading(false);
      return;
    }
    apiFetch(`/api/orders/${currentOrderId}`)
      .then(setOrder)
      .catch(() => setError('Could not load order details.'))
      .finally(() => setLoading(false));
  }, [currentOrderId]);

  // Poll every 10 seconds while order is active
  useEffect(() => {
    if (!currentOrderId) return;
    const interval = setInterval(() => {
      apiFetch(`/api/orders/${currentOrderId}`)
        .then(setOrder)
        .catch(() => {});
    }, 10000);
    return () => clearInterval(interval);
  }, [currentOrderId]);

  return (
    <main className="order-status-page">
      <Navbar />

      <section className="status-content">
        <h1>Order Progress</h1>

        {loading && <p>Loading order...</p>}
        {error && <p className="error-message">{error}</p>}

        {!currentOrderId && !loading && (
          <p>No active order. Place an order first.</p>
        )}

        {order && (
          <div className="status-card">
            <p className="order-number">Order #{order.id}</p>
            <h2>{STATUS_LABELS[order.status] || order.status}</h2>

            {order.status !== 'CANCELLED' && (
              <>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${(getStepIndex(order.status) / 3) * 100}%` }}
                  />
                  <span className={`progress-step step-one ${getStepIndex(order.status) >= 1 ? 'active' : ''}`}>✓</span>
                  <span className={`progress-step step-two ${getStepIndex(order.status) >= 2 ? 'active' : ''}`}>☕</span>
                  <span className={`progress-step step-three ${getStepIndex(order.status) >= 3 ? 'active' : ''}`}>🥤</span>
                </div>

                <div className="status-labels">
                  <span>Accepted</span>
                  <span>Preparing</span>
                  <span>Ready</span>
                </div>
              </>
            )}

            {order.pickupTime && (
              <div className="pickup-box">
                <strong>Pickup time</strong>
                <span>{order.pickupTime}</span>
              </div>
            )}

            <div className="order-summary-box">
              <h3>Your Order</h3>
              {order.items?.map((item, idx) => (
                <p key={idx}>
                  {item.menuItem?.name} x{item.quantity} ({item.size})
                </p>
              ))}
              <p><strong>Total: £{parseFloat(order.totalPrice).toFixed(2)}</strong></p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default OrderStatusPage;
