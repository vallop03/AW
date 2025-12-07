class DAOReserva {
    constructor(pool) {
        this.pool = pool;
    }

    consultarFechas(idVehiculo, recogida, devolucion, callback) {
        this.pool.getConnection(function (err, conexion) {
            if (err) {
                return callback(err);
            }
            else {
                const consulta = "SELECT * FROM reservas WHERE id_vehiculo = ? AND fecha_inicio < ? AND fecha_fin > ? AND estado = 'activa' ";
                conexion.query(consulta, [idVehiculo, devolucion, recogida], function (err, rows) {
                    conexion.release();
                    if (err) {
                        return callback(err);
                    }
                    else {
                        return callback(null, rows.length > 0);
                    }
                });
            }
        });
    }

    reservar(idVehiculo, idUsuario, recogida, devolucion, callback) {
        this.pool.getConnection(function (err, conexion) {
            if (err) {
                return callback(err);
            }
            const insercion = "INSERT INTO reservas (id_usuario, id_vehiculo, fecha_inicio, fecha_fin) VALUES (?, ?, ?, ?)";
            conexion.query(insercion, [idUsuario, idVehiculo, recogida, devolucion], function (err, result) {
                conexion.release();
                if (err) {
                    return callback(err);
                }
                else {
                    return callback(null, result.insertId);
                }
            });
        });
    }

    consultarReservasPorUsuario(idUsuario, callback) {
        this.pool.getConnection(function (err, conexion) {
            if (err) {
                return callback(err);
            }
            const consulta = "SELECT r.*, v.matricula FROM reservas r JOIN vehiculos v ON v.id_vehiculo = r.id_vehiculo WHERE r.id_usuario = ?";
            conexion.query(consulta, [idUsuario], function (err, rows) {
                conexion.release();
                if (err) {
                    return callback(err);
                }
                else {
                    return callback(null, rows);
                }
            });
        });
    }

    cambiarEstado(idReserva, estado, callback) {
        this.pool.getConnection(function (err, conexion) {
            if (err) {
                return callback(err);
            }
            const modificar = "UPDATE reservas SET estado = ? WHERE id_reserva = ?";
            conexion.query(modificar, [estado, idReserva], function (err, result) {
                conexion.release();
                if (err) {
                    return callback(err);
                }
                else {
                    return callback(null, result.affectedRows);
                }
            });
        });
    }
}

module.exports = DAOReserva;