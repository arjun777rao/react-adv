import React, { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers, selectAllUsers, selectUsersStatus } from '../../../features/users/usersSlice';
import { useTheme } from '../../../utils/theme';

const UserTable = () => {
  const { theme } = useTheme();
  const [filterText, setFilterText] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // pagination
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const dispatch = useDispatch();
  const users = useSelector(selectAllUsers);
  const usersStatus = useSelector(selectUsersStatus);

  useEffect(() => {
    if (usersStatus === 'idle') {
      dispatch(fetchUsers());
    }
  }, [usersStatus, dispatch]);

  const filteredUsers = useMemo(() => {
    let filtered = users;
    if (filterText) {
      const lower = filterText.toLowerCase();
      filtered = filtered.filter(u => {
        const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
        return (
          fullName.includes(lower) ||
          u.email.toLowerCase().includes(lower)
        );
      });
    }
    if (sortConfig.key) {
      const getValue = obj => {
        if (sortConfig.key.includes('.')) {
          return sortConfig.key.split('.').reduce((o, k) => (o ? o[k] : undefined), obj);
        }
        return obj[sortConfig.key];
      };
      filtered = [...filtered].sort((a, b) => {
        const va = getValue(a);
        const vb = getValue(b);
        if (va < vb) return sortConfig.direction === 'asc' ? -1 : 1;
        if (va > vb) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [users, filterText, sortConfig]);

  // when filter or pageSize change reset to first page
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filteredUsers.length, pageSize]);

  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;
  const pagedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const requestSort = key => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div style={{ padding: '1rem', flex: 1 }}>
      <h2 style={{ color: theme.colors.text }}>User List</h2>
      {usersStatus === 'loading' && <p>Loading users…</p>}
      {usersStatus === 'failed' && <p style={{ color: 'red' }}>Failed to load users.</p>}
      {usersStatus === 'succeeded' && (
      <>
      <div style={{ marginBottom: '0.5rem' }}>
        <label style={{ color: theme.colors.text }}>
          Filter:&nbsp;
          <input
            type="text"
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
            placeholder="Search by name or email"
            style={{
              padding: '0.5rem',
              backgroundColor: theme.isDark ? '#333' : '#fff',
              color: theme.colors.text,
              border: `1px solid ${theme.colors.tableBorder}`,
            }}
          />
        </label>
      </div>
      <div style={{ marginBottom: '0.5rem' }}>
        <label style={{ color: theme.colors.text }}>
          Page size:&nbsp;
          <select
            value={pageSize}
            onChange={e => setPageSize(Number(e.target.value))}
            style={{
              padding: '0.5rem',
              backgroundColor: theme.isDark ? '#333' : '#fff',
              color: theme.colors.text,
              border: `1px solid ${theme.colors.tableBorder}`,
            }}
          >
            {[5, 10, 15, 20].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="table-container">
        <table
          className="user-table"
          border="1"
          cellPadding="5"
          cellSpacing="0"
          style={{
            borderColor: theme.colors.tableBorder,
            backgroundColor: theme.colors.background,
            color: theme.colors.text,
          }}
        >
          <thead>
            <tr style={{ backgroundColor: theme.colors.tableHeader }}>
              <th onClick={() => requestSort('id')}>ID{sortConfig.key === 'id' ? (sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽') : ''}</th>
              <th onClick={() => requestSort('firstName')}>First Name{sortConfig.key === 'firstName' ? (sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽') : ''}</th>
              <th onClick={() => requestSort('lastName')}>Last Name{sortConfig.key === 'lastName' ? (sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽') : ''}</th>
              <th onClick={() => requestSort('email')}>Email{sortConfig.key === 'email' ? (sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽') : ''}</th>
              <th onClick={() => requestSort('age')}>Age{sortConfig.key === 'age' ? (sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽') : ''}</th>
              <th onClick={() => requestSort('phone')}>Phone{sortConfig.key === 'phone' ? (sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽') : ''}</th>
              <th onClick={() => requestSort('address.country')}>Country{sortConfig.key === 'address.country' ? (sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽') : ''}</th>
            </tr>
          </thead>
          <tbody>
            {pagedUsers.map(user => (
              <tr key={user.id} style={{ borderColor: theme.colors.tableBorder }}>
                <td>{user.id}</td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.age}</td>
                <td>{user.phone}</td>
                <td>{user.address?.country}</td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* pagination controls */}
      <div style={{ marginTop: '0.5rem', textAlign: 'center' }}>
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          style={{
            padding: '0.5rem 1rem',
            marginRight: '0.5rem',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            backgroundColor: theme.colors.headerBackground,
            color: theme.colors.text,
            border: `1px solid ${theme.colors.tableBorder}`,
          }}
        >
          Prev
        </button>
        {/* page number buttons */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            disabled={page === currentPage}
            style={{
              margin: '0 0.25rem',
              padding: '0.5rem 0.75rem',
              backgroundColor: page === currentPage ? theme.colors.tableHeader : theme.colors.headerBackground,
              color: theme.colors.text,
              border: `1px solid ${theme.colors.tableBorder}`,
              cursor: page === currentPage ? 'not-allowed' : 'pointer',
            }}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          style={{
            padding: '0.5rem 1rem',
            marginLeft: '0.5rem',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            backgroundColor: theme.colors.headerBackground,
            color: theme.colors.text,
            border: `1px solid ${theme.colors.tableBorder}`,
          }}
        >
          Next
        </button>
      </div>
      </>  
      )}
  </div>
  );
};

export default UserTable;
