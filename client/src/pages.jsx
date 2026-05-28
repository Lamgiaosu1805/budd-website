// ============================================================
// PAGES - All 7 modules · Bilingual (VI / EN)
// Khenpo Shedup Ogen Kalsang Rinpoche · Personal Website
// ============================================================
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useT } from './contexts/LanguageContext.jsx';
import { useCMS } from './contexts/CMSContext.jsx';
import { useAuth } from './contexts/AuthContext.jsx';
import { api } from './lib/api.js';

// ------------ Shared helpers ------------
const Eyebrow = ({ children, style }) => <div className="eyebrow" style={style}>{children}</div>;
const Silk = ({ label, variant = "", style }) => (
  <div className={`silk ${variant}`} style={style}>{label}</div>
);
const Tag = ({ children, variant = "" }) => <span className={`tag ${variant}`}>{children}</span>;

// Server-hosted image with placeholder fallback
const CmsImage = ({ src, alt, style }) => (
  src
    ? <img src={src} alt={alt || ''} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', ...(style || {}) }} />
    : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--maroon-800), var(--maroon-900))', display: 'grid', placeItems: 'center', ...(style || {}) }}>
        <span style={{ fontFamily: 'var(--f-serif)', color: 'var(--gold-600)', fontSize: 22, opacity: 0.5 }}>❧</span>
      </div>
);

// Image slot wrapper with fallback to silk placeholder (kept for non-CMS sections)
const PhotoSlot = ({ id, placeholder, shape = "rounded", style, className = "", variant = "" }) => (
  <image-slot
    id={id}
    shape={shape}
    placeholder={placeholder || "Drop image"}
    radius="2"
    class={className}
    style={Object.assign({ display: 'block', width: '100%', height: '100%', '--slot-bg': 'rgba(92,31,31,0.08)', background: variant === 'gold' ? 'linear-gradient(135deg, var(--cream-200), var(--cream-300))' : 'linear-gradient(135deg, var(--maroon-700), var(--maroon-800))', '--slot-fg': variant === 'gold' ? 'var(--maroon-700)' : 'var(--gold-400)' }, style || {})}
  ></image-slot>
);

// Accordion for lineage master entries
function LineageAccordion({ name, dates, role, content }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderTop: '1px solid var(--cream-300)' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left', gap: 16 }}
      >
        <div>
          <div style={{ fontFamily: 'var(--f-serif)', fontSize: 20, color: 'var(--maroon-800)', lineHeight: 1.3 }}>{name}</div>
          <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, letterSpacing: '0.15em', color: 'var(--gold-700)', textTransform: 'uppercase', marginTop: 4 }}>{dates}{role ? ` · ${role}` : ''}</div>
        </div>
        <span style={{ fontFamily: 'var(--f-mono)', fontSize: 22, color: 'var(--gold-600)', flexShrink: 0, lineHeight: 1 }}>{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div style={{ paddingBottom: 28 }}>
          <p style={{ color: 'var(--ink-700)', lineHeight: 1.85, margin: 0 }}>{content}</p>
        </div>
      )}
    </div>
  );
}

// CMS adapters - convert bilingual records to display objects
const cmsEventToDisplay = (e, lang) => ({
  ...e,
  day: e.day,
  monthShort: lang === 'vi' ? e.monthShort_vi : e.monthShort_en,
  month: lang === 'vi' ? e.month_vi : e.month_en,
  date: lang === 'vi' ? e.date_vi : e.date_en,
  title: lang === 'vi' ? e.title_vi : e.title_en,
  desc: lang === 'vi' ? e.desc_vi : e.desc_en,
  type: lang === 'vi' ? e.type_vi : e.type_en,
  duration: lang === 'vi' ? e.duration_vi : e.duration_en,
  attendees: lang === 'vi' ? e.attendees_vi : e.attendees_en,
});

const cmsLectureToDisplay = (l, lang) => ({
  ...l,
  title: lang === 'vi' ? l.title_vi : l.title_en,
  level: lang === 'vi' ? l.level_vi : l.level_en,
  tags: lang === 'vi' ? (l.tags_vi || []) : (l.tags_en || []),
});

const cmsTeacherEventToDisplay = (e, lang) => ({
  ...e,
  season: lang === 'vi' ? e.season_vi : e.season_en,
  title: lang === 'vi' ? e.title_vi : e.title_en,
  attendees: lang === 'vi' ? e.attendees_vi : e.attendees_en,
});

