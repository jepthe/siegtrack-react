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

module.exports = router;