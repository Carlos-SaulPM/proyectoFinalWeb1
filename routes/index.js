var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async (req, res) => {
  try {
      const [juegos] = await connection.promise().query('SELECT * FROM juegos');
      
      // Dividir los juegos en carrusel y tarjetas
      const juegosCarrusel = juegos.slice(0, 6); // Los primeros 6 juegos para el carrusel
      const juegosTarjetas = juegos.slice(6); // Los demás juegos para las tarjetas

      res.render('index', { juegosCarrusel, juegosTarjetas });
  } catch (err) {
      console.error(err);
      res.status(500).send('Error al obtener los juegos');
  }
});
module.exports = router;
