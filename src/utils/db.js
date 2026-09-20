import { supabase, isSupabaseEnabled } from './supabaseClient';
import {
  getStoredAnnouncements, saveStoredAnnouncements,
  getStoredEvents, saveStoredEvents
} from './storage';

/*
 * Unified data layer.
 * - When Supabase is configured (VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY),
 *   all reads/writes go to a shared database so every visitor sees the same data.
 * - Otherwise it transparently falls back to per-browser localStorage.
 *
 * All functions are async so App.jsx can treat both backends the same way.
 */

// ---------- ANNOUNCEMENTS ----------

export async function fetchAnnouncements() {
  if (!isSupabaseEnabled) return getStoredAnnouncements();
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .order('position', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

// Insert-or-update every announcement, storing the array order as `position`.
// Handles adds, reorders, and pin/marquee toggles in one call.
export async function persistAnnouncements(list) {
  if (!isSupabaseEnabled) {
    saveStoredAnnouncements(list);
    return;
  }
  const rows = list.map((a, i) => ({
    id: a.id,
    title: a.title,
    category: a.category,
    priority: a.priority ?? 'general',
    content: a.content,
    author: a.author,
    date: a.date,
    time: a.time ?? '',
    location: a.location ?? '',
    pinned: !!a.pinned,
    marquee: !!a.marquee,
    position: i
  }));
  const { error } = await supabase.from('announcements').upsert(rows);
  if (error) throw error;
}

export async function removeAnnouncement(id, remaining) {
  if (!isSupabaseEnabled) {
    saveStoredAnnouncements(remaining);
    return;
  }
  const { error } = await supabase.from('announcements').delete().eq('id', id);
  if (error) throw error;
}

// ---------- EVENTS ----------

export async function fetchEvents() {
  if (!isSupabaseEnabled) return getStoredEvents();
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function addEvent(newEvent, all) {
  if (!isSupabaseEnabled) {
    saveStoredEvents(all);
    return;
  }
  const { error } = await supabase.from('events').insert({
    id: newEvent.id,
    title: newEvent.title,
    category: newEvent.category,
    date: newEvent.date,
    time: newEvent.time ?? '',
    location: newEvent.location ?? '',
    description: newEvent.description ?? '',
    organizer: newEvent.organizer ?? ''
  });
  if (error) throw error;
}

export async function removeEvent(id, remaining) {
  if (!isSupabaseEnabled) {
    saveStoredEvents(remaining);
    return;
  }
  const { error } = await supabase.from('events').delete().eq('id', id);
  if (error) throw error;
}
