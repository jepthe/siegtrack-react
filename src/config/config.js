//azure
// src/config/config.js
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5002';
console.log('API URL:', apiUrl); // Para debug

const config = {
  apiUrl
};

export default config;