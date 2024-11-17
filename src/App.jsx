import React from 'react';
//import { Routes, Route } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import HomePage from './HomePage';
import Capacitaciones from "./Capacitaciones";

function App() {
  
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/capacitaciones" element={<Capacitaciones />} />
    </Routes>
  );
}

export default App;
