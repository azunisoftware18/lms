import { configureStore } from '@reduxjs/toolkit';
import appReducer from '../features/app/slice';
import authReducer from '../features/auth/slice';

const store = configureStore({
  reducer: {
    app: appReducer,
    auth: authReducer,
  },
});

export default store;
