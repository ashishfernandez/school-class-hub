import React, { useState } from 'react';
import { X, Megaphone, Calendar as CalendarIcon, ShieldCheck, Lock, Unlock, KeyRound, AlertCircle } from 'lucide-react';

export default function AdminPortalModal({ isOpen, onClose, onOpenAddAnnouncement, onOpenAddEvent }) {
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleUnlock = (e) => {
    e.preventDefault();
    if (password === 'gissvroosx') {
      setIsUnlocked(true);
      setErrorMessage('');
    } else {
      setErrorMessage('Incorrect password. Please try again.');
    }
  };

  const handleClose = () => {
    setPassword('');
    setErrorMessage('');
    onClose();
  };

  const handleLock = () => {
    setIsUnlocked(false);
    setPassword('');
    setErrorMessage('');
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-card" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={22} style={{ color: 'var(--primary)' }} />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Parent Rep Admin Portal</h3>
          </div>
          <button className="btn-icon" onClick={handleClose}><X size={18} /></button>
        </div>

        {!isUnlocked ? (
          /* Locked Form Step */
          <form onSubmit={handleUnlock}>
            <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', border: '1px solid var(--border-color)', marginBottom: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <Lock size={28} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' }}>Password Protected Area</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  This portal is restricted to GISSVROOS Room 3B Parent Representatives. Please enter your admin password to proceed.
                </p>
              </div>
            </div>

            {errorMessage && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#ef4444', padding: '0.75rem 1rem', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={16} /> {errorMessage}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Parent Rep Password</label>
              <div style={{ position: 'relative' }}>
                <KeyRound size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  placeholder="Enter admin password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" className="btn-secondary" onClick={handleClose}>Cancel</button>
              <button type="submit" className="btn-primary">
                <Unlock size={16} /> Unlock Portal
              </button>
            </div>
          </form>
        ) : (
          /* Unlocked Admin Actions Step */
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Authenticated as <strong>Parent Representative</strong>
              </p>
              <button onClick={handleLock} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                <Lock size={12} /> Lock Portal
              </button>
            </div>

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
                  handleClose();
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
                  handleClose();
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
              <button className="btn-secondary" onClick={handleClose}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
