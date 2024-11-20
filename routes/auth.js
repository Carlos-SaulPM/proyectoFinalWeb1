const express = require('express');
const bcrypt = require('bcryptjs'); // Para encriptar las contraseñas
const connection = require('../config/db'); // Conexión a la base de datos
const router = express.Router();

// Ruta para mostrar el formulario de registro (GET)
router.get('/register', (req, res) => {
    res.render('register'); // Renderiza la vista 'register.hbs'
});

// Ruta para manejar el registro de usuarios (POST)
router.post('/register', async (req, res) => {
    const { nombre, correo, password, confirmPassword } = req.body;

    // Validación básica de los campos
    if (!nombre || !correo || !password || !confirmPassword) {
        return res.status(400).send('Por favor, completa todos los campos.');
    }

    if (password !== confirmPassword) {
        return res.status(400).send('Las contraseñas no coinciden.');
    }

    try {
        // Verificar si el correo ya está registrado
        const [userExists] = await connection.promise().query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
        if (userExists.length > 0) {
            return res.status(400).send('El correo ya está registrado');
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insertar el nuevo usuario en la base de datos
        await connection.promise().query('INSERT INTO usuarios (nombre, correo, password) VALUES (?, ?, ?)', [nombre, correo, hashedPassword]);

        // Redirigir al login después del registro exitoso
        res.redirect('/auth/login'); // Cambié la ruta a '/auth/login'
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al registrar el usuario');
    }
});

// Ruta para mostrar el formulario de inicio de sesión (GET)
router.get('/login', (req, res) => {
    res.render('login'); // Renderiza la vista 'login.hbs'
});

// Ruta para manejar el inicio de sesión de usuarios (POST)
router.post('/login', async (req, res) => {
    const { correo, password } = req.body;

    // Validación básica de los campos
    if (!correo || !password) {
        return res.status(400).send('Por favor, ingresa correo y contraseña.');
    }

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
        res.redirect('/'); // Redirigir al home después de iniciar sesión
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al iniciar sesión');
    }
});

// Ruta para cerrar sesión (GET)
router.get('/logout', (req, res) => {
    req.session.destroy(); // Eliminar la sesión
    res.redirect('/'); // Redirigir al home después de cerrar sesión
});

module.exports = router;
