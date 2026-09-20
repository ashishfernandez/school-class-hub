import React, { useState } from 'react';
import { Megaphone, Pin, Search, Plus, Bell, Calendar, Sparkles, Filter } from 'lucide-react';
import { linkify } from '../utils/linkify';

const MONTHS_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Format a 'YYYY-MM-DD' string as 'Mmm DD, YYYY' (e.g. "Sep 12, 2026")
const formatTileDate = (dateStr) => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  if (!y || !m || !d) return dateStr;
  return `${MONTHS_ABBR[m - 1]} ${String(d).padStart(2, '0')}, ${y}`;
};

export default function AnnouncementsSection({ announcements, onAddClick, onSelectAnnouncement }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAnnouncements = announcements.filter(item => {
    return item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           item.content.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // The top marquee banner shows only announcements explicitly added to the
  // marquee (via the Admin Portal). If none are flagged, no banner is shown.
  const marqueeAnnouncements = announcements.filter(a => a.marquee);

  const getBadgeClass = (category, priority) => {
    const cat = (category || '').toLowerCase();
    if (cat === 'field trip') return 'badge-field-trip';
    if (cat === 'class event') return 'badge-class-event';
    if (cat === 'school event') return 'badge-school-event';
    if (cat === 'for teacher') return 'badge-for-teacher';
    if (cat === 'p/t conference') return 'badge-pt-conference';
    if (cat === 'photo day') return 'badge-photo-day';
    return 'badge-other';
  };

  return (
    <section className="announcements-container" style={{ marginBottom: '3rem' }}>
      {/* Top Banner Alert Ticker(s) */}
      {marqueeAnnouncements.map((item) => (
        <div className="announcement-ticker" key={item.id}>
          <div className="ticker-content">
            <span className="badge badge-urgent" style={{ display: 'inline-flex', alignItems: 'center' }} title="Marquee Announcement" aria-label="Marquee Announcement">
              <Pin size={12} />
            </span>
            <span>
              <strong>{item.title}</strong>
              <span style={{ marginLeft: '0.5rem', fontWeight: 600, fontSize: '0.85rem', opacity: 0.75 }}>{formatTileDate(item.date)}</span>
              <strong>:</strong> {linkify(item.content)}
            </span>
          </div>
          <div style={{ fontSize: '0.8rem', opacity: 0.8, whiteSpace: 'nowrap' }}>
            By {item.author}
          </div>
        </div>
      ))}

      {/* Section Header */}
      <div className="section-header">
        <div className="section-title">
          <div className="brand-icon-wrapper" style={{ width: '40px', height: '40px' }}>
            <Megaphone size={22} />
          </div>
          <div>
            <h2>Announcements</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Top most things to know right now
            </p>
          </div>
        </div>

      </div>

      {/* Controls & Search Bar */}
      <div className="announcements-controls" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div className="search-box" style={{ position: 'relative', width: '260px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '36px', height: '38px', fontSize: '0.85rem' }}
            placeholder="Search announcements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Announcements Grid */}
      <div className="announcements-grid">
        {filteredAnnouncements.length === 0 ? (
          <div className="glass-card" style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Megaphone size={40} style={{ opacity: 0.3, marginBottom: '1rem' }} />
            <h3>No Announcements Yet</h3>
          </div>
        ) : (
          filteredAnnouncements.map((item) => (
            <div
              key={item.id}
              className="glass-card announcement-card"
              style={{ cursor: 'pointer' }}
              onClick={() => onSelectAnnouncement && onSelectAnnouncement(item)}
              title="View announcement details"
            >
              <div>
                <div className="card-top">
                  <span className={`badge ${getBadgeClass(item.category, item.priority)}`}>
                    {item.category}
                  </span>
                  {item.pinned && (
                    <span style={{ color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '0.75rem', fontWeight: 700 }}>
                      <Pin size={12} /> Pinned
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '0.75rem' }}>
                  <h3 className="card-title" style={{ marginBottom: 0 }}>{item.title}</h3>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', whiteSpace: 'nowrap', flexShrink: 0 }}>{formatTileDate(item.date)}</span>
                </div>
              </div>

              <div className="card-footer">
                <span>By <strong>{item.author}</strong></span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
