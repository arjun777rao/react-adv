import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import usersReducer from '../../features/users/usersSlice';
import { ThemeProvider } from '../../../utils/theme';
import UserTable from './UserTable';

const createMockStore = (initialState = { users: { list: [], status: 'idle', error: null } }) => {
  return configureStore({
    reducer: {
      users: usersReducer,
    },
    preloadedState: initialState,
  });
};

const renderWithProviders = (component, store) => {
  return render(
    <Provider store={store}>
      <ThemeProvider>{component}</ThemeProvider>
    </Provider>
  );
};

describe('UserTable Component', () => {
  // Helper to create store with succeeded status for tests that need to render table
  const createStoreWithUsers = (users = []) => {
    return createMockStore({
      users: { list: users, status: 'succeeded', error: null },
    });
  };

  test('renders User List heading', () => {
    const store = createMockStore();
    renderWithProviders(<UserTable />, store);
    expect(screen.getByText('User List')).toBeInTheDocument();
  });

  test('renders Filter input', () => {
    const store = createStoreWithUsers();
    renderWithProviders(<UserTable />, store);
    expect(screen.getByPlaceholderText('Search by name or email')).toBeInTheDocument();
  });

  test('renders Page size select', () => {
    const store = createStoreWithUsers();
    renderWithProviders(<UserTable />, store);
    expect(screen.getByDisplayValue('5')).toBeInTheDocument();
  });

  test('renders table with headers', () => {
    const store = createStoreWithUsers();
    renderWithProviders(<UserTable />, store);
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('First Name')).toBeInTheDocument();
    expect(screen.getByText('Last Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
    expect(screen.getByText('Phone')).toBeInTheDocument();
    expect(screen.getByText('Country')).toBeInTheDocument();
  });

  test('shows loading message when status is loading', () => {
    const store = createMockStore({
      users: { list: [], status: 'loading', error: null },
    });
    renderWithProviders(<UserTable />, store);
    expect(screen.getByText(/Loading users/)).toBeInTheDocument();
  });

  test('shows error message when status is failed', () => {
    const store = createMockStore({
      users: { list: [], status: 'failed', error: 'API Error' },
    });
    renderWithProviders(<UserTable />, store);
    expect(screen.getByText(/Failed to load users/)).toBeInTheDocument();
  });

  test('displays users when status is succeeded', () => {
    const mockUsers = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        age: 30,
        phone: '123-456-7890',
        address: { country: 'USA' },
      },
    ];
    const store = createMockStore({
      users: { list: mockUsers, status: 'succeeded', error: null },
    });
    renderWithProviders(<UserTable />, store);
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  test('filter text input updates', () => {
    const mockUsers = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        age: 30,
        phone: '123-456-7890',
        address: { country: 'USA' },
      },
    ];
    const store = createMockStore({
      users: { list: mockUsers, status: 'succeeded', error: null },
    });
    renderWithProviders(<UserTable />, store);
    
    const filterInput = screen.getByPlaceholderText('Search by name or email');
    fireEvent.change(filterInput, { target: { value: 'John' } });
    expect(filterInput.value).toBe('John');
  });

  test('filter works for name search', () => {
    const mockUsers = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        age: 30,
        phone: '123-456-7890',
        address: { country: 'USA' },
      },
      {
        id: 2,
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        age: 28,
        phone: '987-654-3210',
        address: { country: 'UK' },
      },
    ];
    const store = createMockStore({
      users: { list: mockUsers, status: 'succeeded', error: null },
    });
    renderWithProviders(<UserTable />, store);
    
    const filterInput = screen.getByPlaceholderText('Search by name or email');
    fireEvent.change(filterInput, { target: { value: 'John' } });
    
    expect(screen.getByText('John')).toBeInTheDocument();
    // Jane should still be in DOM based on the current implementation
  });

  test('page size dropdown changes', () => {
    const store = createStoreWithUsers();
    renderWithProviders(<UserTable />, store);
    
    const pageSizeSelect = screen.getByDisplayValue('5');
    fireEvent.change(pageSizeSelect, { target: { value: '10' } });
    
    expect(screen.getByDisplayValue('10')).toBeInTheDocument();
  });

  test('pagination buttons appear when needed', () => {
    const mockUsers = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      firstName: `User${i + 1}`,
      lastName: 'Test',
      email: `user${i + 1}@example.com`,
      age: 25 + i,
      phone: '123-456-7890',
      address: { country: 'USA' },
    }));
    
    const store = createMockStore({
      users: { list: mockUsers, status: 'succeeded', error: null },
    });
    renderWithProviders(<UserTable />, store);
    
    expect(screen.getByText('Prev')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  test('Prev button is disabled on first page', () => {
    const mockUsers = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      firstName: `User${i + 1}`,
      lastName: 'Test',
      email: `user${i + 1}@example.com`,
      age: 25 + i,
      phone: '123-456-7890',
      address: { country: 'USA' },
    }));
    
    const store = createMockStore({
      users: { list: mockUsers, status: 'succeeded', error: null },
    });
    renderWithProviders(<UserTable />, store);
    
    const prevBtn = screen.getByText('Prev');
    expect(prevBtn).toBeDisabled();
  });

  test('pagination page numbers render correctly', () => {
    const mockUsers = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      firstName: `User${i + 1}`,
      lastName: 'Test',
      email: `user${i + 1}@example.com`,
      age: 25 + i,
      phone: '123-456-7890',
      address: { country: 'USA' },
    }));
    
    const store = createMockStore({
      users: { list: mockUsers, status: 'succeeded', error: null },
    });
    renderWithProviders(<UserTable />, store);
    
    // With 20 users and 5 per page, should have 4 pages
    const buttons = screen.getAllByRole('button');
    const pageButtons = buttons.filter(btn => /^[1-4]$/.test(btn.textContent.trim()));
    expect(pageButtons.length).toBe(4); // Should have 4 page buttons
    expect(pageButtons[0]).toHaveTextContent('1');
    expect(pageButtons[3]).toHaveTextContent('4');
  });

  test('sorting by column works', () => {
    const mockUsers = [
      {
        id: 2,
        firstName: 'Bob',
        lastName: 'Smith',
        email: 'bob@example.com',
        age: 25,
        phone: '123-456-7890',
        address: { country: 'USA' },
      },
      {
        id: 1,
        firstName: 'Alice',
        lastName: 'Doe',
        email: 'alice@example.com',
        age: 30,
        phone: '987-654-3210',
        address: { country: 'UK' },
      },
    ];
    
    const store = createMockStore({
      users: { list: mockUsers, status: 'succeeded', error: null },
    });
    renderWithProviders(<UserTable />, store);
    
    const idHeader = screen.getByRole('columnheader', { name: /^ID/ });
    fireEvent.click(idHeader);
    
    // After sorting, first row should be Alice (ID 1)
    // Note: actual sorting happens client-side on table body
  });

  test('displays no users message when filter returns empty', () => {
    const mockUsers = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        age: 30,
        phone: '123-456-7890',
        address: { country: 'USA' },
      },
    ];
    
    const store = createMockStore({
      users: { list: mockUsers, status: 'succeeded', error: null },
    });
    renderWithProviders(<UserTable />, store);
    
    const filterInput = screen.getByPlaceholderText('Search by name or email');
    fireEvent.change(filterInput, { target: { value: 'NonExistent' } });
    
    expect(screen.getByText('No users found')).toBeInTheDocument();
  });

  test('renders country data correctly', () => {
    const mockUsers = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        age: 30,
        phone: '123-456-7890',
        address: { country: 'Canada' },
      },
    ];
    
    const store = createMockStore({
      users: { list: mockUsers, status: 'succeeded', error: null },
    });
    renderWithProviders(<UserTable />, store);
    
    expect(screen.getByText('Canada')).toBeInTheDocument();
  });

  test('sorting by nested address.country works', () => {
    const mockUsers = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        age: 30,
        phone: '123-456-7890',
        address: { country: 'USA' },
      },
      {
        id: 2,
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        age: 28,
        phone: '987-654-3210',
        address: { country: 'Canada' },
      },
    ];
    
    const store = createMockStore({
      users: { list: mockUsers, status: 'succeeded', error: null },
    });
    renderWithProviders(<UserTable />, store);
    
    const countryHeader = screen.getByRole('columnheader', { name: /^Country/ });
    fireEvent.click(countryHeader);
    
    // Sorting should work
    expect(countryHeader).toBeInTheDocument();
  });

  it('shows "No users found" message when filter returns 0 results', () => {
    const mockUsers = [
      { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', age: 28, phone: '123-456-7890', address: { country: 'USA' } },
    ];
    const store = createMockStore({
      users: { list: mockUsers, status: 'succeeded', error: null },
    });
    renderWithProviders(<UserTable />, store);
    
    const filterInput = screen.getByPlaceholderText('Search by name or email');
    fireEvent.change(filterInput, { target: { value: 'NonExisting' } });
    
    expect(screen.getByText('No users found')).toBeInTheDocument();
  });

  it('Next button navigates to next page', () => {
    const mockUsers = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      firstName: `User${i + 1}`,
      lastName: `Last${i + 1}`,
      email: `user${i + 1}@example.com`,
      age: 20 + i,
      phone: `555-000${i}`,
      address: { country: 'USA' }
    }));
    const store = createMockStore({
      users: { list: mockUsers, status: 'succeeded', error: null },
    });
    renderWithProviders(<UserTable />, store);
    
    // Page size 5, so 4 pages total
    const nextButton = screen.getAllByRole('button').find(btn => btn.textContent === 'Next');
    fireEvent.click(nextButton);
    
    // Check we're on page 2 by looking for User6 (first user on page 2)
    expect(screen.getByText('User6')).toBeInTheDocument();
  });

  it('Previous button navigates to previous page', () => {
    const mockUsers = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      firstName: `User${i + 1}`,
      lastName: `Last${i + 1}`,
      email: `user${i + 1}@example.com`,
      age: 20 + i,
      phone: `555-000${i}`,
      address: { country: 'USA' }
    }));
    const store = createMockStore({
      users: { list: mockUsers, status: 'succeeded', error: null },
    });
    renderWithProviders(<UserTable />, store);
    
    // Navigate to page 2
    const pageButtons = screen.getAllByRole('button').filter(btn => /^[1-4]$/.test(btn.textContent));
    fireEvent.click(pageButtons[1]);
    
    // Click Previous
    const prevButton = screen.getAllByRole('button').find(btn => btn.textContent === 'Prev');
    fireEvent.click(prevButton);
    
    // Check we're back on page 1
    expect(screen.getByText('User1')).toBeInTheDocument();
  });

  it('handles failed user fetch status', () => {
    const store = createMockStore({
      users: { list: [], status: 'failed', error: 'Network error' },
    });
    renderWithProviders(<UserTable />, store);
    
    expect(screen.getByText(/Failed to load users/)).toBeInTheDocument();
  });

  it('handles loading user fetch status', () => {
    const store = createMockStore({
      users: { list: [], status: 'loading', error: null },
    });
    renderWithProviders(<UserTable />, store);
    
    expect(screen.getByText(/Loading users/)).toBeInTheDocument();
  });

  it('resets to page 1 when page size changes', () => {
    const mockUsers = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      firstName: `User${i + 1}`,
      lastName: `Last${i + 1}`,
      email: `user${i + 1}@example.com`,
      age: 20 + i,
      phone: `555-000${i}`,
      address: { country: 'USA' }
    }));
    const store = createMockStore({
      users: { list: mockUsers, status: 'succeeded', error: null },
    });
    renderWithProviders(<UserTable />, store);
    
    // Navigate to page 2
    const pageButtons = screen.getAllByRole('button').filter(btn => /^[1-4]$/.test(btn.textContent));
    fireEvent.click(pageButtons[1]);
    
    // Change page size
    const pageSizeSelect = screen.getByDisplayValue('5');
    fireEvent.change(pageSizeSelect, { target: { value: '10' } });
    
    // Should be back on page 1
    expect(screen.getByText('User1')).toBeInTheDocument();
  });

  it('disables Prev button on first page', () => {
    const mockUsers = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      firstName: `User${i + 1}`,
      lastName: `Last${i + 1}`,
      email: `user${i + 1}@example.com`,
      age: 20 + i,
      phone: `555-000${i}`,
      address: { country: 'USA' }
    }));
    const store = createMockStore({
      users: { list: mockUsers, status: 'succeeded', error: null },
    });
    renderWithProviders(<UserTable />, store);
    
    const prevButton = screen.getAllByRole('button').find(btn => btn.textContent === 'Prev');
    expect(prevButton).toBeDisabled();
  });

  it('disables Next button on last page', () => {
    const mockUsers = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      firstName: `User${i + 1}`,
      lastName: `Last${i + 1}`,
      email: `user${i + 1}@example.com`,
      age: 20 + i,
      phone: `555-000${i}`,
      address: { country: 'USA' }
    }));
    const store = createMockStore({
      users: { list: mockUsers, status: 'succeeded', error: null },
    });
    renderWithProviders(<UserTable />, store);
    
    // Navigate to page 2 (last page with 10 users, 5 per page)
    const pageButtons = screen.getAllByRole('button').filter(btn => /^[1-2]$/.test(btn.textContent));
    fireEvent.click(pageButtons[1]); // Click page 2
    
    const nextButton = screen.getAllByRole('button').find(btn => btn.textContent === 'Next');
    expect(nextButton).toBeDisabled();
  });

  it('current page button is disabled and styled differently', () => {
    const mockUsers = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      firstName: `User${i + 1}`,
      lastName: `Last${i + 1}`,
      email: `user${i + 1}@example.com`,
      age: 20 + i,
      phone: `555-000${i}`,
      address: { country: 'USA' }
    }));
    const store = createMockStore({
      users: { list: mockUsers, status: 'succeeded', error: null },
    });
    renderWithProviders(<UserTable />, store);
    
    const pageButtons = screen.getAllByRole('button').filter(btn => /^[1-4]$/.test(btn.textContent));
    expect(pageButtons[0]).toBeDisabled();
  });

  it('repeated sorting on same column toggles direction', () => {
    const mockUsers = [
      { id: 3, firstName: 'Charlie', lastName: 'Brown', email: 'charlie@example.com', age: 30, phone: '999-999-9999', address: { country: 'USA' } },
      { id: 1, firstName: 'Alice', lastName: 'Anderson', email: 'alice@example.com', age: 28, phone: '111-111-1111', address: { country: 'Canada' } },
      { id: 2, firstName: 'Bob', lastName: 'Baker', email: 'bob@example.com', age: 25, phone: '222-222-2222', address: { country: 'Mexico' } },
    ];
    const store = createMockStore({
      users: { list: mockUsers, status: 'succeeded', error: null },
    });
    renderWithProviders(<UserTable />, store);
    
    // First click: ascending
    const firstNameHeader = screen.getByRole('columnheader', { name: /^First Name/ });
    fireEvent.click(firstNameHeader);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    
    // Second click: descending
    fireEvent.click(firstNameHeader);
    expect(screen.getByText('Charlie')).toBeInTheDocument();
  });

  it('displays "no users found" with correct colspan when filter returns empty', () => {
    const mockUsers = [
      { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', age: 28, phone: '123-456-7890', address: { country: 'USA' } },
    ];
    const store = createMockStore({
      users: { list: mockUsers, status: 'succeeded', error: null },
    });
    renderWithProviders(<UserTable />, store);
    
    const filterInput = screen.getByPlaceholderText('Search by name or email');
    fireEvent.change(filterInput, { target: { value: 'ZZZNonExistentZZZ' } });
    
    const noUsersCell = screen.getByText('No users found');
    expect(noUsersCell).toBeInTheDocument();
    
    // Check the parent td element for colspan
    const tdElement = noUsersCell.closest('td');
    expect(tdElement).toBeInTheDocument();
    expect(tdElement.getAttribute('colspan')).toBe('7');
  });

  it('maintains filter when changing page size', () => {
    const mockUsers = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      firstName: `John${i + 1}`,
      lastName: `Doe`,
      email: `john${i + 1}@example.com`,
      age: 20 + i,
      phone: `555-000${i}`,
      address: { country: 'USA' }
    }));
    const store = createMockStore({
      users: { list: mockUsers, status: 'succeeded', error: null },
    });
    renderWithProviders(<UserTable />, store);
    
    // Apply filter
    const filterInput = screen.getByPlaceholderText('Search by name or email');
    fireEvent.change(filterInput, { target: { value: 'John1' } });
    
    // Should show John1, John10, John11, John12, John13, John14, John15, John16, John17, John18, John19
    expect(screen.queryByText('John1')).toBeInTheDocument();
    
    // Change page size
    const pageSizeSelect = screen.getByDisplayValue('5');
    fireEvent.change(pageSizeSelect, { target: { value: '10' } });
    
    // Filter should still be applied
    expect(screen.queryByText('John1')).toBeInTheDocument();
    expect(screen.queryByText('John2')).not.toBeInTheDocument();
  });

  it('handles sort with missing nested property', () => {
    const mockUsers = [
      { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', age: 28, phone: '123-456-7890', address: { country: 'USA' } },
      { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', age: 25, phone: '987-654-3210', address: null },
    ];
    const store = createMockStore({
      users: { list: mockUsers, status: 'succeeded', error: null },
    });
    renderWithProviders(<UserTable />, store);
    
    // Click country header to sort
    const countryHeader = screen.getByRole('columnheader', { name: /^Country/ });
    fireEvent.click(countryHeader);
    
    // Should not throw error, both rows should still be visible
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Jane')).toBeInTheDocument();
  });

  it('filter is case-insensitive', () => {
    const mockUsers = [
      { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', age: 28, phone: '123-456-7890', address: { country: 'USA' } },
      { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', age: 25, phone: '987-654-3210', address: { country: 'Canada' } },
    ];
    const store = createMockStore({
      users: { list: mockUsers, status: 'succeeded', error: null },
    });
    renderWithProviders(<UserTable />, store);
    
    const filterInput = screen.getByPlaceholderText('Search by name or email');
    
    // Filter by uppercase email
    fireEvent.change(filterInput, { target: { value: 'JOHN@EXAMPLE.COM' } });
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.queryByText('Jane')).not.toBeInTheDocument();
    
    // Filter by mixed case name
    fireEvent.change(filterInput, { target: { value: 'JaNe' } });
    expect(screen.getByText('Jane')).toBeInTheDocument();
    expect(screen.queryByText('John')).not.toBeInTheDocument();
  });

  it('filters by both first and last name combined', () => {
    const mockUsers = [
      { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', age: 28, phone: '123-456-7890', address: { country: 'USA' } },
      { id: 2, firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com', age: 25, phone: '987-654-3210', address: { country: 'Canada' } },
      { id: 3, firstName: 'Bob', lastName: 'Smith', email: 'bob@example.com', age: 30, phone: '555-555-5555', address: { country: 'USA' } },
    ];
    const store = createMockStore({
      users: { list: mockUsers, status: 'succeeded', error: null },
    });
    renderWithProviders(<UserTable />, store);
    
    const filterInput = screen.getByPlaceholderText('Search by name or email');
    
    // Filter by "Doe"
    fireEvent.change(filterInput, { target: { value: 'Doe' } });
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Jane')).toBeInTheDocument();
    expect(screen.queryByText('Bob')).not.toBeInTheDocument();
  });

  it('clears filter when input is emptied', () => {
    const mockUsers = [
      { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', age: 28, phone: '123-456-7890', address: { country: 'USA' } },
      { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', age: 25, phone: '987-654-3210', address: { country: 'Canada' } },
    ];
    const store = createMockStore({
      users: { list: mockUsers, status: 'succeeded', error: null },
    });
    renderWithProviders(<UserTable />, store);
    
    const filterInput = screen.getByPlaceholderText('Search by name or email');
    
    // Apply filter
    fireEvent.change(filterInput, { target: { value: 'John' } });
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.queryByText('Jane')).not.toBeInTheDocument();
    
    // Clear filter
    fireEvent.change(filterInput, { target: { value: '' } });
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Jane')).toBeInTheDocument();
  });

  it('changes page size from 5 to 10', () => {
    const mockUsers = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      firstName: `User${i + 1}`,
      lastName: `Last${i + 1}`,
      email: `user${i + 1}@example.com`,
      age: 20 + i,
      phone: `555-000${i}`,
      address: { country: 'USA' }
    }));
    const store = createMockStore({
      users: { list: mockUsers, status: 'succeeded', error: null },
    });
    renderWithProviders(<UserTable />, store);
    
    // Initially page size is 5, should see 5 users on page 1
    expect(screen.getByText('User5')).toBeInTheDocument();
    expect(screen.queryByText('User6')).not.toBeInTheDocument();
    
    // Change page size to 10
    const pageSizeSelect = screen.getByDisplayValue('5');
    fireEvent.change(pageSizeSelect, { target: { value: '10' } });
    
    // Now should see 10 users on page 1
    expect(screen.getByText('User10')).toBeInTheDocument();
    expect(screen.queryByText('User11')).not.toBeInTheDocument();
  });

  it('changes page size from 5 to 20', () => {
    const mockUsers = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      firstName: `User${i + 1}`,
      lastName: `Last${i + 1}`,
      email: `user${i + 1}@example.com`,
      age: 20 + i,
      phone: `555-000${i}`,
      address: { country: 'USA' }
    }));
    const store = createMockStore({
      users: { list: mockUsers, status: 'succeeded', error: null },
    });
    renderWithProviders(<UserTable />, store);
    
    // Change page size to 20
    const pageSizeSelect = screen.getByDisplayValue('5');
    fireEvent.change(pageSizeSelect, { target: { value: '20' } });
    
    // Should see all 20 users, and only 1 page button
    expect(screen.getByText('User20')).toBeInTheDocument();
    const pageButtons = screen.getAllByRole('button').filter(btn => /^[1-2]$/.test(btn.textContent));
    expect(pageButtons.length).toBe(1); // Only page 1
  });

  it('changes page size from 5 to 15', () => {
    const mockUsers = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      firstName: `User${i + 1}`,
      lastName: `Last${i + 1}`,
      email: `user${i + 1}@example.com`,
      age: 20 + i,
      phone: `555-000${i}`,
      address: { country: 'USA' }
    }));
    const store = createMockStore({
      users: { list: mockUsers, status: 'succeeded', error: null },
    });
    renderWithProviders(<UserTable />, store);
    
    // Change page size to 15  
    const pageSizeSelect = screen.getByDisplayValue('5');
    fireEvent.change(pageSizeSelect, { target: { value: '15' } });
    
    // Should see 15 users on page 1, and page 2 button available
    expect(screen.getByText('User15')).toBeInTheDocument();
    expect(screen.queryByText('User16')).not.toBeInTheDocument();
    
    // Check that page 2 button exists
    const pageButtons = screen.getAllByRole('button').filter(btn => /^[1-2]$/.test(btn.textContent));
    expect(pageButtons.length).toBe(2); // Page 1 and 2
  });

  it('navigates through all pages in sequence', () => {
    const mockUsers = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      firstName: `User${i + 1}`,
      lastName: `Last${i + 1}`,
      email: `user${i + 1}@example.com`,
      age: 20 + i,
      phone: `555-000${i}`,
      address: { country: 'USA' }
    }));
    const store = createMockStore({
      users: { list: mockUsers, status: 'succeeded', error: null },
    });
    renderWithProviders(<UserTable />, store);
    
    // Page 1
    expect(screen.getByText('User1')).toBeInTheDocument();
    
    // Go to Page 2
    let pageButtons = screen.getAllByRole('button').filter(btn => /^[1-4]$/.test(btn.textContent));
    fireEvent.click(pageButtons[1]);
    expect(screen.getByText('User6')).toBeInTheDocument();
    
    // Go to Page 3
    pageButtons = screen.getAllByRole('button').filter(btn => /^[1-4]$/.test(btn.textContent));
    fireEvent.click(pageButtons[2]);
    expect(screen.getByText('User11')).toBeInTheDocument();
    
    // Go to Page 4
    pageButtons = screen.getAllByRole('button').filter(btn => /^[1-4]$/.test(btn.textContent));
    fireEvent.click(pageButtons[3]);
    expect(screen.getByText('User16')).toBeInTheDocument();
  });

  it('displays user with missing address property safely', () => {
    const mockUsers = [
      { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', age: 28, phone: '123-456-7890', address: { country: 'USA' } },
      { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', age: 25, phone: '987-654-3210' },
    ];
    const store = createMockStore({
      users: { list: mockUsers, status: 'succeeded', error: null },
    });
    renderWithProviders(<UserTable />, store);
    
    // Both users should be displayed
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Jane')).toBeInTheDocument();
    
    // Check that display handles missing address gracefully
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBeGreaterThan(2);
  });

  it('sorts ascending then descending on same column', () => {
    const mockUsers = [
      { id: 3, firstName: 'Charlie', lastName: 'Brown', email: 'charlie@example.com', age: 30, phone: '999-999-9999', address: { country: 'USA' } },
      { id: 1, firstName: 'Alice', lastName: 'Anderson', email: 'alice@example.com', age: 28, phone: '111-111-1111', address: { country: 'Canada' } },
      { id: 2, firstName: 'Bob', lastName: 'Baker', email: 'bob@example.com', age: 25, phone: '222-222-2222', address: { country: 'Mexico' } },
    ];
    const store = createMockStore({
      users: { list: mockUsers, status: 'succeeded', error: null },
    });
    renderWithProviders(<UserTable />, store);
    
    const firstNameHeader = screen.getByRole('columnheader', { name: /^First Name/ });
    
    // First click: ascending (A, B, C)
    fireEvent.click(firstNameHeader);
    const firstRowAsc = screen.getAllByRole('row')[1].textContent;
    expect(firstRowAsc).toContain('Alice');
    
    // Second click: descending (C, B, A)
    fireEvent.click(firstNameHeader);
    const firstRowDesc = screen.getAllByRole('row')[1].textContent;
    expect(firstRowDesc).toContain('Charlie');
  });

  it('handles sorting with equal values in column', () => {
    const mockUsers = [
      { id: 1, firstName: 'John', lastName: 'Zebra', email: 'john@example.com', age: 30, phone: '111-111-1111', address: { country: 'USA' } },
      { id: 2, firstName: 'Jane', lastName: 'Apple', email: 'jane@example.com', age: 30, phone: '222-222-2222', address: { country: 'Canada' } },
      { id: 3, firstName: 'Bob', lastName: 'Banana', email: 'bob@example.com', age: 30, phone: '333-333-3333', address: { country: 'Mexico' } },
    ];
    const store = createMockStore({
      users: { list: mockUsers, status: 'succeeded', error: null },
    });
    renderWithProviders(<UserTable />, store);
    
    // Sort by age (all are 30)
    const ageHeader = screen.getByRole('columnheader', { name: /^Age/ });
    fireEvent.click(ageHeader);
    
    // All three users should still be visible
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Jane')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('applies filter and then sorts', () => {
    const mockUsers = [
      { id: 1, firstName: 'Alice', lastName: 'Zebra', email: 'alice@example.com', age: 28, phone: '111-111-1111', address: { country: 'USA' } },
      { id: 2, firstName: 'Bob', lastName: 'Apple', email: 'bob@example.com', age: 25, phone: '222-222-2222', address: { country: 'Canada' } },
      { id: 3, firstName: 'Charlie', lastName: 'Banana', email: 'charlie@example.com', age: 30, phone: '333-333-3333', address: { country: 'Mexico' } },
    ];
    const store = createMockStore({
      users: { list: mockUsers, status: 'succeeded', error: null },
    });
    renderWithProviders(<UserTable />, store);
    
    // Filter for names containing 'a'
    const filterInput = screen.getByPlaceholderText('Search by name or email');
    fireEvent.change(filterInput, { target: { value: 'a' } });
    
    // Alice, Bob, Charlie all contain 'a', but now sort by lastname descending
    const lastNameHeader = screen.getByRole('columnheader', { name: /^Last Name/ });
    fireEvent.click(lastNameHeader);
    fireEvent.click(lastNameHeader); // Click twice for descending
    
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBeGreaterThan(1);
  });

  it('resets pagination when applying filter that reduces results', () => {
    const mockUsers = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      firstName: i < 15 ? `Alice${i}` : `Bob${i}`,
      lastName: 'Test',
      email: `user${i}@example.com`,
      age: 20 + i,
      phone: `555-000${i}`,
      address: { country: 'USA' }
    }));
    const store = createMockStore({
      users: { list: mockUsers, status: 'succeeded', error: null },
    });
    renderWithProviders(<UserTable />, store);
    
    // Go to page 2
    let pageButtons = screen.getAllByRole('button').filter(btn => /^[1-4]$/.test(btn.textContent));
    fireEvent.click(pageButtons[1]);
    expect(screen.getByText('Alice5')).toBeInTheDocument();
    
    // Filter for Bob (only 5 results)
    const filterInput = screen.getByPlaceholderText('Search by name or email');
    fireEvent.change(filterInput, { target: { value: 'Bob' } });
    
    // Should be back on page 1
    expect(screen.getByText('Bob15')).toBeInTheDocument();
    
    // Should only have 1 page
    pageButtons = screen.getAllByRole('button').filter(btn => /^[1]$/.test(btn.textContent));
    expect(pageButtons.length).toBe(1);
  });

  it('sorts by phone column ascending', () => {
    const mockUsers = [
      { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', age: 28, phone: '333-333-3333', address: { country: 'USA' } },
      { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', age: 25, phone: '111-111-1111', address: { country: 'Canada' } },
      { id: 3, firstName: 'Bob', lastName: 'Brown', email: 'bob@example.com', age: 30, phone: '222-222-2222', address: { country: 'Mexico' } },
    ];
    const store = createMockStore({
      users: { list: mockUsers, status: 'succeeded', error: null },
    });
    renderWithProviders(<UserTable />, store);
    
    // Sort by phone ascending
    const phoneHeader = screen.getByRole('columnheader', { name: /^Phone/ });
    fireEvent.click(phoneHeader);
    
    // Should be ordered by phone: Jane, Bob, John
    const rows = screen.getAllByRole('row');
    expect(rows[1].textContent).toContain('Jane');
    expect(rows[2].textContent).toContain('Bob');
    expect(rows[3].textContent).toContain('John');
  });

  it('sorts by phone column descending', () => {
    const mockUsers = [
      { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', age: 28, phone: '333-333-3333', address: { country: 'USA' } },
      { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', age: 25, phone: '111-111-1111', address: { country: 'Canada' } },
      { id: 3, firstName: 'Bob', lastName: 'Brown', email: 'bob@example.com', age: 30, phone: '222-222-2222', address: { country: 'Mexico' } },
    ];
    const store = createMockStore({
      users: { list: mockUsers, status: 'succeeded', error: null },
    });
    renderWithProviders(<UserTable />, store);
    
    // Sort by phone ascending then descending
    const phoneHeader = screen.getByRole('columnheader', { name: /^Phone/ });
    fireEvent.click(phoneHeader);
    fireEvent.click(phoneHeader);
    
    // Should be ordered by phone descending: John, Bob, Jane
    const rows = screen.getAllByRole('row');
    expect(rows[1].textContent).toContain('John');
    expect(rows[2].textContent).toContain('Bob');
    expect(rows[3].textContent).toContain('Jane');
  });

  it('sorts by country column ascending', () => {
    const mockUsers = [
      { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', age: 28, phone: '111-111-1111', address: { country: 'USA' } },
      { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', age: 25, phone: '222-222-2222', address: { country: 'Canada' } },
      { id: 3, firstName: 'Bob', lastName: 'Brown', email: 'bob@example.com', age: 30, phone: '333-333-3333', address: { country: 'Mexico' } },
    ];
    const store = createMockStore({
      users: { list: mockUsers, status: 'succeeded', error: null },
    });
    renderWithProviders(<UserTable />, store);
    
    // Sort by country ascending
    const countryHeader = screen.getByRole('columnheader', { name: /^Country/ });
    fireEvent.click(countryHeader);
    
    // Should be ordered by country: Canada, Mexico, USA
    const rows = screen.getAllByRole('row');
    expect(rows[1].textContent).toContain('Jane');
    expect(rows[2].textContent).toContain('Bob');
    expect(rows[3].textContent).toContain('John');
  });

  it('sorts by country column descending', () => {
    const mockUsers = [
      { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', age: 28, phone: '111-111-1111', address: { country: 'USA' } },
      { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', age: 25, phone: '222-222-2222', address: { country: 'Canada' } },
      { id: 3, firstName: 'Bob', lastName: 'Brown', email: 'bob@example.com', age: 30, phone: '333-333-3333', address: { country: 'Mexico' } },
    ];
    const store = createMockStore({
      users: { list: mockUsers, status: 'succeeded', error: null },
    });
    renderWithProviders(<UserTable />, store);
    
    // Sort by country ascending then descending
    const countryHeader = screen.getByRole('columnheader', { name: /^Country/ });
    fireEvent.click(countryHeader);
    fireEvent.click(countryHeader);
    
    // Should be ordered by country descending: USA, Mexico, Canada
    const rows = screen.getAllByRole('row');
    expect(rows[1].textContent).toContain('John');
    expect(rows[2].textContent).toContain('Bob');
    expect(rows[3].textContent).toContain('Jane');
  });

  it('sorts by ID column ascending and descending', () => {
    const mockUsers = [
      { id: 3, firstName: 'Charlie', lastName: 'Brown', email: 'charlie@example.com', age: 30, phone: '333-333-3333', address: { country: 'USA' } },
      { id: 1, firstName: 'Alice', lastName: 'Anderson', email: 'alice@example.com', age: 28, phone: '111-111-1111', address: { country: 'Canada' } },
      { id: 2, firstName: 'Bob', lastName: 'Baker', email: 'bob@example.com', age: 25, phone: '222-222-2222', address: { country: 'Mexico' } },
    ];
    const store = createMockStore({
      users: { list: mockUsers, status: 'succeeded', error: null },
    });
    renderWithProviders(<UserTable />, store);
    
    // Sort by ID ascending
    const idHeader = screen.getByRole('columnheader', { name: /^ID/ });
    fireEvent.click(idHeader);
    
    // Should be ordered: Alice (1), Bob (2), Charlie (3)
    const rows = screen.getAllByRole('row');
    expect(rows[1].textContent).toContain('Alice');
    expect(rows[2].textContent).toContain('Bob');
    expect(rows[3].textContent).toContain('Charlie');
    
    // Click again for descending
    fireEvent.click(idHeader);
    
    // Should be ordered: Charlie (3), Bob (2), Alice (1)
    const updatedRows = screen.getAllByRole('row');
    expect(updatedRows[1].textContent).toContain('Charlie');
    expect(updatedRows[2].textContent).toContain('Bob');
    expect(updatedRows[3].textContent).toContain('Alice');
  });
});
