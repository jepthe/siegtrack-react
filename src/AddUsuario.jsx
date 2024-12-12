// src/AddUsuario.jsx

import React, { useState } from "react";
import axios from "axios";
import "./AddUsuario.css";
import { useNavigate } from "react-router-dom";
import logoEmpresa from "/src/assets/srWhite.png";

const AddUsuario = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre_usuario: "",
    contraseña: "",
    confirmar_contraseña: "",
    rol: "Usuario",
  });

  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que las contraseñas coincidan
    if (formData.contraseña !== formData.confirmar_contraseña) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5002/adduser/create",
        {
          nombre_usuario: formData.nombre_usuario,
          contraseña: formData.contraseña,
          rol: formData.rol,
        }
      );

      if (response.data.status === "success") {
        alert("Usuario creado exitosamente");
        navigate("/usuarios");
      }
    } catch (error) {
      console.error("Error al crear el usuario:", error);
      setError(error.response?.data?.message || "Error al crear el usuario");
    }
  };

  const handleCancel = () => {
    navigate("/usuarios");
  };

  return (
    <div className="container">
      <div className="sidebar">
        <img src={logoEmpresa} alt="Logo Empresa" className="logo-image" />
      </div>

      <main className="main-content">
        <header className="header">
          <h1>Nuevo Usuario</h1>
        </header>

        <div className="tabs">
          <div className="tab active">Información</div>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>Nombre de Usuario</label>
            <input
              type="text"
              name="nombre_usuario"
              value={formData.nombre_usuario}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Contraseña</label>
              <input
                type="password"
                name="contraseña"
                value={formData.contraseña}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Confirmar Contraseña</label>
              <input
                type="password"
                name="confirmar_contraseña"
                value={formData.confirmar_contraseña}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Rol</label>
            <select
              name="rol"
              value={formData.rol}
              onChange={handleInputChange}
              required
            >
              <option value="Usuario">Usuario</option>
              <option value="Administrador">Administrador</option>
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

export default AddUsuario;
