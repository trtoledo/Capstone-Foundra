import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import Explore from './Components/Explore.jsx';
import Home from './Components/Home';

const App = ()=> {
  return (
    <div>
      <h1>UNI Fullstack Template</h1>
      <Routes>
        <Route path='/' element={ <Home /> } />
        <Route path='/explore' element={ <Explore /> } />
      </Routes>
    </div>
  );
};

export default App;
