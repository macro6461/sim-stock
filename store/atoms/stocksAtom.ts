import {atom} from 'jotai';
import { StockAllocation, stockApi, StocksParams, StocksState} from '../../api';
import {getCurrentCapital} from './paramsAtom'

  
export const stocksAtom = atom<StocksState>({
    loading: false,
    stockData: [],
    allocationData: {},
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
        const {results, allocationObject} = await stockApi.getStockData(req);
  
        // Update the state with the fetched data
        set(stocksAtom, (prev) => ({
          ...prev,
          loading: false,
          stockData: results,
          allocationData: allocationObject,
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

export const updateAllocation = atom(
    null, // No read function, this is a write-only atom
    (get, set, newAllocations: StockAllocation, total: number) => {
        // Set loading to true before starting the API request
        set(stocksAtom, (prev) => ({ ...prev, loading: true, error: null }));
        let currentAlloc = {...get(stocksAtom).allocationData} as StockAllocation;
        let defAllocCoef = Object.keys(currentAlloc).length - Object.keys(newAllocations).length
        let cap = get(getCurrentCapital)
        let remaining = 100 - total
        let responsiveAlloc = remaining / defAllocCoef
        for (const symbol in currentAlloc) {
            if (newAllocations[symbol]){
              let dec = newAllocations[symbol].percent
              currentAlloc[symbol] = {...newAllocations[symbol], cap: cap * dec}
            } else {
              let dec = responsiveAlloc / 100
              currentAlloc[symbol] = {percent: responsiveAlloc, cap: cap * dec}
            }
        }
        set(stocksAtom, (prev) => ({
            ...prev,
            allocationData: currentAlloc,
            loading: false
          }));
          
    }
  );

  