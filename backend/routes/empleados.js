// backend/routes/empleados.js

const express = require('express');
const { pool } = require('../config/db');
const router = express.Router();

// Obtener todos los empleados
router.get('/empleados', (req, res) => {
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
        empleado_id,
        nombre,
        apellido_paterno,
        apellido_materno,
        departamento,
        estado,
        puesto,
        email
      FROM empleados
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

      res.json(results);
    });
  });
});

// Buscar empleados
router.get('/empleados/search', (req, res) => {
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
      SELECT 
        empleado_id,
        nombre,
        apellido_paterno,
        apellido_materno,
        departamento,
        estado,
        puesto
      FROM empleados
      WHERE 
        nombre LIKE ? OR
        apellido_paterno LIKE ? OR
        apellido_materno LIKE ? OR
        departamento LIKE ? OR
        puesto LIKE ? OR
        CAST(empleado_id AS CHAR) LIKE ?
    `;

    const searchTerm = `%${query}%`;
    const params = Array(6).fill(searchTerm);

    connection.query(sql, params, (error, results) => {
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

// Obtener estadísticas
router.get('/empleados/stats', (req, res) => {
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
        SUM(CASE WHEN estado = 'Activo' THEN 1 ELSE 0 END) as activos,
        SUM(CASE WHEN estado = 'Inactivo' THEN 1 ELSE 0 END) as inactivos
      FROM empleados
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