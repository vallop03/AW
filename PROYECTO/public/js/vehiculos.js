let modo = "Editando";
let idVehiculoSeleccionado = null;

$(function () {
    const resultToast = document.querySelector("#registerResultToast .toast");
    const toast = new bootstrap.Toast(resultToast);
    //cargarVehiculos(toast);


    $("#anadirVehiculoBoton").on("click", function (event) {
        $("#registroVehiculoForm .is-valid, #registroVehiculoForm .is-invalid").removeClass("is-valid is-invalid");
        modo = "anadir";
        $("#tituloModal").text("Creando vehículo");
        //cargarConcesionarios(toast);
        //activarModal(false);
        $("#botonModal").text("Añadir");
        $("#registroVehiculoForm")[0].reset(); //para limpiar el form
        $("#modalAccion").modal("show");
    });

    //Cuando se le da a enviar tras crear/ modificar o eliminar del modal, comprueba la validacion
    //de todos los campos y despues llama a su respectiva funcion de crear/modificar o eliminar
    $("#botonModal").on("click", function (event) {

        let datos = {
            matricula: $("#matricula").prop("value"),
            marca: $("#marca").prop("value"),
            modelo: $("#modelo").prop("value"),
            ano: $("#ano").prop("value"),
            plazas: $("#plazas").prop("value"),
            autonomia: $("#autonomia").prop("value"),
            color: $("#color").prop("value"),
            imagen: $("#imagen").prop("value"),
            concesionario: $("#concesionario").prop("value") 
        };

        let valido = comprobarValidacion($("#matricula")[0]);
        valido = comprobarValidacion($("#marca")[0]) && valido;
        valido = comprobarValidacion($("#modelo")[0]) && valido;
        valido = comprobarValidacion($("#ano")[0]) && valido;
        valido = comprobarValidacion($("#plazas")[0]) && valido;
        valido = comprobarValidacion($("#autonomia")[0]) && valido;
        valido = comprobarValidacion($("#color")[0]) && valido;
        valido = comprobarValidacion($("#imagen")[0]) && valido;
        valido = comprobarValidacion($("#concesionario")[0]) && valido;
        if (!valido) {
            event.preventDefault();
            event.stopPropagation();
            $("#mensajeToast").text("Algunos campos no son válidos.");
            toast.show();
        }
        else if (modo === "Editando") {
            editarVehiculo(idVehiculoSeleccionado, datos, toast, false);
        }
        else if (modo === "anadir") {
            anadirVehiculo(datos, toast);
        }
        else if (modo === "Borrando") {
            borrarUsuario(idVehiculoSeleccionado, toast);
        }
    });

    //comprobacion en vivo de los campos
    $("#matricula").on("input", function () {
        comprobarValidacion(this);
    });

    $("#marca").on("input", function () {
        comprobarValidacion(this);
    });

    $("#modelo").on("input", function () {
        comprobarValidacion(this);
    });

    $("#ano").on("input", function () {
        comprobarValidacion(this);
    });

    $("#plazas").on("input", function () {
        comprobarValidacion(this);
    });

    $("#autonomia").on("input", function () {
        comprobarValidacion(this);
    });

    $("#color").on("input", function () {
        comprobarValidacion(this);
    });

    $("#imagen").on("input", function () {
        comprobarValidacion(this);
    });

    $("#concesionario").on("input", function () {
        comprobarValidacion(this);
    });
})

function cargarVehiculos(toast) {
    $.ajax({
        url: "/api/vehiculos/",
        method: "GET",
        contentType: "application/json",
        success: function (data, textStatus, jqXHR) {
            $("#infoVehiculos").empty();
            vehiculos = data.vehiculos;
            vehiculos.forEach(vehiculo => {
                $("#infoVehiculos").append(``);
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#mensajeToast").text(jqXHR.responseJSON?.error || errorThrown);
            toast.show();
        }
    });
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