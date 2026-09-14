import React, { useState } from 'react';
import { Megaphone, Pin, Search, Plus, Bell, Calendar, Sparkles, Filter } from 'lucide-react';

export default function AnnouncementsSection({ announcements, onAddClick }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAnnouncements = announcements.filter(item => {
    return item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           item.content.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Ticker shows the top announcement by the admin-controlled order (pinning is
  // cosmetic only and does not move an announcement to the front).
  const featuredAnnouncement = announcements[0];

  const getBadgeClass = (category, priority) => {
    const cat = (category || '').toLowerCase();
    if (cat === 'field trip') return 'badge-field-trip';
    if (cat === 'class event') return 'badge-class-event';
    if (cat === 'school event') return 'badge-school-event';
    if (cat === 'for teacher') return 'badge-for-teacher';
    if (cat === 'p/t conference') return 'badge-pt-conference';
    return 'badge-other';
  };

  return (
    <section className="announcements-container" style={{ marginBottom: '3rem' }}>
      {/* Top Banner Alert Ticker */}
      {featuredAnnouncement && (
        <div className="announcement-ticker">
          <div className="ticker-content">
            <span className="badge badge-urgent" style={{ display: 'inline-flex', alignItems: 'center' }} title="Featured Announcement" aria-label="Featured Announcement">
              <Pin size={12} />
            </span>
            <span><strong>{featuredAnnouncement.title}:</strong> {featuredAnnouncement.content}</span>
          </div>
          <div style={{ fontSize: '0.8rem', opacity: 0.8, whiteSpace: 'nowrap' }}>
            By {featuredAnnouncement.author} • {featuredAnnouncement.date}
          </div>
        </div>
      )}

      {/* Section Header */}
      <div className="section-header">
        <div className="section-title">
          <div className="brand-icon-wrapper" style={{ width: '40px', height: '40px' }}>
            <Megaphone size={22} />
          </div>
          <div>
            <h2>General Announcements</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Top most things to know right now
            </p>
          </div>
        </div>

      </div>

      {/* Controls & Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', width: '260px' }}>
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
            <div key={item.id} className="glass-card announcement-card">
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

                <h3 className="card-title">{item.title}</h3>
                <p className="card-body">{item.content}</p>
              </div>

              <div className="card-footer">
                <span>By <strong>{item.author}</strong></span>
                <span>{item.date}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
