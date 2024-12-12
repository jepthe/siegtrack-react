// backend/server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
//importaciones de las rutas backend/routes/.js
const { testConnection } = require("./config/db");
const authRoutes = require("./routes/auth");
const capacitacionesRoutes = require("./routes/capacitaciones");
const addCapacitacionRoutes = require("./routes/addCapacitacion");
const editCapacitacionRoutes = require("./routes/editCapacitacion");
const deleteCapacitacionRoutes = require("./routes/deleteCapacitacion");
const usuariosRoutes = require("./routes/usuarios");
const addUsuarioRoutes = require("./routes/addUsuario");
const editUsuarioRoutes = require("./routes/editUsuario");
const deleteUsuarioRoutes = require("./routes/deleteUsuario");
const empleadosRoutes = require("./routes/empleados");
const addEmpleadoRoutes = require("./routes/addEmpleado");
const editEmpleadoRoutes = require("./routes/editEmpleado");
const deleteEmpleadoRoutes = require("./routes/deleteEmpleado");
const asignacionesRoutes = require("./routes/asignaciones");
const addAsignacionRoutes = require("./routes/addAsignacion");
const editAsignacionRoutes = require("./routes/editAsignacion");
const deleteAsignacionRoutes = require("./routes/deleteAsignacion");

require("dotenv").config();

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use("/auth", authRoutes);
app.use("/cap", capacitacionesRoutes);
app.use("/addcap", addCapacitacionRoutes);
app.use("/editcap", editCapacitacionRoutes);
app.use("/deletecap", deleteCapacitacionRoutes);
app.use("/users", usuariosRoutes);
app.use("/adduser", addUsuarioRoutes);
app.use("/edituser", editUsuarioRoutes);
app.use("/deleteuser", deleteUsuarioRoutes);
app.use("/emp", empleadosRoutes);
app.use("/addemp", addEmpleadoRoutes);
app.use("/editemp", editEmpleadoRoutes);
app.use("/deleteemp", deleteEmpleadoRoutes);
app.use("/asig", asignacionesRoutes);
app.use("/addasig", addAsignacionRoutes);
app.use("/editasig", editAsignacionRoutes);
app.use("/deleteasig", deleteAsignacionRoutes);

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
    console.error("Error al iniciar el servidor:", error);
    process.exit(1);
  }
}

startServer();
