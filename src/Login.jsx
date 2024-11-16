import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import logo from './assets/srRed.png';
import eyeIcon from './assets/ojo.png';

export default function Login() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5002/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, password }),
      });
      const data = await response.json();
      
      if (data.status === "success") {
        setMensaje("¡Login exitoso!");
        navigate('/admin');
      } else {
        setMensaje(data.message);
      }
    } catch (error) {
      setMensaje("Error al conectar con el servidor.");
    }
  };

  return (
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
  );
}