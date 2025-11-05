document.addEventListener("DOMContentLoaded", function () {

    const nombre = document.getElementById("nombre");
    const recogida = document.getElementById("recogida");
    const devolucion = document.getElementById("devolucion");
    const form = document.getElementById("reservaForm");
    form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
        }
        form.classList.add('was-validated');
    });

    document.getElementById("resetBtn").addEventListener("click", function () {
        const form = document.getElementById("reservaForm");
        form.classList.remove('was-validated');
    });

    
    
});


function comprobarNombre(input) {
    if (input.value.trim().length >= 3){
        nombre.classList.add('is-valid');
        nombre.classList.remove('is-invalid');
    }
    else {
        nombre.classList.add('is-invalid');
        nombre.classList.remove('is-valid');
    }

}

function comprobarRecogida(input) {
    const fechaSeleccionada = new Date(input.value);
    const fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0);
    if(fechaSeleccionada >= fechaActual){
        recogida.classList.add('is-valid');
        recogida.classList.remove('is-invalid');
    } 
    else {
        recogida.classList.add('is-invalid');
        recogida.classList.remove('is-valid');
    }
}

function comprobarDevolucion(input) {
    const fechaSeleccionada = new Date(input.value);
    const fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0);

}