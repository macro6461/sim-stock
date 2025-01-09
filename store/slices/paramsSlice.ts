import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ParamsState {
  availableTickers: string[];
  selectedTickers: string[];
  capital: number;
}

const initialState: ParamsState = {
  availableTickers: ["APPL", "GOOGL", "MSFT", "AMZN", "META", "TSLA", "NVDA", "ADBE", "NFLX", "PYPL", "CRM", "INTC", "CSCO", "QCOM", "AMD", "ASML"],
  selectedTickers: [],
  capital: 0,
};

export const paramsSlice = createSlice({
  name: 'params',
  initialState,
  reducers: {
    getAvailableTickers: (state, action: PayloadAction<string[]>) => {
      state.availableTickers = action.payload;
    },
    updateCapital: (state, action: PayloadAction<number>) => {
      state.capital = action.payload;
    },
    updateTickers: (state, action: PayloadAction<string[]>) => {
      state.selectedTickers = action.payload;
    },
  },
});

export const { getAvailableTickers, updateTickers, updateCapital } = paramsSlice.actions;
export default paramsSlice.reducer;