import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Container, Navbar } from 'reactstrap';
import './NavMenu.css';
import { Autocomplete, Button, TextField, Tooltip } from "@mui/material";
import Api from './StockMarketApi';
import { StockDispatchContext } from './StockContext';
import { MessageAlert } from './MessageAlert';

export const NavMenu = (props) => {
  const [stockData, setStockData] = useState();
  const setStockContext = useContext(StockDispatchContext);
  const [successMessage, setSuccessMessage] = useState();
  const [errorMessage, setErrorMessage] = useState();

  useEffect(() => {

    Api.getSampleData().then(r => {
      if (!r.data) return;

      setStockData(r.data);
    }).catch(
      function (error) {
        console.log('Endpoint error: api/stockmarket');
        console.log(error);

        setErrorMessage("Error when trying to retrieve stock symbols");
        return Promise.reject(error)
      }
    );
  }, [setStockData, setErrorMessage])

  const handleOnChangedSymbol = useCallback((value) => {
    if (!value) return;

    setStockContext(value.stockSymbol);
  },
    [setStockContext],
  );

  const handleOnclickClearData = useCallback(() => {
    Api.clearOnMemoryData().then(r => {
      setStockContext(undefined);
      setSuccessMessage("On memory data was successfully cleaned");
    }).catch(error => {
      console.log(error);
      setErrorMessage("Error when trying to clean on memory data");
    });
  }, [setSuccessMessage, setErrorMessage, setStockContext]);

  const handleCloseSuccessAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSuccessMessage(undefined);
  };

  const handleCloseErrorAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setErrorMessage(undefined);
  };

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

          <Tooltip title="Feature for cleaning on memory data: trades and last prices" followCursor >
            <Button variant="outlined" size="large" onClick={handleOnclickClearData}>Clear on memory data</Button>
          </Tooltip>
          <MessageAlert successMessage={successMessage} handleCloseSuccessAlert={handleCloseSuccessAlert}
            errorMessage={errorMessage} handleCloseErrorAlert={handleCloseErrorAlert} />
        </Container>
      </Navbar>
    </header>
  );
};
