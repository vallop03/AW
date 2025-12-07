class DAOVehiculo {

    constructor(pool) {
        this.pool = pool;
    }

    consultarTodosVehiculos(callback) {
        this.pool.getConnection(function (err, conexion) {
            if (err) {
                return callback(err);
            }
            const consulta = "SELECT v.*, c.nombre AS concesionario FROM vehiculos v JOIN concesionarios c ON v.id_concesionario = c.id_concesionario WHERE v.activo = true";
            conexion.query(consulta, [], function (err, rows) {
                conexion.release();
                if (err) {
                    return callback(err);
                }
                return callback(null, rows);
            });
        });
    }

    crearVehiculo(matricula, marca, modelo, ano, plazas, autonomia, color, ruta, concesionario, callback) {
        matricula = matricula.toUpperCase();
        let resultado = {
            estado: 0,
            id_inactivo: 0
        };
        this.verificarPorMatricula(matricula, (err, existeVehiculo) => {
            if (err) {

                return callback(err);
            }
            if (existeVehiculo) {
                resultado.estado = -1;
                if (existeVehiculo.activo) {
                    return callback(null, resultado);
                }
                else {
                    resultado.id_inactivo = existeVehiculo.id_vehiculo;
                    return callback(null, resultado)
                }
            }
            this.pool.getConnection(function (err, conexion) {
                if (err) {
                    return callback(err);
                }
                const insertar = "INSERT INTO vehiculos (matricula, marca, modelo, ano_matriculacion, numero_plazas, autonomia_km, color, imagen, id_concesionario) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
                conexion.query(insertar, [matricula, marca, modelo, ano, plazas, autonomia, color, ruta, concesionario], function (err, result) {
                    conexion.release();
                    if (err) {
                        return callback(err);
                    }
                    else {
                        resultado.estado = result.insertId
                        return callback(null, resultado);
                    }
                });
            });
        });
    }

    editarVehiculo(id, matricula, marca, modelo, ano, plazas, autonomia, color, ruta, concesionario, callback) {
        this.pool.getConnection((err, conexion) => {
            if (err) {
                return callback(err);
            }
            matricula = matricula.toUpperCase();
            this.verificarPorMatricula(matricula, (err, existeVehiculo) => {
                if (err) {
                    return callback(err);
                }

                if (existeVehiculo && existeVehiculo.id_vehiculo != id) {
                    return callback(null, -1);
                }
                const consulta = "UPDATE vehiculos SET matricula = ?, marca = ?, modelo = ?, ano_matriculacion = ?, numero_plazas = ?, autonomia_km = ?, color = ?, imagen = ?, id_concesionario = ?, activo = true WHERE id_vehiculo = ? ";
                conexion.query(consulta, [matricula, marca, modelo, ano, plazas, autonomia, color, ruta, concesionario, id], function (err, result) {
                    conexion.release();
                    if (err) {
                        return callback(err);
                    }
                    return callback(null, result.affectedRows);
                });
            });
        });
    }

    eliminarVehiculo(id, callback){
        this.pool.getConnection(function (err, conexion) {
            if (err) {
                return callback(err);
            }
            else {
                const consulta = "UPDATE vehiculos SET activo = false WHERE id_vehiculo = ?";
                conexion.query(consulta, [id], function (err, result) {
                    conexion.release();
                    if (err) {
                        return callback(err);
                    }
                    else {
                        return callback(null, result.affectedRows);
                    }
                });
            }
        });
    }

    consultarVehiculoPorId(id, callback) {
        this.pool.getConnection(function (err, conexion) {
            if (err) {
                return callback(err);
            }
            const consulta = "SELECT v.*, c.nombre AS concesionario FROM vehiculos v JOIN concesionarios c ON v.id_concesionario = c.id_concesionario WHERE v.id_vehiculo = ? AND v.activo = true";
            conexion.query(consulta, [id], function (err, rows) {
                conexion.release();
                if (err) {
                    return callback(err);
                }
                return callback(null, rows[0] || null);
            });
        });
    }

    verificarPorMatricula(matricula, callback) {
        this.pool.getConnection(function (err, conexion) {
            if (err) {
                return callback(err);
            }
            else {
                const consulta = "SELECT id_vehiculo, matricula, activo FROM vehiculos WHERE matricula = ?";
                matricula = matricula.toUpperCase();
                conexion.query(consulta, [matricula], function (err, rows) {
                    conexion.release();
                    if (err) {
                        return callback(err);
                    }
                    else {
                        return callback(null, rows[0] || null);
                    }
                });
            }
        });
    }

    consultarVehiculosPorConcesionario(id, callback) {
        this.pool.getConnection(function (err, conexion) {
            if (err) {
                return callback(err);
            }
            else {
                const consulta = "SELECT v.*, c.nombre AS concesionario FROM vehiculos v JOIN concesionarios c ON c.id_concesionario = v.id_concesionario WHERE v.id_concesionario = ? AND v.activo = true";
                conexion.query(consulta, [id], function (err, rows) {
                    conexion.release();
                    if (err) {
                        console.log(err);
                        return callback(err);
                    }
                    else {
                        return callback(null, rows);
                    }
                });
            }
        });
    }
}

module.exports = DAOVehiculo;
