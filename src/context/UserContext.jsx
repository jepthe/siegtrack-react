// src/context/UserContext.jsx
import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';// cerrar sesion

const UserContext = createContext();

export function UserProvider({ children }) {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate(); //cerrar sesion

  const logout = () => {
    // Limpiar datos de usuario
    setUserData(null);
    
    // Eliminar cualquier token de autenticación si lo usas
    // localStorage.removeItem('authToken');

    // Redirigir al login
    navigate('/');
  };

  const value = {
    userData,
    setUserData,
    logout
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

//export const useUser = () => useContext(UserContext);

// Exportamos el hook como named export
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}