import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

const lightTheme = {
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

const darkTheme = {
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

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  // Restore theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(prev => {
      const newValue = !prev;
      localStorage.setItem('theme', newValue ? 'dark' : 'light');
      return newValue;
    });
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};
