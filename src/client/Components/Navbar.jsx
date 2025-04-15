import React, { useState, useEffect } from "react";

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        
          <li>
            <Link to="/register">Register</Link>
          </li>
        
          <li>
            <Link to="/account">Account</Link>
          </li>
        
        
          <li>
            <Link to="/login">Login</Link>
          </li>
        
          <li>
            <Link to="/" onClick={() => handleLoginLogout(false)}>
              Logout
            </Link>
          </li>
        
      </ul>
    </nav>
  );
};

export default Navbar;
