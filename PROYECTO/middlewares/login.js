function requireLogin(req, res, next) {
    if (!req.session.user) {
        return res.status(401).render("error", {
            mensaje: "Debes iniciar sesión para acceder a esta página",
            numError: 401
        });
    }
    next();
}

module.exports = requireLogin;