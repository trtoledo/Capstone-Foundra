import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { useAuth } from "../Context/AuthContext";
import "./TopNav.css";

export default function TopNav() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { token, setToken, setUser, setRole, setRefresh, user } = useAuth();

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

  const toggleNav = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <div className={`topnav ${collapsed ? "collapsed" : ""}`}>
      <div className="nav-section nav-left">
        <button className="toggle-btn" style={{ width: 100, margin: 0 }}onClick={toggleNav}>
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

      <div className="nav-section nav-center">
      <ul className="nav-list main-nav">
        {mainNavItems.map((item, index) => (
          <li
            key={index}
            className={`nav-item ${
              item.label === "Explore" ? "explore-nav-item" : ""
            }`}
          >
            {item.label === "Explore" ? (
              <div className="nav-link-wrapper">
                <Link to={item.path} className="nav-link">
                  {item.icon}
                  {!collapsed && (
                    <span className="nav-label">{item.label}</span>
                  )}
                </Link>

                {!collapsed && (
                  <div className="dropdown-menu">
                    <Link to="/candidates" className="nav-link dropdown-link">
                      <FaUserPlus />
                      <span className="nav-label">Candidates</span>
                    </Link>
                    <Link to="/companies" className="nav-link dropdown-link">
                      <FaBriefcase />
                      <span className="nav-label">Companies</span>
                    </Link>
                    <Link to="/industries" className="nav-link dropdown-link">
                      <FaCompass />
                      <span className="nav-label">Industries</span>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <Link to={item.path} className="nav-link">
                {item.icon}
                {!collapsed && <span className="nav-label">{item.label}</span>}
              </Link>
            )}
          </li>
        ))}
      </ul>
      </div>
      <div className="nav-section nav-right">
      <ul className="nav-list auth-nav">
        {token ? (
          <>
            <li className="nav-item">
              <Link to="/dashboard" className="nav-link">
                <FaInfoCircle />
                {!collapsed && <span className="nav-label">Dashboard</span>}
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/"
                onClick={() => {
                  setToken(null);
                  setUser(null);
                  setRole("");
                  localStorage.clear();
                  setRefresh((r) => !r);
                }}
                className="nav-link"
              >
                <FaSignInAlt />
                {!collapsed && <span className="nav-label">Logout</span>}
              </Link>
            </li>
            <li className="nav-item avatar-item">
              <Link to="/profile" className="nav-link avatar-link">
                <img
                  src={user?.avatarUrl || "/assets/flounder_foundra.jpg"}
                  alt="User Avatar"
                  className="nav-avatar"
                />
              </Link>
            </li>
          </>
        ) : (
          authNavItems.map((item, index) => (
            <li key={index} className="nav-item">
              <Link to={item.path} className="nav-link">
                {item.icon}
                {!collapsed && <span className="nav-label">{item.label}</span>}
              </Link>
            </li>
          ))
        )}
      </ul>
      </div>
    </div>
  );
}
