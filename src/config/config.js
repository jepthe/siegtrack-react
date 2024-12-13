//azure
// src/config/config.js
console.log('Todas las variables:', import.meta.env); // Ver todas las variables
console.log('VITE_API_URL específica:', import.meta.env.VITE_API_URL); // Ver la variable específica

const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5002'
};

console.log('URL final:', config.apiUrl); // Ver qué URL se está usando

export default config;