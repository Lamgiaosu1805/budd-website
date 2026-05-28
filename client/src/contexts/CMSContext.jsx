import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from '../lib/api.js';

const CMSContext = createContext(null);

export function CMSProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [teacherEvents, setTeacherEvents] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [e, l, te, b, s] = await Promise.all([
        api.listEvents(),
        api.listLectures(),
        api.listTeacherEvents(),
        api.listBlog(),
        api.getSettings(),
      ]);
      setEvents(e);
      setLectures(l);
      setTeacherEvents(te);
      setBlogs(b);
      setSettings(s || {});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const value = {
    events, lectures, teacherEvents, blogs, settings, loading, error, refresh,
    saveSettings: async (data) => { await api.saveSettings(data); setSettings(s => ({ ...s, ...data })); },

    addEvent: async (e) => { const c = await api.createEvent(e); setEvents((es) => [...es, c]); },
    updateEvent: async (id, p) => { const u = await api.updateEvent(id, p); setEvents((es) => es.map((x) => x.id === id ? u : x)); },
    deleteEvent: async (id) => { await api.deleteEvent(id); setEvents((es) => es.filter((x) => x.id !== id)); },

    addLecture: async (l) => { const c = await api.createLecture(l); setLectures((ls) => [...ls, c]); },
    updateLecture: async (id, p) => { const u = await api.updateLecture(id, p); setLectures((ls) => ls.map((x) => x.id === id ? u : x)); },
    deleteLecture: async (id) => { await api.deleteLecture(id); setLectures((ls) => ls.filter((x) => x.id !== id)); },

    addTeacherEvent: async (te) => { const c = await api.createTeacherEvent(te); setTeacherEvents((ts) => [...ts, c]); },
    updateTeacherEvent: async (id, p) => { const u = await api.updateTeacherEvent(id, p); setTeacherEvents((ts) => ts.map((x) => x.id === id ? u : x)); },
    deleteTeacherEvent: async (id) => { await api.deleteTeacherEvent(id); setTeacherEvents((ts) => ts.filter((x) => x.id !== id)); },

    addBlog: async (b) => { const c = await api.createBlog(b); setBlogs((bs) => [c, ...bs]); },
    updateBlog: async (id, p) => { const u = await api.updateBlog(id, p); setBlogs((bs) => bs.map((x) => x.id === id ? u : x)); },
    deleteBlog: async (id) => { await api.deleteBlog(id); setBlogs((bs) => bs.filter((x) => x.id !== id)); },
  };

  return <CMSContext.Provider value={value}>{children}</CMSContext.Provider>;
}

export function useCMS() {
  return useContext(CMSContext);
}
