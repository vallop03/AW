const bcrypt = require('bcrypt');

class DAOUsuario {
    constructor(pool) {
        this.pool = pool;
    }

    verificarPorCorreo(email, callback) {
        console.log("Estoy verificando el correo");
        this.pool.getConnection(function (err, conexion) {
            if (err) {
                console.log("explotó verificar el correo");

                return callback(err);
            }
            else {
                const consulta = "SELECT correo FROM usuarios WHERE correo = ?";
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

    crearUsuario(nombre, email, password, rol, telefono, id_concesionario, callback) {
        console.log("estoy en el DAO");
        email = email.toLowerCase();
        this.verificarPorCorreo(email, (err, existeUsuario) => {
            if (err) {
                return callback(err);
            }
            if (existeUsuario) {
                return callback(null, 0);
            }
            this.pool.getConnection(function (err, conexion) {
                if (err) {
                    return callback(err);
                }
                console.log("He llegado al hash");

                const saltRounds = 10;
                bcrypt.hash(password, saltRounds, (err, hash) => {
                    if (err) {
                        console.log("ha explotado el hash");
                        conexion.release();
                        return callback(err);
                    };
                    const insertar = "INSERT INTO usuarios (nombre, correo, contrasena, rol, telefono, id_concesionario) VALUES (?, ?, ?, ?, ?, ?)";
                    conexion.query(insertar, [nombre, email, hash, rol, telefono, id_concesionario], function (err, result) {
                        conexion.release();
                        if (err) {
                            console.log("ha explotado la insercion", err);

                            return callback(err);
                        }
                        else {
                            return callback(null, result.insertId);
                        }
                    });
                });
            });
        });
    }

    verificarUsuario(email, password, callback) {
        this.pool.getConnection(function (err, conexion) {
            if (err) {
                callback(err);
            }
            else {
                email = email.toLowerCase();
                const consulta = "SELECT id_usuario, nombre, rol, contrasena FROM usuarios WHERE correo = ?";
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
}

module.exports = DAOUsuario;


