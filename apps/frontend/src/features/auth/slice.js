import { createSlice } from '@reduxjs/toolkit';

const storageKey = 'auth_user';
const savedUser = localStorage.getItem(storageKey);

const initialState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  isAuthenticated: Boolean(savedUser),
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStarted: (state) => {
      state.status = 'loading';
      state.error = null;
    },
    loginSucceeded: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.status = 'succeeded';
      state.error = null;
      localStorage.setItem(storageKey, JSON.stringify(action.payload));
    },
    loginFailed: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    clearAuthError: (state) => {
      state.error = null;
      if (state.status === 'failed') {
        state.status = 'idle';
      }
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem(storageKey);
    },
  },
});

export const { loginStarted, loginSucceeded, loginFailed, clearAuthError, logout } = authSlice.actions;

export default authSlice.reducer;
