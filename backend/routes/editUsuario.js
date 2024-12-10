// backend/routes/editUsuario.js

const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// Obtener usuario por ID
router.get('/search/:id', (req, res) => {
  const { id } = req.params;

  pool.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Error de conexión a la base de datos"
      });
    }

    const sql = 'SELECT usuario_id, nombre_usuario, rol FROM usuarios WHERE usuario_id = ?';
    connection.query(sql, [id], (error, results) => {
      connection.release();

      if (error) {
        return res.status(500).json({
          status: "error",
          message: "Error al obtener el usuario"
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          status: "error",
          message: "Usuario no encontrado"
        });
      }

      res.json(results[0]);
    });
  });
});

// Actualizar usuario
router.put('/update/:id', (req, res) => {
  const { id } = req.params;
  const { nombre_usuario, contraseña, rol } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Error de conexión a la base de datos"
      });
    }

    let sql;
    let params;

    if (contraseña) {
      sql = 'UPDATE usuarios SET nombre_usuario = ?, contraseña = ?, rol = ? WHERE usuario_id = ?';
      params = [nombre_usuario, contraseña, rol, id];
    } else {
      sql = 'UPDATE usuarios SET nombre_usuario = ?, rol = ? WHERE usuario_id = ?';
      params = [nombre_usuario, rol, id];
    }

    connection.query(sql, params, (error, results) => {
      connection.release();

      if (error) {
        return res.status(500).json({
          status: "error",
          message: "Error al actualizar el usuario"
        });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({
          status: "error",
          message: "Usuario no encontrado"
        });
      }

      res.json({
        status: "success",
        message: "Usuario actualizado exitosamente"
      });
    });
  });
});

module.exports = router;