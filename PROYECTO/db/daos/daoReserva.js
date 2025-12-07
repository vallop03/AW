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
            const insercion = "INSERT INTO reservas (id_usuario, id_vehiculo, fecha_inicio, fecha_fin) VALUES (?, ?, ?, ?)"
            conexion.query(insercion, [idUsuario, idVehiculo, recogida, devolucion], function (err, result) {
                conexion.release();
                if (err) {
                    console.log("error en la bd: ");
                    console.log(err);
                    return callback(err);
                }
                else {
                    return callback(null, result.insertId);
                }
            });
        });
    }
}

module.exports = DAOReserva;