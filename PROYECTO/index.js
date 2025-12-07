
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'ecomarket-exam',
    resave: false,
    saveUninitialized: false
}));

app.use(function (request, response, next) {
    response.locals.usuario = request.session.user || null;
    next();
});

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Simulated database (in-memory)
const usuarios = [
    { username: 'admin', password: 'admin', email:"admin", rol:"administrador" }
];
app.locals.usuarios = usuarios;

/*const productos = require('./data/productos.json');
const productosDetalle = require('./data/productos_detalle.json');
app.locals.productos = productos;
app.locals.productosDetalle = productosDetalle;*/

// Routes
const mainRoutes = require('./routes/index');
app.use('/', mainRoutes);

//APIS
const apiUsuarios = require("./routes/api/usuarios");
app.use("/api/usuarios", apiUsuarios);

const apiConcesionarios = require("./routes/api/concesionarios");
app.use("/api/concesionarios", apiConcesionarios);

const apiVehiculos = require("./routes/api/vehiculos");
app.use("/api/vehiculos", apiVehiculos);

const apiReservas = require("./routes/api/reservas");
app.use("/api/reservas", apiReservas);

const apiPreferencias = require("./routes/api/preferencias");
app.use("/api/preferencias", apiPreferencias);


// Server
app.listen(PORT, () => {
    console.log(`CarriCoche app running at http://localhost:${PORT}`);
});
