import { Stack, Tooltip } from "@mui/material";
import React from "react";

export const StockSymbolLastPrice = (props) => {
    const { stockData } = props;

    return (<>
        {stockData &&
            <Stack direction="column" spacing={-3}>
                <Tooltip title="Stock symbol" arrow followCursor>
                    <p style={{ fontSize: "1rem", fontWeight: "lighter" }}>{stockData?.stockSymbol} - Global Beverage Corporation Exchange</p>
                </Tooltip>
                <Tooltip title="Last price" arrow followCursor>
                    <p style={{ fontSize: "36px", fontWeight: "bolder" }}>{stockData?.lastPrice > 0 ? stockData?.lastPrice?.toLocaleString() : "N/A"}</p>
                </Tooltip>
            </Stack>
        }
        {!stockData &&
            <Tooltip title="Please search a stock symbol" arrow followCursor>
                <h3>Stock symbol N/A</h3>
            </Tooltip>}
    </>);
}