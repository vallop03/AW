
const express = require('express');
const router = express.Router();

const usuarios = [];

router.get("/", function (request, response) {
    response.render("index.ejs");
});

router.get("/reservas", function (request, response) {
    response.render("reservas.ejs");
});

router.get("/registro", function (request, response) {
    response.render("registroUsuario.ejs");
});

router.post("/registro", function (request, response) {
    const usuario = {
        nombre: request.body.nombre,
        email: request.body.email,
        password: request.body.password
    }

    if (usuarios.includes(email))
        console.log("Usuario con email repetido");
    else
        console.log("Usuario nuevo introducido:", usuario);

    usuarios.push(usuario);
    response.end();
});

router.get("/verusuarios", function (request, response) {
    console.log(usuarios);
    response.render("verusuarios.ejs", { usuarios });
});

router.get("/login", function (reques, response) {
    response.render("login");
});


module.exports = router;
