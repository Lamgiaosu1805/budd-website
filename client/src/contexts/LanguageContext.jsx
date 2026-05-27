import React, { createContext, useContext, useEffect, useState } from 'react';

const LanguageContext = createContext({ lang: 'vi', setLang: () => {} });

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('kct_lang') || 'vi'; } catch { return 'vi'; }
  });

  useEffect(() => {
    try { localStorage.setItem('kct_lang', lang); } catch {}
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useT() {
  const { lang, setLang } = useContext(LanguageContext);
  const t = (vi, en) => (lang === 'vi' ? vi : en);
  return { t, lang, setLang };
}

export function LanguageToggle() {
  const { lang, setLang } = useContext(LanguageContext);
  return (
    <div className="lang-toggle" role="group" aria-label="Language">
      <button
        className={lang === 'vi' ? 'active' : ''}
        onClick={() => setLang('vi')}
        aria-pressed={lang === 'vi'}
      >VI</button>
      <span className="divider"></span>
      <button
        className={lang === 'en' ? 'active' : ''}
        onClick={() => setLang('en')}
        aria-pressed={lang === 'en'}
      >EN</button>
    </div>
  );
}
