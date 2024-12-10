// src/EditColaborador.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './AddColaborador.css';
import logoEmpresa from '/src/assets/srWhite.png';

const EditColaborador = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    departamento: '',
    estado: '',
    puesto: ''
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchColaborador = async () => {
      try {
        const response = await axios.get(`http://localhost:5002/editemp/search/${id}`);
        const empleado = response.data;
        
        setFormData({
          nombre: empleado.nombre,
          apellido_paterno: empleado.apellido_paterno,
          apellido_materno: empleado.apellido_materno,
          departamento: empleado.departamento,
          estado: empleado.estado,
          puesto: empleado.puesto
        });
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
        setError('Error al cargar los datos del colaborador');
        setLoading(false);
      }
    };

    fetchColaborador();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`http://localhost:5002/editemp/update/${id}`, formData);

      if (response.data.status === "success") {
        alert('Colaborador actualizado exitosamente');
        navigate('/colaboradores');
      }
    } catch (error) {
      console.error('Error al actualizar:', error);
      setError(error.response?.data?.message || 'Error al actualizar el colaborador');
    }
  };

  const handleCancel = () => {
    navigate('/colaboradores');
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container">
      <div className="sidebar">
        <img src={logoEmpresa} alt="Logo Empresa" className="logo-image" />
      </div>

      <main className="main-content">
        <header className="header">
          <h1>Editar Colaborador</h1>
          <span className="id-text">ID: {id}</span>
        </header>

        <div className="tabs">
          <div className="tab active">Información</div>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-row">
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Apellido Paterno</label>
              <input
                type="text"
                name="apellido_paterno"
                value={formData.apellido_paterno}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Apellido Materno</label>
              <input
                type="text"
                name="apellido_materno"
                value={formData.apellido_materno}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Departamento</label>
              <input
                type="text"
                name="departamento"
                value={formData.departamento}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Puesto</label>
              <input
                type="text"
                name="puesto"
                value={formData.puesto}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Estado</label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleInputChange}
              required
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>

          <div className="button-group">
            <button type="button" className="button-cancel" onClick={handleCancel}>
              Cancelar
            </button>
            <button type="submit" className="button-save">
              Guardar
            </button>
          </div>
        </form>

        <footer className="footer">
          <span>© SiegTrack 2024</span>
        </footer>
      </main>
    </div>
  );
};

export default EditColaborador;