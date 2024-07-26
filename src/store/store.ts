import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authService } from './services/authService';
import userReducer from './userSlice'; 
import { apiService } from './services/apiService';

export const store = configureStore({
  reducer: {
    [authService.reducerPath]: authService.reducer,
    user: userReducer,
    [apiService.reducerPath]: apiService.reducer,
  
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authService.middleware).concat(apiService.middleware),
});



setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
