// src/AddAsignacion.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddAsignacion.css';
import { useNavigate } from 'react-router-dom';
import logoEmpresa from '/src/assets/srWhite.png';

const AddAsignacion = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    empleado_id: '',
    capacitacion_id: '',
    fecha_asignacion: new Date().toISOString().split('T')[0],
    fecha_completado: ''
  });

  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState('');
  const [empleados, setEmpleados] = useState([]);
  const [capacitaciones, setCapacitaciones] = useState([]);
  const [error, setError] = useState('');

  // Cargar áreas al montar el componente
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await axios.get('http://localhost:5002/asig/areas');
        setAreas(response.data);
      } catch (error) {
        console.error('Error al cargar áreas:', error);
        setError('Error al cargar las áreas');
      }
    };

    fetchAreas();
  }, []);

  // Cargar empleados y capacitaciones cuando se selecciona un área
  useEffect(() => {
    if (selectedArea) {
      const fetchEmpleadosYCapacitaciones = async () => {
        try {
          const [empResponse, capResponse] = await Promise.all([
            axios.get(`http://localhost:5002/asig/empleados-por-area/${selectedArea}`),
            axios.get(`http://localhost:5002/asig/capacitaciones-por-area/${selectedArea}`)
          ]);
          setEmpleados(empResponse.data);
          setCapacitaciones(capResponse.data);
        } catch (error) {
          console.error('Error al cargar datos:', error);
          setError('Error al cargar empleados y capacitaciones');
        }
      };

      fetchEmpleadosYCapacitaciones();
    }
  }, [selectedArea]);

  const handleAreaChange = (e) => {
    setSelectedArea(e.target.value);
    // Resetear selecciones cuando cambia el área
    setFormData(prev => ({
      ...prev,
      empleado_id: '',
      capacitacion_id: ''
    }));
  };

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
      // Crear una copia del formData para limpiar el campo fecha_completado si está vacío
      const dataToSend = {
        ...formData,
        fecha_completado: formData.fecha_completado || null
      };

      console.log('Datos a enviar:', dataToSend); // Para debug

      const response = await axios.post('http://localhost:5002/addasig/create', dataToSend);

      if (response.data.status === "success") {
        alert('Asignación creada exitosamente');
        navigate('/asignaciones');
      }
    } catch (error) {
      console.error('Error completo:', error);
      setError(error.response?.data?.message || 'Error al crear la asignación');
    }
  };
  
  const handleCancel = () => {
    navigate('/asignaciones');
  };

  return (
    <div className="container">
      <div className="sidebar">
        <img src={logoEmpresa} alt="Logo Empresa" className="logo-image" />
      </div>

      <main className="main-content">
        <header className="header">
          <h1>Nueva Asignación</h1>
        </header>

        <div className="tabs">
          <div className="tab active">Información</div>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>Área</label>
            <select
              value={selectedArea}
              onChange={handleAreaChange}
              required
              className="select-field"
            >
              <option value="">Seleccione un área</option>
              {areas.map((area, index) => (
                <option key={index} value={area}>{area}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Empleado</label>
            <select
              name="empleado_id"
              value={formData.empleado_id}
              onChange={handleInputChange}
              required
              className="select-field"
              disabled={!selectedArea}
            >
              <option value="">Seleccione un empleado</option>
              {empleados.map((empleado) => (
                <option key={empleado.empleado_id} value={empleado.empleado_id}>
                  {empleado.nombre_completo} - {empleado.puesto}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Capacitación</label>
            <select
              name="capacitacion_id"
              value={formData.capacitacion_id}
              onChange={handleInputChange}
              required
              className="select-field"
              disabled={!selectedArea}
            >
              <option value="">Seleccione una capacitación</option>
              {capacitaciones.map((capacitacion) => (
                <option key={capacitacion.capacitacion_id} value={capacitacion.capacitacion_id}>
                  {capacitacion.nombre} ({capacitacion.duracion_horas} hrs)
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Fecha de Asignación</label>
              <input
                type="date"
                name="fecha_asignacion"
                value={formData.fecha_asignacion}
                onChange={handleInputChange}
                required
                className="date-field"
              />
            </div>
            <div className="form-group">
              <label>Fecha de Completado (opcional)</label>
              <input
                type="date"
                name="fecha_completado"
                value={formData.fecha_completado}
                onChange={handleInputChange}
                className="date-field"
              />
            </div>
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

export default AddAsignacion;