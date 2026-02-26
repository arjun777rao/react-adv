import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './features/users/usersSlice';
import App from './App';

const createMockStore = (initialState = { users: { list: [], status: 'idle', error: null } }) => {
  return configureStore({
    reducer: {
      users: usersReducer,
    },
    preloadedState: initialState,
  });
};

const renderWithProvider = (component) => {
  const store = createMockStore();
  return render(<Provider store={store}>{component}</Provider>);
};

describe('App Component', () => {
  test('renders App without crashing', () => {
    renderWithProvider(<App />);
    expect(screen.getByText('Arjun Learning Company')).toBeInTheDocument();
  });

  test('renders Header component', () => {
    renderWithProvider(<App />);
    expect(screen.getByText('Arjun Learning Company')).toBeInTheDocument();
    expect(screen.getByText('Add User')).toBeInTheDocument();
  });

  test('renders Footer component', () => {
    renderWithProvider(<App />);
    expect(screen.getByText('arjunrao777@arjunlearn.co')).toBeInTheDocument();
  });

  test('renders Root component with User List', () => {
    renderWithProvider(<App />);
    expect(screen.getByText('User List')).toBeInTheDocument();
  });

  test('renders theme toggle button in Header', () => {
    renderWithProvider(<App />);
    const themeBtn = screen.getByText(/Light|Dark/);
    expect(themeBtn).toBeInTheDocument();
  });

  test('App has proper structure with Header Root Footer', () => {
    const { container } = renderWithProvider(<App />);
    
    const appDiv = container.querySelector('.App');
    expect(appDiv).toBeInTheDocument();
    expect(appDiv).toHaveStyle({
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
    });
  });

  test('Header appears before Root', () => {
    const { container } = renderWithProvider(<App />);
    
    const header = container.querySelector('header');
    const userListHeading = screen.getByText('User List');
    
    expect(header.compareDocumentPosition(userListHeading)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING
    );
  });

  test('Footer appears after Root', () => {
    const { container } = renderWithProvider(<App />);
    
    const footer = container.querySelector('footer');
    const userListHeading = screen.getByText('User List');
    
    expect(footer.compareDocumentPosition(userListHeading)).toBe(
      Node.DOCUMENT_POSITION_PRECEDING
    );
  });

  test('all main sections are rendered', () => {
    const { container } = renderWithProvider(<App />);
    
    const header = container.querySelector('header');
    const footer = container.querySelector('footer');
    
    expect(header).toBeInTheDocument();
    expect(footer).toBeInTheDocument();
    expect(screen.getByText('User List')).toBeInTheDocument();
  });

  test('Footer links are present', () => {
    renderWithProvider(<App />);
    
    expect(screen.getByText('About us')).toBeInTheDocument();
    expect(screen.getByText('Contact us')).toBeInTheDocument();
    expect(screen.getByText('Cookie settings')).toBeInTheDocument();
  });

  test('App applies theme background color', () => {
    const { container } = renderWithProvider(<App />);
    
    const appDiv = container.querySelector('.App');
    expect(appDiv).toHaveStyle({
      backgroundColor: '#ffffff', // light theme default
      color: '#000000',
    });
  });
});
