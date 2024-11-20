import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

import { useUser } from './context/UserContext';

const HomePage = () => {

  const { userData } = useUser(); //global

  return (
    <div className="homepage">
      {/* Barra superior */}
      <div className="navbar">
        <div className="navbar-left">
          <h1 className="title">Siegfried Rhein</h1>
        </div>
        <div className="user-container">
          <div className="avatar">
            {userData?.nombre?.charAt(0)?.toUpperCase() || 'U'}{/*global*/}
          </div>
          <div className="user-details">
            <span className="user-name">{userData?.nombre || 'Usuario'}</span>{/*global*/}
            <span className="user-role">{userData?.rol || 'Sin rol'}</span>{/*global*/}
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="main-content">
        <h2 className="welcome-title">Bienvenido</h2>
        <p className="welcome-subtitle">Selecciona una opción para comenzar</p>

        {/* Grid de tarjetas */}
        <div className="card-grid">
          {/* Tarjeta Usuarios */}
          <div className="card">
            <div className="card-icon-background">
              <div className="card-icon"></div>
            </div>
            <h3 className="card-title">Usuarios</h3>
            <p className="card-description">
              Administra los usuarios del sistema
            </p>
            <button className="card-button">Administrar Usuarios</button>
          </div>

          {/* Tarjeta Colaboradores */}
          <div className="card">
            <div className="card-icon-background">
              <div className="card-icon"></div>
            </div>
            <h3 className="card-title">Colaboradores</h3>
            <p className="card-description">
              Gestiona los colaboradores
            </p>
            <button className="card-button">Gestionar Colaboradores</button>
          </div>

          {/* Tarjeta Capacitaciones */}
          <div className="card">
            <div className="card-icon-background">
              <div className="card-icon"></div>
            </div>
            <h3 className="card-title">Capacitaciones</h3>
            <p className="card-description">
              Gestiona las capacitaciones
            </p>
            <Link to="/capacitaciones">
              <button className="card-button">Gestionar Capacitaciones</button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        © 2024 SiegTrack.
      </footer>
    </div>
  );
};

export default HomePage;
