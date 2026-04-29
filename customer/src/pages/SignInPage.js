import '../App.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '../api';
import { useApp } from '../context/AppContext';

function SignInPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await apiFetch('/api/v1/auth/authenticate', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      login({ email }, data.token);
      navigate('/home');
    } catch (err) {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="signin-page">
      <section className="signin-content">
        <form className="signin-card" onSubmit={handleSubmit}>
          <h1>Sign in</h1>
          <p>to get started</p>

          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="signin-button" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <Link to="/home" className="guest-button">
            Continue as guest
          </Link>
        </form>
      </section>
    </main>
  );
}

export default SignInPage;
