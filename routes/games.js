var express = require("express");
var router = express.Router();
var connection = require("../config/db"); // Conexión a la base de datos

// Ruta para mostrar todos los juegos
router.get("/games", (req, res) => {
  const { busqueda, genero } = req.query;

  // Obtener la lista de géneros disponibles
  connection.query(
    "SELECT DISTINCT genero FROM juegos",
    (err, generosResult) => {
      if (err) {
        res.status(500).send("Error al obtener géneros");
        return;
      }

      const generos = generosResult.map((row) => row.genero);

      // Crear la consulta para obtener los juegos filtrados
      let query = "SELECT * FROM juegos";
      const conditions = [];
      if (busqueda) {
        conditions.push(`titulo LIKE '%${busqueda}%'`);
      }
      if (genero) {
        conditions.push(`genero = '${genero}'`);
      }
      if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
      }

      connection.query(query, (err, juegos) => {
        if (err) {
          res.status(500).send("Error al obtener juegos");
          return;
        }

        // Renderizar la vista de juegos y pasar las variables
        res.render("games", {
          juegos,
          generos,
        });
      });
    }
  );
});

module.exports = router;
