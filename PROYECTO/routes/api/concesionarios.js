const express = require('express');
const router = express.Router();
const DAOConcesionario = require('../../db/daos/daoConcesionario');
const pool = require('../../db/connection');

const daoConcesionario = new DAOConcesionario(pool);

router.get("/", function (request, response) {
    daoConcesionario.consultarTodosConcesionarios((err, rows) => {
        if (err) {
            return response.status(500).json({ error: "Error interno de acceso a la base de datos" });
        }
        response.json({ concesionarios: rows });
    });
});

module.exports = router;