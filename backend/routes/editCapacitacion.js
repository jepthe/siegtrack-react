// backend/routes/editCapacitacion.js
const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// Ruta para obtener una capacitación por ID
router.get('/search/:id', (req, res) => {
    const { id } = req.params;

    console.log("ID recibido:", id);

    const query = "SELECT * FROM capacitaciones WHERE capacitacion_id = ?";

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error al obtener conexión:', err);
            return res.status(500).json({
                status: 'error',
                message: 'Error de conexión a la base de datos',
            });
        }

        connection.query(query, [id], (error, results) => {
            connection.release();

            if (error) {
                console.error('Error al obtener la capacitación:', error);
                return res.status(500).json({
                    status: 'error',
                    message: 'Error al obtener los datos de la capacitación',
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Capacitación no encontrada',
                });
            }

            res.json(results[0]);
        });
    });
});

// Ruta para actualizar una capacitación por ID
router.put('/update/:id', (req, res) => {
    const { id } = req.params;
    const {
        nombre,
        descripcion,
        area,
        estado,
        modalidad,
        fecha_inicio,
        fecha_fin,
        duracion_horas
    } = req.body;

    const query = `
        UPDATE capacitaciones 
        SET nombre = ?, 
            descripcion = ?, 
            area = ?, 
            estado = ?, 
            modalidad = ?, 
            fecha_inicio = ?, 
            fecha_fin = ?, 
            duracion_horas = ?
        WHERE capacitacion_id = ?
    `;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error al obtener conexión:', err);
            return res.status(500).json({
                status: 'error',
                message: 'Error de conexión a la base de datos'
            });
        }

        connection.query(
            query,
            [nombre, descripcion, area, estado, modalidad, fecha_inicio, fecha_fin, duracion_horas, id],
            (error, results) => {
                connection.release();

                if (error) {
                    console.error('Error al actualizar la capacitación:', error);
                    return res.status(500).json({
                        status: 'error',
                        message: 'Error al actualizar la capacitación'
                    });
                }

                if (results.affectedRows === 0) {
                    return res.status(404).json({
                        status: 'error',
                        message: 'Capacitación no encontrada'
                    });
                }

                res.json({
                    status: 'success',
                    message: 'Capacitación actualizada exitosamente'
                });
            }
        );
    });
});

module.exports = router;