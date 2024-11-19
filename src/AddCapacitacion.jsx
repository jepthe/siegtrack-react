// src/addCapacitacion.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './AddCapacitacion.css';

const AddCapacitacion = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    area: '',
    estado: '',
    modalidad: 'presencial',
    fecha_inicio: '',
    fecha_fin: '',
    duracion_horas: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleModalidadChange = (e) => {
    setFormData(prevState => ({
      ...prevState,
      modalidad: e.target.id
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      
     
      console.log('Datos a enviar:', formData);
      const response = await axios.post('http://localhost:5002/addcap/create', formData);
      
      if (response.data.status === "success") {
        alert('Capacitación guardada exitosamente');
        // Aquí podrías redirigir al usuario o limpiar el formulario
      }
    } catch (error) {
      console.error('Error al guardar la capacitación:', error);
      alert('Error al guardar la capacitación');
    }
  };

  return (
    <div className="container">
      {/* Barra lateral */}
      <div className="sidebar">
        <div className="logo-container">
          <span className="logo-text">LOGO EMPRESA</span>
        </div>

        <nav className="sidebar-menu">
          <button className="menu-item">Información General</button>
          <button className="menu-item">Capacitaciones</button>
        </nav>

        <button className="back-button">Regresar</button>
      </div>

      <main className="main-content">
        <header className="header">
          <h1>Nueva Capacitación</h1>
        </header>

        <div className="tabs">
          <div className="tab active">Información</div>
        </div>

        <form className="form" onSubmit={handleSubmit}>
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

          <div className="form-group">
            <label>Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Área</label>
              <input 
                type="text"
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Estado</label>
              <input 
                type="text"
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Modalidad</label>
            <div className="radio-group">
              <div className="radio-option">
                <input 
                  type="radio"
                  name="modalidad"
                  id="presencial"
                  checked={formData.modalidad === 'presencial'}
                  onChange={handleModalidadChange}
                />
                <label htmlFor="presencial">Presencial</label>
              </div>
              <div className="radio-option">
                <input 
                  type="radio"
                  name="modalidad"
                  id="virtual"
                  checked={formData.modalidad === 'virtual'}
                  onChange={handleModalidadChange}
                />
                <label htmlFor="virtual">Virtual</label>
              </div>
              <div className="radio-option">
                <input 
                  type="radio"
                  name="modalidad"
                  id="hibrido"
                  checked={formData.modalidad === 'hibrido'}
                  onChange={handleModalidadChange}
                />
                <label htmlFor="hibrido">Híbrido</label>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Fecha Inicio</label>
              <input 
                type="date"
                name="fecha_inicio"
                value={formData.fecha_inicio}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Fecha Fin</label>
              <input 
                type="date"
                name="fecha_fin"
                value={formData.fecha_fin}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Duración (horas)</label>
            <input 
              type="number"
              name="duracion_horas"
              value={formData.duracion_horas}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="button-group">
            <button type="button" className="button-cancel">Cancelar</button>
            <button type="submit" className="button-save">Guardar</button>
          </div>
        </form>

        <footer className="footer">
          <span>SiegTrack 2024</span>
        </footer>
      </main>
    </div>
  );
};

export default AddCapacitacion;