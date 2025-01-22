
import {useAtomValue, useSetAtom} from 'jotai';
import { paramsAtom, stocksAtom, updateAllocation } from '../../store/atoms/';
import { StockData, StockAllocation, IsChanged } from '../../api';
import { Box, Button } from '@mui/material';
import { InputAdornment, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import { useState } from 'react';

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
        adjAlloc[symbol] = parseFloat(parseFloat(value).toFixed(2))
        setIsChanged(changed)
        setAdjustedAllocation(adjAlloc)
    }

    const submitAllocationAdjustments = () =>{
        let vals = Object.values(adjustedAllocation)
        let total = 0;
        vals.forEach(val=>total+=val)
        if ( total > totalCapital) {
            alert("TOO MUCH")
        } else {
            updateAlloc(adjustedAllocation, total)
            setIsChanged({})
        }
    }
  
    return (
        <div>
            {stockData.length > 0 ? null : <p>Select some tickers to analyze!</p>}
            
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Symbol</TableCell>
                            <TableCell>Allocation</TableCell>
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
                                <TextField
                                    prefix='$'
                                    label="Allocation"
                                    id="allocation"
                                    type="number"
                                    // defaultValue={adjustedAllocation[stock.symbol]}
                                    value={adjustedAllocation[stock.symbol] || allocationData[stock.symbol]}
                                    slotProps={{
                                        input: {
                                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                        },
                                    }}
                                    onChange={(e:any) => handleAllocationAdjustment(stock.symbol, e.target.value)}
                                />
                            </TableCell>
                            <TableCell align="right">
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                    <Button variant="contained" color="primary" onClick={submitAllocationAdjustments} disabled={!isChanged[stock.symbol]}>Submit Allocation</Button>
                                </Box>
                            </TableCell>
                        </TableRow>
                    })
                    }
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default StockList;