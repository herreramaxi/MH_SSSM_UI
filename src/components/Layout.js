import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { NavMenu } from './NavMenu';
import { StockProvider } from './StockContext';

export class Layout extends Component {
  static displayName = Layout.name;

  render() {
    return (
      <div>
        <StockProvider >
          <NavMenu />
          <Container>
            {this.props.children}
          </Container>
        </StockProvider>
      </div>
    );
  }
}
