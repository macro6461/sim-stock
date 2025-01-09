import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { stockApi, StockParams, StockData } from '../../api';


interface StockState {
    loading: boolean;
    stockData: StockData[]
    error: string | null;
}

const initialState: StockState = {
    loading: false,
    stockData: [],
    error: null
};

export const paramsSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {
    getStockData: (state, action: PayloadAction<[]>) => {
      state.stockData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStockData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStockData.fulfilled, (state, action) => {
        state.loading = false;
        state.stockData = action.payload;
      })
      .addCase(fetchStockData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch stock data';
      });
  },
});

export const fetchStockData = createAsyncThunk<StockData[], StockParams>(
  'stock/fetchStockData',
  async (params) => {
    return await stockApi.getStockData(params);
  }
);

export const {getStockData } = paramsSlice.actions;
export default paramsSlice.reducer;