var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var connection = require('./config/db'); // Conexión a la base de datos
var hbs = require('hbs'); // Asegúrate de que hbs está instalado
var usersRouter = require('./routes/users'); // Ruta de usuarios
var gamesRouter = require('./routes/games'); // Ruta de juegos (agregada)

// Crear la aplicación
var app = express();

// Configuración de la vista
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Registrar el directorio de layouts para hbs
hbs.registerPartials(path.join(__dirname, 'views', 'layouts'));

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de la sesión
app.use(session({
  secret: '458484',  // Cambia esto por una clave secreta segura
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }  // 'true' solo si usas HTTPS, si estás en desarrollo, déjalo como 'false'
}));

// Middleware para compartir la información de sesión
app.use(function (req, res, next) {
  if (req.session && req.session.user) {
    res.locals.user = req.session.user;  // Pasa el usuario a todas las vistas
  }
  next();
});

// Ruta principal (index)
app.get('/', (req, res) => {
  connection.query('SELECT * FROM juegos', (err, results) => {
    if (err) {
      res.status(500).send('Error al obtener los juegos');
      return;
    }

    // Divide los juegos en los primeros 6 para el carrusel y los demás para las tarjetas
    const juegosCarrusel = results.slice(0, 6); // Los primeros 6 juegos para el carrusel
    const juegosTarjetas = results.slice(6); // Los juegos restantes para las tarjetas

    res.render('index', { juegosCarrusel, juegosTarjetas });
  });
});

// Usar las rutas de users.js
app.use('/users', usersRouter);  // Aquí montas todas las rutas bajo '/users'

// Usar las rutas de juegos (games.js)
app.use('/games', gamesRouter);  // Aquí montas todas las rutas bajo '/games'

// Catch 404 y pasa al manejador de errores
app.use(function(req, res, next) {
  next(createError(404));
});

// Manejador de errores
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app.use('/games', gamesRouter);  // Prefijo '/games' para todas las rutas de juegos

module.exports = app;
