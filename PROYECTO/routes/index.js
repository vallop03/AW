
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

router.get("/registroUsuario", function (request, response) {
    response.render("registroUsuario.ejs");
});

router.post("/registroUsuario", function (request, response) {
    
    daoUsuario.crearUsuario(request.body.nombre, request.body.email, request.body.password, request.body.rol, request.body.telefono, request.body.concesionario, function (error, id) {
        if (error) {
            response.status(500);
            return response.render("error.ejs", { numError: 500, mensaje: "Error interno de acceso a la base de datos" });
        }
        else if (id > 0) {
            response.redirect("/");
        }
        else {
            response.render("registroUsuario.ejs");
        }
    });
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
