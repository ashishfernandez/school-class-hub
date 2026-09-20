import React, { useState } from 'react';
import { Megaphone, Pin, Search, Plus, Bell, Calendar, Sparkles, Filter, ChevronDown, ChevronRight, History } from 'lucide-react';

const MONTHS_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Format a 'YYYY-MM-DD' string as 'Mmm DD, YYYY' (e.g. "Sep 12, 2026")
const formatTileDate = (dateStr) => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  if (!y || !m || !d) return dateStr;
  return `${MONTHS_ABBR[m - 1]} ${String(d).padStart(2, '0')}, ${y}`;
};

// Return a human label for how far the date is from today
// (e.g. "Today", "1 day away", "5 days away", "3 days ago").
const getDaysAwayLabel = (dateStr) => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  if (!y || !m || !d) return '';
  const target = new Date(y, m - 1, d);
  target.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((target - today) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return '1 day away';
  if (diff > 1) return `${diff} days away`;
  if (diff === -1) return '1 day ago';
  return `${Math.abs(diff)} days ago`;
};

// An announcement is "expired" once its date is strictly before today.
// (Items with no date are never considered expired.)
const isExpired = (dateStr) => {
  if (!dateStr) return false;
  const [y, m, d] = dateStr.split('-').map(Number);
  if (!y || !m || !d) return false;
  const target = new Date(y, m - 1, d);
  target.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return target < today;
};

export default function AnnouncementsSection({ announcements, onAddClick, onSelectAnnouncement }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showPrevious, setShowPrevious] = useState(false);

  const filteredAnnouncements = announcements.filter(item => {
    // Marquee-only posts appear solely in the top banner, never as tiles.
    if (item.marquee_only) return false;
    const q = searchQuery.toLowerCase();
    return (item.title || '').toLowerCase().includes(q) ||
           (item.content || '').toLowerCase().includes(q);
  });

  // Split into upcoming/current vs. expired (past) announcements. Past ones are
  // tucked away in a collapsible "Previous events" sub-section, most recent first.
  const upcomingAnnouncements = filteredAnnouncements.filter(item => !isExpired(item.date));
  const pastAnnouncements = filteredAnnouncements
    .filter(item => isExpired(item.date))
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''));

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

  // Renders a single announcement tile. `past` tiles show the "X days ago"
  // label in a green theme (vs. the yellow "X days away" for upcoming tiles).
  const renderCard = (item, past = false) => (
    <div
      key={item.id}
      className="glass-card announcement-card"
      style={{ cursor: 'pointer', ...(past ? { opacity: 0.9 } : {}) }}
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

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
          <h3 className="card-title" style={{ marginBottom: 0 }}>{item.title}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0 }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{formatTileDate(item.date)}</span>
            {getDaysAwayLabel(item.date) && (
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: past ? '#10b981' : 'var(--primary)', whiteSpace: 'nowrap' }}>{getDaysAwayLabel(item.date)}</span>
            )}
          </div>
        </div>
      </div>

      <div className="card-footer">
        <span>By <strong>{item.author}</strong></span>
      </div>
    </div>
  );

  return (
    <section className="announcements-container" style={{ marginBottom: '3rem' }}>
      {/* Top Banner Alert Ticker(s) */}
      {marqueeAnnouncements.map((item) => (
        <div className="announcement-ticker" key={item.id}>
          <div className="ticker-content">
            <span className="badge badge-urgent" style={{ display: 'inline-flex', alignItems: 'center' }} title="Marquee Announcement" aria-label="Marquee Announcement">
              <Pin size={12} />
            </span>
            <strong>{item.title}</strong>
          </div>
          {item.date && (
            <div style={{ fontWeight: 600, fontSize: '0.85rem', opacity: 0.8, whiteSpace: 'nowrap', flexShrink: 0 }}>
              {formatTileDate(item.date)}
            </div>
          )}
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

      {/* Announcements Grid (upcoming / current) */}
      <div className="announcements-grid">
        {filteredAnnouncements.length === 0 ? (
          <div className="glass-card" style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Megaphone size={40} style={{ opacity: 0.3, marginBottom: '1rem' }} />
            <h3>No Announcements Yet</h3>
          </div>
        ) : upcomingAnnouncements.length === 0 ? (
          <div className="glass-card" style={{ gridColumn: '1 / -1', padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <h3 style={{ fontWeight: 700 }}>No upcoming announcements</h3>
            <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Check "Previous events" below for past items.</p>
          </div>
        ) : (
          upcomingAnnouncements.map((item) => renderCard(item, false))
        )}
      </div>

      {/* Previous events (expired announcements) — plain collapsible toggle.
          Always shown; the counter reads 0 when there are none. */}
      <div style={{ marginTop: '2rem' }}>
          <button
            type="button"
            onClick={() => setShowPrevious((v) => !v)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: 0,
              background: 'none',
              border: 'none',
              color: 'var(--primary)',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
            }}
            aria-expanded={showPrevious}
          >
            {showPrevious ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            <History size={16} />
            <span>Memory lane</span>
            <span
              style={{
                border: '1px solid rgba(255, 184, 0, 0.4)',
                color: 'var(--primary)',
                fontSize: '0.75rem',
                fontWeight: 800,
                lineHeight: 1,
                padding: '0.15rem 0.45rem',
              }}
            >
              {pastAnnouncements.length}
            </span>
          </button>

          {showPrevious && (
            pastAnnouncements.length > 0 ? (
              <div className="announcements-grid" style={{ marginTop: '1rem' }}>
                {pastAnnouncements.map((item) => renderCard(item, true))}
              </div>
            ) : (
              <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                No previous events.
              </p>
            )
          )}
        </div>
    </section>
  );
}
