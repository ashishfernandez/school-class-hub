import React, { useState } from 'react';
import { X, Send } from 'lucide-react';

export default function AnnouncementModal({ isOpen, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General');
  const [priority, setPriority] = useState('normal');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('Mrs. Davis');
  const [pinned, setPinned] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !content) return;

    const newAnnouncement = {
      id: `anc-${Date.now()}`,
      title,
      category,
      priority,
      content,
      author,
      date: new Date().toISOString().split('T')[0],
      pinned
    };

    onSave(newAnnouncement);
    // Reset form
    setTitle('');
    setContent('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>📢 Post New Announcement</h3>
          <button className="btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Announcement Title *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. 🚌 Field Trip Permission Slips Due"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="General">General</option>
                <option value="Homework">Homework</option>
                <option value="Field Trip">Field Trip</option>
                <option value="Urgent">Urgent Notice</option>
                <option value="Party">Class Party</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select className="form-select" value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="general">Normal</option>
                <option value="urgent">Urgent</option>
                <option value="homework">Homework</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Posted By</label>
            <input
              type="text"
              className="form-input"
              placeholder="Teacher / Admin Name"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Announcement Content *</label>
            <textarea
              className="form-textarea"
              rows={4}
              placeholder="Write the complete announcement details here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              id="pinned"
              checked={pinned}
              onChange={(e) => setPinned(e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <label htmlFor="pinned" style={{ fontSize: '0.9rem', cursor: 'pointer', fontWeight: 600 }}>
              Pin to top banner marquee
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">
              <Send size={16} /> Publish Announcement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
