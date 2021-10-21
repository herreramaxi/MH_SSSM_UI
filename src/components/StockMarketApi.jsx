import axios from "axios";

class Api {

  getSampleData() {
    return axios.get('api/stockmarket');
  }

  getStockCalculations(stockSymbol) {
    return axios.get('api/stockmarket/getStockCalculations', {
      params: {
        stockSymbol: stockSymbol
      }
    });
  }

  getTrades() {
    return axios.get('api/stockmarket/getTrades');
  }
}

export default new Api();