class DAOVehiculo {
    constructor(pool) {
        this.pool = pool;
    }

    consultarTodosVehiculos(callback) {
        this.pool.getConnection(function (err, conexion) {
            if (err) {
                return callback(err);
            }
            const consulta = "SELECT * FROM vehiculos WHERE activo = true";
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
        matricula = matricula.toLowerCase();
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
                const insertar = "INSERT INTO vehiculos (matricula, marca, modelo, ano_matriculacion, numero_plazas, autonomia_km, color, imagen, id_concesionario) VALUES (?, ?, ?, ?, ?, ?)";
                conexion.query(insertar, [nombre, email, hash, rol, telefono, id_concesionario], function (err, result) {
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

    verificarPorMatricula(email, callback) {
        this.pool.getConnection(function (err, conexion) {
            if (err) {
                return callback(err);
            }
            else {
                const consulta = "SELECT id_vehiculo, matricula, activo FROM vehiculos WHERE matricula = ?";
                email = email.toLowerCase();
                conexion.query(consulta, [email], function (err, rows) {
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
}