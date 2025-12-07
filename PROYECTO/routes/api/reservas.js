const express = require('express');
const router = express.Router();
const DAOReserva = require('../../db/daos/daoReserva');
const pool = require('../../db/connection');

const daoReserva = new DAOReserva(pool);

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
            console.log(err);
            return response.status(500).json({ error: "Error interno de acceso a la base de datos" });
        }
        response.json({ mensaje: "Reserva registrada correctamente" });
    });
})

module.exports = router;
