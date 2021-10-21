import { createContext, useState } from "react";
const StockContext = createContext(undefined);
const StockDispatchContext = createContext(undefined);

function StockProvider({ children }) {
    const [stockSymbol, setStockSymbol] = useState();

    return (
        <StockContext.Provider value={stockSymbol}>
            <StockDispatchContext.Provider value={setStockSymbol}>
                {children}
            </StockDispatchContext.Provider>
        </StockContext.Provider>
    );
}

export { StockProvider, StockContext, StockDispatchContext };