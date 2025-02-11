import { StocksParams, StockData, StockAllocation, GetStockDataResponse, MyStockData, GenericObject, IndividualStockData, TimeData, FirstStockData } from './types';

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

const getClosingPrices = (data: StockData, todayData: string, today: string) => {
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
  
  const oneMonthAgo = findClosestDate(getDateMonthsAgo(1));
  const threeMonthsAgo = findClosestDate(getDateMonthsAgo(3));
  let newData = data as GenericObject
  let oneM = oneMonthAgo ? newData.timeData[oneMonthAgo] : null
  let threeM = threeMonthsAgo ? newData.timeData[threeMonthsAgo] : null
  return {
      "oneMonthRoi": calcRoi(todayData, oneM["4. close"]),
      "threeMonthRoi": calcRoi(todayData, threeM["4. close"])
  };
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
  async getStockData({ tickers, capital }: StocksParams): Promise<GetStockDataResponse> {
    try {
     // Make parallel requests for each ticker
     const promises = tickers.map(ticker => 
        fetch(
          `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&outputsize=full&apikey=${import.meta.env.VITE_ALPHA_VANTAGE_API_KEY}`
        ).then(response => response.json())
      );

      let results = await Promise.all(promises);
      let defaultCapitalAlloc = Math.round(capital / results.length)
      let defaultPercentAlloc = Math.round(100 / results.length)
      let allocationObject: StockAllocation = {};
      results = results.map((result) => {
        let first = getFirstObject(result['Time Series (Daily)'])
        let newRes = createStockData(result['Meta Data'], first, result['Time Series (Daily)'] )
        newRes.percentAlloc = defaultPercentAlloc
        newRes.alloc = defaultCapitalAlloc
        allocationObject[newRes.symbol] = {percent: defaultPercentAlloc, cap: defaultCapitalAlloc}
        let d = sanitizeStock(first.data)
        let {oneMonthRoi, threeMonthRoi} =  getClosingPrices(newRes as StockData, d.close, first.key)
        newRes.oneMonthRoi = oneMonthRoi
        newRes.threeMonthRoi = threeMonthRoi
        return newRes
      })
      return {results, allocationObject}
    } catch (error) {
      throw new Error(`Failed to fetch stock data: ${error}`);
    }
  }
};