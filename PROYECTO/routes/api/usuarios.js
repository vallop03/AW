const express = require('express');
const router = express.Router();
const DAOUsuario = require('../../db/daos/daoUsuario');
const pool = require('../../db/connection');

const daoUsuario = new DAOUsuario(pool);

router.get("/", function (request, response) {
    daoUsuario.consultarTodosUsuarios((err, rows) => {
        if (err) {
            return response.status(500).json({ error: "Error interno de acceso a la base de datos" });
        }
        response.json({ usuarios: rows });
    });
});

router.get("/:id", function (request, response) {
    const id = request.params.id;
    daoUsuario.consultarUsuarioPorId(id, function (err, usuario) {
        if (err) {
            return response.status(500).json({ error: "Error interno de acceso a la base de datos" });
        }
        if (!usuario) {
            return response.status(404).json({ error: "Usuario no encontrado" });
        }
        response.json({ usuario: usuario });
    });
});

router.put("/:id", function (request, response) {
    const id = request.params.id;
    const { nombre, correo, telefono, concesionario, rol } = req.body;
    daoUsuario.editarUsuario(id, nombre, correo, rol, telefono, concesionario, function (err, resultado) {
        if (err) {
            return response.status(500).json({ error: "Error interno de acceso a la base de datos" });
        }
        if (resultado === 1) {
            response.json({ mensaje: "Usuario actualizado" });
        }
        else {
            return response.status(404).json({ error: "Usuario no encontrado" });
        }
    });
});



module.exports = router;