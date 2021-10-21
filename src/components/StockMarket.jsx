import React, { useCallback, useEffect, useState } from "react";
import { Fragment } from "react";
import axios from 'axios';
import { Button, FormControl, InputLabel, Select, MenuItem, TextField, Tooltip, TableContainer, Paper, Table, TableRow, TableBody, TableCell, Chip, Stack, Divider } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import "./tableStyle.css";
import Api from './StockMarketApi';
import { StockContext } from "./StockContext";
import ReactApexChart from "react-apexcharts";
import Moment from 'moment';
export const StockMarket = (props) => {
    const stockContext = React.useContext(StockContext);
    const [stockData, setStockData] = useState();
    const [priceForTrade, setPriceForTrade] = useState();
    const [quantityOfShares, setQuantityOfShares] = useState();
    const [tradeIndicator, setTradeIndicator] = useState();
    const [trades, setTrades] = useState();
    const [data, setData] = useState();

    const callBackGetTrades = useCallback(() => {
        Api.getTrades().then(r => {
            if (!r.data) return;
            console.log(r.data);
            setTrades(r.data);
        }).catch(
            function (error) {
                console.log('Endpoint error: api/getTrades');
                console.log(error);
                return Promise.reject(error)
            }
        );
    }, [setTrades]);

    useEffect(() => {
        callBackGetTrades();
    }, [callBackGetTrades]);


    const handleOnChangedSymbol = useCallback((symbol) => {
        Api.getStockCalculations(symbol).then(r => {
            if (!r.data) return;
            console.log(r.data);

            setStockData(r.data);
        }).catch(
            function (error) {
                console.log('Endpoint error: api/stockmarket/getStockCalculations');
                console.log(error);
                return Promise.reject(error)
            }
        );

    }, [setStockData]);
    // useInterval(getStockMarketData, 5000);

    useEffect(() => {
        if (!stockContext) return;
        handleOnChangedSymbol(stockContext);
    }, [stockContext, handleOnChangedSymbol]);

    const handleSubmit = useCallback(
        (event) => {
            event?.preventDefault();

            var trade = {
                stockSymbol: stockContext,
                quantityOfShares: quantityOfShares,
                price: priceForTrade,
                tradeIndicator: tradeIndicator
            };

            axios.post('api/stockmarket/trade', trade).then(r => {
                if (!r.data) return;

                setPriceForTrade(undefined);
                setQuantityOfShares(undefined);
                setTradeIndicator(0);

                setTrades(prevState => [...prevState, r.data]);

                //I am trying to avoid polling in here
                handleOnChangedSymbol(stockContext);
            }).catch(
                function (error) {
                    console.log('Endpoint error: api/stockmarket/trade');
                    console.log(error);
                    return Promise.reject(error)
                }
            )
        },
        [handleOnChangedSymbol, stockContext, quantityOfShares, priceForTrade, tradeIndicator, setPriceForTrade, setQuantityOfShares, setTradeIndicator],
    )

    useEffect(() => {
        if (!trades || !stockContext) return;
        var myData = trades.filter(x => x.stockSymbol === stockContext).map(x => [x.timeStamp, x.price]);
        console.log("mydata")
        console.log(myData);
        setData(myData);
    }, [trades, stockContext]);

    const columns = [
        { field: 'stockSymbol', headerName: 'Symbol', width: 130 },
        { field: 'price', headerName: 'Price', width: 130 },
        { field: 'quantityOfShares', headerName: 'Quantity of shares', width: 130 },
        { field: 'tradeIndicatorDesc', headerName: 'Trade indicator', width: 130 },
        { field: 'timeStamp', type: 'dateTime', headerName: 'Timestamp', minWidth: 200 },
    ];


    const options = {
        chart: {
            type: "area",
            stacked: false,
            height: 350,
            zoom: {
                type: "x",
                enabled: true,
                autoScaleYaxis: true
            },
            toolbar: {
                autoSelected: "zoom"
            }
        },
        dataLabels: {
            enabled: false
        },
        markers: {
            size: 0,
        },
        title: {
            // text: "Temperature",            
            // align: "left"
        },
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                inverseColors: false,
                opacityFrom: 0.5,
                opacityTo: 0,
                stops: [0, 90, 100]
            },
        },
        yaxis: {
            labels: {
                formatter: function (val) {
                    return (val).toFixed(2);
                },
            },
            title: {
                text: "Price"
            },
        },
        xaxis: {
            type: "datetime",
            // datetimeFormatter: {
            //     year: 'yyyy',
            //     month: 'MMM \'yy',
            //     day: 'dd MMM',
            //     hour: 'HH:mm:ss',
            //     minute: 'mm:ss',
            //     second: 'ss'
            // },
            // labels: {
            //     formatter: function (val) {
            //         return Moment(val).format("YYYY-dd-MM hh:mm:ss")
            //     },
            // },
        },
        tooltip: {
            shared: false,
            y: {
                formatter: function (val) {
                    return (val).toFixed(2)
                }
            }
        }
    };

    return (<Fragment>
        <div className="d-flex flex-row justify-content-between">
            <div className="p-2 mr-auto">
                {stockData &&
                    <Stack direction="column" spacing={-3}>
                        <Tooltip title="Stock symbol" arrow followCursor>
                            <p style={{ fontSize: "1rem", fontWeight: "lighter" }}>{stockData?.stockSymbol} - Global Beverage Corporation Exchange</p>
                        </Tooltip>
                        <Tooltip title="Latest price" arrow followCursor>

                            <p style={{ fontSize: "36px", fontWeight: "bolder" }}>{stockData?.latestPrice > 0 ? stockData?.latestPrice.toLocaleString() : "N/A"}</p>

                        </Tooltip>
                    </Stack>
                }
                {!stockData &&
                    <Tooltip title="Please search a stock symbol" arrow followCursor>
                        <h3>N/A stock symbol</h3>
                    </Tooltip>}
            </div >
            <div className="p-2">
            </div>
            <div className="p-2 align-self-end">
                <form onSubmit={handleSubmit}>
                    <div className="d-flex flex-row ">
                        <div className="p-2 w-25">
                            <TextField
                                required
                                size="small"
                                id="outlined-required"
                                label="Price"
                                value={priceForTrade || ''}
                                onChange={e => setPriceForTrade(e.target.value)}
                            />
                        </div>
                        <div className="p-2 w-25">
                            <TextField
                                required
                                size="small"
                                id="outlined-required"
                                label="Quantity of shares"
                                value={quantityOfShares || ''}
                                onChange={e => setQuantityOfShares(e.target.value)}
                            />
                        </div>
                        <div className="p-2 w-25">
                            <FormControl variant="outlined" size="small" margin="none" hiddenLabel fullWidth>
                                <InputLabel id="demo-simple-select-label">Trade indicator</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Trade indicator"
                                    placeholder="Trade indicator"
                                    defaultValue={0}
                                    onChange={(event) =>
                                        setTradeIndicator(event.target.value)
                                    }
                                >
                                    <MenuItem value={0}>Buy</MenuItem>
                                    <MenuItem value={1}>Sell</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <div className="p-2 ">
                            <Tooltip title={stockContext === undefined ? "Please select a stock symbol" : "Trade"} followCursor >
                                <Button type="submit" variant="contained" size="large" disabled={stockContext === undefined} >Trade</Button>
                            </Tooltip>
                        </div>
                    </div>

                </form>
            </div>
        </div>
        <Divider />
        <br />
        <div className="row">


            <div className="col-7">

                <ReactApexChart options={options} series={[{
                    name: "Price",
                    data: data
                }]} type="area" height={350} />

            </div>
            <div className="col-5">
                <TableContainer component={Paper}>
                    <Table sx={{}} size="small" aria-label="a dense table">
                        <TableBody>
                            {stockData &&
                                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell align="left">
                                        <Stack direction="row" spacing={2}>
                                            <Chip label="Stock" clickable />
                                            <Chip label={stockData?.stockTypeDesc ?? "N/A"} clickable />
                                        </Stack>
                                    </TableCell>
                                    <TableCell >
                                    </TableCell>
                                </TableRow>}
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}                            >
                                <TableCell component="th" scope="row">Last Dividend</TableCell>
                                <TableCell align="right">{stockData?.lastDividend ?? "N/A"}</TableCell>
                            </TableRow>
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}                            >
                                <TableCell component="th" scope="row">Fixed Dividend</TableCell>
                                <TableCell align="right">{stockData?.fixedDividend ?? "N/A"}</TableCell>
                            </TableRow>
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}                            >
                                <TableCell component="th" scope="row">Par value</TableCell>
                                <TableCell align="right">{stockData?.parValue ?? "N/A"}</TableCell>
                            </TableRow>
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}                            >
                                <TableCell component="th" scope="row">Dividend yield</TableCell>
                                <TableCell align="right">{stockData?.dividendYield ?? "N/A"}</TableCell>
                            </TableRow>
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}                            >
                                <TableCell component="th" scope="row">P/E Ratio</TableCell>
                                <TableCell align="right">{stockData?.peRatio ?? "N/A"}</TableCell>
                            </TableRow>
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}                            >
                                <TableCell component="th" scope="row">Volume Weighted Stock Price (last 15 min)</TableCell>
                                <TableCell align="right">{stockData?.volumeWeightedStockPrice ?? "N/A"}</TableCell>
                            </TableRow>
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}                            >
                                <TableCell component="th" scope="row">GBCE All Share Index</TableCell>
                                <TableCell align="right">{stockData?.gbceAllShareIndex ?? "N/A"}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>

            </div>

        </div>
        {
            trades && <div style={{ height: 400 }}>
                <DataGrid
                    rows={trades}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                />
            </div>
        }


    </Fragment >);
}