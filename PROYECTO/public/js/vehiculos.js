let modo = "Editando";
let idVehiculoSeleccionado = null;

$(function () {
    const resultToast = document.querySelector("#registerResultToast .toast");
    const toast = new bootstrap.Toast(resultToast);
    if ((usuarioActual && usuarioActual.rol === "admin") || !usuarioActual) {
        cargarVehiculos(null, toast);
    }
    else {
        cargarVehiculos(usuarioActual.id_concesionario, toast);
    }

    //EDITAR
    $("#infoVehiculos").on("click", ".editButton", function (event) {
        $("#registroVehiculoForm .is-valid, #registroVehiculoForm .is-invalid").removeClass("is-valid is-invalid");
        idVehiculoSeleccionado = $(this).data("id_vehiculo");
        if (idVehiculoSeleccionado) {
            modo = "Editando";
            cargarModal(idVehiculoSeleccionado, modo, toast, function () {
                $("#modalAccion").modal("show");
            });

        }
    });

    //ELIMINAR
    $("#infoVehiculos").on("click", ".deleteButton", function (event) {
        $("#registroVehiculoForm .is-valid, #registroVehiculoForm .is-invalid").removeClass("is-valid is-invalid");
        idVehiculoSeleccionado = $(this).data("id_vehiculo");
        modo = "Borrando";
        cargarModal(idVehiculoSeleccionado, modo, toast, function () {
            $("#modalAccion").modal("show");
        });
    });

    //RESERVAR
    $("#infoVehiculos").on("click", ".reserveButton", function (event) {
        $("#registroVehiculoForm .is-valid, #registroVehiculoForm .is-invalid").removeClass("is-valid is-invalid");
        idVehiculoSeleccionado = $(this).data("id_vehiculo");
        modo = "Reservando";
        cargarModal(idVehiculoSeleccionado, modo, toast, function () {
            $("#modalAccion").modal("show");
        });
    });

    //AÑADIR
    $("#anadirVehiculoBoton").on("click", function (event) {
        $("#registroVehiculoForm .is-valid, #registroVehiculoForm .is-invalid").removeClass("is-valid is-invalid");
        modo = "anadir";
        $("#tituloModal").text("Creando vehículo");
        $("#imagenAntigua").hide();
        $("#grupoImagen").show();
        activarModal();
        $("#botonModal").text("Añadir");
        $("#imagen").prop("required", true);
        $("#grupoReserva").hide();
        $("#recogida").prop("required", false);
        $("#devolucion").prop("required", false);
        $("#registroVehiculoForm")[0].reset(); //para limpiar el form
        cargarConcesionarios(toast, function () {
            $("#modalAccion").modal("show");
        });
    });

    //Cuando se le da a enviar tras crear/ modificar o eliminar del modal, comprueba la validacion
    //de todos los campos y despues llama a su respectiva funcion de crear/modificar o eliminar
    $("#botonModal").on("click", function (event) {
        if (modo !== "Borrando") {

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
                editarVehiculo(idVehiculoSeleccionado, toast, false);
            }
            else if (modo === "anadir") {
                anadirVehiculo(toast);
            }
            else if (modo === "Reservando") {
                let datos = {
                    idVehiculo: idVehiculoSeleccionado,
                    idUsuario: usuarioActual.id_usuario
                }
                reservarVehiculo(datos, toast);
            }
        }
        else if (modo === "Borrando") {
            borrarVehiculo(idVehiculoSeleccionado, toast);
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

    $("#recogida").on("input change", function () {
        console.log("que");
        comprobarRecogida(this);
    });

    $("#devolucion").on("input change", function () {
        comprobarDevolucion(this, $("#recogida")[0]);
    });

    $("#modalAccion").on("hide.bs.modal", function () {
        $(this).find(":focus").blur();
    });
})

function cargarVehiculos(id, toast) {
    let urlAux = "/api/vehiculos/";
    if (id) {
        urlAux = "/api/vehiculos/concesionario/" + id;
    }
    $.ajax({
        url: urlAux,
        method: "GET",
        contentType: "application/json",
        success: function (data, textStatus, jqXHR) {
            $("#infoVehiculos").empty();
            vehiculos = data.vehiculos;
            vehiculos.forEach(vehiculo => {
                let estadoADMIN = '';
                if (usuarioActual && usuarioActual.rol === "admin") {
                    const estadoColor = vehiculo.estado === 'disponible' ? 'green' : 'red';
                    const estadoIcon = vehiculo.estado === 'disponible' ? 'bi-check-circle' : 'bi-x-circle';
                    const estadoTexto = vehiculo.estado.charAt(0).toUpperCase() + vehiculo.estado.slice(1);
                    estadoADMIN = `<p><i class="bi ${estadoIcon}" style="color: ${estadoColor};"></i> ${estadoTexto}</p>`;
                }
                $("#infoVehiculos").append(`
                    <div class="card mb-3">
                        <div class="row g-0">
                            <div class="col-md-4 d-flex justify-content-center align-items-center">
                                <img src="${vehiculo.imagen}" class="img-fluid rounded-start"
                                    alt="${vehiculo.marca} ${vehiculo.modelo}">
                            </div>
                            <div class="col-md-8 d-flex justify-content-between align-items-start">
                                <div class="card-body">
                                    <h5 class="card-title">${vehiculo.marca} ${vehiculo.modelo}</h5>
                                    <p><i class="bi bi-card-text"></i> Matrícula: ${vehiculo.matricula}</p>
                                    <p><i class="bi bi-calendar"></i> Año: ${vehiculo.ano_matriculacion}</p>
                                    <p><i class="bi bi-people"></i> Plazas: ${vehiculo.numero_plazas}</p>
                                    <p><i class="bi bi-battery-half"></i> Autonomía: ${vehiculo.autonomia_km} km</p>
                                    <p><i class="bi bi-palette"></i> Color: ${vehiculo.color}</p>
                                    ${estadoADMIN}
                                    <p class="card-text"><small class="text-muted">${vehiculo.concesionario}</small></p>
                                </div>
                                <div class="d-flex flex-column gap-2 mt-3 me-3">
                                    <button class="btn btn-primary btn-sm editButton" type="button" data-id_vehiculo="${vehiculo.id_vehiculo}">
                                        <i class="bi bi-pencil"></i>
                                    </button>
                                    <button class="btn btn-danger btn-sm deleteButton" type="button" data-id_vehiculo="${vehiculo.id_vehiculo}">
                                        <i class="bi bi-trash3"></i>
                                    </button>
                                    <button class="btn btn-success btn-sm reserveButton" type="button" data-id_vehiculo="${vehiculo.id_vehiculo}">
                                        <i class="bi bi-check-circle"></i>
                                    </button>
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
                editarVehiculo(data.id, toast, true);
            } else {
                $("#mensajeToast").text(data.mensaje);
                toast.show();
            }
            if (usuarioActual && usuarioActual.rol === "admin") {
                cargarVehiculos(null, toast);
            }
            else {
                cargarVehiculos(usuarioActual.id_concesionario, toast);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#mensajeToast").text(jqXHR.responseJSON?.error || errorThrown);
            toast.show();
        }
    })
}

function editarVehiculo(id, toast, reactivar) {
    const form = $("#registroVehiculoForm")[0];
    const formData = new FormData(form);
    const rutaAntiguaCompleta = $("#prevImagen").prop("src");
    const rutaRelativa = new URL(rutaAntiguaCompleta).pathname;
    formData.append("imagenAnterior", rutaRelativa);
    $.ajax({
        url: "/api/vehiculos/editar/" + id,
        method: "PUT",
        data: formData,
        processData: false,
        contentType: false,
        success: function (data, textStatus, jqXHR) {
            $("#modalAccion").modal("hide");
            if (reactivar) {
                $("#mensajeToast").text("Vehículo reactivado correctamente");
            }
            else {
                $("#mensajeToast").text(data.mensaje);
            }
            toast.show();
            if (usuarioActual && usuarioActual.rol === "admin") {
                cargarVehiculos(null, toast);
            }
            else {
                cargarVehiculos(usuarioActual.id_concesionario, toast);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#mensajeToast").text(jqXHR.responseJSON?.error || errorThrown);
            toast.show();
        }
    })
}

function borrarVehiculo(id, toast) {
    $.ajax({
        url: "/api/vehiculos/borrar/" + id,
        method: "PUT",
        contentType: "application/json",
        success: function (data, textStatus, jqXHR) {
            $("#modalAccion").modal("hide");
            $("#mensajeToast").text(data.mensaje);
            toast.show();
            if (usuarioActual && usuarioActual.rol === "admin") {
                cargarVehiculos(null, toast);
            }
            else {
                cargarVehiculos(usuarioActual.id_concesionario, toast);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (toast) {
                $("#mensajeToast").text(jqXHR.responseJSON?.error || errorThrown);
                toast.show();
            }
        }
    })
}

function reservarVehiculo(datos, toast) {
    $.ajax({
        url: "/api/reservas/"
    })
}

function cargarConcesionarios(toast, callback) {
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
            callback();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#mensajeToast").text(jqXHR.responseJSON?.error || errorThrown);
            toast.show();
        }
    })
}

function cargarModal(id, accion, toast, callback) {
    $.ajax({
        url: "/api/vehiculos/" + id,
        method: "GET",
        contentType: "application/json",
        success: function (data, textStatus, jqXHR) {
            vehiculo = data.vehiculo;
            disable = accion === "Borrando" || accion === "Reservando";
            $("#tituloModal").text(accion + " " + vehiculo.marca + " " + vehiculo.modelo);
            $("#matricula").prop("value", vehiculo.matricula).prop("disabled", disable);
            $("#marca").prop("value", vehiculo.marca).prop("disabled", disable);
            $("#modelo").prop("value", vehiculo.modelo).prop("disabled", disable);
            $("#ano").prop("value", vehiculo.ano_matriculacion).prop("disabled", disable);
            $("#plazas").prop("value", vehiculo.numero_plazas).prop("disabled", disable);
            $("#autonomia").prop("value", vehiculo.autonomia_km).prop("disabled", disable);
            $("#color").prop("value", vehiculo.color).prop("disabled", disable);
            $("#imagenAntigua").show();
            $("#prevImagen").prop("src", vehiculo.imagen);
            $("#prevImagen").prop("alt", "Imagen de " + vehiculo.marca + " " + vehiculo.modelo);
            $("#imagen").prop("required", false);
            $("#imagen").prop("value", "");
            $("#imagen").prop("disabled", disable);
            $("#grupoReserva").hide();
            $("#recogida").prop("required", false);
            $("#devolucion").prop("required", false);
            cargarConcesionarios(toast, function () {
                $("#concesionario").prop("value", vehiculo.id_concesionario).prop("disabled", disable);
            });

            if (disable) {
                $("#grupoImagen").hide();
                $("#textoImagen").text("Imagen actual");
                if (accion === "Borrando") {
                    $("#botonModal").text("Borrar");
                }
                else {
                    $("#botonModal").text("Reservar");
                    $("#grupoReserva").show();
                    $("#recogida").prop("required", true);
                    $("#devolucion").prop("required", true);
                }
            }
            else {
                $("#grupoImagen").show();
                $("#textoImagen").text("Imagen anterior");
                $("#botonModal").text("Editar");
            }
            callback();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#mensajeToast").text(jqXHR.responseJSON?.error || errorThrown);
            toast.show();
        }
    });
}

function cargarModalReserva(id, toast, callback) {
    $.ajax({
        url: "/api/vehiculos/" + id,
        method: "GET",
        contentType: "application/json",
        success: function (data, textStatus, jqXHR) {
            vehiculo = data.vehiculo;
            $("#tituloReserva").text("Reservando " + vehiculo.marca + " " + vehiculo.modelo);
            $("#vehiculoElegido").prop("value", vehiculo.marca + " " + vehiculo.modelo);
            callback();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#mensajeToast").text(jqXHR.responseJSON?.error || errorThrown);
            toast.show();
        }
    })

}

function activarModal() {
    $("#matricula").prop("disabled", false);
    $("#marca").prop("disabled", false);
    $("#modelo").prop("disabled", false);
    $("#ano").prop("disabled", false);
    $("#concesionario").prop("disabled", false);
    $("#plazas").prop("disabled", false);
    $("#autonomia").prop("disabled", false);
    $("#color").prop("disabled", false);
    $("#color").prop("disabled", false);
    $("#imagen").prop("disabled", false);
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

function comprobarRecogida(input) {
    const fechaSeleccionada = new Date(input.value);
    const fechaActual = new Date();
    const valido = fechaSeleccionada >= fechaActual;
    fechaActual.setHours(0, 0, 0, 0);
    if (valido) {
        $(input).classList.add('is-valid');
        $(input).classList.remove('is-invalid');
    }
    else {
        $(input).classList.add('is-invalid');
        $(input).classList.remove('is-valid');
    }
    return valido;
}

function comprobarDevolucion(input, inputRecogida) {
    const fechaRecogida = new Date(inputRecogida.value);
    const fechaDevolucion = new Date(input.value);
    const valido = fechaDevolucion > fechaRecogida;
    if (valido) {
        $(input).classList.add('is-valid');
        $(input).classList.remove('is-invalid');
    }
    else {
        $(input).classList.add('is-invalid');
        $(input).classList.remove('is-valid');
    }
    return valido;
}