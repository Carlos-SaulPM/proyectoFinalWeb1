var express = require("express");
var router = express.Router();
var connection = require("../config/db");

router.get("/", async (req, res) => {
  try {
    const [juegos] = await connection.promise().query("SELECT * FROM juegos");
    const juegosCarrusel = juegos.slice(0, 6);
    const juegosTarjetas = juegos.slice(6);
    res.render("index", { juegosCarrusel, juegosTarjetas });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener los juegos");
  }
});

module.exports = router;
