// backend/config/db.js
const mysql = require("mysql");
require("dotenv").config();

// Crear el pool de conexiones en lugar de una única conexión
const pool = mysql.createPool({
  //connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  debug: true, // Activar para depuración
});

// Función para probar la conexión
const testConnection = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Error al obtener conexión:", err);
        reject(err);
        return;
      }

      console.log("Conexión exitosa a la base de datos");

      connection.release();

      resolve(true);
    });
  });
};

// Exportar tanto el pool como la función de prueba
module.exports = { pool, testConnection };
