import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
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
    },

    loginError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});
export const { loginStart, setUser, loginError, clearUser } = authSlice.actions;

export default authSlice.reducer;
