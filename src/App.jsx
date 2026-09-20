import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import AnnouncementsSection from './components/AnnouncementsSection';
import AnnouncementModal from './components/AnnouncementModal';
import CalendarSection from './components/CalendarSection';
import EventModal from './components/EventModal';
import AdminPortalModal from './components/AdminPortalModal';
import AnnouncementDetailsModal from './components/AnnouncementDetailsModal';
import SiteGate from './components/SiteGate';

import { getStoredSettings, saveStoredSettings } from './utils/storage';
import {
  fetchAnnouncements, persistAnnouncements, removeAnnouncement,
  fetchEvents, addEvent, updateEvent, removeEvent
} from './utils/db';

export default function App() {
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [settings, setSettings] = useState(() => getStoredSettings());

  // Modal controls
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isAnnouncementDetailsOpen, setIsAnnouncementDetailsOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isCreateEventMode, setIsCreateEventMode] = useState(false);
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);

  // Date the calendar should jump to when a new event is added (so it's visible)
  const [calendarFocusDate, setCalendarFocusDate] = useState(null);

  // Site-wide password gate: hides the site until the visitor enters the password.
  // Remembered per browser session (re-prompts when the browser/session is closed).
  const [siteUnlocked, setSiteUnlocked] = useState(
    () => typeof sessionStorage !== 'undefined' && sessionStorage.getItem('gissvroos_site_unlocked') === 'true'
  );

  const handleUnlockSite = () => {
    try { sessionStorage.setItem('gissvroos_site_unlocked', 'true'); } catch (e) { /* ignore */ }
    setSiteUnlocked(true);
  };

  // Sync settings with DOM attributes for light/dark theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.themeMode || 'dark');
  }, [settings.themeMode]);

  // Load shared data (Supabase or localStorage) on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [a, e] = await Promise.all([fetchAnnouncements(), fetchEvents()]);
        if (!cancelled) {
          setAnnouncements(a);
          setEvents(e);
        }
      } catch (err) {
        console.error('Failed to load data:', err);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Handlers for Announcements
  const handleAddAnnouncement = async (newNotice) => {
    const updated = [newNotice, ...announcements];
    setAnnouncements(updated);
    try { await persistAnnouncements(updated); } catch (err) { console.error(err); }
  };

  const handleDeleteAnnouncement = async (id) => {
    const updated = announcements.filter(a => a.id !== id);
    setAnnouncements(updated);
    try { await removeAnnouncement(id, updated); } catch (err) { console.error(err); }
  };

  // Update an existing announcement in place (preserves order, pin, marquee, etc.)
  const handleUpdateAnnouncement = async (updatedNotice) => {
    const updated = announcements.map(a =>
      a.id === updatedNotice.id ? { ...a, ...updatedNotice } : a
    );
    setAnnouncements(updated);
    try { await persistAnnouncements(updated); } catch (err) { console.error(err); }
  };

  const handleSelectAnnouncement = (announcement) => {
    setSelectedAnnouncement(announcement);
    setIsAnnouncementDetailsOpen(true);
  };

  // Reorder an announcement up/down; this order is reflected on the main page
  const handleReorderAnnouncement = async (id, direction) => {
    const index = announcements.findIndex(a => a.id === id);
    if (index === -1) return;
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= announcements.length) return;
    const updated = [...announcements];
    const [moved] = updated.splice(index, 1);
    updated.splice(newIndex, 0, moved);
    setAnnouncements(updated);
    try { await persistAnnouncements(updated); } catch (err) { console.error(err); }
  };

  // Toggle the (cosmetic) pinned badge shown on the main page tile
  const handleTogglePinAnnouncement = async (id) => {
    const updated = announcements.map(a =>
      a.id === id ? { ...a, pinned: !a.pinned } : a
    );
    setAnnouncements(updated);
    try { await persistAnnouncements(updated); } catch (err) { console.error(err); }
  };

  // Add/remove an announcement from the top marquee alert banner
  const handleToggleMarqueeAnnouncement = async (id) => {
    const updated = announcements.map(a =>
      a.id === id ? { ...a, marquee: !a.marquee } : a
    );
    setAnnouncements(updated);
    try { await persistAnnouncements(updated); } catch (err) { console.error(err); }
  };

  // Handlers for Events
  const handleAddEvent = async (newEvent) => {
    const updated = [...events, newEvent];
    setEvents(updated);
    // Ensure the calendar navigates to the month of the newly added event.
    // Use a unique value each time so repeated adds to the same month still trigger navigation.
    setCalendarFocusDate(`${newEvent.date}#${Date.now()}`);
    try { await addEvent(newEvent, updated); } catch (err) { console.error(err); }
  };

  const handleUpdateEvent = async (updatedEvent) => {
    const updated = events.map(e =>
      e.id === updatedEvent.id ? { ...e, ...updatedEvent } : e
    );
    setEvents(updated);
    try { await updateEvent(updatedEvent, updated); } catch (err) { console.error(err); }
  };

  const handleDeleteEvent = async (id) => {
    const updated = events.filter(e => e.id !== id);
    setEvents(updated);
    try { await removeEvent(id, updated); } catch (err) { console.error(err); }
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setIsCreateEventMode(false);
    setIsEventModalOpen(true);
  };

  const handleOpenCreateEvent = () => {
    setSelectedEvent(null);
    setIsCreateEventMode(true);
    setIsEventModalOpen(true);
  };

  // Handlers for Settings & Theme
  const handleToggleThemeMode = () => {
    const nextMode = settings.themeMode === 'dark' ? 'light' : 'dark';
    const nextSettings = { ...settings, themeMode: nextMode };
    setSettings(nextSettings);
    saveStoredSettings(nextSettings);
  };

  const handleUpdateSettings = (newSettings) => {
    setSettings(newSettings);
    saveStoredSettings(newSettings);
  };

  // Gate the entire site behind a password until unlocked.
  if (!siteUnlocked) {
    return <SiteGate onUnlock={handleUnlockSite} />;
  }

  return (
    <div className="app-container">
      {/* Header Bar */}
      <Header
        classNameTitle={settings.className}
        onOpenAdminPortal={() => setIsAdminPortalOpen(true)}
        themeMode={settings.themeMode}
        onToggleThemeMode={handleToggleThemeMode}
      />

      {/* Main Content Sections */}
      <main>
        {/* TOP SECTION: General Announcements */}
        <AnnouncementsSection
          announcements={announcements}
          onSelectAnnouncement={handleSelectAnnouncement}
        />

        {/* BOTTOM SECTION: Live Calendar of Events */}
        <CalendarSection
          events={events}
          onSelectEvent={handleSelectEvent}
          focusDate={calendarFocusDate}
        />
      </main>

      {/* Modals */}
      <AdminPortalModal
        isOpen={isAdminPortalOpen}
        onClose={() => setIsAdminPortalOpen(false)}
        onSaveAnnouncement={handleAddAnnouncement}
        onSaveEvent={handleAddEvent}
        announcements={announcements}
        onDeleteAnnouncement={handleDeleteAnnouncement}
        onUpdateAnnouncement={handleUpdateAnnouncement}
        onUpdateEvent={handleUpdateEvent}
        onReorderAnnouncement={handleReorderAnnouncement}
        onTogglePinAnnouncement={handleTogglePinAnnouncement}
        onToggleMarqueeAnnouncement={handleToggleMarqueeAnnouncement}
        events={events}
        onDeleteEvent={handleDeleteEvent}
      />

      <AnnouncementModal
        isOpen={isAnnouncementModalOpen}
        onClose={() => setIsAnnouncementModalOpen(false)}
        onSave={handleAddAnnouncement}
      />

      <AnnouncementDetailsModal
        isOpen={isAnnouncementDetailsOpen}
        onClose={() => setIsAnnouncementDetailsOpen(false)}
        announcement={selectedAnnouncement}
      />

      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        selectedEvent={selectedEvent}
        isCreateMode={isCreateEventMode}
        onSaveEvent={handleAddEvent}
        userPhone={settings.whatsappPhone}
      />

      {/* Footer */}
      <footer className="app-footer">
        <p>✨ <strong>GISSVROOS Class Events</strong> • Built for Room 3B Families</p>
      </footer>
    </div>
  );
}
