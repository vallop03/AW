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
        actualizarBarraProgreso();
    });

    nombre.addEventListener("input", function () {
        comprobarNombre(nombre);
        actualizarBarraProgreso();

    });

    apellidos.addEventListener("input", function () {
        comprobarNombre(apellidos);
        actualizarBarraProgreso();

    });

    email.addEventListener("input", function () {
        comprobarValidacion(email);
        actualizarBarraProgreso();

    });

    password.addEventListener("input", function () {
        comprobarValidacion(password);
        actualizarBarraProgreso();

    });

    telefono.addEventListener("input", function () {
        comprobarValidacion(telefono);
        actualizarBarraProgreso();

    });

    vehiculo.addEventListener("change", function () {
        comprobarValidacion(vehiculo);
        actualizarBarraProgreso();

    });

    recogida.addEventListener("input", function () {
        comprobarRecogida(recogida);
        actualizarBarraProgreso();

    });

    devolucion.addEventListener("input", function () {
        comprobarDevolucion(devolucion);
        actualizarBarraProgreso();

    });

    terminos.addEventListener("change", function () {
        comprobarValidacion(terminos);
        actualizarBarraProgreso();

    });

    resetBtn.addEventListener("click", function () {
        const form = document.getElementById("reservaForm");
        form.querySelectorAll(".is-valid, .is-invalid").forEach(elemento => {
            elemento.classList.remove("is-valid", "is-invalid");
        });
        actualizarBarraProgreso();
    });

    document.querySelectorAll("input, select").forEach(campo => {
        campo.addEventListener("focus", function () {
            campo.classList.remove("is-invalid");
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
        const valido = fechaSeleccionada >= fechaActual;
        fechaActual.setHours(0, 0, 0, 0);
        if (valido) {
            input.classList.add('is-valid');
            input.classList.remove('is-invalid');
        }
        else {
            input.classList.add('is-invalid');
            input.classList.remove('is-valid');
        }
        return valido;
    }

    function comprobarDevolucion(input) {
        const fechaRecogida = new Date(recogida.value);
        const fechaDevolucion = new Date(input.value);
        const valido = fechaDevolucion > fechaRecogida;
        if (valido) {
            input.classList.add('is-valid');
            input.classList.remove('is-invalid');
        }
        else {
            input.classList.add('is-invalid');
            input.classList.remove('is-valid');
        }
        return valido;
    }

    function comprobarValidacion(input) {
        const valido = input.checkValidity();
        if (valido) {
            input.classList.add('is-valid');
            input.classList.remove('is-invalid');
        } else {
            input.classList.add('is-invalid');
            input.classList.remove('is-valid');
        }
        return valido;
    }

    function actualizarBarraProgreso() {
        const totalCampos = 9;
        let camposValidos = 0;
        document.querySelectorAll("#reservaForm .is-valid").forEach(() => {
            camposValidos++;
        });
        const porcentaje = (camposValidos / totalCampos) * 100;
        const barraProgreso = document.querySelector(".progress-bar");
        barraProgreso.style.width = porcentaje + "%";
        barraProgreso.setAttribute("aria-valuenow", porcentaje);
    }
});
