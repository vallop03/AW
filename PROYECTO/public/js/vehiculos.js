let modo = "Editando";
let idVehiculoSeleccionado = null;
let vehiculos = [];
let archivoJSON = null;

$(function () {
    const resultToast = document.querySelector("#registerResultToast .toast");
    const toast = new bootstrap.Toast(resultToast);
    cargarConcesionarios("#filtroConcesionario", toast, function () {
    });
    if (usuarioActual && usuarioActual.rol === "admin") {
        $("#anadirVehiculoJSON").show();
        $("#anadirVehiculoBoton").show();
        cargarVehiculos(null, toast);
    }
    else if (usuarioActual && usuarioActual.rol === "empleado") {
        $("#anadirVehiculoBoton").hide();
        $("#anadirVehiculoJSON").hide();
        cargarVehiculos(usuarioActual.id_concesionario, toast);
    }
    else {
        $("#anadirVehiculoBoton").hide();
        $("#anadirVehiculoJSON").hide();
        cargarVehiculos(null, toast);
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
        $("#botonModal").prop("aria-label", "Añadir vehículo");
        $("#botonModal").prop("title", "Añadir");
        $("#imagen").prop("required", true);
        $("#grupoReserva").hide();
        $("#recogida").prop("required", false);
        $("#devolucion").prop("required", false);
        $("#registroVehiculoForm")[0].reset(); //para limpiar el form
        cargarConcesionarios("#concesionario", toast, function () {
            $("#modalAccion").modal("show");
        });
    });

    //AÑADIR POR JSON
    $("#anadirVehiculoJSON").on("click", function (event) {
        $("#formJSON .is-valid, #formJSON .is-invalid").removeClass("is-valid is-invalid");
        $("#carga").prop("value", "");
        $("#cargarJSON").modal("show");
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
            if (modo === "Reservando") {
                valido = comprobarValidacion($("#recogida")[0]) && valido;
                valido = comprobarValidacion($("#devolucion")[0]) && valido;
                valido = comprobarRecogida($("#recogida")[0]) && valido;
                valido = comprobarDevolucion($("#devolucion")[0], $("#recogida")[0]) && valido;
            }

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
                    idUsuario: usuarioActual.id_usuario,
                    recogida: $("#recogida").prop("value"),
                    devolucion: $("#devolucion").prop("value")
                }
                comprobarReservaVehiculo(datos, toast);
            }
        }
        else if (modo === "Borrando") {
            borrarVehiculo(idVehiculoSeleccionado, toast);
        }
    });

    //cargar
    $("#botonJSON").on("click", function (event) {
        const valido = comprobarValidacion($("#carga")[0]);
        if (!valido) {
            event.preventDefault();
            event.stopPropagation();
            $("#mensajeToast").text("Algunos campos no son válidos.");
            toast.show();
        }
        else {
            parsearArchivo(toast);
        }
    });

    //FILTROS
    $("#filtroAutonomia, #filtroPlazas, #filtroColor, #filtroConcesionario, #filtroCiudad").on("input change", function () {
        aplicarFiltros();
    });

    //VALIDACIONES A TIEMPO REAL
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

    $("#devolucion").on("input change", function () {
        comprobarDevolucion(this, $("#recogida")[0]);
    });

    $("#recogida").on("input change", function () {
        comprobarRecogida(this);
        if ($("#devolucion").val()) {
            comprobarDevolucion($("#devolucion")[0], this);
        }
    });

    //CARGAR EL ARCHIVO
    $("#carga").on("change", function (event) {
        archivoJSON = event.target.files[0];
    });

    $("#modalAccion").on("hide.bs.modal", function () {
        $(this).find(":focus").blur();
    });
})

function parsearArchivo(toast) {
    if (!archivoJSON) {
        $("#mensajeToast").text("No se ha seleccionado ningún fichero");
        toast.show();
        return;
    }
    const reader = new FileReader();

    reader.onload = function (event) {
        try {
            const data = JSON.parse(event.target.result);

            cargarVehiculosDesdeJSON(data, toast);

        } catch (err) {
            $("#mensajeToast").text("El formato del fichero no es adecuado");
            toast.show();
        }
    };

    reader.readAsText(archivoJSON);
}

