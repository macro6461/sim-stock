import {createStore} from 'jotai';
import {paramsAtom} from './atoms/paramsAtom';
import {stocksAtom} from './atoms/stocksAtom';
import { ParamsState, StocksState, Totals } from '../api/types';

const initialParamsState: ParamsState = {
  availableTickers: ["APPL", "GOOGL", "MSFT", "AMZN", "META", "TSLA", "NVDA", "ADBE", "NFLX", "PYPL", "CRM", "INTC", "CSCO", "QCOM", "AMD", "ASML"],
  selectedTickers: [],
  capital: '0'
};

const initialTotals: Totals = {
  oneMonthRoi: { percent: 0, fiat: 0 },
  threeMonthRoi: { percent: 0, fiat: 0 },
  sixMonthRoi: { percent: 0, fiat: 0 },
  oneYearRoi: { percent: 0, fiat: 0 },
  fiveYearRoi: { percent: 0, fiat: 0 }
}

const initialStocksState: StocksState = {
  loading: false,
  stockData: [],
  allocationData: {},
  error: null,
  isReset: false,
  totals: initialTotals
};

export const store:any = createStore()

store.set(paramsAtom, initialParamsState)
store.set(stocksAtom, initialStocksState)