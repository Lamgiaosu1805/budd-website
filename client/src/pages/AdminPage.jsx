// ============================================================
// ADMIN - CMS Management Page
// Protected: requires admin login
// ============================================================
import React, { useState as adminUseState } from 'react';
import { useT } from '../contexts/LanguageContext.jsx';
import { useCMS } from '../contexts/CMSContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

function AdminTab({ label, active, onClick }) {
  return (
    <button
      className="admin-tab"
      onClick={onClick}
      style={{
        background: active ? 'var(--maroon-700)' : 'transparent',
        color: active ? 'var(--cream-100)' : 'var(--ink-500)',
        border: 'none',
        padding: '12px 22px',
        fontFamily: 'var(--f-mono)',
        fontSize: 12,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        borderBottom: active ? '2px solid var(--gold-500)' : '2px solid transparent',
      }}
    >{label}</button>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label>{label}</label>
      {children}
    </div>
  );
}

function EventEditor({ event, onSave, onCancel, onDelete }) {
  const { t } = useT();
  const [form, setForm] = adminUseState(event || {
    day: '', monthShort_vi: '', monthShort_en: '',
    month_vi: '', month_en: '',
    date_vi: '', date_en: '',
    title_vi: '', title_en: '',
    desc_vi: '', desc_en: '',
    type_vi: '', type_en: '',
    duration_vi: '', duration_en: '',
    location: '',
    live: false,
    attendees_vi: '', attendees_en: '',
    imageSlotId: 'event-img-' + Date.now(),
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="admin-editor">
      <h3 style={{ marginBottom: 18 }}>{event ? t('Sửa sự kiện', 'Edit event') : t('Thêm sự kiện mới', 'Add new event')}</h3>

      <div className="admin-form-grid" style={{ gap: 14 }}>
        <Field label={t('Tiêu đề (Tiếng Việt)', 'Title (Vietnamese)')}>
          <input className="input" value={form.title_vi} onChange={e => set('title_vi', e.target.value)} />
        </Field>
        <Field label={t('Tiêu đề (English)', 'Title (English)')}>
          <input className="input" value={form.title_en} onChange={e => set('title_en', e.target.value)} />
        </Field>
        <Field label={t('Mô tả ngắn (VI)', 'Short description (VI)')}>
          <textarea className="textarea" style={{ minHeight: 70 }} value={form.desc_vi} onChange={e => set('desc_vi', e.target.value)}></textarea>
        </Field>
        <Field label={t('Mô tả ngắn (EN)', 'Short description (EN)')}>
          <textarea className="textarea" style={{ minHeight: 70 }} value={form.desc_en} onChange={e => set('desc_en', e.target.value)}></textarea>
        </Field>
        <Field label={t('Ngày (số)', 'Day (number)')}>
          <input className="input" value={form.day} onChange={e => set('day', e.target.value)} />
        </Field>
        <Field label={t('Tháng (VI: "Tháng 6 · 2026")', 'Month (EN: "June · 2026")')}>
          <div style={{ display: 'flex', gap: 8 }}>
            <input className="input" placeholder="VI" value={form.month_vi} onChange={e => set('month_vi', e.target.value)} />
            <input className="input" placeholder="EN" value={form.month_en} onChange={e => set('month_en', e.target.value)} />
          </div>
        </Field>
        <Field label={t('Tháng viết tắt (TH06 / JUN)', 'Month abbrev (TH06 / JUN)')}>
          <div style={{ display: 'flex', gap: 8 }}>
            <input className="input" placeholder="VI" value={form.monthShort_vi} onChange={e => set('monthShort_vi', e.target.value)} />
            <input className="input" placeholder="EN" value={form.monthShort_en} onChange={e => set('monthShort_en', e.target.value)} />
          </div>
        </Field>
        <Field label={t('Ngày đầy đủ (VI / EN)', 'Full date (VI / EN)')}>
          <div style={{ display: 'flex', gap: 8 }}>
            <input className="input" placeholder="15.06 — 22.06" value={form.date_vi} onChange={e => set('date_vi', e.target.value)} />
            <input className="input" placeholder="Jun 15 — 22" value={form.date_en} onChange={e => set('date_en', e.target.value)} />
          </div>
        </Field>
        <Field label={t('Loại (VI / EN)', 'Type (VI / EN)')}>
          <div style={{ display: 'flex', gap: 8 }}>
            <input className="input" placeholder="Nhập thất" value={form.type_vi} onChange={e => set('type_vi', e.target.value)} />
            <input className="input" placeholder="Retreat" value={form.type_en} onChange={e => set('type_en', e.target.value)} />
          </div>
        </Field>
        <Field label={t('Thời lượng (VI / EN)', 'Duration (VI / EN)')}>
          <div style={{ display: 'flex', gap: 8 }}>
            <input className="input" placeholder="7 ngày" value={form.duration_vi} onChange={e => set('duration_vi', e.target.value)} />
            <input className="input" placeholder="7 days" value={form.duration_en} onChange={e => set('duration_en', e.target.value)} />
          </div>
        </Field>
        <Field label={t('Địa điểm', 'Location')}>
          <input className="input" value={form.location} onChange={e => set('location', e.target.value)} />
        </Field>
        <Field label={t('Số người tham dự (tùy chọn)', 'Attendees (optional)')}>
          <div style={{ display: 'flex', gap: 8 }}>
            <input className="input" placeholder="120/150 hành giả" value={form.attendees_vi} onChange={e => set('attendees_vi', e.target.value)} />
            <input className="input" placeholder="120/150 practitioners" value={form.attendees_en} onChange={e => set('attendees_en', e.target.value)} />
          </div>
        </Field>
      </div>

      <div style={{ marginTop: 8, marginBottom: 18 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <input type="checkbox" checked={form.live} onChange={e => set('live', e.target.checked)} />
          <span style={{ textTransform: 'none', letterSpacing: 0, fontSize: 14, fontFamily: 'var(--f-sans)', color: 'var(--ink-700)' }}>
            {t('Sự kiện có Livestream trực tiếp', 'Event has live streaming')}
          </span>
        </label>
      </div>

      <div style={{ display: 'flex', gap: 10, paddingTop: 16, borderTop: '1px solid var(--cream-300)' }}>
        <button className="btn btn-primary" onClick={() => onSave(form)}>
          {event ? t('Lưu thay đổi', 'Save changes') : t('Thêm sự kiện', 'Add event')}
        </button>
        <button className="btn btn-ghost" onClick={onCancel}>{t('Hủy', 'Cancel')}</button>
        {event && onDelete && (
          <button
            className="btn"
            style={{ marginLeft: 'auto', color: 'var(--maroon-700)', border: '1px solid var(--maroon-700)' }}
            onClick={() => {
              if (confirm(t('Xóa sự kiện này?', 'Delete this event?'))) onDelete(event.id);
            }}
          >{t('Xóa', 'Delete')}</button>
        )}
      </div>
    </div>
  );
}

function LectureEditor({ lecture, onSave, onCancel, onDelete }) {
  const { t } = useT();
  const [form, setForm] = adminUseState(lecture || {
    title_vi: '', title_en: '',
    teacher: 'Khenpo Rinpoche',
    duration: '',
    format: 'VIDEO',
    level_vi: 'Nhập môn', level_en: 'Beginner',
    tags_vi: [], tags_en: [],
    imageSlotId: 'lec-img-' + Date.now(),
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setTags = (lang, str) => set(`tags_${lang}`, str.split(',').map(s => s.trim()).filter(Boolean));

  return (
    <div className="admin-editor">
      <h3 style={{ marginBottom: 18 }}>{lecture ? t('Sửa bài giảng', 'Edit teaching') : t('Thêm bài giảng mới', 'Add new teaching')}</h3>

      <div className="admin-form-grid" style={{ gap: 14 }}>
        <Field label={t('Tiêu đề (VI)', 'Title (VI)')}>
          <input className="input" value={form.title_vi} onChange={e => set('title_vi', e.target.value)} />
        </Field>
        <Field label={t('Tiêu đề (EN)', 'Title (EN)')}>
          <input className="input" value={form.title_en} onChange={e => set('title_en', e.target.value)} />
        </Field>
        <Field label={t('Giảng sư', 'Teacher')}>
          <input className="input" value={form.teacher} onChange={e => set('teacher', e.target.value)} />
        </Field>
        <Field label={t('Thời lượng / Số trang', 'Duration / pages')}>
          <input className="input" placeholder="1h 42m / 128 pages" value={form.duration} onChange={e => set('duration', e.target.value)} />
        </Field>
        <Field label={t('Định dạng', 'Format')}>
          <select className="input" value={form.format} onChange={e => set('format', e.target.value)}>
            <option>VIDEO</option><option>AUDIO</option><option>PDF</option>
          </select>
        </Field>
        <Field label={t('Cấp độ (VI / EN)', 'Level (VI / EN)')}>
          <div style={{ display: 'flex', gap: 8 }}>
            <select className="input" value={form.level_vi} onChange={e => set('level_vi', e.target.value)}>
              <option>Nhập môn</option><option>Trung cấp</option><option>Cao cấp</option>
            </select>
            <select className="input" value={form.level_en} onChange={e => set('level_en', e.target.value)}>
              <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
            </select>
          </div>
        </Field>
        <Field label={t('Thẻ VI (cách dấu phẩy)', 'Tags VI (comma-separated)')}>
          <input className="input" value={(form.tags_vi || []).join(', ')} onChange={e => setTags('vi', e.target.value)} />
        </Field>
        <Field label={t('Thẻ EN (cách dấu phẩy)', 'Tags EN (comma-separated)')}>
          <input className="input" value={(form.tags_en || []).join(', ')} onChange={e => setTags('en', e.target.value)} />
        </Field>
      </div>

      <div style={{ display: 'flex', gap: 10, paddingTop: 16, borderTop: '1px solid var(--cream-300)', marginTop: 8 }}>
        <button className="btn btn-primary" onClick={() => onSave(form)}>
          {lecture ? t('Lưu thay đổi', 'Save changes') : t('Thêm bài giảng', 'Add teaching')}
        </button>
        <button className="btn btn-ghost" onClick={onCancel}>{t('Hủy', 'Cancel')}</button>
        {lecture && onDelete && (
          <button
            className="btn"
            style={{ marginLeft: 'auto', color: 'var(--maroon-700)', border: '1px solid var(--maroon-700)' }}
            onClick={() => {
              if (confirm(t('Xóa bài giảng này?', 'Delete this teaching?'))) onDelete(lecture.id);
            }}
          >{t('Xóa', 'Delete')}</button>
        )}
      </div>
    </div>
  );
}

function TeacherEventEditor({ event, onSave, onCancel, onDelete }) {
  const { t } = useT();
  const [form, setForm] = adminUseState(event || {
    year: new Date().getFullYear().toString(),
    season_vi: '', season_en: '',
    title_vi: '', title_en: '',
    attendees_vi: '', attendees_en: '',
    location: '',
    imageSlotId: 'te-img-' + Date.now(),
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const SEASONS_VI = ['XUÂN', 'HẠ', 'THU', 'ĐÔNG'];
  const SEASONS_EN = ['SPRING', 'SUMMER', 'AUTUMN', 'WINTER'];

  return (
    <div className="admin-editor">
      <h3 style={{ marginBottom: 18 }}>
        {event ? t('Sửa hoạt động hoằng pháp', 'Edit dharma activity') : t('Thêm hoạt động hoằng pháp', 'Add dharma activity')}
      </h3>

      <div className="admin-form-grid" style={{ gap: 14 }}>
        <Field label={t('Tiêu đề (VI)', 'Title (VI)')}>
          <input className="input" value={form.title_vi} onChange={e => set('title_vi', e.target.value)} />
        </Field>
        <Field label={t('Tiêu đề (EN)', 'Title (EN)')}>
          <input className="input" value={form.title_en} onChange={e => set('title_en', e.target.value)} />
        </Field>
        <Field label={t('Năm', 'Year')}>
          <input className="input" placeholder="2024" value={form.year} onChange={e => set('year', e.target.value)} />
        </Field>
        <Field label={t('Mùa (VI / EN)', 'Season (VI / EN)')}>
          <div style={{ display: 'flex', gap: 8 }}>
            <select className="input" value={form.season_vi} onChange={e => set('season_vi', e.target.value)}>
              <option value="">--</option>
              {SEASONS_VI.map(s => <option key={s}>{s}</option>)}
            </select>
            <select className="input" value={form.season_en} onChange={e => set('season_en', e.target.value)}>
              <option value="">--</option>
              {SEASONS_EN.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </Field>
        <Field label={t('Số người tham dự (VI)', 'Attendees (VI)')}>
          <input className="input" placeholder="180 hành giả" value={form.attendees_vi} onChange={e => set('attendees_vi', e.target.value)} />
        </Field>
        <Field label={t('Số người tham dự (EN)', 'Attendees (EN)')}>
          <input className="input" placeholder="180 practitioners" value={form.attendees_en} onChange={e => set('attendees_en', e.target.value)} />
        </Field>
        <Field label={t('Địa điểm', 'Location')}>
          <input className="input" style={{ gridColumn: '1 / -1' }} value={form.location} onChange={e => set('location', e.target.value)} />
        </Field>
      </div>

      <div style={{ display: 'flex', gap: 10, paddingTop: 16, borderTop: '1px solid var(--cream-300)', marginTop: 8 }}>
        <button className="btn btn-primary" onClick={() => onSave(form)}>
          {event ? t('Lưu thay đổi', 'Save changes') : t('Thêm hoạt động', 'Add activity')}
        </button>
        <button className="btn btn-ghost" onClick={onCancel}>{t('Hủy', 'Cancel')}</button>
        {event && onDelete && (
          <button
            className="btn"
            style={{ marginLeft: 'auto', color: 'var(--maroon-700)', border: '1px solid var(--maroon-700)' }}
            onClick={() => {
              if (confirm(t('Xóa hoạt động này?', 'Delete this activity?'))) onDelete(event.id);
            }}
          >{t('Xóa', 'Delete')}</button>
        )}
      </div>
    </div>
  );
}

function AdminPage({ goto }) {
  const { t, lang } = useT();
  const cms = useCMS();
  const { user, logout } = useAuth();
  const [tab, setTab] = adminUseState('events');
  const [editing, setEditing] = adminUseState(null); // {kind: 'event'|'lecture'|'te', item: obj|null}

  if (!cms) return <div className="section"><h2>CMS not loaded</h2></div>;

  const closeEditor = () => setEditing(null);

  return (
    <div className="page admin-page">
      <section className="section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div className="eyebrow">{t('Trang quản trị · Admin Console', 'Admin Console')}</div>
            <h2>{t('Quản lý nội dung', 'Content Management')}</h2>
            <p style={{ color: 'var(--ink-700)', maxWidth: 720, fontSize: 14 }}>
              {t(
                'Dữ liệu lưu trên MongoDB. Thay đổi áp dụng ngay cho mọi người truy cập trang.',
                'Data is stored in MongoDB. Changes apply immediately for all visitors.'
              )}
            </p>
            {user && (
              <div style={{ marginTop: 8, fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--ink-500)' }}>
                {t('Đang đăng nhập với', 'Signed in as')} <strong>{user.email}</strong> ({user.role})
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost" onClick={() => cms.refresh()} style={{ fontSize: 12 }}>
              {t('Tải lại', 'Refresh')}
            </button>
            <button className="btn btn-ghost" onClick={logout} style={{ fontSize: 12 }}>
              {t('Đăng xuất', 'Logout')}
            </button>
          </div>
        </div>

        <div style={{ borderBottom: '1px solid var(--cream-300)', marginTop: 32 }}>
          <AdminTab label={t(`Sự kiện · ${cms.events.length}`, `Events · ${cms.events.length}`)} active={tab === 'events'} onClick={() => { setTab('events'); setEditing(null); }} />
          <AdminTab label={t(`Bài giảng · ${cms.lectures.length}`, `Teachings · ${cms.lectures.length}`)} active={tab === 'lectures'} onClick={() => { setTab('lectures'); setEditing(null); }} />
          <AdminTab label={t(`Hoằng pháp · ${cms.teacherEvents.length}`, `Activities · ${cms.teacherEvents.length}`)} active={tab === 'teacherEvents'} onClick={() => { setTab('teacherEvents'); setEditing(null); }} />
        </div>

        {/* EVENTS TAB */}
        {tab === 'events' && (
          <div style={{ paddingTop: 28 }}>
            {!editing && (
              <>
                <button className="btn btn-primary" onClick={() => setEditing({ kind: 'event', item: null })} style={{ marginBottom: 20 }}>
                  + {t('Thêm sự kiện', 'Add event')}
                </button>
                <div>
                  {cms.events.map(e => (
                    <div key={e.id} className="admin-row">
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 4 }}>
                          <span className="tag" style={{ background: 'var(--cream-200)' }}>{lang === 'vi' ? e.type_vi : e.type_en}</span>
                          {e.live && <span className="tag live">Live</span>}
                          <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--ink-500)' }}>{lang === 'vi' ? e.date_vi : e.date_en}</span>
                        </div>
                        <div style={{ fontFamily: 'var(--f-serif)', fontSize: 18, color: 'var(--maroon-800)' }}>{lang === 'vi' ? e.title_vi : e.title_en}</div>
                        <div style={{ fontSize: 12, color: 'var(--ink-500)', marginTop: 2 }}>{e.location}</div>
                      </div>
                      <button className="btn btn-ghost" onClick={() => setEditing({ kind: 'event', item: e })}>{t('Sửa', 'Edit')}</button>
                    </div>
                  ))}
                </div>
              </>
            )}
            {editing && editing.kind === 'event' && (
              <EventEditor
                event={editing.item}
                onSave={(form) => { editing.item ? cms.updateEvent(editing.item.id, form) : cms.addEvent(form); closeEditor(); }}
                onCancel={closeEditor}
                onDelete={(id) => { cms.deleteEvent(id); closeEditor(); }}
              />
            )}
          </div>
        )}

        {/* LECTURES TAB */}
        {tab === 'lectures' && (
          <div style={{ paddingTop: 28 }}>
            {!editing && (
              <>
                <button className="btn btn-primary" onClick={() => setEditing({ kind: 'lecture', item: null })} style={{ marginBottom: 20 }}>
                  + {t('Thêm bài giảng', 'Add teaching')}
                </button>
                <div>
                  {cms.lectures.map(l => (
                    <div key={l.id} className="admin-row">
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 4 }}>
                          <span className="tag" style={{ background: 'var(--cream-200)' }}>{l.format}</span>
                          <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--ink-500)' }}>{l.teacher} · {l.duration} · {lang === 'vi' ? l.level_vi : l.level_en}</span>
                        </div>
                        <div style={{ fontFamily: 'var(--f-serif)', fontSize: 18, color: 'var(--maroon-800)' }}>{lang === 'vi' ? l.title_vi : l.title_en}</div>
                      </div>
                      <button className="btn btn-ghost" onClick={() => setEditing({ kind: 'lecture', item: l })}>{t('Sửa', 'Edit')}</button>
                    </div>
                  ))}
                </div>
              </>
            )}
            {editing && editing.kind === 'lecture' && (
              <LectureEditor
                lecture={editing.item}
                onSave={(form) => { editing.item ? cms.updateLecture(editing.item.id, form) : cms.addLecture(form); closeEditor(); }}
                onCancel={closeEditor}
                onDelete={(id) => { cms.deleteLecture(id); closeEditor(); }}
              />
            )}
          </div>
        )}

        {/* TEACHER EVENTS TAB */}
        {tab === 'teacherEvents' && (
          <div style={{ paddingTop: 28 }}>
            {!editing && (
              <>
                <button className="btn btn-primary" onClick={() => setEditing({ kind: 'te', item: null })} style={{ marginBottom: 20 }}>
                  + {t('Thêm hoạt động hoằng pháp', 'Add dharma activity')}
                </button>
                <div>
                  {cms.teacherEvents.map(e => (
                    <div key={e.id} className="admin-row">
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 4 }}>
                          <span className="tag gold">{e.year} · {lang === 'vi' ? e.season_vi : e.season_en}</span>
                        </div>
                        <div style={{ fontFamily: 'var(--f-serif)', fontSize: 18, color: 'var(--maroon-800)' }}>{lang === 'vi' ? e.title_vi : e.title_en}</div>
                        <div style={{ fontSize: 12, color: 'var(--ink-500)', marginTop: 2 }}>{e.location}</div>
                      </div>
                      <button className="btn btn-ghost" onClick={() => setEditing({ kind: 'te', item: e })}>{t('Sửa', 'Edit')}</button>
                    </div>
                  ))}
                </div>
              </>
            )}
            {editing && editing.kind === 'te' && (
              <TeacherEventEditor
                event={editing.item}
                onSave={(form) => { editing.item ? cms.updateTeacherEvent(editing.item.id, form) : cms.addTeacherEvent(form); closeEditor(); }}
                onCancel={closeEditor}
                onDelete={(id) => { cms.deleteTeacherEvent(id); closeEditor(); }}
              />
            )}
          </div>
        )}

        <div style={{ marginTop: 60, padding: 24, background: 'var(--paper)', border: '1px dashed var(--gold-600)', borderRadius: 4 }}>
          <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, letterSpacing: '0.2em', color: 'var(--gold-700)', textTransform: 'uppercase', marginBottom: 8 }}>
            {t('Hướng dẫn ảnh thật', 'Image upload guide')}
          </div>
          <p style={{ fontSize: 14, color: 'var(--ink-700)', margin: 0 }}>
            {t(
              'Để thay placeholder bằng ảnh thật: mở trang công khai (Sự kiện / Bài giảng / Sư phụ), kéo-thả file ảnh vào các ô có viền nét đứt. Ảnh sẽ được lưu lại tự động.',
              'To replace placeholders with real photos: open the public pages (Events / Teachings / Rinpoche), drag-and-drop images into the dashed slots. Images are saved automatically in your browser.'
            )}
          </p>
        </div>
      </section>
    </div>
  );
}

export default AdminPage;
