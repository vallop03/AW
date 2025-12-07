const express = require('express');
const router = express.Router();

router.get("/tema", function(request, response){
    const tema = request.session.tema || "claro";
    response.json({ tema });
});

router.post("/tema", (request, response) => {
    const { tema } = request.body;
    request.session.tema = tema;
    response.json({ mensaje: "Tema guardado en sesión" });
});

router.get("/fuente", function (request, response) {
    const fuente = request.session.fuente || "normal";
    response.json({ fuente });
});

router.post("/fuente", function(request, response){
    const { fuente } = request.body;
    request.session.fuente = fuente;
    response.json({ mensaje: "Tamaño de fuente guardado" });
});


module.exports = router;