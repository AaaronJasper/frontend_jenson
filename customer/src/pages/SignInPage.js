import '../App.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '../api';
import { useApp } from '../context/AppContext';

function SignInPage() {
  const { login } = useApp();
  const navigate = useNavigate();

  const [tab, setTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function switchTab(t) {
    setTab(t);
    setError('');
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await apiFetch('/api/v1/auth/authenticate', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (data.role !== 'CUSTOMER') {
        setError('This portal is for customers only.');
        return;
      }
      login({ name: data.name, email, role: data.role }, data.token);
      navigate('/home');
    } catch {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await apiFetch('/api/v1/auth/register', {
        method: 'POST',
        body: JSON.stringify({ firstname, lastname, email, password, role: 'CUSTOMER' }),
      });
      login({ name: data.name, email, role: data.role }, data.token);
      navigate('/home');
    } catch {
      setError('Registration failed. Email may already be in use.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="signin-page">
      <section className="signin-content">
        <div className="signin-card">
          <h1>Welcome</h1>
          <p>Sign in or create an account</p>

          <div className="signin-tabs">
            <button
              type="button"
              className={tab === 'login' ? 'active' : ''}
              onClick={() => switchTab('login')}
            >
              Sign In
            </button>
            <button
              type="button"
              className={tab === 'register' ? 'active' : ''}
              onClick={() => switchTab('register')}
            >
              Register
            </button>
          </div>

          {tab === 'login' ? (
            <form onSubmit={handleLogin}>
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
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <label>First Name</label>
              <input
                type="text"
                value={firstname}
                onChange={e => setFirstname(e.target.value)}
                required
              />
              <label>Last Name</label>
              <input
                type="text"
                value={lastname}
                onChange={e => setLastname(e.target.value)}
                required
              />
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
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
          )}

          <Link to="/home" className="guest-button">
            Continue as guest
          </Link>
        </div>
      </section>
    </main>
  );
}

export default SignInPage;
