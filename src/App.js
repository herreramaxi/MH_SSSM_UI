import React from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { StockMarket } from './components/StockMarket';

function App() {
  return (
    <Layout>
      <Route exact path='/' component={Home} />
      <Route path='/stockmarket/' component={StockMarket} />
    </Layout>
  );
}

export default App;
