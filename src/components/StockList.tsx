
import {useAtomValue, useSetAtom} from 'jotai';
import { paramsAtom, stocksAtom, updateAllocation } from '../../store/atoms/';
import { StockData, StockAllocation, IsChanged } from '../../api';
import {Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Slider } from '@mui/material';
import { useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';

const StockList = () => {
    const [adjustedAllocation, setAdjustedAllocation] = useState<StockAllocation>({});
    const [isChanged, setIsChanged] = useState<IsChanged>({});
    const stockData: StockData[] = useAtomValue(stocksAtom).stockData
    const totalCapital = useAtomValue(paramsAtom).capital
    const allocationData: StockAllocation = useAtomValue(stocksAtom).allocationData
    const updateAlloc = useSetAtom(updateAllocation)

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
            {stockData.length > 0 
            ? <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell align="left">Symbol</TableCell>
                        <TableCell>Allocation (%)</TableCell>
                        <TableCell>Capital Allocation</TableCell>
                        <TableCell>One Month Return</TableCell>
                        <TableCell>Three Month Return</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {stockData.map((stock) => {
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
                            <p className={stock.oneMonthRoi && stock.oneMonthRoi > 0 ? 'positive' : 'negative'}>{stock.oneMonthRoi && stock.oneMonthRoi > 0 ? "+" : null}{stock.oneMonthRoi ? Math.round((stock.oneMonthRoi * 100) * 100) / 100 + "%" : "N/A"}</p>
                        </TableCell>
                        <TableCell>
                            <p className={stock.threeMonthRoi && stock.threeMonthRoi > 0 ? 'positive' : 'negative'}>{stock.threeMonthRoi && stock.threeMonthRoi > 0 ? "+" : null}{stock.threeMonthRoi ?  Math.round((stock.threeMonthRoi * 100) * 100) / 100 + "%" : "N/A"}</p>
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
        </div>
    )
}

export default StockList;