// ===================================================================
// 1. HOME - Gateway to Wisdom
// ===================================================================
function HomePage({ goto }) {
  const { t, lang } = useT();
  const cms = useCMS();
  const [search, setSearch] = useState('');

  const searchResults = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q || !cms) return null;
    const events = cms.events.map(e => cmsEventToDisplay(e, lang)).filter(e =>
      e.title.toLowerCase().includes(q) || (e.desc || '').toLowerCase().includes(q) || (e.type || '').toLowerCase().includes(q)
    );
    const lectures = cms.lectures.map(l => cmsLectureToDisplay(l, lang)).filter(l =>
      l.title.toLowerCase().includes(q) || l.tags.some(tg => tg.toLowerCase().includes(q))
    );
    return { events, lectures, total: events.length + lectures.length };
  }, [search, cms, lang]);

  const teachings = lang === 'vi' ? [
    "Tâm an thì cảnh an. Tâm tịnh thì cõi tịnh.",
    "Khi tâm trong sáng như gương, vạn pháp đều là thiện tri thức.",
    "Buông xuống là tự tại, chấp giữ là khổ đau.",
    "Vạn pháp đều do tâm tạo — hồi quang phản chiếu là về nhà.",
  ] : [
    "When the mind is at peace, the world is at peace.",
    "When the mind is clear as a mirror, all phenomena become teachers.",
    "Letting go is freedom; grasping is suffering.",
    "All phenomena arise from mind — turn the light inward, and you return home.",
  ];
  const [todayTeaching] = useState(() => teachings[Math.floor(Math.random() * teachings.length)]);

  return (
    <div className="page">
      {/* HERO */}
      <section className="hero">
        <div className="hero-inner">
          <div>
            <Eyebrow>{t('Dudjom Tersar · Kim Cương Thừa', 'Dudjom Tersar · Vajrayāna Lineage')}</Eyebrow>
            <h1>
              {t('Cánh cửa ', 'Gateway to ')}
              <em>{t('trí tuệ', 'wisdom')}</em>
              <br/>
              {t('và từ bi vô lượng', 'and boundless compassion')}
            </h1>
            <span className="om">ॐ मणि पद्मे हूँ · Oṃ Maṇi Padme Hūṃ</span>
            <p style={{ maxWidth: 540, color: 'var(--cream-200)', fontSize: 17, lineHeight: 1.7 }}>
              {t(
                'Không gian tu học chính thức của Khenpo Shedup Ogen Kalsang Rinpoche — kết nối Phật tử Việt Nam và các quốc gia với dòng Dudjom Tersar của Mật tông Tây Tạng.',
                'The official teaching space of Khenpo Shedup Ogen Kalsang Rinpoche — connecting students worldwide with the Dudjom Tersar lineage of Tibetan Vajrayāna Buddhism.'
              )}
            </p>
            <div className="hero-actions">
              <button className="btn btn-gold" onClick={() => goto('events')}>
                {t('Tham dự khóa tu', 'Join a retreat')} →
              </button>
              <button className="btn btn-ghost" style={{ color: 'var(--gold-300)', borderColor: 'var(--gold-500)' }} onClick={() => goto('teacher')}>
                {t('Về Rinpoche', 'About Rinpoche')}
              </button>
            </div>
          </div>
          <div className="hero-mandala">
            <div className="mandala">
              <div className="mandala-ring r1"></div>
              <div className="mandala-ring r2"></div>
              <div className="mandala-ring petals"></div>
              <div className="mandala-ring r3"></div>
              <div className="mandala-ring r4"></div>
              <div className="mandala-spokes"></div>
              <div className="mandala-ring r5"></div>
              <div className="mandala-core"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Daily teaching */}
      <div className="daily">
        <small>{t('Lời dạy hôm nay · Daily Teaching', 'Daily Teaching · Lời dạy hôm nay')}</small>
        <span className="quote">{todayTeaching}</span>
      </div>

      {/* Lineage thangka */}
      <div style={{ background: 'var(--maroon-900)', padding: '64px var(--gutter)', display: 'flex', justifyContent: 'center' }}>
        <img
          src="/home-cover.jpg"
          alt="Dudjom Tersar Lineage"
          style={{ maxWidth: 560, width: '100%', borderRadius: 4, border: '1px solid var(--gold-700)', boxShadow: '0 16px 56px rgba(0,0,0,0.55)' }}
        />
      </div>

      {/* Search */}
      <section className="section section-narrow" style={{ paddingBottom: 40 }}>
        <Eyebrow>{t('Tra cứu kinh sách & bài giảng', 'Search teachings & scriptures')}</Eyebrow>
        <div className="search-bar" style={{ marginBottom: 24 }}>
          <span className="icon"></span>
          <input
            placeholder={t('Tìm bài giảng, mantra, kinh, sự kiện…', 'Search teachings, mantras, sūtras, events…')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-primary" style={{ padding: '8px 18px' }}>{t('Tìm', 'Search')}</button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {[
            ['Dudjom Tersar', 'Dudjom Tersar'],
            ['Longchen Nyingthig', 'Longchen Nyingthig'],
            ['Vajrasattva', 'Vajrasattva'],
            ['Bardo', 'Bardo'],
            ['Ngöndro', 'Ngöndro'],
            ['Guḥyagarbha', 'Guḥyagarbha'],
            ['Quán Thế Âm', 'Avalokiteśvara'],
          ].map(([v, e]) => (
            <button key={e} className="filter-chip" onClick={() => setSearch(t(v, e))}>{t(v, e)}</button>
          ))}
        </div>

        {/* Search results */}
        {searchResults && (
          <div style={{ marginTop: 32 }}>
            <div style={{ fontFamily: 'var(--f-mono)', fontSize: 12, letterSpacing: '0.15em', color: 'var(--ink-500)', marginBottom: 20, textTransform: 'uppercase' }}>
              {searchResults.total > 0
                ? t(`Tìm thấy ${searchResults.total} kết quả cho "${search}"`, `${searchResults.total} result(s) for "${search}"`)
                : t(`Không tìm thấy kết quả cho "${search}"`, `No results for "${search}"`)}
            </div>
            {searchResults.events.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--gold-700)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>
                  {t('Sự kiện', 'Events')}
                </div>
                {searchResults.events.map((e, i) => (
                  <button key={e.id || i} className="admin-row" onClick={() => goto('events')} style={{ width: '100%', textAlign: 'left', cursor: 'pointer', background: 'none', border: 'none' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'var(--f-serif)', fontSize: 16, color: 'var(--maroon-800)' }}>{e.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--ink-500)' }}>{e.date} · {e.location}</div>
                    </div>
                    <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--gold-700)' }}>{t('Xem →', 'View →')}</span>
                  </button>
                ))}
              </div>
            )}
            {searchResults.lectures.length > 0 && (
              <div>
                <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--gold-700)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>
                  {t('Bài giảng', 'Teachings')}
                </div>
                {searchResults.lectures.map((l, i) => (
                  <button key={l.id || i} className="admin-row" onClick={() => goto('lectures')} style={{ width: '100%', textAlign: 'left', cursor: 'pointer', background: 'none', border: 'none' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'var(--f-serif)', fontSize: 16, color: 'var(--maroon-800)' }}>{l.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--ink-500)' }}>{l.teacher} · {l.format} · {l.level}</div>
                    </div>
                    <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--gold-700)' }}>{t('Xem →', 'View →')}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Upcoming events */}
      <section className="section" style={{ paddingTop: 40 }}>
        <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', marginBottom: 36, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <Eyebrow>{t('Sự kiện sắp tới', 'Upcoming events')}</Eyebrow>
            <h2>{t('Khóa tu & Pháp thoại', 'Retreats & Teachings')}</h2>
          </div>
          <button className="btn btn-ghost" onClick={() => goto('events')}>{t('Xem tất cả', 'See all')} →</button>
        </div>
        <div className="grid-3">
          {(cms?.events || []).slice(0, 3).map((e, i) => {
            const d = cmsEventToDisplay(e, lang);
            return (
              <article key={e.id || i} className="card event-card">
                <div style={{ aspectRatio: '16/10', overflow: 'hidden' }}>
                  <CmsImage src={e.imageUrl} alt={d.title} />
                </div>
                <div className="event-card-body">
                  <div className="date">{d.date}</div>
                  <h3>{d.title}</h3>
                  <p>{d.desc}</p>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                    {d.live && <Tag variant="live">{t('Trực tuyến', 'Livestream')}</Tag>}
                    <Tag>{d.type}</Tag>
                  </div>
                  <div className="meta">
                    <span>{d.duration}</span>
                    <span>{d.location}</span>
                  </div>
                </div>
              </article>
            );
          })}
          {(!cms || cms.events.length === 0) && (
            <p style={{ color: 'var(--ink-400)', fontFamily: 'var(--f-mono)', fontSize: 12, gridColumn: '1/-1', padding: '24px 0' }}>
              {t('Chưa có sự kiện nào — admin vui lòng thêm qua trang quản trị.', 'No events yet — add them via the admin panel.')}
            </p>
          )}
        </div>
      </section>

      {/* Latest teachings */}
      <section className="section" style={{ paddingTop: 40, background: 'var(--paper)', maxWidth: 'none' }}>
        <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', marginBottom: 36, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <Eyebrow>{t('Pháp âm mới', 'Latest teachings')}</Eyebrow>
              <h2>{t('Bài giảng từ Rinpoche', 'Teachings from Rinpoche')}</h2>
            </div>
            <button className="btn btn-ghost" onClick={() => goto('lectures')}>{t('Thư viện đầy đủ', 'Full library')} →</button>
          </div>
          <div>
            {(cms?.lectures || []).slice(0, 4).map((l, i) => {
              const d = cmsLectureToDisplay(l, lang);
              return (
                <div key={l.id || i} className="lecture-row">
                  <div style={{ aspectRatio: 1 }}>
                    <CmsImage src={l.imageUrl} alt={d.title} />
                  </div>
                  <div className="info">
                    <h4>{d.title}</h4>
                    <div className="meta">{l.teacher} · {l.duration} · {l.format}</div>
                  </div>
                  <div className="actions">
                    <button className="play-btn" aria-label="Play">▶</button>
                  </div>
                </div>
              );
            })}
            {(!cms || cms.lectures.length === 0) && (
              <p style={{ color: 'var(--ink-400)', fontFamily: 'var(--f-mono)', fontSize: 12, padding: '24px 0' }}>
                {t('Chưa có bài giảng nào.', 'No teachings yet.')}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Module overview */}
      <section className="section">
        <Eyebrow>{t('Khám phá toàn bộ', 'Explore all sections')}</Eyebrow>
        <h2>{t('Bảy cánh cửa Pháp môn', 'Seven Gateways of the Dharma')}</h2>
        <p className="lede">
          {t(
            'Bảy không gian tương tác — từ học hỏi giáo lý đến đồng tu, từ thiền định đến cúng dường hồi hướng.',
            'Seven interactive spaces — from learning the dharma to practicing together, from meditation to making offerings.'
          )}
        </p>
        <div className="grid-3">
          {MODULES(lang).map((m, i) => (
            <button key={i} className="card" onClick={() => goto(m.key)} style={{ textAlign: 'left', border: 'none', cursor: 'pointer', background: 'var(--paper)' }}>
              <div style={{ padding: '32px 28px' }}>
                <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, letterSpacing: '0.2em', color: 'var(--gold-700)', textTransform: 'uppercase', marginBottom: 14 }}>{t('Phần', 'Section')} · 0{i + 1}</div>
                <h3 style={{ fontSize: 26, color: 'var(--maroon-800)', marginBottom: 10 }}>{m.title}</h3>
                <p style={{ color: 'var(--ink-700)', fontSize: 14, margin: 0 }}>{m.desc}</p>
                <div style={{ marginTop: 20, color: 'var(--maroon-700)', fontFamily: 'var(--f-mono)', fontSize: 12, letterSpacing: '0.1em' }}>{t('BƯỚC VÀO', 'ENTER')} →</div>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

// ===================================================================
// 2. TANTRA - The Journey of Enlightenment
// ===================================================================
function TantraPage() {
  const { t, lang } = useT();
  const [activeMantra, setActiveMantra] = useState(null);

  return (
    <div className="page">
      <section className="section">
        <Eyebrow>{t('Phần 02 · Hành trình giác ngộ', 'Section 02 · The Path of Awakening')}</Eyebrow>
        <h2>{t('Mật tông Kim Cương Thừa', 'Vajrayāna Buddhism')}</h2>
        <p className="lede">
          {t(
            'Con đường tu chứng nhanh chóng — kết hợp thân, khẩu, ý qua thần chú, ấn quyết và quán tưởng. Truyền thừa từ Ấn Độ qua Tây Tạng, đến Nepal và đang lan tỏa tại Việt Nam.',
            'The swift path to awakening — uniting body, speech, and mind through mantra, mudrā, and visualization. Transmitted from India to Tibet, Nepal, and now reaching Vietnam.'
          )}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'start' }} className="tantra-grid">
          <div>
            <h3 style={{ fontSize: 28, color: 'var(--maroon-800)', marginBottom: 20 }}>
              {t('Lịch sử truyền thừa Dudjom Tersar', 'History of the Dudjom Tersar lineage')}
            </h3>
            <div className="timeline-tantra">
              {TANTRA_TIMELINE(lang).map((tt, i) => (
                <div className="item" key={i}>
                  <div className="year">{tt.year}</div>
                  <h3>{tt.title}</h3>
                  <p style={{ color: 'var(--ink-700)', fontSize: 14 }}>{tt.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div style={{ position: 'sticky', top: 100 }}>
            <div style={{ aspectRatio: '4/5', overflow: 'hidden' }}>
              <PhotoSlot
                id="tantra-mandala-img"
                placeholder={t('Kéo ảnh Mandala / Pháp khí vào đây', 'Drop Mandala / sacred image here')}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Differences */}
      <section className="section" style={{ background: 'var(--paper)', maxWidth: 'none' }}>
        <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
          <Eyebrow>{t('So sánh tông phái', 'Comparing the vehicles')}</Eyebrow>
          <h2>{t('Mật tông khác gì các tông phái khác?', 'How does Vajrayāna differ from other vehicles?')}</h2>
          <div className="grid-3" style={{ marginTop: 40 }}>
            {COMPARISONS(lang).map((c, i) => (
              <div key={i} className="card" style={{ padding: 28 }}>
                <div style={{ fontFamily: 'var(--f-serif)', fontSize: 22, color: 'var(--maroon-800)', marginBottom: 6 }}>{c.school}</div>
                <div className="tag gold" style={{ marginBottom: 16 }}>{c.tag}</div>
                <p style={{ fontSize: 14, color: 'var(--ink-700)', margin: 0 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ritual instruments */}
      <section className="section">
        <Eyebrow>{t('Pháp khí · Pháp âm', 'Ritual objects · Sacred sound')}</Eyebrow>
        <h2>{t('Linh khí và thần chú', 'Sacred implements and mantras')}</h2>
        <p className="lede">
          {t('Di chuột để xoay pháp khí 360°. Nhấn vào thần chú để nghe tụng niệm.', 'Hover to rotate ritual objects 360°. Tap a mantra to hear its chant.')}
        </p>

        <div className="grid-4" style={{ marginBottom: 60 }}>
          {RITUAL_OBJECTS(lang).map((r, i) => (
            <div key={i} className="card ritual-item">
              <div className="obj">
                {r.shape === 'vajra' && <div className="vajra"></div>}
                {r.shape === 'wheel' && <div className="wheel"></div>}
                {r.shape === 'bell' && <div className="bell"></div>}
                {r.shape === 'mala' && <div className="mala"></div>}
              </div>
              <h3 style={{ fontSize: 20, color: 'var(--maroon-800)', marginBottom: 6 }}>{r.name}</h3>
              <p style={{ fontSize: 13, color: 'var(--ink-500)', margin: 0 }}>{r.sanskrit}</p>
              <p style={{ fontSize: 13, color: 'var(--ink-700)', marginTop: 10 }}>{r.desc}</p>
            </div>
          ))}
        </div>

        <h3 style={{ fontSize: 28, color: 'var(--maroon-800)', marginBottom: 20 }}>
          {t('Thần chú chính yếu', 'Principal mantras')}
        </h3>
        <div className="grid-3">
          {MANTRAS(lang).map((m, i) => (
            <button
              key={i}
              className="card"
              style={{
                padding: 28, textAlign: 'left', border: activeMantra === i ? '1px solid var(--gold-500)' : '1px solid var(--cream-300)',
                background: activeMantra === i ? 'var(--maroon-900)' : 'var(--paper)',
                color: activeMantra === i ? 'var(--cream-100)' : 'inherit',
                cursor: 'pointer', transition: 'all 0.3s'
              }}
              onClick={() => setActiveMantra(activeMantra === i ? null : i)}
            >
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, letterSpacing: '0.2em', color: 'var(--gold-500)', marginBottom: 12 }}>
                {activeMantra === i ? t('◉ ĐANG TỤNG', '◉ NOW CHANTING') : t('NHẤN ĐỂ NGHE', 'TAP TO LISTEN')}
              </div>
              <div style={{ fontFamily: 'var(--f-serif)', fontSize: 26, fontStyle: 'italic', color: activeMantra === i ? 'var(--gold-300)' : 'var(--maroon-800)', marginBottom: 8 }}>
                {m.sanskrit}
              </div>
              <div style={{ fontSize: 14, color: activeMantra === i ? 'var(--cream-200)' : 'var(--ink-700)', marginBottom: 14 }}>{m.translit}</div>
              <p style={{ fontSize: 13, color: activeMantra === i ? 'var(--gold-400)' : 'var(--ink-500)', margin: 0 }}>{m.purpose}</p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function ActivityList() {
  const { t, lang } = useT();
  const cms = useCMS();
  const [detail, setDetail] = useState(null);
  const desc = detail ? (lang === 'vi' ? detail.desc_vi : detail.desc_en) : null;

  return (
    <>
      <div style={{ marginTop: 40 }}>
        {(cms?.teacherEvents || []).map((e, i) => {
          const d = cmsTeacherEventToDisplay(e, lang);
          return (
            <div key={e.id || i} className="event-row" style={{ gridTemplateColumns: '100px 80px 1fr auto' }}>
              <div className="date-block">
                <div className="day">{e.year}</div>
                <div className="month">{d.season}</div>
              </div>
              <div className="event-row-img" style={{ aspectRatio: 1, overflow: 'hidden', borderRadius: 2 }}>
                <CmsImage src={e.imageUrl} alt={d.title} />
              </div>
              <div>
                <h3>{d.title}</h3>
                <div className="meta">{d.attendees} · {e.location}</div>
              </div>
              <button className="btn btn-ghost" onClick={() => setDetail(e)}>{t('Xem lại', 'View')} →</button>
            </div>
          );
        })}
        {(!cms || cms.teacherEvents.length === 0) && (
          <p style={{ color: 'var(--ink-400)', fontFamily: 'var(--f-mono)', fontSize: 12, padding: '24px 0' }}>
            {t('Chưa có hoạt động nào.', 'No activities yet.')}
          </p>
        )}
      </div>

      {detail && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          onClick={() => setDetail(null)}>
          <div style={{ background: 'var(--paper)', borderRadius: 4, maxWidth: 720, width: '100%', maxHeight: '88vh', overflowY: 'auto', border: '1px solid var(--gold-700)' }}
            onClick={ev => ev.stopPropagation()}>
            {detail.imageUrl && (
              <img src={detail.imageUrl} alt={lang === 'vi' ? detail.title_vi : detail.title_en}
                style={{ width: '100%', maxHeight: 360, objectFit: 'cover', borderRadius: '4px 4px 0 0' }} />
            )}
            <div style={{ padding: 36 }}>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--gold-700)', letterSpacing: '0.15em', marginBottom: 8 }}>
                {detail.year} · {lang === 'vi' ? detail.season_vi : detail.season_en} · {detail.location}
              </div>
              <h2 style={{ fontSize: 24, color: 'var(--maroon-800)', marginBottom: 16 }}>
                {lang === 'vi' ? detail.title_vi : detail.title_en}
              </h2>
              {desc && <p style={{ color: 'var(--ink-700)', lineHeight: 1.8, fontSize: 15 }}>{desc}</p>}
              <button className="btn btn-ghost" style={{ marginTop: 24 }} onClick={() => setDetail(null)}>
                {t('Đóng', 'Close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ===================================================================
// 3. KHENPO - Biography · Puja · Pilgrimage · Activity
// ===================================================================
function KhenpoPage() {
  const { t, lang } = useT();
  const cms = useCMS();
  const [portraitLit, setPortraitLit] = useState(false);
  const [playing, setPlaying] = useState(false);

  return (
    <div className="page">
      <section id="biography" className="section">
        <Eyebrow>{t('Phần 03 · Bậc Thầy soi đường', 'Section 03 · The Teacher')}</Eyebrow>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 60, alignItems: 'start' }} className="teacher-grid">
          <div style={{ position: 'relative' }}>
            <div
              className={portraitLit ? 'lit' : ''}
              onClick={() => setPortraitLit(!portraitLit)}
              style={{ aspectRatio: '3/4', overflow: 'hidden', border: '1px solid var(--gold-600)', transition: 'all 0.6s', cursor: 'pointer', filter: portraitLit ? 'brightness(1.15) saturate(1.1)' : 'none', boxShadow: portraitLit ? '0 0 60px rgba(201,163,92,0.4)' : 'none' }}
            >
              {cms?.settings?.teacher_portrait
                ? <img src={cms.settings.teacher_portrait} alt="Khenpo Rinpoche" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                : <PhotoSlot id="teacher-portrait" shape="rect" placeholder={t('Kéo ảnh chân dung Rinpoche vào đây', 'Drop Rinpoche portrait here')} />
              }
            </div>
            <div style={{ marginTop: 12, fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--gold-700)', textTransform: 'uppercase', textAlign: 'center' }}>
              {t('Nhấn vào ảnh để thắp sáng', 'Tap photo to illuminate')}
            </div>
          </div>
          <div>
            <h2 style={{ marginBottom: 6 }}>Khenpo Shedup Ogen Kalsang Rinpoche</h2>
            <div style={{ fontFamily: 'var(--f-mono)', fontSize: 12, letterSpacing: '0.2em', color: 'var(--gold-700)', textTransform: 'uppercase', marginBottom: 24 }}>
              {t('Dòng truyền thừa Dudjom Tersar · Phật giáo Tây Tạng', 'Dudjom Tersar Lineage · Tibetan Buddhism')}
            </div>
            <p style={{ fontFamily: 'var(--f-serif)', fontStyle: 'italic', fontSize: 22, color: 'var(--ink-700)', marginBottom: 24 }}>
              {t(
                '"Khi tâm trong sáng như gương, vạn pháp đều là thiện tri thức."',
                '"When the mind is clear as a mirror, all phenomena become teachers."'
              )}
            </p>
            <p style={{ color: 'var(--ink-700)', marginBottom: 16 }}>
              {t(
                'Khenpo Ogen Kalsang Rinpoche là một vị thầy và học giả thuộc dòng truyền thừa Dudjom Tersar của Phật giáo Tây Tạng. Từ thuở thiếu thời, Khenpo đã tu học tại Samye Memorial Institute ở Kathmandu, Nepal dưới sự dẫn dắt của H.E. Yeshe Sangpo Rinpoche. Tại đây, Ngài hoàn thành chương trình học kinh và mật thừa theo truyền thống Nyingma và đạt được danh hiệu Khenpo. Trong 15 năm qua, Khenpo đã giảng dạy tăng chúng tại học viện, chủ yếu về các Mật tông thượng thừa và kinh điển cổ điển. Từ năm 1994 đến 2005, Ngài nghiên cứu nội và ngoại mật thừa cùng Đại Toàn Thiện (Dzogchen). Từ năm 2005 đến 2011, Ngài hoàn thành nhiều khóa nhập thất truyền thống về pháp tu tiền hành (ngöndro) và các giai đoạn phát sinh — viên mãn của Đại Toàn Thiện. Dựa trên dòng Dudjom, các vị thầy chính của Khenpo là H.H. Dudjom Rinpoche, H.H. Thinley Norbu Rinpoche và H.E. Yeshe Sangpo Rinpoche. Khenpo còn có pháp duyên với nhiều bậc thầy của trường phái cũ và mới trong Phật giáo Tây Tạng, đặc biệt là truyền thống Nyingthik của Đại Toàn Thiện từ H.H. Drubwang Pema Norbu Rinpoche. Sau nhiều năm phụng sự, H.E. Yeshe Sangpo Rinpoche đã trao cho Khenpo quyền công khai truyền dạy Phật pháp với tư cách người nắm giữ dòng Dudjom.',
                'Khenpo Ogen Kalsang Rinpoche is a teacher and scholar of the Dudjom Tersar lineage of Tibetan Buddhism. Starting in his youth, Khenpo trained as a monk at Samye Memorial Institute in Kathmandu, Nepal under the guidance of His Eminence Yeshe Sangpo Rinpoche. There he completed sutra and tantra studies according to the Nyingma tradition of Tibetan Buddhism and achieved his Khenpo title. For the past 15 years, Khenpo has been teaching monastics at the institute, primarily in higher tantras and classical texts. From 1994 to 2005, he studied outer and inner tantras and The Great Perfection. From 2005 to 2011, he completed a number of traditional retreats devoted to preliminary practices (ngöndro) and the main practices of the creation and completion stages of The Great Perfection. Based on the Dudjom lineage, Khenpo\'s main teachers are His Holiness Dudjom Rinpoche, His Holiness Thinley Norbu Rinpoche, and His Eminence Yeshe Sangpo Rinpoche. Khenpo is connected to many teachers within the pure lineages of old and new schools of Tibetan Buddhism, such as the Nyingthik tradition of Great Perfection from H.H. Drubwang Pema Norbu Rinpoche. After years of service, HE Yeshe Sangpo Rinpoche has given Khenpo permission to teach Buddhadharma publicly as a Dudjom lineage holder.'
              )}
            </p>
            <p style={{ color: 'var(--ink-700)', marginBottom: 16 }}>
              {t(
                'Hiện nay Khenpo đang mở rộng việc giảng dạy đến cư sĩ tại gia từ khắp châu Á, châu Âu và Hoa Kỳ. Từ nơi trú xứ tại Kathmandu, Ngài giảng dạy trực tuyến lẫn trực tiếp bằng tiếng Tạng và tiếng Anh. Khenpo đang hướng dẫn Tăng đoàn người Việt tích lũy một triệu thần chú Lục Độ Phật Mẫu Tara vì lợi ích chúng sinh trong thời điểm khó khăn này. Gần đây, Khenpo đã thiết lập mối quan hệ với làng Thulopatal, Nepal, nơi Ngài sẽ dẫn dắt với tư cách vị lama chính. Hơn nữa, theo yêu cầu của đệ tử Nepal, Khenpo đã lên kế hoạch ban đầu để xây dựng một tu viện nhỏ tại Kathmandu.',
                'These days Khenpo is expanding his teaching to include laypeople from across Asia, Europe, and the United States. From his home in Kathmandu, he teaches online and in person in both Tibetan and English. Khenpo is currently guiding his Vietnamese sangha in accumulating one million Green Tara mantras for the benefit of sentient beings during these trying times. Khenpo has recently begun a relationship with the village of Thulopatal, Nepal, where he will offer guidance as their primary lama. Furthermore, at the request of his Nepali students, Khenpo has begun preliminary plans to build a small monastery in Kathmandu.'
              )}
            </p>
            <p style={{ color: 'var(--ink-700)', marginBottom: 32 }}>
              {t(
                'Khi không giảng dạy, Khenpo dịch các nghi quỹ và kinh cầu quý báu từ truyền thống Dudjom Tersar sang tiếng Anh cho đệ tử của mình. Dù ở cùng tăng chúng, cư sĩ hay học giả, Khenpo luôn làm việc không mệt mỏi với tâm nguyện thuần tịnh — gìn giữ các truyền thống Phật giáo Tây Tạng chân chính và truyền bá giáo pháp từ bi và trí tuệ.',
                'When he\'s not teaching, Khenpo translates precious sadhanas and prayers from the Dudjom Tersar tradition into English for his students. Whether he is with monastics, lay practitioners, or scholars, Khenpo works tirelessly with the pure intention of preserving authentic Tibetan Buddhist traditions and spreading the Buddhadharma teachings of compassion and wisdom.'
              )}
            </p>

            <button
              className="btn btn-primary"
              onClick={() => setPlaying(!playing)}
              style={{ marginBottom: 30 }}
            >
              {playing ? '◼' : '▶'} {t('Nghe pháp ngữ ngắn', 'Listen to a short teaching')} ({playing ? '00:42 / 02:18' : '02:18'})
            </button>

            {playing && (
              <div style={{ padding: 20, background: 'var(--paper)', border: '1px solid var(--gold-500)', borderRadius: 4, marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
                  <div style={{ display: 'flex', gap: 3, alignItems: 'end', height: 28 }}>
                    {[8, 14, 22, 16, 10, 20, 12, 18, 24, 14].map((h, i) => (
                      <div key={i} style={{ width: 3, height: h, background: 'var(--maroon-700)', animation: `pulse 0.8s ${i * 0.1}s infinite` }}></div>
                    ))}
                  </div>
                  <span style={{ fontFamily: 'var(--f-mono)', fontSize: 12, color: 'var(--ink-500)' }}>
                    {t('ĐANG PHÁT · Pháp thoại ngắn', 'NOW PLAYING · Short teaching')}
                  </span>
                </div>
              </div>
            )}

            <div className="grid-3" style={{ marginTop: 20 }}>
              {STATS(lang).map((s, i) => (
                <div key={i} style={{ padding: 24, background: 'var(--paper)', border: '1px solid var(--cream-300)' }}>
                  <div style={{ fontFamily: 'var(--f-serif)', fontSize: 42, color: 'var(--maroon-800)', lineHeight: 1 }}>{s.num}</div>
                  <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, letterSpacing: '0.15em', color: 'var(--gold-700)', textTransform: 'uppercase', marginTop: 6 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Puja placeholder */}
      <section id="puja" className="section" style={{ background: 'var(--paper)', maxWidth: 'none' }}>
        <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
          <Eyebrow>{t('Pháp lễ', 'Puja')}</Eyebrow>
          <h2>{t('Lễ khóa & Cúng dường', 'Ceremonies & Offerings')}</h2>
          <p style={{ color: 'var(--ink-500)', fontFamily: 'var(--f-mono)', fontSize: 13, letterSpacing: '0.1em', marginTop: 16 }}>
            {t('Nội dung đang được cập nhật — sắp ra mắt.', 'Content in preparation — coming soon.')}
          </p>
        </div>
      </section>

      {/* Pilgrimage placeholder */}
      <section id="pilgrimage" className="section">
        <Eyebrow>{t('Hành hương', 'Pilgrimage')}</Eyebrow>
        <h2>{t('Hành hương thánh địa', 'Sacred Site Pilgrimage')}</h2>
        <p style={{ color: 'var(--ink-500)', fontFamily: 'var(--f-mono)', fontSize: 13, letterSpacing: '0.1em', marginTop: 16 }}>
          {t('Nội dung đang được cập nhật — sắp ra mắt.', 'Content in preparation — coming soon.')}
        </p>
      </section>

      {/* Activities & events */}
      <section id="activity" className="section">
        <Eyebrow>{t('Hoạt động đáng nhớ', 'Notable activities')}</Eyebrow>
        <h2>{t('Hoằng pháp toàn cầu', 'Worldwide dharma activities')}</h2>
        <ActivityList />
      </section>

      {/* Khenpo Personal Project */}
      <section id="khenpo-project" className="section" style={{ background: 'var(--paper)', maxWidth: 'none' }}>
        <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
          <Eyebrow>{t('Dự án cá nhân', 'Personal Project')}</Eyebrow>
          <h2>{t('Dự án của Khenpo', "Khenpo's Projects")}</h2>
          <p style={{ color: 'var(--ink-500)', fontFamily: 'var(--f-mono)', fontSize: 13, letterSpacing: '0.1em', marginTop: 16 }}>
            {t('Nội dung đang được cập nhật — sắp ra mắt.', 'Content in preparation — coming soon.')}
          </p>
        </div>
      </section>
    </div>
  );
}

// ===================================================================
// 4. LECTURES - Wisdom Bookshelf
// ===================================================================
function LecturesPage() {
  const { t, lang } = useT();
  const cms = useCMS();
  const [filter, setFilter] = useState(t('Tất cả', 'All'));
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [reading, setReading] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('reading-meditation', reading);
    return () => document.body.classList.remove('reading-meditation');
  }, [reading]);

  // Reset tag filter khi ngôn ngữ thay đổi (vì nhãn tag khác nhau VI/EN)
  useEffect(() => {
    setFilter(lang === 'vi' ? 'Tất cả' : 'All');
    setLevelFilter('');
  }, [lang]);

  const allLectures = (cms?.lectures || []).map(l => cmsLectureToDisplay(l, lang));
  const filterAll = t('Tất cả', 'All');
  const filtered = useMemo(() => {
    let list = filter === filterAll ? allLectures : allLectures.filter(l => l.tags.includes(filter));
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(l => l.title.toLowerCase().includes(q) || (l.teacher || '').toLowerCase().includes(q) || l.tags.some(tg => tg.toLowerCase().includes(q)));
    }
    if (levelFilter) {
      list = list.filter(l => l.level === levelFilter);
    }
    return list;
  }, [filter, lang, cms?.lectures, search, levelFilter]);

  const filters = lang === 'vi'
    ? ['Tất cả', 'Quán tưởng', 'Thần chú', 'Kinh điển', 'Dzogchen', 'Bardo', 'Lễ khóa', 'Sách PDF']
    : ['All', 'Visualization', 'Mantra', 'Sūtra', 'Dzogchen', 'Bardo', 'Ritual', 'PDF Book'];

  const levels = lang === 'vi'
    ? [{ value: '', label: 'Cấp độ — Tất cả' }, { value: 'Nhập môn', label: 'Mới nhập môn' }, { value: 'Trung cấp', label: 'Trung cấp' }, { value: 'Cao cấp', label: 'Cao cấp' }]
    : [{ value: '', label: 'Level — All' }, { value: 'Beginner', label: 'Beginner' }, { value: 'Intermediate', label: 'Intermediate' }, { value: 'Advanced', label: 'Advanced' }];

  return (
    <div className="page">
      <section className="section">
        <Eyebrow>{t('Phần 04 · Thư viện trí tuệ', 'Section 04 · Wisdom Library')}</Eyebrow>
        <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h2>{t('Bài giảng & Kinh điển', 'Teachings & Scriptures')}</h2>
            <p className="lede">{t(
              'Video, audio, PDF — tổ chức theo chủ đề, cấp độ tu học, dòng truyền thừa.',
              'Video, audio, and PDF — organized by topic, level, and lineage.'
            )}</p>
          </div>
          <button
            className={`reading-toggle ${reading ? 'on' : ''}`}
            onClick={() => setReading(!reading)}
          >
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: reading ? 'var(--gold-400)' : 'var(--maroon-700)' }}></span>
            {t('Thiền đọc', 'Reading meditation')} {reading ? t('BẬT', 'ON') : t('TẮT', 'OFF')}
          </button>
        </div>

        <div className="search-bar" style={{ margin: '32px 0 24px', maxWidth: 'none', background: reading ? 'var(--maroon-900)' : 'var(--paper)' }}>
          <span className="icon"></span>
          <input
            placeholder={t('Tìm theo tên bài giảng, từ khóa…', 'Search by title or keyword…')}
            style={{ color: reading ? 'var(--cream-100)' : 'inherit' }}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="filter-chip"
            style={{ border: 'none', background: 'transparent' }}
            value={levelFilter}
            onChange={e => setLevelFilter(e.target.value)}
          >
            {levels.map(lv => <option key={lv.value} value={lv.value}>{lv.label}</option>)}
          </select>
        </div>

        <div className="filter-bar">
          {filters.map(f => (
            <button key={f} className={`filter-chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>

        <div style={{ background: reading ? 'transparent' : 'var(--paper)', border: reading ? 'none' : '1px solid var(--cream-300)', borderRadius: 4 }}>
          {filtered.length === 0 && (
            <p style={{ color: 'var(--ink-400)', fontFamily: 'var(--f-mono)', fontSize: 12, padding: '32px 24px' }}>
              {t('Chưa có bài giảng nào.', 'No teachings yet.')}
            </p>
          )}
          {filtered.map((l, i) => (
            <div key={l.id || i} className="lecture-row">
              <div style={{ aspectRatio: 1 }}>
                <CmsImage src={l.imageUrl} alt={l.title} />
              </div>
              <div className="info">
                <h4>{l.title}</h4>
                <div className="meta">{l.teacher} · {l.duration} · {l.format} · {l.level}</div>
                <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                  {(l.tags || []).slice(0, 2).map(tg => <Tag key={tg}>{tg}</Tag>)}
                </div>
              </div>
              <div className="actions">
                <button className="play-btn" aria-label="Play">▶</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ===================================================================
// 5. EVENTS & RETREAT
// ===================================================================
const MONTHS_EN = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function parseEventDate(rawEvent) {
  try {
    const parts = (rawEvent.month_en || '').split('·').map(s => s.trim());
    const monthIdx = MONTHS_EN.indexOf(parts[0]);
    const year = parseInt(parts[1], 10);
    const day = parseInt(rawEvent.day, 10) || 1;
    if (monthIdx === -1 || isNaN(year)) return null;
    return new Date(year, monthIdx, day);
  } catch { return null; }
}

function getViewDateRange(view) {
  // view is always 'year' | 'month' | 'week'
  const now = new Date();
  if (view === 'month') {
    return {
      start: new Date(now.getFullYear(), now.getMonth(), 1),
      end: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59),
    };
  }
  if (view === 'week') {
    const dow = now.getDay();
    const start = new Date(now); start.setDate(now.getDate() - dow); start.setHours(0,0,0,0);
    const end = new Date(start); end.setDate(start.getDate() + 6); end.setHours(23,59,59,999);
    return { start, end };
  }
  return null; // year — show all
}

function EventsPage() {
  const { t, lang } = useT();
  const cms = useCMS();
  const [view, setView] = useState('year'); // 'year' | 'month' | 'week'
  const [registerEvent, setRegisterEvent] = useState(null);
  const [regForm, setRegForm] = useState({ name: '', email: '', phone: '', note: '' });
  const [regDone, setRegDone] = useState(false);

  const allEvents = (cms?.events || []).map(e => cmsEventToDisplay(e, lang));

  const filtered = useMemo(() => {
    const range = getViewDateRange(view);
    if (!range) return allEvents;
    return allEvents.filter(e => {
      const raw = (cms?.events || []).find(r => r.id === e.id) || e;
      const d = parseEventDate(raw);
      return d && d >= range.start && d <= range.end;
    });
  }, [view, lang, cms?.events]);

  const grouped = useMemo(() => {
    const g = {};
    filtered.forEach(e => { (g[e.month] = g[e.month] || []).push(e); });
    return g;
  }, [filtered]);

  const handleRegister = () => {
    if (!regForm.name || !regForm.email) return;
    setRegDone(true);
    setTimeout(() => { setRegisterEvent(null); setRegDone(false); setRegForm({ name: '', email: '', phone: '', note: '' }); }, 2400);
  };

  return (
    <div className="page">
      <section className="section">
        <Eyebrow>{t('Phần 05 · Cơ hội nghe Pháp', 'Section 05 · Dharma Opportunities')}</Eyebrow>
        <h2>{t('Sự kiện & Khóa tu', 'Events & Retreats')}</h2>
        <p className="lede">
          {t(
            'Khóa tu, pháp thoại, lễ hội Phật giáo — đăng ký trực tuyến, livestream trực tiếp, hệ thống tự động nhắc lịch.',
            'Retreats, dharma talks, and Buddhist ceremonies — online registration, livestream, and automatic reminders.'
          )}
        </p>

        {/* Live now — hiển thị khi có event live */}
        {allEvents.some(e => e.live) && (
          <div style={{ background: 'var(--maroon-900)', padding: 28, borderRadius: 4, border: '1px solid var(--gold-700)', marginBottom: 50, color: 'var(--cream-100)', display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: 24, alignItems: 'center' }} className="live-now">
            <Silk label={t('TRỰC TIẾP', 'LIVE')} style={{ aspectRatio: 1 }} />
            <div>
              <span className="live-badge" style={{ marginBottom: 10, display: 'inline-block' }}>{t('Đang phát trực tuyến', 'Livestreaming now')}</span>
              <h3 style={{ fontSize: 24, color: 'var(--gold-300)', marginBottom: 4 }}>
                {allEvents.find(e => e.live)?.title}
              </h3>
              <p style={{ color: 'var(--cream-200)', margin: 0, fontSize: 14 }}>
                {allEvents.find(e => e.live)?.location}
              </p>
            </div>
            <button className="btn btn-gold">{t('Tham gia ngay', 'Join now')} →</button>
          </div>
        )}

        <div className="calendar-tabs">
          {[
            { key: 'year',  label: t('Năm', 'Year') },
            { key: 'month', label: t('Tháng', 'Month') },
            { key: 'week',  label: t('Tuần', 'Week') },
          ].map(({ key, label }) => (
            <button key={key} className={view === key ? 'active' : ''} onClick={() => setView(key)}>{label}</button>
          ))}
        </div>

        <div className="timeline-events">
          {filtered.length === 0 && (
            <p style={{ color: 'var(--ink-400)', fontFamily: 'var(--f-mono)', fontSize: 12, padding: '32px 0' }}>
              {allEvents.length === 0
                ? t('Chưa có sự kiện nào được lên lịch.', 'No upcoming events scheduled yet.')
                : t('Không có sự kiện nào trong khoảng thời gian này.', 'No events in this period.')}
            </p>
          )}
          {Object.entries(grouped).map(([month, items]) => (
            <div key={month}>
              <div className="month-label">{month}</div>
              {items.map((e, i) => (
                <div key={e.id || i} className="event-row" style={{ gridTemplateColumns: '100px 110px 1fr auto' }}>
                  <div className="date-block">
                    <div className="day">{e.day}</div>
                    <div className="month">{e.monthShort}</div>
                  </div>
                  <div className="event-row-img" style={{ aspectRatio: 1, overflow: 'hidden', borderRadius: 2 }}>
                    <CmsImage src={e.imageUrl} alt={e.title} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                      <Tag>{e.type}</Tag>
                      {e.live && <Tag variant="live">{t('Trực tuyến', 'Livestream')}</Tag>}
                    </div>
                    <h3>{e.title}</h3>
                    <div className="meta">{e.duration} · {e.location} · {e.attendees || t('Mở đăng ký', 'Open registration')}</div>
                  </div>
                  <button className="btn btn-primary" onClick={() => setRegisterEvent(e)}>{t('Đăng ký', 'Register')} →</button>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Volunteer */}
        <div style={{ marginTop: 80, padding: 50, background: 'var(--paper)', border: '1px dashed var(--gold-600)', borderRadius: 4 }}>
          <Eyebrow>{t('Hoạt động thiện nguyện', 'Volunteer activities')}</Eyebrow>
          <h2 style={{ fontSize: 32 }}>{t('Đồng hành cùng Pháp hội', 'Serve the sangha')}</h2>
          <p style={{ color: 'var(--ink-700)', maxWidth: 640, marginBottom: 24 }}>
            {t(
              'Tham gia làm hộ niệm, sắp xếp lễ khóa, hỗ trợ in kinh, dịch thuật pháp ngữ, hoặc trợ giúp các khóa nhập thất tại Samye Memorial Vihara và các trung tâm địa phương.',
              'Help organize ceremonies, support print and translation of teachings, or assist with retreats at Samye Memorial Vihara and local centers.'
            )}
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button className="btn btn-primary">{t('Đăng ký tình nguyện', 'Volunteer with us')}</button>
            <button className="btn btn-ghost">{t('Xem hoạt động đang cần', 'See current needs')} →</button>
          </div>
        </div>

        {/* Register modal */}
        {registerEvent && (
          <div className="modal-overlay" onClick={() => { setRegisterEvent(null); setRegDone(false); }}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => { setRegisterEvent(null); setRegDone(false); }}>✕</button>
              {regDone ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>🪷</div>
                  <Eyebrow style={{ justifyContent: 'center' }}>{t('Đăng ký thành công', 'Registration received')}</Eyebrow>
                  <h3 style={{ marginBottom: 12 }}>{t('Chúc mừng đã đăng ký!', 'You are registered!')}</h3>
                  <p style={{ color: 'var(--ink-700)', fontFamily: 'var(--f-serif)', fontStyle: 'italic' }}>
                    {t(`Cảm ơn ${regForm.name}. Chúng tôi sẽ liên hệ qua email ${regForm.email}.`, `Thank you ${regForm.name}. We will contact you at ${regForm.email}.`)}
                  </p>
                </div>
              ) : (
                <>
                  <Eyebrow>{t('Đăng ký tham dự', 'Register for event')}</Eyebrow>
                  <h3 style={{ marginBottom: 6 }}>{registerEvent.title}</h3>
                  <div style={{ fontFamily: 'var(--f-mono)', fontSize: 12, color: 'var(--gold-700)', marginBottom: 20 }}>
                    {registerEvent.date} · {registerEvent.location}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div>
                      <label>{t('Họ tên *', 'Full name *')}</label>
                      <input className="input" value={regForm.name} onChange={e => setRegForm(f => ({ ...f, name: e.target.value }))} required />
                    </div>
                    <div>
                      <label>Email *</label>
                      <input className="input" type="email" value={regForm.email} onChange={e => setRegForm(f => ({ ...f, email: e.target.value }))} required />
                    </div>
                    <div>
                      <label>{t('Số điện thoại', 'Phone number')}</label>
                      <input className="input" value={regForm.phone} onChange={e => setRegForm(f => ({ ...f, phone: e.target.value }))} />
                    </div>
                    <div>
                      <label>{t('Ghi chú', 'Notes')}</label>
                      <textarea className="textarea" style={{ minHeight: 60 }} value={regForm.note} onChange={e => setRegForm(f => ({ ...f, note: e.target.value }))} />
                    </div>
                    <button
                      className="btn btn-primary"
                      onClick={handleRegister}
                      disabled={!regForm.name || !regForm.email}
                      style={{ marginTop: 4, opacity: (!regForm.name || !regForm.email) ? 0.5 : 1 }}
                    >
                      {t('Xác nhận đăng ký', 'Confirm registration')} →
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

// ===================================================================
// 6. ONLINE PRAYER
// ===================================================================
function PrayerPage() {
  const { t, lang } = useT();
  const [step, setStep] = useState('main');
  const [lotusBloom, setLotusBloom] = useState(false);
  const [prayerText, setPrayerText] = useState('');
  const [forWhom, setForWhom] = useState('');
  const [selectedOffering, setSelectedOffering] = useState(null);
  const [dedication, setDedication] = useState('');
  const [completed, setCompleted] = useState(null);
  const [candles, setCandles] = useState([]);

  const lightCandle = () => {
    if (!forWhom || !prayerText) return;
    setLotusBloom(true);
    setTimeout(() => {
      setCandles(c => [{ name: forWhom, prayer: prayerText, time: t('vừa xong', 'just now') }, ...c]);
      setCompleted({
        text: t(
          'Đèn tâm đã được thắp sáng. Nguyện công đức hồi hướng cho tất cả chúng sinh.',
          'Your candle has been lit. May the merit be dedicated to all sentient beings.'
        )
      });
      setLotusBloom(false);
      setPrayerText('');
      setForWhom('');
      setStep('main');
    }, 1600);
  };

  const makeOffering = () => {
    if (selectedOffering === null) return;
    setLotusBloom(true);
    setTimeout(() => {
      const recipient = dedication || t('tất cả pháp giới hữu tình', 'all sentient beings throughout the dharmadhātu');
      setCompleted({
        text: t(
          `"Cúng dường Tam Bảo trang nghiêm Phật quả. Công đức này, xin hồi hướng cho ${recipient}."`,
          `"This offering to the Three Jewels adorns the path to Buddhahood. May the merit be dedicated to ${recipient}."`
        )
      });
      setLotusBloom(false);
      setSelectedOffering(null);
      setDedication('');
      setStep('main');
    }, 1600);
  };

  return (
    <div className="page">
      <section className="section">
        <Eyebrow>{t('Phần 06 · Cầu nguyện · Hồi hướng', 'Section 06 · Prayer · Dedication')}</Eyebrow>
        <h2>{t('Đàn tràng số · Cầu nguyện trực tuyến', 'Digital Altar · Online Prayer')}</h2>
        <p className="lede">
          {t(
            'Thắp đèn tâm, cúng dường, đồng tụng mantra và hồi hướng công đức — kết nối với cộng đồng học trò của Rinpoche trên toàn cầu.',
            "Light a butter lamp, make offerings, chant mantras together, and dedicate merit — connecting with Rinpoche's students around the world."
          )}
        </p>

        {/* Altar */}
        <div className="altar" style={{ marginBottom: 60 }}>
          <Eyebrow style={{ justifyContent: 'center' }}>{t('Đàn tràng cộng đồng', 'Community altar')}</Eyebrow>
          <h2 style={{ marginBottom: 8, fontSize: 'clamp(28px, 4vw, 44px)' }}>
            {t('Hôm nay · 4,218 đèn tâm đang thắp', 'Today · 4,218 candles are lit')}
          </h2>
          <p style={{ fontFamily: 'var(--f-serif)', fontStyle: 'italic', color: 'var(--gold-300)', fontSize: 18, margin: '0 auto 12px', maxWidth: 640 }}>
            {t(
              '"Nguyện cho tất cả chúng sinh được an lành, hết thảy khổ đau được tiêu trừ."',
              '"May all sentient beings have happiness; may all suffering be uprooted."'
            )}
          </p>
          <div className="candle-grid">
            {candles.slice(0, 6).map((c, i) => (
              <div key={i} className="candle">
                <div className="flame"></div>
                <div className="stick"></div>
                <div className="name">{c.name}</div>
              </div>
            ))}
          </div>
          <div className="lotus" style={{ transform: lotusBloom ? 'scale(1.4) rotate(45deg)' : '' }}></div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', position: 'relative', zIndex: 2 }}>
            <button className="btn btn-gold" onClick={() => setStep('candle')}>{t('Thắp đèn cầu nguyện', 'Light a candle')}</button>
            <button className="btn btn-ghost" style={{ color: 'var(--gold-300)', borderColor: 'var(--gold-500)' }} onClick={() => setStep('offering')}>
              {t('Cúng dường', 'Make an offering')} →
            </button>
          </div>
        </div>

        {/* Modal: light candle */}
        {step === 'candle' && (
          <div className="modal-overlay" onClick={() => setStep('main')}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setStep('main')}>✕</button>
              <Eyebrow>{t('Thắp đèn tâm', 'Light a butter lamp')}</Eyebrow>
              <h3>{t('Lời cầu nguyện', 'Your prayer')}</h3>
              <p style={{ color: 'var(--ink-700)', marginBottom: 24, fontSize: 14 }}>
                {t(
                  'Mỗi lời nguyện thành kính sẽ được thắp thành đèn trên Đàn tràng cộng đồng.',
                  'Every sincere prayer becomes a candle on the community altar.'
                )}
              </p>
              <label>{t('Hồi hướng cho', 'Dedicate to')}</label>
              <input
                className="input"
                placeholder={t(
                  "Tên người thân, gia đình, hoặc 'tất cả chúng sinh'…",
                  "Name of a loved one, family, or 'all sentient beings'…"
                )}
                value={forWhom}
                onChange={(e) => setForWhom(e.target.value)}
              />
              <label>{t('Lời nguyện', 'Prayer')}</label>
              <textarea
                className="textarea"
                placeholder={t('Viết lời cầu nguyện chân thành…', 'Write your sincere prayer…')}
                value={prayerText}
                onChange={(e) => setPrayerText(e.target.value)}
              ></textarea>
              <button className="btn btn-primary" onClick={lightCandle} style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
                {lotusBloom ? t('✦ Đang dâng…', '✦ Offering…') : t('Thắp đèn & hồi hướng', 'Light & dedicate')}
              </button>
            </div>
          </div>
        )}

        {/* Modal: offering */}
        {step === 'offering' && (
          <div className="modal-overlay" onClick={() => setStep('main')}>
            <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 680 }}>
              <button className="modal-close" onClick={() => setStep('main')}>✕</button>
              <Eyebrow>{t('Cúng dường trực tuyến', 'Online offering')}</Eyebrow>
              <h3>{t('Chọn hình thức cúng dường', 'Choose your offering')}</h3>
              <p style={{ color: 'var(--ink-700)', marginBottom: 20, fontSize: 14 }}>
                {t(
                  'Mỗi đóng góp được dùng để hộ trì các hoạt động hoằng pháp của Rinpoche.',
                  "Each offering supports Rinpoche's dharma activities worldwide."
                )}
              </p>
              <div className="offering-grid">
                {OFFERINGS(lang).map((o, i) => (
                  <button
                    key={i}
                    className={`offering ${selectedOffering === i ? 'selected' : ''}`}
                    onClick={() => setSelectedOffering(i)}
                  >
                    <div className="num">{t('CÚNG DƯỜNG', 'OFFERING')} · 0{i + 1}</div>
                    <h4>{o.title}</h4>
                    <p>{o.desc}</p>
                  </button>
                ))}
              </div>
              <label>{t('Hồi hướng công đức cho', 'Dedicate the merit to')}</label>
              <input
                className="input"
                placeholder={t("Tên người thân, hoặc 'tất cả pháp giới hữu tình'", "A loved one, or 'all sentient beings'")}
                value={dedication}
                onChange={(e) => setDedication(e.target.value)}
              />
              <button
                className="btn btn-primary"
                disabled={selectedOffering === null}
                onClick={makeOffering}
                style={{ width: '100%', justifyContent: 'center', marginTop: 8, opacity: selectedOffering === null ? 0.5 : 1 }}
              >
                {t('Hoa sen dâng Phật', 'Offer the lotus')} →
              </button>
            </div>
          </div>
        )}

        {/* Completion */}
        {completed && (
          <div className="modal-overlay" onClick={() => setCompleted(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()} style={{ textAlign: 'center' }}>
              <button className="modal-close" onClick={() => setCompleted(null)}>✕</button>
              <div className="lotus" style={{ width: 120, height: 120, transform: 'scale(1.2)' }}></div>
              <Eyebrow style={{ justifyContent: 'center' }}>{t('Hoàn mãn', 'Complete')}</Eyebrow>
              <h3 style={{ marginBottom: 16 }}>{t('Công đức đã được hồi hướng', 'The merit has been dedicated')}</h3>
              <p style={{ fontFamily: 'var(--f-serif)', fontStyle: 'italic', fontSize: 18, color: 'var(--ink-700)' }}>{completed.text}</p>
              <div style={{ margin: '20px 0', padding: 20, background: 'var(--maroon-900)', color: 'var(--gold-300)', fontFamily: 'var(--f-serif)', fontStyle: 'italic', borderRadius: 2 }}>
                {t(
                  <>Nguyện đem công đức này<br/>Hướng về khắp tất cả<br/>Đệ tử và chúng sinh<br/>Đều trọn thành Phật đạo.</>,
                  <>By this merit may all attain omniscience.<br/>May it defeat the enemy, wrongdoing.<br/>From the stormy waves of birth, old age, sickness, and death,<br/>From the ocean of saṃsāra, may I free all beings.</>
                )}
              </div>
              <button className="btn btn-primary" onClick={() => setCompleted(null)}>{t('Tiếp tục tu hành', 'Continue practice')}</button>
            </div>
          </div>
        )}

        {/* Prayer wall */}
        <Eyebrow>{t('Tường cầu nguyện', 'Prayer wall')}</Eyebrow>
        <h2 style={{ fontSize: 32 }}>{t('Lời nguyện cộng đồng', 'Community prayers')}</h2>
        <div className="prayer-wall">
          <div className="prayer-note" style={{ textAlign: 'center', color: 'var(--ink-400)', fontFamily: 'var(--f-mono)', fontSize: 12 }}>
            {t('Lời nguyện của cộng đồng sẽ hiển thị tại đây.', 'Community prayers will appear here.')}
          </div>
        </div>
      </section>
    </div>
  );
}

// ===================================================================
// 7. FORUM & Q&A
// ===================================================================
function ForumPage({ goto }) {
  const { t, lang } = useT();
  const { user } = useAuth();
  const filters = lang === 'vi'
    ? ['Mới nhất', 'Chưa trả lời', 'Rinpoche đã trả lời', 'Phổ biến nhất']
    : ['Latest', 'Unanswered', 'Answered by Rinpoche', 'Most popular'];
  const [filter, setFilter] = useState(filters[0]);
  const [showAskModal, setShowAskModal] = useState(false);
  const [askForm, setAskForm] = useState({ name: '', topic: '', question: '' });
  const [askDone, setAskDone] = useState(false);
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { setFilter(filters[0]); }, [lang]);

  // Load threads from backend
  useEffect(() => {
    api.listForum()
      .then(data => setThreads(Array.isArray(data) ? data : []))
      .catch(() => setThreads([]))
      .finally(() => setLoading(false));
  }, []);

  const openAsk = () => {
    if (!user) { goto?.('login'); return; }
    setShowAskModal(true);
  };

  const handleAskSubmit = async () => {
    if (!askForm.question.trim() || submitting) return;
    setSubmitting(true);
    try {
      const title = askForm.question.slice(0, 80) + (askForm.question.length > 80 ? '…' : '');
      const newThread = await api.createThread({
        avatar: user?.name ? user.name[0].toUpperCase() : '❓',
        title,
        preview: askForm.question,
        author: user?.name ? `@${user.name.toLowerCase().replace(/\s/g, '')}` : `@${user?.email?.split('@')[0] || 'user'}`,
        topic: askForm.topic,
      });
      setThreads(prev => [newThread, ...prev]);
      setAskDone(true);
      setTimeout(() => { setShowAskModal(false); setAskDone(false); setAskForm({ topic: '', question: '' }); }, 2200);
    } catch (err) {
      alert(t('Gửi thất bại: ', 'Failed: ') + (err?.message || ''));
    } finally {
      setSubmitting(false);
    }
  };

  const topics = lang === 'vi'
    ? ['Ngöndro', 'Dudjom Tersar', 'Quán tưởng', 'Thần chú', 'Nghi quỹ', 'Bardo', 'Dzogchen']
    : ['Ngöndro', 'Dudjom Tersar', 'Visualization', 'Mantra', 'Sādhana', 'Bardo', 'Dzogchen'];

  return (
    <div className="page">
      <section className="section">
        <Eyebrow>{t('Phần 07 · Tự viện số', 'Section 07 · Digital Monastery')}</Eyebrow>
        <h2>{t('Diễn đàn · Hỏi & Đáp', 'Forum · Questions & Answers')}</h2>
        <p className="lede">
          {t(
            'Đặt câu hỏi về Phật pháp & Mật tông, chia sẻ kinh nghiệm tu hành, hoặc tham gia thảo luận trực tiếp với Rinpoche.',
            'Ask questions about the dharma and Vajrayāna, share your practice experience, or join live discussions with Rinpoche.'
          )}
        </p>


        {/* Filters */}
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
          <div className="filter-bar" style={{ margin: 0 }}>
            {filters.map(f => (
              <button key={f} className={`filter-chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
            ))}
          </div>
          <button className="btn btn-primary" onClick={openAsk}>+ {t('Đặt câu hỏi mới', 'New question')}</button>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
          {topics.map(tp => (
            <button key={tp} className="tag" style={{ cursor: 'pointer', padding: '6px 14px' }}>#{tp}</button>
          ))}
        </div>

        {/* Forum threads */}
        <div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--ink-400)', fontFamily: 'var(--f-mono)', fontSize: 12 }}>
              {t('Đang tải…', 'Loading…')}
            </div>
          ) : threads.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--ink-400)' }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>🙏</div>
              <p style={{ fontFamily: 'var(--f-serif)', fontStyle: 'italic' }}>
                {t('Chưa có câu hỏi nào. Hãy là người đầu tiên đặt câu hỏi!', 'No questions yet. Be the first to ask!')}
              </p>
            </div>
          ) : threads.map((tr, i) => {
            const timeAgo = tr.createdAt
              ? new Date(tr.createdAt).toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })
              : '';
            return (
              <div key={tr._id || i} className="forum-row">
                <div className="avatar">{tr.avatar || '❓'}</div>
                <div className="body">
                  <h4>{tr.title}</h4>
                  <div className="preview">{tr.preview}</div>
                  <div className="stats">
                    <span>{tr.author}</span>
                    {timeAgo && <span>{timeAgo}</span>}
                    <span>{tr.replies || 0} {t('trả lời', 'replies')}</span>
                    <span>{tr.views || 1} {t('lượt xem', 'views')}</span>
                    {tr.replied && (
                      <span className={tr.byTeacher ? 'teacher' : 'answered'}>
                        ● {tr.byTeacher ? t('RINPOCHE ĐÃ TRẢ LỜI', 'ANSWERED BY RINPOCHE') : t('ĐÃ GIẢI ĐÁP', 'ANSWERED')}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ alignSelf: 'center' }} />
              </div>
            );
          })}
        </div>

        {/* Ask question modal */}
        {showAskModal && (
          <div className="modal-overlay" onClick={() => setShowAskModal(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setShowAskModal(false)}>✕</button>
              {askDone ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>🙏</div>
                  <Eyebrow style={{ justifyContent: 'center' }}>{t('Câu hỏi đã được gửi', 'Question submitted')}</Eyebrow>
                  <h3>{t('Tùy hỉ công đức!', 'Thank you!')}</h3>
                  <p style={{ color: 'var(--ink-700)', fontFamily: 'var(--f-serif)', fontStyle: 'italic' }}>
                    {t('Câu hỏi của bạn đã được đăng lên diễn đàn.', 'Your question has been posted to the forum.')}
                  </p>
                </div>
              ) : (
                <>
                  <Eyebrow>{t('Đặt câu hỏi mới', 'Post a new question')}</Eyebrow>
                  <h3 style={{ marginBottom: 4 }}>{t('Hỏi về Phật pháp & Mật tông', 'Ask about the dharma & Vajrayāna')}</h3>
                  <p style={{ fontSize: 13, color: 'var(--ink-500)', fontFamily: 'var(--f-mono)', marginBottom: 20 }}>
                    {t('Đăng với tư cách', 'Posting as')} <strong>{user?.name || user?.email}</strong>
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div>
                      <label>{t('Chủ đề', 'Topic')}</label>
                      <select className="input" value={askForm.topic} onChange={e => setAskForm(f => ({ ...f, topic: e.target.value }))}>
                        <option value="">{t('-- Chọn chủ đề --', '-- Select topic --')}</option>
                        {topics.map(tp => <option key={tp}>{tp}</option>)}
                      </select>
                    </div>
                    <div>
                      <label>{t('Câu hỏi *', 'Question *')}</label>
                      <textarea className="textarea" style={{ minHeight: 100 }} value={askForm.question} onChange={e => setAskForm(f => ({ ...f, question: e.target.value }))} placeholder={t('Viết câu hỏi của bạn…', 'Write your question…')} />
                    </div>
                    <button
                      className="btn btn-primary"
                      onClick={handleAskSubmit}
                      disabled={!askForm.question.trim() || submitting}
                      style={{ marginTop: 4, opacity: (!askForm.question.trim() || submitting) ? 0.5 : 1 }}
                    >
                      {submitting ? t('Đang gửi…', 'Sending…') : `${t('Đăng câu hỏi', 'Post question')} →`}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

      </section>
    </div>
  );
}

// ===================================================================
// SHARED DATA (bilingual)
// ===================================================================
const MODULES = (lang) => lang === 'vi' ? [
  { key: 'lineage', title: 'Dòng truyền thừa', desc: 'Lịch sử Dudjom Tersar, pháp khí, mantra và tiểu sử bậc thầy.' },
  { key: 'khenpo', title: 'Thầy — Khenpo Rinpoche', desc: 'Tiểu sử, pháp lễ, hành hương và hoạt động hoằng pháp.' },
  { key: 'teaching', title: 'Giảng dạy', desc: 'Ngondro, Empowerment, DDL Shedra và thư viện bài giảng.' },
  { key: 'project', title: 'Dự án & Sự kiện', desc: 'Tu viện, trung tâm Pháp và các sự kiện sắp tới.' },
  { key: 'blog', title: 'Blog', desc: 'Chia sẻ và pháp ngữ từ Khenpo Rinpoche.' },
  { key: 'donate', title: 'Cúng dường', desc: 'Hộ trì Pháp bảo, cúng dường và liên hệ.' },
  { key: 'forum', title: 'Diễn đàn', desc: 'Hỏi đáp Phật pháp, chia sẻ trải nghiệm tu hành.' },
] : [
  { key: 'lineage', title: 'Lineage', desc: 'Dudjom Tersar history, ritual objects, mantras, and master biographies.' },
  { key: 'khenpo', title: 'Teacher — Khenpo Rinpoche', desc: 'Biography, puja, pilgrimage, and worldwide dharma activities.' },
  { key: 'teaching', title: 'Teachings', desc: 'Ngondro, Empowerment, DDL Shedra, and the teaching library.' },
  { key: 'project', title: 'Projects & Events', desc: 'Monastery, dharma centers, and upcoming events.' },
  { key: 'blog', title: 'Blog', desc: "Reflections and dharma teachings from Khenpo Rinpoche." },
  { key: 'donate', title: 'Donate', desc: 'Support the dharma, make offerings, and get in touch.' },
  { key: 'forum', title: 'Forum', desc: 'Ask questions and share practice experience.' },
];


const TANTRA_TIMELINE = (lang) => lang === 'vi' ? [
  { year: 'TK V — VIII', title: 'Khởi nguyên tại Ấn Độ', desc: 'Mật tông xuất hiện tại Nalanda và Vikramashila, hệ thống hóa qua kinh điển Tantra.' },
  { year: 'TK VIII', title: 'Padmasambhava truyền vào Tây Tạng', desc: 'Đại sư Padmasambhava (Liên Hoa Sinh) đưa Mật tông sang Tây Tạng, sáng lập dòng Nyingma — gốc rễ của Dudjom Tersar.' },
  { year: 'TK XIX — XX', title: 'Dudjom Tersar — Kho tàng mới', desc: 'Đức Dudjom Lingpa và con trai Dudjom Rinpoche khám phá các "terma" (kho tàng) Pháp, hình thành dòng Dudjom Tersar.' },
  { year: 'TK XXI', title: 'Du nhập Việt Nam', desc: 'Khenpo Shedup Ogen Kalsang Rinpoche thực hiện các chuyến hoằng pháp tại Việt Nam, kết nối học trò Việt với dòng truyền thừa.' },
] : [
  { year: '5th — 8th c.', title: 'Origins in India', desc: 'Tantric Buddhism emerges at Nalanda and Vikramashila, systematized through the Tantras.' },
  { year: '8th c.', title: 'Padmasambhava brings the dharma to Tibet', desc: 'Guru Padmasambhava establishes Vajrayāna in Tibet, founding the Nyingma school — root of Dudjom Tersar.' },
  { year: '19th — 20th c.', title: 'Dudjom Tersar — Revealed Treasures', desc: 'Dudjom Lingpa and his reincarnation Dudjom Rinpoche reveal terma (treasure teachings), forming the Dudjom Tersar lineage.' },
  { year: '21st c.', title: 'Spreading to Vietnam', desc: 'Khenpo Shedup Ogen Kalsang Rinpoche conducts teaching tours in Vietnam, connecting Vietnamese students with the lineage.' },
];

const COMPARISONS = (lang) => lang === 'vi' ? [
  { school: 'Tiểu thừa · Theravāda', tag: 'Giải thoát cá nhân', desc: 'Tập trung vào tự giải thoát qua Tứ Diệu Đế, Bát Chánh Đạo. Kinh điển Pali.' },
  { school: 'Đại thừa · Mahāyāna', tag: 'Bồ tát đạo', desc: 'Phát Bồ Đề tâm, tu Lục Độ vì lợi ích chúng sinh. Tiệm tiến qua nhiều kiếp.' },
  { school: 'Kim Cương thừa · Vajrayāna', tag: 'Đốn ngộ trong một đời', desc: 'Thân-khẩu-ý đồng hành qua mantra, ấn quyết, quán tưởng — phương tiện thiện xảo để chứng ngộ nhanh.' },
] : [
  { school: 'Hīnayāna · Theravāda', tag: 'Individual liberation', desc: 'Focused on personal liberation through the Four Noble Truths and the Eightfold Path. Pali canon.' },
  { school: 'Mahāyāna', tag: 'Bodhisattva path', desc: 'Generate bodhicitta and practice the six pāramitās for the benefit of all beings. Gradual path.' },
  { school: 'Vajrayāna', tag: 'Awakening in one lifetime', desc: 'Body, speech, and mind united through mantra, mudrā, and visualization — skillful means for swift realization.' },
];

const RITUAL_OBJECTS = (lang) => lang === 'vi' ? [
  { name: 'Kim Cương Chử', sanskrit: 'Vajra · རྡོ་རྗེ་', shape: 'vajra', desc: 'Biểu trưng cho phương tiện thiện xảo và sự bất hoại của Pháp thân.' },
  { name: 'Pháp Luân', sanskrit: 'Dharmachakra', shape: 'wheel', desc: 'Tám nan hoa biểu trưng Bát Chánh Đạo. Phật chuyển bánh xe Pháp.' },
  { name: 'Chuông', sanskrit: 'Ghaṇṭā · དྲིལ་བུ་', shape: 'bell', desc: 'Đối xứng với Vajra — biểu trưng cho Trí tuệ Bát Nhã.' },
  { name: 'Chuỗi Hạt', sanskrit: 'Mālā', shape: 'mala', desc: '108 hạt — đếm thần chú trong các thời tụng niệm.' },
] : [
  { name: 'Vajra', sanskrit: 'Vajra · རྡོ་རྗེ་', shape: 'vajra', desc: 'Symbol of skillful means and the indestructible nature of the dharmakāya.' },
  { name: 'Dharma Wheel', sanskrit: 'Dharmachakra', shape: 'wheel', desc: 'Eight spokes for the Noble Eightfold Path. The Buddha turning the wheel of dharma.' },
  { name: 'Bell', sanskrit: 'Ghaṇṭā · དྲིལ་བུ་', shape: 'bell', desc: 'The counterpart to the vajra — symbol of prajñāpāramitā wisdom.' },
  { name: 'Mālā', sanskrit: 'Mālā', shape: 'mala', desc: '108 beads — for counting mantras during recitation.' },
];

const MANTRAS = (lang) => lang === 'vi' ? [
  { sanskrit: 'Om Maṇi Padme Hūṃ', translit: 'Án Ma Ni Bát Mê Hồng', purpose: 'Thần chú của Đức Quán Thế Âm — từ bi vô lượng.' },
  { sanskrit: 'Om Āḥ Hūṃ Vajra Guru Padma Siddhi Hūṃ', translit: 'Vajra Guru Mantra', purpose: 'Thần chú của Padmasambhava — vị tổ Mật tông Tây Tạng.' },
  { sanskrit: 'Om Vajrasattva Hūṃ', translit: 'Án Bạt Chiết La Tát Đoả Hồng', purpose: 'Thanh tịnh nghiệp chướng — Kim Cương Tát Đoả.' },
] : [
  { sanskrit: 'Oṃ Maṇi Padme Hūṃ', translit: 'The Six-Syllable Mantra', purpose: 'The mantra of Avalokiteśvara — boundless compassion.' },
  { sanskrit: 'Oṃ Āḥ Hūṃ Vajra Guru Padma Siddhi Hūṃ', translit: 'The Vajra Guru Mantra', purpose: 'The mantra of Padmasambhava — founder of Tibetan Vajrayāna.' },
  { sanskrit: 'Oṃ Vajrasattva Hūṃ', translit: 'Vajrasattva Heart Mantra', purpose: 'Purifying negative karma and obscurations.' },
];

const LINEAGE_MASTERS = (lang) => lang === 'vi' ? [
  {
    name: 'Dudjom Lingpa (1835 – 1904)',
    dates: '1835 – 1904',
    role: 'NGƯỜI SÁNG LẬP',
    content: 'Vị đại thần thông Tây Tạng Dudjom Lingpa (1835–1904) được xem là người sáng lập dòng Dudjom Tersar. Điểm đặc biệt của Dudjom Lingpa là ông là một vị thầy và tertön (người khám phá kho tàng) được tôn kính cao độ, mặc dù không qua đào tạo tu viện chính thức. Dudjom Lingpa có một gia đình đông đảo và sống trong nghèo khó, thế nhưng qua lòng sùng mộ và tu tập không ngừng nghỉ, ông đã có những cuộc gặp gỡ trực tiếp với các thiên thần trí tuệ. Lịch sử truyền thừa Dudjom Tersar khởi nguồn từ Đức Phật Phổ Hiền (Samantabhadra) và được truyền từ Kim Cương Tát Đoả (Vajrasattva) đến Garab Dorje, Manjusrimitra, Sri Singha, Padmasambhava và Yeshe Tsogyal. Dudjom Lingpa đã khám phá những giáo lý ẩn mật từ Padmasambhava và Yeshe Tsogyal, tổng cộng 21 tập với hơn 20.000 trang kinh điển, tạo nên nền tảng của Dudjom Tersar. Thông qua pháp tu Dzogchen nổi tiếng, nhiều đệ tử của Dudjom Lingpa đã đạt thân cầu vồng và giác ngộ. Hiện nay, pháp tu Dzogchen được xem là khía cạnh cốt lõi và thiết yếu của dòng Dudjom — con đường nội tâm thâm sâu nhất và cao nhất của truyền thống Kim Cương Thừa. Những pháp giảng thiết yếu gồm Sangtri Kagyama, Neluk Rangjung, Magom Sangye, Nang Jang và Sherik Dorje Nonpo Gyu — các văn bản kho tàng Dzogchen được Dudjom Lingpa trực tiếp khám phá qua thị kiến về Kuntuzangpo (Phổ Hiền). Nhiều đại thành tựu giả thuộc nhiều truyền thống Kim Cương Thừa đã xác nhận các văn bản này, đặc biệt là Jamgon Mipham Rinpoche, bậc thầy lỗi lạc được xem là Văn Thù Sư Lợi trong thân người.',
  },
  {
    name: 'Dudjom Rinpoche · Jigdral Yeshe Dorje (1904 – 1987)',
    dates: '1904 – 1987',
    role: 'HÓA THÂN ĐỜI THỨ HAI',
    content: 'Dudjom Rinpoche Jigdral Yeshe Dorje (1904–1987), sinh tại đông nam Tây Tạng, là hóa thân của Dudjom Lingpa. Ngài nhận pháp Dudjom Tersar từ Gyurme Ngedon Wangpo, vị thừa kế tâm ấn gần gũi nhất của Dudjom Lingpa. Dudjom Rinpoche nổi tiếng truyền bá Dudjom Tersar khắp thế giới khi trải qua cuộc lưu vong của người Tây Tạng. Những ai có duyên gặp Ngài đều mô tả Ngài có thần nhãn thấu suốt, phong thái uyển chuyển và uy nghi. Dudjom Rinpoche được đào tạo chăm chỉ trong các giáo lý và thực hành Phật giáo từ thuở nhỏ. Tương tự Dudjom Lingpa, Dudjom Rinpoche có giao cảm trực tiếp với các thiên thần trí tuệ. Ngài soạn 25 tập trước tác, khám phá các giáo lý kho tàng và cũng biên tập lại toàn bộ kinh điển Nyingma kama (kinh điển truyền khẩu). Dudjom Rinpoche giảng dạy khắp thế giới, nhưng những năm cuối đời Ngài ở cùng gia đình tại Dordogne, Pháp.',
  },
  {
    name: 'H.H. Dudjom Rinpoche III · Sangye Pema Shepa (1990 – Nay)',
    dates: '1990 – Nay',
    role: 'HÓA THÂN ĐỜI THỨ BA',
    content: 'Đức H.H. Dudjom Rinpoche III Sangye Pema Shepa (1990 – Nay), thường được gọi là Dudjom Yangsi Rinpoche, là hóa thân thứ ba và gần đây nhất của Dudjom Lingpa. Ngài sinh tại đông bắc Tây Tạng và được nhiều bậc thầy thành tựu công nhận, trong đó có H.H. Chatral Rinpoche và H.H. Thinley Norbu Rinpoche. Khi còn nhỏ, Rinpoche nổi tiếng với sự điềm tĩnh cao thượng và bất động khi ngồi trên pháp tòa hàng giờ đồng hồ. Dudjom Yangsi Rinpoche hiện trú xứ và giảng dạy tại Tây Tạng. Trước đại dịch Covid-19, Ngài dành thời gian ban các giáo lý và quán đỉnh khắp thế giới. Ngài nhận pháp và cộng tác chặt chẽ cùng H.H. Chatral Rinpoche suốt thời niên thiếu, cho đến khi Chatral Rinpoche viên tịch năm 2015. Khenpo Ogen lần đầu được thấy Dudjom Yangsi Rinpoche khi Ngài được suy tôn lên pháp tòa lúc lên bốn tuổi tại thiền viện của Chatral Rinpoche. Khenpo Ogen là người nhận quán đỉnh Dudjom đầu tiên của Dudjom Yangsi Rinpoche tại Pharping, Nepal, sau khi Ngài hoàn tất khóa nhập thất ba năm tại Gangri Thakar, Tây Tạng. H.H. Dudjom Rinpoche III cũng đã phong danh hiệu Khenpo trong dòng Dudjom cho Khenpo Ogen vào năm 2014. Vì vậy, Khenpo Ogen tu tập dưới sự hướng dẫn của Dudjom Rinpoche với tư cách người nắm giữ dòng Dudjom.',
  },
  {
    name: 'H.H. Thinley Norbu Rinpoche (1931 – 2011)',
    dates: '1931 – 2011',
    role: 'VỊ THẦY GỐC RỄ',
    content: 'Đức H.H. Thinley Norbu Rinpoche (1931–2011) sinh tại Lhasa, Tây Tạng, là con trai cả của H.H. Dudjom Rinpoche. Ngài là hóa thân của Tulku Drime Oser, một người con trai của Dudjom Lingpa. Ngài cũng là hóa hiện của Longchenpa — bậc thầy học giả và hành giả huyền thoại trong Phật giáo Nyingma. Trước cuộc xâm lược Tây Tạng, H.H. Thinley Norbu Rinpoche tu học tại tu viện Mindrolling danh tiếng. Tương tự H.H. Dudjom Rinpoche, H.H. Thinley Norbu Rinpoche có gia đình và đi khắp thế giới hoằng dương Phật pháp, cuối cùng định cư tại Hoa Kỳ. H.H. Thinley Norbu Rinpoche đã viết nhiều tác phẩm quan trọng. Nhiều hành giả bị thu hút bởi H.H. Thinley Norbu Rinpoche, vì sự hiện diện của Ngài toát ra bình an và thành tựu sâu xa, khơi dậy lòng sùng mộ trong tâm đệ tử. Khenpo Ogen xem Thinley Norbu Rinpoche là người đã "toát ra sự bình an và thành tựu sâu xa, khơi dậy lòng sùng mộ trong tâm đệ tử." Khenpo Ogen lần đầu gặp Thinley Norbu Rinpoche năm 1992 khi Ngài thường xuyên viếng thăm tư gia Japarti tại Nepal. Khenpo Ogen còn rất nhỏ tuổi lúc đó, nhưng nhớ rõ buổi giảng pháp đầu tiên với Thinley Norbu Rinpoche, vì tác động sâu sắc của nó. Kể từ những chuyến viếng thăm thời niên thiếu đó, Khenpo đã nhận được nhiều giáo lý quan trọng về Dzogchen và truyền thống Nyingthik, các quán đỉnh và truyền thừa Dudjom Tersar, cho đến khi Thinley Norbu Rinpoche viên tịch năm 2011. Khenpo Ogen xem mình gắn kết với Thinley Norbu Rinpoche bằng một mối liên hệ sùng mộ đặc biệt và duy nhất trong trọn cuộc đời. Khenpo Ogen nói rằng: "Trong sự hiện diện của Ngài, tôi cảm thấy như một đứa con chưa biết đi được người cha yêu thương chăm sóc. Tôi cảm nhận phúc lành từ sự hiện diện ấm áp và những giáo lý tâm ấn của Ngài. Tôi rất may mắn có Đức H.H. Thinley Norbu Rinpoche là vị thầy gốc rễ của mình trong cuộc đời này. Tôi cảm nhận phúc lành của Ngài tận sâu trong cốt lõi bản thể và tu tập của mình — sâu sắc đến mức tôi không cần thêm bất kỳ hướng dẫn nào nữa trên con đường này. Lời nói của Ngài có phẩm chất thâm nhập thẳng vào tâm người nghe, tức thì, với bất kỳ ai. Và giáo lý thiết yếu của Ngài không khác gì lời của Garab Dorje — Kuntuzangpo trong thân người."',
  },
] : [
  {
    name: 'Dudjom Lingpa (1835 – 1904)',
    dates: '1835 – 1904',
    role: 'FOUNDER',
    content: 'The powerful Tibetan mystic, Dudjom Lingpa (1835–1904), is considered the founder of Dudjom Tersar. Dudjom Lingpa is unique in that he is a highly regarded teacher and tertön with no formal monastic training. Dudjom Lingpa had a large family and lived in poverty, yet through devotion and unwavering practice, he experienced direct encounters with wisdom deities. The history of transmission of the Dudjom Tersar originates with Samantabhadra Buddha and was transmitted from Vajrasattva to Garab Dorje to Manjusrimitra to Sri Singha to Padmasambhava and Yeshe Tsogyal. Dudjom Lingpa revealed hidden teachings from Padmasambhava and Yeshe Tsogyal that total 21 volumes and over 20,000 pages of scripture, which form the foundation of the Dudjom Tersar. Through the famous practice of Dzogchen, multiple students of Dudjom Lingpa attained rainbow body and enlightenment. Presently, Dzogchen practice is considered the core, essential aspect of the Dudjom lineage — the innermost and highest path of the Vajrayāna tradition. Pith instructions include Sangtri Kagyama, Neluk Rangjung, Magom Sangye, or the Nang Jang and Sherik Dorje Nonpo Gyu. These texts are Dzogchen tantra treasure texts revealed by Dudjom Lingpa himself as he experienced Kuntuzangpo directly in a vision. Many great masters across multiple Vajrayāna traditions have validated these texts, particularly Jamgon Mipham Rinpoche, a well known master who is considered Manjushri in human form.',
  },
  {
    name: 'Dudjom Rinpoche · Jigdral Yeshe Dorje (1904 – 1987)',
    dates: '1904 – 1987',
    role: 'SECOND INCARNATION',
    content: 'Dudjom Rinpoche Jigdral Yeshe Dorje (1904–1987), born in southeast Tibet, is the incarnation of Dudjom Lingpa. He received the Dudjom Tersar transmission from Dudjom Lingpa\'s heart son (closest student), Gyurme Ngedon Wangpo. Dudjom Rinpoche famously spread the Dudjom Tersar across the world as he lived through the Tibetan Diaspora. Those who crossed his path described him as penetratingly clairvoyant, graceful, and dignified. Dudjom Rinpoche was diligently trained in the teachings and practices of Buddhism from a young age. Similar to Dudjom Lingpa, Dudjom Rinpoche had direct communication with wisdom deities. He comprised 25 volumes of writings, revealed treasure teachings, and also revised the entire Nyingma canon (kama). Dudjom Rinpoche taught around the world but spent much of his later years with his family in Dordogne, France.',
  },
  {
    name: 'H.H. Dudjom Rinpoche III · Sangye Pema Shepa (1990 – Present)',
    dates: '1990 – Present',
    role: 'THIRD INCARNATION',
    content: 'His Holiness Dudjom Rinpoche III Sangye Pema Shepa (1990–Present), often referred to as Dudjom Yangsi Rinpoche, is the third and most recent incarnation of Dudjom Lingpa. He was born in northeastern Tibet and recognized by many accomplished masters, including HH Chatral Rinpoche and HH Thinley Norbu Rinpoche. As a child, Rinpoche was famous for his noble and unwavering composure while sitting for hours on the throne. Dudjom Yangsi Rinpoche currently resides and teaches in Tibet. Before Covid-19, he spent time giving teachings and empowerments across the world. He received transmission and worked closely alongside HH Chatral Rinpoche throughout his youth, until Chatral Rinpoche\'s parinirvana in 2015. Khenpo Ogen first saw Dudjom Yangsi Rinpoche while he was being enthroned at the young age of four at Chatral Rinpoche\'s retreat center. Khenpo Ogen was a recipient of Dudjom Yangsi Rinpoche\'s first ever Dudjom lineage empowerment in Pharping, Nepal, after the completion of his three-year retreat in Gangri Thakar, Tibet. His Holiness Dudjom Rinpoche III also bestowed Khenpo Ogen his Khenpo title in the Dudjom lineage in 2014. Khenpo Ogen is therefore under Dudjom Rinpoche\'s guidance as a Dudjom lineage holder.',
  },
  {
    name: 'H.H. Thinley Norbu Rinpoche (1931 – 2011)',
    dates: '1931 – 2011',
    role: 'ROOT TEACHER',
    content: 'His Holiness Thinley Norbu Rinpoche (1931–2011) was born in Lhasa, Tibet, and is the eldest son of HH Dudjom Rinpoche. He was the incarnation of Tulku Drime Oser, who was a son of Dudjom Lingpa. He was also an emanation of Longchenpa, a legendary scholar and practitioner within Nyingma Buddhism. Before the invasion of Tibet, HH Thinley Norbu Rinpoche studied at the famous Mindrolling Monastery. Similar to HH Dudjom Rinpoche, HH Thinley Norbu Rinpoche had a family and travelled the world spreading Dharma, eventually settling in the United States. HH Thinley Norbu Rinpoche wrote several pivotal works. Many Dharma practitioners were drawn to HH Thinley Norbu Rinpoche, as his presence emanated profound peace and realization, giving rise to devotion within his students. Khenpo Ogen considers Thinley Norbu Rinpoche to have "emanated profound peace and realization, giving rise to devotion within his students." Khenpo Ogen first encountered Thinley Norbu Rinpoche in 1992 when he was frequently visiting his residence, Japarti, in Nepal. Khenpo Ogen was very young, but clearly remembers this first teaching with Thinley Norbu Rinpoche, as it had a profound impact on him. Since these visits in Khenpo\'s youth, he received many important teachings on Dzogchen and the Nyingthik tradition, Dudjom Tersar empowerments and transmissions, until Thinley Norbu Rinpoche\'s parinirvana in 2011. Khenpo Ogen considers himself bound with a unique and special lifetime devotional connection towards Thinley Norbu Rinpoche. Khenpo Ogen states, "In his presence, I felt like a son who can\'t walk being cared for by a loving father. I felt blessed by his warm presence and heart teachings. I\'m very fortunate to have His Holiness (Thinley Norbu Rinpoche) as my root teacher in this life. I feel his blessings in the core of my being and in my practice, so deeply that I don\'t need anymore guidance on this path. His speech had a quality that entered right into your heart, immediately, to whoever heard. And his teaching for pith instructions are no other than Garab Dorje\'s speech, the Kuntuzangpo in human flesh."',
  },
];

const STATS = (lang) => lang === 'vi' ? [
  { num: 'Nyingma', label: 'Truyền thừa Dudjom Tersar' },
  { num: '3', label: 'Ngôn ngữ giảng dạy' },
  { num: 'Kathmandu', label: 'Trụ xứ — Samye Memorial' },
] : [
  { num: 'Nyingma', label: 'Dudjom Tersar lineage' },
  { num: '3', label: 'Teaching languages' },
  { num: 'Kathmandu', label: 'Residence — Samye Memorial' },
];

const SUBJECTS = (lang) => lang === 'vi' ? [
  { glyph: '律', title: 'Luật tạng', sanskrit: 'VINAYA', desc: 'Giới luật của người xuất gia và hành giả Phật giáo — nền tảng của đời sống tu hành.' },
  { glyph: '阿', title: 'A-tỳ-đạt-ma', sanskrit: 'ABHIDHARMA', desc: 'Phân tích chi tiết về tâm, tâm sở, và cấu trúc của hiện tượng theo Phật giáo.' },
  { glyph: '般', title: 'Bát-nhã Ba-la-mật', sanskrit: 'PRAJÑĀPĀRAMITĀ', desc: 'Trí tuệ siêu việt — căn bản của con đường Bồ Tát Đại thừa.' },
  { glyph: '中', title: 'Trung quán', sanskrit: 'MADHYAMAKA', desc: 'Triết học tánh Không của Nāgārjuna — con đường Trung đạo.' },
  { glyph: '密', title: 'Guḥyagarbha Tantra', sanskrit: 'GUḤYAGARBHA', desc: 'Tantra cốt lõi của dòng Nyingma — bản đồ về Pháp thân và Báo thân.' },
  { glyph: '空', title: 'Bộ ba Resting · Longchenpa', sanskrit: "LONGCHENPA'S TRILOGY", desc: 'Ba bộ luận Đại Toàn Thiện của Longchen Rabjam — đỉnh cao của Dzogchen.' },
] : [
  { glyph: '律', title: 'Vinaya', sanskrit: 'MONASTIC DISCIPLINE', desc: 'The code of conduct for ordained sangha and practitioners — foundation of dharmic life.' },
  { glyph: '阿', title: 'Abhidharma', sanskrit: 'HIGHER TEACHINGS', desc: 'Detailed analysis of mind, mental factors, and the structure of phenomena.' },
  { glyph: '般', title: 'Prajñāpāramitā', sanskrit: 'PERFECTION OF WISDOM', desc: 'Transcendent wisdom — the heart of the Mahāyāna bodhisattva path.' },
  { glyph: '中', title: 'Madhyamaka', sanskrit: 'MIDDLE WAY', desc: "Nāgārjuna's philosophy of emptiness — the Middle Way beyond extremes." },
  { glyph: '密', title: 'Guḥyagarbha Tantra', sanskrit: 'SECRET ESSENCE', desc: 'Core tantra of the Nyingma lineage — a map of dharmakāya and saṃbhogakāya.' },
  { glyph: '空', title: "Longchenpa's Trilogy", sanskrit: 'RESTING IN THE NATURE OF MIND', desc: "The three treatises of Longchen Rabjam — the pinnacle of Dzogchen." },
];


const OFFERINGS = (lang) => lang === 'vi' ? [
  { title: 'Cúng dường Rinpoche', desc: 'Tịnh tài hộ trì các chuyến hoằng pháp của Rinpoche.' },
  { title: 'Tùy hỉ tùy duyên', desc: 'Tùy hỉ cúng dường vào quỹ chung Pháp hội.' },
] : [
  { title: 'Offering to Rinpoche', desc: "Support Rinpoche's dharma activities and teaching tours." },
  { title: 'General donation', desc: 'Contribute as you wish to the general dharma fund.' },
];


// ===================================================================
// LINEAGE PAGE — History + Master Biography
// ===================================================================
function LineagePage() {
  const { t, lang } = useT();
  return (
    <div className="page">
      {/* History */}
      <section id="history" className="section">
        <Eyebrow>{t('Dòng truyền thừa · Lịch sử', 'Lineage · History')}</Eyebrow>
        <h2>{t('Dudjom Tersar — Dòng Kho tàng Mới', 'Dudjom Tersar — The New Treasure Lineage')}</h2>
        <p style={{ color: 'var(--ink-700)', lineHeight: 1.85, maxWidth: 780, marginBottom: 48 }}>
          {t(
            'Dudjom Tersar là một Dòng Kho tàng Mới (New Treasure Lineage) — một dòng truyền thừa mật thừa Phật giáo tương đối mới hơn, rất thích hợp trong thời điểm khó khăn của lịch sử, đúng như lời tiên tri của Đạo sư Padmasambhava. Dudjom Tersar đặc biệt ở chỗ đây là con đường mật thừa hoàn chỉnh dẫn đến giác ngộ dành cho cả hành giả cư sĩ. Chữ "Dudjom" nghĩa là "người hàng phục ma". "Tersar" nghĩa là "kho tàng mới". Từ bi và trí tuệ là nền tảng của dòng truyền thừa sâu xa này.',
            'Dudjom Tersar is a New Treasure Lineage, meaning that it is a newer Buddhist tantric lineage. It is a very appropriate spiritual path during this difficult time in history, as foretold by Guru Padmasambhava. Dudjom Tersar is unique in that it is a complete tantric path to enlightenment available to householder practitioners. The word Dudjom itself means "demon defeater". Tersar means "new treasure". Compassion and wisdom are the basis of this profound lineage.'
          )}
        </p>
        <div className="timeline-tantra">
          {TANTRA_TIMELINE(lang).map((tt, i) => (
            <div className="item" key={i}>
              <div className="year">{tt.year}</div>
              <h3>{tt.title}</h3>
              <p style={{ color: 'var(--ink-700)', fontSize: 14 }}>{tt.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Master Biography */}
      <section id="master-biography" className="section" style={{ background: 'var(--paper)', maxWidth: 'none' }}>
        <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
          <Eyebrow>{t('Tiểu sử Bậc Thầy', 'Master Biography')}</Eyebrow>
          <h2>{t('Các bậc thầy dòng Dudjom', 'Masters of the Dudjom Lineage')}</h2>

          {/* 4-master portrait grid */}
          <div className="lineage-master-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, margin: '36px 0 48px' }}>
            {[
              { src: '/lineage-1.jpg', name: 'Dudjom Lingpa', sub: t('Sáng lập dòng Dudjom Tersar', 'Founder of Dudjom Tersar') },
              { src: '/lineage-2.jpg', name: 'H.H. Dudjom Rinpoche II', sub: 'Jigdrel Yeshe Dorje' },
              { src: '/lineage-3.jpg', name: 'H.H. Thinley Norbu', sub: t('Pháp tử trưởng của Dudjom Rinpoche II', 'Eldest son of Dudjom Rinpoche II') },
              { src: '/lineage-4.jpg', name: 'H.H. Dudjom Rinpoche III', sub: 'Sangye Pema Shepa' },
            ].map(({ src, name, sub }) => (
              <div key={src} style={{ textAlign: 'center' }}>
                <div style={{ aspectRatio: '3/4', overflow: 'hidden', borderRadius: 3, border: '1px solid var(--gold-700)', marginBottom: 12 }}>
                  <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
                </div>
                <div style={{ fontFamily: 'var(--f-serif)', fontSize: 15, color: 'var(--maroon-700)', lineHeight: 1.3, marginBottom: 4 }}>{name}</div>
                <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10.5, color: 'var(--ink-500)', letterSpacing: '0.06em' }}>{sub}</div>
              </div>
            ))}
          </div>

          <p style={{ color: 'var(--ink-700)', lineHeight: 1.8, maxWidth: 720, marginBottom: 8 }}>
            {t(
              'Dưới đây là tiểu sử của các vị thầy chính trong dòng Dudjom Tersar — nhấn vào tên để đọc đầy đủ.',
              'Below are the biographies of the principal masters of the Dudjom Tersar lineage — click to expand each entry.'
            )}
          </p>
          <div style={{ borderBottom: '1px solid var(--cream-300)', marginTop: 32 }}>
            {LINEAGE_MASTERS(lang).map((m, i) => (
              <LineageAccordion key={i} name={m.name} dates={m.dates} role={m.role} content={m.content} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ===================================================================
// TEACHING PAGE — Ngondro · Empowerment · DDL Shedra
// ===================================================================
function TeachingPage({ goto }) {
  const { t } = useT();
  return (
    <div className="page">
      {/* Ngondro */}
      <section id="ngondro" className="section">
        <Eyebrow>Ngondro</Eyebrow>
        <h2>{t('Ngondro — Thực hành Nền tảng', 'Ngondro — Foundation Practices')}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 48, alignItems: 'start', marginTop: 24 }}>
          <div>
            <p style={{ color: 'var(--ink-700)', maxWidth: 680, lineHeight: 1.8 }}>
              {t(
                'Ngondro là các thực hành nền tảng trong Mật tông Tây Tạng, bao gồm 100.000 lần lễ lạy, trì chú Kim Cương Tát Đỏa, cúng Mandala và Guru Yoga. Khenpo Ogen Kalsang đang hướng dẫn đệ tử thực hành theo truyền thừa Dudjom Tersar.',
                'Ngondro comprises the foundational practices of Tibetan Vajrayana Buddhism, including 100,000 prostrations, Vajrasattva recitation, Mandala offering, and Guru Yoga. Khenpo Ogen Kalsang guides students through these practices in the Dudjom Tersar tradition.'
              )}
            </p>
            <p style={{ color: 'var(--ink-500)', fontFamily: 'var(--f-mono)', fontSize: 13, letterSpacing: '0.1em', marginTop: 24 }}>
              {t('Tài liệu chi tiết đang được cập nhật.', 'Detailed materials in preparation.')}
            </p>
          </div>
          <img
            src="/ngondro-cover.jpg"
            alt="Ngondro"
            style={{ width: '100%', borderRadius: 4, border: '1px solid var(--gold-700)', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
          />
        </div>
      </section>

      {/* Empowerment */}
      <section id="empowerment" className="section" style={{ background: 'var(--paper)', maxWidth: 'none' }}>
        <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
          <Eyebrow>Empowerment</Eyebrow>
          <h2>{t('Quán đỉnh & Truyền pháp', 'Empowerments & Transmissions')}</h2>
          <p style={{ color: 'var(--ink-700)', maxWidth: 680, marginTop: 20, lineHeight: 1.8 }}>
            {t(
              'Quán đỉnh (Wang) là nghi lễ trao truyền năng lực tu tập Mật pháp từ đạo sư sang học trò. Khenpo thường xuyên ban quán đỉnh cho đệ tử trong và ngoài nước theo lịch pháp sự.',
              'Empowerment (Wang) is the ritual transmission that authorises students to practise a particular Vajrayana teaching. Khenpo regularly confers empowerments to students worldwide according to the dharma calendar.'
            )}
          </p>
          <p style={{ color: 'var(--ink-500)', fontFamily: 'var(--f-mono)', fontSize: 13, letterSpacing: '0.1em', marginTop: 24 }}>
            {t('Lịch quán đỉnh sắp tới đang được cập nhật.', 'Upcoming empowerment schedule in preparation.')}
          </p>
        </div>
      </section>

      {/* DDL Shedra */}
      <section id="ddl-shedra" className="section">
        <Eyebrow>DDL Shedra</Eyebrow>
        <h2>{t('DDL Shedra — Học viện Phật học', 'DDL Shedra — Buddhist Studies')}</h2>
        <p style={{ color: 'var(--ink-700)', maxWidth: 680, marginTop: 20, lineHeight: 1.8 }}>
          {t(
            'Shedra là trường Phật học truyền thống Tây Tạng nơi học giả nghiên cứu kinh điển, luận thư và triết học Phật giáo trong nhiều năm. Khenpo Ogen Kalsang đang phát triển chương trình DDL Shedra để phổ biến kiến thức Phật pháp đến học trò quốc tế.',
            'A Shedra is a traditional Tibetan Buddhist college where scholars study scriptures, philosophical treatises, and Buddhist philosophy over many years. Khenpo Ogen Kalsang is developing the DDL Shedra curriculum to bring this classical education to international students.'
          )}
        </p>
        <p style={{ color: 'var(--ink-500)', fontFamily: 'var(--f-mono)', fontSize: 13, letterSpacing: '0.1em', marginTop: 24 }}>
          {t('Chương trình học đang được xây dựng.', 'Curriculum under development.')}
        </p>
      </section>

      {/* Full lecture library */}
      <LecturesPage goto={goto} />
    </div>
  );
}

// ===================================================================
// PROJECT PAGE — Monastery · Centers · Upcoming Event
// ===================================================================
function ProjectPage({ goto }) {
  const { t, lang } = useT();
  const cms = useCMS();
  const [view, setView] = useState(lang === 'vi' ? 'Tháng' : 'Month');
  const [registerEvent, setRegisterEvent] = useState(null);
  const [regForm, setRegForm] = useState({ name: '', email: '', phone: '', note: '' });
  const [regDone, setRegDone] = useState(false);

  useEffect(() => { setView(lang === 'vi' ? 'Tháng' : 'Month'); }, [lang]);

  const allEvents = (cms?.events || []).map(e => cmsEventToDisplay(e, lang));
  const grouped = useMemo(() => {
    const g = {};
    allEvents.forEach(e => { if (!g[e.month]) g[e.month] = []; g[e.month].push(e); });
    return g;
  }, [lang, cms?.events]);

  const handleRegister = () => {
    if (!regForm.name || !regForm.email) return;
    setRegDone(true);
    setTimeout(() => { setRegisterEvent(null); setRegDone(false); setRegForm({ name: '', email: '', phone: '', note: '' }); }, 3000);
  };

  return (
    <div className="page">
      {/* Monastery */}
      <section id="monastery" className="section">
        <Eyebrow>{t('Dự án', 'Project')}</Eyebrow>
        <h2>{t('Tu viện', 'Monastery')}</h2>
        <div style={{ marginTop: 40 }}>
          <div className="card" style={{ padding: 40, maxWidth: 640, marginBottom: 40 }}>
            <div style={{ fontFamily: 'var(--f-serif)', fontSize: 40, color: 'var(--gold-500)', marginBottom: 16 }}>🏯</div>
            <h3 style={{ color: 'var(--maroon-800)', marginBottom: 8 }}>{t('Tu viện Kathmandu', 'Kathmandu Monastery')}</h3>
            <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, letterSpacing: '0.15em', color: 'var(--gold-700)', marginBottom: 12 }}>
              {t('ĐANG LÊN KẾ HOẠCH', 'IN PLANNING')}
            </div>
            <p style={{ color: 'var(--ink-700)', fontSize: 14, lineHeight: 1.7 }}>
              {t(
                'Khenpo Ogen đang lên kế hoạch xây dựng một tu viện nhỏ tại Kathmandu, Nepal theo yêu cầu của đệ tử Nepal.',
                'Khenpo Ogen has begun preliminary plans to build a small monastery in Kathmandu, Nepal at the request of his Nepali students.'
              )}
            </p>
          </div>
          <img
            src="/monastery-top-view.jpg"
            alt={t('Phối cảnh tu viện — nhìn từ trên', 'Monastery rendering — top view')}
            style={{ width: '100%', maxWidth: 860, borderRadius: 4, border: '1px solid var(--gold-700)', boxShadow: '0 8px 32px rgba(0,0,0,0.15)', display: 'block' }}
          />
        </div>
      </section>

      {/* Centers */}
      <section id="centers" className="section" style={{ background: 'var(--paper)', maxWidth: 'none' }}>
        <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
          <Eyebrow>{t('Trung tâm Pháp', 'Dharma Centers')}</Eyebrow>
          <h2>{t('Trung tâm Pháp toàn cầu', 'Global Dharma Centers')}</h2>
          <div style={{ marginTop: 40, maxWidth: 640 }}>
            <div className="card" style={{ padding: 40 }}>
              <div style={{ fontFamily: 'var(--f-serif)', fontSize: 40, color: 'var(--gold-500)', marginBottom: 16 }}>🌏</div>
              <h3 style={{ color: 'var(--maroon-800)', marginBottom: 8 }}>{t('Trung tâm Pháp', 'Dharma Centers')}</h3>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, letterSpacing: '0.15em', color: 'var(--gold-700)', marginBottom: 12 }}>
                {t('SẮP RA MẮT', 'COMING SOON')}
              </div>
              <p style={{ color: 'var(--ink-700)', fontSize: 14, lineHeight: 1.7 }}>
                {t(
                  'Các trung tâm Pháp sẽ được thiết lập tại Việt Nam, châu Á, châu Âu và Hoa Kỳ để hỗ trợ học trò tu tập.',
                  'Dharma centers will be established in Vietnam, Asia, Europe and the United States to support students in their practice.'
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section id="upcoming-event" className="section" style={{ background: 'var(--paper)', maxWidth: 'none' }}>
        <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
          <Eyebrow>{t('Sự kiện sắp tới', 'Upcoming Events')}</Eyebrow>
          <h2>{t('Khóa tu & Pháp hội', 'Retreats & Teachings')}</h2>
          <div className="calendar-tabs" style={{ marginTop: 24 }}>
            {(lang === 'vi' ? ['Năm', 'Tháng', 'Tuần'] : ['Year', 'Month', 'Week']).map(v => (
              <button key={v} className={view === v ? 'active' : ''} onClick={() => setView(v)}>{v}</button>
            ))}
          </div>
          <div className="timeline-events" style={{ marginTop: 32 }}>
            {allEvents.length === 0 && (
              <p style={{ color: 'var(--ink-400)', fontFamily: 'var(--f-mono)', fontSize: 12, padding: '32px 0' }}>
                {t('Chưa có sự kiện nào được lên lịch.', 'No upcoming events scheduled yet.')}
              </p>
            )}
            {Object.entries(grouped).map(([month, items]) => (
              <div key={month}>
                <div className="month-label">{month}</div>
                {items.map((e, i) => (
                  <div key={e.id || i} className="event-row" style={{ gridTemplateColumns: '100px 110px 1fr auto' }}>
                    <div className="date-block">
                      <div className="day">{e.day}</div>
                      <div className="month">{e.monthShort}</div>
                    </div>
                    <div className="event-row-img" style={{ aspectRatio: 1, overflow: 'hidden', borderRadius: 2 }}>
                      <CmsImage src={e.imageUrl} alt={e.title} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                        <Tag>{e.type}</Tag>
                        {e.live && <Tag variant="live">{t('Trực tuyến', 'Livestream')}</Tag>}
                      </div>
                      <h3>{e.title}</h3>
                      <div className="meta">{e.date} · {e.location}</div>
                    </div>
                    <button className="btn btn-ghost" onClick={() => setRegisterEvent(e)}>{t('Đăng ký', 'Register')} →</button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {registerEvent && (
        <div className="modal-overlay" onClick={() => { setRegisterEvent(null); setRegDone(false); }}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => { setRegisterEvent(null); setRegDone(false); }}>✕</button>
            {regDone ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🪷</div>
                <h3>{t('Đã nhận đăng ký!', 'Registration received!')}</h3>
                <p style={{ color: 'var(--ink-700)', fontFamily: 'var(--f-serif)', fontStyle: 'italic' }}>
                  {t(`Cảm ơn ${regForm.name}. Chúng tôi sẽ liên hệ qua ${regForm.email}.`, `Thank you ${regForm.name}. We will contact you at ${regForm.email}.`)}
                </p>
              </div>
            ) : (
              <>
                <Eyebrow>{t('Đăng ký tham dự', 'Register')}</Eyebrow>
                <h3 style={{ marginBottom: 20 }}>{registerEvent.title}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div><label>{t('Họ tên *', 'Full name *')}</label><input className="input" value={regForm.name} onChange={e => setRegForm(f => ({ ...f, name: e.target.value }))} /></div>
                  <div><label>Email *</label><input className="input" type="email" value={regForm.email} onChange={e => setRegForm(f => ({ ...f, email: e.target.value }))} /></div>
                  <div><label>{t('Số điện thoại', 'Phone')}</label><input className="input" value={regForm.phone} onChange={e => setRegForm(f => ({ ...f, phone: e.target.value }))} /></div>
                  <button className="btn btn-primary" onClick={handleRegister} disabled={!regForm.name || !regForm.email} style={{ marginTop: 4, opacity: (!regForm.name || !regForm.email) ? 0.5 : 1 }}>
                    {t('Xác nhận', 'Confirm')} →
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ===================================================================
// BLOG PAGE — Coming soon
// ===================================================================
function BlogPage() {
  const { t, lang } = useT();
  const cms = useCMS();
  const [selected, setSelected] = useState(null);

  const posts = cms?.blogs || [];

  if (selected) {
    return (
      <div className="page">
        <section className="section">
          <button className="btn btn-ghost" onClick={() => setSelected(null)} style={{ marginBottom: 24 }}>← {t('Quay lại', 'Back')}</button>
          {selected.imageUrl && (
            <div style={{ width: '100%', maxHeight: 360, overflow: 'hidden', borderRadius: 4, marginBottom: 32 }}>
              <img src={selected.imageUrl} alt="" style={{ width: '100%', objectFit: 'cover' }} />
            </div>
          )}
          <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--gold-700)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>
            {new Date(selected.createdAt).toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <h2 style={{ marginBottom: 24 }}>{lang === 'vi' ? selected.title_vi : selected.title_en}</h2>
          <div style={{ color: 'var(--ink-700)', lineHeight: 1.85, maxWidth: 720, whiteSpace: 'pre-wrap' }}>
            {lang === 'vi' ? selected.body_vi : selected.body_en}
          </div>
          {(lang === 'vi' ? selected.tags_vi : selected.tags_en || []).length > 0 && (
            <div style={{ display: 'flex', gap: 8, marginTop: 32, flexWrap: 'wrap' }}>
              {(lang === 'vi' ? selected.tags_vi : selected.tags_en || []).map(tg => <Tag key={tg}>{tg}</Tag>)}
            </div>
          )}
        </section>
      </div>
    );
  }

  return (
    <div className="page">
      <section className="section">
        <Eyebrow>{t('Blog', 'Blog')}</Eyebrow>
        <h2>{t('Chia sẻ từ Rinpoche', "From Rinpoche's Desk")}</h2>
        <p className="lede">
          {t(
            'Những suy tư, pháp ngữ ngắn và thông điệp từ Khenpo Shedup Ogen Kalsang Rinpoche.',
            'Reflections, short dharma teachings, and messages from Khenpo Shedup Ogen Kalsang Rinpoche.'
          )}
        </p>

        {posts.length === 0 ? (
          <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--ink-500)' }}>
            <div style={{ fontFamily: 'var(--f-serif)', fontStyle: 'italic', fontSize: 28, color: 'var(--gold-600)', marginBottom: 16 }}>ॐ</div>
            <div style={{ fontFamily: 'var(--f-mono)', fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              {t('Chưa có bài viết nào', 'No posts yet')}
            </div>
          </div>
        ) : (
          <div className="grid-2" style={{ marginTop: 40, gap: 32 }}>
            {posts.map((post) => (
              <article key={post.id} className="card" style={{ cursor: 'pointer', overflow: 'hidden' }} onClick={() => setSelected(post)}>
                {post.imageUrl && (
                  <div style={{ aspectRatio: '16/9', overflow: 'hidden' }}>
                    <img src={post.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </div>
                )}
                <div style={{ padding: '24px 28px' }}>
                  <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--gold-700)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
                    {new Date(post.createdAt).toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <h3 style={{ color: 'var(--maroon-800)', marginBottom: 10 }}>{lang === 'vi' ? post.title_vi : post.title_en}</h3>
                  <p style={{ color: 'var(--ink-700)', fontSize: 14, lineHeight: 1.7, margin: '0 0 16px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                    {lang === 'vi' ? post.body_vi : post.body_en}
                  </p>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {(lang === 'vi' ? post.tags_vi : post.tags_en || []).slice(0, 3).map(tg => <Tag key={tg}>{tg}</Tag>)}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// ===================================================================
// DONATE / CONTACT PAGE
// ===================================================================
function DonatePage() {
  const { t, lang } = useT();
  return (
    <div className="page">
      <section className="section">
        <Eyebrow>{t('Cúng dường · Liên hệ', 'Donate · Contact')}</Eyebrow>
        <h2>{t('Hộ trì Pháp bảo', 'Support the Dharma')}</h2>
        <p className="lede">
          {t(
            'Mỗi đóng góp hỗ trợ hoạt động giảng dạy, dịch kinh, in ấn pháp bảo và các khóa nhập thất của Rinpoche.',
            'Every contribution supports teaching activities, translations, publication of dharma texts, and retreats.'
          )}
        </p>
        <div className="grid-3" style={{ marginTop: 48 }}>
          {OFFERINGS(lang).map((o, i) => (
            <div key={i} className="card" style={{ padding: 28 }}>
              <h3 style={{ color: 'var(--maroon-800)', marginBottom: 8 }}>{o.title}</h3>
              <p style={{ color: 'var(--ink-700)', fontSize: 14, margin: '0 0 16px' }}>{o.desc}</p>
              <button className="btn btn-ghost" style={{ width: '100%' }}>{t('Cúng dường', 'Donate')} →</button>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="section">
        <Eyebrow>{t('Liên hệ', 'Contact')}</Eyebrow>
        <h2>{t('Kết nối với chúng tôi', 'Get in touch')}</h2>
        <div className="grid-2" style={{ marginTop: 40, gap: 32 }}>
          <div className="card" style={{ padding: 32 }}>
            <h3 style={{ color: 'var(--maroon-800)', marginBottom: 16 }}>{t('Địa chỉ', 'Address')}</h3>
            <p style={{ color: 'var(--ink-700)', lineHeight: 1.8 }}>
              Samye Memorial Buddhist Vihara<br />
              Kathmandu, Nepal
            </p>
          </div>
          <div className="card" style={{ padding: 32 }}>
            <h3 style={{ color: 'var(--maroon-800)', marginBottom: 16 }}>{t('Mạng xã hội', 'Social media')}</h3>
            <p style={{ color: 'var(--ink-700)', lineHeight: 1.8 }}>
              YouTube · Facebook<br />
              {t('Theo dõi để nhận thông tin mới nhất.', 'Follow for the latest updates.')}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

// Expose to other scripts
export { HomePage, LineagePage, KhenpoPage, TeachingPage, ProjectPage, BlogPage, DonatePage, ForumPage };
