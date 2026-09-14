import React, { useState } from 'react';
import { MessageSquare, Bell, Clock, CheckCircle, Send, Settings, Terminal, Zap, Info } from 'lucide-react';
import { calculateReminderDate, formatDateString, getReminderStatus, generateWhatsAppLink } from '../utils/whatsappHelper';
import confetti from 'canvas-confetti';

export default function WhatsAppCenter({ events, settings, onUpdateSettings }) {
  const [phoneNumber, setPhoneNumber] = useState(settings.whatsappPhone || '+1 (555) 019-2834');
  const [autoSend, setAutoSend] = useState(settings.whatsappAutoSend ?? true);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [testNotificationSent, setTestNotificationSent] = useState(false);

  const handleSavePhone = (e) => {
    e.preventDefault();
    onUpdateSettings({ ...settings, whatsappPhone: phoneNumber, whatsappAutoSend: autoSend });
    setShowConfigModal(false);
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
  };

  const handleTestReminder = (event) => {
    const url = generateWhatsAppLink(phoneNumber, event);
    window.open(url, '_blank');
    setTestNotificationSent(true);
    setTimeout(() => setTestNotificationSent(false), 5000);
  };

  return (
    <section className="whatsapp-section" style={{ marginBottom: '3.5rem' }}>
      <div className="whatsapp-box">
        {/* Header */}
        <div className="whatsapp-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="whatsapp-badge-icon">
              <MessageSquare size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>WhatsApp Automated 4-Day Reminder Engine</h3>
                <span className="badge badge-trip" style={{ background: '#25D366', color: 'white' }}>ACTIVE</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                Target WhatsApp Account: <strong style={{ color: 'var(--text-main)' }}>{phoneNumber}</strong> • Automatically dispatches alerts 4 days prior to every event
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn-secondary" onClick={() => setShowConfigModal(!showConfigModal)}>
              <Settings size={16} /> Configure Account
            </button>
          </div>
        </div>

        {/* Configuration Panel */}
        {showConfigModal && (
          <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem', border: '1px solid #25D366' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Settings size={16} style={{ color: '#25D366' }} /> WhatsApp Target Settings
            </h4>
            <form onSubmit={handleSavePhone} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div style={{ flex: 1, minWidth: '240px' }}>
                <label className="form-label">WhatsApp Mobile Phone Number</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="+1 (555) 000-0000"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  type="checkbox"
                  id="autoSend"
                  checked={autoSend}
                  onChange={(e) => setAutoSend(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="autoSend" style={{ fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                  Enable 4-Day Auto-Reminder Daemon
                </label>
              </div>

              <button type="submit" className="btn-primary" style={{ background: '#25D366' }}>
                Save WhatsApp Settings
              </button>
            </form>
          </div>
        )}

        {testNotificationSent && (
          <div style={{ background: 'rgba(37, 211, 102, 0.2)', border: '1px solid #25D366', color: '#15803d', padding: '0.75rem 1rem', borderRadius: '0.75rem', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={16} /> WhatsApp web window opened with pre-filled 4-day reminder message!
          </div>
        )}

        {/* Live Reminder Dispatch Schedule Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="reminder-table">
            <thead>
              <tr>
                <th>Event Title</th>
                <th>Event Date</th>
                <th>Calculated 4-Day Reminder Date</th>
                <th>Reminder Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {events.map((evt) => {
                const reminderDateObj = calculateReminderDate(evt.date);
                const reminderDateStr = formatDateString(reminderDateObj);
                const status = getReminderStatus(evt.date);

                return (
                  <tr key={evt.id}>
                    <td>
                      <strong>{evt.title}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{evt.location}</div>
                    </td>
                    <td>
                      <span className="badge badge-general" style={{ fontSize: '0.75rem' }}>{evt.date}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, color: '#25D366' }}>
                        <Bell size={14} /> {reminderDateStr}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${status.code === 'DUE_TODAY' ? 'badge-urgent' : status.code === 'SCHEDULED' ? 'badge-homework' : 'badge-general'}`}>
                        {status.label}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn-secondary"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', background: '#25D366', color: 'white', border: 'none' }}
                        onClick={() => handleTestReminder(evt)}
                      >
                        <Send size={12} /> Test WhatsApp Alert
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Developer / Daemon Execution Info Box */}
        <div style={{ marginTop: '1.5rem', background: 'var(--bg-main)', padding: '1rem 1.25rem', borderRadius: '0.85rem', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.35rem' }}>
            <Terminal size={16} /> Automated 24/7 Node.js Background Scheduler Script:
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            A dedicated Node.js daemon (<code style={{ background: 'var(--bg-secondary)', padding: '2px 6px', borderRadius: '4px' }}>server/whatsapp-scheduler.js</code>) is included in your project root to run automated daily cron checks via Twilio / Meta WhatsApp API.
          </p>
          <div style={{ background: '#0f172a', color: '#38bdf8', padding: '0.6rem 1rem', borderRadius: '0.5rem', fontFamily: 'monospace', fontSize: '0.8rem' }}>
            cd server && npm install && npm start
          </div>
        </div>
      </div>
    </section>
  );
}
