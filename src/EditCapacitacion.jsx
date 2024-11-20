// src/EditCapacitacion.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './AddCapacitacion.css';
import logoEmpresa from '/src/assets/srWhite.png';

const EditCapacitacion = () => {
  const { id } = useParams(); // Obtiene el ID de la URL
  const navigate = useNavigate();//para ir a cap cuando se de en cancelar
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

  useEffect(() => {
    const fetchCapacitacion = async () => {
      console.log("ID que se envía:", id);
      try {
        const response = await axios.get(`http://localhost:5002/editcap/search/${id}`);
        const capacitacion = response.data;
        
        // Formatear las fechas para el input type="date"
        const formatDate = (dateString) => {
          const date = new Date(dateString);
          return date.toISOString().split('T')[0];
        };

        setFormData({
          nombre: capacitacion.nombre,
          descripcion: capacitacion.descripcion,
          area: capacitacion.area,
          estado: capacitacion.estado.toString(),
          modalidad: capacitacion.modalidad || 'presencial',
          fecha_inicio: formatDate(capacitacion.fecha_inicio),
          fecha_fin: formatDate(capacitacion.fecha_fin),
          duracion_horas: capacitacion.duracion_horas.toString()
        });
      } catch (error) {
        console.error('Error al cargar los datos:', error);
        alert('Error al cargar los datos de la capacitación');
      }
    };

    if (id) {
      fetchCapacitacion();
    }
  }, [id]);

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
    
      const response = await axios.put(`http://localhost:5002/editcap/update/${id}`, formData);
        
        if (response.data.status === 'success') {
            alert('Capacitación actualizada exitosamente');
            navigate('/capacitaciones'); // Redirige a la lista de capacitaciones
        }

      console.log('ID de la capacitación a actualizar:', id);

    } catch (error) {
      console.error('Error al actualizar:', error);
      alert('Error al actualizar la capacitación');
    }
  };

  const handleCancel = () => {
    navigate('/capacitaciones'); // Regresar a la lista de capacitaciones
  };

  return (
    <div className="container">
      {/* Barra lateral */}
      <div className="sidebar">      
        <img src={logoEmpresa} alt="Logo Empresa" className="logo-image" />       
      </div>

      <main className="main-content">
        <header className="header">
          <h1>Editar Capacitación</h1>
          <span className="id-text">ID: {id}</span>
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
            <button type="button" className="button-cancel" onClick={handleCancel}>
              Cancelar
            </button>
            <button type="submit" className="button-save">Guardar</button>
          </div>
        </form>

        <footer className="footer">
          <span>© SiegTrack 2024</span>
        </footer>
      </main>
    </div>
  );
};

export default EditCapacitacion;