import React from 'react';
import { X, User, Calendar as CalendarIcon } from 'lucide-react';
import { linkify } from '../utils/linkify';

const MONTHS_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Format a 'YYYY-MM-DD' string as 'Mmm DD, YYYY' (e.g. "Sep 12, 2026")
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  if (!y || !m || !d) return dateStr;
  return `${MONTHS_ABBR[m - 1]} ${String(d).padStart(2, '0')}, ${y}`;
};

const getBadgeClass = (category) => {
  const cat = (category || '').toLowerCase();
  if (cat === 'field trip') return 'badge-field-trip';
  if (cat === 'class event') return 'badge-class-event';
  if (cat === 'school event') return 'badge-school-event';
  if (cat === 'for teacher') return 'badge-for-teacher';
  if (cat === 'p/t conference') return 'badge-pt-conference';
  if (cat === 'photo day') return 'badge-photo-day';
  return 'badge-other';
};

export default function AnnouncementDetailsModal({ isOpen, onClose, announcement }) {
  if (!isOpen || !announcement) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className={`badge ${getBadgeClass(announcement.category)}`}>{announcement.category}</span>
          <button className="btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem' }}>{announcement.title}</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '1rem', fontSize: '0.9rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CalendarIcon size={16} style={{ color: 'var(--primary)' }} />
            <span><strong>Date:</strong> {formatDate(announcement.date)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={16} style={{ color: 'var(--primary)' }} />
            <span><strong>Posted by:</strong> {announcement.author}</span>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Description & Notes</label>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
            {announcement.content ? linkify(announcement.content) : 'No additional notes provided.'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          <button className="btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
