import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../Context/AuthContext";
// import foundralogo from "../assets/foundralogo.png";
// import foundralogoDM from "../assets/foundralogoDM.png";

const Navbar = () => {
  const { token, setToken } = useAuth();

  return (
    <nav className="navbar">
      <div className="logo">
        <a href="/">
          <img src={foundralogo} alt="logo" />
        </a>
      </div>
      <ul>
        <li>
          <a href="/">Home</a>
        </li>

        <li>
          <a href="/explore">Explore</a>
        </li>

        <li>
          <a href="/get-found">Get Found</a>
        </li>

        <li>
          <a href="/register">Register</a>
        </li>

        <li>
          <a href="/login">Login</a>
        </li>

        <li>
          <a href="/" onClick={() => setToken(false)}>
            Logout
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
