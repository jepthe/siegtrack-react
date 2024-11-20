// src/Capacitaciones.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Capacitaciones.css';
import { Link } from "react-router-dom";
import logoEmpresa from '/src/assets/srWhite.png';

const DeleteModal = ({ isOpen, onClose, capacitacion, onConfirm, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">¿Eliminar capacitación?</h2>
        <div className="modal-body">
          <p>¿Está seguro que desea eliminar la siguiente capacitación?</p>
          {capacitacion && (
            <div className="modal-info">
              <p><strong>ID:</strong> {capacitacion.capacitacion_id}</p>
              <p><strong>Nombre:</strong> {capacitacion.nombre}</p>
            </div>
          )}
          <p className="modal-warning">Esta acción no se puede deshacer.</p>
        </div>
        <div className="modal-footer">
          <button
            className="cancel-btn"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancelar
          </button>
          <button
            className="confirm-delete-btn"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
};

const Capacitaciones = () => {
  const [capacitaciones, setCapacitaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');// buscador
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCapacitacion, setSelectedCapacitacion] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [stats, setStats] = useState({// estadísticas
    total: 0,
    activas: 0,
    inactivas: 0
  });

  useEffect(() => {
    fetchCapacitaciones();
    fetchStats(); //estadísticas
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:5002/cap/capacitaciones/stats'); //estadísticas
      setStats(response.data);
    } catch (err) {
      console.error('Error al obtener estadísticas:', err);
    }
  };

  const fetchCapacitaciones = async () => {
    try {
      const response = await axios.get('http://localhost:5002/cap/capacitaciones');
      setCapacitaciones(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al obtener los datos');
      setLoading(false);
      console.error('Error:', err);
    }
  };

  //delete
  const handleDeleteClick = (capacitacion) => {
    setSelectedCapacitacion(capacitacion);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedCapacitacion) return;

    setIsDeleting(true);
    try {
      const response = await axios.delete(
        `http://localhost:5002/deletecap/${selectedCapacitacion.capacitacion_id}`
      );

      if (response.data.success) {
        alert('Capacitación eliminada exitosamente');
        await fetchCapacitaciones(); // Recargar la lista
      }
    } catch (err) {
      console.error('Error al eliminar:', err);
      alert('Error al eliminar la capacitación. Por favor, intente nuevamente.');
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setSelectedCapacitacion(null);
    }
  };




  // New search function   //considerár hacer lo de Lodash para la eficiencia de multiples llamadas simultanes 
  const handleSearch = async (event) => {
    const query = event.target.value;
    setSearchTerm(query);

    if (query.trim() === '') {
      // If search is empty, fetch all capacitaciones
      fetchCapacitaciones();
      return;
    }

    try {
      const response = await axios.get('http://localhost:5002/cap/capacitaciones/search', {
        params: { query }
      });
      setCapacitaciones(response.data);
    } catch (err) {
      console.error('Error searching:', err);
      setError(err.response?.data?.message || 'Error al buscar capacitaciones');
    }
  };





  return (
    <div className="dashboard">
      {/* Barra lateral */}
      <aside className="sidebar">
        
          <img src={logoEmpresa} alt="Logo Empresa" className="logo-image" />
        

        <nav className="menu">
          <button className="menu-item">Información General</button>
          <button className="menu-item active">Capacitaciones</button>
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
          <Link to="/addCapacitacion">
            <button className="new-training-btn">+ Nueva Capacitación</button>
          </Link>
        </header>

        {/* Tarjetas de estadísticas */}
        <div className="stats-container">
          <div className="stat-card">
            <span className="stat-label">Total Capacitaciones</span>
            <span className="stat-value purple">{stats.total}</span>
          </div>
         
          <div className="stat-card">
            <span className="stat-label">Activas</span>
            <span className="stat-value green">{stats.activas}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Inactivas</span>
            <span className="stat-value red">{stats.inactivas}</span>
          </div>
        </div>

        {/* Área de búsqueda y filtros */}
        <div className="search-filters">
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Buscar por nombre, área o ID..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

        </div>

        {/* Tabla */}
        <div className="table-container" style={{ maxHeight: '400px', overflow: 'auto' }}>
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
              {loading ? (
                <tr key="loading-row">
                  <td colSpan="7" style={{ textAlign: 'center' }}>Cargando datos...</td>
                </tr>
              ) : error ? (
                <tr key="error-row">
                  <td colSpan="7" style={{ textAlign: 'center', color: 'red' }}>
                    Error: {error}
                  </td>
                </tr>
              ) : capacitaciones.length === 0 ? (
                <tr key="empty-row">
                  <td colSpan="7" style={{ textAlign: 'center' }}>
                    No hay capacitaciones disponibles
                  </td>
                </tr>
              ) : (
                capacitaciones.map((capacitacion) => (
                  <tr key={capacitacion.capacitacion_id}>
                    <td>{capacitacion.capacitacion_id}</td>
                    <td>{capacitacion.nombre}</td>
                    <td>{capacitacion.area}</td>
                    <td>{new Date(capacitacion.fecha_inicio).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${capacitacion.estado === 1 ? 'active' :
                        'notactive'
                          
                        }`}>
                        {capacitacion.estado === 1 ? 'Activo' :
                          'Inactivo'}
                            
                      </span>
                    </td>
                    <td>{capacitacion.duracion_horas} hrs.</td>
                    <td className="actions">
                      <Link to={`/editCapacitacion/${capacitacion.capacitacion_id}`}>
                        <button className="edit-btn">Editar</button>
                      </Link>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteClick(capacitacion)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <footer className="dashboard-footer">
          <span>SiegTrack 2024</span>
        </footer>
      </main>

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        capacitacion={selectedCapacitacion}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />

    </div>
  );
};

export default Capacitaciones;