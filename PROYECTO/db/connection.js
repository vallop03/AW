const mysql = require('mysql');
const pool = mysql.createPool({
    host: 'localhost',        // Dirección del servidor MySQL
    port: 3307,                // Puerto (por defecto 3306)
    user: 'root',              // Usuario de la base de datos
    password: '',   // Contraseña
    database: 'carricoche_bd',       // Nombre de la base de datos

    // Parámetros del pool
    connectionLimit: 10,       // Máximo de conexiones simultáneas en el pool
    waitForConnections: true,  // Esperar si no hay conexiones libres
    queueLimit: 0,             // Máximo de solicitudes en cola (0 = ilimitado)
});

module.exports = pool;
