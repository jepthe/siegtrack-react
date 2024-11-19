// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './Login';
import HomePage from './HomePage';
import Capacitaciones from "./Capacitaciones";
import AddCapacitacion from "./AddCapacitacion";
import EditCapacitacion from "./EditCapacitacion";



function App() {
  
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/capacitaciones" element={<Capacitaciones />} />
      <Route path="/addCapacitacion" element={<AddCapacitacion />} />
      <Route path="/editCapacitacion" element={<EditCapacitacion />} />
      <Route path="/editCapacitacion/:id" element={<EditCapacitacion />} />
    </Routes>
  );
}

export default App;
