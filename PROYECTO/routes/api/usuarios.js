const express = require('express');
const router = express.Router();
const DAOUsuario = require('../../db/daos/daoUsuario');
const pool = require('../../db/connection');

const daoUsuario = new DAOUsuario(pool);

router.get("/", function (request, response) {
    daoUsuario.consultarTodosUsuarios((err, rows) => {
        if (err){
            return response.status(500).json({ error: "Error interno de acceso a la base de datos" });
        }
        response.json({ usuarios: rows });
    });
});

router.get("/", function (request, response) {
    daoUsuario.consultarTodosUsuarios((err, rows) => {
        if (err){
            return response.status(500).json({ error: "Error interno de acceso a la base de datos" });
        }
        response.json({ usuarios: rows });
    });
});

router.get("/:id", function (request, response) {
    const id = request.params.id;
    daoUsuario.consultarUsuarioPorId(id, function (err, usuario) {
        if (err){
            return response.status(500).json({ error: "Error interno de acceso a la base de datos" });
        }
        if (!usuario) {
            return response.status(404).json({ error: "Usuario no encontrado" });
        }
        response.json({usuario: usuario});
    });

});

module.exports = router;