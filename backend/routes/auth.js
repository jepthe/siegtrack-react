// backend/routes/auth.js
const express = require('express');
const { pool } = require('../config/db');
const router = express.Router();

router.post('/login', (req, res) => {
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    return res.status(400).json({
      status: "error",
      message: "Usuario y contraseña son requeridos"
    });
  }

  const sql = "SELECT nombre_usuario, rol FROM usuarios WHERE nombre_usuario = ? AND contraseña = ?";

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error al obtener conexión:', err);
      return res.status(500).json({
        status: "error",
        message: "Error de conexión a la base de datos"
      });
    }

    connection.query(sql, [usuario, password], (error, results) => {
      connection.release();

      if (error) {
        console.error('Error en consulta:', error);
        return res.status(500).json({
          status: "error",
          message: "Error en el servidor"
        });
      }

      if (results.length > 0) {
        return res.status(200).json({
          status: "success",
          message: "Credenciales correctas",
          nombre: results[0].nombre_usuario,
          rol: results[0].rol
        });
      }

      return res.status(401).json({
        status: "error",
        message: "Usuario o contraseña incorrectos"
      });
    });
  });
});

module.exports = router;