import React, { Component } from 'react';
import { StockMarket } from './StockMarket';

export class Home extends Component {
  static displayName = Home.name;

  render() {
    return (
      <div>
        <StockMarket />
      </div>
    );
  }
}
