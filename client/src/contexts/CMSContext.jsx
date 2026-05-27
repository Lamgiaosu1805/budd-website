import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from '../lib/api.js';

const CMSContext = createContext(null);

export function CMSProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [teacherEvents, setTeacherEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [e, l, te] = await Promise.all([
        api.listEvents(),
        api.listLectures(),
        api.listTeacherEvents(),
      ]);
      setEvents(e);
      setLectures(l);
      setTeacherEvents(te);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const value = {
    events, lectures, teacherEvents, loading, error, refresh,

    addEvent: async (e) => { const created = await api.createEvent(e); setEvents((es) => [...es, created]); },
    updateEvent: async (id, patch) => { const updated = await api.updateEvent(id, patch); setEvents((es) => es.map((x) => x.id === id ? updated : x)); },
    deleteEvent: async (id) => { await api.deleteEvent(id); setEvents((es) => es.filter((x) => x.id !== id)); },

    addLecture: async (l) => { const created = await api.createLecture(l); setLectures((ls) => [...ls, created]); },
    updateLecture: async (id, patch) => { const updated = await api.updateLecture(id, patch); setLectures((ls) => ls.map((x) => x.id === id ? updated : x)); },
    deleteLecture: async (id) => { await api.deleteLecture(id); setLectures((ls) => ls.filter((x) => x.id !== id)); },

    addTeacherEvent: async (te) => { const created = await api.createTeacherEvent(te); setTeacherEvents((ts) => [...ts, created]); },
    updateTeacherEvent: async (id, patch) => { const updated = await api.updateTeacherEvent(id, patch); setTeacherEvents((ts) => ts.map((x) => x.id === id ? updated : x)); },
    deleteTeacherEvent: async (id) => { await api.deleteTeacherEvent(id); setTeacherEvents((ts) => ts.filter((x) => x.id !== id)); },
  };

  return <CMSContext.Provider value={value}>{children}</CMSContext.Provider>;
}

export function useCMS() {
  return useContext(CMSContext);
}
