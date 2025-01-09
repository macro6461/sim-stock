export interface StockParams {
    tickers: string[];
    capital: number;
  }
  
  export interface StockData {
    // Define your stock data structure
    id: string;
    price: number;
    // ... other fields
  }