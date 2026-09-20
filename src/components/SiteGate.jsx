import React, { useState } from 'react';
import { Lock, KeyRound, AlertCircle, Unlock } from 'lucide-react';

const SITE_PASSWORD = 'lifeisgood';

/**
 * Full-screen password gate shown before the site is revealed.
 *
 * NOTE: This is a client-side gate. It keeps casual visitors out, but is not
 * cryptographically secure (the app bundle is still downloaded). For true
 * protection use Vercel Deployment Protection or real authentication.
 */
export default function SiteGate({ onUnlock }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === SITE_PASSWORD) {
      setError('');
      onUnlock();
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        background: 'var(--bg-main, #1f2022)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          background: 'var(--card-bg, #2b2d2f)',
          color: 'var(--text-main, #ffffff)',
          border: '1px solid var(--border-color, #44474b)',
          padding: '2rem',
          boxShadow: 'var(--shadow-lg, 0 12px 30px rgba(0,0,0,0.7))',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <img
            src="/kangaroo.png"
            alt="KANGAROOS"
            style={{ width: '56px', height: '56px', objectFit: 'contain' }}
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lock size={20} style={{ color: 'var(--primary)' }} />
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>Class Events Site</h1>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary, #94a3b8)', lineHeight: 1.5, margin: 0 }}>
            This site is password protected. Please enter the password to continue.
          </p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#ef4444', padding: '0.75rem 1rem', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <KeyRound size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted, #64748b)' }} />
            <input
              type="password"
              className="form-input"
              style={{ paddingLeft: '38px', width: '100%' }}
              placeholder="Enter password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              required
            />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            <Unlock size={16} /> Enter Site
          </button>
        </form>
      </div>
    </div>
  );
}
