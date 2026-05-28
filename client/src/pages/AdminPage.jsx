// ============================================================
// ADMIN - CMS Management Page
// Protected: requires admin login
// ============================================================
import React, { useState, useEffect } from 'react';
import { useT } from '../contexts/LanguageContext.jsx';
import { useCMS } from '../contexts/CMSContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { api } from '../lib/api.js';

// ── Shared UI ────────────────────────────────────────────────
function AdminTab({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
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
    }}>{label}</button>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', marginBottom: 4 }}>{label}</label>
      {children}
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--ink-400)', fontFamily: 'var(--f-mono)', fontSize: 12, letterSpacing: '0.12em' }}>
      {message}
    </div>
  );
}

// ── Image uploader ────────────────────────────────────────────
function ImageUploader({ value, onChange }) {
  const { t } = useT();
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setErr(null);
    try {
      const { url } = await api.uploadImage(file);
      onChange(url);
    } catch (error) {
      setErr(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {value && (
        <div style={{ marginBottom: 8, position: 'relative', display: 'inline-block' }}>
          <img src={value} alt="" style={{ width: 140, height: 90, objectFit: 'cover', display: 'block', borderRadius: 2, border: '1px solid var(--cream-300)' }} />
          <button
            onClick={() => onChange('')}
            style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', width: 20, height: 20, borderRadius: '50%', cursor: 'pointer', fontSize: 12, lineHeight: '20px', padding: 0, textAlign: 'center' }}
          >×</button>
        </div>
      )}
      <label style={{ cursor: 'pointer', display: 'inline-block' }}>
        <div className="btn btn-ghost" style={{ fontSize: 12, pointerEvents: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          {uploading ? '⏳ Đang tải...' : (value ? t('Đổi ảnh', 'Change image') : t('Tải ảnh lên', 'Upload image'))}
        </div>
        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} disabled={uploading} />
      </label>
      {err && <div style={{ color: '#c0392b', fontSize: 12, marginTop: 4 }}>{err}</div>}
    </div>
  );
}

// ── Event editor ──────────────────────────────────────────────
function EventEditor({ event, onSave, onCancel, onDelete }) {
  const { t } = useT();
  const [form, setForm] = useState(event || {
    day: '', monthShort_vi: '', monthShort_en: '',
    month_vi: '', month_en: '',
    date_vi: '', date_en: '',
    title_vi: '', title_en: '',
    desc_vi: '', desc_en: '',
    type_vi: '', type_en: '',
    duration_vi: '', duration_en: '',
    location: '', live: false,
    attendees_vi: '', attendees_en: '',
    imageUrl: '',
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="admin-editor">
      <h3 style={{ marginBottom: 18 }}>{event ? t('Sửa sự kiện', 'Edit event') : t('Thêm sự kiện mới', 'Add new event')}</h3>
      <div className="admin-form-grid" style={{ gap: 14 }}>
        <Field label={t('Tiêu đề (VI)', 'Title (VI)')}>
          <input className="input" value={form.title_vi} onChange={e => set('title_vi', e.target.value)} />
        </Field>
        <Field label={t('Tiêu đề (EN)', 'Title (EN)')}>
          <input className="input" value={form.title_en} onChange={e => set('title_en', e.target.value)} />
        </Field>
        <Field label={t('Mô tả ngắn (VI)', 'Description (VI)')}>
          <textarea className="textarea" style={{ minHeight: 70 }} value={form.desc_vi} onChange={e => set('desc_vi', e.target.value)} />
        </Field>
        <Field label={t('Mô tả ngắn (EN)', 'Description (EN)')}>
          <textarea className="textarea" style={{ minHeight: 70 }} value={form.desc_en} onChange={e => set('desc_en', e.target.value)} />
        </Field>
        <Field label={t('Ngày (số)', 'Day (number)')}>
          <input className="input" value={form.day} onChange={e => set('day', e.target.value)} />
        </Field>
        <Field label={t('Nhóm tháng (VI / EN)', 'Month group (VI / EN)')}>
          <div style={{ display: 'flex', gap: 8 }}>
            <input className="input" placeholder="Tháng 6 · 2026" value={form.month_vi} onChange={e => set('month_vi', e.target.value)} />
            <input className="input" placeholder="June · 2026" value={form.month_en} onChange={e => set('month_en', e.target.value)} />
          </div>
        </Field>
        <Field label={t('Tháng viết tắt (VI / EN)', 'Month abbrev (VI / EN)')}>
          <div style={{ display: 'flex', gap: 8 }}>
            <input className="input" placeholder="TH06" value={form.monthShort_vi} onChange={e => set('monthShort_vi', e.target.value)} />
            <input className="input" placeholder="JUN" value={form.monthShort_en} onChange={e => set('monthShort_en', e.target.value)} />
          </div>
        </Field>
        <Field label={t('Ngày đầy đủ (VI / EN)', 'Full date (VI / EN)')}>
          <div style={{ display: 'flex', gap: 8 }}>
            <input className="input" placeholder="15.06 — 22.06" value={form.date_vi} onChange={e => set('date_vi', e.target.value)} />
            <input className="input" placeholder="Jun 15 — 22" value={form.date_en} onChange={e => set('date_en', e.target.value)} />
          </div>
        </Field>
        <Field label={t('Loại sự kiện (VI / EN)', 'Event type (VI / EN)')}>
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
        <Field label={t('Số người tham dự (VI / EN)', 'Attendees (VI / EN)')}>
          <div style={{ display: 'flex', gap: 8 }}>
            <input className="input" placeholder="120 hành giả" value={form.attendees_vi} onChange={e => set('attendees_vi', e.target.value)} />
            <input className="input" placeholder="120 practitioners" value={form.attendees_en} onChange={e => set('attendees_en', e.target.value)} />
          </div>
        </Field>
      </div>
      <div style={{ marginTop: 8, marginBottom: 16 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <input type="checkbox" checked={form.live} onChange={e => set('live', e.target.checked)} />
          <span style={{ fontSize: 14, fontFamily: 'var(--f-sans)', color: 'var(--ink-700)' }}>
            {t('Sự kiện có Livestream', 'Event has livestream')}
          </span>
        </label>
      </div>
      <Field label={t('Ảnh sự kiện', 'Event image')}>
        <ImageUploader value={form.imageUrl} onChange={url => set('imageUrl', url)} />
      </Field>
      <div style={{ display: 'flex', gap: 10, paddingTop: 16, borderTop: '1px solid var(--cream-300)', marginTop: 8 }}>
        <button className="btn btn-primary" onClick={() => onSave(form)}>
          {event ? t('Lưu thay đổi', 'Save changes') : t('Thêm sự kiện', 'Add event')}
        </button>
        <button className="btn btn-ghost" onClick={onCancel}>{t('Hủy', 'Cancel')}</button>
        {event && onDelete && (
          <button className="btn" style={{ marginLeft: 'auto', color: 'var(--maroon-700)', border: '1px solid var(--maroon-700)' }}
            onClick={() => { if (confirm(t('Xóa sự kiện này?', 'Delete this event?'))) onDelete(event.id); }}>
            {t('Xóa', 'Delete')}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Lecture editor ────────────────────────────────────────────
function LectureEditor({ lecture, onSave, onCancel, onDelete }) {
  const { t } = useT();
  const [form, setForm] = useState(lecture || {
    title_vi: '', title_en: '',
    teacher: 'Khenpo Rinpoche',
    duration: '',
    format: 'VIDEO',
    level_vi: 'Nhập môn', level_en: 'Beginner',
    tags_vi: [], tags_en: [],
    imageUrl: '',
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setTags = (lang, str) => set(`tags_${lang}`, str.split(',').map(s => s.trim()).filter(Boolean));

  return (
    <div className="admin-editor">
      <h3 style={{ marginBottom: 18 }}>{lecture ? t('Sửa bài giảng', 'Edit teaching') : t('Thêm bài giảng', 'Add teaching')}</h3>
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
      <Field label={t('Ảnh bài giảng', 'Teaching image')}>
        <ImageUploader value={form.imageUrl} onChange={url => set('imageUrl', url)} />
      </Field>
      <div style={{ display: 'flex', gap: 10, paddingTop: 16, borderTop: '1px solid var(--cream-300)', marginTop: 8 }}>
        <button className="btn btn-primary" onClick={() => onSave(form)}>
          {lecture ? t('Lưu thay đổi', 'Save changes') : t('Thêm bài giảng', 'Add teaching')}
        </button>
        <button className="btn btn-ghost" onClick={onCancel}>{t('Hủy', 'Cancel')}</button>
        {lecture && onDelete && (
          <button className="btn" style={{ marginLeft: 'auto', color: 'var(--maroon-700)', border: '1px solid var(--maroon-700)' }}
            onClick={() => { if (confirm(t('Xóa bài giảng này?', 'Delete this teaching?'))) onDelete(lecture.id); }}>
            {t('Xóa', 'Delete')}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Teacher event editor ──────────────────────────────────────
function TeacherEventEditor({ event, onSave, onCancel, onDelete }) {
  const { t } = useT();
  const [form, setForm] = useState(event || {
    year: new Date().getFullYear().toString(),
    season_vi: '', season_en: '',
    title_vi: '', title_en: '',
    attendees_vi: '', attendees_en: '',
    location: '',
    imageUrl: '',
    images: [],
    desc_vi: '', desc_en: '',
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
        <Field label={t('Số người tham dự (VI / EN)', 'Attendees (VI / EN)')}>
          <div style={{ display: 'flex', gap: 8 }}>
            <input className="input" placeholder="180 hành giả" value={form.attendees_vi} onChange={e => set('attendees_vi', e.target.value)} />
            <input className="input" placeholder="180 practitioners" value={form.attendees_en} onChange={e => set('attendees_en', e.target.value)} />
          </div>
        </Field>
        <Field label={t('Địa điểm', 'Location')}>
          <input className="input" style={{ gridColumn: '1 / -1' }} value={form.location} onChange={e => set('location', e.target.value)} />
        </Field>
      </div>
      <Field label={t('Mô tả chi tiết (VI)', 'Description (VI)')}>
        <textarea className="input" rows={4} style={{ resize: 'vertical', fontFamily: 'inherit' }} value={form.desc_vi} onChange={e => set('desc_vi', e.target.value)} />
      </Field>
      <Field label={t('Mô tả chi tiết (EN)', 'Description (EN)')}>
        <textarea className="input" rows={4} style={{ resize: 'vertical', fontFamily: 'inherit' }} value={form.desc_en} onChange={e => set('desc_en', e.target.value)} />
      </Field>
      <Field label={t('Ảnh đại diện (thumbnail)', 'Thumbnail image')}>
        <ImageUploader value={form.imageUrl} onChange={url => set('imageUrl', url)} />
      </Field>
      <Field label={t('Bộ ảnh chi tiết', 'Detail photo gallery')}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {(form.images || []).map((url, idx) => (
            <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <ImageUploader value={url} onChange={u => {
                  const imgs = [...(form.images || [])];
                  imgs[idx] = u;
                  set('images', imgs);
                }} />
              </div>
              <button className="btn" style={{ color: 'var(--maroon-700)', border: '1px solid var(--maroon-700)', padding: '4px 10px', flexShrink: 0 }}
                onClick={() => set('images', (form.images || []).filter((_, i) => i !== idx))}>
                {t('Xóa', 'Remove')}
              </button>
            </div>
          ))}
          <button className="btn btn-ghost" style={{ alignSelf: 'flex-start', marginTop: 4 }}
            onClick={() => set('images', [...(form.images || []), ''])}>
            + {t('Thêm ảnh', 'Add image')}
          </button>
        </div>
      </Field>
      <div style={{ display: 'flex', gap: 10, paddingTop: 16, borderTop: '1px solid var(--cream-300)', marginTop: 8 }}>
        <button className="btn btn-primary" onClick={() => onSave(form)}>
          {event ? t('Lưu thay đổi', 'Save changes') : t('Thêm hoạt động', 'Add activity')}
        </button>
        <button className="btn btn-ghost" onClick={onCancel}>{t('Hủy', 'Cancel')}</button>
        {event && onDelete && (
          <button className="btn" style={{ marginLeft: 'auto', color: 'var(--maroon-700)', border: '1px solid var(--maroon-700)' }}
            onClick={() => { if (confirm(t('Xóa hoạt động này?', 'Delete this activity?'))) onDelete(event.id); }}>
            {t('Xóa', 'Delete')}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Blog editor ───────────────────────────────────────────────
function BlogEditor({ post, onSave, onCancel, onDelete }) {
  const { t } = useT();
  const [form, setForm] = useState(post || {
    title_vi: '', title_en: '',
    body_vi: '', body_en: '',
    tags_vi: [], tags_en: [],
    imageUrl: '',
    published: true,
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setTags = (lang, str) => set(`tags_${lang}`, str.split(',').map(s => s.trim()).filter(Boolean));

  return (
    <div className="admin-editor">
      <h3 style={{ marginBottom: 18 }}>{post ? t('Sửa bài viết', 'Edit post') : t('Viết bài mới', 'New post')}</h3>
      <div className="admin-form-grid" style={{ gap: 14 }}>
        <Field label={t('Tiêu đề (VI)', 'Title (VI)')}>
          <input className="input" value={form.title_vi} onChange={e => set('title_vi', e.target.value)} />
        </Field>
        <Field label={t('Tiêu đề (EN)', 'Title (EN)')}>
          <input className="input" value={form.title_en} onChange={e => set('title_en', e.target.value)} />
        </Field>
        <Field label={t('Nội dung (VI)', 'Body (VI)')}>
          <textarea className="textarea" style={{ minHeight: 160, gridColumn: '1 / -1' }} value={form.body_vi} onChange={e => set('body_vi', e.target.value)} />
        </Field>
        <Field label={t('Nội dung (EN)', 'Body (EN)')}>
          <textarea className="textarea" style={{ minHeight: 160, gridColumn: '1 / -1' }} value={form.body_en} onChange={e => set('body_en', e.target.value)} />
        </Field>
        <Field label={t('Thẻ VI (cách dấu phẩy)', 'Tags VI (comma-separated)')}>
          <input className="input" value={(form.tags_vi || []).join(', ')} onChange={e => setTags('vi', e.target.value)} />
        </Field>
        <Field label={t('Thẻ EN (cách dấu phẩy)', 'Tags EN (comma-separated)')}>
          <input className="input" value={(form.tags_en || []).join(', ')} onChange={e => setTags('en', e.target.value)} />
        </Field>
      </div>
      <Field label={t('Ảnh bìa', 'Cover image')}>
        <ImageUploader value={form.imageUrl} onChange={url => set('imageUrl', url)} />
      </Field>
      <div style={{ marginTop: 8, marginBottom: 8 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <input type="checkbox" checked={form.published} onChange={e => set('published', e.target.checked)} />
          <span style={{ fontSize: 14, fontFamily: 'var(--f-sans)', color: 'var(--ink-700)' }}>
            {t('Công khai (hiển thị trên trang Blog)', 'Published (visible on Blog page)')}
          </span>
        </label>
      </div>
      <div style={{ display: 'flex', gap: 10, paddingTop: 16, borderTop: '1px solid var(--cream-300)', marginTop: 8 }}>
        <button className="btn btn-primary" onClick={() => onSave(form)}>
          {post ? t('Lưu thay đổi', 'Save changes') : t('Đăng bài', 'Publish post')}
        </button>
        <button className="btn btn-ghost" onClick={onCancel}>{t('Hủy', 'Cancel')}</button>
        {post && onDelete && (
          <button className="btn" style={{ marginLeft: 'auto', color: 'var(--maroon-700)', border: '1px solid var(--maroon-700)' }}
            onClick={() => { if (confirm(t('Xóa bài viết này?', 'Delete this post?'))) onDelete(post.id); }}>
            {t('Xóa', 'Delete')}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Settings panel ────────────────────────────────────────────
function SettingsPanel({ settings = {}, onSave }) {
  const { t } = useT();
  const [form, setForm] = useState(settings);
  const [saved, setSaved] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // sync if settings load after mount
  React.useEffect(() => { setForm(settings); }, [JSON.stringify(settings)]);

  const handleSave = async () => {
    await onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ paddingTop: 28, maxWidth: 640 }}>
      <h3 style={{ marginBottom: 24 }}>{t('Ảnh & cài đặt trang', 'Site images & settings')}</h3>

      <Field label={t('Ảnh chân dung Rinpoche (trang Thầy)', "Rinpoche's portrait (Teacher page)")}>
        <ImageUploader value={form.teacher_portrait || ''} onChange={url => set('teacher_portrait', url)} />
      </Field>

      <Field label={t('Ảnh bìa trang chủ', 'Homepage cover image')}>
        <ImageUploader value={form.home_cover || ''} onChange={url => set('home_cover', url)} />
      </Field>

      <Field label={t('Ảnh banner Dòng truyền thừa', 'Lineage banner image')}>
        <ImageUploader value={form.lineage_banner || ''} onChange={url => set('lineage_banner', url)} />
      </Field>

      <div style={{ marginTop: 24 }}>
        <button className="btn btn-primary" onClick={handleSave}>
          {saved ? '✓ ' + t('Đã lưu!', 'Saved!') : t('Lưu cài đặt', 'Save settings')}
        </button>
      </div>
    </div>
  );
}

// ── Forum panel ───────────────────────────────────────────────
function ForumPanel() {
  const { t } = useT();
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.listForum()
      .then(d => setThreads(Array.isArray(d) ? d : []))
      .catch(() => setThreads([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const markAnswered = async (id, byTeacher) => {
    await api.patchThread(id, { replied: true, byTeacher });
    setThreads(prev => prev.map(tr => tr._id === id ? { ...tr, replied: true, byTeacher } : tr));
  };

  const del = async (id) => {
    if (!confirm(t('Xóa câu hỏi này?', 'Delete this question?'))) return;
    await api.deleteThread(id);
    setThreads(prev => prev.filter(tr => tr._id !== id));
  };

  if (loading) return <EmptyState message={t('Đang tải…', 'Loading…')} />;
  if (threads.length === 0) return <EmptyState message={t('Chưa có câu hỏi nào', 'No questions yet')} />;

  return (
    <div>
      {threads.map(tr => (
        <div key={tr._id} className="admin-row" style={{ alignItems: 'flex-start', gap: 16 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,var(--gold-500),var(--maroon-700))', display: 'grid', placeItems: 'center', color: 'var(--cream-100)', fontFamily: 'var(--f-serif)', fontSize: 16, flexShrink: 0 }}>
            {tr.avatar || '❓'}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--ink-500)' }}>{tr.author}</span>
              {tr.topic && <span className="tag">{tr.topic}</span>}
              <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--ink-400)' }}>
                {new Date(tr.createdAt).toLocaleDateString('vi-VN')}
              </span>
              {tr.replied && (
                <span className="tag" style={{ background: tr.byTeacher ? 'var(--gold-100)' : 'var(--cream-200)', color: tr.byTeacher ? 'var(--maroon-800)' : 'var(--ink-500)' }}>
                  {tr.byTeacher ? '✦ Rinpoche đã trả lời' : '● Đã giải đáp'}
                </span>
              )}
            </div>
            <div style={{ fontFamily: 'var(--f-serif)', fontSize: 17, color: 'var(--maroon-800)', marginBottom: 4 }}>{tr.title}</div>
            <div style={{ fontSize: 13, color: 'var(--ink-600)', lineHeight: 1.6 }}>{tr.preview}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
            {!tr.byTeacher && (
              <button className="btn btn-gold" style={{ fontSize: 11, padding: '6px 12px' }}
                onClick={() => markAnswered(tr._id, true)}>
                ✦ {t('Rinpoche trả lời', 'Mark Rinpoche answered')}
              </button>
            )}
            {!tr.replied && (
              <button className="btn btn-ghost" style={{ fontSize: 11, padding: '6px 12px' }}
                onClick={() => markAnswered(tr._id, false)}>
                ● {t('Đánh dấu đã giải đáp', 'Mark answered')}
              </button>
            )}
            <button className="btn" style={{ fontSize: 11, padding: '6px 12px', color: 'var(--maroon-700)', border: '1px solid var(--maroon-700)' }}
              onClick={() => del(tr._id)}>
              {t('Xóa', 'Delete')}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main AdminPage ────────────────────────────────────────────
function AdminPage({ goto }) {
  const { t, lang } = useT();
  const cms = useCMS();
  const { user, logout } = useAuth();
  const [tab, setTab] = useState('events');
  const [editing, setEditing] = useState(null);

  if (!cms) return <div className="section"><h2>Loading CMS…</h2></div>;

  const closeEditor = () => setEditing(null);

  const switchTab = (t) => { setTab(t); setEditing(null); };

  return (
    <div className="page admin-page">
      <section className="section">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div className="eyebrow">{t('Trang quản trị', 'Admin Console')}</div>
            <h2>{t('Quản lý nội dung', 'Content Management')}</h2>
            <p style={{ color: 'var(--ink-700)', maxWidth: 720, fontSize: 14 }}>
              {t(
                'Dữ liệu lưu trên MongoDB. Thay đổi áp dụng ngay cho mọi người truy cập trang.',
                'Data is stored in MongoDB. Changes apply immediately for all visitors.'
              )}
            </p>
            {user && (
              <div style={{ marginTop: 8, fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--ink-500)' }}>
                {t('Đăng nhập với', 'Signed in as')} <strong>{user.email}</strong> · {user.role}
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

        {/* Tabs */}
        <div style={{ borderBottom: '1px solid var(--cream-300)', marginTop: 32 }}>
          <AdminTab label={`${t('Sự kiện', 'Events')} · ${cms.events.length}`} active={tab === 'events'} onClick={() => switchTab('events')} />
          <AdminTab label={`${t('Bài giảng', 'Teachings')} · ${cms.lectures.length}`} active={tab === 'lectures'} onClick={() => switchTab('lectures')} />
          <AdminTab label={`${t('Hoằng pháp', 'Activities')} · ${cms.teacherEvents.length}`} active={tab === 'teacherEvents'} onClick={() => switchTab('teacherEvents')} />
          <AdminTab label={`Blog · ${cms.blogs.length}`} active={tab === 'blog'} onClick={() => switchTab('blog')} />
          <AdminTab label={t('Diễn đàn', 'Forum')} active={tab === 'forum'} onClick={() => switchTab('forum')} />
          <AdminTab label={t('Cài đặt', 'Settings')} active={tab === 'settings'} onClick={() => switchTab('settings')} />
        </div>

        {/* EVENTS */}
        {tab === 'events' && (
          <div style={{ paddingTop: 28 }}>
            {!editing && <>
              <button className="btn btn-primary" onClick={() => setEditing({ kind: 'event', item: null })} style={{ marginBottom: 20 }}>
                + {t('Thêm sự kiện', 'Add event')}
              </button>
              {cms.events.length === 0 ? <EmptyState message={t('Chưa có sự kiện nào', 'No events yet')} /> : (
                <div>
                  {cms.events.map(e => (
                    <div key={e.id} className="admin-row">
                      {e.imageUrl && <img src={e.imageUrl} alt="" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 2, flexShrink: 0 }} />}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                          <span className="tag">{lang === 'vi' ? e.type_vi : e.type_en}</span>
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
              )}
            </>}
            {editing?.kind === 'event' && (
              <EventEditor
                event={editing.item}
                onSave={(form) => { editing.item ? cms.updateEvent(editing.item.id, form) : cms.addEvent(form); closeEditor(); }}
                onCancel={closeEditor}
                onDelete={(id) => { cms.deleteEvent(id); closeEditor(); }}
              />
            )}
          </div>
        )}

        {/* LECTURES */}
        {tab === 'lectures' && (
          <div style={{ paddingTop: 28 }}>
            {!editing && <>
              <button className="btn btn-primary" onClick={() => setEditing({ kind: 'lecture', item: null })} style={{ marginBottom: 20 }}>
                + {t('Thêm bài giảng', 'Add teaching')}
              </button>
              {cms.lectures.length === 0 ? <EmptyState message={t('Chưa có bài giảng nào', 'No teachings yet')} /> : (
                <div>
                  {cms.lectures.map(l => (
                    <div key={l.id} className="admin-row">
                      {l.imageUrl && <img src={l.imageUrl} alt="" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 2, flexShrink: 0 }} />}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                          <span className="tag">{l.format}</span>
                          <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--ink-500)' }}>{l.teacher} · {l.duration} · {lang === 'vi' ? l.level_vi : l.level_en}</span>
                        </div>
                        <div style={{ fontFamily: 'var(--f-serif)', fontSize: 18, color: 'var(--maroon-800)' }}>{lang === 'vi' ? l.title_vi : l.title_en}</div>
                      </div>
                      <button className="btn btn-ghost" onClick={() => setEditing({ kind: 'lecture', item: l })}>{t('Sửa', 'Edit')}</button>
                    </div>
                  ))}
                </div>
              )}
            </>}
            {editing?.kind === 'lecture' && (
              <LectureEditor
                lecture={editing.item}
                onSave={(form) => { editing.item ? cms.updateLecture(editing.item.id, form) : cms.addLecture(form); closeEditor(); }}
                onCancel={closeEditor}
                onDelete={(id) => { cms.deleteLecture(id); closeEditor(); }}
              />
            )}
          </div>
        )}

        {/* TEACHER EVENTS */}
        {tab === 'teacherEvents' && (
          <div style={{ paddingTop: 28 }}>
            {!editing && <>
              <button className="btn btn-primary" onClick={() => setEditing({ kind: 'te', item: null })} style={{ marginBottom: 20 }}>
                + {t('Thêm hoạt động', 'Add activity')}
              </button>
              {cms.teacherEvents.length === 0 ? <EmptyState message={t('Chưa có hoạt động nào', 'No activities yet')} /> : (
                <div>
                  {cms.teacherEvents.map(e => (
                    <div key={e.id} className="admin-row">
                      {e.imageUrl && <img src={e.imageUrl} alt="" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 2, flexShrink: 0 }} />}
                      <div style={{ flex: 1 }}>
                        <div style={{ marginBottom: 4 }}>
                          <span className="tag gold">{e.year} · {lang === 'vi' ? e.season_vi : e.season_en}</span>
                        </div>
                        <div style={{ fontFamily: 'var(--f-serif)', fontSize: 18, color: 'var(--maroon-800)' }}>{lang === 'vi' ? e.title_vi : e.title_en}</div>
                        <div style={{ fontSize: 12, color: 'var(--ink-500)', marginTop: 2 }}>{e.location}</div>
                      </div>
                      <button className="btn btn-ghost" onClick={() => setEditing({ kind: 'te', item: e })}>{t('Sửa', 'Edit')}</button>
                    </div>
                  ))}
                </div>
              )}
            </>}
            {editing?.kind === 'te' && (
              <TeacherEventEditor
                event={editing.item}
                onSave={(form) => { editing.item ? cms.updateTeacherEvent(editing.item.id, form) : cms.addTeacherEvent(form); closeEditor(); }}
                onCancel={closeEditor}
                onDelete={(id) => { cms.deleteTeacherEvent(id); closeEditor(); }}
              />
            )}
          </div>
        )}

        {/* BLOG */}
        {tab === 'blog' && (
          <div style={{ paddingTop: 28 }}>
            {!editing && <>
              <button className="btn btn-primary" onClick={() => setEditing({ kind: 'blog', item: null })} style={{ marginBottom: 20 }}>
                + {t('Viết bài mới', 'New post')}
              </button>
              {cms.blogs.length === 0 ? <EmptyState message={t('Chưa có bài viết nào', 'No posts yet')} /> : (
                <div>
                  {cms.blogs.map(b => (
                    <div key={b.id} className="admin-row">
                      {b.imageUrl && <img src={b.imageUrl} alt="" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 2, flexShrink: 0 }} />}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                          {!b.published && <span className="tag" style={{ background: 'var(--cream-200)', color: 'var(--ink-400)' }}>Draft</span>}
                          <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--ink-500)' }}>
                            {new Date(b.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div style={{ fontFamily: 'var(--f-serif)', fontSize: 18, color: 'var(--maroon-800)' }}>{lang === 'vi' ? b.title_vi : b.title_en}</div>
                        <div style={{ fontSize: 12, color: 'var(--ink-500)', marginTop: 2 }}>{(lang === 'vi' ? b.tags_vi : b.tags_en || []).join(', ')}</div>
                      </div>
                      <button className="btn btn-ghost" onClick={() => setEditing({ kind: 'blog', item: b })}>{t('Sửa', 'Edit')}</button>
                    </div>
                  ))}
                </div>
              )}
            </>}
            {editing?.kind === 'blog' && (
              <BlogEditor
                post={editing.item}
                onSave={(form) => { editing.item ? cms.updateBlog(editing.item.id, form) : cms.addBlog(form); closeEditor(); }}
                onCancel={closeEditor}
                onDelete={(id) => { cms.deleteBlog(id); closeEditor(); }}
              />
            )}
          </div>
        )}
        {/* FORUM */}
        {tab === 'forum' && (
          <div style={{ paddingTop: 28 }}>
            <ForumPanel />
          </div>
        )}

        {/* SETTINGS */}
        {tab === 'settings' && (
          <SettingsPanel settings={cms.settings} onSave={cms.saveSettings} />
        )}

      </section>
    </div>
  );
}

export default AdminPage;
