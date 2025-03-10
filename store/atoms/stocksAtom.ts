import {atom} from 'jotai';
import { GenericObject, StockAllocation, stockApi, StockData, StocksParams, StocksState, Totals} from '../../api';
import {getCurrentCapital} from './paramsAtom'

const initialTotals: Totals = {
  oneMonthRoi: { percent: 0, fiat: 0 },
  threeMonthRoi: { percent: 0, fiat: 0 },
  sixMonthRoi: { percent: 0, fiat: 0 },
  oneYearRoi: { percent: 0, fiat: 0 },
  fiveYearRoi: { percent: 0, fiat: 0 }
}
  
export const stocksAtom = atom<StocksState>({
    loading: true,
    initialStockData: [],
    stockData: [],
    allocationData: {},
    initialAllocationData: {},
    error: null,
    isReset: false,
    totals: initialTotals
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
        
        //deeply clone
        const clonedObject = JSON.parse(JSON.stringify(initialTotals));

        const totals = totalsHelper(results, clonedObject)
  
        // Update the state with the fetched data
        set(stocksAtom, (prev) => ({
          ...prev,
          loading: false,
          stockData: results,
          initialStockData: results,
          allocationData: allocationObject,
          initialAllocationData: allocationObject,
          error: null,
          totals
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
        let cap = parseInt(get(getCurrentCapital))
        let remaining = 100 - total
        let responsiveAlloc = remaining / defAllocCoef
        for (const symbol in currentAlloc) {
            if (newAllocations[symbol]){
              let dec = newAllocations[symbol].percent / 100
              currentAlloc[symbol] = {...newAllocations[symbol], cap: cap * dec}
            } else {
              let dec = responsiveAlloc / 100
              currentAlloc[symbol] = {percent: responsiveAlloc, cap: cap * dec}
            }
        }

        debugger

        // need way to update totals here.

        set(stocksAtom, (prev) => ({
            ...prev,
            allocationData: currentAlloc,
            loading: false
          }));
          
    }
  );

  export const resetStockData = atom(
    null, // No read function, this is a write-only atom
    (get, set) => {
      let stockData = [...get(stocksAtom).initialStockData as StockData[]];
      let allocationData = {...get(stocksAtom).initialAllocationData} as StockAllocation;

      set(stocksAtom, (prev: StocksState): StocksState => ({
        ...prev, 
        stockData,
        allocationData,
        isReset: true
      }));
    }
  );

  export const updateReset = atom(
    null, // No read function, this is a write-only atom
    (get, set) => {
      set(stocksAtom, (prev: StocksState): StocksState => ({
        ...prev, 
        isReset: false
      }));
    }
  )

  const totalsHelper = (data: StockData[], currentTotals: Totals) =>{
    let final = {...currentTotals}
    let upgradeTotal = {percent: 'Upgrade', fiat: 'Upgrade'}
    for (let i = 0; i < data.length;++i){
      let {alloc, sixMonthRoi, oneYearRoi, fiveYearRoi} = data[i]
      final.oneMonthRoi = {
        percent: totalsHelperConstructor(final, 'oneMonthRoi', data[i], undefined), 
        fiat: totalsHelperConstructor(final, 'oneMonthRoi', data[i], alloc) 
      }
      final.threeMonthRoi = {
        percent: totalsHelperConstructor(final, 'threeMonthRoi', data[i], undefined), 
        fiat: totalsHelperConstructor(final, 'threeMonthRoi', data[i], alloc) 
      }
      final.sixMonthRoi = sixMonthRoi === "Upgrade" ? upgradeTotal : {
        percent: totalsHelperConstructor(final, 'oneMonthRoi', data[i], undefined), 
        fiat: totalsHelperConstructor(final, 'oneMonthRoi', data[i], alloc) 
      }
      final.oneYearRoi = oneYearRoi === "Upgrade" ? upgradeTotal : {
        percent: totalsHelperConstructor(final, 'oneYearRoi', data[i], undefined), 
        fiat: totalsHelperConstructor(final, 'oneYearRoi', data[i], alloc) 
      }
      final.fiveYearRoi = fiveYearRoi === "Upgrade" ? upgradeTotal : {
        percent: totalsHelperConstructor(final, 'fiveYearRoi', data[i], undefined), 
        fiat: totalsHelperConstructor(final, 'fiveYearRoi', data[i], alloc) 
      }
    }
    return final;
  }

  const totalsHelperConstructor = (final: GenericObject, key: string, data: GenericObject, alloc: number | undefined) =>{
    // using GenericObject as type so we can dynamically iterate with strings as keys
    let d = data[key]
    if (alloc && !Number.isNaN(alloc)){
      // need isNaN check in case alloc is 0
      return final[key].percent * alloc
    } else {
      return typeof d === "number" ? final[key].percent += d : 0
    }
  }

  