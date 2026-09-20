import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, MapPin, Clock, Download, Bell, Filter, List, Grid } from 'lucide-react';
import { calculateReminderDate, getReminderStatus } from '../utils/whatsappHelper';
import { downloadIcsFile } from '../utils/icsGenerator';

// Parse a 'YYYY-MM-DD' string into a local Date (avoids UTC timezone shifting the day)
const parseLocalDate = (dateStr) => {
  if (!dateStr) return null;
  // Strip any trailing uniqueness token (e.g. "2026-09-20#1699999999") used to force re-focus
  const [y, m, d] = dateStr.split('#')[0].split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
};

export default function CalendarSection({ events, onAddEventClick, onSelectEvent, focusDate }) {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // When a new event is added, jump the calendar to that event's month so it's visible
  useEffect(() => {
    const parsed = parseLocalDate(focusDate);
    if (parsed) {
      setCurrentDate(new Date(parsed.getFullYear(), parsed.getMonth(), 1));
    }
  }, [focusDate]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const handleToday = () => setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));

  // Calendar calculations
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d);
  }

  // All events are shown (category filtering removed)
  const filteredEvents = events;

  const getEventsForDay = (dayNumber) => {
    if (!dayNumber) return [];
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
    return filteredEvents.filter(e => e.date === formattedDate);
  };

  const getCategoryColor = (category) => {
    switch ((category || '').toLowerCase()) {
      case 'field trip': return { bg: '#10b981', border: '#10b981', color: '#ffffff' };
      case 'class event': return { bg: '#8b5cf6', border: '#8b5cf6', color: '#ffffff' };
      case 'school event': return { bg: '#06b6d4', border: '#06b6d4', color: '#ffffff' };
      case 'for teacher': return { bg: '#f43f5e', border: '#f43f5e', color: '#ffffff' };
      case 'p/t conference': return { bg: '#f97316', border: '#f97316', color: '#ffffff' };
      default: return { bg: '#6366f1', border: '#6366f1', color: '#ffffff' };
    }
  };

  return (
    <section className="calendar-section" style={{ marginBottom: '3.5rem' }}>
      {/* Section Header */}
      <div className="section-header">
        <div className="section-title">
          <div className="brand-icon-wrapper" style={{ width: '40px', height: '40px' }}>
            <CalendarIcon size={22} />
          </div>
          <div>
            <h2>Live Class Calendar</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Interactive schedule of upcoming Class 3B events
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', background: 'var(--bg-secondary)', padding: '3px', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
            <button
              className={`btn-icon`}
              style={{ width: '34px', height: '34px', border: 'none', background: viewMode === 'grid' ? 'var(--card-bg)' : 'transparent' }}
              onClick={() => setViewMode('grid')}
              title="Month Grid View"
            >
              <Grid size={16} />
            </button>
            <button
              className={`btn-icon`}
              style={{ width: '34px', height: '34px', border: 'none', background: viewMode === 'list' ? 'var(--card-bg)' : 'transparent' }}
              onClick={() => setViewMode('list')}
              title="Agenda List View"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Container Card */}
      <div className="glass-card calendar-container">
        {/* Navigation & Controls */}
        <div className="calendar-top-bar">
          <div className="month-navigator">
            <button className="btn-icon" onClick={handlePrevMonth}><ChevronLeft size={20} /></button>
            <span className="month-title">{monthNames[month]} {year}</span>
            <button className="btn-icon" onClick={handleNextMonth}><ChevronRight size={20} /></button>
            <button className="btn-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }} onClick={handleToday}>
              Today
            </button>
          </div>
        </div>

        {/* View Mode: Month Grid */}
        {viewMode === 'grid' ? (
          <div>
            <div className="calendar-grid">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="day-name">{day}</div>
              ))}

              {calendarDays.map((dayNum, index) => {
                if (dayNum === null) {
                  return <div key={`empty-${index}`} className="calendar-day empty" />;
                }

                const dayEvents = getEventsForDay(dayNum);
                const isToday = dayNum === today.getDate() && month === today.getMonth() && year === today.getFullYear();

                return (
                  <div key={`day-${dayNum}`} className={`calendar-day ${isToday ? 'today' : ''}`}>
                    <div className="day-header">
                      <span className="day-number">{dayNum}</span>
                      {dayEvents.length > 0 && (
                        <span style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: 800 }}>
                          {dayEvents.length} event{dayEvents.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', overflowY: 'auto' }}>
                      {dayEvents.map(evt => {
                        const style = getCategoryColor(evt.category);
                        return (
                          <div
                            key={evt.id}
                            className="event-pill"
                            style={{ background: style.bg, color: style.color, borderColor: style.border }}
                            onClick={() => onSelectEvent(evt)}
                            title={evt.title}
                          >
                            <span>{evt.title}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* View Mode: Agenda List */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredEvents.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No upcoming events for selected filter.
              </div>
            ) : (
              filteredEvents.map(evt => {
                const status = getReminderStatus(evt.date);
                const style = getCategoryColor(evt.category);
                return (
                  <div
                    key={evt.id}
                    className="glass-card agenda-row"
                    style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}
                    onClick={() => onSelectEvent(evt)}
                  >
                    <div className="agenda-row-main" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                      <div style={{ textAlign: 'center', padding: '0.6rem 1rem', background: style.bg, borderRadius: '0.85rem', border: `1px solid ${style.border}`, minWidth: '75px' }}>
                        <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: style.color, textTransform: 'uppercase' }}>
                          {evt.category}
                        </span>
                        <span style={{ fontSize: '1.1rem', fontWeight: 800, color: style.color }}>
                          {evt.date.split('-')[2]}
                        </span>
                      </div>

                      <div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.3rem' }}>{evt.title}</h4>
                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> {evt.time}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> {evt.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="agenda-row-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span className="badge badge-general" style={{ fontSize: '0.7rem' }}>
                        {status.label}
                      </span>
                      <button
                        className="btn-secondary"
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadIcsFile(evt);
                        }}
                        title="Download .ics Calendar File"
                      >
                        <Download size={14} /> iCal
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </section>
  );
}
