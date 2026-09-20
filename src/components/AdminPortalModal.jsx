import React, { useState, useRef } from 'react';
import { X, Megaphone, Calendar as CalendarIcon, ShieldCheck, Lock, Unlock, KeyRound, AlertCircle, Send, CheckSquare, Trash2, Pin, PinOff, ArrowUp, ArrowDown, Pencil } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AdminPortalModal({ isOpen, onClose, onSaveAnnouncement, onSaveEvent, announcements = [], onDeleteAnnouncement, onUpdateAnnouncement, onUpdateEvent, onReorderAnnouncement, onTogglePinAnnouncement, onToggleMarqueeAnnouncement, events = [], onDeleteEvent }) {
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
  const [marquee, setMarquee] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingType, setEditingType] = useState(null); // 'announcement' | 'event'
  const cardRef = useRef(null);

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

  const resetFormFields = () => {
    setTitle(''); setContent(''); setDate(''); setLocation('');
    setTime('09:00 AM - 02:00 PM'); setCategory('Field Trip');
    setAuthor('Parent Rep'); setMarquee(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingType(null);
    resetFormFields();
  };

  const startEditAnnouncement = (a) => {
    setEditingType('announcement');
    setEditingId(a.id);
    setTitle(a.title || '');
    setCategory(a.category || 'Field Trip');
    setAuthor(a.author || 'Parent Rep');
    setDate(a.date || '');
    setTime(a.time || '');
    setLocation(a.location || '');
    setContent(a.content || '');
    setMarquee(!!a.marquee);
    if (cardRef.current) cardRef.current.scrollTop = 0;
  };

  const startEditEvent = (ev) => {
    setEditingType('event');
    setEditingId(ev.id);
    setTitle(ev.title || '');
    setCategory(ev.category || 'Field Trip');
    setAuthor(ev.organizer || 'Parent Rep');
    setDate(ev.date || '');
    setTime(ev.time || '');
    setLocation(ev.location || '');
    setContent(ev.description || '');
    setMarquee(false);
    if (cardRef.current) cardRef.current.scrollTop = 0;
  };

  const handleSubmitPost = (e) => {
    e.preventDefault();
    if (!title) return;
    // Content is required for everything except a create-mode Marquee-only post.
    const contentRequired = editingType === null && destination !== 'marquee';
    if (contentRequired && !content) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const postDate = date || todayStr;

    if (editingType === 'announcement') {
      onUpdateAnnouncement({
        id: editingId,
        title,
        category,
        priority: category.toLowerCase() === 'urgent' ? 'urgent' : 'general',
        content,
        author,
        date: postDate,
        time,
        location,
        marquee
      });
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      cancelEdit();
      return;
    }

    if (editingType === 'event') {
      onUpdateEvent({
        id: editingId,
        title,
        category,
        date: postDate,
        time,
        location: location || 'School Grounds',
        description: content,
        organizer: author
      });
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      cancelEdit();
      return;
    }

    // Marquee Only: appears solely in the top scrolling banner, nowhere else.
    if (destination === 'marquee') {
      onSaveAnnouncement({
        id: `anc-${Date.now()}`,
        title,
        category,
        priority: category.toLowerCase() === 'urgent' ? 'urgent' : 'general',
        content,
        author,
        date: postDate,
        time: '',
        location: '',
        marquee: true,
        marquee_only: true,
        pinned: false
      });
    }

    // 1. Post to Announcement Banner (tile)
    if (destination === 'banner' || destination === 'both') {
      const newNotice = {
        id: `anc-${Date.now()}`,
        title,
        category,
        priority: category.toLowerCase() === 'urgent' ? 'urgent' : 'general',
        content,
        author,
        date: postDate,
        time,
        location,
        marquee,
        marquee_only: false,
        pinned: false
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
    setMarquee(false);
    setDestination('both');
    handleClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-card" ref={cardRef} style={{ maxWidth: '620px' }} onClick={(e) => e.stopPropagation()}>
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
          /* STEP 2: DIRECT UNIFIED POST DETAILS FORM + MANAGE PANEL */
          <>
          <form onSubmit={handleSubmitPost}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span className="badge badge-general" style={{ fontSize: '0.75rem' }}>
                Authenticated Parent Rep
              </span>
              <button type="button" onClick={handleLock} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                <Lock size={12} /> Lock Admin Portal
              </button>
            </div>

            {editingType && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', background: 'rgba(99, 102, 241, 0.12)', border: '1px solid var(--primary)', padding: '0.75rem 1rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem' }}>
                  <Pencil size={16} /> Editing {editingType === 'event' ? 'calendar event' : 'announcement'}
                </div>
                <button type="button" className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }} onClick={cancelEdit}>
                  Cancel edit
                </button>
              </div>
            )}

            {/* POST DESTINATION SELECTOR */}
            {!editingType && (
            <div className="form-group">
              <label className="form-label">Post Destination *</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
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
                  className={`tab-btn ${destination === 'marquee' ? 'active' : ''}`}
                  style={{ padding: '0.75rem 0.5rem', textAlign: 'center', height: 'auto' }}
                  onClick={() => setDestination('marquee')}
                >
                  <Pin size={16} style={{ display: 'block', margin: '0 auto 4px auto' }} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Marquee Only</span>
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
              {destination === 'marquee' && (
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  Shows only in the top scrolling banner (title + date). It won't appear as an announcement tile or on the calendar.
                </p>
              )}
            </div>
            )}

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

            {/* CATEGORY SELECTOR CHIPS */}
            <div className="form-group">
              <label className="form-label">Category *</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {[
                  { id: 'Field Trip', label: 'FIELD TRIP', color: '#10b981' },
                  { id: 'Class Event', label: 'CLASS EVENT', color: '#8b5cf6' },
                  { id: 'School Event', label: 'SCHOOL EVENT', color: '#06b6d4' },
                  { id: 'For Teacher', label: 'FOR TEACHER', color: '#f43f5e' },
                  { id: 'P/T Conference', label: 'P/T CONFERENCE', color: '#f97316' },
                  { id: 'Photo Day', label: 'PHOTO DAY', color: '#ec4899' },
                  { id: 'Other', label: 'OTHER', color: '#6366f1' }
                ].map((cat) => {
                  const isSelected = category.toLowerCase() === cat.id.toLowerCase();
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      style={{
                        padding: '0.5rem 0.85rem',
                        background: cat.color,
                        color: '#ffffff',
                        border: isSelected ? '2px solid var(--text-main)' : '2px solid transparent',
                        fontWeight: 800,
                        fontSize: '0.75rem',
                        letterSpacing: '0.5px',
                        cursor: 'pointer',
                        opacity: isSelected ? 1 : 0.6,
                        boxShadow: isSelected ? '0 0 8px rgba(0,0,0,0.3)' : 'none',
                        borderRadius: 0
                      }}
                    >
                      {isSelected ? `✓ ${cat.label}` : cat.label}
                    </button>
                  );
                })}
              </div>
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

            {/* DATE & TIME (Time/Location hidden for Marquee-only posts) */}
            {editingType === null && destination === 'marquee' ? (
              <div className="form-group">
                <label className="form-label">Notice Date *</label>
                <input
                  type="date"
                  className="form-input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            ) : (
              <>
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
                      required={editingType === null && destination !== 'banner'}
                    />
                  </div>

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
                </div>

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
              </>
            )}

            {/* CONTENT & DETAILS */}
            <div className="form-group">
              <label className="form-label">
                Content & Details {!(editingType === null && destination === 'marquee') && '*'}
              </label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Provide complete post details, instructions, or notes for class families..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required={editingType === null && destination !== 'marquee'}
              />
            </div>

            {/* OPTIONS & WHATSAPP INDICATOR */}
            {((editingType === 'announcement') || (editingType === null && (destination === 'banner' || destination === 'both'))) && (
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  id="marqueePost"
                  checked={marquee}
                  onChange={(e) => setMarquee(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="marqueePost" style={{ fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}>
                  Show in top marquee alert banner
                </label>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" className="btn-secondary" onClick={editingType ? cancelEdit : handleClose}>Cancel</button>
              <button type="submit" className="btn-primary">
                {editingType ? (<><Pencil size={16} /> Update {editingType === 'event' ? 'Event' : 'Announcement'}</>) : (<><Send size={16} /> Publish Post ({destination === 'banner' ? 'Announcement' : destination === 'marquee' ? 'Marquee' : destination === 'calendar' ? 'Calendar' : 'BOTH'})</>)}
              </button>
            </div>
          </form>

          {/* MANAGE / DELETE ANNOUNCEMENTS (Admin only) */}
          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Megaphone size={18} style={{ color: 'var(--primary)' }} />
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Manage Announcements</h4>
              <span className="badge badge-general" style={{ fontSize: '0.7rem' }}>{announcements.length}</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Arrows set the order shown on the main page. The megaphone adds/removes the item from the top marquee banner. The pin is a cosmetic tile badge only.
            </p>

            {announcements.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No announcements posted yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '320px', overflowY: 'auto' }}>
                {announcements.map((item, index) => (
                  <div
                    key={item.id}
                    className="manage-row"
                    style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', padding: '0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
                  >
                    <div className="manage-row-info" style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                        <span className="badge badge-general" style={{ fontSize: '0.65rem' }}>{item.category}</span>
                        {item.marquee && (
                          <span style={{ color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '0.7rem', fontWeight: 700 }}>
                            <Megaphone size={11} /> {item.marquee_only ? 'Marquee only' : 'In Marquee'}
                          </span>
                        )}
                        {item.pinned && (
                          <span style={{ color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '0.7rem', fontWeight: 700 }}>
                            <Pin size={11} /> Pinned
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>By {item.author} • {item.date}</div>
                    </div>

                    <div className="manage-row-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
                      {/* Reorder controls */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <button
                          type="button"
                          onClick={() => onReorderAnnouncement && onReorderAnnouncement(item.id, 'up')}
                          disabled={index === 0}
                          className="btn-icon"
                          style={{ width: '28px', height: '20px', opacity: index === 0 ? 0.35 : 1, cursor: index === 0 ? 'not-allowed' : 'pointer' }}
                          title="Move up"
                        >
                          <ArrowUp size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => onReorderAnnouncement && onReorderAnnouncement(item.id, 'down')}
                          disabled={index === announcements.length - 1}
                          className="btn-icon"
                          style={{ width: '28px', height: '20px', opacity: index === announcements.length - 1 ? 0.35 : 1, cursor: index === announcements.length - 1 ? 'not-allowed' : 'pointer' }}
                          title="Move down"
                        >
                          <ArrowDown size={13} />
                        </button>
                      </div>

                      {/* Marquee toggle (add/remove from top banner) */}
                      <button
                        type="button"
                        onClick={() => onToggleMarqueeAnnouncement && onToggleMarqueeAnnouncement(item.id)}
                        className="btn-icon"
                        style={{ width: '34px', height: '34px', color: item.marquee ? 'var(--primary)' : 'var(--text-muted)', borderColor: item.marquee ? 'var(--primary)' : 'var(--border-color)' }}
                        title={item.marquee ? 'Remove from top marquee banner' : 'Add to top marquee banner'}
                      >
                        <Megaphone size={15} />
                      </button>

                      {/* Cosmetic pin toggle */}
                      <button
                        type="button"
                        onClick={() => onTogglePinAnnouncement && onTogglePinAnnouncement(item.id)}
                        className="btn-icon"
                        style={{ width: '34px', height: '34px', color: item.pinned ? 'var(--primary)' : 'var(--text-muted)', borderColor: item.pinned ? 'var(--primary)' : 'var(--border-color)' }}
                        title={item.pinned ? 'Unpin (remove badge)' : 'Pin (show badge on tile)'}
                      >
                        {item.pinned ? <PinOff size={15} /> : <Pin size={15} />}
                      </button>

                      {/* Edit */}
                      <button
                        type="button"
                        onClick={() => startEditAnnouncement(item)}
                        className="btn-secondary"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '0.4rem 0.6rem', fontSize: '0.75rem', color: 'var(--primary)', borderColor: 'var(--primary)' }}
                        title="Edit announcement"
                      >
                        <Pencil size={14} /> Edit
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => onDeleteAnnouncement && onDeleteAnnouncement(item.id)}
                        className="btn-secondary"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '0.4rem 0.6rem', fontSize: '0.75rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.4)' }}
                        title="Delete announcement"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* MANAGE / DELETE CALENDAR EVENTS (Admin only) */}
          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <CalendarIcon size={18} style={{ color: 'var(--primary)' }} />
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Manage Calendar Events</h4>
              <span className="badge badge-general" style={{ fontSize: '0.7rem' }}>{events.length}</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Deleting an event here also removes it from the live calendar.
            </p>

            {events.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No calendar events posted yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '280px', overflowY: 'auto' }}>
                {events.map((evt) => (
                  <div
                    key={evt.id}
                    className="manage-row"
                    style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', padding: '0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
                  >
                    <div className="manage-row-info" style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                        <span className="badge badge-general" style={{ fontSize: '0.65rem' }}>{evt.category}</span>
                      </div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{evt.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{evt.date}{evt.time ? ` • ${evt.time}` : ''}{evt.location ? ` • ${evt.location}` : ''}</div>
                    </div>
                    <div className="manage-row-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
                      <button
                        type="button"
                        onClick={() => startEditEvent(evt)}
                        className="btn-secondary"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '0.4rem 0.6rem', fontSize: '0.75rem', color: 'var(--primary)', borderColor: 'var(--primary)' }}
                        title="Edit event"
                      >
                        <Pencil size={14} /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteEvent && onDeleteEvent(evt.id)}
                        className="btn-secondary"
                        style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '0.4rem 0.6rem', fontSize: '0.75rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.4)' }}
                        title="Delete event"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          </>
        )}
      </div>
    </div>
  );
}
