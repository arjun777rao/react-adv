import React from 'react';
import { useTheme } from '../../../utils/theme';
import { useI18n } from '../../../utils/i18n';

const Header = () => {
  const { theme, toggleTheme, isDark } = useTheme();
  const { language, setLanguage, t } = useI18n();

  return (
    <header
      style={{
        padding: '1rem',
        backgroundColor: theme.colors.headerBackground,
        color: theme.colors.text,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        rowGap: '0.75rem',
      }}
    >
      <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Arjun Learning Company</div>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>{t('language')}:</span>
          <select
            aria-label={t('language')}
            value={language}
            onChange={e => setLanguage(e.target.value)}
            style={{
              padding: '0.45rem',
              backgroundColor: isDark ? '#555' : '#fff',
              color: theme.colors.text,
              border: `1px solid ${theme.colors.tableBorder}`,
            }}
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="de">Deutsch</option>
            <option value="zh">中文</option>
          </select>
        </label>
        <button style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>{t('addUser')}</button>
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
          {isDark ? `☀️ ${t('light')}` : `🌙 ${t('dark')}`}
        </button>
      </div>
    </header>
  );
};

export default Header;
