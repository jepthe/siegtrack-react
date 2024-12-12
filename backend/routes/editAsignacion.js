// backend/routes/editAsignacion.js

const express = require("express");
const router = express.Router();
const { pool } = require("../config/db");

// Obtener asignación por ID
router.get("/search/:id", (req, res) => {
  const { id } = req.params;

  pool.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Error de conexión a la base de datos",
      });
    }

    const sql = `
      SELECT 
        a.*,
        e.nombre AS nombre_empleado,
        e.departamento AS area,
        c.nombre AS nombre_capacitacion
      FROM asignaciones_capacitaciones a
      JOIN empleados e ON a.empleado_id = e.empleado_id
      JOIN capacitaciones c ON a.capacitacion_id = c.capacitacion_id
      WHERE a.asignacion_id = ?
    `;

    connection.query(sql, [id], (error, results) => {
      connection.release();

      if (error) {
        return res.status(500).json({
          status: "error",
          message: "Error al obtener la asignación",
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          status: "error",
          message: "Asignación no encontrada",
        });
      }

      res.json(results[0]);
    });
  });
});

// Actualizar asignación
router.put("/update/:id", (req, res) => {
  const { id } = req.params;
  const { empleado_id, capacitacion_id, fecha_asignacion, fecha_completado } =
    req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Error de conexión a la base de datos",
      });
    }

    // Verificar que la nueva combinación empleado-capacitación no exista
    connection.query(
      "SELECT * FROM asignaciones_capacitaciones WHERE empleado_id = ? AND capacitacion_id = ? AND asignacion_id != ?",
      [empleado_id, capacitacion_id, id],
      (error, results) => {
        if (error) {
          connection.release();
          return res.status(500).json({
            status: "error",
            message: "Error al verificar la asignación",
          });
        }

        if (results.length > 0) {
          connection.release();
          return res.status(400).json({
            status: "error",
            message: "Esta capacitación ya está asignada a este empleado",
          });
        }

        // Si no existe, actualizar la asignación
        const sql = `
          UPDATE asignaciones_capacitaciones 
          SET 
            empleado_id = ?,
            capacitacion_id = ?,
            fecha_asignacion = ?,
            fecha_completado = ?
          WHERE asignacion_id = ?
        `;

        connection.query(
          sql,
          [
            empleado_id,
            capacitacion_id,
            fecha_asignacion,
            fecha_completado || null,
            id,
          ],
          (error, results) => {
            connection.release();

            if (error) {
              return res.status(500).json({
                status: "error",
                message: "Error al actualizar la asignación",
              });
            }

            if (results.affectedRows === 0) {
              return res.status(404).json({
                status: "error",
                message: "Asignación no encontrada",
              });
            }

            res.json({
              status: "success",
              message: "Asignación actualizada exitosamente",
            });
          }
        );
      }
    );
  });
});

module.exports = router;
