import React, { useCallback, useEffect, useState } from "react";
import { Fragment } from "react";
import axios from 'axios';
import { Autocomplete, Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import useInterval from "react-useinterval";

export const StockMarket = (props) => {
    const [stockData, setStockData] = useState();
    const [selectedSymbol, setSelectedSymbol] = useState();
    const [priceForTrade, setPriceForTrade] = useState();
    const [quantityOfShares, setQuantityOfShares] = useState();
    const [tradeIndicator, setTradeIndicator] = useState();
    const [dividendYield, setDividendYield] = useState();
    const [pERatio, setPERatio] = useState();
    const [vWSP, setVWSP] = useState();
    const [latestPrice, setLatestPrice] = useState();
    const [gBCEAllShareIndex, setGBCEAllShareIndex] = useState();

    useEffect(() => {
        axios.get('api/stockmarket').then(r => {
            if (!r.data) return;

            setStockData(r.data);
        }).catch(
            function (error) {
                console.log('Endpoint error: api/stockmarket');
                console.log(error);
                return Promise.reject(error)
            }
        );
    }, [setStockData]);


    const handleOnChangedSymbol = useCallback((value) => {

        axios.get('api/stockmarket/getStockCalculations', {
            params: {
                stockSymbol: value.stockSymbol
            }
        }).then(r => {
            if (!r.data) return;
            console.log(r.data);
            setDividendYield(r.data.dividendYield);
            setPERatio(r.data.peRatio);
            setVWSP(r.data.volumeWeightedStockPrice);
            setLatestPrice(r.data.latestPrice);
            setGBCEAllShareIndex(r.data.gbceAllShareIndex);
        }).catch(
            function (error) {
                setDividendYield(undefined);
                setPERatio(undefined);
                setVWSP(undefined);
                setLatestPrice(undefined);

                console.log('Endpoint error: api/stockmarket/getStockCalculations');
                console.log(error);
                return Promise.reject(error)
            }
        );

        setSelectedSymbol(value);
    }, [setSelectedSymbol, setDividendYield, setPERatio, setVWSP, setLatestPrice, setGBCEAllShareIndex]);
    // useInterval(getStockMarketData, 5000);

    const handleSubmit = useCallback(
        (event) => {
            event?.preventDefault();

            var trade = {
                stockSymbol: selectedSymbol?.stockSymbol,
                quantityOfShares: quantityOfShares,
                price: priceForTrade,
                tradeIndicator: tradeIndicator
            };

            axios.post('api/stockmarket/trade', trade).then(r => {
                if (!r.data) return;

                setPriceForTrade(undefined);
                setQuantityOfShares(undefined);
                setTradeIndicator(0);

                console.log(r.data);
            }).catch(
                function (error) {
                    console.log('Endpoint error: api/stockmarket/trade');
                    console.log(error);
                    return Promise.reject(error)
                }
            )
        },
        [selectedSymbol, quantityOfShares, priceForTrade, tradeIndicator, setPriceForTrade, setQuantityOfShares, setTradeIndicator],
    )

    return (<Fragment>
        <Autocomplete
            freeSolo
            id="free-solo-2-demo"
            disableClearable
            getOptionLabel={(option) => option?.stockSymbol}
            options={stockData ?? []}
            onChange={(event, value) => handleOnChangedSymbol(value)}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Search symbol"
                    InputProps={{
                        ...params.InputProps,
                        type: 'search',
                    }}
                />
            )}
        />
        <hr />

        <h3>Latest price: {latestPrice}</h3>
        <div className="row">
            <div className="col">

                <table className="table">
                    <tbody>
                        <tr>
                            <td>Dividend yield</td>
                            <td>{dividendYield}</td>
                        </tr>
                        <tr>
                            <td>P/E Ratio</td>
                            <td>{pERatio}</td>
                        </tr>
                        <tr>
                            <td>Volume Weighted Stock Price (last 15 min)</td>
                            <td>{vWSP}</td>
                        </tr>
                        <tr>
                            <td>GBCE All Share Index</td>
                            <td>{gBCEAllShareIndex}</td>
                        </tr>
                    </tbody>
                </table>

            </div>

            <div className="col">
                <table className="table">
                    <tbody>
                        <tr>
                            <td>Stock type </td>
                            <td>{selectedSymbol?.type === 0 ? "Common" : "Preferred"}</td>
                        </tr>
                        <tr>
                            <td>Last Dividend</td>
                            <td>{selectedSymbol?.lastDividend}</td>
                        </tr>
                        <tr>
                            <td>Fixed Dividend</td>
                            <td>{selectedSymbol?.fixedDividend}</td>
                        </tr>
                        <tr>
                            <td>Par value</td>
                            <td>{selectedSymbol?.parValue}</td>
                        </tr>
                    </tbody>
                </table>

            </div>
        </div>


        <form onSubmit={handleSubmit}>
            <div className="container">
                <div className="row">
                    <div className="form-group mb-2 col-2">
                        <input type="text" className="form-control" value={priceForTrade || ''} onChange={e => setPriceForTrade(e.target.value)} placeholder="Price" />
                    </div>
                    <div className="form-group mb-2 col-2">
                        <input type="text" className="form-control" value={quantityOfShares || ''} onChange={(e) => setQuantityOfShares(e.target.value)} placeholder="Quantity of shares" />
                    </div>
                    <div className="form-group col-2 ">
                        <FormControl variant="standard" size="small" fullWidth>
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
                    <div className="form-group mb-2 col-2 ">
                        <Button type="submit" variant="contained" >Trade</Button>
                    </div>
                </div>

            </div>

        </form>
        {/* <p>Dividend yield: </p>
        <p>P/E Ratio: </p>
        <p>Volume Weighted Stock Price (last 15 min): </p>
        <p>GBCE All Share Index: </p> */}


    </Fragment >);
}