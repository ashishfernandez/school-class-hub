import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import AnnouncementsSection from './components/AnnouncementsSection';
import AnnouncementModal from './components/AnnouncementModal';
import CalendarSection from './components/CalendarSection';
import EventModal from './components/EventModal';
import WhatsAppCenter from './components/WhatsAppCenter';
import DomainGuideModal from './components/DomainGuideModal';

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
  const [isDomainGuideOpen, setIsDomainGuideOpen] = useState(false);

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

  // Handlers for Events
  const handleAddEvent = (newEvent) => {
    const updated = [...events, newEvent];
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
      {/* Ambient background glows */}
      <div className="ambient-bg">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      {/* Header Bar */}
      <Header
        classNameTitle={settings.className}
        onOpenDomainGuide={() => setIsDomainGuideOpen(true)}
        themeMode={settings.themeMode}
        onToggleThemeMode={handleToggleThemeMode}
      />

      {/* Main Content Sections */}
      <main>
        {/* TOP SECTION: General Announcements */}
        <AnnouncementsSection
          announcements={announcements}
          onAddClick={() => setIsAnnouncementModalOpen(true)}
          onDeleteAnnouncement={handleDeleteAnnouncement}
        />

        {/* BOTTOM SECTION: Live Calendar of Events */}
        <CalendarSection
          events={events}
          onAddEventClick={handleOpenCreateEvent}
          onSelectEvent={handleSelectEvent}
        />

        {/* AUTOMATED WHATSAPP REMINDER CONTROL DASHBOARD */}
        <WhatsAppCenter
          events={events}
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
        />
      </main>

      {/* Modals */}
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

      <DomainGuideModal
        isOpen={isDomainGuideOpen}
        onClose={() => setIsDomainGuideOpen(false)}
      />

      {/* Footer */}
      <footer className="app-footer">
        <p>✨ <strong>ClassConnect School Hub</strong> • Built for Room 4B Class Families</p>
        <p style={{ marginTop: '0.25rem', opacity: 0.7 }}>
          Automated WhatsApp 4-day reminder system active • Connected to custom GoDaddy domain wizard
        </p>
      </footer>
    </div>
  );
}
