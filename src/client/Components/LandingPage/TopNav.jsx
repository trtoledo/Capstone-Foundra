import React, { useState } from "react";
import {
  FaHome,
  FaCompass,
  FaBriefcase,
  FaUserPlus,
  FaSignInAlt,
  FaBars,
  FaUserCircle
} from "react-icons/fa";
import { Link } from "react-router-dom";
import "./TopNav.css";

export default function TopNav() {
  const [collapsed, setCollapsed] = useState(false);
  const toggleNav = () => setCollapsed(!collapsed);

  const navItems = [
    { icon: <FaHome />, label: "Home", path: "/" },
    { icon: <FaCompass />, label: "Explore", path: "/explore" },
    { icon: <FaBriefcase />, label: "Get Found", path: "/get-found" },
    { icon: <FaUserPlus />, label: "Register", path: "/register" },
    { icon: <FaSignInAlt />, label: "Login", path: "/login" },
  ];

  return (
    <div className={`topnav ${collapsed ? "collapsed" : ""}`}>
      <div className="topnav-left">
        <button className="toggle-btn" onClick={toggleNav}>
          <FaBars />
        </button>
        {!collapsed && (
          <img
            src="/foundra-logo.png"
            alt="Foundra Logo"
            className="nav-logo"
          />
        )}
      </div>

      <ul className="nav-list">
        {navItems.map((item, index) => (
          <li key={index} className="nav-item">
            <Link to={item.path} className="nav-link">
              {item.icon}
              {!collapsed && <span className="nav-label">{item.label}</span>}
            </Link>
          </li>
        ))}
      </ul>

      <div className="sidebar-footer">
        <FaUserCircle className="user-icon" />
        {!collapsed && <span className="user-name">You</span>}
      </div>
    </div>
  );
}



