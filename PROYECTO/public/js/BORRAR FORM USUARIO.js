document.addEventListener("DOMContentLoaded", function () {
    const nombre = document.getElementById("nombre");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const concesionario = document.getElementById("concesionario");
    const rol = document.getElementById("rol");
    const tel = document.getElementById("tel");

    let telIncluded = false;

    const form = document.getElementById("registroUsuarioForm");
    const resultToast = document.querySelector("#registerResultToast .toast");
    if(resultToast)
    {
        const toast = new bootstrap.Toast(resultToast);
        toast.show();
    }

    form.addEventListener('submit', function (event) {
        let valido = comprobarNombre(nombre);
        valido = comprobarValidacion(email) && valido;
        valido = comprobarValidacion(password) && valido;
        valido = comprobarValidacion(concesionario) && valido;
        valido = comprobarValidacion(rol) && valido;
        valido = comprobarValidacion(tel) && valido;
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

    rol.addEventListener("input", function () {
        comprobarValidacion(rol);
        actualizarBarraProgreso();
    });

    tel.addEventListener("input", function () {
        comprobarValidacion(tel);
        telIncluded = true;
        actualizarBarraProgreso(1);
    });

    concesionario.addEventListener("input", function () {
        comprobarValidacion(concesionario);
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
        const valido = valor.length >= 3;
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
        let totalCampos = 5;
        let camposValidos = 0;
        if (telIncluded)
            totalCampos = 6;
        document.querySelectorAll("#registroUsuarioForm .is-valid").forEach((element) => {
            camposValidos++;
        });
        const porcentaje = (camposValidos / totalCampos) * 100;
        const barraProgreso = document.querySelector(".progress-bar");
        barraProgreso.style.width = porcentaje + "%";
        barraProgreso.setAttribute("aria-valuenow", porcentaje);
    }

});