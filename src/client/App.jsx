
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Explore from './Components/Pages/Explore.jsx';
import Home from './Components/Pages/Home.jsx';
import TopNav from './Components/LandingPage/TopNav.jsx';
import Candidates from './Components/Pages/Candidates.jsx';
import Companies from './Components/Pages/Companies.jsx';
import Dashboard from './Components/Dashboard/Dashboard.jsx';
import SingleIndustryPage from './Components/Industry/SingleIndustryPage.jsx';
import TopCandidates from './Components/Candidate/TopCandidates.jsx';
import Videos from './Components/Video/Videos.jsx';
import Comments from './Components/Video/Comments.jsx';
import Login from './Components/Auth/Login.jsx';
import Register from './Components/Auth/Register.jsx';
import Homepage from './Components/LandingPage/HomePage.jsx';
import Messenger from './Components/Messages/Messenger.jsx';

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
          <Route path="/candidates/top" element={<TopCandidates />} />
          <Route path="/videos" element={<Videos />} />
          <Route path='/inbox' element={<Messenger />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/comments" element={<Comments />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
