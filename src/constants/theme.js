/**
 * Theme Configuration
 */

export const LIGHT_THEME = {
  isDark: false,
  colors: {
    background: '#ffffff',
    text: '#000000',
    headerBackground: '#f0f0f0',
    footerBackground: '#f0f0f0',
    tableHeader: 'lightblue',
    tableBorder: '#ccc',
  },
};

export const DARK_THEME = {
  isDark: true,
  colors: {
    background: '#1a1a1a',
    text: '#ffffff',
    headerBackground: '#003366',
    footerBackground: '#2a2a2a',
    tableHeader: '#003366',
    tableBorder: '#555555',
  },
};

export const THEME_STORAGE_KEY = 'theme';
export const DARK_MODE_VALUE = 'dark';
export const LIGHT_MODE_VALUE = 'light';
