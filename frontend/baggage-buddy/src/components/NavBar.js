import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <span className="header">
      <div className="container"><Link to="/Customer">Customer</Link></div>
      <div className="container"><Link to="/Vendor">Vendor</Link></div>
      <div className="container"><Link to="/Dashboard">Dashboard</Link></div>
    </span>
  )
}

export default NavBar;