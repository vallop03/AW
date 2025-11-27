document.addEventListener("DOMContentLoaded", function () {
    const nombre = document.getElementById("nombre");
    const ciudad = document.getElementById("ciudad");
    const direccion = document.getElementById("direccion");
    const tel = document.getElementById("tel");

    const form = document.getElementById("registroConcesionarioForm");
    const resultToast = document.querySelector("#registerResultToast .toast");
    if(resultToast)
    {
        const toast = new bootstrap.Toast(resultToast);
        toast.show();
    }

    form.addEventListener('submit', function (event) {
        let valido = comprobarValidacion(nombre);
        valido = comprobarValidacion(ciudad) && valido;
        valido = comprobarValidacion(direccion) && valido;
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

    ciudad.addEventListener("input", function () {
        comprobarValidacion(ciudad);
        actualizarBarraProgreso();
    });

    direccion.addEventListener("input", function () {
        comprobarValidacion(direccion);
        actualizarBarraProgreso();
    });

    tel.addEventListener("input", function () {
        comprobarValidacion(tel);
        telIncluded = true;
        actualizarBarraProgreso(1);
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
        let totalCampos = 4;
        let camposValidos = 0;
        document.querySelectorAll("#registroUsuarioForm .is-valid").forEach((element) => {
            camposValidos++;
        });
        const porcentaje = (camposValidos / totalCampos) * 100;
        const barraProgreso = document.querySelector(".progress-bar");
        barraProgreso.style.width = porcentaje + "%";
        barraProgreso.setAttribute("aria-valuenow", porcentaje);
    }

});