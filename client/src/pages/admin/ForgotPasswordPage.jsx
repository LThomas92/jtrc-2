import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '@lib/api';

export default function ForgotPasswordPage() {
  const [email,     setEmail]     = useState('');
  const [loading,   setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error,     setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authAPI.forgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <div className="admin-login__folio">Admin · Password Reset</div>

        {submitted ? (
          <>
            <h1 className="admin-login__title">
              Check your <em>logs</em>
            </h1>
            <p className="admin-login__sub">
              A reset link has been generated. Go to your{' '}
              <strong>Railway dashboard → Deployments → View Logs</strong>{' '}
              and look for the line that starts with{' '}
              <strong>🔑 PASSWORD RESET LINK</strong>. Copy that URL and open it.
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.14em', color: 'var(--color-ink-fade)', marginTop: 16 }}>
              Link expires in 1 hour.
            </p>
            <Link to="/admin/login" className="admin-login__btn" style={{ marginTop: 24, display: 'flex', textDecoration: 'none' }}>
              Back to login
            </Link>
          </>
        ) : (
          <>
            <h1 className="admin-login__title">
              Forgot your <em>password?</em>
            </h1>
            <p className="admin-login__sub">
              Enter your admin email and we'll generate a reset link in the server logs.
            </p>

            <form className="admin-login__form" onSubmit={handleSubmit}>
              <div className="admin-login__field">
                <span>Email address</span>
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>

              {error && (
                <p style={{ color: 'var(--color-terracotta)', fontFamily: 'var(--font-serif)', fontSize: '0.88rem', fontStyle: 'italic' }}>
                  {error}
                </p>
              )}

              <button type="submit" className="admin-login__btn" disabled={loading}>
                {loading ? 'Generating link…' : 'Generate reset link →'}
              </button>
            </form>

            <Link to="/admin/login" style={{ display: 'block', marginTop: 20, fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-ink-fade)', textAlign: 'center' }}>
              ← Back to login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
