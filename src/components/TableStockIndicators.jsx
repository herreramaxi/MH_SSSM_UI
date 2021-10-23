import { Chip, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableRow, Tooltip } from "@mui/material";
import React from "react";

export const TableStockIndicators = (props) => {
    const { stockData } = props;

    return (
        <> <TableContainer component={Paper}>
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
        </>);
}