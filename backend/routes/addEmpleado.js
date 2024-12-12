// backend/routes/addEmpleado.js

const express = require("express");
const { pool } = require("../config/db");
const router = express.Router();

// Crear empleado
router.post("/create", (req, res) => {
  const {
    nombre,
    apellido_paterno,
    apellido_materno,
    departamento,
    estado,
    puesto,
    email, 
  } = req.body;

  // Verificar que todos los campos requeridos estén presentes
  if (
    !nombre ||
    !apellido_paterno ||
    !apellido_materno ||
    !departamento ||
    !estado ||
    !puesto ||
    !email
  ) {
    return res.status(400).json({
      status: "error",
      message: "Todos los campos son requeridos",
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

    const sql = `
      INSERT INTO empleados 
      (nombre, apellido_paterno, apellido_materno, departamento, estado, puesto, email)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    connection.query(
      sql,
      [
        nombre,
        apellido_paterno,
        apellido_materno,
        departamento,
        estado,
        puesto,
        email,
      ],
      (error, results) => {
        connection.release();

        if (error) {
          console.error("Error al crear empleado:", error);
          return res.status(500).json({
            status: "error",
            message: "Error al crear el empleado",
          });
        }

        res.status(201).json({
          status: "success",
          message: "Empleado creado exitosamente",
          data: { id: results.insertId },
        });
      }
    );
  });
});

module.exports = router;
