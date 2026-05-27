import React, { useState } from 'react';
import { useT } from '../contexts/LanguageContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function RegisterPage({ goto }) {
  const { t } = useT();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await register(email, password, name);
      goto('home');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page">
      <section className="section" style={{ maxWidth: 480, margin: '0 auto' }}>
        <div className="eyebrow">{t('Tạo tài khoản', 'Create account')}</div>
        <h2>{t('Đăng ký tài khoản', 'Register')}</h2>
        <form onSubmit={submit} style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label>{t('Họ tên', 'Name')}</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label>Email</label>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label>{t('Mật khẩu (tối thiểu 6 ký tự)', 'Password (min 6 chars)')}</label>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>
          {error && <div style={{ color: 'var(--maroon-700)', fontSize: 13 }}>{error}</div>}
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button className="btn btn-primary" type="submit" disabled={busy}>
              {busy ? t('Đang xử lý…', 'Working…') : t('Đăng ký', 'Register')}
            </button>
            <button className="btn btn-ghost" type="button" onClick={() => goto('login')}>
              {t('Đã có tài khoản? Đăng nhập', 'Have an account? Sign in')}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
