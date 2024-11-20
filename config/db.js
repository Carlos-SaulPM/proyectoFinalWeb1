const mysql = require('mysql2');

// Crear la conexión utilizando mysql2
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'user1',
  password: '198013',  // Asegúrate de usar tu contraseña real aquí
  database: 'pagina_juegos'
});

// Exportar la conexión para que pueda ser utilizada en otras partes del proyecto
module.exports = connection;
