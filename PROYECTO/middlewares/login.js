function requireLogin(request, response, next) {
    if (!request.session.user) {
        return response.redirect("login.ejs", {error: null});
    }
    next();
}

module.exports = requireLogin;