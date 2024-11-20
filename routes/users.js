const express = require('express');
const bcrypt = require('bcryptjs');
const connection = require('../config/db'); 
const router = express.Router();

// Ruta para mostrar el formulario de registro (GET)
router.get('/register', (req, res) => {
  res.render('register');
});

// Ruta para registrar un nuevo usuario (POST)
router.post('/register', async (req, res) => {
  const { nombre, correo, password } = req.body;

  try {
    // Verificar si el correo ya existe
    const [userExists] = await connection.promise().query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
    if (userExists.length > 0) {
      return res.status(400).send('El correo ya está registrado');
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar el nuevo usuario en la base de datos
    await connection.promise().query('INSERT INTO usuarios (nombre, correo, password) VALUES (?, ?, ?)', [nombre, correo, hashedPassword]);

    // Redirigir al registro con un mensaje de éxito
    res.render('register', { successMessage: '¡Te has registrado exitosamente! Ahora puedes iniciar sesión.' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al registrar el usuario');
  }
});

// Ruta para mostrar el formulario de inicio de sesión (GET)
router.get('/login', (req, res) => {
  res.render('login');
});

// Ruta para iniciar sesión (POST)
router.post('/login', async (req, res) => {
  const { correo, password } = req.body;

  try {
    // Buscar al usuario por correo
    const [rows] = await connection.promise().query('SELECT * FROM usuarios WHERE correo = ?', [correo]);

    if (rows.length === 0) {
      return res.status(400).send('Correo o contraseña incorrectos');
    }

    const user = rows[0];

    // Verificar la contraseña
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).send('Correo o contraseña incorrectos');
    }

    // Iniciar la sesión
    req.session.user = user;
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al iniciar sesión');
  }
});

// Ruta para cerrar sesión
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
