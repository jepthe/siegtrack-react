import React from 'react';
import './Capacitaciones.css';

const Capacitaciones = () => {
  return (
    <div className="dashboard">
      {/* Barra lateral */}
      <aside className="sidebar">
        <div className="logo-container">
          <span className="logo-text">LOGO EMPRESA</span>
        </div>

        <nav className="menu">
          <button className="menu-item active">Información General</button>
          <button className="menu-item">Capacitaciones</button>
        </nav>

        <div className="profile">
          <div className="profile-info">
            <div className="avatar">JH</div>
            <div className="user-details">
              <span className="user-name">Jepthé HF</span>
              <span className="user-role">User</span>
            </div>
          </div>
          <button className="logout-btn">Cerrar Sesión</button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="main-content">
        <header className="main-header">
          <h1>Control de Capacitaciones</h1>
          <button className="new-training-btn">+ Nueva Capacitación</button>
        </header>

        {/* Tarjetas de estadísticas */}
        <div className="stats-container">
          <div className="stat-card">
            <span className="stat-label">Total Capacitaciones</span>
            <span className="stat-value purple">24</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">En Progreso</span>
            <span className="stat-value orange">12</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Completadas</span>
            <span className="stat-value green">8</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Pendientes</span>
            <span className="stat-value red">4</span>
          </div>
        </div>

        {/* Área de búsqueda y filtros */}
        <div className="search-filters">
          <div className="search-bar">
            <input type="text" placeholder="Buscar capacitación..." />
            <span className="search-icon"></span>
          </div>
          <div className="filters">
            <select className="filter-select">
              <option>Estado ▼</option>
            </select>
            <select className="filter-select">
              <option>Área ▼</option>
            </select>
          </div>
        </div>

        {/* Tabla */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Id</th>
                <th>Nombre</th>
                <th>Área</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Duración</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Inducción al puesto</td>
                <td>HR</td>
                <td>12/11/2024</td>
                <td><span className="status-badge active">Activo</span></td>
                <td>40 min.</td>
                <td className="actions">
                  <button className="edit-btn">Editar</button>
                  <button className="delete-btn">Eliminar</button>
                </td>
              </tr>
              <tr>
                <td>2</td>
                <td>Seguridad Industrial</td>
                <td>Seguridad</td>
                <td>15/11/2024</td>
                <td><span className="status-badge in-progress">En proceso</span></td>
                <td>20 min.</td>
                <td className="actions">
                  <button className="edit-btn">Editar</button>
                  <button className="delete-btn">Eliminar</button>
                </td>
              </tr>
              <tr>
                <td>3</td>
                <td>Salubridad</td>
                <td>Salud</td>
                <td>25/12/2024</td>
                <td><span className="status-badge pending">Pendiente</span></td>
                <td>60 min.</td>
                <td className="actions">
                  <button className="edit-btn">Editar</button>
                  <button className="delete-btn">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <footer className="dashboard-footer">
          <span>SiegTrack 2024</span>
        </footer>
      </main>
    </div>
  );
};

export default Capacitaciones;