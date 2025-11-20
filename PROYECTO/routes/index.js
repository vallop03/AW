
const express = require('express');
const router = express.Router();

router.get("/", function(request, response){
    response.status(200);
    response.render("index.ejs");
});

router.get("/reservas", function(request, response){
    response.status(200);
    response.render("reservas.ejs");
});

router.get("/registro", function(request, response){
    response.status(200);
    response.render("registroUsuario.ejs");
});

module.exports = router;
