import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "./Context/AuthContext";
import foundralogo from "../assets/foundralogo.png";
import foundralogoDM from "../assets/foundralogoDM.png";

const Navbar = () => {
  const { token, setToken } = useAuth();

  return (
    <nav className="navbar">
      <div>
        <img src={foundralogo} alt="logo" style={{ height: "40px" }} />
      </div>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>

        <li>
          <Link to="/explore">Explore</Link>
        </li>

        <li>
          <Link to="/get-found">Get Found</Link>
        </li>

        <li>
          <Link to="/register">Register</Link>
        </li>

        <li>
          <Link to="/login">Login</Link>
        </li>

        <li>
          <Link to="/" onClick={() => setToken(false)}>
            Logout
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
