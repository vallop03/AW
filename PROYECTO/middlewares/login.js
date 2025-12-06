function requireLogin(request, response, next) {
    if (!request.session.user) {
        return response.redirect("/login");
    }
    next();
}

module.exports = requireLogin;