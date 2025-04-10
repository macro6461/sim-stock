
import {useAtomValue, useSetAtom} from 'jotai';
import { stocksAtom, updateAllocation, updateReset, saveSimulation, updateAdjustedAllocationData } from '../../store/atoms/';
import { StockData, StockAllocation, IsChanged, Totals } from '../../api';
import {Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Slider, CircularProgress, FormControlLabel, Checkbox } from '@mui/material';
import { useEffect, useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import RoiCell from './RoiCell'

const StockList = () => {
    const [usePercent, setUsePercent] = useState<boolean>(true);
    const [isChanged, setIsChanged] = useState<IsChanged>({});
    const stockData: StockData[] = useAtomValue(stocksAtom).stockData
    const loading: boolean = useAtomValue(stocksAtom).loading
    const allocationData: StockAllocation = useAtomValue(stocksAtom).allocationData ?? {}
    const adjustedAllocation: StockAllocation = useAtomValue(stocksAtom).adjustedAllocation ?? {}
    const isReset: boolean = useAtomValue(stocksAtom).isReset
    const totals: Totals = useAtomValue(stocksAtom).totals
    const updateAlloc = useSetAtom(updateAllocation)
    const updateResetHere = useSetAtom(updateReset)
    const setAdjustedAllocation = useSetAtom(updateAdjustedAllocationData)

    useEffect(()=>{
        // Reset local adjustedAllocation after submitting new stock atom's allocationData
        setAdjustedAllocation({adjAlloc: {} })
        updateResetHere()
    }, [isReset === true])

    const handleAllocationAdjustment = (symbol: string, value: string) => {
        const adjAlloc = { ...adjustedAllocation };
        const changed = { ...isChanged };
        changed[symbol] = true;
        adjAlloc[symbol] = { 
          ...adjAlloc[symbol], 
          percent: parseFloat(parseFloat(value).toFixed(2)) 
        };
        setIsChanged(changed);
        setAdjustedAllocation({adjAlloc}); // This will update the global state
      };

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
                                        <RoiCell isPercent={usePercent} roi={usePercent ? totals.oneMonthRoi.percent : totals.oneMonthRoi.fiat } allocatedCapital={totals.oneMonthRoi} isTotal/>
                                    </TableCell>
                                    <TableCell>
                                        <RoiCell isPercent={usePercent} roi={usePercent ? totals.threeMonthRoi.percent : totals.threeMonthRoi.fiat } allocatedCapital={totals.threeMonthRoi} isTotal/>
                                    </TableCell>
                                    <TableCell>
                                        <RoiCell isPercent={usePercent} roi={usePercent ? totals.sixMonthRoi.percent : totals.sixMonthRoi.fiat } allocatedCapital={totals.sixMonthRoi} isTotal/>
                                    </TableCell>
                                    <TableCell>
                                        <RoiCell isPercent={usePercent} roi={usePercent ? totals.oneYearRoi.percent : totals.oneYearRoi.fiat } allocatedCapital={totals.oneYearRoi} isTotal/>
                                    </TableCell>
                                    <TableCell>
                                        <RoiCell isPercent={usePercent} roi={usePercent ? totals.fiveYearRoi.percent : totals.fiveYearRoi.fiat } allocatedCapital={totals.fiveYearRoi} isTotal/>
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