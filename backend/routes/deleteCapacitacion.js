const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error al obtener la conexión:', err);
            return res.status(500).json({
                success: false,
                message: 'Error de conexión con la base de datos'
            });
        }

        const query = 'DELETE FROM capacitaciones WHERE capacitacion_id = ?';
        connection.query(query, [id], (error, result) => {
            // Siempre liberar la conexión
            connection.release();
            
            if (error) {
                console.error('Error al eliminar la capacitación:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Error al eliminar la capacitación'
                });
            }
            
            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Capacitación no encontrada'
                });
            }
            
            res.json({
                success: true,
                message: 'Capacitación eliminada exitosamente'
            });
        });
    });
});

module.exports = router;