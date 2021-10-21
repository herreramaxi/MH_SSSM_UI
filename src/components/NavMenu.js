import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Collapse, Container, Navbar } from 'reactstrap';
import './NavMenu.css';
import { Autocomplete, TextField } from "@mui/material";
import Api from './StockMarketApi';
import { StockDispatchContext } from './StockContext';

export const NavMenu = (props) => {
  // const displayName = NavMenu.name;
  const [collapsed] = useState(true);
  const [stockData, setStockData] = useState();
  const setStockContext = useContext(StockDispatchContext);

  const [stockLabel, setStockLabel] = useState();
  // const toggleNavbar = () => {
  //   setCollapsed(state => !state);
  // }

  useEffect(() => {

    Api.getSampleData().then(r => {
      if (!r.data) return;

      setStockLabel("GBCE: " + r.data.symbolStock);
      console.log(r.data)
      setStockData(r.data);
    }).catch(
      function (error) {
        console.log('Endpoint error: api/stockmarket');
        console.log(error);
        return Promise.reject(error)
      }
    );
  }, [setStockData, setStockLabel])

  const handleOnChangedSymbol = useCallback((value) => {
    if (!value) return;

    console.log(value.stockSymbol);
    setStockContext(value.stockSymbol);
  },
    [setStockContext],
  );


  return (
    <header>
      <Navbar className=" navbar-inverse navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" light>
        <Container>
          <Autocomplete
            freeSolo
            className="mt-2"
            sx={{ width: 300 }}
            id="free-solo-2-demo"
            disableClearable
            value={stockLabel}
            getOptionLabel={(option) => "GBCE: " + option?.stockSymbol}
            options={stockData ?? []}
            onChange={(event, value) => handleOnChangedSymbol(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search symbol"
                size="small"
                InputProps={{
                  ...params.InputProps,
                  type: 'search',
                }}
              />
            )}
          />
          {/* <NavbarBrand tag={Link} to="/">SSSM.Website</NavbarBrand> */}
          {/* <NavbarToggler onClick={toggleNavbar} className="mr-2" /> */}
          <Collapse className="d-sm-inline-flex flex-sm-row-reverse  d-flex justify-content-right" isOpen={!collapsed} navbar>

            <ul className="navbar-nav flex-grow">
              {/* <NavItem>
                <NavLink tag={Link} className="text-dark" to="/stockmarket">StockMarket</NavLink>
              </NavItem> */}
              {/* <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/">Home</NavLink>
                </NavItem>       */}
            </ul>
          </Collapse>
        </Container>
      </Navbar>
    </header>
  );
};
