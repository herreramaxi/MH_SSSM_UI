import React from "react";
import ReactApexChart from "react-apexcharts";

export const StockGraph = (props) => {
    const { graphData } = props;

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

    return (<>
        <ReactApexChart options={options} series={[{
            name: "Price",
            data: graphData ?? []
        }]} type="area" height={300} />
    </>
    );
}