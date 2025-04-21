import React from "react";
import { Routes, Route } from "react-router-dom";
import Explore from "./Components/Explore.jsx";
import Home from "./Components/Home";
import Navbar from "./Components/Navbar.jsx";
import Candidates from "./Components/Candidates.jsx";
import Companies from "./Components/Companies.jsx";
import Dashboard from "./Components/Dashboard.jsx";
import SingleIndustryPage from "./Components/SingleIndustryPage.jsx";
import TopCandidates from "./Components/TopCandidates.jsx";
import Videos from "./Components/Videos.jsx";
import Login from "./Components/Auth/Login.jsx";
import Register from "./Components/Auth/Register.jsx";

const App = () => {
  return (
    <div>
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/candidates" element={<Candidates />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/industry/:id" element={<SingleIndustryPage />} />
          <Route path="/candidates/top" element={<TopCandidates />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
