// backend/routes/usuarios.js

const express = require('express');
const { pool } = require('../config/db');
const router = express.Router();

// Obtener todos los usuarios
router.get('/usuarios', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error al obtener conexión:', err);
      return res.status(500).json({
        status: "error",
        message: "Error de conexión a la base de datos"
      });
    }

    const sql = "SELECT usuario_id, nombre_usuario, rol FROM usuarios";
    connection.query(sql, (error, results) => {
      connection.release();

      if (error) {
        console.error('Error en consulta:', error);
        return res.status(500).json({
          status: "error",
          message: "Error en el servidor"
        });
      }

      res.json(results);
    });
  });
});

// Buscar usuarios
router.get('/usuarios/search', (req, res) => {
  const { query } = req.query;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error al obtener conexión:', err);
      return res.status(500).json({
        status: "error",
        message: "Error de conexión a la base de datos"
      });
    }

    const sql = `
      SELECT usuario_id, nombre_usuario, rol
      FROM usuarios
      WHERE 
        nombre_usuario LIKE ? OR
        rol LIKE ? OR
        CAST(usuario_id AS CHAR) LIKE ?
    `;

    const searchTerm = `%${query}%`;

    connection.query(sql, [searchTerm, searchTerm, searchTerm], (error, results) => {
      connection.release();

      if (error) {
        console.error('Error en consulta de búsqueda:', error);
        return res.status(500).json({
          status: "error",
          message: "Error en el servidor"
        });
      }

      res.json(results);
    });
  });
});

// Obtener estadísticas de usuarios
router.get('/usuarios/stats', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error al obtener conexión:', err);
      return res.status(500).json({
        status: "error",
        message: "Error de conexión a la base de datos"
      });
    }

    const sql = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN rol = 'Administrador' THEN 1 ELSE 0 END) as administradores,
        SUM(CASE WHEN rol = 'Usuario' THEN 1 ELSE 0 END) as usuarios
      FROM usuarios
    `;

    connection.query(sql, (error, results) => {
      connection.release();

      if (error) {
        console.error('Error en consulta:', error);
        return res.status(500).json({
          status: "error",
          message: "Error en el servidor"
        });
      }

      res.json(results[0]);
    });
  });
});

module.exports = router;