function cargarVehiculosDesdeJSON(data, toast) {
    if (Array.isArray(data)) {
        $("#mensajeToast").text("Solo se permite un vehículo por archivo JSON.");
        toast.show();
        return;
    } else {
        procesarVehiculo(data, toast);
    }
}

function procesarVehiculo(vehiculo, toast) {
    $.ajax({
        url: "/api/vehiculos/matricula/" + vehiculo.matricula,
        method: "GET",
        success: function (data, textStatus, jqXHR) {
            if (data.existeVehiculo) {
                let info = {
                    id: data.existeVehiculo.id_vehiculo,
                    datos: vehiculo
                };
                $("#cuerpoConfirmacion").append(
                    "<p>El vehículo con matrícula <strong>" + vehiculo.matricula + "</strong> ya existe. ¿Deseas actualizar sus datos?</p>"
                );
                $("#cargarJSON").modal("hide");
                $("#confirmacionCambio").modal("show");
                $("#botonAceptar").on("click", function (event) {
                    $("#confirmacionCambio").modal("hide");
                    editarVehiculoPorJSON(info.id, info.datos, toast, false);
                });
                $("#botonRechazar").on("click", function (event) {
                    $("#confirmacionCambio").modal("hide");
                });
            }
            else {
                anadirVehiculoPorJSON(vehiculo, toast);
            }
            $("#cargarJSON").modal("hide");
            cargarVehiculos();

        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#mensajeToast").text(jqXHR.responseJSON?.error || errorThrown);
            toast.show();
        }
    })

}

function anadirVehiculoPorJSON(vehiculo, toast) {
    $.ajax({
        url: "/api/vehiculos/crearJSON",
        method: "POST",
        data: JSON.stringify(vehiculo),
        contentType: "application/json",
        success: function (data, textStatus, jqXHR) {
            if (data.id && data.id > 0) {
                editarVehiculoPorJSON(data.id, vehiculo, toast, true);
            }
            else {
                $("#mensajeToast").text(data.mensaje);
                toast.show();
            }
            cargarVehiculos(null, toast);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#mensajeToast").text(jqXHR.responseJSON?.error || errorThrown);
            toast.show();
        }
    })
}

function editarVehiculoPorJSON(id, datos, toast, reactivar) {
    $.ajax({
        url: "/api/vehiculos/editarJSON/" + id,
        method: "PUT",
        data: JSON.stringify(datos),
        contentType: "application/json",
        success: function (data, textStatus, jqXHR) {
            cargarVehiculos(null, toast);
            $("#mensajeToast").text(data.mensaje);
            toast.show();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#mensajeToast").text(jqXHR.responseJSON?.error || errorThrown);
            toast.show();
        }
    })
}

//CARGAR TABLA DE VEHICULOS
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
            $("#filtroAutonomia").prop("value", "");
            $("#filtroPlazas").prop("value", "");
            $("#filtroColor").prop("value", "");
            $("#filtroConcesionario").prop("value", "");
            $("#filtroCiudad").prop("value", "");
            vehiculos = data.vehiculos;
            mostrarVehiculos(data.vehiculos);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#mensajeToast").text(jqXHR.responseJSON?.error || errorThrown);
            toast.show();
        }
    });
}

//CREAR
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
            $("#modalAccion").modal("hide");
            if (data.id && data.id > 0) {
                editarVehiculo(data.id, toast, true);
            } else {
                $("#mensajeToast").text(data.mensaje);
                toast.show();
            }
            cargarVehiculos(null, toast);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#mensajeToast").text(jqXHR.responseJSON?.error || errorThrown);
            toast.show();
        }
    })
}

//EDITAR
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
            cargarVehiculos(null, toast);


        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#mensajeToast").text(jqXHR.responseJSON?.error || errorThrown);
            toast.show();
        }
    })
}

