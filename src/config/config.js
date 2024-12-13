//azure
// src/config/config.js
const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5002'
};

// Para debug
console.log('Variable de entorno:', import.meta.env.VITE_API_URL);
console.log('Config apiUrl:', config.apiUrl);

export default config;