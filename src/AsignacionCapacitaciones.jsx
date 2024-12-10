// src/AsignacionCapacitaciones.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AsignacionCapacitaciones.css';
import { Link } from "react-router-dom";
import logoEmpresa from '/src/assets/srWhite.png';
import { useUser } from './context/UserContext';

const DeleteModal = ({ isOpen, onClose, asignacion, onConfirm, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">¿Eliminar asignación?</h2>
        <div className="modal-body">
          <p>¿Está seguro que desea eliminar la siguiente asignación?</p>
          {asignacion && (
            <div className="modal-info">
              <p><strong>ID Asignación:</strong> {asignacion.asignacion_id}</p>
              <p><strong>Empleado:</strong> {asignacion.nombre_empleado}</p>
              <p><strong>Capacitación:</strong> {asignacion.nombre_capacitacion}</p>
            </div>
          )}
          <p className="modal-warning">Esta acción no se puede deshacer.</p>
        </div>
        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose} disabled={isDeleting}>
            Cancelar
          </button>
          <button className="confirm-delete-btn" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
};

const AsignacionCapacitaciones = () => {
  const [asignaciones, setAsignaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedAsignacion, setSelectedAsignacion] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    completadas: 0,
    pendientes: 0
  });
  
  const { userData, logout } = useUser();

  useEffect(() => {
    fetchAsignaciones();
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:5002/asig/asignaciones/stats');
      setStats(response.data);
    } catch (err) {
      console.error('Error al obtener estadísticas:', err);
    }
  };

  const fetchAsignaciones = async () => {
    try {
      const response = await axios.get('http://localhost:5002/asig/asignaciones');
      setAsignaciones(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al obtener los datos');
      setLoading(false);
      console.error('Error:', err);
    }
  };

  const handleDeleteClick = (asignacion) => {
    setSelectedAsignacion(asignacion);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedAsignacion) return;

    setIsDeleting(true);
    try {
      const response = await axios.delete(
        `http://localhost:5002/deleteasig/${selectedAsignacion.asignacion_id}`
      );

      if (response.data.success) {
        alert('Asignación eliminada exitosamente');
        await fetchAsignaciones();
        await fetchStats();
      }
    } catch (err) {
      console.error('Error al eliminar:', err);
      alert('Error al eliminar la asignación. Por favor, intente nuevamente.');
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setSelectedAsignacion(null);
    }
  };

  const handleSearch = async (event) => {
    const query = event.target.value;
    setSearchTerm(query);

    if (query.trim() === '') {
      fetchAsignaciones();
      return;
    }

    try {
      const response = await axios.get('http://localhost:5002/asig/asignaciones/search', {
        params: { query }
      });
      setAsignaciones(response.data);
    } catch (err) {
      console.error('Error searching:', err);
      setError(err.response?.data?.message || 'Error al buscar asignaciones');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX');
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <img src={logoEmpresa} alt="Logo Empresa" className="logo-image" />
        <nav className="menu">
          <Link to="/home">
            <button className="menu-item">Home</button>
          </Link>
          <button className="menu-item active">Asignaciones</button>
        </nav>

        <div className="profile">
          <div className="profile-info">
            <div className="avatar">
              {userData?.nombre?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="user-details">
              <span className="user-name">{userData?.nombre || 'Usuario'}</span>
              <span className="user-role">{userData?.rol || 'Sin rol'}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={logout}>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="main-header">
          <h1>Control de Asignaciones</h1>
          <div className="header-buttons">
            <Link to="/addAsignacion">
              <button className="new-assignment-btn">+ Nueva Asignación</button>
            </Link>
            <Link to="/asignacionMasiva">
              <button className="bulk-assignment-btn">Asignación Masiva</button>
            </Link>
          </div>
        </header>

        <div className="stats-container">
          <div className="stat-card">
            <span className="stat-label">Total Asignaciones</span>
            <span className="stat-value purple">{stats.total}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Completadas</span>
            <span className="stat-value green">{stats.completadas}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Pendientes</span>
            <span className="stat-value orange">{stats.pendientes}</span>
          </div>
        </div>

        <div className="search-filters">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Buscar por empleado, capacitación o área..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>

        <div className="table-container" style={{ maxHeight: '400px', overflow: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Empleado</th>
                <th>Capacitación</th>
                <th>Área</th>
                <th>Fecha Asignación</th>
                <th>Fecha Completado</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center' }}>Cargando datos...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', color: 'red' }}>
                    Error: {error}
                  </td>
                </tr>
              ) : asignaciones.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center' }}>
                    No hay asignaciones disponibles
                  </td>
                </tr>
              ) : (
                asignaciones.map((asignacion) => (
                  <tr key={asignacion.asignacion_id}>
                    <td>{asignacion.asignacion_id}</td>
                    <td>{asignacion.nombre_empleado}</td>
                    <td>{asignacion.nombre_capacitacion}</td>
                    <td>{asignacion.area}</td>
                    <td>{formatDate(asignacion.fecha_asignacion)}</td>
                    <td>{asignacion.fecha_completado ? formatDate(asignacion.fecha_completado) : '-'}</td>
                    <td>
                      <span className={`status-badge ${asignacion.fecha_completado ? 'completed' : 'pending'}`}>
                        {asignacion.fecha_completado ? 'Completada' : 'Pendiente'}
                      </span>
                    </td>
                    <td className="actions">
                      <Link to={`/editAsignacion/${asignacion.asignacion_id}`}>
                        <button className="edit-btn">Editar</button>
                      </Link>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteClick(asignacion)}
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
          <span>© SiegTrack 2024</span>
        </footer>
      </main>

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        asignacion={selectedAsignacion}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default AsignacionCapacitaciones;