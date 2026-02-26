import React from 'react';
import './App.scss';
import Header from './components/common/Header/Header';
import Footer from './components/common/Footer/Footer';
import UserTable from './components/features/UserTable/UserTable';
import { ThemeProvider, useTheme } from './utils/theme';
import { I18nProvider } from './utils/i18n';

function AppContent() {
  const { theme } = useTheme();

  return (
    <div
      className="App"
      style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header />
      <UserTable />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <I18nProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </I18nProvider>
  );
}

export default App;
