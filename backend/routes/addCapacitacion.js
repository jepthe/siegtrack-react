// backend/routes/addCapacitacion.js

const express = require("express");
const { pool } = require("../config/db");
const router = express.Router();

// Ruta para crear una nueva capacitación
router.post("/create", (req, res) => {
  const {
    nombre,
    descripcion,
    area,
    estado,
    modalidad,
    fecha_inicio,
    fecha_fin,
    duracion_horas,
  } = req.body;

  console.log("Datos recibidos:", req.body);

  const sql = `
    INSERT INTO capacitaciones 
    (nombre, descripcion, area, estado, modalidad, fecha_inicio, fecha_fin, duracion_horas)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error al obtener conexión:", err);
      return res.status(500).json({
        status: "error",
        message: "Error de conexión a la base de datos",
      });
    }

    connection.query(
      sql,
      [
        nombre,
        descripcion,
        area,
        estado,
        modalidad,
        fecha_inicio,
        fecha_fin,
        duracion_horas,
      ],
      (error, results) => {
        connection.release();

        if (error) {
          console.error("Error al insertar capacitación:", error);
          return res.status(500).json({
            status: "error",
            message: "Error al guardar la capacitación",
          });
        }

        res.status(201).json({
          status: "success",
          message: "Capacitación creada exitosamente",
          data: { id: results.insertId },
        });
      }
    );
  });
});

module.exports = router;
