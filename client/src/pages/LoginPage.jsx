import React, { useState } from 'react';
import { useT } from '../contexts/LanguageContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function LoginPage({ goto }) {
  const { t } = useT();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const user = await login(email, password);
      goto(user.role === 'admin' ? 'admin' : 'home');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page">
      <section className="section" style={{ maxWidth: 480, margin: '0 auto' }}>
        <div className="eyebrow">{t('Đăng nhập', 'Sign in')}</div>
        <h2>{t('Đăng nhập', 'Sign in')}</h2>
        <form onSubmit={submit} style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label>Email</label>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
          </div>
          <div>
            <label>{t('Mật khẩu', 'Password')}</label>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <div style={{ color: 'var(--maroon-700)', fontSize: 13 }}>{error}</div>}
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button className="btn btn-primary" type="submit" disabled={busy}>
              {busy ? t('Đang xử lý…', 'Working…') : t('Đăng nhập', 'Sign in')}
            </button>
            <button className="btn btn-ghost" type="button" onClick={() => goto('register')}>
              {t('Đăng ký', 'Register')}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
