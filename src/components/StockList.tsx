import {useAtomValue, useSetAtom} from 'jotai';
import { stocksAtom } from '../../store/atoms/';
import { StockData } from '../../api';

const StockList = () => {
    const stockData = useAtomValue(stocksAtom).stockData
  
    return (
        <div>
            {stockData.length > 0 ? <h1>Stock List</h1> : <p>Select some tickers to analyze!</p>}
            {stockData.map((stock:StockData)=>{
                return <p key={stock.symbol}>{stock.symbol} : ${stock.alloc}</p>
            })}
        </div>
    )
}

export default StockList;