import React, { useCallback, useEffect, useState } from "react";
import { Fragment } from "react";
import { DataGrid } from '@mui/x-data-grid';
import "./tableStyle.css";
import Api from './StockMarketApi';
import { StockContext } from "./StockContext";
import { MessageAlert } from "./MessageAlert";
import { StockGraph } from "./StockGraph";
import { TableStockIndicators } from "./TableStockIndicators";
import { StockSymbolLastPrice } from "./StockSymbolLastPrice";
import { InputTrade } from "./InputTrade";
import { Divider } from "@mui/material";

export const StockMarket = (props) => {
    const stockContext = React.useContext(StockContext);
    const [stockData, setStockData] = useState();

    const [trades, setTrades] = useState();
    const [graphData, setGraphData] = useState();
    const [successMessage, setSuccessMessage] = useState();
    const [errorMessage, setErrorMessage] = useState();

    useEffect(() => {
        Api.getTrades().then(r => {
            if (!r.data) return;

            setTrades(r.data);
        }).catch(
            function (error) {
                console.log('Endpoint error: api/getTrades');
                console.log(error);

                setErrorMessage("Error when trying to retrieve trades");
                return Promise.reject(error)
            }
        );
    }, [setTrades]);


    const handleOnChangedSymbol = useCallback((symbol) => {
        Api.getStockCalculations(symbol).then(r => {
            if (!r.data) return;

            setStockData(r.data);
        }).catch(
            function (error) {
                console.log('Endpoint error: api/stockmarket/getStockCalculations');
                console.log(error);

                setErrorMessage("Error when trying to retrieve stock information");
                return Promise.reject(error)
            }
        );

    }, [setStockData]);

    useEffect(() => {
        if (!stockContext) {
            setStockData(undefined);
            setTrades(undefined);
            setGraphData(undefined);
            return;
        }

        handleOnChangedSymbol(stockContext);
    }, [stockContext, setStockData, setGraphData, handleOnChangedSymbol]);

    const handleSubmit = useCallback((trade, onSuccessCallback) => {
        if (!trade) return;

        Api.trade(trade).then(r => {
            if (!r.data) return;

            setTrades(prevState => [...prevState, r.data]);
            setSuccessMessage("Trade successful");

            //I am trying to avoid polling in here
            handleOnChangedSymbol(stockContext);

            onSuccessCallback();
            return true;
        }).catch(
            function (error) {
                console.log('Endpoint error: api/stockmarket/trade');
                console.log(error);

                setErrorMessage("Error when trying to perform your trade");

                return false;
            }
        )
    },
        [setTrades, handleOnChangedSymbol, setSuccessMessage, stockContext]
    )

    useEffect(() => {
        if (!trades || !stockContext) return;
        var myData = trades.filter(x => x.stockSymbol === stockContext).map(x => [x.timeStamp, x.price]);

        setGraphData(myData);
    }, [trades, stockContext]);

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

    const columns = [
        { field: 'stockSymbol', headerName: 'Symbol', width: 130 },
        { field: 'price', headerName: 'Price', width: 130 },
        { field: 'quantityOfShares', headerName: 'Quantity', width: 130 },
        { field: 'tradeIndicatorDesc', headerName: 'Trade indicator', width: 130 },
        { field: 'timeStamp', type: 'dateTime', headerName: 'Timestamp', minWidth: 200 },
    ];

    return (<Fragment>
        <div className="d-flex flex-row justify-content-between">
            <div className="p-2 mr-auto">
                <StockSymbolLastPrice stockData={stockData} />
            </div >
            <div className="p-2">
            </div>
            <div className="p-2 align-self-end">
                <InputTrade stockContext={stockContext} handleSubmit={handleSubmit} />
            </div>
        </div>
        <Divider />
        <br />
        <div className="row">
            <div className="col-7">
                <StockGraph graphData={graphData} />
            </div>
            <div className="col-5">
                <TableStockIndicators stockData={stockData} />
            </div>
        </div>
        <div style={{ height: 400 }}>
            <DataGrid
                density="compact"
                rows={trades ?? []}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
            />
        </div>

        <MessageAlert successMessage={successMessage} handleCloseSuccessAlert={handleCloseSuccessAlert}
            errorMessage={errorMessage} handleCloseErrorAlert={handleCloseErrorAlert} />
    </Fragment >);
}