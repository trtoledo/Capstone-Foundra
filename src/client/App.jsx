import React from "react";
import { Routes, Route } from "react-router-dom";
import Explore from "./Components/Pages/Explore.jsx";
import Home from "./Components/Pages/Home.jsx";
import TopNav from "./Components/LandingPage/TopNav.jsx";
import Candidates from "./Components/Candidate/Candidates.jsx";
import Companies from "./Components/Company/Companies.jsx";
import SingleCompany from "./Components/Company/SingleCompany.jsx";
import Dashboard from "./Components/Dashboard/Dashboard.jsx";
import SingleIndustryPage from "./Components/Industry/SingleIndustryPage.jsx";
import TopCandidates from "./Components/Candidate/TopCandidates.jsx";
import Videos from "./Components/Video/Videos.jsx";
import Comments from "./Components/Video/Comments.jsx";
import Login from "./Components/Auth/Login.jsx";
import Register from "./Components/Auth/Register.jsx";
import Homepage from "./Components/LandingPage/HomePage.jsx";
import Messenger from "./Components/Messages/Messenger.jsx";
import LostHiring from "./Components/LandingPage/LostHiring.jsx";
import WaitlistPage from "./Components/Pages/WaitListPage.jsx";
import GetFound from "./Components/LandingPage/GetFound";
import AboutUs from "./Components/LandingPage/AboutUs";
import ProfilePage from "./Components/Pages/ProfilePage.jsx";

const App = () => {
  return (
    <div>
      <TopNav />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/candidates" element={<Candidates />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/industry/:id" element={<SingleIndustryPage />} />
          <Route path="/companies/:id" element={<SingleCompany />} />
          <Route path="/candidates/top" element={<TopCandidates />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/inbox" element={<Messenger />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/comments" element={<Comments />} />
          <Route path="/lost-hiring" element={<LostHiring />} />
          <Route path="/waitlist" element={<WaitlistPage />} />
          <Route path="/get-found" element={<GetFound />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/about" element={<AboutUs />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
