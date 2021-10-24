import React, { useCallback, useEffect, useState } from "react";
import { Fragment } from "react";
import { DataGrid } from '@mui/x-data-grid';
import "./tableStyle.css";
import Api from './StockMarketApi';
import { StockContext, StockDispatchContext } from "./StockContext";
import { MessageAlert } from "./MessageAlert";
import { StockGraph } from "./StockGraph";
import { TableStockIndicators } from "./TableStockIndicators";
import { StockSymbolLastPrice } from "./StockSymbolLastPrice";
import { InputTrade } from "./InputTrade";
import { Divider } from "@mui/material";

export const StockMarket = (props) => {
    const { stockSymbol, resetTrades } = React.useContext(StockContext);
    const { setResetTrades } = React.useContext(StockDispatchContext);
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
    }, []);


    useEffect(() => {

        if (!resetTrades) return;

        Api.getTrades().then(r => {
            if (!r.data) return;

            setResetTrades(false);
            setTrades(r.data);
        }).catch(
            function (error) {
                console.log('Endpoint error: api/getTrades');
                console.log(error);

                setErrorMessage("Error when trying to retrieve trades");
                return Promise.reject(error)
            }
        );
    }, [resetTrades, setResetTrades]);


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

    }, []);

    useEffect(() => {
        if (!stockSymbol) {
            setStockData(undefined);
            // setTrades(undefined);
            setGraphData(undefined);
            return;
        }

        handleOnChangedSymbol(stockSymbol);
    }, [stockSymbol, handleOnChangedSymbol]);

    const handleSubmit = useCallback((trade, onSuccessCallback) => {
        if (!trade) return;

        Api.trade(trade).then(r => {
            if (!r.data) return;

            setTrades((prevState) => {

                if (!prevState) {
                    return [r.data];
                }

                return [...prevState, r.data];

            });

            setSuccessMessage("Trade successful");

            //I am trying to avoid polling in here
            handleOnChangedSymbol(stockSymbol);

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
        [stockSymbol, handleOnChangedSymbol]
    )

    useEffect(() => {
        if (!trades || !stockSymbol) return;
        var myData = trades.filter(x => x.stockSymbol === stockSymbol).map(x => [x.timeStamp, x.price]);

        setGraphData(myData);
    }, [trades, stockSymbol]);

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
        { field: 'stockSymbol', headerName: 'Symbol', width: 150 },
        { field: 'price', headerName: 'Price', width: 150 },
        { field: 'quantityOfShares', headerName: 'Quantity', width: 150 },
        { field: 'tradeIndicatorDesc', headerName: 'Trade indicator', width: 150 },
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
                <InputTrade stockSymbol={stockSymbol} handleSubmit={handleSubmit} />
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
        <Divider textAlign="left">Trades</Divider>
        <div className="mt-3" style={{ height: 400 }}>
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