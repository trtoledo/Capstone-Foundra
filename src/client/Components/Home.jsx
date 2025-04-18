import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import "./Home.css";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/search-results?q=${searchQuery}&location=${location}`);
    // fetch(`/api/search?q=${searchQuery}&location=${location}`)
    //   .then(res => res.json())
    //   .then(data => {
    //     // Handle search results
    //     console.log("Search results:", data);
    //     // navigate('/search-results', { state: { results: data } });
    //   });
  };

  return (
    <div className="home-container">
      {/* <header className="navbar">
        <div className="logo">🏢 Foundra</div>
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/explore">Explore</Link>
          <Link to="/get-found">Get Found</Link>
          <Link to="/search">Search</Link>
        </nav>
        <Link to="/login" className="login-btn">Log in</Link>
      </header> */}

      <main className="hero-section">
        <h1 className="headline">Foundra: Eliminating Employee Turnover</h1>
        <p className="subheadline">
          Connecting Hiring Managers with passionate, skilled professionals
        </p>

        <div className="search-bar">
          <input
            type="text"
            placeholder="What job are you looking for?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
        <Link to="/advanced-search" className="advanced-search">Advanced search</Link>

        <div className="icon-row">
          <span role="img" aria-label="clock">🕒</span>
          <span role="img" aria-label="medal">🏅</span>
          <span role="img" aria-label="building">🏬</span>
          <span role="img" aria-label="credit card">💳</span>
          <span role="img" aria-label="smile">😊</span>
        </div>
      </main>
    </div>
  );
};

export default Home;