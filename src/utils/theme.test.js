import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme } from './theme';

const TestComponent = () => {
  const { theme, toggleTheme, isDark } = useTheme();
  return (
    <div>
      <div data-testid="isDark">{isDark ? 'dark' : 'light'}</div>
      <div data-testid="background">{theme.colors.background}</div>
      <div data-testid="text">{theme.colors.text}</div>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};

describe('Theme Context', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('ThemeProvider renders children', () => {
    render(
      <ThemeProvider>
        <div>Test Content</div>
      </ThemeProvider>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('useTheme hook throws error outside provider', () => {
    // Silence console.error for this test
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useTheme must be used within ThemeProvider');

    consoleErrorSpy.mockRestore();
  });

  test('provides light theme by default', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('isDark')).toHaveTextContent('light');
    expect(screen.getByTestId('background')).toHaveTextContent('#ffffff');
    expect(screen.getByTestId('text')).toHaveTextContent('#000000');
  });

  test('toggleTheme changes to dark theme', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('isDark')).toHaveTextContent('light');
    
    fireEvent.click(screen.getByText('Toggle Theme'));
    
    expect(screen.getByTestId('isDark')).toHaveTextContent('dark');
    expect(screen.getByTestId('background')).toHaveTextContent('#1a1a1a');
  });

  test('toggleTheme switches back to light', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    fireEvent.click(screen.getByText('Toggle Theme'));
    expect(screen.getByTestId('isDark')).toHaveTextContent('dark');
    
    fireEvent.click(screen.getByText('Toggle Theme'));
    expect(screen.getByTestId('isDark')).toHaveTextContent('light');
  });

  test('saves theme to localStorage', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    fireEvent.click(screen.getByText('Toggle Theme'));
    
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  test('saves light theme to localStorage', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    fireEvent.click(screen.getByText('Toggle Theme')); // to dark
    expect(localStorage.getItem('theme')).toBe('dark');
    
    fireEvent.click(screen.getByText('Toggle Theme')); // to light
    expect(localStorage.getItem('theme')).toBe('light');
  });

  test('restores dark theme from localStorage', () => {
    localStorage.setItem('theme', 'dark');
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('isDark')).toHaveTextContent('dark');
  });

  test('dark theme has correct colors', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    fireEvent.click(screen.getByText('Toggle Theme'));
    
    expect(screen.getByTestId('background')).toHaveTextContent('#1a1a1a');
    expect(screen.getByTestId('text')).toHaveTextContent('#ffffff');
  });

  test('light theme headerBackground color', () => {
    const TestHeaderBg = () => {
      const { theme } = useTheme();
      return <div>{theme.colors.headerBackground}</div>;
    };

    render(
      <ThemeProvider>
        <TestHeaderBg />
      </ThemeProvider>
    );

    expect(screen.getByText('#f0f0f0')).toBeInTheDocument();
  });

  test('dark theme headerBackground is dark blue', () => {
    const TestHeaderBg = () => {
      const { theme, toggleTheme } = useTheme();
      return (
        <div>
          <div>{theme.colors.headerBackground}</div>
          <button onClick={toggleTheme}>Toggle</button>
        </div>
      );
    };

    render(
      <ThemeProvider>
        <TestHeaderBg />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByText('Toggle'));
    expect(screen.getByText('#003366')).toBeInTheDocument();
  });
});
