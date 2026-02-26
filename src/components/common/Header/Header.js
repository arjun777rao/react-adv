import React from 'react';
import { useTheme } from '../../../utils/theme';

const Header = () => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <header
      style={{
        padding: '1rem',
        backgroundColor: theme.colors.headerBackground,
        color: theme.colors.text,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Arjun Learning Company</div>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Add User</button>
        <button
          onClick={toggleTheme}
          style={{
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            backgroundColor: isDark ? '#555' : '#ccc',
            border: '1px solid #999',
            color: theme.colors.text,
          }}
        >
          {isDark ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>
    </header>
  );
};

export default Header;
