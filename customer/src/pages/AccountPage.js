import '../App.css';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

function AccountPage() {
  const { user, logout } = useApp();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/signin');
  }

  return (
    <main className="account-page">
      <nav className="account-navbar">
        <img src="/images/logo.png" alt="Group 8 Cafe" className="account-logo" />
        <div className="account-back" onClick={() => navigate(-1)} style={{ cursor: 'pointer' }}>
          <span className="back-icon">←</span>
          <span>back</span>
        </div>
      </nav>

      <section className="account-content">
        {user ? (
          <>
            <div className="account-info">
              <h1>Hello, {user.name || user.email}!</h1>
              <p className="account-email">{user.email}</p>
            </div>

            <h2>Buy nine coffees, get your tenth for free!</h2>

            <div className="loyalty-card">
              <div className="stamp filled">☕</div>
              <div className="stamp filled">☕</div>
              <div className="stamp filled">☕</div>
              <div className="stamp filled">☕</div>
              <div className="stamp filled">☕</div>
              <div className="stamp empty">☕</div>
              <div className="stamp empty">☕</div>
              <div className="stamp empty">☕</div>
              <div className="stamp empty">☕</div>
              <div className="stamp reward">🥤</div>
            </div>

            <p className="loyalty-message">
              5 coffees collected. Buy 4 more to unlock your free drink.
            </p>

            <button className="signout-button" onClick={handleLogout}>
              Sign Out
            </button>
          </>
        ) : (
          <>
            <h1>You are not signed in</h1>
            <p className="loyalty-message">Sign in to track your loyalty rewards and order history.</p>
            <button className="signin-button" onClick={() => navigate('/signin')}>
              Sign In
            </button>
          </>
        )}
      </section>
    </main>
  );
}

export default AccountPage;
