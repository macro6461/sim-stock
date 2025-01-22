import {atom} from 'jotai';

interface ParamsState {
    availableTickers: string[];
    selectedTickers: string[];
    capital: number;
  }
  
export const paramsAtom = atom<ParamsState>({
    availableTickers: ["APPL", "GOOGL", "MSFT", "AMZN", "META", "TSLA", "NVDA", "ADBE", "NFLX", "PYPL", "CRM", "INTC", "CSCO", "QCOM", "AMD", "ASML"],
    selectedTickers: [],
    capital: 0,
})

export const getAvailableTickers = atom((get)=> {
    const params = get(paramsAtom)
    return params.availableTickers;
}) 
export const getCurrentCapital = atom((get)=> {
    const params = get(paramsAtom)
    return params.capital;
}) 
export const updateTickers = atom(null, (_get, set, tickers: string[])=>{
    set(paramsAtom, (prev)=>({
        ...prev, 
        selectedTickers: tickers
    }))
})

export const updateCapital = atom(null, (_get, set, newCap: number)=>{
    set(paramsAtom, (prev)=>({
        ...prev,
        capital: newCap
    }))
})

  