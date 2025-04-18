import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import Explore from './Components/Explore.jsx';
import Home from './Components/Home';
import Navbar from './Components/Navbar.jsx';

const App = ()=> {
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path='/' element={ <Home /> } />
        <Route path='/explore' element={ <Explore /> } />
      </Routes>
    </div>
  );
};

export default App;