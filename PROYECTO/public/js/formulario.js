document.addEventListener("DOMContentLoaded", function () {

    const nombre = document.getElementById("nombre");
    const apellidos = document.getElementById("apellidos");
    const recogida = document.getElementById("recogida");
    const devolucion = document.getElementById("devolucion");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const telefono = document.getElementById("tel");
    const vehiculo = document.getElementById("vehiculo");
    const terminos = document.getElementById("terminos");
    const resetBtn = document.getElementById("resetBtn");
    const form = document.getElementById("reservaForm");
    form.addEventListener('submit', function (event) {
        let valido = comprobarNombre(nombre);
        valido = comprobarNombre(apellidos) && valido;
        valido = comprobarRecogida(recogida) && valido;
        valido = comprobarDevolucion(devolucion) && valido;
        valido = comprobarValidacion(email) && valido;
        valido = comprobarValidacion(password) && valido;
        valido = comprobarValidacion(telefono) && valido;
        valido = comprobarValidacion(vehiculo) && valido;
        valido = comprobarValidacion(terminos) && valido;
        if (!valido) {
            event.preventDefault();
            event.stopPropagation();
        }
    });

    nombre.addEventListener("input", function () {
        comprobarNombre(nombre);
    });

    apellidos.addEventListener("input", function () {
        comprobarNombre(apellidos);
    });

    email.addEventListener("input", function () {
        comprobarValidacion(email);
    });

    password.addEventListener("input", function () {
        comprobarValidacion(password);
    });

    telefono.addEventListener("input", function () {
        comprobarValidacion(telefono);
    });

    vehiculo.addEventListener("input", function () {
        comprobarValidacion(vehiculo);
    });

    recogida.addEventListener("input", function () {
        comprobarRecogida(recogida);
    });

    devolucion.addEventListener("input", function () {
        comprobarDevolucion(devolucion);
    });

    terminos.addEventListener("change", function () {
        comprobarValidacion(terminos);
    });

    resetBtn.addEventListener("click", function () {
        const form = document.getElementById("reservaForm");
        form.querySelectorAll(".is-valid, .is-invalid").forEach(elemento => {
            elemento.classList.remove("is-valid", "is-invalid");
        });
    });

    document.querySelectorAll("input, select").forEach(campo => {
        campo.addEventListener("focus", function () {
            campo.classList.remove("is-valid", "is-invalid");
        });
    });
    
    function comprobarNombre(input) {
        const valor = input.value.trim();
        let valido = valor.length >= 3;
        if (valido) {
            input.classList.add('is-valid');
            input.classList.remove('is-invalid');
        } else {
            input.classList.add('is-invalid');
            input.classList.remove('is-valid');
        }
        return valido;
    }

    function comprobarRecogida(input) {
        const fechaSeleccionada = new Date(input.value);
        const fechaActual = new Date();
        fechaActual.setHours(0, 0, 0, 0);
        if (fechaSeleccionada >= fechaActual) {
            input.classList.add('is-valid');
            input.classList.remove('is-invalid');
        }
        else {
            input.classList.add('is-invalid');
            input.classList.remove('is-valid');
        }
    }

    function comprobarDevolucion(input) {
        const fechaRecogida = new Date(recogida.value);
        const fechaDevolucion = new Date(input.value);
        if (fechaDevolucion > fechaRecogida) {
            input.classList.add('is-valid');
            input.classList.remove('is-invalid');
        }
        else {
            input.classList.add('is-invalid');
            input.classList.remove('is-valid');
        }
    }

    function comprobarValidacion(input) {
        if (input.checkValidity()) {
            input.classList.add('is-valid');
            input.classList.remove('is-invalid');
        } else {
            input.classList.add('is-invalid');
            input.classList.remove('is-valid');
        }
    }


});
