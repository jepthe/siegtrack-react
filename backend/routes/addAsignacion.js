const express = require("express");
const { pool } = require("../config/db");
const { sendMail } = require('../config/mailConfig');
const util = require("util");

// Función auxiliar para obtener detalles del empleado y capacitación
const getAssignmentDetails = async (connection, empleado_id, capacitacion_id) => {
  const query = util.promisify(connection.query).bind(connection);
  const sql = `
    SELECT 
      e.nombre, 
      e.apellido_paterno,
      e.email,
      c.nombre AS nombre_capacitacion,
      c.descripcion,
      c.duracion_horas,
      c.modalidad
    FROM empleados e
    JOIN capacitaciones c ON c.capacitacion_id = ?
    WHERE e.empleado_id = ?
  `;
  
  const results = await query(sql, [capacitacion_id, empleado_id]);
  return results[0];
};

// Función para enviar correo de notificación
const sendNotificationEmail = async (details, fecha_asignacion) => {
  const emailHtml = `
    <h2>Nueva Capacitación Asignada</h2>
    <p>Estimado(a) ${details.nombre} ${details.apellido_paterno},</p>
    <p>Se le ha asignado una nueva capacitación:</p>
    <ul>
      <li><strong>Capacitación:</strong> ${details.nombre_capacitacion}</li>
      <li><strong>Descripción:</strong> ${details.descripcion}</li>
      <li><strong>Duración:</strong> ${details.duracion_horas} horas</li>
      <li><strong>Modalidad:</strong> ${details.modalidad}</li>
      <li><strong>Fecha de Asignación:</strong> ${new Date(fecha_asignacion).toLocaleDateString()}</li>
    </ul>
    <p>Por favor, ingrese al sistema para ver más detalles de la capacitación.</p>
    <p>Saludos cordiales,<br>Sistema SiegTrack</p>
  `;

  return sendMail(
    details.email,
    'Nueva Capacitación Asignada - SiegTrack',
    emailHtml
  );
};

const router = express.Router();

// Crear nueva asignación
router.post("/create", async (req, res) => {
  const { empleado_id, capacitacion_id, fecha_asignacion, fecha_completado } = req.body;

  if (!empleado_id || !capacitacion_id || !fecha_asignacion) {
    return res.status(400).json({
      status: "error",
      message: "Faltan campos requeridos (empleado_id, capacitacion_id, fecha_asignacion)",
    });
  }

  pool.getConnection(async (err, connection) => {
    if (err) {
      console.error("Error al obtener conexión:", err);
      return res.status(500).json({
        status: "error",
        message: "Error de conexión a la base de datos",
      });
    }

    const query = util.promisify(connection.query).bind(connection);

    try {
      // Verificar asignación existente
      const existingAssignments = await query(
        "SELECT * FROM asignaciones_capacitaciones WHERE empleado_id = ? AND capacitacion_id = ?",
        [empleado_id, capacitacion_id]
      );

      if (existingAssignments.length > 0) {
        connection.release();
        return res.status(400).json({
          status: "error",
          message: "Esta capacitación ya está asignada a este empleado",
        });
      }

      // Crear la asignación
      const result = await query(
        `INSERT INTO asignaciones_capacitaciones 
         (empleado_id, capacitacion_id, fecha_asignacion, fecha_completado)
         VALUES (?, ?, ?, ?)`,
        [empleado_id, capacitacion_id, fecha_asignacion, fecha_completado || null]
      );

      // Obtener detalles y enviar correo
      const details = await getAssignmentDetails(connection, empleado_id, capacitacion_id);
      if (details && details.email) {
        await sendNotificationEmail(details, fecha_asignacion);
      }

      connection.release();
      res.status(201).json({
        status: "success",
        message: "Asignación creada exitosamente y notificación enviada",
        data: { id: result.insertId },
      });

    } catch (error) {
      connection.release();
      console.error("Error:", error);
      res.status(500).json({
        status: "error",
        message: "Error al crear la asignación",
        details: error.message,
      });
    }
  });
});

// Crear múltiples asignaciones
router.post("/create-multiple", async (req, res) => {
  const { empleados, capacitaciones, fecha_asignacion } = req.body;

  pool.getConnection(async (err, connection) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Error de conexión a la base de datos",
      });
    }

    const query = util.promisify(connection.query).bind(connection);
    const beginTransaction = util.promisify(connection.beginTransaction).bind(connection);
    const commit = util.promisify(connection.commit).bind(connection);
    const rollback = util.promisify(connection.rollback).bind(connection);

    try {
      await beginTransaction();

      const values = [];
      const existingAssignments = [];
      const emailPromises = [];

      // Verificar asignaciones existentes y preparar nuevas asignaciones
      for (const empleado_id of empleados) {
        for (const capacitacion_id of capacitaciones) {
          const existingRows = await query(
            "SELECT * FROM asignaciones_capacitaciones WHERE empleado_id = ? AND capacitacion_id = ?",
            [empleado_id, capacitacion_id]
          );

          if (existingRows.length === 0) {
            values.push([empleado_id, capacitacion_id, fecha_asignacion]);
            
            // Obtener detalles y preparar correo
            const details = await getAssignmentDetails(connection, empleado_id, capacitacion_id);
            if (details && details.email) {
              emailPromises.push(sendNotificationEmail(details, fecha_asignacion));
            }
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

      // Enviar todos los correos
      await Promise.all(emailPromises);

      await commit();
      connection.release();

      res.status(201).json({
        status: "success",
        message: "Asignaciones creadas exitosamente y notificaciones enviadas",
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