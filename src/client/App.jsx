import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import Foo from './Components/Explore.jsx';
import Bar from './Components/Home';

const App = ()=> {
  return (
    <div>
      <h1>UNI Fullstack Template</h1>
      <nav>
        <Link to='/foo'>Foo</Link>
        <Link to='/bar'>Bar</Link>
      </nav>
      <Routes>
        <Route path='/foo' element={ <Foo /> } />
        <Route path='/bar' element={ <Bar /> } />
      </Routes>
    </div>
  );
};

export default App;
