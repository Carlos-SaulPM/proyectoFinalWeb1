const mysql = require("mysql2");

// Conexión con la base de datos
const connection = mysql.createConnection({
  host: "localhost",
  user: "user1",
  password: "198013",
  database: "pagina_juegos",
});

module.exports = connection;
