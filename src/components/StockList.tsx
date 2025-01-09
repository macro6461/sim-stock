import { useAppSelector } from '../../store/hooks'

const StockList = () => {
    const stockData = useAppSelector((state) => state.stocks.stockData);
    console.log(stockData);
    return (
        <div>
            <h1>Stock List</h1>
            {stockData.map(stock=>{
                return <p key={stock['01. symbol']}>{stock['01. symbol']}</p>
            })}
        </div>
    )
}

export default StockList;