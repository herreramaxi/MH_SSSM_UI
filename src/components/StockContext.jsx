import { createContext, useState } from "react";
const StockContext = createContext(undefined);
const StockDispatchContext = createContext(undefined);

function StockProvider({ children }) {
    const [stockSymbol, setStockSymbol] = useState();
    const [resetTrades, setResetTrades] = useState();

    return (
        <StockContext.Provider value={{ stockSymbol, resetTrades }}>
            <StockDispatchContext.Provider value={{ setStockSymbol, setResetTrades }}>
                {children}
            </StockDispatchContext.Provider>
        </StockContext.Provider>
    );
}

export { StockProvider, StockContext, StockDispatchContext };