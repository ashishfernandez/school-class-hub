import React from 'react';
import { Globe, School } from 'lucide-react';
import ThemeSelector from './ThemeSelector';

export default function Header({ classNameTitle, onOpenDomainGuide, themeMode, onToggleThemeMode }) {
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

        <button className="btn-secondary" onClick={onOpenDomainGuide} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Globe size={16} style={{ color: 'var(--primary)' }} />
          <span>Connect GoDaddy Domain</span>
        </button>
      </div>
    </header>
  );
}
