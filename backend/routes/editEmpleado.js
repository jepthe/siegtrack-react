// backend/routes/editEmpleado.js

const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// Obtener empleado por ID
router.get('/search/:id', (req, res) => {
  const { id } = req.params;

  pool.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Error de conexión a la base de datos"
      });
    }

    const sql = 'SELECT * FROM empleados WHERE empleado_id = ?';
    connection.query(sql, [id], (error, results) => {
      connection.release();

      if (error) {
        return res.status(500).json({
          status: "error",
          message: "Error al obtener el empleado"
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          status: "error",
          message: "Empleado no encontrado"
        });
      }

      res.json(results[0]);
    });
  });
});

// Actualizar empleado
router.put('/update/:id', (req, res) => {
  const { id } = req.params;
  const {
    nombre,
    apellido_paterno,
    apellido_materno,
    departamento,
    estado,
    puesto
  } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Error de conexión a la base de datos"
      });
    }

    const sql = `
      UPDATE empleados 
      SET 
        nombre = ?,
        apellido_paterno = ?,
        apellido_materno = ?,
        departamento = ?,
        estado = ?,
        puesto = ?
      WHERE empleado_id = ?
    `;

    connection.query(
      sql,
      [nombre, apellido_paterno, apellido_materno, departamento, estado, puesto, id],
      (error, results) => {
        connection.release();

        if (error) {
          return res.status(500).json({
            status: "error",
            message: "Error al actualizar el empleado"
          });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({
            status: "error",
            message: "Empleado no encontrado"
          });
        }

        res.json({
          status: "success",
          message: "Empleado actualizado exitosamente"
        });
      }
    );
  });
});

module.exports = router;