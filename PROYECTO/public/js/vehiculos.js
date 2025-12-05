let modo = "Editando";
let idVehiculoSeleccionado = null;

$(function () {
    const resultToast = document.querySelector("#registerResultToast .toast");
    const toast = new bootstrap.Toast(resultToast);
    cargarVehiculos(toast);

    $("#anadirVehiculoBoton").on("click", function (event) {
        $("#registroVehiculoForm .is-valid, #registroVehiculoForm .is-invalid").removeClass("is-valid is-invalid");
        modo = "anadir";
        $("#tituloModal").text("Creando vehículo");
        cargarConcesionarios(toast);
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
            anadirVehiculo(toast);
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
                $("#infoVehiculos").append(`
                    <div class="card mb-3">
                        <div class="row g-0">
                            <div class="col-md-4 d-flex justify-content-center align-items-center">
                                <img src="${vehiculo.imagen}" class="img-fluid rounded-start"
                                    alt="${vehiculo.marca} ${vehiculo.modelo}">
                            </div>
                            <div class="col-md-8">
                                <div class="card-body">
                                    <h5 class="card-title">${vehiculo.marca} ${vehiculo.modelo}</h5>
                                    <p><i class="bi bi-card-text"></i> Matrícula: ${vehiculo.matricula}</p>
                                    <p><i class="bi bi-calendar"></i> Año: ${vehiculo.ano_matriculacion}</p>
                                    <p><i class="bi bi-people"></i> Plazas: ${vehiculo.numero_plazas}</p>
                                    <p><i class="bi bi-battery-half"></i> Autonomía: ${vehiculo.autonomia_km} km</p>
                                    <p><i class="bi bi-palette"></i> Color: ${vehiculo.color}</p>
                                    <p class="card-text"><small class="text-muted">${vehiculo.concesionario}</small></p>
                                </div>
                            </div>
                        </div>
                    </div>
                    `);
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#mensajeToast").text(jqXHR.responseJSON?.error || errorThrown);
            toast.show();
        }
    });
}

function anadirVehiculo(toast) {
    const form = $("#registroVehiculoForm")[0];
    console.log("se metio en anadir de ajax");
    const formData = new FormData(form);
    $.ajax({
        url: "/api/vehiculos/crear",
        method: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (data, textStatus, jqXHR) {
            console.log("llego al success del ajax");
            $("#modalAccion").modal("hide");
            if (data.id && data.id > 0) {
                editarUsuario(data.id, formData, toast);
            } else {
                $("#mensajeToast").text(data.mensaje);
                toast.show();
            }
            cargarVehiculos(toast);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#mensajeToast").text(jqXHR.responseJSON?.error || errorThrown);
            toast.show();
        }
    })
}

function cargarConcesionarios(toast) {
    $.ajax({
        url: "/api/concesionarios/",
        method: "GET",
        contentType: "application/json",
        success: function (data, textStatus, jqXHR) {
            $("#concesionario").empty();
            concesionarios = data.concesionarios;
            $("#concesionario").append(`<option selected disabled value="">Selecciona un concesionario</option>`);
            concesionarios.forEach(concesionario => {
                $("#concesionario").append(`
                    <option value=${concesionario.id_concesionario}>${concesionario.nombre} - ${concesionario.ciudad}</option>`
                );
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#mensajeToast").text(jqXHR.responseJSON?.error || errorThrown);
            toast.show();
        }
    })
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