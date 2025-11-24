function isAdmin(request, response, next) {
    if (!request.session.user) {
        return response.render("login.ejs", {error: null});
    } else if(request.session.user && request.session.user.rol !== "admin"){
        return response.status(401).render("error", {
            mensaje: "Debes ser admin para acceder a esta página",
            numError: 401
        });
    }
    next();
}

module.exports = isAdmin;