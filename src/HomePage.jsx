// src/HomePage.jsx

import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";
import logoEmpresa from "/src/assets/logo.png";
import { useUser } from "./context/UserContext";

const HomePage = () => {
  const { userData, logout } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="homepage">
      {/* Barra superior */}
      <div className="navbar">
        <div className="navbar-left">
          <img
            src={logoEmpresa}
            alt="Logo Empresa"
            className="logo-image-home"
          />
        </div>
        <div className="user-container">
          <div
            className="avatar-wrapper"
            onClick={toggleDropdown}
            style={{ cursor: "pointer" }}
          >
            <div className="avatar">
              {userData?.nombre?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="user-details">
              <span className="user-name">{userData?.nombre || "Usuario"}</span>
              <span className="user-role">{userData?.rol || "Sin rol"}</span>
            </div>
            {isDropdownOpen && (
              <div className="dropdown-menu">
                <button onClick={logout} className="dropdown-item">
                  Cerrar Sesión
                </button>
              </div>
            )}
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
            <Link to="/usuarios">
              <button className="card-button">Administrar Usuarios</button>
            </Link>
          </div>

          {/* Tarjeta Colaboradores */}
          <div className="card">
            <div className="card-icon-background">
              <div className="card-icon"></div>
            </div>
            <h3 className="card-title">Colaboradores</h3>
            <p className="card-description">Gestiona los colaboradores</p>
            <Link to="/colaboradores">
              <button className="card-button">Gestionar Colaboradores</button>
            </Link>
          </div>

          {/* Tarjeta Capacitaciones */}
          <div className="card">
            <div className="card-icon-background">
              <div className="card-icon"></div>
            </div>
            <h3 className="card-title">Capacitaciones</h3>
            <p className="card-description">Gestiona las capacitaciones</p>
            <Link to="/capacitaciones">
              <button className="card-button">Gestionar Capacitaciones</button>
            </Link>
          </div>

          {/* Nueva Tarjeta Asignaciones */}
          <div className="card">
            <div className="card-icon-background">
              <div className="card-icon"></div>
            </div>
            <h3 className="card-title">Asignaciones</h3>
            <p className="card-description">
              Gestiona las asignaciones de capacitaciones
            </p>
            <Link to="/asignaciones">
              <button className="card-button">Gestionar Asignaciones</button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>© 2024 SiegTrack.</p>
      </footer>
    </div>
  );
};

export default HomePage;
