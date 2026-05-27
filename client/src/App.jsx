import React, { useState, useEffect, useRef } from 'react';
import { useT, LanguageToggle } from './contexts/LanguageContext.jsx';
import { useAuth } from './contexts/AuthContext.jsx';
import {
  HomePage, TantraPage, TeacherPage, LecturesPage,
  EventsPage, PrayerPage, ForumPage,
} from './pages.jsx';
import AdminPage from './pages/AdminPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';

const PAGES = (t) => [
  { key: 'home', label: t('Trang chủ', 'Home') },
  { key: 'tantra', label: t('Mật tông', 'Vajrayāna') },
  { key: 'teacher', label: t('Rinpoche', 'Rinpoche') },
  { key: 'lectures', label: t('Bài giảng', 'Teachings') },
  { key: 'events', label: t('Sự kiện', 'Events') },
  { key: 'prayer', label: t('Cầu nguyện', 'Prayer') },
  { key: 'forum', label: t('Diễn đàn', 'Forum') },
];

const PAGE_COMPONENTS = {
  home: HomePage,
  tantra: TantraPage,
  teacher: TeacherPage,
  lectures: LecturesPage,
  events: EventsPage,
  prayer: PrayerPage,
  forum: ForumPage,
  admin: AdminPage,
  login: LoginPage,
  register: RegisterPage,
};

