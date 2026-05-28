const TOKEN_KEY = 'kct_auth_token';

export function getToken() {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
}
export function setToken(token) {
  try { token ? localStorage.setItem(TOKEN_KEY, token) : localStorage.removeItem(TOKEN_KEY); } catch {}
}

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const t = getToken();
    if (t) headers.Authorization = `Bearer ${t}`;
  }
  const res = await fetch(`/api${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export const api = {
  health: () => request('/health'),

  // auth
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
  register: (email, password, name) => request('/auth/register', { method: 'POST', body: { email, password, name } }),
  me: () => request('/auth/me', { auth: true }),

  // image upload — returns { url }
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const t = getToken();
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: t ? { Authorization: `Bearer ${t}` } : {},
      body: formData,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    return data;
  },

  // events
  listEvents: () => request('/events'),
  createEvent: (data) => request('/events', { method: 'POST', body: data, auth: true }),
  updateEvent: (id, data) => request(`/events/${id}`, { method: 'PUT', body: data, auth: true }),
  deleteEvent: (id) => request(`/events/${id}`, { method: 'DELETE', auth: true }),

  // lectures
  listLectures: () => request('/lectures'),
  createLecture: (data) => request('/lectures', { method: 'POST', body: data, auth: true }),
  updateLecture: (id, data) => request(`/lectures/${id}`, { method: 'PUT', body: data, auth: true }),
  deleteLecture: (id) => request(`/lectures/${id}`, { method: 'DELETE', auth: true }),

  // teacher events
  listTeacherEvents: () => request('/teacher-events'),
  createTeacherEvent: (data) => request('/teacher-events', { method: 'POST', body: data, auth: true }),
  updateTeacherEvent: (id, data) => request(`/teacher-events/${id}`, { method: 'PUT', body: data, auth: true }),
  deleteTeacherEvent: (id) => request(`/teacher-events/${id}`, { method: 'DELETE', auth: true }),

  // blog
  listBlog: () => request('/blog'),
  createBlog: (data) => request('/blog', { method: 'POST', body: data, auth: true }),
  updateBlog: (id, data) => request(`/blog/${id}`, { method: 'PUT', body: data, auth: true }),
  deleteBlog: (id) => request(`/blog/${id}`, { method: 'DELETE', auth: true }),

  // settings
  getSettings: () => request('/settings'),
  saveSettings: (data) => request('/settings', { method: 'PUT', body: data, auth: true }),

  // forum
  listForum: () => request('/forum'),
  createThread: (data) => request('/forum', { method: 'POST', body: data, auth: true }),
  patchThread: (id, data) => request(`/forum/${id}`, { method: 'PATCH', body: data, auth: true }),
  deleteThread: (id) => request(`/forum/${id}`, { method: 'DELETE', auth: true }),
};
