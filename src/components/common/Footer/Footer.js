import React from 'react';
import { useTheme } from '../../../utils/theme';

const Footer = () => {
  const { theme } = useTheme();

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
        <a href="#" style={{ margin: '0 0.5rem', color: theme.colors.text }}>About us</a>|
        <a href="#" style={{ margin: '0 0.5rem', color: theme.colors.text }}>Contact us</a>|
        <a href="#" style={{ margin: '0 0.5rem', color: theme.colors.text }}>Cookie settings</a>
      </div>
    </footer>
  );
};

export default Footer;
