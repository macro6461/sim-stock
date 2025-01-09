import { configureStore } from '@reduxjs/toolkit';
import paramsReducer from './slices/paramsSlice';
import stocksReducer from './slices/stockSlice';
export const store = configureStore({
  reducer: {
    params: paramsReducer,
    stocks: stocksReducer,
    // Add your reducers here
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;