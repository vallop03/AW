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

router.post("/crear", function (request, response) {
    const { nombre, ciudad, direccion, telefono} = request.body;
    daoConcesionario.crearConcesionario(nombre, ciudad, direccion, telefono, function (err, resultado) {
        if (err) {
            return response.status(500).json({ error: "Error interno de acceso a la base de datos" });
        }
        if (resultado & resultado > 0) {
            return response.json({ mensaje: "Concesionario creado correctamente" });
        } 
        else {
            return response.status(500).json({ error: "Error interno del servidor" });
        }
    });
});

router.get("/:id", function (request, response) {
    const id = request.params.id;
    daoConcesionario.consultarConcesionarioPorId(id, function (err, concesionario) {
        if (err) {
            return response.status(500).json({ error: "Error interno de acceso a la base de datos" });
        }
        if (!concesionario) {
            return response.status(404).json({ error: "Concesionario no encontrado" });
        }
        response.json({ concesionario: concesionario });
    });
});

router.put("/editar/:id", function (request, response) {
    const id = request.params.id;
    const {nombre, ciudad, direccion, telefono} = request.body;
    daoConcesionario.editarConcesionario(id, nombre, ciudad, direccion, telefono, function (err, resultado) {
        if (err) {
            return response.status(500).json({ error: "Error interno de acceso a la base de datos" });
        }
        if (resultado === 1) {
            return response.json({ mensaje: "Concesionario actualizado correctamente" });
        }
        else {
            return response.status(404).json({ error: "Concesionario no encontrado" });
        }
    });
});

router.put("/borrar/:id", function (request, response) {
    const id = request.params.id;
    daoConcesionario.eliminarConcesionario(id, function(err, resultado){
        if (err) {
            return response.status(500).json({ error: "Error interno de acceso a la base de datos" });
        }
        else if (resultado > 0) {
            response.json({ mensaje: "Concesionario eliminado correctamente" });
        } else {
            response.status(404).json({ error: "Concesionario no encontrado" });
        }
    });
});

module.exports = router;