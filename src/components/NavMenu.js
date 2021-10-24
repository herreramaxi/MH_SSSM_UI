import React, { useContext, useEffect, useState } from 'react';
import { Container, Navbar } from 'reactstrap';
import './NavMenu.css';
import { Alert, AlertTitle, Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Tooltip } from "@mui/material";
import Api from './StockMarketApi';
import { StockDispatchContext } from './StockContext';
import { MessageAlert } from './MessageAlert';
import DeleteIcon from '@mui/icons-material/Delete';

export const NavMenu = (props) => {
  const [stockData, setStockData] = useState();
  const { setStockSymbol, setResetTrades } = useContext(StockDispatchContext);
  const [successMessage, setSuccessMessage] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [open, setOpen] = React.useState(false);
  const [resetAutoComplete, setResetAutoComplete] = useState(false);
  useEffect(() => {

    Api.getSampleData().then(r => {
      if (!r.data) return;

      setStockData(r.data.map(x => x.stockSymbol));
    }).catch((error) => {
      console.log('Endpoint error: api/stockmarket');
      console.log(error);

      setErrorMessage("Error when trying to retrieve stock symbols");
      return Promise.reject(error)
    }
    );
  }, [])

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


  const handleCancel = () => {
    setOpen(false);
  };

  const handleOk = () => {

    Api.clearOnMemoryData().then(r => {
      setStockSymbol(undefined);
      setResetTrades(true);
      setResetAutoComplete(prev => !prev);
      setSuccessMessage("In-memory data was successfully cleaned");
    }).catch(error => {
      console.log(error);
      setErrorMessage("Error when trying to clean in-memory data");
    }).finally(() => {
      setOpen(false);
    });
  };

  return (
    <header>
      <Navbar className=" navbar-inverse navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" light>
        <Container>

          <Autocomplete
            key={resetAutoComplete}
            className="mt-2"
            sx={{ width: 300 }}

            getOptionLabel={(option) => !option ? "" : ("GBCE: " + option)}
            options={stockData ?? []}
            onChange={(event, value) => setStockSymbol(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search symbol"
                size="small"
              />
            )}
          />

          <Tooltip title="Delete in-memory data: trades and last prices" followCursor >
            <IconButton aria-label="delete" size="large" onClick={() => setOpen(true)}>
              <DeleteIcon fontSize="inherit" />
            </IconButton>
            {/* <Button variant="outlined" size="large" onClick={handleOnclickClearData}>Delete in-memory data</Button> */}
          </Tooltip>
          <Dialog
            sx={{ '& .MuiDialog-paper': { width: '90%', maxHeight: 435 } }}
            maxWidth="xs"
            open={open}
          // onClose={handleClose}          
          >
            <DialogTitle>Clean in-memory data?</DialogTitle>
            <DialogContent>
              <p>Please confirm this action</p>
              <Alert severity="warning">
                <AlertTitle>Warning</AlertTitle>
                You are about to delete in-memory data, which includes: trades and last prices.
              </Alert>

            </DialogContent>
            <DialogActions>
              <Button variant="outlined" autoFocus onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant="outlined" startIcon={<DeleteIcon />} onClick={handleOk}>Clean</Button>
            </DialogActions>

          </Dialog>
          <MessageAlert successMessage={successMessage} handleCloseSuccessAlert={handleCloseSuccessAlert}
            errorMessage={errorMessage} handleCloseErrorAlert={handleCloseErrorAlert} />
        </Container>
      </Navbar>
    </header>
  );
};
