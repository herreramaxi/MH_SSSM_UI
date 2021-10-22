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

  trade(aTrade) {
    return axios.post('api/stockmarket/trade', aTrade);
  }

  clearOnMemoryData() {
    return axios.post('api/stockmarket/clearOnMemoryData');
  }
}

export default new Api();