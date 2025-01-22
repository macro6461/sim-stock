import {createStore} from 'jotai';
import {paramsAtom} from './atoms/paramsAtom';
import {stocksAtom} from './atoms/stocksAtom';
import { ParamsState, StocksState } from '../api/types';

const initialParamsState: ParamsState = {
  availableTickers: ["APPL", "GOOGL", "MSFT", "AMZN", "META", "TSLA", "NVDA", "ADBE", "NFLX", "PYPL", "CRM", "INTC", "CSCO", "QCOM", "AMD", "ASML"],
  selectedTickers: [],
  capital: 0,
};

const initialStocksState: StocksState = {
  loading: false,
  stockData: [],
  allocationData: {},
  error: null
};

export const store = createStore()

store.set(paramsAtom, initialParamsState)
store.set(stocksAtom, initialStocksState)