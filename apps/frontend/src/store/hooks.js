export { useDispatch, useSelector } from 'react-redux'

// Auth hooks
export {
  setUser,
  setToken,
  logout,
  setLoading,
  setError,
  clearError,
} from '../store/slices/authSlice'

// UI hooks
export {
  toggleSidebar,
  setSidebarOpen,
  setTheme,
  addNotification,
  removeNotification,
  openModal,
  closeModal,
} from '../store/slices/uiSlice'
