import { INITIAL_ANNOUNCEMENTS } from '../data/mockAnnouncements';
import { INITIAL_EVENTS } from '../data/mockEvents';

const KEYS = {
  ANNOUNCEMENTS: 'gissvroos_announcements',
  EVENTS: 'gissvroos_events',
  SETTINGS: 'gissvroos_settings'
};

export const DEFAULT_SETTINGS = {
  whatsappPhone: '+1 (555) 019-2834',
  whatsappAutoSend: true,
  themeMode: 'dark',
  accentColor: 'sunburst',
  className: 'Room 3B'
};

export function getStoredAnnouncements() {
  const data = localStorage.getItem(KEYS.ANNOUNCEMENTS);
  if (!data) {
    localStorage.setItem(KEYS.ANNOUNCEMENTS, JSON.stringify(INITIAL_ANNOUNCEMENTS));
    return INITIAL_ANNOUNCEMENTS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_ANNOUNCEMENTS;
  }
}

export function saveStoredAnnouncements(announcements) {
  localStorage.setItem(KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
}

// Legacy demo/sample events seeded by older versions. Purged on load so the
// calendar starts empty, while any real Parent-Rep-created events (which use
// timestamp-based ids like `evt-1699999999999`) are preserved.
const LEGACY_DEMO_EVENT_IDS = ['evt-1', 'evt-2', 'evt-3', 'evt-4', 'evt-5'];

export function getStoredEvents() {
  const data = localStorage.getItem(KEYS.EVENTS);
  if (!data) {
    localStorage.setItem(KEYS.EVENTS, JSON.stringify(INITIAL_EVENTS));
    return INITIAL_EVENTS;
  }
  try {
    const parsed = JSON.parse(data);
    const cleaned = Array.isArray(parsed)
      ? parsed.filter(e => !LEGACY_DEMO_EVENT_IDS.includes(e.id))
      : INITIAL_EVENTS;
    if (!Array.isArray(parsed) || cleaned.length !== parsed.length) {
      localStorage.setItem(KEYS.EVENTS, JSON.stringify(cleaned));
    }
    return cleaned;
  } catch (e) {
    return INITIAL_EVENTS;
  }
}

export function saveStoredEvents(events) {
  localStorage.setItem(KEYS.EVENTS, JSON.stringify(events));
}

export function getStoredSettings() {
  const data = localStorage.getItem(KEYS.SETTINGS);
  if (!data) {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    return DEFAULT_SETTINGS;
  }
  try {
    const parsed = JSON.parse(data);
    let settings = { ...DEFAULT_SETTINGS, ...parsed };
    // Force sanitize legacy "Room 4B" values from older browser storage sessions
    if (!settings.className || settings.className.includes('4B') || settings.className.includes('Grade 4')) {
      settings.className = 'Room 3B';
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    }
    return settings;
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(settings) {
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
}
