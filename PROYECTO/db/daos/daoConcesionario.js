class DAOUsuario {
    constructor(pool) {
        this.pool = pool;
    }

    crearConcesionario(nombre, ciudad, dirección, teléfono_contacto, callback) {
        nombre = nombre.toUpperCase();
        this.verificarPorCorreo(email, (err, existeUsuario) => {
            if (err) {
                return callback(err);
            }
            if (existeUsuario) {
                console.log("ya existe el usuario DAO");
                return callback(null, -1);
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
                            return callback(null, result.insertId);
                        }
                    });
                });
            });
        });
    }
}