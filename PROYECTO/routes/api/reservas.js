const express = require('express');
const router = express.Router();
const DAOReserva = require('../../db/daos/daoReserva');
const pool = require('../../db/connection');

const daoReserva = new DAOReserva(pool);

router.get("/idUsuario/:id", function (request, response) {
    console.log("ENTRO EN LA API")
    const id = request.params.id;
    daoReserva.consultarReservasPorUsuario(id, (err, rows) => {
        if (err) {
            return response.status(500).json({ error: "Error interno de acceso a la base de datos" });
        }
        response.json({ reservas: rows });
    });
});

router.get("/comprobarFechas", function (request, response) {
    const { idVehiculo, recogida, devolucion } = request.query;
    daoReserva.consultarFechas(idVehiculo, recogida, devolucion, function (err, reservado) {
        if (err) {
            return response.status(500).json({ error: "Error interno de acceso a la base de datos" });
        }
        response.json({ reservado: reservado });
    });
})

router.post("/reservar", function (request, response) {
    const { idVehiculo, idUsuario, recogida, devolucion } = request.body;
    daoReserva.reservar(idVehiculo, idUsuario, recogida, devolucion, function (err, reservado) {
        if (err) {
            return response.status(500).json({ error: "Error interno de acceso a la base de datos" });
        }
        response.json({ mensaje: "Reserva registrada correctamente" });
    });
})

router.put("/:estado/:id", function (request, response) {
    const idReserva = request.params.id;
    const estado = request.params.estado;
    daoReserva.cambiarEstado(idReserva, estado, function (err, result) {
        if (err) {
            return response.status(500).json({ error: "Error interno de acceso a la base de datos" });
        }
        if (result === 1) {
            return response.json({ mensaje: "Reserva actualizada correctamente" });
        }
        else {
            return response.status(404).json({ error: "Reserva no encontrado" });
        }
    })
})

module.exports = router;
