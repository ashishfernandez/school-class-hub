import React from 'react';
import { ShieldCheck, Plus } from 'lucide-react';
import ThemeSelector from './ThemeSelector';

export default function Header({ classNameTitle, onOpenAdminPortal, themeMode, onToggleThemeMode }) {
  return (
    <header className="sticky-header">
      <div className="brand-badge">
        <div className="brand-icon-wrapper">
          <img src="/kangaroo.png" alt="KANGAROOS Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div>
          <h1 className="brand-title">KANGAROOS</h1>
          <div className="brand-subtitle">{classNameTitle}</div>
        </div>
      </div>

      <div className="header-actions">
        <ThemeSelector
          themeMode={themeMode}
          onToggleThemeMode={onToggleThemeMode}
        />

        <button
          className="btn-icon"
          onClick={onOpenAdminPortal}
          title="Parent Rep Admin Portal"
          style={{ borderRadius: 0 }}
        >
          <ShieldCheck size={18} style={{ color: 'var(--primary)' }} />
        </button>
      </div>
    </header>
  );
}
