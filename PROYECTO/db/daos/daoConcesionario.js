class DAOConcesionario {
    constructor(pool) {
        this.pool = pool;
    }

    crearConcesionario(nombre, ciudad, direccion, telefono, callback) {
        nombre = nombre.toUpperCase();
        this.pool.getConnection(function (err, conexion) {
            if (err) {
                return callback(err);
            }

            const insertar = "INSERT INTO concesionarios (nombre, ciudad, direccion, telefono_contacto) VALUES (?, ?, ?, ?)";
            conexion.query(insertar, [nombre, ciudad, direccion, telefono], function (err, result) {
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
                console.log(err);
                return callback(err);
            }
            const consulta = "SELECT * FROM concesionarios WHERE activo = true";
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
            const consulta = "SELECT * FROM concesionarios WHERE id_concesionario = ? AND activo = true";
            conexion.query(consulta, [id], function (err, rows) {
                conexion.release();
                if (err) {
                    callback(err);
                }
                return callback(null, rows[0] || null);
            });
        });
    }

    cambiarEstadoConcesionario(id, estado, callback) {
        this.pool.getConnection(function (err, conexion) {
            if (err) {
                return callback(err);
            }
            else {
                const consulta = "UPDATE concesionarios SET activo = ? WHERE id_concesionario = ?";
                conexion.query(consulta, [estado, id], function (err, result) {
                    conexion.release();
                    if (err) {
                        return callback(err);
                    }
                    else {
                        return callback(null, result);
                    }
                });
            }
        });
    }

    verificarPorId(id, callback) {
        this.pool.getConnection(function (err, conexion) {
            if (err) {
                return callback(err);
            }
            else {
                const consulta = "SELECT id_concesionario FROM concesionarios WHERE id_concesionario = ? AND activo = true";
                conexion.query(consulta, [id], function (err, rows) {
                    conexion.release();
                    if (err || rows == null) {
                        return callback(err);
                    }
                    else {
                        return callback(null, null || rows[0] );
                    }
                });
            }
        });
    }

    editarConcesionario(id, nombre, ciudad, direccion, telefono, callback) {
        this.pool.getConnection((err, conexion) => {
            if (err) {
                return callback(err);
            }

            this.verificarPorId(id, (err, existeConcesionario) => {
                if (err) {
                    return callback(err);
                }

                if(existeConcesionario){
                    const consulta = "UPDATE concesionarios SET nombre = ?, ciudad = ?, direccion = ?, telefono_contacto = ?, activo = true WHERE id_concesionario = ? ";
                    conexion.query(consulta, [nombre, ciudad, direccion, telefono, id], function (err, result) {
                        conexion.release();
                        if (err) {
                            return callback(err);
                        }
                        return callback(null, result.affectedRows);
                    })
                }
            });
        });
    }

    eliminarConcesionario(id, callback) {
        this.cambiarEstadoConcesionario(id, false, function (err, result) {
            if (err) {
                return callback(err);
            }
            return callback(null, result.affectedRows);
        })
    }
}

module.exports = DAOConcesionario;