// backend/routes/addUsuario.js

const express = require("express");
const { pool } = require("../config/db");
const router = express.Router();

// Crear usuario
router.post("/create", (req, res) => {
  const { nombre_usuario, contraseña, rol } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error al obtener conexión:", err);
      return res.status(500).json({
        status: "error",
        message: "Error de conexión a la base de datos",
      });
    }

    // Primero verificar si el usuario ya existe
    connection.query(
      "SELECT nombre_usuario FROM usuarios WHERE nombre_usuario = ?",
      [nombre_usuario],
      (error, results) => {
        if (error) {
          connection.release();
          return res.status(500).json({
            status: "error",
            message: "Error al verificar el usuario",
          });
        }

        if (results.length > 0) {
          connection.release();
          return res.status(400).json({
            status: "error",
            message: "El nombre de usuario ya existe",
          });
        }

        // Si el usuario no existe, crearlo
        const sql =
          "INSERT INTO usuarios (nombre_usuario, contraseña, rol) VALUES (?, ?, ?)";
        connection.query(
          sql,
          [nombre_usuario, contraseña, rol],
          (error, results) => {
            connection.release();

            if (error) {
              return res.status(500).json({
                status: "error",
                message: "Error al crear el usuario",
              });
            }

            res.status(201).json({
              status: "success",
              message: "Usuario creado exitosamente",
              data: { id: results.insertId },
            });
          }
        );
      }
    );
  });
});

module.exports = router;
