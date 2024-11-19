// backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { testConnection } = require('./config/db');
//importaciones de las rutas backend/routes/.js
const authRoutes = require('./routes/auth');
const capacitacionesRoutes = require('./routes/capacitaciones');
const addCapacitacionRoutes = require('./routes/addCapacitacion');
const editCapacitacionRoutes = require('./routes/editCapacitacion');
const deleteCapacitacionRoutes = require('./routes/deleteCapacitacion');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use('/auth', authRoutes);
app.use('/cap', capacitacionesRoutes);
app.use('/addcap', addCapacitacionRoutes);
app.use('/editcap', editCapacitacionRoutes);
app.use('/deletecap', deleteCapacitacionRoutes);

// Prueba de conexión y inicio del servidor
const PORT = process.env.PORT || 5002;

async function startServer() {
  try {
    // Probar la conexión a la base de datos
    await testConnection();
    
    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
}


startServer();