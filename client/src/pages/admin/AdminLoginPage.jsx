import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '@store/useAuth';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuth((s) => s.login);
  const loading = useAuth((s) => s.loading);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      toast.success('Welcome back');
      const from = location.state?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <div className="admin-login__folio">Admin Portal</div>
        <h1 className="admin-login__title">
          Welcome <em>back</em>
        </h1>
        <p className="admin-login__sub">
          Sign in to manage your catering operation.
        </p>

        <form onSubmit={handleSubmit} className="admin-login__form">
          <label className="admin-login__field">
            <span>Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
          </label>
          <label className="admin-login__field">
            <span>Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button type="submit" disabled={loading} className="admin-login__btn">
            {loading ? 'Signing in…' : 'Sign in'} <span>→</span>
          </button>
        </form>
      </div>
    </div>
  );
}
