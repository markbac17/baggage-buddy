import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import NavBar from './components/NavBar';
import Customer from './components/Customer';
import Vendor from './components/Vendor';
import Dashboard from './components/Dashboard'
import './App.css';


function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Route exact path="/Customer" component={Customer} />
      <Route exact path="/Vendor" component={Vendor} />
      <Route exact path="/Dashboard" component={Dashboard} />
    </BrowserRouter>
  );
}

export default App;