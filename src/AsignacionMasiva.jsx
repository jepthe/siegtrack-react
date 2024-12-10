// src/AsignacionMasiva.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AsignacionMasiva.css';
import { useNavigate } from 'react-router-dom';
import logoEmpresa from '/src/assets/srWhite.png';

const AsignacionMasiva = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    area: '',
    empleados: [],
    capacitaciones: [],
    fecha_asignacion: new Date().toISOString().split('T')[0]
  });

  const [areas, setAreas] = useState([]);
  const [empleadosDisponibles, setEmpleadosDisponibles] = useState([]);
  const [capacitacionesDisponibles, setCapacitacionesDisponibles] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Cargar áreas
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await axios.get('http://localhost:5002/asig/areas');
        setAreas(response.data);
      } catch (err) {
        setError('Error al cargar las áreas');
      }
    };
    fetchAreas();
  }, []);

  // Cargar empleados y capacitaciones cuando se selecciona un área
  useEffect(() => {
    if (formData.area) {
      const fetchData = async () => {
        try {
          const [empResponse, capResponse] = await Promise.all([
            axios.get(`http://localhost:5002/asig/empleados-por-area/${formData.area}`),
            axios.get(`http://localhost:5002/asig/capacitaciones-por-area/${formData.area}`)
          ]);
          setEmpleadosDisponibles(empResponse.data);
          setCapacitacionesDisponibles(capResponse.data);
        } catch (err) {
          setError('Error al cargar empleados o capacitaciones');
        }
      };
      fetchData();
    }
  }, [formData.area]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      empleados: name === 'area' ? [] : formData.empleados,
      capacitaciones: name === 'area' ? [] : formData.capacitaciones
    });
  };

  const handleEmpleadosChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData({
      ...formData,
      empleados: selectedOptions
    });
  };

  const handleCapacitacionesChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData({
      ...formData,
      capacitaciones: selectedOptions
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.empleados.length === 0 || formData.capacitaciones.length === 0) {
      setError('Debe seleccionar al menos un empleado y una capacitación');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5002/addasig/create-multiple', {
        empleados: formData.empleados,
        capacitaciones: formData.capacitaciones,
        fecha_asignacion: formData.fecha_asignacion
      });

      if (response.data.status === "success") {
        alert('Asignaciones creadas exitosamente');
        navigate('/asignaciones');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear las asignaciones');
    } finally {
      setIsLoading(false);
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
          <h1>Asignación Masiva de Capacitaciones</h1>
        </header>

        <div className="tabs">
          <div className="tab active">Información</div>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>Área</label>
            <select
              name="area"
              value={formData.area}
              onChange={handleInputChange}
              required
              className="select-field"
            >
              <option value="">Seleccione un área</option>
              {areas.map((area, index) => (
                <option key={index} value={area}>{area}</option>
              ))}
            </select>
          </div>

          <div className="form-row multiple-select-row">
            <div className="form-group">
              <label>Empleados</label>
              <select
                multiple
                name="empleados"
                value={formData.empleados}
                onChange={handleEmpleadosChange}
                className="multiple-select-field"
                disabled={!formData.area}
              >
                {empleadosDisponibles.map((empleado) => (
                  <option key={empleado.empleado_id} value={empleado.empleado_id}>
                    {empleado.nombre_completo} - {empleado.puesto}
                  </option>
                ))}
              </select>
              <small className="help-text">
                Mantén presionada la tecla Ctrl para seleccionar múltiples empleados
              </small>
            </div>

            <div className="form-group">
              <label>Capacitaciones</label>
              <select
                multiple
                name="capacitaciones"
                value={formData.capacitaciones}
                onChange={handleCapacitacionesChange}
                className="multiple-select-field"
                disabled={!formData.area}
              >
                {capacitacionesDisponibles.map((capacitacion) => (
                  <option key={capacitacion.capacitacion_id} value={capacitacion.capacitacion_id}>
                    {capacitacion.nombre} ({capacitacion.duracion_horas} hrs)
                  </option>
                ))}
              </select>
              <small className="help-text">
                Mantén presionada la tecla Ctrl para seleccionar múltiples capacitaciones
              </small>
            </div>
          </div>

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

          <div className="button-group">
            <button type="button" className="button-cancel" onClick={handleCancel}>
              Cancelar
            </button>
            <button 
              type="submit" 
              className="button-save"
              disabled={isLoading}
            >
              {isLoading ? 'Guardando...' : 'Guardar'}
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

export default AsignacionMasiva;