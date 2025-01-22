import { StocksParams, StockData, StockAllocation, GetStockDataResponse } from './types';

const calcRoisForIndividualSecurity = (res: StockData, capital: number) =>{

}

const sanitizeStock = (stock: any) =>{
  return Object.fromEntries(
    Object.entries(stock).map(([key, value]) => [
      key.replace(/^\d+\.\s/, "").replace(/ (\w)/g, (_, char) => char.toUpperCase()),// Regex to remove numbers and dot
      value,
    ])
  ) as unknown as StockData;
}

export const stockApi = {
  async getStockData({ tickers, capital }: StocksParams): Promise<GetStockDataResponse> {
    try {
     // Make parallel requests for each ticker
     const promises = tickers.map(ticker => 
        fetch(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${import.meta.env.VITE_ALPHA_VANTAGE_API_KEY}`
        ).then(response => response.json())
      );

      let results = await Promise.all(promises);
      let defaultCapitalAlloc = Math.round(capital / results.length)
      let allocationObject: StockAllocation = {};
      results = results.map(result => {
        let res = sanitizeStock(result['Global Quote']);
        res['alloc'] = defaultCapitalAlloc
        let id = res['symbol'];
        allocationObject[id] = defaultCapitalAlloc
        return res
      })
      return {results, allocationObject}
    } catch (error) {
      throw new Error('Failed to fetch stock data');
    }
  }
};