function readPageFromHash() {
  const h = window.location.hash.replace(/^#/, '');
  return PAGE_COMPONENTS[h] ? h : 'home';
}

function ChantToggle({ playing, onToggle }) {
  const { t } = useT();
  return (
    <button className={`chant-toggle ${playing ? 'playing' : ''}`} onClick={onToggle} title="Om Maṇi Padme Hūṃ">
      <span className="pulse"></span>
      <span>{playing ? t('Đang tụng', 'Chanting') : t('Tụng chú', 'Chant')}</span>
    </button>
  );
}

function Nav({ current, goto, chanting, toggleChant }) {
  const { t } = useT();
  const { user, isAdmin, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const pages = PAGES(t);
  return (
    <nav className="nav" data-screen-label="Navigation">
      <div className="nav-inner">
        <button className="brand" onClick={() => { goto('home'); setOpen(false); }} style={{ background: 'none', border: 'none', color: 'inherit' }}>
          <span className="brand-mark"><span></span></span>
          <span className="brand-name">
            {t('Khenpo Ogen Kalsang', 'Khenpo Ogen Kalsang')}
            <small>{t('DUDJOM TERSAR · MẬT TÔNG', 'DUDJOM TERSAR · VAJRAYĀNA')}</small>
          </span>
        </button>
        <ul className={`nav-links ${open ? 'open' : ''}`}>
          {pages.map((p) => (
            <li key={p.key}>
              <button className={current === p.key ? 'active' : ''} onClick={() => { goto(p.key); setOpen(false); }}>
                {p.label}
              </button>
            </li>
          ))}
          {isAdmin && (
            <li>
              <button className={current === 'admin' ? 'active' : ''} onClick={() => { goto('admin'); setOpen(false); }}>
                {t('Quản trị', 'Admin')}
              </button>
            </li>
          )}
        </ul>
        <div className="nav-actions">
          <LanguageToggle />
          <ChantToggle playing={chanting} onToggle={toggleChant} />
          {user ? (
            <button
              onClick={logout}
              style={{ background: 'none', border: '1px solid var(--gold-700)', color: 'var(--gold-400)', padding: '4px 10px', fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', borderRadius: 999, cursor: 'pointer' }}
              title={user.email}
            >{t('Đăng xuất', 'Logout')}</button>
          ) : (
            <button
              onClick={() => goto('login')}
              style={{ background: 'none', border: '1px solid var(--gold-700)', color: 'var(--gold-400)', padding: '4px 10px', fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', borderRadius: 999, cursor: 'pointer' }}
            >{t('Đăng nhập', 'Sign in')}</button>
          )}
          <button className="hamburger" onClick={() => setOpen(!open)} aria-label="Menu">
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  );
}

function Footer({ goto }) {
  const { t } = useT();
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-grid">
          <div>
            <div className="brand" style={{ marginBottom: 18 }}>
              <span className="brand-mark"><span></span></span>
              <span className="brand-name">
                Khenpo Ogen Kalsang
                <small>{t('DUDJOM TERSAR · MẬT TÔNG', 'DUDJOM TERSAR · VAJRAYĀNA')}</small>
              </span>
            </div>
            <p style={{ color: 'var(--cream-200)', fontSize: 14, lineHeight: 1.7, maxWidth: 320 }}>
              {t(
                'Trang chính thức của Khenpo Shedup Ogen Kalsang Rinpoche — kết nối Phật tử với dòng truyền thừa Dudjom Tersar.',
                'The official website of Khenpo Shedup Ogen Kalsang Rinpoche — connecting students with the Dudjom Tersar lineage.'
              )}
            </p>
            <div className="footer-mantra">ॐ मणि पद्मे हूँ</div>
          </div>
          <div>
            <h4>{t('Pháp môn', 'Dharma')}</h4>
            <ul>
              <li><a onClick={() => goto('tantra')} style={{ cursor: 'pointer' }}>{t('Giới thiệu Mật tông', 'About Vajrayāna')}</a></li>
              <li><a onClick={() => goto('teacher')} style={{ cursor: 'pointer' }}>{t('Rinpoche', 'About Rinpoche')}</a></li>
              <li><a onClick={() => goto('lectures')} style={{ cursor: 'pointer' }}>{t('Bài giảng & Kinh điển', 'Teachings & scriptures')}</a></li>
              <li><a onClick={() => goto('events')} style={{ cursor: 'pointer' }}>{t('Khóa nhập thất', 'Retreats')}</a></li>
            </ul>
          </div>
          <div>
            <h4>{t('Cộng đồng', 'Community')}</h4>
            <ul>
              <li><a onClick={() => goto('prayer')} style={{ cursor: 'pointer' }}>{t('Cầu nguyện trực tuyến', 'Online prayer')}</a></li>
              <li><a onClick={() => goto('prayer')} style={{ cursor: 'pointer' }}>{t('Cúng dường hồi hướng', 'Offerings & dedication')}</a></li>
              <li><a onClick={() => goto('forum')} style={{ cursor: 'pointer' }}>{t('Diễn đàn hỏi đáp', 'Forum & Q&A')}</a></li>
              <li><a onClick={() => goto('events')} style={{ cursor: 'pointer' }}>{t('Hoạt động thiện nguyện', 'Volunteer activities')}</a></li>
            </ul>
          </div>
          <div>
            <h4>{t('Liên hệ', 'Contact')}</h4>
            <ul>
              <li>Samye Memorial Buddhist Vihara</li>
              <li>Kathmandu, Nepal</li>
              <li>{t('Email · YouTube · Facebook', 'Email · YouTube · Facebook')}</li>
              <li>{t('Bản quyền © 2026', 'Copyright © 2026')}</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div>{t(
            'Nguyện đem công đức này — hướng về khắp tất cả — đệ tử và chúng sinh — đều trọn thành Phật đạo.',
            'By this merit may all attain omniscience — may all beings be free from suffering and the causes of suffering.'
          )}</div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <span>{t('Phát triển vì cộng đồng đệ tử Rinpoche', "For Rinpoche's global student community")}</span>
            <button onClick={() => goto('login')} style={{ background: 'none', border: '1px solid var(--gold-700)', color: 'var(--gold-400)', padding: '4px 10px', fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', borderRadius: 999, cursor: 'pointer' }}>Admin</button>
          </div>
        </div>
      </div>
    </footer>
  );
}

function useChant() {
  const ctxRef = useRef(null);
  const nodesRef = useRef([]);
  const [playing, setPlaying] = useState(false);

  const start = () => {
    if (ctxRef.current) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    ctxRef.current = ctx;

    const master = ctx.createGain();
    master.gain.value = 0;
    master.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 1.5);
    master.connect(ctx.destination);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;
    filter.Q.value = 0.7;
    filter.connect(master);

    const freqs = [110, 165, 220];
    const oscs = freqs.map((f, i) => {
      const o = ctx.createOscillator();
      o.type = i === 0 ? 'sine' : 'triangle';
      o.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = i === 0 ? 0.5 : 0.18;
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.18 + i * 0.07;
      lfoGain.gain.value = 0.04;
      lfo.connect(lfoGain).connect(g.gain);
      lfo.start();
      o.connect(g).connect(filter);
      o.start();
      return { o, g, lfo };
    });

    nodesRef.current = { master, filter, oscs };
    setPlaying(true);
  };

  const stop = () => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    const { master } = nodesRef.current;
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.0);
    setTimeout(() => {
      try { ctx.close(); } catch {}
      ctxRef.current = null;
    }, 1100);
    setPlaying(false);
  };

  const toggle = () => (playing ? stop() : start());

  useEffect(() => () => { if (ctxRef.current) try { ctxRef.current.close(); } catch {} }, []);

  return [playing, toggle];
}

export default function App() {
  const [page, setPage] = useState(readPageFromHash);
  const [chanting, toggleChant] = useChant();
  const { user, isAdmin, loading } = useAuth();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.location.hash = page === 'home' ? '' : `#${page}`;
  }, [page]);

  useEffect(() => {
    const onHash = () => setPage(readPageFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const goto = (key) => setPage(key);

  // Guard: admin page requires admin role
  let renderKey = page;
  if (page === 'admin') {
    if (loading) {
      return <div className="page"><section className="section"><p>Loading…</p></section></div>;
    }
    if (!user) renderKey = 'login';
    else if (!isAdmin) {
      return (
        <div className="page">
          <Nav current={page} goto={goto} chanting={chanting} toggleChant={toggleChant} />
          <main>
            <section className="section">
              <h2>403</h2>
              <p>Tài khoản này không có quyền admin. / This account is not an admin.</p>
              <button className="btn btn-ghost" onClick={() => goto('home')}>← Home</button>
            </section>
          </main>
        </div>
      );
    }
  }

  const Page = PAGE_COMPONENTS[renderKey] || HomePage;

  return (
    <div data-screen-label={renderKey}>
      <Nav current={renderKey} goto={goto} chanting={chanting} toggleChant={toggleChant} />
      <main>
        <Page goto={goto} />
      </main>
      <Footer goto={goto} />
    </div>
  );
}
