// backend/routes/deleteEmpleado.js

const express = require("express");
const router = express.Router();
const { pool } = require("../config/db");

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error al obtener la conexión:", err);
      return res.status(500).json({
        success: false,
        message: "Error de conexión con la base de datos",
      });
    }

    const query = "DELETE FROM empleados WHERE empleado_id = ?";
    connection.query(query, [id], (error, result) => {
      connection.release();

      if (error) {
        console.error("Error al eliminar el empleado:", error);
        return res.status(500).json({
          success: false,
          message: "Error al eliminar el empleado",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Empleado no encontrado",
        });
      }

      res.json({
        success: true,
        message: "Empleado eliminado exitosamente",
      });
    });
  });
});

module.exports = router;
