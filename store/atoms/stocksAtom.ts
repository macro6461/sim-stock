import {atom} from 'jotai';
import { stockApi, StocksParams, StockData, StocksState, SimStockError} from '../../api';

  
export const stocksAtom = atom<StocksState>({
    loading: false,
    stockData: [],
    error: null,
})

export const getStockData = atom((get)=> get(stocksAtom).stockData) 

// Asynchronous action atom for fetching stock data
export const fetchStockData = atom(
    null, // No read function, this is a write-only atom
    async (_get, set, req: StocksParams) => {
      try {
        // Set loading to true before starting the API request
        set(stocksAtom, (prev) => ({ ...prev, loading: true, error: null }));
  
        // Call the stockApi to fetch data
        const stockData = await stockApi.getStockData(req);
  
        // Update the state with the fetched data
        set(stocksAtom, (prev) => ({
          ...prev,
          loading: false,
          stockData,
          error: null,
        }));
      } catch (error: any) {
        // Handle errors and update the state accordingly
        set(stocksAtom, (prev) => ({
          ...prev,
          loading: false,
          error: error.message || 'Failed to fetch stock data',
        }));
      }
    }
  );

  