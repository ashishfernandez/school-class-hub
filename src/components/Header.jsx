import React from 'react';
import { ShieldCheck, Plus } from 'lucide-react';
import ThemeSelector from './ThemeSelector';

export default function Header({ classNameTitle, onOpenAdminPortal, themeMode, onToggleThemeMode }) {
  return (
    <header className="sticky-header">
      <div className="brand-badge">
        <div className="brand-icon-wrapper">
          <img src="/favicon.svg" alt="GISSVROOS Logo" style={{ width: '28px', height: '28px' }} />
        </div>
        <div>
          <h1 className="brand-title">GISSVROOS</h1>
          <div className="brand-subtitle">{classNameTitle}</div>
        </div>
      </div>

      <div className="header-actions">
        <ThemeSelector
          themeMode={themeMode}
          onToggleThemeMode={onToggleThemeMode}
        />

        <button className="btn-primary" onClick={onOpenAdminPortal} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={18} />
          <span>Admin Portal</span>
        </button>
      </div>
    </header>
  );
}
