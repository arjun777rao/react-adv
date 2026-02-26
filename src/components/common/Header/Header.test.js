import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '../../../utils/theme';
import Header from './Header';

describe('Header Component', () => {
  const renderWithTheme = (component) => {
    return render(<ThemeProvider>{component}</ThemeProvider>);
  };

  test('renders company name', () => {
    renderWithTheme(<Header />);
    const companyName = screen.getByText('Arjun Learning Company');
    expect(companyName).toBeInTheDocument();
  });

  test('renders Add User button', () => {
    renderWithTheme(<Header />);
    const addUserBtn = screen.getByText('Add User');
    expect(addUserBtn).toBeInTheDocument();
  });

  test('renders theme toggle button', () => {
    renderWithTheme(<Header />);
    const themeBtn = screen.getByText(/Light|Dark/);
    expect(themeBtn).toBeInTheDocument();
  });

  test('theme toggle button shows Dark by default (light mode)', () => {
    renderWithTheme(<Header />);
    const themeBtn = screen.getByText('🌙 Dark');
    expect(themeBtn).toBeInTheDocument();
  });

  test('theme toggle button is clickable', () => {
    renderWithTheme(<Header />);
    const themeBtn = screen.getByText('🌙 Dark');
    fireEvent.click(themeBtn);
    // After clicking, it should show Light (because we toggled to dark mode)
    expect(screen.getByText('☀️ Light')).toBeInTheDocument();
  });

  test('header has flex layout with space-between', () => {
    const { container } = renderWithTheme(<Header />);
    const header = container.querySelector('header');
    expect(header).toHaveStyle({
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    });
  });

  test('header applies theme colors', () => {
    const { container } = renderWithTheme(<Header />);
    const header = container.querySelector('header');
    expect(header).toHaveStyle({
      padding: '1rem',
    });
  });
});
