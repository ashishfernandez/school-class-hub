import React from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeSelector({ themeMode, onToggleThemeMode }) {
  return (
    <button
      className="btn-icon"
      onClick={onToggleThemeMode}
      title={`Switch to ${themeMode === 'dark' ? 'Light' : 'Dark'} Mode`}
      style={{ borderRadius: 0 }}
    >
      {themeMode === 'dark' ? <Sun size={18} style={{ color: '#f59e0b' }} /> : <Moon size={18} style={{ color: '#6366f1' }} />}
    </button>
  );
}
