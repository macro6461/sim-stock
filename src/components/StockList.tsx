
import {useAtomValue, useSetAtom} from 'jotai';
import { stocksAtom, updateAllocation, updateReset } from '../../store/atoms/';
import { StockData, StockAllocation, IsChanged, Totals, unitFormat } from '../../api';
import {Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Slider, CircularProgress, FormControlLabel, Checkbox, TableFooter } from '@mui/material';
import { useEffect, useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import RoiCell from './RoiCell'

const StockList = () => {
    const [adjustedAllocation, setAdjustedAllocation] = useState<StockAllocation>({});
    const [usePercent, setUsePercent] = useState<boolean>(true);
    const [isChanged, setIsChanged] = useState<IsChanged>({});
    const stockData: StockData[] = useAtomValue(stocksAtom).stockData
    const loading: boolean = useAtomValue(stocksAtom).loading
    const allocationData: StockAllocation = useAtomValue(stocksAtom).allocationData
    const isReset: boolean = useAtomValue(stocksAtom).isReset
    const totals: Totals = useAtomValue(stocksAtom).totals
    const updateAlloc = useSetAtom(updateAllocation)
    const updateResetHere = useSetAtom(updateReset)

    useEffect(()=>{
        // Reset local adjustedAllocation after submitting new stock atom's allocationData
        setAdjustedAllocation({})
        updateResetHere()
    }, [isReset === true])

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

    const handleChangeUnit = () =>{
        setUsePercent(!usePercent)
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
                        ? <>
                            <FormControlLabel
                                label="Show ROI in Dollars"
                                style={{float: 'right'}}
                                control={
                                    <Checkbox
                                        checked={!usePercent}
                                        onChange={handleChangeUnit}
                                    />
                                }
                            />
                            <TableContainer component={Paper}>
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
                                            <RoiCell isPercent={usePercent} roi={oneMonthRoi} allocatedCapital={adjustedAllocation[stock.symbol]?.cap || allocationData[stock.symbol].cap}/>
                                        </TableCell>
                                        <TableCell>
                                            <RoiCell isPercent={usePercent} roi={threeMonthRoi} allocatedCapital={adjustedAllocation[stock.symbol]?.cap || allocationData[stock.symbol].cap}/>
                                        </TableCell>
                                        <TableCell>
                                            <RoiCell isPercent={usePercent} roi={sixMonthRoi} allocatedCapital={adjustedAllocation[stock.symbol]?.cap || allocationData[stock.symbol].cap}/>
                                        </TableCell>
                                        <TableCell>
                                            <RoiCell isPercent={usePercent} roi={oneYearRoi} allocatedCapital={adjustedAllocation[stock.symbol]?.cap || allocationData[stock.symbol].cap}/>
                                        </TableCell>
                                        <TableCell>
                                            <RoiCell isPercent={usePercent} roi={fiveYearRoi} allocatedCapital={adjustedAllocation[stock.symbol]?.cap || allocationData[stock.symbol].cap}/>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                                <SaveIcon style={{cursor: "pointer"}} color={!isChanged[stock.symbol] ? "disabled" : "action"} onClick={isChanged[stock.symbol] ? submitAllocationAdjustments : ()=>{}}/>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                })
                                }
                                <TableRow>
                                    <TableCell>
                                        <h3>TOTAL</h3>
                                    </TableCell>
                                    <TableCell>
                                        <h3></h3>
                                    </TableCell>
                                    <TableCell>
                                        <h3></h3>
                                    </TableCell>
                                    <TableCell>
                                        <RoiCell isPercent={usePercent} roi={totals.oneMonthRoi.percent} allocatedCapital={totals.oneMonthRoi} isTotal/>
                                    </TableCell>
                                    <TableCell>
                                        <RoiCell isPercent={usePercent} roi={totals.threeMonthRoi.percent} allocatedCapital={totals.threeMonthRoi} isTotal/>
                                    </TableCell>
                                    <TableCell>
                                        <RoiCell isPercent={usePercent} roi={totals.sixMonthRoi.percent} allocatedCapital={totals.sixMonthRoi} isTotal/>
                                    </TableCell>
                                    <TableCell>
                                        <RoiCell isPercent={usePercent} roi={totals.oneYearRoi.percent} allocatedCapital={totals.oneYearRoi} isTotal/>
                                    </TableCell>
                                    <TableCell>
                                        <RoiCell isPercent={usePercent} roi={totals.fiveYearRoi.percent} allocatedCapital={totals.fiveYearRoi} isTotal/>
                                    </TableCell>
                                </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer> 
                        </>
                        : <p>Select some tickers to analyze!</p>
                    }
                </>
            }
        </div>
    )
}

export default StockList;