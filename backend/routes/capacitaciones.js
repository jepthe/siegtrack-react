// backend/routes/capacitaciones.js
const express = require('express');
const { pool } = require('../config/db');
const router = express.Router();

router.get('/capacitaciones', (req, res) => {

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error al obtener conexión:', err);
      return res.status(500).json({
        status: "error",
        message: "Error de conexión a la base de datos"
      });
    }

    const sql = "SELECT capacitacion_id, nombre, area, fecha_inicio, estado, duracion_horas FROM capacitaciones";
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







// New route for searching capacitaciones
router.get('/capacitaciones/search', (req, res) => {
  const { query } = req.query;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error al obtener conexión:', err);
      return res.status(500).json({ status: "error", message: "Error de conexión a la base de datos" });
    }

    // Parameterized query to search across multiple columns
    const sql = `
      SELECT capacitacion_id, nombre, area, fecha_inicio, estado, duracion_horas 
      FROM capacitaciones 
      WHERE 
        nombre LIKE ? OR 
        area LIKE ? OR 
        CAST(capacitacion_id AS CHAR) LIKE ?
    `;

    // Add wildcard for partial matching
    const searchTerm = `%${query}%`;

    connection.query(sql, [searchTerm, searchTerm, searchTerm], (error, results) => {
      connection.release();

      if (error) {
        console.error('Error en consulta de búsqueda:', error);
        return res.status(500).json({ status: "error", message: "Error en el servidor" });
      }

      res.json(results);
    });
  });
});





// endpoint para obtener estadísticas
router.get('/capacitaciones/stats', (req, res) => {
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
        SUM(CASE WHEN estado = 1 THEN 1 ELSE 0 END) as activas,
        SUM(CASE WHEN estado = 0 THEN 1 ELSE 0 END) as inactivas
      FROM capacitaciones
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