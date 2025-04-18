import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Explore from './Components/Explore.jsx';
import Home from './Components/Home';
import Navbar from './Components/Navbar.jsx';
import Candidates from './Components/Candidates.jsx';
import Companies from './Components/Companies.jsx';
import Dashboard from './Components/Dashboard.jsx';
import SingleIndustryPage from './Components/SingleIndustryPage.jsx';
import TopCandidates from './Components/TopCandidates.jsx';
import Videos from './Components/Videos.jsx';

const App = ()=> {
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path='/' element={ <Home /> } />
        <Route path='/explore' element={ <Explore /> } />
        <Route path='/candidates' element={ <Candidates />} />
        <Route path='/companies' element={ <Companies /> } />
        <Route path='/dashboard' element={ <Dashboard /> } />
        <Route path='/industry/:id' element={ <SingleIndustryPage /> } />
        <Route path='/candidates/top' element={ <TopCandidates /> } />
        <Route path='/videos' element={ <Videos /> } />
      </Routes>
    </div>
  );
};

export default App;