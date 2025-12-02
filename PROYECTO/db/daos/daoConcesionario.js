class DAOConcesionario {
    constructor(pool) {
        this.pool = pool;
    }

    crearConcesionario(nombre, ciudad, dirección, teléfono_contacto, callback) {
        nombre = nombre.toUpperCase();
        this.pool.getConnection(function (err, conexion) {
            if (err) {
                return callback(err);
            }

            const insertar = "INSERT INTO concesionarios (nombre, ciudad, dirección, teléfono_contacto) VALUES (?, ?, ?, ?)";
            conexion.query(insertar, [nombre, ciudad, dirección, teléfono_contacto], function (err, result) {
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

    consultarTodosConcesionarios(callback) {
        this.pool.getConnection(function (err, conexion) {
            if (err) {
                return callback(err);
            }
            const consulta = "SELECT * FROM concesionarios";
            conexion.query(consulta, [], function (err, rows) {
                conexion.release();
                if (err) {
                    return callback(err);
                }
                return callback(null, rows);
            });
        });
    }

    consultarConcesionarioPorId(id, callback){
        this.pool.getConnection(function (err, conexion) {
            if (err) {
                return callback(err);
            }
            const consulta = "SELECT * FROM concesionarios WHERE id_concesionario = ?";
            conexion.query(consulta, [id], function (err, rows) {
                conexion.release();
                if (err) {
                    callback(err);
                }
                return callback(null, rows[0] || null);
            });
        });
    }
}

module.exports = DAOConcesionario;