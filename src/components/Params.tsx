import { useAppSelector, useAppDispatch } from '../../store/hooks'
import { getAvailableTickers, updateTickers, updateCapital } from '../../store/slices/paramsSlice';
import { Box, Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, TextField, Button, InputAdornment } from '@mui/material';
import { fetchStockData } from '../../store/slices/stockSlice';

const MenuProps = {
  PaperProps: {
    style: {
      width: 250,
    },
  },
};

export default function Params() {
  const availableTickers = useAppSelector((state) => state.params.availableTickers);
  const selectedTickers = useAppSelector((state) => state.params.selectedTickers);
  const capital = useAppSelector((state) => state.params.capital);
  const dispatch = useAppDispatch();

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    dispatch(updateTickers(value as string[]));
  };

  const handleSubmit = () => {
    dispatch(fetchStockData({ tickers: selectedTickers, capital: capital }));
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
        value={capital}
        slotProps={{
          input: {
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          },
        }}
        onChange={(e:any) => dispatch(updateCapital(e.target.value))}
      />
    </FormControl>
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
      <Button variant="contained" color="primary" onClick={handleSubmit} disabled={selectedTickers.length === 0 || !capital}>Sim Stocks!</Button>
    </Box>
    
    </div>
  );
}