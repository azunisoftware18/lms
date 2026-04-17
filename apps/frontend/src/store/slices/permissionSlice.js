import { createSlice } from "@reduxjs/toolkit";

const permissionSlice = createSlice({
  name: "permission",

  initialState: {
    selectedUserId: null,
    permissions: [],
    userPermissions: [],
    users: [],
    loading: false,
    error: null,
  },

  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUserId = action.payload;
    },

    clearSelectedUser: (state) => {
      state.selectedUserId = null;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },

    setPermissions: (state, action) => {
      state.permissions = action.payload;
      state.loading = false;
      state.error = null;
    },

    setUserPermissions: (state, action) => {
      state.userPermissions = Array.isArray(action.payload)
        ? action.payload
        : [];
      state.loading = false;
      state.error = null;
    },

    setUsers: (state, action) => {
      state.users = Array.isArray(action.payload) ? action.payload : [];
      state.loading = false;
      state.error = null;
    },

    addPermission: (state, action) => {
      state.permissions.push(action.payload);
      state.loading = false;
      state.error = null;
    },
  }
});

export const {
  setSelectedUser,
  clearSelectedUser,
  setLoading,
  setError,
  clearError,
  setPermissions,
  setUserPermissions,
  setUsers,
  addPermission,
} = permissionSlice.actions;

export default permissionSlice.reducer;



