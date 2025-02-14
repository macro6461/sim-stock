export interface ParamsState {
  availableTickers: string[];
  selectedTickers: string[];
  capital: number;
}

export interface StocksState {
  loading: boolean;
  initialStockData?: StockData[];
  stockData: StockData[];
  error: string | null;
  allocationData: StockAllocation;
  initialAllocationData?: {};
}

export interface StocksParams {
  tickers: string[];
  capital: string;
  isPro?: boolean;
}

export type StockAllocation = {
  [key: string]: {percent: number, cap: number};
};

export type IsChanged = {
  [key: string]: boolean;
};

export type GetStockDataResponse = {
  results: StockData[];
  allocationObject: StockAllocation;
}

export interface FirstStockData {
  data : {
    symbol: string;
    open: string;
    close: string;
    high: string; 
    low: string; 
    volume: string;
  };
  key: string;
}

export interface IndividualStockData {
  [key: string] : {
    symbol: string;
    open: string;
    close: string;
    high: string; 
    low: string; 
    volume: string;
  }
}

export interface TimeData {
  [key: string]: IndividualStockData;
}
  
export interface StockData {
  price: number;
  symbol: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  latestTradingDay: string;
  timeData: TimeData;
  prevClose: string;
  change: string;
  changePercent: string;
  alloc?: number;
  percentAlloc?: number;
  oneMonthRoi?: number;
  threeMonthRoi?: number;
  sixMonthRoi?: number | 'Upgrade';
  oneYearRoi?: number | 'Upgrade';
  fiveYearRoi?: number | 'Upgrade';
  allTimeRoi?: number | 'Upgrade';
}

export interface GenericObject {
  [key: string]: any
}

export interface SimStockError {
  code: number;
  message: string;
  details?: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  authErr?: SimStockError | null;
}

export interface User {
  id: string;
  username?: string;
  email: string;
  isPro: boolean;
}


export class MyStockData {
  price: number;
  symbol: string;
  open: string;
  high: string;
  low: string;
  volume: string;
  close: string;
  timeData: TimeData;
  latestTradingDay: string;
  change?: string;
  changePercent?: string;
  alloc?: number;
  percentAlloc?: number;
  oneMonthRoi?: number | string;
  threeMonthRoi?: number | string;
  sixMonthRoi?: number | string;
  oneYearRoi?: number | string;
  fiveYearRoi?: number | string;
  allTimeRoi?: number | string;
  
  constructor(data: Partial<StockData>) {
    this.price = data.price ?? 0;
    this.symbol = data.symbol ?? "";
    this.open = data.open ?? "";
    this.high = data.high ?? "";
    this.low = data.low ?? "";
    this.close = data.close ?? "";
    this.timeData = data.timeData ?? {};
    this.volume = data.volume ?? "";
    this.latestTradingDay = data.latestTradingDay ?? "";
    this.change = data.change ?? "";
    this.changePercent = data.changePercent ?? "";
    this.alloc = data.alloc;
    this.percentAlloc = data.percentAlloc;
    this.oneMonthRoi = data.oneMonthRoi;
    this.threeMonthRoi = data.threeMonthRoi;
    this.sixMonthRoi = data.sixMonthRoi;
    this.oneYearRoi = data.oneYearRoi;
    this.fiveYearRoi = data.fiveYearRoi;
    this.allTimeRoi = data.allTimeRoi;
  }
}