
const express = require('express');
const requireLogin = require('../middlewares/login');
const router = express.Router();

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

    const usuarios = request.app.locals.usuarios;

    if (email)
        email = email.toLowerCase();

    const usuario = usuarios.find(u =>
        u.email === email && u.password === password
    );

    if (!usuario) {
        return response.render("login.ejs", { error: "Usuario o contraseña incorrectos" });
    }

    request.session.user = usuario;

    response.redirect("/");
});


module.exports = router;
