// src/Colaboradores.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Colaboradores.css';
import { Link } from "react-router-dom";
import logoEmpresa from '/src/assets/srWhite.png';
import { useUser } from './context/UserContext';

const DeleteModal = ({ isOpen, onClose, empleado, onConfirm, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">¿Eliminar colaborador?</h2>
        <div className="modal-body">
          <p>¿Está seguro que desea eliminar al siguiente colaborador?</p>
          {empleado && (
            <div className="modal-info">
              <p><strong>ID:</strong> {empleado.empleado_id}</p>
              <p><strong>Nombre:</strong> {empleado.nombre} {empleado.apellido_paterno} {empleado.apellido_materno}</p>
              <p><strong>Departamento:</strong> {empleado.departamento}</p>
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

const Colaboradores = () => {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    activos: 0,
    inactivos: 0
  });

  const { userData, logout } = useUser();

  useEffect(() => {
    fetchEmpleados();
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:5002/emp/empleados/stats');
      setStats(response.data);
    } catch (err) {
      console.error('Error al obtener estadísticas:', err);
    }
  };

  const fetchEmpleados = async () => {
    try {
      const response = await axios.get('http://localhost:5002/emp/empleados');
      setEmpleados(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al obtener los datos');
      setLoading(false);
      console.error('Error:', err);
    }
  };

  const handleDeleteClick = (empleado) => {
    setSelectedEmpleado(empleado);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedEmpleado) return;

    setIsDeleting(true);
    try {
      const response = await axios.delete(
        `http://localhost:5002/deleteemp/${selectedEmpleado.empleado_id}`
      );

      if (response.data.success) {
        alert('Colaborador eliminado exitosamente');
        await fetchEmpleados();
        await fetchStats();
      }
    } catch (err) {
      console.error('Error al eliminar:', err);
      alert('Error al eliminar el colaborador. Por favor, intente nuevamente.');
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setSelectedEmpleado(null);
    }
  };

  const handleSearch = async (event) => {
    const query = event.target.value;
    setSearchTerm(query);

    if (query.trim() === '') {
      fetchEmpleados();
      return;
    }

    try {
      const response = await axios.get('http://localhost:5002/emp/empleados/search', {
        params: { query }
      });
      setEmpleados(response.data);
    } catch (err) {
      console.error('Error searching:', err);
      setError(err.response?.data?.message || 'Error al buscar colaboradores');
    }
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <img src={logoEmpresa} alt="Logo Empresa" className="logo-image" />
        <nav className="menu">
          <Link to="/home">
            <button className="menu-item">Home</button>
          </Link>
          <button className="menu-item active">Colaboradores</button>
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
          <h1>Control de Colaboradores</h1>
          <Link to="/addColaborador">
            <button className="new-employee-btn">+ Nuevo Colaborador</button>
          </Link>
        </header>

        <div className="stats-container">
          <div className="stat-card">
            <span className="stat-label">Total Colaboradores</span>
            <span className="stat-value purple">{stats.total}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Activos</span>
            <span className="stat-value green">{stats.activos}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Inactivos</span>
            <span className="stat-value red">{stats.inactivos}</span>
          </div>
        </div>

        <div className="search-filters">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Buscar por nombre, departamento o ID..."
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
                <th>Nombre Completo</th>
                <th>Email</th>
                <th>Departamento</th>
                <th>Puesto</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>Cargando datos...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: 'red' }}>
                    Error: {error}
                  </td>
                </tr>
              ) : empleados.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>
                    No hay colaboradores disponibles
                  </td>
                </tr>
              ) : (
                empleados.map((empleado) => (
                  <tr key={empleado.empleado_id}>
                    <td>{empleado.empleado_id}</td>
                    <td>
                      {empleado.nombre} {empleado.apellido_paterno} {empleado.apellido_materno}
                    </td>
                    <td>{empleado.email}</td>
                    <td>{empleado.departamento}</td>
                    <td>{empleado.puesto}</td>
                    <td>
                      <span className={`status-badge ${empleado.estado.toLowerCase() === 'activo' ? 'active' : 'inactive'}`}>
                        {empleado.estado}
                      </span>
                    </td>
                    <td className="actions">
                      <Link to={`/editColaborador/${empleado.empleado_id}`}>
                        <button className="edit-btn">Editar</button>
                      </Link>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteClick(empleado)}
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
        empleado={selectedEmpleado}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default Colaboradores;