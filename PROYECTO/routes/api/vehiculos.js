const express = require('express');
const router = express.Router();
const DAOVehiculo = require('../../db/daos/daoVehiculo');
const pool = require('../../db/connection');
const path = require('path');
const multer = require("multer");
const multerFactory = multer({ dest: path.join(__dirname, "../../public/img/uploads") });

const daoVehiculo = new DAOVehiculo(pool);

router.get("/", function (request, response) {
    daoVehiculo.consultarTodosVehiculos((err, rows) => {
        if (err) {
            return response.status(500).json({ error: "Error interno de acceso a la base de datos" });
        }
        response.json({ vehiculos: rows });
    });
});

router.post("/crear", function (request, response) {
    multerFactory.single('imagen')(request, response, function (err) {
        if (err) {
            return response.status(500).json({ error: "Error procesando los datos" });
        }
        const { matricula, marca, modelo, ano, plazas, autonomia, color, concesionario } = request.body;

        const file = request.file;
        const ruta = "/img/uploads/" + file.filename;
        daoVehiculo.crearVehiculo(matricula, marca, modelo, ano, plazas, autonomia, color, ruta, concesionario, function (err, resultado) {
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
});

router.put("/editar/:id", function (request, response) {
    multerFactory.single('imagen')(request, response, function (err) {
        if (err) {
            return response.status(500).json({ error: "Error procesando los datos" });
        }
        const id = request.params.id;
        const { matricula, marca, modelo, ano, plazas, autonomia, color, concesionario, imagenAnterior } = request.body;
        const file = request.file;
        let ruta = "";
        if (file) {
            ruta = "/img/uploads/" + file.filename;
        }
        else {
            ruta = imagenAnterior;
        }
        daoVehiculo.editarVehiculo(id, matricula, marca, modelo, ano, plazas, autonomia, color, ruta, concesionario, function (err, resultado) {
            if (err) {
                return response.status(500).json({ error: "Error interno de acceso a la base de datos" });
            }
            if (resultado === 1) {
                return response.json({ mensaje: "Vehículo actualizado correctamente" });
            }
            else {
                return response.status(404).json({ error: "Vehículo no encontrado" });
            }

        });
    });
});

router.put("/borrar/:id", function (request, response) {
    const id = request.params.id;
    daoVehiculo.eliminarVehiculo(id, function (err, resultado) {
        if (err) {
            return response.status(500).json({ error: "Error interno de acceso a la base de datos" });
        }
        else if (resultado > 0) {
            response.json({ mensaje: "Vehículo eliminado correctamente" });
        } else {
            response.status(404).json({ error: "Vehículo no encontrado" });
        }
    });
});

router.post("/crearJSON", function (request, response) {
    const { matricula, marca, modelo, ano_matriculacion, numero_plazas, autonomia_km, color, imagen, id_concesionario } = request.body;
    if (!matricula || !marca || !modelo || !ano_matriculacion || !numero_plazas || !autonomia_km || !color || !imagen || !id_concesionario) {
        return response.status(500).json({ error: "Los campos no han sido rellenados adecuadamente" });
    }
    else {
        daoVehiculo.crearVehiculo(matricula, marca, modelo, ano_matriculacion, numero_plazas, autonomia_km, color, imagen, id_concesionario, function (err, resultado) {
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
    }
});

router.get("/matricula/:matricula", function (request, response) {
    const matricula = request.params.matricula;
    daoVehiculo.verificarPorMatricula(matricula, function (err, existeVehiculo) {
        if (err) {
            return response.status(500).json({ error: "Error interno de acceso a la base de datos" });
        }
        return response.json({ existeVehiculo: existeVehiculo });
    });
});

router.put("/editarJSON/:id", function (request, response) {
    const id = request.params.id;
    const { matricula, marca, modelo, ano_matriculacion, numero_plazas, autonomia_km, color, imagen, id_concesionario } = request.body;
    if (!matricula || !marca || !modelo || !ano_matriculacion || !numero_plazas || !autonomia_km || !color || !imagen || !id_concesionario) {
        return response.status(500).json({ error: "Error actualizando con JSON" });
    }
    else {
        daoVehiculo.editarVehiculo(id, matricula, marca, modelo, ano_matriculacion, numero_plazas, autonomia_km, color, imagen, id_concesionario, function (err, resultado) {
            if (err) {
                return response.status(500).json({ error: "Error interno de acceso a la base de datos" });
            }
            if (resultado === 1) {
                return response.json({ mensaje: "Vehículo actualizado correctamente" });
            }
            else {
                return response.status(404).json({ error: "Vehículo no encontrado" });
            }

        });
    }
});

router.get("/:id", function (request, response) {
    const id = request.params.id;
    daoVehiculo.consultarVehiculoPorId(id, function (err, vehiculo) {
        if (err) {
            return response.status(500).json({ error: "Error interno de acceso a la base de datos" });
        }
        if (!vehiculo) {
            return response.status(404).json({ error: "Vehiculo no encontrado" });
        }
        response.json({ vehiculo: vehiculo });
    });
});

router.get("/concesionario/:id", function (request, response) {
    const id = request.params.id;
    daoVehiculo.consultarVehiculosPorConcesionario(id, (err, rows) => {
        if (err) {
            return response.status(500).json({ error: "Error interno de acceso a la base de datos" });
        }
        response.json({ vehiculos: rows });
    });
});


module.exports = router;