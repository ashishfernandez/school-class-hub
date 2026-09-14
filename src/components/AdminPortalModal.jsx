import React from 'react';
import { X, Megaphone, Calendar as CalendarIcon, ShieldCheck } from 'lucide-react';

export default function AdminPortalModal({ isOpen, onClose, onOpenAddAnnouncement, onOpenAddEvent }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={22} style={{ color: 'var(--primary)' }} />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Teacher Admin Portal</h3>
          </div>
          <button className="btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Select an admin action to update the GISSVROOS Class 3B website:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginBottom: '1rem' }}>
          <button
            className="glass-card"
            style={{
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              textAlign: 'left',
              cursor: 'pointer',
              border: '1px solid var(--border-color)',
              background: 'var(--card-bg)'
            }}
            onClick={() => {
              onClose();
              onOpenAddAnnouncement();
            }}
          >
            <div className="brand-icon-wrapper" style={{ width: '42px', height: '42px', flexShrink: 0 }}>
              <Megaphone size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.2rem', color: 'var(--text-main)' }}>
                📢 Post New Announcement
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Publish a homework notice, urgent alert, or general update to the top announcements feed.
              </p>
            </div>
          </button>

          <button
            className="glass-card"
            style={{
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              textAlign: 'left',
              cursor: 'pointer',
              border: '1px solid var(--border-color)',
              background: 'var(--card-bg)'
            }}
            onClick={() => {
              onClose();
              onOpenAddEvent();
            }}
          >
            <div className="brand-icon-wrapper" style={{ width: '42px', height: '42px', flexShrink: 0 }}>
              <CalendarIcon size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.2rem', color: 'var(--text-main)' }}>
                📅 Add Class Event to Calendar
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Schedule a field trip, exam, or party with automatic 4-day WhatsApp reminder alerts.
              </p>
            </div>
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <button className="btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
