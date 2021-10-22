import React, { useCallback, useEffect, useState } from "react";
import { Fragment } from "react";
import { Button, FormControl, InputLabel, Select, MenuItem, TextField, Tooltip, TableContainer, Paper, Table, TableRow, TableBody, TableCell, Chip, Stack, Divider } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import "./tableStyle.css";
import Api from './StockMarketApi';
import { StockContext } from "./StockContext";
import ReactApexChart from "react-apexcharts";

export const StockMarket = (props) => {
    const stockContext = React.useContext(StockContext);
    const [stockData, setStockData] = useState();
    const [priceForTrade, setPriceForTrade] = useState();
    const [quantityOfShares, setQuantityOfShares] = useState();
    const [tradeIndicator, setTradeIndicator] = useState();
    const [trades, setTrades] = useState();
    const [graphData, setGraphData] = useState();


    useEffect(() => {
        Api.getTrades().then(r => {
            if (!r.data) return;

            setTrades(r.data);
        }).catch(
            function (error) {
                console.log('Endpoint error: api/getTrades');
                console.log(error);
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
                return Promise.reject(error)
            }
        );

    }, [setStockData]);
    // useInterval(getStockMarketData, 5000);

    useEffect(() => {
        if (!stockContext) {
            setStockData(undefined);
            setTrades(undefined);
            setGraphData(undefined);
            return;
        }

        handleOnChangedSymbol(stockContext);
    }, [stockContext, setStockData, setGraphData, handleOnChangedSymbol]);

    const handleSubmit = useCallback((event) => {
        event?.preventDefault();

        var trade = {
            stockSymbol: stockContext,
            quantityOfShares: Math.floor(quantityOfShares),
            price: parseFloat(priceForTrade).toFixed(2),
            tradeIndicator: tradeIndicator
        };

        Api.trade(trade).then(r => {
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
        [setTrades, handleOnChangedSymbol, stockContext, quantityOfShares, priceForTrade, tradeIndicator, setPriceForTrade, setQuantityOfShares, setTradeIndicator],
    )

    useEffect(() => {
        if (!trades || !stockContext) return;
        var myData = trades.filter(x => x.stockSymbol === stockContext).map(x => [x.timeStamp, x.price]);

        setGraphData(myData);
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
                        <Tooltip title="Last price" arrow followCursor>

                            <p style={{ fontSize: "36px", fontWeight: "bolder" }}>{stockData?.latstPrice > 0 ? stockData?.latstPrice.toLocaleString() : "N/A"}</p>

                        </Tooltip>
                    </Stack>
                }
                {!stockData &&
                    <Tooltip title="Please search a stock symbol" arrow followCursor>
                        <h3>Stock symbol N/A</h3>
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
                                type="number"
                                inputProps={{
                                    maxLength: 13,
                                    step: "10"
                                }}
                                size="small"
                                id="outlined-required"
                                label="Price"
                                value={priceForTrade || ''}
                                onChange={e => {
                                    if (e.target.value.length > 13) return;

                                    setPriceForTrade(e.target.value);
                                }}
                            />
                        </div>
                        <div className="p-2 w-25">
                            <TextField
                                required
                                type="number"

                                inputProps={{
                                    maxLength: 13,
                                    step: "10",
                                    pattern: '[0-9]*'
                                }}
                                size="small"
                                id="outlined-required"
                                label="Quantity"
                                value={quantityOfShares || ''}
                                onChange={e => {
                                    if (e.target.value.length > 9) return;

                                    setQuantityOfShares(e.target.value);
                                }}
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
                                <span>
                                    <Button type="submit" variant="outlined" size="large" disabled={stockContext === undefined} >Trade</Button>
                                </span>
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
                    data: graphData ?? []
                }]} type="area" height={300} />

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
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row">Last Dividend</TableCell>
                                <TableCell align="right">{stockData?.lastDividend ?? "N/A"}</TableCell>
                            </TableRow>
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row">Fixed Dividend</TableCell>
                                <TableCell align="right">{stockData?.fixedDividend ?? "N/A"}</TableCell>
                            </TableRow>
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row">Par value</TableCell>
                                <TableCell align="right">{stockData?.parValue ?? "N/A"}</TableCell>
                            </TableRow>
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <Tooltip title="last dividend / price" followCursor >
                                    <TableCell component="th" scope="row">Dividend yield</TableCell>
                                </Tooltip>
                                <TableCell align="right">{stockData?.dividendYield ?? "N/A"}</TableCell>
                            </TableRow>
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <Tooltip title="price / dividend" followCursor >
                                    <TableCell component="th" scope="row">P/E Ratio</TableCell>
                                </Tooltip>
                                <TableCell align="right">{stockData?.peRatio ?? "N/A"}</TableCell>
                            </TableRow>
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <Tooltip title="Σ Traded price × Quantity / Σ Quantity" followCursor >
                                    <TableCell component="th" scope="row">Volume Weighted Stock Price (last 15 min)</TableCell>
                                </Tooltip>
                                <TableCell align="right">{stockData?.volumeWeightedStockPrice ?? "N/A"}</TableCell>
                            </TableRow>
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <Tooltip title="(p1p2p3...pn)^1/n" followCursor >
                                    <TableCell component="th" scope="row">GBCE All Share Index</TableCell>
                                </Tooltip>
                                <TableCell align="right">{stockData?.gbceAllShareIndex ?? "N/A"}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>

            </div>

        </div>

        <div style={{ height: 400 }}>
            <DataGrid
                rows={trades ?? []}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
            />
        </div>



    </Fragment >);
}