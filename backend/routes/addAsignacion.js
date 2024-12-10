// backend/routes/addAsignacion.js

const express = require("express");
const { pool } = require("../config/db");
const router = express.Router();

// Añadir esta función antes de las rutas
const util = require("util");

// Crear nueva asignación
router.post("/create", (req, res) => {
  const { empleado_id, capacitacion_id, fecha_asignacion, fecha_completado } =
    req.body;

  // Verificar que los campos requeridos estén presentes
  if (!empleado_id || !capacitacion_id || !fecha_asignacion) {
    return res.status(400).json({
      status: "error",
      message:
        "Faltan campos requeridos (empleado_id, capacitacion_id, fecha_asignacion)",
    });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error al obtener conexión:", err);
      return res.status(500).json({
        status: "error",
        message: "Error de conexión a la base de datos",
      });
    }

    // Primero verificar que no exista la misma asignación
    connection.query(
      "SELECT * FROM asignaciones_capacitaciones WHERE empleado_id = ? AND capacitacion_id = ?",
      [empleado_id, capacitacion_id],
      (error, results) => {
        if (error) {
          connection.release();
          console.error("Error al verificar la asignación:", error);
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

        // Si no existe, crear la nueva asignación
        const sql = `
            INSERT INTO asignaciones_capacitaciones 
            (empleado_id, capacitacion_id, fecha_asignacion, fecha_completado)
            VALUES (?, ?, ?, ?)
          `;

        connection.query(
          sql,
          [
            empleado_id,
            capacitacion_id,
            fecha_asignacion,
            fecha_completado || null,
          ],
          (error, results) => {
            connection.release();

            if (error) {
              console.error("Error al crear la asignación:", error);
              return res.status(500).json({
                status: "error",
                message: "Error al crear la asignación",
                details: error.message,
              });
            }

            res.status(201).json({
              status: "success",
              message: "Asignación creada exitosamente",
              data: { id: results.insertId },
            });
          }
        );
      }
    );
  });
});

// Añadir este endpoint al archivo existente addAsignacion.js

// Crear múltiples asignaciones
router.post("/create-multiple", (req, res) => {
  const { empleados, capacitaciones, fecha_asignacion } = req.body;

  pool.getConnection(async (err, connection) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Error de conexión a la base de datos",
      });
    }

    // Convertir callbacks a promesas
    const query = util.promisify(connection.query).bind(connection);
    const beginTransaction = util
      .promisify(connection.beginTransaction)
      .bind(connection);
    const commit = util.promisify(connection.commit).bind(connection);
    const rollback = util.promisify(connection.rollback).bind(connection);

    try {
      await beginTransaction();

      const values = [];
      const existingAssignments = [];

      // Verificar asignaciones existentes y preparar nuevas asignaciones
      for (const empleado_id of empleados) {
        for (const capacitacion_id of capacitaciones) {
          // Verificar si la asignación ya existe
          const existingRows = await query(
            "SELECT * FROM asignaciones_capacitaciones WHERE empleado_id = ? AND capacitacion_id = ?",
            [empleado_id, capacitacion_id]
          );

          if (existingRows.length === 0) {
            values.push([empleado_id, capacitacion_id, fecha_asignacion]);
          } else {
            existingAssignments.push({ empleado_id, capacitacion_id });
          }
        }
      }

      // Insertar nuevas asignaciones si hay alguna
      if (values.length > 0) {
        await query(
          "INSERT INTO asignaciones_capacitaciones (empleado_id, capacitacion_id, fecha_asignacion) VALUES ?",
          [values]
        );
      }

      await commit();
      connection.release();

      res.status(201).json({
        status: "success",
        message: "Asignaciones creadas exitosamente",
        data: {
          asignaciones_creadas: values.length,
          asignaciones_existentes: existingAssignments.length,
          detalles_existentes: existingAssignments,
        },
      });
    } catch (error) {
      await rollback();
      connection.release();
      console.error("Error en la creación de asignaciones:", error);
      res.status(500).json({
        status: "error",
        message: "Error al crear las asignaciones",
        error: error.message,
      });
    }
  });
});

module.exports = router;
