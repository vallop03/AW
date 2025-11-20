document.addEventListener("DOMContentLoaded", function () {
    const nombre = document.getElementById("nombre");
    const email = document.getElementById("email");
    const password = document.getElementById("password");

    const form = document.getElementById("registroForm");


    form.addEventListener('submit', function (event) {
        let valido = comprobarNombre(nombre);
        valido = comprobarValidacion(email) && valido;
        valido = comprobarValidacion(password) && valido;
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

    email.addEventListener("input", function () {
        comprobarValidacion(email);
        actualizarBarraProgreso();

    });

    password.addEventListener("input", function () {
        comprobarValidacion(password);
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

    function comprobarValidacion(input) {
        if (input.checkValidity()) {
            input.classList.add('is-valid');
            input.classList.remove('is-invalid');
        } else {
            input.classList.add('is-invalid');
            input.classList.remove('is-valid');
        }
    }

    function actualizarBarraProgreso() {
        const totalCampos = 3;
        let camposValidos = 0;
        document.querySelectorAll("#registroForm .is-valid").forEach(() => {
            camposValidos++;
        });
        const porcentaje = (camposValidos / totalCampos) * 100;
        const barraProgreso = document.querySelector(".progress-bar");
        barraProgreso.style.width = porcentaje + "%";
        barraProgreso.setAttribute("aria-valuenow", porcentaje);
    }

});