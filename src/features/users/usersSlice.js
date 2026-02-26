import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// async thunk to fetch user list
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await fetch('https://dummyjson.com/users');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  // API returns { users: [...] }
  return data.users;
});

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    list: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchUsers.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default usersSlice.reducer;

// selectors
export const selectAllUsers = state => state.users.list;
export const selectUsersStatus = state => state.users.status;
export const selectUsersError = state => state.users.error;
