const express = require('express');
const router = express.Router();
const DAOVehiculo = require('../../db/daos/daoVehiculo');
const pool = require('../../db/connection');
const path = require('path');
const multer = require("multer");
const multerFactory = multer({ dest: path.join(__dirname, "../../public/img/uploads")});

const daoVehiculo = new DAOVehiculo(pool);

router.get("/", function (request, response) {
    daoVehiculo.consultarTodosVehiculos((err, rows) => {
        if (err) {
            return response.status(500).json({ error: "Error interno de acceso a la base de datos" });
        }
        response.json({ vehiculos: rows });
    });
});

router.post("/crear", multerFactory.single('imagen'), function (request, response) {
    const { matricula, marca, modelo, ano, plazas, autonomia, color, concesionario } = request.body;
    const file = request.file;
    const ruta = "/uploads/" + file.filename;

    daoVehiculo.crearVehiculo(matricula, marca, modelo, ano, plazas, autonomia, color, ruta, concesionario, function(err, resultado){
        if (err) {
            return response.status(500).json({ error: "Error interno de acceso a la base de datos" });
        }
        if (resultado.estado === -1) {
            return response.json({ mensaje: "Ya existe un vehículo asociado a esa matrícula", id: resultado.id_inactivo });
        }
        else if (resultado.estado > 0) {
            return response.json({ mensaje: "Vehículo creado correctamente" });
        }
        else {
            return response.status(500).json({ error: "Error interno del servidor" });
        }
    });
});