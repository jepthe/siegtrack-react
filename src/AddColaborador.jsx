// src/AddColaborador.jsx

import React, { useState } from "react";
import axios from "axios";
import "./AddColaborador.css";
import { useNavigate } from "react-router-dom";
import logoEmpresa from "/src/assets/srWhite.png";

const AddColaborador = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    departamento: "",
    estado: "Activo",
    puesto: "",
    email: "", // Nuevo campo
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5002/addemp/create",
        formData
      );

      if (response.data.status === "success") {
        alert("Colaborador guardado exitosamente");
        navigate("/colaboradores");
      }
    } catch (error) {
      console.error("Error al guardar el colaborador:", error);
      alert(error.response?.data?.message || "Error al guardar el colaborador");
    }
  };

  const handleCancel = () => {
    navigate("/colaboradores");
  };

  return (
    <div className="container">
      <div className="sidebar">
        <img src={logoEmpresa} alt="Logo Empresa" className="logo-image" />
      </div>

      <main className="main-content">
        <header className="header">
          <h1>Nuevo Colaborador</h1>
        </header>

        <div className="tabs">
          <div className="tab active">Información</div>
        </div>

        <form className="form" onSubmit={handleSubmit}>
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

            <div className="form-group">
              <label>Correo Electrónico</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="correo@ejemplo.com"
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
            <button
              type="button"
              className="button-cancel"
              onClick={handleCancel}
            >
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

export default AddColaborador;
