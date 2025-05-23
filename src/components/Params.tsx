import {useState} from 'react';
import {useAtomValue, useSetAtom} from 'jotai';
import { updateTickers, updateCapital, fetchStockData, paramsAtom, stocksAtom, resetStockData, saveSimulation } from '../../store/atoms';
import { Box, Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, TextField, Button, InputAdornment, Modal, Typography } from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SaveIcon from '@mui/icons-material/Save'
import ConfirmationModal from './ConfirmationModal';

const MenuProps = {
  PaperProps: {
    style: {
      width: 250,
    },
  },
};

export default function Params() {

  const [isModalOpen, setIsModalOpen] = useState(false)

  const availableTickers = useAtomValue(paramsAtom).availableTickers
  const selectedTickers = useAtomValue(paramsAtom).selectedTickers
  const capital = useAtomValue(paramsAtom).capital
  const stockDataLength = useAtomValue(stocksAtom).stockData.length

  const setSelectedTickers = useSetAtom(updateTickers)
  const setUpdatedCapital = useSetAtom(updateCapital)
  const getStockData = useSetAtom(fetchStockData)
  const reset = useSetAtom(resetStockData)
  const saveSim = useSetAtom(saveSimulation)

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setSelectedTickers(value as string[])
  };

  const handleSubmit = (fromModal?: boolean) => {
    if (stockDataLength > 0 && !fromModal){
      setIsModalOpen(true)
    } else {
      if (fromModal){
        saveSim()
      } else {
        getStockData({tickers: selectedTickers, capital})
      }
    }
  }

  const closeModal = () =>{
    setIsModalOpen(false)
  }

  const handleSaveModel = () =>{
    saveSim()
  }

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
      <InputLabel id="stocks-label">Stocks</InputLabel>
      <Select
        labelId="stocks-label"
        id="selectedTickers"
        multiple
        value={selectedTickers}
        onChange={handleChange}
        input={<OutlinedInput id="stocks-label" label="Stocks" />}
        renderValue={(selected: any) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((value: any) => (
              <Chip key={value} label={value} />
            ))}
          </Box>
        )}
        MenuProps={MenuProps}
      >
        {availableTickers.map((ticker) => (
          <MenuItem
            key={ticker}
            value={ticker}
          >
            {ticker}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    <FormControl sx={{ m: 1, width: 300 }} required={true}>
      <TextField
        prefix='$'
        label="Capital"
        id="capital"
        type="number"
        value={capital}
        slotProps={{
          input: {
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          },
        }}
        onChange={(e:any) => setUpdatedCapital(e.target.value)}
      />
    </FormControl>
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={(e) => handleSubmit()} 
        disabled={selectedTickers.length === 0 || !capital}
      >
        <CalculateIcon/> &nbsp; {stockDataLength > 0 ? "New Simulation" : "Simulate"}
      </Button>
      {stockDataLength > 0 
        ? <>&nbsp; <Button 
            variant="contained" 
            color="primary" 
            onClick={(e) => reset()} 
            disabled={selectedTickers.length === 0 || !capital}
          >
      <RestartAltIcon/>&nbsp; Reset
    </Button></>  : null}
    {stockDataLength > 0 &&
      <>
        &nbsp; <Button variant="contained" color="primary" onClick={handleSaveModel} disabled={selectedTickers.length === 0 || !capital}>
                  <SaveIcon/>&nbsp; Save Simulation
              </Button>
      </> 
    }
    </Box>
    <ConfirmationModal isOpen={isModalOpen} close={closeModal} text="Want to save current simulation before starting a new one?" callback={()=>handleSubmit(true)}/>
    </div>
  );
}