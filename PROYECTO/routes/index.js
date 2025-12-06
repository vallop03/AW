
const express = require('express');
const router = express.Router();
const requireLogin = require('../middlewares/login');
const isAdmin = require('../middlewares/isAdmin');
const DAOUsuario = require('../db/daos/daoUsuario');
const pool = require('../db/connection');

const daoUsuario = new DAOUsuario(pool);

router.get("/", function (request, response) {
    response.render("index");
});

router.get("/reservas", function (request, response) {
    response.render("reservas");
});

router.get("/vehiculos", requireLogin, function(request, response){
    response.render("vehiculos");
});

router.get("/usuarios", isAdmin, function (request, response) {
    response.render("usuarios");
});

router.get("/login", function (request, response) {
    if (request.session.user) {
        return response.redirect("/");
    }
    response.render("login", { error: null });
});

router.post("/login", function (request, response) {
    let { email, password } = request.body;
    daoUsuario.verificarUsuario(email, password, function (error, usuario) {
        if (error) {
            response.status(500);
            return response.render("error", { numError: 500, mensaje: "Error interno de acceso a la base de datos" });
        }
        else if (usuario !== null) {
            request.session.user = usuario;
            response.redirect("/");
        }
        else {
            return response.render("login", { error: "Usuario o contraseña incorrectos" });
        }
    });
});

router.get("/logout", function (request, response) {
    request.session.destroy(function (error) {
        if (error) {
            response.status(500);
            return response.render("error", { numError: 500, error: "Error al cerrar la sesión" });
        }
        response.redirect("/");
    });
});

module.exports = router;
