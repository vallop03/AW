class DAOUsuario {
    constructor(pool) {
        this.pool = pool;
    }

    verificarUsuario(email, password, callback) {
        this.pool.getConnection(function (err, conexion) {
            if (err) {
                callback(err);
            }
            else {
                const consulta = "SELECT id_usuario, nombre, rol FROM usuarios WHERE correo = ? AND contrasena = ?";
                conexion.query(consulta, [email, password], function (err, rows) {
                    conexion.release();
                    if (err) {
                        callback(err);
                    }
                    else {
                        callback(null, rows[0] || null);
                    }
                });
            }
        });
    }
}

module.exports = DAOUsuario;


