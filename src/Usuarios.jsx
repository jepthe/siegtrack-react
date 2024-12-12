// src/Usuarios.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Usuarios.css";
import { Link } from "react-router-dom";
import logoEmpresa from "/src/assets/srWhite.png";
import { useUser } from "./context/UserContext";

const DeleteModal = ({ isOpen, onClose, usuario, onConfirm, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">¿Eliminar usuario?</h2>
        <div className="modal-body">
          <p>¿Está seguro que desea eliminar el siguiente usuario?</p>
          {usuario && (
            <div className="modal-info">
              <p>
                <strong>ID:</strong> {usuario.usuario_id}
              </p>
              <p>
                <strong>Usuario:</strong> {usuario.nombre_usuario}
              </p>
              <p>
                <strong>Rol:</strong> {usuario.rol}
              </p>
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
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
};

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    administradores: 0,
    usuarios: 0,
  });

  const { userData, logout } = useUser();

  useEffect(() => {
    fetchUsuarios();
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5002/users/usuarios/stats"
      );
      setStats(response.data);
    } catch (err) {
      console.error("Error al obtener estadísticas:", err);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get("http://localhost:5002/users/usuarios");
      setUsuarios(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Error al obtener los datos");
      setLoading(false);
      console.error("Error:", err);
    }
  };

  const handleDeleteClick = (usuario) => {
    setSelectedUsuario(usuario);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUsuario) return;

    setIsDeleting(true);
    try {
      const response = await axios.delete(
        `http://localhost:5002/deleteuser/${selectedUsuario.usuario_id}`
      );

      if (response.data.success) {
        alert("Usuario eliminado exitosamente");
        await fetchUsuarios();
        await fetchStats();
      }
    } catch (err) {
      console.error("Error al eliminar:", err);
      alert("Error al eliminar el usuario. Por favor, intente nuevamente.");
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setSelectedUsuario(null);
    }
  };

  const handleSearch = async (event) => {
    const query = event.target.value;
    setSearchTerm(query);

    if (query.trim() === "") {
      fetchUsuarios();
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:5002/users/usuarios/search",
        {
          params: { query },
        }
      );
      setUsuarios(response.data);
    } catch (err) {
      console.error("Error searching:", err);
      setError(err.response?.data?.message || "Error al buscar usuarios");
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
          <button className="menu-item active">Usuarios</button>
        </nav>

        <div className="profile">
          <div className="profile-info">
            <div className="avatar">
              {userData?.nombre?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="user-details">
              <span className="user-name">{userData?.nombre || "Usuario"}</span>
              <span className="user-role">{userData?.rol || "Sin rol"}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={logout}>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="main-header">
          <h1>Control de Usuarios</h1>
          <Link to="/addUsuario">
            <button className="new-user-btn">+ Nuevo Usuario</button>
          </Link>
        </header>

        <div className="stats-container">
          <div className="stat-card">
            <span className="stat-label">Total Usuarios</span>
            <span className="stat-value purple">{stats.total}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Administradores</span>
            <span className="stat-value green">{stats.administradores}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Usuarios Estándar</span>
            <span className="stat-value blue">{stats.usuarios}</span>
          </div>
        </div>

        <div className="search-filters">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Buscar por nombre, rol o ID..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>

        <div
          className="table-container"
          style={{ maxHeight: "400px", overflow: "auto" }}
        >
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    Cargando datos...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", color: "red" }}>
                    Error: {error}
                  </td>
                </tr>
              ) : usuarios.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    No hay usuarios disponibles
                  </td>
                </tr>
              ) : (
                usuarios.map((usuario) => (
                  <tr key={usuario.usuario_id}>
                    <td>{usuario.usuario_id}</td>
                    <td>{usuario.nombre_usuario}</td>
                    <td>
                      <span
                        className={`role-badge ${usuario.rol.toLowerCase()}`}
                      >
                        {usuario.rol}
                      </span>
                    </td>
                    <td className="actions">
                      <Link to={`/editUsuario/${usuario.usuario_id}`}>
                        <button className="edit-btn">Editar</button>
                      </Link>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteClick(usuario)}
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
        usuario={selectedUsuario}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default Usuarios;
