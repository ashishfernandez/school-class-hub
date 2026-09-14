import React from 'react';
import { Sparkles, Globe, School, Bell } from 'lucide-react';
import ThemeSelector from './ThemeSelector';

export default function Header({ classNameTitle, onOpenDomainGuide, themeMode, onToggleThemeMode, accentColor, onChangeAccent }) {
  return (
    <header className="sticky-header">
      <div className="brand-badge">
        <div className="brand-icon-wrapper">
          <School size={24} />
        </div>
        <div>
          <h1 className="brand-title">ClassConnect</h1>
          <div className="brand-subtitle">{classNameTitle}</div>
        </div>
      </div>

      <div className="header-actions">
        <ThemeSelector
          themeMode={themeMode}
          onToggleThemeMode={onToggleThemeMode}
          accentColor={accentColor}
          onChangeAccent={onChangeAccent}
        />

        <button className="btn-secondary" onClick={onOpenDomainGuide} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Globe size={16} style={{ color: 'var(--primary)' }} />
          <span>Connect GoDaddy Domain</span>
        </button>
      </div>
    </header>
  );
}
