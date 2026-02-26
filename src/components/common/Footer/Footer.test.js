import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../../../utils/theme';
import Footer from './Footer';

describe('Footer Component', () => {
  const renderWithTheme = (component) => {
    return render(<ThemeProvider>{component}</ThemeProvider>);
  };

  test('renders email address', () => {
    renderWithTheme(<Footer />);
    const email = screen.getByText('arjunrao777@arjunlearn.co');
    expect(email).toBeInTheDocument();
  });

  test('renders About us link', () => {
    renderWithTheme(<Footer />);
    const aboutLink = screen.getByText('About us');
    expect(aboutLink).toBeInTheDocument();
  });

  test('renders Contact us link', () => {
    renderWithTheme(<Footer />);
    const contactLink = screen.getByText('Contact us');
    expect(contactLink).toBeInTheDocument();
  });

  test('renders Cookie settings link', () => {
    renderWithTheme(<Footer />);
    const cookieLink = screen.getByText('Cookie settings');
    expect(cookieLink).toBeInTheDocument();
  });

  test('About us link has href', () => {
    renderWithTheme(<Footer />);
    const aboutLink = screen.getByText('About us');
    expect(aboutLink).toHaveAttribute('href', '#');
  });

  test('footer has centered text alignment', () => {
    const { container } = renderWithTheme(<Footer />);
    const footer = container.querySelector('footer');
    expect(footer).toHaveStyle({
      textAlign: 'center',
      padding: '1rem',
    });
  });

  test('footer applies theme colors', () => {
    const { container } = renderWithTheme(<Footer />);
    const footer = container.querySelector('footer');
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveStyle({
      marginTop: 'auto',
    });
  });

  test('all footer links are rendered', () => {
    renderWithTheme(<Footer />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(3);
  });
});
