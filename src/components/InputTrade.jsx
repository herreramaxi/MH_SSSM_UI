import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Tooltip } from "@mui/material";
import React, { useCallback, useState } from "react";

export const InputTrade = (props) => {
    const { handleSubmit, stockSymbol } = props;

    const [priceForTrade, setPriceForTrade] = useState();
    const [quantityOfShares, setQuantityOfShares] = useState();
    const [tradeIndicator, setTradeIndicator] = useState();

    const onHandleSubmit = useCallback(
        (event) => {
            event?.preventDefault();

            var trade = {
                stockSymbol: stockSymbol,
                quantityOfShares: Math.floor(quantityOfShares),
                price: parseFloat(priceForTrade).toFixed(2),
                tradeIndicator: tradeIndicator
            };

            handleSubmit(trade, () => {
                setPriceForTrade(undefined);
                setQuantityOfShares(undefined);
                setTradeIndicator(0);
            });
        },
        [stockSymbol, quantityOfShares, priceForTrade, tradeIndicator, handleSubmit],
    );

    return (<>
        <form onSubmit={onHandleSubmit}>
            <div className="d-flex flex-row ">
                <div className="p-2 w-25">
                    <TextField
                        required
                        type="number"
                        inputProps={{
                            maxLength: 10,
                            step: "10"
                        }}
                        size="small"
                        id="outlined-required"
                        label="Price"
                        value={priceForTrade || ''}
                        onChange={e => {
                            if (!e?.target?.value || e.target.value.length > 10 || parseInt(e.target.value) > 1000000) return;

                            setPriceForTrade(e.target.value);
                        }}
                    />
                </div>
                <div className="p-2 w-25">
                    <TextField
                        required
                        type="number"

                        inputProps={{
                            maxLength: 9,
                            step: "10",
                            pattern: '[0-9]*'
                        }}
                        size="small"
                        id="outlined-required"
                        label="Quantity"
                        value={quantityOfShares || ''}
                        onChange={e => {
                            if (!e?.target?.value || e.target.value.length > 9 || parseInt(e.target.value) > 1000000) return;

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
                    <Tooltip title={stockSymbol === undefined ? "Please select a stock symbol" : "Trade"} followCursor >
                        <span>
                            <Button type="submit" variant="outlined" size="large" disabled={stockSymbol === undefined} >Trade</Button>
                        </span>
                    </Tooltip>
                </div>
            </div>

        </form>
    </>);
}