const bcrypt = require('bcrypt');

class DAOUsuario {
    constructor(pool) {
        this.pool = pool;
    }

    verificarPorCorreo(email, callback) {
        this.pool.getConnection(function (err, conexion) {
            if (err) {
                return callback(err);
            }
            else {
                const consulta = "SELECT id_usuario, correo, activo FROM usuarios WHERE correo = ?";
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

    cambiarEstadoUsuario(id, estado, callback) {
        this.pool.getConnection(function (err, conexion) {
            if (err) {
                return callback(err);
            }
            else {
                const consulta = "UPDATE usuarios SET activo = ? WHERE id_usuario = ?";
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

    crearUsuario(nombre, email, password, rol, telefono, id_concesionario, callback) {
        email = email.toLowerCase();
        let resultado = {
            estado: 0, //para indicar que hay un error
            id_inactivo: 0 //para saber si hay que reactivar un usuario
        };
        this.verificarPorCorreo(email, (err, existeUsuario) => {
            if (err) {
                return callback(err);
            }
            if (existeUsuario) {
                resultado.estado = -1;

                if (existeUsuario.activo) {
                    return callback(null, resultado);
                }
                else {
                    resultado.id_inactivo = existeUsuario.id_usuario;
                    return callback(null, resultado)
                }
            }
            this.pool.getConnection(function (err, conexion) {
                if (err) {
                    return callback(err);
                }
                const saltRounds = 10;
                bcrypt.hash(password, saltRounds, (err, hash) => {
                    if (err) {
                        conexion.release();
                        return callback(err);
                    };
                    const insertar = "INSERT INTO usuarios (nombre, correo, contrasena, rol, telefono, id_concesionario) VALUES (?, ?, ?, ?, ?, ?)";
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
        });
    }

    verificarUsuario(email, password, callback) {
        this.pool.getConnection(function (err, conexion) {
            if (err) {
                return callback(err);
            }
            else {
                email = email.toLowerCase();
                const consulta = "SELECT u.*, c.nombre AS concesionario FROM usuarios u JOIN concesionarios c ON c.id_concesionario = u.id_concesionario WHERE u.correo = ? AND u.activo = true";
                conexion.query(consulta, [email], function (err, rows) {
                    conexion.release();
                    if (err) {
                        return callback(err);
                    }

                    const usuario = rows[0];
                    if (!usuario) {
                        return callback(null, null);
                    }

                    bcrypt.compare(password, usuario.contrasena, function (err, correctPassword) {
                        if (err) {
                            return callback(err);
                        }
                        if (correctPassword) {
                            delete usuario.contrasena;
                            return callback(null, usuario)
                        }
                        else {
                            return callback(null, null);
                        }
                    });
                });
            }
        });
    }

    consultarTodosUsuarios(callback) {
        this.pool.getConnection(function (err, conexion) {
            if (err) {
                return callback(err);
            }
            const consulta = "SELECT u.*, c.nombre AS concesionario, c.ciudad AS ciudad FROM usuarios u JOIN concesionarios c ON u.id_concesionario = c.id_concesionario WHERE u.activo = true";
            conexion.query(consulta, [], function (err, rows) {
                conexion.release();
                if (err) {
                    return callback(err);
                }

                return callback(null, rows);
            });
        });
    }

    consultarUsuarioPorId(id, callback) {
        this.pool.getConnection(function (err, conexion) {
            if (err) {
                return callback(err);
            }
            const consulta = "SELECT u.*, c.nombre AS concesionario, c.ciudad AS ciudad FROM usuarios u JOIN concesionarios c ON u.id_concesionario = c.id_concesionario WHERE u.id_usuario = ? AND u.activo = true";
            conexion.query(consulta, [id], function (err, rows) {
                conexion.release();
                if (err) {
                    return callback(err);
                }
                return callback(null, rows[0] || null);
            });
        });
    }

    editarUsuario(id, nombre, correo, rol, telefono, id_concesionario, callback) {
        this.pool.getConnection((err, conexion) => {
            if (err) {
                return callback(err);
            }

            this.verificarPorCorreo(correo, (err, existeUsuario) => {
                if (err) {
                    return callback(err);
                }

                if (existeUsuario && existeUsuario.id_usuario != id) {
                    return callback(null, -1);
                }

                const consulta = "UPDATE usuarios SET nombre = ?, correo = ?, rol = ?, telefono = ?, id_concesionario = ?, activo = true WHERE id_usuario = ? ";
                conexion.query(consulta, [nombre, correo, rol, telefono, id_concesionario, id], function (err, result) {
                    conexion.release();
                    if (err) {
                        return callback(err);
                    }
                    return callback(null, result.affectedRows);
                });
            });
        });
    }

    eliminarUsuario(id, callback) {
        this.cambiarEstadoUsuario(id, false, function (err, result) {
            if (err) {
                return callback(err);
            }
            return callback(null, result.affectedRows);
        })
    }
}

module.exports = DAOUsuario;


