import { StocksParams, StockData, StockAllocation, GetStockDataResponse, MyStockData, GenericObject, TimeData, FirstStockData, Total } from './types';
import data from "./data.json"; 
let myData = data.results as any
const periods = [
  { label: "oneMonthRoi", months: 1, pro: false },
  { label: "threeMonthRoi", months: 3, pro: false },
  { label: "sixMonthRoi", months: 6, pro: true },
  { label: "oneYearRoi", months: 12, pro: true },
  { label: "fiveYearRoi", months: 60, pro: true }
];

const sanitizeStock = (stock: any) =>{
  return Object.fromEntries(
    Object.entries(stock).map(([key, value]) => [
      key.replace(/^\d+\.\s/, "").replace(/ (\w)/g, (_, char) => char.toUpperCase()),// Regex to remove numbers and dot
      value,
    ])
  ) as unknown as GenericObject;
}


// keeping as any until I can confirm I will be using this API.
const createStockData = (meta: any, first: FirstStockData, timeData: TimeData ) => {
  let latestTradingDay = first.key;
  let cleanMeta = sanitizeStock(meta)
  let cleanFirst = sanitizeStock(first)
  let symbol = cleanMeta.Symbol
  const {open, high, low, close, volume} = cleanFirst
  let myStockData = new MyStockData({symbol, open, close, high, low, volume, timeData, latestTradingDay})
  return myStockData;
}

const cleanDateFormat = (date: string) => {
  const [year, month, day] = date.split('-').map(Number);
  const todayFormatted = new Date(year, month - 1, day);
  return todayFormatted
}

const calcRoi = (now:string, then:string) => {
  let newNow = parseFloat(now)
  let newThen = parseFloat(then)

  let dif = Math.round((newNow - newThen) * 100) / 100;
  return Math.round((dif / newThen) * 100) / 100;
 
}

const getClosingPrices = (data: StockData, todayData: string, today: string, isPro?: boolean) => {
  const todayFormatted = cleanDateFormat(today)
  
  function getDateMonthsAgo(months: number) {
      const d = todayFormatted;
      d.setMonth(d.getMonth() - months);
      return d.toISOString().split("T")[0];
  }
  
  function findClosestDate(targetDate: string) {
      const availableDates = Object.keys(data.timeData).sort((a, b) => new Date(b) > new Date(a) ? 1 : -1 );
      return availableDates.find(date => date <= targetDate) || null;
  }

  const roiResults = periods.reduce((acc, { label, months, pro }) => {
    let newData = data as GenericObject;
    if (!isPro && pro) {
      acc[label] = "Upgrade";
      return acc;
    }
  
    const date = findClosestDate(getDateMonthsAgo(months));
    const priceData = date ? newData.timeData[date] : null;
  
    acc[label] = priceData ? calcRoi(todayData, priceData["4. close"]) : "No Data";
    return acc;
  }, {} as Record<string, string | number>);

  return roiResults;
}

const getFirstObject = (data: GenericObject) =>{
  let firstKey = "Not Found";
  let firstObject = {};
  for (let key in data) {
      if (data.hasOwnProperty(key)) {
        firstKey = key;
        firstObject = data[key]
        break
      } else {
        console.log("Not found");
      }
  }
  return {key: firstKey, data: firstObject} as FirstStockData;
}


export const stockApi = {
  async getStockData({ tickers, capital, isPro }: StocksParams): Promise<GetStockDataResponse> {
    try {
      let results = myData
      if (!localStorage.getItem("useDummy")){
        // Make parallel requests for each ticker (can only bulk search with Pro version of AlphaVantage)
        const promises = tickers.map(ticker => 
          fetch(
            `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&outputsize=full&apikey=${import.meta.env.VITE_ALPHA_VANTAGE_API_KEY}`
          ).then(response => response.json())
        );

        results = await Promise.all(promises);
      }
      let cap = parseInt(capital)
      let defaultCapitalAlloc = Math.round(cap / results.length)
      let defaultPercentAlloc = Math.round(100 / results.length)
      let allocationObject: StockAllocation = {};
      results = results.map((result: GenericObject) => {
        let first = getFirstObject(result['Time Series (Daily)'])
        let newRes = createStockData(result['Meta Data'], first, result['Time Series (Daily)'] )
        newRes.percentAlloc = defaultPercentAlloc
        newRes.alloc = defaultCapitalAlloc
        allocationObject[newRes.symbol] = {percent: defaultPercentAlloc, cap: defaultCapitalAlloc}
        let d = sanitizeStock(first.data)
        newRes = { 
          ...newRes, 
          ...getClosingPrices(newRes as StockData, d.close, first.key, isPro) 
        };
        return newRes
      })
      return {results, allocationObject}
    } catch (error) {
      throw new Error(`Failed to fetch stock data: ${error}`);
    }
  }
};

export const unitFormat = (roi: number, isPercent: boolean, allocatedCapital: number | Total) => {
  if (isPercent){
      return Math.round((roi * 100) * 100) / 100 + "%"
  } else {
    if (typeof allocatedCapital === 'object' && 'fiat' in allocatedCapital) {
      // allocatedCapital is of type Total
      let dollarAmount = allocatedCapital.fiat
      let dollarStr = dollarAmount < 0 ? '-$' : '$'
      dollarAmount = dollarAmount < 0 ? dollarAmount * -1 : dollarAmount
      return dollarStr + formatWithCommas(dollarAmount)
    } else {
      // allocatedCapital is a number
      let dollarAmount = allocatedCapital * roi
      let dollarStr = dollarAmount < 0 ? '-$' : '$'
      dollarAmount = dollarAmount < 0 ? dollarAmount * -1 : dollarAmount
      return dollarStr + formatWithCommas(dollarAmount)
    }
  }
}

const formatWithCommas = (num: number) =>{
  let final = ''
  let reversedNum = num.toFixed(0).toString().split("").reverse()
  for (let i = 0; i < reversedNum.length; ++i){
      if (i !== 0 && i % 3 === 0){
          final += ','
      }
      final += reversedNum[i]
  }
  return final.split("").reverse().join("")
}