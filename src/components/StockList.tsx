
import {useAtomValue, useSetAtom} from 'jotai';
import {useEffect} from 'react';
import { paramsAtom, stocksAtom, updateAllocation } from '../../store/atoms/';
import { StockData, StockAllocation, IsChanged } from '../../api';
import {Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Slider, CircularProgress, Button } from '@mui/material';
import { useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import { Link } from 'react-router-dom';

const StockList = () => {
    const [adjustedAllocation, setAdjustedAllocation] = useState<StockAllocation>({});
    const [isChanged, setIsChanged] = useState<IsChanged>({});
    const stockData: StockData[] = useAtomValue(stocksAtom).stockData
    const loading: boolean = useAtomValue(stocksAtom).loading
    const totalCapital = useAtomValue(paramsAtom).capital
    const allocationData: StockAllocation = useAtomValue(stocksAtom).allocationData
    const updateAlloc = useSetAtom(updateAllocation)

    useEffect(()=>{
        console.log("AHHH: ", stockData)
    }, [stockData])

    const handleAllocationAdjustment = (symbol: string, value: string) =>{
        let adjAlloc = {...adjustedAllocation}
        let changed = {...isChanged}
        changed[symbol] = true
        adjAlloc[symbol] = {...adjAlloc[symbol], percent: parseFloat(parseFloat(value).toFixed(2))}
        setIsChanged(changed)
        setAdjustedAllocation(adjAlloc)
    }

    const submitAllocationAdjustments = () =>{
        let vals = Object.values(adjustedAllocation)
        let total = 0;
        vals.forEach(val=>total+=val.percent)
        updateAlloc(adjustedAllocation, total)
        setIsChanged({})
    }
  
    return (
        <div>
            {
                loading ?  <Box sx={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
                            <CircularProgress />
                            </Box>
                            : 
                <>
                { stockData.length > 0 
            ? <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell align="left">Symbol</TableCell>
                        <TableCell>Allocation (%)</TableCell>
                        <TableCell>Allocation ($)</TableCell>
                        <TableCell>1 Month ROI</TableCell>
                        <TableCell>3 Month ROI</TableCell>
                        <TableCell>6 Month ROI</TableCell>
                        <TableCell>1 Year ROI</TableCell>
                        <TableCell>5 Year ROI</TableCell>
                        {/* <TableCell>All Time Return</TableCell> */}
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {stockData.map((stock) => {
                    let {oneMonthRoi, threeMonthRoi, sixMonthRoi, oneYearRoi, fiveYearRoi} = stock
                    return <TableRow
                        key={stock.symbol}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell align="left">{stock.symbol}</TableCell>
                        <TableCell>
                            <Slider 
                                valueLabelDisplay="auto"
                                aria-label="Allocation" 
                                value={adjustedAllocation[stock.symbol]?.percent || allocationData[stock.symbol].percent} 
                                onChange={(e:any) => handleAllocationAdjustment(stock.symbol, e.target.value)} 
                                max={100}
                                min={0}
                            />
                        </TableCell>
                        <TableCell>
                            <p>${adjustedAllocation[stock.symbol]?.cap || allocationData[stock.symbol].cap}</p>
                        </TableCell>
                        <TableCell>
                            <p className={oneMonthRoi && oneMonthRoi > 0 ? 'positive' : 'negative'}>{oneMonthRoi && oneMonthRoi > 0 ? "+" : null}{oneMonthRoi ? Math.round((oneMonthRoi * 100) * 100) / 100 + "%" : "N/A"}</p>
                        </TableCell>
                        <TableCell>
                            <p className={threeMonthRoi && threeMonthRoi > 0 ? 'positive' : 'negative'}>{threeMonthRoi && threeMonthRoi > 0 ? "+" : null}{threeMonthRoi ?  Math.round((threeMonthRoi * 100) * 100) / 100 + "%" : "N/A"}</p>
                        </TableCell>
                        <TableCell>
                            {sixMonthRoi && sixMonthRoi !== "Upgrade" ?  <p className={sixMonthRoi && sixMonthRoi > 0 ? 'positive' : 'negative'}>{sixMonthRoi > 0 ? "+" : null}{sixMonthRoi ?  Math.round((sixMonthRoi * 100) * 100) / 100 + "%" : "N/A"}</p> : <Link className="upgradeLink" to="/profile">Unlock With Pro</Link>}
                        </TableCell>
                        <TableCell>
                            {oneYearRoi && oneYearRoi !== "Upgrade" ?  <p className={oneYearRoi > 0 ? 'positive' : 'negative'}>{oneYearRoi > 0 ? "+" : null}{sixMonthRoi ?  Math.round((oneYearRoi * 100) * 100) / 100 + "%" : "N/A"}</p> : <Link className="upgradeLink" to="/profile">Unlock With Pro</Link> }
                        </TableCell>
                        <TableCell>
                        {fiveYearRoi && fiveYearRoi !== "Upgrade" ?  <p className={fiveYearRoi > 0 ? 'positive' : 'negative'}>{fiveYearRoi > 0 ? "+" : null}{fiveYearRoi ?  Math.round((fiveYearRoi * 100) * 100) / 100 + "%" : "N/A"}</p> : <Link className="upgradeLink" to="/profile">Unlock With Pro</Link> }
                        </TableCell>
                        <TableCell align="right">
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                <SaveIcon style={{cursor: "pointer"}} color={!isChanged[stock.symbol] ? "disabled" : "action"} onClick={isChanged[stock.symbol] ? submitAllocationAdjustments : ()=>{}}/>
                            </Box>
                        </TableCell>
                    </TableRow>
                })
                }
                </TableBody>
            </Table>
        </TableContainer> 
            : <p>Select some tickers to analyze!</p>
            }
                </>
            }
        </div>
    )
}

export default StockList;