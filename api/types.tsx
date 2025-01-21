export interface ParamsState {
  availableTickers: string[];
  selectedTickers: string[];
  capital: number;
}

export interface StocksState {
  loading: boolean;
  stockData: StockData[]
  error: string | null;
}

export interface StocksParams {
  tickers: string[];
  capital: number;
}
  
export interface StockData {
  id: string;
  price: number;
  symbol: string;
  open: string;
  high: string;
  low: string;
  volume: string;
  latestTradingDay: string;
  prevClose: string;
  change: string;
  changePercent: string;
  alloc?: number;
  oneMonthRoiCapitalAlloc?: number;
  threeMonthRoiCapitalAlloc?: number;
  sixMonthRoiCapitalAlloc?: number;
  yearRoiCapitalAlloc?: number;
}

export interface SimStockError {
  code: number;
  message: string;
  details?: string;
}