import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { authAPI } from '@lib/api';

export default function ResetPasswordPage() {
  const [searchParams]          = useSearchParams();
  const navigate                = useNavigate();
  const token                   = searchParams.get('token');
  const [password,  setPassword]  = useState('');
  const [confirm,   setConfirm]   = useState('');
  const [loading,   setLoading]   = useState(false);
  const [success,   setSuccess]   = useState(false);
  const [error,     setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (!token) {
      setError('Invalid reset link — no token found.');
      return;
    }

    setLoading(true);
    try {
      await authAPI.resetPassword(token, password);
      setSuccess(true);
      setTimeout(() => navigate('/admin/login'), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="admin-login">
        <div className="admin-login__card">
          <div className="admin-login__folio">Admin · Password Reset</div>
          <h1 className="admin-login__title">Invalid <em>link</em></h1>
          <p className="admin-login__sub">This reset link is missing a token. Please request a new one.</p>
          <Link to="/admin/forgot-password" className="admin-login__btn" style={{ display: 'flex', marginTop: 20, textDecoration: 'none' }}>
            Request new link →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <div className="admin-login__folio">Admin · Password Reset</div>

        {success ? (
          <>
            <h1 className="admin-login__title">Password <em>updated</em></h1>
            <p className="admin-login__sub">
              Your password has been reset successfully. Redirecting you to login…
            </p>
          </>
        ) : (
          <>
            <h1 className="admin-login__title">Set new <em>password</em></h1>
            <p className="admin-login__sub">Choose a strong password — at least 8 characters.</p>

            <form className="admin-login__form" onSubmit={handleSubmit}>
              <div className="admin-login__field">
                <span>New password</span>
                <input
                  type="password"
                  required
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>

              <div className="admin-login__field">
                <span>Confirm password</span>
                <input
                  type="password"
                  required
                  placeholder="Repeat your password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  autoComplete="new-password"
                />
              </div>

              {error && (
                <p style={{ color: 'var(--color-terracotta)', fontFamily: 'var(--font-serif)', fontSize: '0.88rem', fontStyle: 'italic' }}>
                  {error}
                </p>
              )}

              <button type="submit" className="admin-login__btn" disabled={loading}>
                {loading ? 'Resetting…' : 'Reset password →'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
