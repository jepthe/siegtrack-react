//azure
// src/config/config.js
const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5002'
};

export default config;