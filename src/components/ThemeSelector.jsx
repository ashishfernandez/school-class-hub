import React from 'react';
import { Sun, Moon, Palette } from 'lucide-react';

export default function ThemeSelector({ themeMode, onToggleThemeMode, accentColor, onChangeAccent }) {
  const accents = [
    { id: 'sunburst', label: 'Sunburst Gold', color: '#f59e0b' },
    { id: 'ocean', label: 'Ocean Cyan', color: '#06b6d4' },
    { id: 'neon', label: 'Electric Pink', color: '#ec4899' },
    { id: 'emerald', label: 'Emerald Mint', color: '#10b981' },
    { id: 'cosmic', label: 'Cosmic Violet', color: '#8b5cf6' }
  ];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      {/* Light / Dark Mode Toggle */}
      <button
        className="btn-icon"
        onClick={onToggleThemeMode}
        title={`Switch to ${themeMode === 'dark' ? 'Light' : 'Dark'} Mode`}
      >
        {themeMode === 'dark' ? <Sun size={18} style={{ color: '#f59e0b' }} /> : <Moon size={18} style={{ color: '#6366f1' }} />}
      </button>

      {/* Accent Color Palette Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'var(--bg-secondary)', padding: '4px 8px', borderRadius: '0.85rem', border: '1px solid var(--border-color)' }}>
        <Palette size={14} style={{ color: 'var(--text-muted)', marginRight: '2px' }} />
        {accents.map((acc) => (
          <button
            key={acc.id}
            onClick={() => onChangeAccent(acc.id)}
            style={{
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              background: acc.color,
              border: accentColor === acc.id ? '2px solid var(--text-main)' : 'none',
              cursor: 'pointer',
              transform: accentColor === acc.id ? 'scale(1.2)' : 'scale(1)',
              transition: 'transform 0.2s ease'
            }}
            title={acc.label}
          />
        ))}
      </div>
    </div>
  );
}
