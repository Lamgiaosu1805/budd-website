// ============================================================
// PAGES - All 7 modules · Bilingual (VI / EN)
// Khenpo Shedup Ogen Kalsang Rinpoche · Personal Website
// ============================================================
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useT } from './contexts/LanguageContext.jsx';
import { useCMS } from './contexts/CMSContext.jsx';

// ------------ Shared helpers ------------
const Eyebrow = ({ children, style }) => <div className="eyebrow" style={style}>{children}</div>;
const Silk = ({ label, variant = "", style }) => (
  <div className={`silk ${variant}`} style={style}>{label}</div>
);
const Tag = ({ children, variant = "" }) => <span className={`tag ${variant}`}>{children}</span>;

// Image slot wrapper with fallback to silk placeholder
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
          {(cms ? cms.events.map(e => cmsEventToDisplay(e, lang)) : UPCOMING_EVENTS(lang)).slice(0, 3).map((e, i) => (
            <article key={e.id || i} className="card event-card">
              <div style={{ aspectRatio: '16/10', overflow: 'hidden' }}>
                <PhotoSlot
                  id={e.imageSlotId || `home-event-${i}`}
                  placeholder={t('Kéo ảnh sự kiện vào đây', 'Drop event photo here')}
                  variant={i === 1 ? 'gold' : ''}
                />
              </div>
              <div className="event-card-body">
                <div className="date">{e.date}</div>
                <h3>{e.title}</h3>
                <p>{e.desc}</p>
                <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                  {e.live && <Tag variant="live">{t('Trực tuyến', 'Livestream')}</Tag>}
                  <Tag>{e.type}</Tag>
                </div>
                <div className="meta">
                  <span>{e.duration}</span>
                  <span>{e.location}</span>
                </div>
              </div>
            </article>
          ))}
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
            {(cms ? cms.lectures.map(l => cmsLectureToDisplay(l, lang)) : LECTURES(lang)).slice(0, 4).map((l, i) => (
              <div key={l.id || i} className="lecture-row">
                <div style={{ aspectRatio: 1 }}>
                  <PhotoSlot
                    id={l.imageSlotId || `home-lec-${i}`}
                    placeholder={t('Ảnh', 'Image')}
                    variant={i % 2 ? 'gold' : ''}
                  />
                </div>
                <div className="info">
                  <h4>{l.title}</h4>
                  <div className="meta">{l.teacher} · {l.duration} · {l.format}</div>
                </div>
                <div className="actions">
                  <button className="play-btn" aria-label="Play">▶</button>
                </div>
              </div>
            ))}
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

