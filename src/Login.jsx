import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import logo from './assets/srRed.png';
import eyeIcon from './assets/ojo.png';
import { useUser } from './context/UserContext';// global

function Login() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { setUserData } = useUser(); //user global

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5002/auth/login', {
        usuario,
        password,
      });

      if (response.data.status === "success") {
        // Guardar los datos del usuario en el contexto //global
        setUserData({
          nombre: response.data.nombre,
          rol: response.data.rol
        });
        setMensaje("¡Login exitoso!");
        navigate('/home');
      } else {
        setMensaje(response.data.message);
      }
    } catch (error) {
      // Maneja errores con axios
      if (error.response) {
        // Errores de la respuesta del servidor (códigos de estado 4xx, 5xx)
        setMensaje(error.response.data.message || "Error en la autenticación.");
      } else if (error.request) {
        // Errores relacionados con la solicitud, pero sin respuesta del servidor
        setMensaje("Error al conectar con el servidor.");
      } else {
        // Otros errores
        setMensaje("Ocurrió un error inesperado.");
      }
    }
  };

  return (
    <div className="login-page">
    <div className="login-container">
      <div className="login-box">
        <div className="logo">
          <img src={logo} alt="Logo SR" />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              id="usuario"
              placeholder="Usuario"
              required
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
            />
          </div>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <img 
              src={eyeIcon} 
              className="toggle-password" 
              alt="Mostrar/Ocultar"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
          {mensaje && <div className="error-message">{mensaje}</div>}
          <button type="submit" className="login-btn">ENTRAR</button>
        </form>
      </div>
    </div>
    </div>
  );
}

export default Login;