import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import axios from 'axios';

export const StockMarket = (props) => {

    const [stockData, setStockData] = useState();

    useEffect(() => {

        const fetchData = async () => {

            axios.get('api/stockmarket').then(r => {
                if (!r.data) return;

                setStockData(r.data);
                console.log(r.data);
            });
        }
        // const response = await fetch('api/stockmarket');
        // const json = await response.json();


        fetchData();
    }, [setStockData]);
    // async populateWeatherData() {
    //     const response = await fetch('weatherforecast');
    //     const data = await response.json();
    //     this.setState({ forecasts: data, loading: false });
    //   }

    return (<Fragment>
        <ul>
            {stockData && stockData.map((s, i) =>
                <li key={i}>
                    {s.stockSymbol}
                </li>
            )}
        </ul>
    </Fragment>);
}