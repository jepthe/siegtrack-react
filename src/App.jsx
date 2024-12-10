// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './Login';
import HomePage from './HomePage';
import Capacitaciones from "./Capacitaciones";
import AddCapacitacion from "./AddCapacitacion";
import EditCapacitacion from "./EditCapacitacion";
import Usuarios from "./Usuarios";
import AddUsuario from "./AddUsuario";
import EditUsuario from "./EditUsuario";
import Colaboradores from "./Colaboradores";
import AddColaborador from "./AddColaborador";
import EditColaborador from "./EditColaborador";
import AsignacionCapacitaciones from "./AsignacionCapacitaciones";
import AddAsignacion from "./AddAsignacion";
import AsignacionMasiva from "./AsignacionMasiva";
import EditAsignacion from "./EditAsignacion";

//import { UserProvider } from './context/UserContext';



function App() {

  return (
    
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/capacitaciones" element={<Capacitaciones />} />
        <Route path="/addCapacitacion" element={<AddCapacitacion />} />
        <Route path="/editCapacitacion" element={<EditCapacitacion />} />
        <Route path="/editCapacitacion/:id" element={<EditCapacitacion />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/addUsuario" element={<AddUsuario />} />
        <Route path="/editUsuario/:id" element={<EditUsuario />} />
        <Route path="/colaboradores" element={<Colaboradores />} />
        <Route path="/addColaborador" element={<AddColaborador />} />
        <Route path="/editColaborador/:id" element={<EditColaborador />} />
        <Route path="/asignaciones" element={<AsignacionCapacitaciones />} />
        <Route path="/addAsignacion" element={<AddAsignacion />} />
        <Route path="/asignacionMasiva" element={<AsignacionMasiva />} />
        <Route path="/editAsignacion/:id" element={<EditAsignacion />} />
      </Routes>
    
  );
}

export default App;
