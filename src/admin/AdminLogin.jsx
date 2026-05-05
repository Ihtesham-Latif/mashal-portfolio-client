import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, loading, error, clearError } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e?.preventDefault();
    clearError();
    const ok = await login(form.email, form.password);
    if (ok) navigate('/admin/dashboard');
  };

  return (
    <div id="admin-app">
      <div className="a-login">
        <div className="login-box">
          <h2>Admin Login</h2>
          <p className="lsub">Mashal Portfolio — Admin Panel</p>

          <div className="fg">
            <label>Email</label>
            <input
              type="email"
              placeholder="admin@mashal.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
          </div>
          <div className="fg">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          {error && <p className="a-err">{error}</p>}

          <button className="btn-blue" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>

          <button
            style={{ marginTop: '1rem', background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: '0.8rem', width: '100%', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            onClick={() => navigate('/')}
          >
            ← Back to Portfolio
          </button>
        </div>
      </div>
    </div>
  );
}
