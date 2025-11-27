
const express = require('express');
const requireLogin = require('../middlewares/login');
const isAdmin = require('../middlewares/isAdmin');
const DAOUsuario = require('../db/daos/daoUsuario');
const pool = require('../db/connection');
const router = express.Router();

const daoUsuario = new DAOUsuario(pool);

router.get("/", function (request, response) {
    response.render("index");
});

router.get("/reservas", function (request, response) {
    response.render("reservas");
});

router.get("/registroUsuario", function (request, response) {
    response.render("registroUsuario", {mensaje: null});
});

router.post("/registroUsuario", function (request, response) {
    if(request.body.nombre === '' && request.body.email && request.body.email && request.body.password && request.body.rol && request.body.telefono && request.body.concesionario){
        daoUsuario.crearUsuario(request.body.nombre, request.body.email, request.body.password, request.body.rol, request.body.telefono, request.body.concesionario, function (error, id) {
            if (error) {
                response.status(500);
                return response.render("error", { numError: 500, mensaje: "Error interno de acceso a la base de datos" });
            }
            else if (id > 0) {
                response.render("registroUsuario", {mensaje: "El usuario se ha registrado correctamente"});
            }
            else if (id === -1){
                console.log("ya existe el usuario");
                response.render("registroUsuario", {mensaje: "Ya existe un usuario asociado a ese correo"});
            }
            else{
                response.render("registroUsuario", {mensaje: "No ha sido posible registrar al usuario"});
            }
        });
    }
    else{
        response.render("registroUsuario", {mensaje: "No ha sido posible registrar al usuario"});
    }
});

router.get("/verusuarios", requireLogin, function (request, response) {
    response.render("verusuarios");
});

router.get("/usuarios", function (request, response) {
    daoUsuario.consultarTodosUsuarios(function(err, usuarios){
        if(err){
            response.status(500);
            return response.render("error", { numError: 500, mensaje: "Error interno de acceso a la base de datos" });
        }
        
        response.render("usuarios", {usuarios: usuarios});
    });
});

router.get("/login", function (request, response) {
    if (request.session.user) {
        return res.redirect("/");
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
