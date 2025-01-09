import { StockParams, StockData } from './types';

export const stockApi = {
  async getStockData({ tickers }: StockParams): Promise<StockData[]> {
    debugger
    try {
     // Make parallel requests for each ticker
     const promises = tickers.map(ticker => 
        fetch(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${import.meta.env.VITE_ALPHA_VANTAGE_API_KEY}`
        ).then(response => response.json())
      );

      const results = await Promise.all(promises);
      return results.map(result => result['Global Quote']);
    } catch (error) {
      throw new Error('Failed to fetch stock data');
    }
  }
};