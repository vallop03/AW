document.addEventListener("DOMContentLoaded", function () {

    const nombre = document.getElementById("nombre");
    const apellidos = document.getElementById("apellidos");
    const recogida = document.getElementById("recogida");
    const devolucion = document.getElementById("devolucion");
    const form = document.getElementById("reservaForm");
    form.addEventListener('submit', function (event) {
        let valido = comprobarNombre(nombre);
        valido = comprobarNombre(apellidos) && valido;
        valido = comprobarRecogida(recogida) && valido;
        valido = comprobarDevolucion(devolucion) && valido;
        if (!valido) {
            event.preventDefault();
            event.stopPropagation();
        }
    });

    document.getElementById("resetBtn").addEventListener("click", function () {
        const form = document.getElementById("reservaForm");
        form.classList.remove('was-validated');
    });

    nombre.addEventListener("input", function () {
        comprobarNombre(nombre);
    });

    apellidos.addEventListener("input", function () {
        comprobarNombre(apellidos);
    });

    recogida.addEventListener("input", function () {
        comprobarRecogida(recogida);
    });

    devolucion.addEventListener("input", function () {
        comprobarDevolucion(devolucion);
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


});