// ===================================================================
// 3. TEACHER - Khenpo Shedup Ogen Kalsang Rinpoche
// ===================================================================
function TeacherPage() {
  const { t, lang } = useT();
  const cms = useCMS();
  const [portraitLit, setPortraitLit] = useState(false);
  const [playing, setPlaying] = useState(false);

  return (
    <div className="page">
      <section className="section">
        <Eyebrow>{t('Phần 03 · Bậc Thầy soi đường', 'Section 03 · The Teacher')}</Eyebrow>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 60, alignItems: 'start' }} className="teacher-grid">
          <div style={{ position: 'relative' }}>
            <div
              className={portraitLit ? 'lit' : ''}
              onClick={() => setPortraitLit(!portraitLit)}
              style={{ aspectRatio: '3/4', overflow: 'hidden', border: '1px solid var(--gold-600)', transition: 'all 0.6s', cursor: 'pointer', filter: portraitLit ? 'brightness(1.15) saturate(1.1)' : 'none', boxShadow: portraitLit ? '0 0 60px rgba(201,163,92,0.4)' : 'none' }}
            >
              <PhotoSlot
                id="teacher-portrait"
                shape="rect"
                placeholder={t('Kéo ảnh chân dung Rinpoche vào đây', 'Drop Rinpoche portrait here')}
              />
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
                'Khenpo Shedup Ogen Kalsang Rinpoche là một vị thầy và học giả của dòng Dudjom Tersar — một trong những dòng truyền thừa quan trọng của Phật giáo Mật tông Tây Tạng. Từ thuở thiếu thời, Rinpoche đã xuất gia và bắt đầu tu học tại Samye Memorial Institute dưới sự dẫn dắt của vị thầy của mình, H.E. Yeshe Sangpo Rinpoche.',
                'Khenpo Shedup Ogen Kalsang Rinpoche is a teacher and scholar of the Dudjom Tersar lineage — one of the principal lineages of Tibetan Vajrayāna Buddhism. From a young age, Rinpoche began his monastic studies and practice at the Samye Memorial Institute under the guidance of his root teacher, H.E. Yeshe Sangpo Rinpoche.'
              )}
            </p>
            <p style={{ color: 'var(--ink-700)', marginBottom: 16 }}>
              {t(
                'Hiện nay Rinpoche cư trú tại Kathmandu, Nepal, và giảng dạy bằng ba ngôn ngữ: Tạng, Nepal và Anh ngữ, với học trò đến từ nhiều quốc gia trên thế giới. Tại Samye Memorial Buddhist Vihara, Rinpoche truyền giảng các môn học cốt lõi của Phật giáo Đại thừa và Mật tông: Luật tạng (Vinaya), A-tỳ-đạt-ma (Abhidharma), Bát-nhã Ba-la-mật-đa (Prajñāpāramitā), Trung quán (Madhyamaka), Guḥyagarbha Tantra và bộ ba "Thất ý dụ" (Resting trilogy) của Longchen Rabjam.',
                'Rinpoche currently resides in Kathmandu, Nepal, and teaches in Tibetan, Nepali, and English to students from across the globe. At the Samye Memorial Buddhist Vihara, he instructs his monastic students in the foundational subjects of Mahāyāna and Vajrayāna: Vinaya, Abhidharma, Prajñāpāramitā, Madhyamaka, the Guḥyagarbha Tantra, and the trilogy of Longchen Rabjam\'s Resting works.'
              )}
            </p>
            <p style={{ color: 'var(--ink-700)', marginBottom: 32 }}>
              {t(
                'Trong những năm gần đây, Rinpoche đã thực hiện các chuyến hoằng pháp dài ngày tại Việt Nam — giảng dạy, truyền pháp và thực hiện các nghi quỹ Mật tông vì lợi ích cho tất cả chúng sinh. Tại Nepal, Rinpoche từng được mời làm khách mời chính trong lễ kỷ niệm Đản sinh Đức Phật lần thứ 2566 tại chùa Ashoka Mangal Bodhi Mahayana Gumba (Patan, Nepal).',
                'In recent years, Rinpoche has undertaken extended teaching tours in Vietnam — sharing the dharma, performing Vajrayāna rituals, and conducting activities for the benefit of all beings. In Nepal, he served as chief guest at the 2566th Buddha Jayanti celebration held at Ashoka Mangal Bodhi Mahayana Gumba in Patan city.'
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

      {/* Teaching subjects */}
      <section className="section" style={{ background: 'var(--paper)', maxWidth: 'none' }}>
        <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
          <Eyebrow>{t('Môn học truyền giảng', 'Subjects taught')}</Eyebrow>
          <h2>{t('Các bộ môn Rinpoche giảng dạy', 'Core curriculum at Samye Memorial')}</h2>
          <div className="grid-3" style={{ marginTop: 40 }}>
            {SUBJECTS(lang).map((p, i) => (
              <div key={i} className="card" style={{ padding: 32 }}>
                <div style={{ fontFamily: 'var(--f-serif)', fontSize: 48, color: 'var(--gold-500)', lineHeight: 1, marginBottom: 16, fontStyle: 'italic' }}>{p.glyph}</div>
                <h3 style={{ fontSize: 22, color: 'var(--maroon-800)', marginBottom: 4 }}>{p.title}</h3>
                <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--gold-700)', letterSpacing: '0.15em', marginBottom: 12 }}>{p.sanskrit}</div>
                <p style={{ color: 'var(--ink-700)', fontSize: 14, margin: 0 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Activities & events */}
      <section className="section">
        <Eyebrow>{t('Hoạt động đáng nhớ', 'Notable activities')}</Eyebrow>
        <h2>{t('Hoằng pháp toàn cầu', 'Worldwide dharma activities')}</h2>
        <div style={{ marginTop: 40 }}>
          {(cms ? cms.teacherEvents.map(e => cmsTeacherEventToDisplay(e, lang)) : TEACHER_EVENTS(lang)).map((e, i) => (
            <div key={e.id || i} className="event-row" style={{ gridTemplateColumns: '100px 80px 1fr auto' }}>
              <div className="date-block">
                <div className="day">{e.year}</div>
                <div className="month">{e.season}</div>
              </div>
              <div className="event-row-img" style={{ aspectRatio: 1, overflow: 'hidden', borderRadius: 2 }}>
                <PhotoSlot
                  id={e.imageSlotId || `te-img-${i}`}
                  placeholder={t('Ảnh', 'Photo')}
                  variant={i % 2 ? 'gold' : ''}
                />
              </div>
              <div>
                <h3>{e.title}</h3>
                <div className="meta">{e.attendees} · {e.location}</div>
              </div>
              <button className="btn btn-ghost">{t('Xem lại', 'View')} →</button>
            </div>
          ))}
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

  const allLectures = cms ? cms.lectures.map(l => cmsLectureToDisplay(l, lang)) : LECTURES(lang);
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
          {filtered.map((l, i) => (
            <div key={l.id || i} className="lecture-row">
              <div style={{ aspectRatio: 1 }}>
                <PhotoSlot
                  id={l.imageSlotId || `lec-img-${i}`}
                  placeholder={t('Ảnh', 'Image')}
                  variant={i % 3 === 0 ? '' : i % 3 === 1 ? 'gold' : ''}
                />
              </div>
              <div className="info">
                <h4>{l.title}</h4>
                <div className="meta">{l.teacher} · {l.duration} · {l.format} · {l.level}</div>
                <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                  {l.tags.slice(0, 2).map(tg => <Tag key={tg}>{tg}</Tag>)}
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
function EventsPage() {
  const { t, lang } = useT();
  const cms = useCMS();
  const [view, setView] = useState(t('Năm', 'Year'));
  const [registerEvent, setRegisterEvent] = useState(null);
  const [regForm, setRegForm] = useState({ name: '', email: '', phone: '', note: '' });
  const [regDone, setRegDone] = useState(false);

  const events = cms ? cms.events.map(e => cmsEventToDisplay(e, lang)) : UPCOMING_EVENTS(lang);
  const grouped = useMemo(() => {
    const g = {};
    events.forEach(e => { (g[e.month] = g[e.month] || []).push(e); });
    return g;
  }, [lang, cms?.events]);

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

        {/* Live now */}
        <div style={{ background: 'var(--maroon-900)', padding: 28, borderRadius: 4, border: '1px solid var(--gold-700)', marginBottom: 50, color: 'var(--cream-100)', display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: 24, alignItems: 'center' }} className="live-now">
          <Silk label={t('TRỰC TIẾP', 'LIVE')} style={{ aspectRatio: 1 }} />
          <div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'center' }}>
              <span className="live-badge">{t('đang phát', 'on air')}</span>
              <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, letterSpacing: '0.15em', color: 'var(--gold-400)' }}>
                {t('2,847 NGƯỜI ĐANG XEM', '2,847 WATCHING')}
              </span>
            </div>
            <h3 style={{ fontSize: 24, color: 'var(--gold-300)', marginBottom: 4 }}>
              {t('Pháp thoại tuần · Ngöndro — Pháp tu căn bản', 'Weekly teaching · Ngöndro — The Preliminary Practices')}
            </h3>
            <p style={{ color: 'var(--cream-200)', margin: 0, fontSize: 14 }}>
              Khenpo Shedup Ogen Kalsang Rinpoche · {t('Còn ~ 42 phút', '~42 min remaining')}
            </p>
          </div>
          <button className="btn btn-gold">{t('Tham gia ngay', 'Join now')} →</button>
        </div>

        <div className="calendar-tabs">
          {(lang === 'vi' ? ['Năm', 'Tháng', 'Tuần'] : ['Year', 'Month', 'Week']).map(v => (
            <button key={v} className={view === v ? 'active' : ''} onClick={() => setView(v)}>{v}</button>
          ))}
        </div>

        <div className="timeline-events">
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
                    <PhotoSlot
                      id={e.imageSlotId || `evt-img-${i}`}
                      placeholder={t('Ảnh', 'Photo')}
                      variant={i % 2 ? 'gold' : ''}
                    />
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
  const [candles, setCandles] = useState(SAMPLE_CANDLES(lang));

  useEffect(() => { setCandles(SAMPLE_CANDLES(lang)); }, [lang]);

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

        {/* Activities to support */}
        <div style={{ marginBottom: 80 }}>
          <Eyebrow>{t('Hoạt động cần hộ trì', 'Activities needing support')}</Eyebrow>
          <h2 style={{ fontSize: 32 }}>{t('Cúng dường có địa chỉ', 'Where your support goes')}</h2>
          <div className="grid-3" style={{ marginTop: 30 }}>
            {SUPPORT_NEEDS(lang).map((s, i) => (
              <div key={i} className="card" style={{ padding: 28 }}>
                <Tag variant="gold">{s.tag}</Tag>
                <h3 style={{ fontSize: 22, color: 'var(--maroon-800)', margin: '14px 0 8px' }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--ink-700)', marginBottom: 16 }}>{s.desc}</p>
                <div style={{ height: 6, background: 'var(--cream-200)', borderRadius: 2, marginBottom: 8, overflow: 'hidden' }}>
                  <div style={{ width: s.progress + '%', height: '100%', background: 'linear-gradient(90deg, var(--maroon-700), var(--gold-500))' }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontFamily: 'var(--f-mono)', color: 'var(--ink-500)' }}>
                  <span>{s.progress}% {t('hoàn thành', 'complete')}</span>
                  <span>{s.donors} {t('người hộ trì', 'supporters')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prayer wall */}
        <Eyebrow>{t('Tường cầu nguyện', 'Prayer wall')}</Eyebrow>
        <h2 style={{ fontSize: 32 }}>{t('Lời nguyện cộng đồng', 'Community prayers')}</h2>
        <div className="prayer-wall">
          {PRAYER_NOTES(lang).map((p, i) => (
            <div key={i} className="prayer-note">
              {p.text}
              <div className="meta">
                <span>— {p.author}</span>
                <span className="blessing">✦ {p.blessings} {t('hồi hướng', 'dedications')}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ===================================================================
// 7. FORUM & Q&A
// ===================================================================
function ForumPage() {
  const { t, lang } = useT();
  const filters = lang === 'vi'
    ? ['Mới nhất', 'Chưa trả lời', 'Rinpoche đã trả lời', 'Phổ biến nhất']
    : ['Latest', 'Unanswered', 'Answered by Rinpoche', 'Most popular'];
  const [filter, setFilter] = useState(filters[0]);
  const [showAskModal, setShowAskModal] = useState(false);
  const [askForm, setAskForm] = useState({ name: '', topic: '', question: '' });
  const [askDone, setAskDone] = useState(false);
  const [threads, setThreads] = useState(null); // null = dùng dữ liệu FORUM_THREADS mặc định

  useEffect(() => { setFilter(filters[0]); }, [lang]);

  const handleAskSubmit = () => {
    if (!askForm.question.trim()) return;
    const newThread = {
      avatar: askForm.name ? askForm.name[0].toUpperCase() : '❓',
      title: askForm.question.slice(0, 80) + (askForm.question.length > 80 ? '…' : ''),
      preview: askForm.question,
      author: askForm.name ? `@${askForm.name.toLowerCase().replace(/\s/g, '')}` : '@anonymous',
      time: t('vừa xong', 'just now'),
      replies: 0, views: 1, answered: false,
    };
    setThreads(prev => [newThread, ...(prev || FORUM_THREADS(lang))]);
    setAskDone(true);
    setTimeout(() => { setShowAskModal(false); setAskDone(false); setAskForm({ name: '', topic: '', question: '' }); }, 2200);
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

        {/* Live Q&A */}
        <div style={{ background: 'var(--maroon-900)', padding: 28, borderRadius: 4, border: '1px solid var(--gold-700)', marginBottom: 50, color: 'var(--cream-100)', display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
              <span className="live-badge">{t('live Q&A', 'live Q&A')}</span>
              <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--gold-400)' }}>
                {t('SẮP DIỄN RA · 19:00 THỨ 5', 'UPCOMING · 7:00 PM THURSDAY')}
              </span>
            </div>
            <h3 style={{ fontSize: 24, color: 'var(--gold-300)' }}>
              {t('Vấn đáp tuần · Rinpoche trực tiếp giải đáp', 'Weekly Q&A · Direct answers from Rinpoche')}
            </h3>
            <p style={{ color: 'var(--cream-200)', margin: '4px 0 0', fontSize: 14 }}>
              {t('Gửi câu hỏi trước · 247 câu đã gửi', 'Submit questions in advance · 247 received')}
            </p>
          </div>
          <button className="btn btn-gold" onClick={() => setShowAskModal(true)}>{t('Đặt câu hỏi', 'Ask a question')} →</button>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
          <div className="filter-bar" style={{ margin: 0 }}>
            {filters.map(f => (
              <button key={f} className={`filter-chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
            ))}
          </div>
          <button className="btn btn-primary" onClick={() => setShowAskModal(true)}>+ {t('Đặt câu hỏi mới', 'New question')}</button>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
          {topics.map(tp => (
            <button key={tp} className="tag" style={{ cursor: 'pointer', padding: '6px 14px' }}>#{tp}</button>
          ))}
        </div>

        {/* Forum threads */}
        <div>
          {(threads || FORUM_THREADS(lang)).map((tr, i) => (
            <div key={i} className="forum-row">
              <div className="avatar">{tr.avatar}</div>
              <div className="body">
                <h4>{tr.title}</h4>
                <div className="preview">{tr.preview}</div>
                <div className="stats">
                  <span>{tr.author}</span>
                  <span>{tr.time}</span>
                  <span>{tr.replies} {t('trả lời', 'replies')}</span>
                  <span>{tr.views} {t('lượt xem', 'views')}</span>
                  {tr.answered && (
                    <span className={tr.byTeacher ? 'teacher' : 'answered'}>
                      ● {tr.byTeacher ? t('RINPOCHE ĐÃ TRẢ LỜI', 'ANSWERED BY RINPOCHE') : t('ĐÃ GIẢI ĐÁP', 'ANSWERED')}
                    </span>
                  )}
                </div>
              </div>
              <div style={{ alignSelf: 'center', textAlign: 'right' }}>
                {tr.merit && (
                  <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--gold-700)', letterSpacing: '0.1em' }}>
                    ✦ +{tr.merit} {t('CÔNG ĐỨC', 'MERIT')}
                  </div>
                )}
              </div>
            </div>
          ))}
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
                  <h3 style={{ marginBottom: 20 }}>{t('Hỏi về Phật pháp & Mật tông', 'Ask about the dharma & Vajrayāna')}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div>
                      <label>{t('Tên của bạn', 'Your name')}</label>
                      <input className="input" value={askForm.name} onChange={e => setAskForm(f => ({ ...f, name: e.target.value }))} placeholder={t('Pháp danh hoặc họ tên…', 'Dharma name or full name…')} />
                    </div>
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
                      disabled={!askForm.question.trim()}
                      style={{ marginTop: 4, opacity: !askForm.question.trim() ? 0.5 : 1 }}
                    >
                      {t('Đăng câu hỏi', 'Post question')} →
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Community experiences */}
        <div style={{ marginTop: 80 }}>
          <Eyebrow>{t('Chia sẻ hành trình', 'Practice journeys')}</Eyebrow>
          <h2 style={{ fontSize: 32 }}>{t('Nhật ký tu hành', 'Practitioners share')}</h2>
          <div className="grid-2" style={{ marginTop: 32 }}>
            {EXPERIENCES(lang).map((e, i) => (
              <div key={i} className="card" style={{ padding: 28 }}>
                <div style={{ display: 'flex', gap: 14, marginBottom: 14, alignItems: 'center' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, var(--gold-500), var(--maroon-700))', display: 'grid', placeItems: 'center', color: 'var(--cream-100)', fontFamily: 'var(--f-serif)', fontSize: 18 }}>{e.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--maroon-800)' }}>{e.author}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-500)' }}>{e.role} · {e.time}</div>
                  </div>
                </div>
                <p style={{ fontFamily: 'var(--f-serif)', fontStyle: 'italic', fontSize: 17, color: 'var(--ink-700)', lineHeight: 1.6 }}>"{e.text}"</p>
                <div style={{ display: 'flex', gap: 14, fontSize: 12, color: 'var(--ink-500)', fontFamily: 'var(--f-mono)', paddingTop: 14, borderTop: '1px solid var(--cream-300)' }}>
                  <span>✦ {e.likes} {t('đồng cảm', 'resonances')}</span>
                  <span>● {e.comments} {t('bình luận', 'comments')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ===================================================================
// SHARED DATA (bilingual)
// ===================================================================
const MODULES = (lang) => lang === 'vi' ? [
  { key: 'home', title: 'Cánh cửa Trí tuệ', desc: 'Khám phá sự kiện, bài giảng, lễ khóa và lời dạy hôm nay.' },
  { key: 'tantra', title: 'Mật tông & Dudjom Tersar', desc: 'Lịch sử, pháp khí, mantra và phương pháp hành trì.' },
  { key: 'teacher', title: 'Khenpo Rinpoche', desc: 'Tiểu sử, dòng truyền thừa và pháp ngữ của Rinpoche.' },
  { key: 'lectures', title: 'Thư viện Trí tuệ', desc: 'Video, audio, kinh sách PDF — phân loại theo căn cơ.' },
  { key: 'events', title: 'Sự kiện & Khóa tu', desc: 'Pháp hội, nhập thất, livestream và đăng ký tham dự.' },
  { key: 'prayer', title: 'Cầu nguyện trực tuyến', desc: 'Đàn tràng số, thắp đèn tâm, cúng dường và hồi hướng.' },
  { key: 'forum', title: 'Diễn đàn · Tự viện số', desc: 'Hỏi đáp Phật pháp, chia sẻ trải nghiệm tu hành.' }
] : [
  { key: 'home', title: 'Gateway to Wisdom', desc: 'Explore events, teachings, retreats, and the daily reflection.' },
  { key: 'tantra', title: 'Vajrayāna & Dudjom Tersar', desc: 'History, ritual objects, mantras, and methods of practice.' },
  { key: 'teacher', title: 'Khenpo Rinpoche', desc: "Biography, lineage, and Rinpoche's teachings." },
  { key: 'lectures', title: 'Wisdom Library', desc: 'Video, audio, and PDF — organized by level and topic.' },
  { key: 'events', title: 'Events & Retreats', desc: 'Dharma talks, retreats, livestreams, and registration.' },
  { key: 'prayer', title: 'Online Prayer', desc: 'Digital altar, butter lamps, offerings, and dedication.' },
  { key: 'forum', title: 'Forum · Digital Monastery', desc: 'Ask questions and share practice experience.' }
];

const UPCOMING_EVENTS = (lang) => lang === 'vi' ? [
  { day: '15', monthShort: 'TH06', month: 'Tháng 6 · 2026', date: '15.06 — 22.06', title: 'Khóa nhập thất Vajrasattva 7 ngày', desc: 'Thanh tịnh nghiệp chướng qua thực hành Vajrasattva 100 âm thần chú.', type: 'Nhập thất', duration: '7 ngày', location: 'Samye Memorial, Kathmandu', live: false, image: 'KHÓA NHẬP THẤT', attendees: '120/150 hành giả' },
  { day: '21', monthShort: 'TH06', month: 'Tháng 6 · 2026', date: '21.06 · 19:00', title: 'Pháp thoại "Ngöndro — Pháp tu căn bản Dudjom Tersar"', desc: 'Rinpoche giảng giải 4 quán tưởng tiền hành và 5 pháp tu chánh hành.', type: 'Pháp thoại', duration: '2 giờ', location: 'Trực tuyến · Zoom', live: true, image: 'PHÁP THOẠI' },
  { day: '03', monthShort: 'TH07', month: 'Tháng 7 · 2026', date: '03.07 · 20:00', title: 'Đêm tụng Lục Tự Đại Minh Chú', desc: 'Đồng tu mantra Quán Thế Âm, hồi hướng công đức cho toàn pháp giới.', type: 'Lễ hội', duration: '3 giờ', location: 'Online + Hà Nội', live: true, image: 'ĐÊM TỤNG MANTRA' },
  { day: '12', monthShort: 'TH07', month: 'Tháng 7 · 2026', date: '12.07 — 14.07', title: 'Khóa Guḥyagarbha Tantra — Cao cấp', desc: 'Truyền giảng tantra cốt lõi của dòng Nyingma cho học trò có Empowerment.', type: 'Khóa cao cấp', duration: '3 ngày', location: 'TP.HCM', live: false, image: 'GUHYAGARBHA' },
] : [
  { day: '15', monthShort: 'JUN', month: 'June · 2026', date: 'Jun 15 — 22', title: '7-Day Vajrasattva Purification Retreat', desc: 'Purifying karmic obscurations through the 100-syllable mantra.', type: 'Retreat', duration: '7 days', location: 'Samye Memorial, Kathmandu', live: false, image: 'RETREAT', attendees: '120/150 practitioners' },
  { day: '21', monthShort: 'JUN', month: 'June · 2026', date: 'Jun 21 · 7 PM', title: 'Teaching: "Ngöndro — Dudjom Tersar Preliminaries"', desc: 'Rinpoche explains the four contemplations and five main practices.', type: 'Teaching', duration: '2 hours', location: 'Online · Zoom', live: true, image: 'TEACHING' },
  { day: '03', monthShort: 'JUL', month: 'July · 2026', date: 'Jul 3 · 8 PM', title: 'Avalokiteśvara Mantra Recitation Evening', desc: 'Group recitation of the six-syllable mantra and dedication of merit.', type: 'Ceremony', duration: '3 hours', location: 'Online + Hanoi', live: true, image: 'MANTRA EVENING' },
  { day: '12', monthShort: 'JUL', month: 'July · 2026', date: 'Jul 12 — 14', title: 'Guḥyagarbha Tantra — Advanced Teachings', desc: 'Core tantra of the Nyingma lineage for empowered students.', type: 'Advanced', duration: '3 days', location: 'Ho Chi Minh City', live: false, image: 'GUHYAGARBHA' },
];

const LECTURES = (lang) => lang === 'vi' ? [
  { title: 'Ngöndro Dudjom Tersar — Bốn quán tưởng tiền hành', teacher: 'Khenpo Rinpoche', duration: '1h 42m', format: 'VIDEO', level: 'Trung cấp', tags: ['Kinh điển', 'Quán tưởng'] },
  { title: 'Lục Tự Đại Minh Chú — Ý nghĩa và hành trì', teacher: 'Khenpo Rinpoche', duration: '58m', format: 'AUDIO', level: 'Nhập môn', tags: ['Thần chú'] },
  { title: 'Bardo Thodol — Sáu trạng thái trung ấm', teacher: 'Khenpo Rinpoche', duration: '2h 15m', format: 'VIDEO', level: 'Cao cấp', tags: ['Bardo'] },
  { title: 'Bát-nhã Tâm Kinh — Bản dịch & chú giải', teacher: 'Khenpo Rinpoche', duration: '128 trang', format: 'PDF', level: 'Nhập môn', tags: ['Kinh điển', 'Sách PDF'] },
  { title: 'Dzogchen — Tự tánh trống rỗng', teacher: 'Khenpo Rinpoche', duration: '3h 04m', format: 'VIDEO', level: 'Cao cấp', tags: ['Dzogchen'] },
  { title: 'Nghi quỹ Vajrasattva 100 âm', teacher: 'Khenpo Rinpoche', duration: '46m', format: 'AUDIO', level: 'Trung cấp', tags: ['Thần chú', 'Lễ khóa'] },
] : [
  { title: 'Dudjom Tersar Ngöndro — The Four Contemplations', teacher: 'Khenpo Rinpoche', duration: '1h 42m', format: 'VIDEO', level: 'Intermediate', tags: ['Sūtra', 'Visualization'] },
  { title: 'Oṃ Maṇi Padme Hūṃ — Meaning and Practice', teacher: 'Khenpo Rinpoche', duration: '58m', format: 'AUDIO', level: 'Beginner', tags: ['Mantra'] },
  { title: 'Bardo Thödol — The Six Intermediate States', teacher: 'Khenpo Rinpoche', duration: '2h 15m', format: 'VIDEO', level: 'Advanced', tags: ['Bardo'] },
  { title: 'Heart Sūtra — Translation & Commentary', teacher: 'Khenpo Rinpoche', duration: '128 pages', format: 'PDF', level: 'Beginner', tags: ['Sūtra', 'PDF Book'] },
  { title: 'Dzogchen — The Empty Nature of Mind', teacher: 'Khenpo Rinpoche', duration: '3h 04m', format: 'VIDEO', level: 'Advanced', tags: ['Dzogchen'] },
  { title: '100-Syllable Vajrasattva Sādhana', teacher: 'Khenpo Rinpoche', duration: '46m', format: 'AUDIO', level: 'Intermediate', tags: ['Mantra', 'Ritual'] },
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

const TEACHER_EVENTS = (lang) => lang === 'vi' ? [
  { year: '2024', season: 'XUÂN', title: 'Đại lễ Phật Đản lần thứ 2566 · Khách mời chính', attendees: 'Cộng đồng Phật tử Nepal', location: 'Ashoka Mangal Bodhi Mahayana Gumba, Patan, Nepal' },
  { year: '2024', season: 'HẠ', title: 'Khóa nhập thất Vajrasattva 21 ngày', attendees: '180 hành giả', location: 'Samye Memorial Buddhist Vihara, Kathmandu' },
  { year: '2023', season: 'THU', title: 'Chuyến hoằng pháp Việt Nam (một tháng)', attendees: 'Cộng đồng học trò Việt Nam', location: 'Hà Nội · TP.HCM · Đà Nẵng' },
  { year: '2023', season: 'ĐÔNG', title: 'Pháp hội Ngöndro Dudjom Tersar — 7 đêm', attendees: '2,100 hành giả', location: 'Trực tuyến · 12 quốc gia' },
] : [
  { year: '2024', season: 'SPRING', title: 'Chief guest at the 2566th Buddha Jayanti', attendees: 'Nepali Buddhist community', location: 'Ashoka Mangal Bodhi Mahayana Gumba, Patan, Nepal' },
  { year: '2024', season: 'SUMMER', title: '21-Day Vajrasattva Retreat', attendees: '180 practitioners', location: 'Samye Memorial Buddhist Vihara, Kathmandu' },
  { year: '2023', season: 'AUTUMN', title: 'Month-long teaching tour in Vietnam', attendees: 'Vietnamese student community', location: 'Hanoi · Ho Chi Minh City · Da Nang' },
  { year: '2023', season: 'WINTER', title: 'Dudjom Tersar Ngöndro teachings — 7 nights', attendees: '2,100 practitioners', location: 'Online · 12 countries' },
];

const OFFERINGS = (lang) => lang === 'vi' ? [
  { title: 'Cúng dường Tam Bảo', desc: 'Hộ trì Phật-Pháp-Tăng, duy trì các hoạt động tự viện.' },
  { title: 'In ấn kinh sách', desc: 'Phát hành miễn phí kinh sách Mật tông đến Phật tử.' },
  { title: 'Hỗ trợ khóa nhập thất', desc: 'Lo chi phí ăn ở cho hành giả tại Samye Memorial.' },
  { title: 'Cúng dường Rinpoche', desc: 'Tịnh tài hộ trì các chuyến hoằng pháp của Rinpoche.' },
  { title: 'Vật phẩm pháp khí', desc: 'Hương đèn, hoa quả, nến cho đàn tràng.' },
  { title: 'Tùy hỉ tùy duyên', desc: 'Tùy hỉ cúng dường vào quỹ chung Pháp hội.' },
] : [
  { title: 'Three Jewels Offering', desc: 'Support the Buddha, Dharma, and Sangha — sustaining the monastery.' },
  { title: 'Print sacred texts', desc: 'Sponsor free distribution of dharma books to students.' },
  { title: 'Retreat support', desc: 'Cover accommodation and meals for practitioners at Samye Memorial.' },
  { title: 'Offering to Rinpoche', desc: "Support Rinpoche's dharma activities and teaching tours." },
  { title: 'Altar offerings', desc: 'Incense, candles, flowers, and fruit for ceremonial altars.' },
  { title: 'General donation', desc: 'Contribute as you wish to the general dharma fund.' },
];

const SUPPORT_NEEDS = (lang) => lang === 'vi' ? [
  { tag: 'IN KINH', title: 'In 2,000 cuốn Bát Nhã Tâm Kinh', desc: 'Bản dịch song ngữ Việt-Phạn, phát hành miễn phí trong Pháp hội Phật Đản 2026.', progress: 72, donors: 248 },
  { tag: 'KHÓA TU', title: 'Khóa nhập thất Vajrasattva 7 ngày', desc: 'Hộ trì chi phí ăn ở cho 150 hành giả tại Samye Memorial Vihara.', progress: 54, donors: 89 },
  { tag: 'LIVESTREAM', title: 'Hệ thống livestream cho Pháp hội', desc: 'Nâng cấp thiết bị thu phát để 12 quốc gia có thể đồng dự.', progress: 38, donors: 156 },
] : [
  { tag: 'PRINTING', title: 'Print 2,000 copies of the Heart Sūtra', desc: 'Bilingual Vietnamese-Sanskrit edition, distributed free at Buddha Jayanti 2026.', progress: 72, donors: 248 },
  { tag: 'RETREAT', title: '7-Day Vajrasattva Retreat support', desc: 'Cover accommodation for 150 practitioners at Samye Memorial Vihara.', progress: 54, donors: 89 },
  { tag: 'LIVESTREAM', title: 'Livestream upgrade for global teachings', desc: 'Upgrade broadcast equipment so students in 12 countries can join live.', progress: 38, donors: 156 },
];

const SAMPLE_CANDLES = (lang) => lang === 'vi' ? [
  { name: 'Cho cha mẹ', time: '2 phút trước' },
  { name: 'Cho chúng sinh', time: '5 phút trước' },
  { name: 'Cho người đã khuất', time: '8 phút trước' },
  { name: 'Cho Rinpoche & Tăng đoàn', time: '12 phút trước' },
  { name: 'Cho gia đình', time: '15 phút trước' },
  { name: 'Nguyện thế giới an lành', time: '18 phút trước' },
] : [
  { name: 'For my parents', time: '2 min ago' },
  { name: 'For all beings', time: '5 min ago' },
  { name: 'For the departed', time: '8 min ago' },
  { name: 'For Rinpoche & Sangha', time: '12 min ago' },
  { name: 'For my family', time: '15 min ago' },
  { name: 'For world peace', time: '18 min ago' },
];

const PRAYER_NOTES = (lang) => lang === 'vi' ? [
  { text: 'Nguyện cho mẹ con sớm khỏi bệnh, thân tâm an lạc, trí tuệ sáng tỏ trên con đường Phật pháp.', author: 'Phật tử Diệu Hương', blessings: 42 },
  { text: 'Cầu nguyện cho ông nội sớm vãng sanh Tịnh độ, nương theo bản nguyện Đức Phật A Di Đà.', author: 'Phật tử Minh Tâm', blessings: 87 },
  { text: 'Nguyện đem công đức tu tập tuần này hồi hướng cho tất cả chúng sinh đang chịu khổ đau.', author: 'Đệ tử Quảng Thiện', blessings: 156 },
  { text: 'Cầu cho con đường tu học của bản thân tinh tấn không thối chuyển, sớm phát Bồ Đề tâm chân thật.', author: 'Phật tử An Lạc', blessings: 38 },
  { text: 'Nguyện hồi hướng công đức cho chư hương linh cô hồn vô chủ, sớm được siêu thoát.', author: 'Phật tử Diệu Pháp', blessings: 124 },
  { text: 'Tri ân Rinpoche đã đến Việt Nam truyền pháp. Nguyện Ngài trường thọ, sự nghiệp hoằng pháp viên mãn.', author: 'Phật tử Tịnh Tâm', blessings: 309 },
] : [
  { text: 'May my mother recover from illness and find peace of body and mind, with bright wisdom on the dharma path.', author: 'Dieu Huong', blessings: 42 },
  { text: 'Praying that my grandfather attains rebirth in the Pure Land through the compassion of Amitābha Buddha.', author: 'Minh Tam', blessings: 87 },
  { text: 'May the merit of this week\'s practice be dedicated to all beings suffering anywhere in the world.', author: 'Quang Thien', blessings: 156 },
  { text: 'May my own dharma path continue without obstacles, may I generate genuine bodhicitta swiftly.', author: 'An Lac', blessings: 38 },
  { text: 'Dedicating merit to all wandering spirits without anchor — may they find liberation.', author: 'Dieu Phap', blessings: 124 },
  { text: 'Deep gratitude to Rinpoche for coming to Vietnam to teach the dharma. May Rinpoche have long life and complete activities.', author: 'Tinh Tam', blessings: 309 },
];

const FORUM_THREADS = (lang) => lang === 'vi' ? [
  { avatar: '智', title: 'Mới bắt đầu Ngöndro — nên bắt đầu từ đâu?', preview: 'Con là Phật tử mới, vừa nhận quy y với Rinpoche. Xin hướng dẫn cách bắt đầu hành trì Ngöndro Dudjom Tersar đúng pháp.', author: '@quangthien', time: '2 giờ trước', replies: 12, views: 384, answered: true, byTeacher: true, merit: 8 },
  { avatar: '心', title: 'Sự khác nhau giữa quán tưởng và tưởng tượng?', preview: 'Khi quán tưởng Bổn Tôn, cảm giác như đang tưởng tượng. Vậy có khác biệt gì giữa hai trạng thái này không?', author: '@dieutam', time: '6 giờ trước', replies: 18, views: 612, answered: true, byTeacher: false, merit: 12 },
  { avatar: '法', title: 'Khi nhập thất bị tán loạn, làm thế nào để định trở lại?', preview: 'Sau ngày thứ 3 nhập thất, tâm con bắt đầu tán loạn, vọng tưởng kéo đến liên tục. Xin chia sẻ kinh nghiệm các thầy ạ.', author: '@minhtam', time: '12 giờ trước', replies: 34, views: 1820, answered: true, byTeacher: true, merit: 24 },
  { avatar: '蓮', title: 'Có nên kết hợp Mật tông với Tịnh độ tông không?', preview: 'Con vốn tu Tịnh độ niệm Phật A Di Đà, gần đây thấy Mật tông cũng rất hợp duyên. Hai pháp môn có xung đột không?', author: '@lienhoa', time: '1 ngày trước', replies: 22, views: 945, answered: false },
  { avatar: '空', title: 'Hỏi về 6 thân trung ấm (Bardo) trong Tử Thư Tây Tạng', preview: 'Đang đọc Bardo Thodol qua bài giảng của Rinpoche, có nhiều chỗ khó hiểu về 6 trạng thái trung ấm. Mong được thảo luận.', author: '@khongtinh', time: '2 ngày trước', replies: 41, views: 2340, answered: true, byTeacher: true, merit: 36 },
  { avatar: '慧', title: 'Cách bảo quản kim cương chử và chuông đúng pháp?', preview: 'Con mới được tặng một bộ pháp khí, xin hỏi cách lễ khóa và bảo quản đúng truyền thống Dudjom Tersar.', author: '@tuelinh', time: '3 ngày trước', replies: 9, views: 421, answered: true, byTeacher: false, merit: 5 },
] : [
  { avatar: '智', title: 'Just starting Ngöndro — where to begin?', preview: "I'm a new student, just received refuge from Rinpoche. Please guide me on how to begin Dudjom Tersar Ngöndro practice correctly.", author: '@quangthien', time: '2h ago', replies: 12, views: 384, answered: true, byTeacher: true, merit: 8 },
  { avatar: '心', title: 'Difference between visualization and imagination?', preview: 'When visualizing the deity, it feels like imagination. Is there a real difference between these two states?', author: '@dieutam', time: '6h ago', replies: 18, views: 612, answered: true, byTeacher: false, merit: 12 },
  { avatar: '法', title: 'Distracted in retreat — how to return to concentration?', preview: 'After day 3 of retreat, my mind started wandering, with constant thoughts arising. Please share your experience.', author: '@minhtam', time: '12h ago', replies: 34, views: 1820, answered: true, byTeacher: true, merit: 24 },
  { avatar: '蓮', title: 'Can I combine Vajrayāna with Pure Land practice?', preview: 'I have been practicing Pure Land with Amitābha recitation. Recently I have strong karmic connection with Vajrayāna. Do they conflict?', author: '@lienhoa', time: '1 day ago', replies: 22, views: 945, answered: false },
  { avatar: '空', title: 'Questions about the Six Bardos in the Bardo Thödol', preview: "I'm studying Bardo Thödol through Rinpoche's teachings, but have difficulty with the six intermediate states. Hoping to discuss.", author: '@khongtinh', time: '2 days ago', replies: 41, views: 2340, answered: true, byTeacher: true, merit: 36 },
  { avatar: '慧', title: 'How to properly care for vajra and bell?', preview: 'I just received a set of ritual implements. Please explain the proper ceremonial care according to Dudjom Tersar tradition.', author: '@tuelinh', time: '3 days ago', replies: 9, views: 421, answered: true, byTeacher: false, merit: 5 },
];

const EXPERIENCES = (lang) => lang === 'vi' ? [
  { avatar: '蓮', author: 'Diệu Liên', role: 'Phật tử · 3 năm hành trì', time: '5 ngày trước', text: 'Sau 21 ngày nhập thất Vajrasattva dưới sự hướng dẫn của Rinpoche, lần đầu trong đời con thực sự nếm trải vị an lạc khi tâm thanh tịnh không vọng tưởng.', likes: 248, comments: 32 },
  { avatar: '智', author: 'Quảng Trí', role: 'Hành giả · 8 năm', time: '1 tuần trước', text: 'Chuyến hoằng pháp của Rinpoche tại Việt Nam năm ngoái đã làm tan biến nhiều nghi vấn con ôm nhiều năm. Xin tri ân Rinpoche và toàn thể Tăng đoàn Samye Memorial.', likes: 412, comments: 58 },
] : [
  { avatar: '蓮', author: 'Dieu Lien', role: 'Student · 3 years', time: '5 days ago', text: "After 21 days of Vajrasattva retreat under Rinpoche's guidance, for the first time in my life I truly tasted the peace of a mind clear of conceptual thought.", likes: 248, comments: 32 },
  { avatar: '智', author: 'Quang Tri', role: 'Practitioner · 8 years', time: '1 week ago', text: "Rinpoche's teaching tour in Vietnam last year dissolved many doubts I had carried for years. Deep gratitude to Rinpoche and the entire Samye Memorial sangha.", likes: 412, comments: 58 },
];

// Expose to other scripts
export { HomePage, TantraPage, TeacherPage, LecturesPage, EventsPage, PrayerPage, ForumPage };
