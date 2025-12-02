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

router.post("/crear", function (request, response) {
    const { nombre, correo, telefono, concesionario, rol, password } = request.body;
    daoUsuario.crearUsuario(nombre, correo, password, rol, telefono, concesionario, function (err, resultado) {
        if (err) {
            return response.status(500).json({ error: "Error interno de acceso a la base de datos" });
        }
        if (resultado === -1) {
            return response.status(500).json({ error: "Ya existe un usuario asociado a ese correo" });
        }
        else if (resultado > 0) {
            return response.json({ mensaje: "Usuario creado correctamente" });
        }
        else {
            return response.status(500).json({ error: "Error interno del servidor" });
        }
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
    const { nombre, correo, telefono, concesionario, rol } = request.body;
    daoUsuario.editarUsuario(id, nombre, correo, rol, telefono, concesionario, function (err, resultado) {
        if (err) {
            return response.status(500).json({ error: "Error interno de acceso a la base de datos" });
        }
        if (resultado === 1) {
            return response.json({ mensaje: "Usuario actualizado correctamente" });
        }
        else {
            return response.status(404).json({ error: "Usuario no encontrado" });
        }
    });
});

router.delete("/:id", function (request, response) {
    const id = request.params.id;
    daoUsuario.eliminarUsuario(id, function(err, resultado){
        if (err) {
            return response.status(500).json({ error: "Error interno de acceso a la base de datos" });
        }
        else if (resultado.affectedRows > 0) {
            response.json({ mensaje: "Usuario eliminado correctamente" });
        } else {
            response.status(404).json({ error: "Usuario no encontrado" });
        }
    });
});



module.exports = router;