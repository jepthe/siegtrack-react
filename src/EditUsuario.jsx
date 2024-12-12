// src/EditUsuario.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./AddUsuario.css"; //usa el mismo css de AddUsuario
import logoEmpresa from "/src/assets/srWhite.png";

const EditUsuario = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre_usuario: "",
    contraseña: "",
    confirmar_contraseña: "",
    rol: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5002/edituser/search/${id}`
        );
        const usuario = response.data;

        setFormData({
          nombre_usuario: usuario.nombre_usuario,
          contraseña: "",
          confirmar_contraseña: "",
          rol: usuario.rol,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
        setError("Error al cargar los datos del usuario");
        setLoading(false);
      }
    };

    fetchUsuario();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Si se está actualizando la contraseña, validar que coincidan
    if (formData.contraseña || formData.confirmar_contraseña) {
      if (formData.contraseña !== formData.confirmar_contraseña) {
        setError("Las contraseñas no coinciden");
        return;
      }
    }

    try {
      const dataToUpdate = {
        nombre_usuario: formData.nombre_usuario,
        rol: formData.rol,
      };

      // Solo incluir la contraseña si se ha ingresado una nueva
      if (formData.contraseña) {
        dataToUpdate.contraseña = formData.contraseña;
      }

      const response = await axios.put(
        `http://localhost:5002/edituser/update/${id}`,
        dataToUpdate
      );

      if (response.data.status === "success") {
        alert("Usuario actualizado exitosamente");
        navigate("/usuarios");
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
      setError(
        error.response?.data?.message || "Error al actualizar el usuario"
      );
    }
  };

  const handleCancel = () => {
    navigate("/usuarios");
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
          <h1>Editar Usuario</h1>
          <span className="id-text">ID: {id}</span>
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
              <label>
                Nueva Contraseña (dejar en blanco para mantener la actual)
              </label>
              <input
                type="password"
                name="contraseña"
                value={formData.contraseña}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Confirmar Nueva Contraseña</label>
              <input
                type="password"
                name="confirmar_contraseña"
                value={formData.confirmar_contraseña}
                onChange={handleInputChange}
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

export default EditUsuario;
