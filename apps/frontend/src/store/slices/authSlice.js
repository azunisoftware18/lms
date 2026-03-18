import { createSlice } from "@reduxjs/toolkit";

const getStoredUser = () => {
  if (typeof window === "undefined") return null;

  try {
    const rawUser = localStorage.getItem("user");
    return rawUser ? JSON.parse(rawUser) : null;
  } catch {
    return null;
  }
};

const storedUser = getStoredUser();

const initialState = {
  user: storedUser,
  isAuthenticated: Boolean(storedUser),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },

    loginError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },

    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { loginStart, setUser, loginError, clearUser, clearError } =
  authSlice.actions;
export default authSlice.reducer;
