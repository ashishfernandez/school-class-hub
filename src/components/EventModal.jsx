import React, { useState } from 'react';
import { X, Calendar as CalendarIcon, MapPin, Clock, Plus, Bell } from 'lucide-react';
import { calculateReminderDate, formatDateString } from '../utils/whatsappHelper';
import { linkify } from '../utils/linkify';

export default function EventModal({ isOpen, onClose, selectedEvent, isCreateMode, onSaveEvent, userPhone }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Field Trip');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('09:00 AM - 02:00 PM');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [organizer, setOrganizer] = useState('Mrs. Davis');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !date) return;

    const newEvent = {
      id: `evt-${Date.now()}`,
      title,
      category,
      date,
      time,
      location: location || 'School Grounds',
      description,
      organizer
    };

    onSaveEvent(newEvent);
    // Reset form
    setTitle('');
    setDate('');
    setDescription('');
    onClose();
  };

  if (isCreateMode) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-card" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>📅 Add New Class Event</h3>
            <button className="btn-icon" onClick={onClose}><X size={18} /></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Event Title *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 🚌 Field Trip to Science Center"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="Field Trip">Field Trip</option>
                  <option value="Party">Class Party</option>
                  <option value="Exam">Exam / Quiz</option>
                  <option value="Meeting">Parent Meeting</option>
                  <option value="Exhibition">STEM / Art Exhibition</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Event Date *</label>
                <input
                  type="date"
                  className="form-input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Time</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 09:00 AM - 02:00 PM"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Organizer</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Mrs. Davis"
                  value={organizer}
                  onChange={(e) => setOrganizer(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Science Center Auditorium"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Event Description & Notes</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Details, items to bring, permission slip requirements..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {date && (
              <div style={{ background: 'rgba(37, 211, 102, 0.12)', border: '1px solid rgba(37, 211, 102, 0.3)', padding: '0.85rem 1rem', borderRadius: '0.85rem', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Bell size={16} style={{ color: '#25D366' }} />
                <span>
                  <strong>Automated 4-Day WhatsApp Reminder:</strong> Scheduled to trigger on{' '}
                  <strong>{formatDateString(calculateReminderDate(date))}</strong> (4 days before event).
                </span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn-primary">
                <Plus size={16} /> Save & Schedule Event
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // View Details Mode
  if (!selectedEvent) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="badge badge-general">{selectedEvent.category}</span>
          <button className="btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem' }}>{selectedEvent.title}</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '1rem', fontSize: '0.9rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CalendarIcon size={16} style={{ color: 'var(--primary)' }} />
            <span><strong>Date:</strong> {selectedEvent.date}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={16} style={{ color: 'var(--primary)' }} />
            <span><strong>Time:</strong> {selectedEvent.time || 'All Day'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={16} style={{ color: 'var(--primary)' }} />
            <span><strong>Location:</strong> {selectedEvent.location || 'School'}</span>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Description & Notes</label>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
            {selectedEvent.description ? linkify(selectedEvent.description) : 'No additional notes provided.'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          <button className="btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
