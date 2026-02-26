import React from 'react';
import { useTheme } from '../../../utils/theme';
import { useI18n } from '../../../utils/i18n';

const Footer = () => {
  const { theme } = useTheme();
  const { t } = useI18n();

  return (
    <footer
      style={{
        padding: '1rem',
        backgroundColor: theme.colors.footerBackground,
        color: theme.colors.text,
        textAlign: 'center',
        marginTop: 'auto',
      }}
    >
      <div>arjunrao777@arjunlearn.co</div>
      <div style={{ marginTop: '0.5rem' }}>
        <a href="#" style={{ margin: '0 0.5rem', color: theme.colors.text }}>{t('aboutUs')}</a>|
        <a href="#" style={{ margin: '0 0.5rem', color: theme.colors.text }}>{t('contactUs')}</a>|
        <a href="#" style={{ margin: '0 0.5rem', color: theme.colors.text }}>{t('cookieSettings')}</a>
      </div>
    </footer>
  );
};

export default Footer;
