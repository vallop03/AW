
const express = require('express');
const router = express.Router();

const usuarios = [];

router.get("/", function (request, response) {
    response.render("index.ejs", {usuario: null});
});

router.get("/reservas", function (request, response) {
    response.render("reservas.ejs");
});

router.get("/registro", function (request, response) {
    response.render("registroUsuario.ejs", {usuario: null});
});

router.post("/registro", function (request, response) {
    const usuario = {
        nombre: request.body.nombre,
        email: request.body.email,
        password: request.body.password
    }

    if (usuarios.some(v => v.email === request.body.email))
        console.log("Usuario con email repetido");
    else {
        console.log("Usuario nuevo introducido:", usuario);
        usuarios.push(usuario);
    }

    response.end();
});

router.get("/verusuarios", function (request, response) {
    response.render("verusuarios.ejs", { usuarios });
});

router.get("/login", function (reques, response) {
    response.render("login", {error: null});
});

router.post("/login", function (request, response) {
    const { email, password } = request.body;

    const usuario = usuarios.find(u =>
        u.email === email && u.password === password
    );

    if (!usuario) {
        return response.render("login.ejs", { error: "Usuario o contraseña incorrectos" });
    }

    request.session.user = usuario;

    response.render("index.ejs", {usuario: usuario});
});


module.exports = router;
