// backend/routes/asignaciones.js

const express = require("express");
const { pool } = require("../config/db");
const router = express.Router();

// Obtener todas las asignaciones con información relacionada
router.get("/asignaciones", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error al obtener conexión:", err);
      return res.status(500).json({
        status: "error",
        message: "Error de conexión a la base de datos",
      });
    }

    const sql = `
        SELECT 
            a.asignacion_id,
            e.nombre AS nombre_empleado,
            e.email AS email_empleado,
            CONCAT(e.nombre, ' ', e.apellido_paterno, ' ', e.apellido_materno) as nombre_completo_empleado,
            c.nombre AS nombre_capacitacion,
            c.area,
            a.fecha_asignacion,
            a.fecha_completado
        FROM asignaciones_capacitaciones a
        JOIN empleados e ON a.empleado_id = e.empleado_id
        JOIN capacitaciones c ON a.capacitacion_id = c.capacitacion_id
        ORDER BY a.fecha_asignacion DESC
    `;

    connection.query(sql, (error, results) => {
      connection.release();

      if (error) {
        console.error("Error en consulta:", error);
        return res.status(500).json({
          status: "error",
          message: "Error en el servidor",
        });
      }

      res.json(results);
    });
  });
});

// Búsqueda de asignaciones
router.get("/asignaciones/search", (req, res) => {
  const { query } = req.query;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error al obtener conexión:", err);
      return res.status(500).json({
        status: "error",
        message: "Error de conexión a la base de datos",
      });
    }

    const sql = `
        SELECT 
            a.asignacion_id,
            e.nombre AS nombre_empleado,
            e.email AS email_empleado,
            CONCAT(e.nombre, ' ', e.apellido_paterno, ' ', e.apellido_materno) as nombre_completo_empleado,
            c.nombre AS nombre_capacitacion,
            c.area,
            a.fecha_asignacion,
            a.fecha_completado
        FROM asignaciones_capacitaciones a
        JOIN empleados e ON a.empleado_id = e.empleado_id
        JOIN capacitaciones c ON a.capacitacion_id = c.capacitacion_id
        WHERE 
            e.nombre LIKE ? OR
            e.apellido_paterno LIKE ? OR
            e.apellido_materno LIKE ? OR
            e.email LIKE ? OR
            c.nombre LIKE ? OR
            c.area LIKE ? OR
            CAST(a.asignacion_id AS CHAR) LIKE ?
        ORDER BY a.fecha_asignacion DESC
    `;

    const searchTerm = `%${query}%`;
    const params = Array(7).fill(searchTerm);

    connection.query(sql, params, (error, results) => {
      connection.release();

      if (error) {
        console.error("Error en consulta de búsqueda:", error);
        return res.status(500).json({
          status: "error",
          message: "Error en el servidor",
        });
      }

      res.json(results);
    });
  });
});

// Obtener estadísticas
router.get("/asignaciones/stats", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error al obtener conexión:", err);
      return res.status(500).json({
        status: "error",
        message: "Error de conexión a la base de datos",
      });
    }

    const sql = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN fecha_completado IS NOT NULL THEN 1 ELSE 0 END) as completadas,
        SUM(CASE WHEN fecha_completado IS NULL THEN 1 ELSE 0 END) as pendientes
      FROM asignaciones_capacitaciones
    `;

    connection.query(sql, (error, results) => {
      connection.release();

      if (error) {
        console.error("Error en consulta:", error);
        return res.status(500).json({
          status: "error",
          message: "Error en el servidor",
        });
      }

      res.json(results[0]);
    });
  });
});

// Obtener lista de áreas únicas para filtrado
router.get("/areas", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Error de conexión a la base de datos",
      });
    }

    const sql = `
      SELECT DISTINCT area 
      FROM capacitaciones 
      ORDER BY area
    `;

    connection.query(sql, (error, results) => {
      connection.release();

      if (error) {
        return res.status(500).json({
          status: "error",
          message: "Error al obtener las áreas",
        });
      }

      res.json(results.map((row) => row.area));
    });
  });
});

// Obtener empleados por área/departamento
router.get("/empleados-por-area/:area", (req, res) => {
  const { area } = req.params;

  pool.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Error de conexión a la base de datos",
      });
    }

    const sql = `
      SELECT 
        empleado_id,
        CONCAT(nombre, ' ', apellido_paterno, ' ', apellido_materno) as nombre_completo,
        departamento,
        puesto
      FROM empleados 
      WHERE departamento = ?
      ORDER BY nombre
    `;

    connection.query(sql, [area], (error, results) => {
      connection.release();

      if (error) {
        return res.status(500).json({
          status: "error",
          message: "Error al obtener los empleados",
        });
      }

      res.json(results);
    });
  });
});

// Obtener capacitaciones por área
router.get("/capacitaciones-por-area/:area", (req, res) => {
  const { area } = req.params;

  pool.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Error de conexión a la base de datos",
      });
    }

    const sql = `
      SELECT 
        capacitacion_id,
        nombre,
        descripcion,
        duracion_horas
      FROM capacitaciones 
      WHERE area = ? AND estado = 1
      ORDER BY nombre
    `;

    connection.query(sql, [area], (error, results) => {
      connection.release();

      if (error) {
        return res.status(500).json({
          status: "error",
          message: "Error al obtener las capacitaciones",
        });
      }

      res.json(results);
    });
  });
});

module.exports = router;
