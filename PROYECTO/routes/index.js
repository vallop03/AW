
const express = require('express');
const requireLogin = require('../middlewares/login');
const isAdmin = require('../middlewares/isAdmin');
const DAOUsuario = require('../db/daos/daoUsuario');
const pool = require('../db/connection');
const router = express.Router();

const daoUsuario = new DAOUsuario(pool);

router.get("/", function (request, response) {
    response.render("index.ejs");
});

router.get("/reservas", function (request, response) {
    response.render("reservas.ejs");
});

router.get("/registroUsuario", isAdmin, function (request, response) {
    response.render("registroUsuario.ejs");
});

router.post("/registroUsuario", function (request, response) {
    let usuario = {
        username: request.body.nombre,
        email: request.body.email,
        password: request.body.password,
        rol: "administrador"
    }
    const usuarios = request.app.locals.usuarios;

    if (usuario.email)
        usuario.email = usuario.email.toLowerCase();

    if (usuarios.some(v => v.email === usuario.email))
        console.log("Usuario con email repetido");
    else {
        console.log("Usuario nuevo introducido:", usuario);
        usuarios.push(usuario);
    }

    response.end();
});

router.get("/verusuarios", requireLogin, function (request, response) {
    response.render("verusuarios.ejs");
});

router.get("/login", function (request, response) {
    response.render("login", { error: null });
});

router.post("/login", function (request, response) {
    let { email, password } = request.body;

    //const usuarios = request.app.locals.usuarios;

    if (email)
        email = email.toLowerCase();

    /*const usuario = usuarios.find(u =>
        u.email === email && u.password === password
    );*/

    daoUsuario.verificarUsuario(email, password, function (error, usuario) {
        if (error) {
            response.status(500);
            return response.render("error.ejs", { numError: 500, mensaje: "Error interno de acceso a la base de datos" });
        }
        else if (usuario !== null) {
            request.session.user = usuario;
            response.redirect("/");
        }
        else {
            return response.render("login.ejs", { error: "Usuario o contraseña incorrectos" });
        }
    });
});

router.get("/logout", function (request, response) {
    request.session.destroy(function (error) {
        if (error) {
            response.status(500);
            return response.render("error.ejs", { numError: 500, error: "Error al cerrar la sesión" });
        }
        response.redirect("/");
    });
});

module.exports = router;
