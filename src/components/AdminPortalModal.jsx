import React, { useState } from 'react';
import { X, Megaphone, Calendar as CalendarIcon, ShieldCheck, Lock, Unlock, KeyRound, AlertCircle, Send, Bell, CheckSquare } from 'lucide-react';
import { calculateReminderDate, formatDateString } from '../utils/whatsappHelper';
import confetti from 'canvas-confetti';

export default function AdminPortalModal({ isOpen, onClose, onSaveAnnouncement, onSaveEvent }) {
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Post Details Form State
  const [destination, setDestination] = useState('both'); // 'banner' | 'calendar' | 'both'
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Field Trip');
  const [author, setAuthor] = useState('Parent Rep');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('09:00 AM - 02:00 PM');
  const [location, setLocation] = useState('');
  const [content, setContent] = useState('');
  const [pinned, setPinned] = useState(false);

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

  const handleSubmitPost = (e) => {
    e.preventDefault();
    if (!title || !content) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const postDate = date || todayStr;

    // 1. Post to Announcement Banner
    if (destination === 'banner' || destination === 'both') {
      const newNotice = {
        id: `anc-${Date.now()}`,
        title,
        category,
        priority: category.toLowerCase() === 'urgent' ? 'urgent' : 'general',
        content,
        author,
        date: postDate,
        pinned
      };
      onSaveAnnouncement(newNotice);
    }

    // 2. Post to Calendar
    if (destination === 'calendar' || destination === 'both') {
      const newEvent = {
        id: `evt-${Date.now()}`,
        title,
        category,
        date: postDate,
        time,
        location: location || 'School Grounds',
        description: content,
        organizer: author
      };
      onSaveEvent(newEvent);
    }

    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });

    // Reset Form
    setTitle('');
    setContent('');
    setDate('');
    setLocation('');
    handleClose();
  };

  const calculatedReminderDate = date ? formatDateString(calculateReminderDate(date)) : '';

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-card" style={{ maxWidth: '620px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={22} style={{ color: 'var(--primary)' }} />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Parent Rep Admin Portal</h3>
          </div>
          <button className="btn-icon" onClick={handleClose}><X size={18} /></button>
        </div>

        {!isUnlocked ? (
          /* STEP 1: PASSWORD LOCK SCREEN */
          <form onSubmit={handleUnlock}>
            <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', border: '1px solid var(--border-color)', marginBottom: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <Lock size={28} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' }}>Password Protected Area</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  This portal is restricted to GISSVROOS Room 3B Parent Representatives. Enter your admin password to access post creation.
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
                <Unlock size={16} /> Unlock & Create Post
              </button>
            </div>
          </form>
        ) : (
          /* STEP 2: DIRECT UNIFIED POST DETAILS FORM */
          <form onSubmit={handleSubmitPost}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span className="badge badge-general" style={{ fontSize: '0.75rem' }}>
                Authenticated Parent Rep
              </span>
              <button type="button" onClick={handleLock} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                <Lock size={12} /> Lock Portal
              </button>
            </div>

            {/* POST DESTINATION SELECTOR */}
            <div className="form-group">
              <label className="form-label">Post Destination *</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                <button
                  type="button"
                  className={`tab-btn ${destination === 'banner' ? 'active' : ''}`}
                  style={{ padding: '0.75rem 0.5rem', textAlign: 'center', height: 'auto' }}
                  onClick={() => setDestination('banner')}
                >
                  <Megaphone size={16} style={{ display: 'block', margin: '0 auto 4px auto' }} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Announcement Only</span>
                </button>

                <button
                  type="button"
                  className={`tab-btn ${destination === 'calendar' ? 'active' : ''}`}
                  style={{ padding: '0.75rem 0.5rem', textAlign: 'center', height: 'auto' }}
                  onClick={() => setDestination('calendar')}
                >
                  <CalendarIcon size={16} style={{ display: 'block', margin: '0 auto 4px auto' }} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Calendar Only</span>
                </button>

                <button
                  type="button"
                  className={`tab-btn ${destination === 'both' ? 'active' : ''}`}
                  style={{ padding: '0.75rem 0.5rem', textAlign: 'center', height: 'auto' }}
                  onClick={() => setDestination('both')}
                >
                  <CheckSquare size={16} style={{ display: 'block', margin: '0 auto 4px auto' }} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>BOTH Banner & Calendar</span>
                </button>
              </div>
            </div>

            {/* TITLE & CATEGORY */}
            <div className="form-group">
              <label className="form-label">Title / Headline *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 🚌 Field Trip Permission Slips & Schedule"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="Field Trip">FIELD TRIP</option>
                  <option value="Class Event">CLASS EVENT</option>
                  <option value="School Event">SCHOOL EVENT</option>
                  <option value="For Teacher">FOR TEACHER</option>
                  <option value="Other">OTHER</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Posted By</label>
                <input
                  type="text"
                  className="form-input"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </div>
            </div>

            {/* DATE & TIME (Required if calendar or both) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">
                  Event / Notice Date {destination !== 'banner' && '*'}
                </label>
                <input
                  type="date"
                  className="form-input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required={destination !== 'banner'}
                />
              </div>

              {destination !== 'banner' && (
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
              )}
            </div>

            {destination !== 'banner' && (
              <div className="form-group">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Metro Zoo & Botanical Garden"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            )}

            {/* CONTENT & DETAILS */}
            <div className="form-group">
              <label className="form-label">Content & Details *</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Provide complete post details, instructions, or notes for class families..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            {/* OPTIONS & WHATSAPP INDICATOR */}
            {(destination === 'banner' || destination === 'both') && (
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  id="pinnedPost"
                  checked={pinned}
                  onChange={(e) => setPinned(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="pinnedPost" style={{ fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}>
                  Pin to top marquee alert banner
                </label>
              </div>
            )}

            {(destination === 'calendar' || destination === 'both') && date && (
              <div style={{ background: 'rgba(37, 211, 102, 0.12)', border: '1px solid rgba(37, 211, 102, 0.3)', padding: '0.75rem 1rem', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Bell size={16} style={{ color: '#25D366' }} />
                <span>
                  <strong>Automated 4-Day WhatsApp Reminder:</strong> Scheduled to trigger on{' '}
                  <strong>{calculatedReminderDate}</strong> (4 days before event).
                </span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" className="btn-secondary" onClick={handleClose}>Cancel</button>
              <button type="submit" className="btn-primary">
                <Send size={16} /> Publish Post ({destination === 'banner' ? 'Announcement' : destination === 'calendar' ? 'Calendar' : 'BOTH'})
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
