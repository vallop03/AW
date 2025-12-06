let modo = "Editando";
let idConcesionarioSeleccionado = null;
$(function () {
    const resultToast = document.querySelector("#registerResultToast .toast");
    const toast = new bootstrap.Toast(resultToast);
    cargarConcesionarios(toast);
    console.log('holiii');

    
    //Cuando se le da a crear usuario
    $("#anadirConcesionarioBoton").on("click", function (event) {
        $("#registroConcesionarioForm .is-valid, #registroConcesionarioForm .is-invalid").removeClass("is-valid is-invalid");
        modo = "anadir";
        $("#tituloModal").text("Creando concesionario");
        //cargarConcesionarios(toast);
        //activarModal(false); //hace que los campos del form se activen para escribir
        $("#botonModal").text("Añadir");
        $("#grupoPassword").show(); //hace que el campo de contraseña sea visible para escribir
        $("#password").prop("required", true);
        $("#registroConcesionarioForm")[0].reset(); //para limpiar el form
        $("#modalAccion").modal("show");
    });
})

function cargarConcesionarios(toast) {
    console.log('hola');
    $.ajax({
        url: "/api/concesionarios/",
        method: "GET",
        contentType: "application/json",
        success: function (data, textStatus, jqXHR) {
            $("#infoConcesionarios").empty();
            concesionarios = data.concesionarios;
            console.log('hola');
            concesionarios.forEach(concesionario => {
                console.log(concesionario);
                $("#infoConcesionarios").append(
                    `<tr>
                        <td>${concesionario.id_concesionario}</td>
                        <td>${concesionario.nombre}</td>
                        <td>${concesionario.ciudad}</td>
                        <td>${concesionario.direccion}</td>
                        <td>${concesionario.telefono_contacto || "-"}</td>
                        <td>
                            <button class="btn btn-primary editButton" type="button" data-id_concesionario="${concesionario.id_concesionario}">
                                <i class="bi bi-pencil"></i>
                            </button>
                        </td>
                    </tr>`);
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#mensajeToast").text(jqXHR.responseJSON?.error || errorThrown);
            toast.show();
        }
    });
}

function activarModal(desactivado) {
    $("#nombre").prop("disabled", desactivado);
    $("#email").prop("disabled", desactivado);
    $("#tel").prop("disabled", desactivado);
    $("#concesionario").prop("disabled", desactivado);
    $("#rol").prop("disabled", desactivado);
    $("#password").prop("disabled", desactivado);
    $("#password").prop("required", desactivado);
}

function cargarModal(id, accion, toast) {
    $.ajax({
        url: "/api/usuarios/" + id,
        method: "GET",
        contentType: "application/json",
        success: function (data, textStatus, jqXHR) {
            usuario = data.usuario;
            disable = accion === "Borrando";
            cargarConcesionarios(toast);
            $("#tituloModal").text(accion + " a " + usuario.nombre);
            $("#nombre").prop("value", usuario.nombre).prop("disabled", disable);
            $("#email").prop("value", usuario.correo).prop("disabled", disable);
            $("#tel").prop("value", usuario.telefono).prop("disabled", disable);
            $("#concesionario").prop("value", usuario.id_concesionario).prop("disabled", disable);
            $("#rol").prop("value", usuario.rol).prop("disabled", disable);
            $("#password").prop("required", disable);
            if (disable) {
                $("#botonModal").text("Borrar");
            }
            else {
                $("#botonModal").text("Editar");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#mensajeToast").text(jqXHR.responseJSON?.error || errorThrown);
            toast.show();
        }
    });
}

function editarUsuario(id, datos, toast, reactivar) {
    $.ajax({
        url: "/api/usuarios/editar/" + id,
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify(datos),
        success: function (data, textStatus, jqXHR) {
            $("#modalAccion").modal("hide");
            if (reactivar) {
                $("#mensajeToast").text("Usuario reactivado correctamente");
            }
            else {
                $("#mensajeToast").text(data.mensaje);
            }
            toast.show();
            cargarUsuarios(toast);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#mensajeToast").text(jqXHR.responseJSON?.error || errorThrown);
            toast.show();
        }
    })
}

function anadirUsuario(datos, toast) {
    $.ajax({
        url: "/api/usuarios/crear",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(datos),
        success: function (data, textStatus, jqXHR) {
            $("#modalAccion").modal("hide");
            if (data.id && data.id > 0) {
                editarUsuario(data.id, datos, toast);
            } else {
                $("#mensajeToast").text(data.mensaje);
                toast.show();
            }
            cargarUsuarios(toast);
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

function borrarUsuario(id, toast) {
    $.ajax({
        url: "/api/usuarios/borrar/" + id,
        method: "PUT",
        contentType: "application/json",
        success: function (data, textStatus, jqXHR) {
            $("#modalAccion").modal("hide");
            $("#mensajeToast").text(data.mensaje);
            toast.show();
            cargarUsuarios(toast);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (toast) {
                $("#mensajeToast").text(jqXHR.responseJSON?.error || errorThrown);
                toast.show();
            }
        }
    })
}

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