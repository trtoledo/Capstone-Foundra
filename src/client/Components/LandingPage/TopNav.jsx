import React, { useState } from "react";
import {
  FaHome,
  FaCompass,
  FaBriefcase,
  FaQuestionCircle,
  FaInfoCircle,
  FaUserPlus,
  FaSignInAlt,
  FaBars,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import "./TopNav.css";

export default function TopNav() {
  const [collapsed, setCollapsed] = useState(false);
  const toggleNav = () => setCollapsed(!collapsed);

  const mainNavItems = [
    { icon: <FaHome />, label: "Home", path: "/" },
    { icon: <FaCompass />, label: "Explore", path: "/explore" },
    { icon: <FaBriefcase />, label: "Get Found", path: "/get-found" },
    { icon: <FaQuestionCircle />, label: "I'm Lost", path: "/lost-hiring" },
    { icon: <FaInfoCircle />, label: "About Us", path: "/about" },
  ];

  const authNavItems = [
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
          <Link to="/" className="nav-logo-link">
            <img
              src="/foundra-logo.png"
              alt="Foundra Logo"
              className="nav-logo"
            />
          </Link>
        )}
      </div>

      {/* Main Navigation */}
      <ul className="nav-list main-nav">
        {mainNavItems.map((item, index) => (
          <li key={index} className="nav-item">
            <Link to={item.path} className="nav-link">
              {item.icon}
              {!collapsed && <span className="nav-label">{item.label}</span>}
            </Link>
          </li>
        ))}
      </ul>

      {/* Auth Navigation (right side) */}
      <ul className="nav-list auth-nav">
        {authNavItems.map((item, index) => (
          <li key={index} className="nav-item">
            <Link to={item.path} className="nav-link">
              {item.icon}
              {!collapsed && <span className="nav-label">{item.label}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}