//BAJA DE VEHICULO
function borrarVehiculo(id, toast) {
    $.ajax({
        url: "/api/vehiculos/borrar/" + id,
        method: "PUT",
        contentType: "application/json",
        success: function (data, textStatus, jqXHR) {
            $("#modalAccion").modal("hide");
            $("#mensajeToast").text(data.mensaje);
            toast.show();
            cargarVehiculos(null, toast);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (toast) {
                $("#mensajeToast").text(jqXHR.responseJSON?.error || errorThrown);
                toast.show();
            }
        }
    })
}

//COMPRUEBA DISPONIBILIDAD
function comprobarReservaVehiculo(datos, toast) {
    $.ajax({
        url: "/api/reservas/comprobarFechas",
        method: "GET",
        data: {
            idVehiculo: datos.idVehiculo,
            recogida: datos.recogida,
            devolucion: datos.devolucion
        },
        success: function (data, textStatus, jqXHR) {
            if (data.reservado) {
                $("#mensajeToast").text("Vehículo no disponible en las fechas solicitadas");
                toast.show();
            }
            else {
                reservarVehiculo(datos, toast);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#mensajeToast").text(jqXHR.responseJSON?.error || errorThrown);
            toast.show();
        }
    })
}

//REALIZA LA RESERVA
function reservarVehiculo(datos, toast) {
    $.ajax({
        url: "/api/reservas/reservar",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(datos),
        success: function (data, textStatus, jqXHR) {
            $("#modalAccion").modal("hide");
            $("#mensajeToast").text(data.mensaje);
            toast.show();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#mensajeToast").text(jqXHR.responseJSON?.error || errorThrown);
            toast.show();
        }
    })
}

//CARGA DEL SELECT DE CONCESIONARIOS
function cargarConcesionarios(selector, toast, callback) {
    $.ajax({
        url: "/api/concesionarios/",
        method: "GET",
        contentType: "application/json",
        success: function (data, textStatus, jqXHR) {
            const $select = $(selector);
            $select.empty();
            concesionarios = data.concesionarios;
            $select.append(`<option selected value="">Selecciona un concesionario</option>`);
            concesionarios.forEach(concesionario => {
                $select.append(`
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

//CARGA DEL FORM
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
            $("#recogida").prop("value", "");
            $("#devolucion").prop("value", "");
            $("#recogida").prop("required", false);
            $("#devolucion").prop("required", false);
            cargarConcesionarios("#concesionario", toast, function () {
                $("#concesionario").prop("value", vehiculo.id_concesionario).prop("disabled", disable);
            });

            if (disable) {
                $("#grupoImagen").hide();
                $("#textoImagen").text("Imagen actual");
                if (accion === "Borrando") {
                    $("#botonModal").text("Borrar");
                    $("#botonModal").prop("aria-label", "Borrar " + vehiculo.marca + " " + vehiculo.modelo);
                    $("#botonModal").prop("title", "Borrar");
                }
                else {
                    $("#botonModal").text("Reservar");
                    $("#botonModal").prop("aria-label", "Reservar " + vehiculo.marca + " " + vehiculo.modelo);
                    $("#botonModal").prop("title", "Reservar");
                    $("#grupoReserva").show();
                    $("#recogida").prop("required", true);
                    $("#devolucion").prop("required", true);
                }
            }
            else {
                $("#grupoImagen").show();
                $("#textoImagen").text("Imagen anterior");
                $("#botonModal").text("Editar");
                $("#botonModal").prop("aria-label", "Editar " + vehiculo.marca + " " + vehiculo.modelo);
                $("#botonModal").prop("title", "Editar");
            }
            callback();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#mensajeToast").text(jqXHR.responseJSON?.error || errorThrown);
            toast.show();
        }
    });
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
    $("#imagen").prop("disabled", false);
}

/////////////FILTROS/////////////
function aplicarFiltros() {
    const minAutonomia = parseInt($("#filtroAutonomia").prop("value")) || 0;
    const plazas = parseInt($("#filtroPlazas").prop("value")) || 0;
    const color = $("#filtroColor").prop("value");
    const concesionario = $("#filtroConcesionario").prop("value");
    const ciudad = $("#filtroCiudad").prop("value");

    const filtrados = vehiculos.filter(v => {
        return (
            v.autonomia_km >= minAutonomia &&
            (plazas === 0 || v.numero_plazas === plazas) &&
            (color === "" || v.color === color) &&
            (concesionario === "" || v.id_concesionario == concesionario) &&
            (ciudad === "" || v.ciudad.toLowerCase().includes(ciudad.toLowerCase()))
        );
    });

    mostrarVehiculos(filtrados);
}

function mostrarVehiculos(lista) {
    $("#infoVehiculos").empty();

    if (lista.length === 0) {
        $("#infoVehiculos").append(`
            <div class="d-flex flex-column align-items-center justify-content-center text-center p-5">
                <i class="bi bi-car-front-fill" style="font-size: 3rem; color: #6c757d;"></i>
                <h5 class="mt-3">No se han encontrado vehículos</h5>
                <p class="text-muted">Intenta cambiar los filtros o añade un nuevo vehículo.</p>
            </div>
        `);
        return;
    }

    lista.forEach(vehiculo => {
        let botones = '';
        if (usuarioActual) {
            if (usuarioActual.rol === 'admin') {
                botones = `
                    <button class="btn btn-primary btn-sm editButton" data-id_vehiculo="${vehiculo.id_vehiculo}">Editar <i class="bi bi-pencil"></i></button>
                    <button class="btn btn-danger btn-sm deleteButton" data-id_vehiculo="${vehiculo.id_vehiculo}">Eliminar <i class="bi bi-trash3"></i></button>
                    <button class="btn btn-success btn-sm reserveButton" data-id_vehiculo="${vehiculo.id_vehiculo}">Reservar <i class="bi bi-check-circle"></i></button>`;
            } else if (usuarioActual.rol === 'empleado') {
                botones = `
                    <button class="btn btn-success btn-sm reserveButton" data-id_vehiculo="${vehiculo.id_vehiculo}">Reservar <i class="bi bi-check-circle"></i></button>`;
            }
        }

        $("#infoVehiculos").append(`
            <div class="card mb-3">
                <div class="row g-0">
                    <div class="col-md-4 d-flex justify-content-center align-items-center">
                        <img src="${vehiculo.imagen}" class="img-fluid rounded-start" alt="${vehiculo.marca}">
                    </div>
                    <div class="col-md-8 d-flex justify-content-between align-items-start">
                        <div class="card-body">
                            <h5 class="card-title">${vehiculo.marca} ${vehiculo.modelo}</h5>
                            <p>Matrícula: ${vehiculo.matricula}</p>
                            <p>Año: ${vehiculo.ano_matriculacion}</p>
                            <p>Plazas: ${vehiculo.numero_plazas}</p>
                            <p>Autonomía: ${vehiculo.autonomia_km} km</p>
                            <p>Color: ${vehiculo.color}</p>
                            <p><small class="text-muted">${vehiculo.concesionario}</small></p>
                        </div>
                        <div class="d-flex flex-column gap-2 mt-3 me-3">
                            ${botones}
                        </div>
                    </div>
                </div>
            </div>
        `);
    });
}

/////////////VALIDACION///////
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
    const ahora = new Date();
    const valido = fechaSeleccionada >= ahora;

    if (valido) {
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
    } else {
        input.classList.add("is-invalid");
        input.classList.remove("is-valid");
    }

    return valido;
}

function comprobarDevolucion(input, inputRecogida) {
    const fechaRecogida = new Date(inputRecogida.value);
    const fechaDevolucion = new Date(input.value);

    let valido = true;
    if (inputRecogida.value != "")
        valido = fechaDevolucion > fechaRecogida;

    if (valido) {
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
    } else {
        input.classList.add("is-invalid");
        input.classList.remove("is-valid");
    }

    return valido;
}