import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Container, Navbar } from 'reactstrap';
import './NavMenu.css';
import { Autocomplete, Button, IconButton, Snackbar, TextField, Tooltip } from "@mui/material";
import Api from './StockMarketApi';
import { StockDispatchContext } from './StockContext';
import CloseIcon from '@mui/icons-material/Close';

export const NavMenu = (props) => {
  const [stockData, setStockData] = useState();
  const setStockContext = useContext(StockDispatchContext);
  const [open, setOpen] = useState();

  useEffect(() => {

    Api.getSampleData().then(r => {
      if (!r.data) return;

      setStockData(r.data);
    }).catch(
      function (error) {
        console.log('Endpoint error: api/stockmarket');
        console.log(error);
        return Promise.reject(error)
      }
    );
  }, [setStockData])

  const handleOnChangedSymbol = useCallback((value) => {
    if (!value) return;

    setStockContext(value.stockSymbol);
  },
    [setStockContext],
  );

  const handleOnclickClearData = useCallback(() => {
    Api.clearOnMemoryData().then(r => {
      setStockContext(undefined);
      setOpen(true);
    })
  }, [setOpen, setStockContext]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <header>
      <Navbar className=" navbar-inverse navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" light>
        <Container>
          <Autocomplete
            freeSolo
            className="mt-2"
            sx={{ width: 300 }}
            id="free-solo-2-demo"
            disableClearable
            getOptionLabel={(option) => "GBCE: " + option?.stockSymbol}
            options={stockData ?? []}
            onChange={(event, value) => handleOnChangedSymbol(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search symbol"
                size="small"
                InputProps={{
                  ...params.InputProps,
                  type: 'search',
                }}
              />
            )}
          />

          <Tooltip title="Utility for clearing on memory data: trades and last prices" followCursor >
            <Button variant="outlined" size="large" onClick={handleOnclickClearData}>Clear on memory data</Button>
          </Tooltip>
          <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            message="On memory data was successfully cleared"
            action={action}
          />
        </Container>
      </Navbar>
    </header>
  );
};
