import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import AnnouncementsSection from './components/AnnouncementsSection';
import AnnouncementModal from './components/AnnouncementModal';
import CalendarSection from './components/CalendarSection';
import EventModal from './components/EventModal';
import AdminPortalModal from './components/AdminPortalModal';

import {
  getStoredAnnouncements, saveStoredAnnouncements,
  getStoredEvents, saveStoredEvents,
  getStoredSettings, saveStoredSettings
} from './utils/storage';

export default function App() {
  const [announcements, setAnnouncements] = useState(() => getStoredAnnouncements());
  const [events, setEvents] = useState(() => getStoredEvents());
  const [settings, setSettings] = useState(() => getStoredSettings());

  // Modal controls
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isCreateEventMode, setIsCreateEventMode] = useState(false);
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);

  // Date the calendar should jump to when a new event is added (so it's visible)
  const [calendarFocusDate, setCalendarFocusDate] = useState(null);

  // Sync settings with DOM attributes for light/dark theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.themeMode || 'dark');
  }, [settings.themeMode]);

  // Handlers for Announcements
  const handleAddAnnouncement = (newNotice) => {
    const updated = [newNotice, ...announcements];
    setAnnouncements(updated);
    saveStoredAnnouncements(updated);
  };

  const handleDeleteAnnouncement = (id) => {
    const updated = announcements.filter(a => a.id !== id);
    setAnnouncements(updated);
    saveStoredAnnouncements(updated);
  };

  // Reorder an announcement up/down; this order is reflected on the main page
  const handleReorderAnnouncement = (id, direction) => {
    const index = announcements.findIndex(a => a.id === id);
    if (index === -1) return;
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= announcements.length) return;
    const updated = [...announcements];
    const [moved] = updated.splice(index, 1);
    updated.splice(newIndex, 0, moved);
    setAnnouncements(updated);
    saveStoredAnnouncements(updated);
  };

  // Toggle the (cosmetic) pinned badge shown on the main page tile
  const handleTogglePinAnnouncement = (id) => {
    const updated = announcements.map(a =>
      a.id === id ? { ...a, pinned: !a.pinned } : a
    );
    setAnnouncements(updated);
    saveStoredAnnouncements(updated);
  };

  // Handlers for Events
  const handleAddEvent = (newEvent) => {
    const updated = [...events, newEvent];
    setEvents(updated);
    saveStoredEvents(updated);
    // Ensure the calendar navigates to the month of the newly added event.
    // Use a unique value each time so repeated adds to the same month still trigger navigation.
    setCalendarFocusDate(`${newEvent.date}#${Date.now()}`);
  };

  const handleDeleteEvent = (id) => {
    const updated = events.filter(e => e.id !== id);
    setEvents(updated);
    saveStoredEvents(updated);
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

  return (
    <div className="app-container">
      {/* Ambient background glowing orbs */}
      <div className="ambient-bg">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

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
        onReorderAnnouncement={handleReorderAnnouncement}
        onTogglePinAnnouncement={handleTogglePinAnnouncement}
        events={events}
        onDeleteEvent={handleDeleteEvent}
      />

      <AnnouncementModal
        isOpen={isAnnouncementModalOpen}
        onClose={() => setIsAnnouncementModalOpen(false)}
        onSave={handleAddAnnouncement}
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
