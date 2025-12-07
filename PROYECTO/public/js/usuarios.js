let modo = "Editando";
let idUsuarioSeleccionado = null;
$(function () {
    const resultToast = document.querySelector("#registerResultToast .toast");
    const toast = new bootstrap.Toast(resultToast);
    cargarUsuarios(toast);

    ////////////////PARTE DE LA PRIMERA VISTA (LA TABLA)/////////////

    //Cuando se le da al botón de editar (el del lápiz)
    $("#infoUsuarios").on("click", ".editButton", function (event) {
        $("#registroUsuarioForm .is-valid, #registroUsuarioForm .is-invalid").removeClass("is-valid is-invalid");
        idUsuarioSeleccionado = $(this).data("id_usuario");
        if (idUsuarioSeleccionado) {
            modo = "Editando";
            $("#grupoPassword").hide();
            cargarModal(idUsuarioSeleccionado, modo, toast);
            $("#modalAccion").modal("show");
        }
    });

    //Cuando se le da al botón de eliminar (la papelera)
    $("#infoUsuarios").on("click", ".deleteButton", function (event) {
        $("#registroUsuarioForm .is-valid, #registroUsuarioForm .is-invalid").removeClass("is-valid is-invalid");
        idUsuarioSeleccionado = $(this).data("id_usuario");
        if (idUsuarioSeleccionado && usuarioActual && idUsuarioSeleccionado != usuarioActual.id_usuario) {
            modo = "Borrando";
            $("#grupoPassword").hide();
            cargarModal(idUsuarioSeleccionado, modo);
            $("#modalAccion").modal("show");
        }
        if (usuarioActual && idUsuarioSeleccionado === usuarioActual.id_usuario) {
            $("#mensajeToast").text("No te puedes autoeliminar.");
            toast.show();
        }
    });

    //Cuando se le da a crear usuario
    $("#anadirUsuarioBoton").on("click", function (event) {
        $("#registroUsuarioForm .is-valid, #registroUsuarioForm .is-invalid").removeClass("is-valid is-invalid");
        modo = "anadir";
        $("#tituloModal").text("Creando usuario");
        activarModal(false); //hace que los campos del form se activen para escribir
        $("#botonModal").text("Añadir");
        $("#botonModal").prop("aria-label", "Añadir usuario");
        $("#grupoPassword").show(); //hace que el campo de contraseña sea visible para escribir
        $("#password").prop("required", true);
        $("#registroUsuarioForm")[0].reset(); //para limpiar el form
        cargarConcesionarios(toast, function () {
            $("#modalAccion").modal("show");
        });
    });

    /////////////PARTE DEL MODAL/////////////

    //Cuando se le da a enviar tras crear/ modificar o eliminar del modal, comprueba la validacion
    //de todos los campos y despues llama a su respectiva funcion de crear/modificar o eliminar
    $("#botonModal").on("click", function (event) {

        let datos = {
            nombre: $("#nombre").prop("value"),
            correo: $("#email").prop("value"),
            telefono: $("#tel").prop("value"),
            concesionario: $("#concesionario").prop("value"),
            rol: $("#rol").prop("value")
        };

        let valido = comprobarNombre($("#nombre")[0]);
        valido = comprobarValidacion($("#email")[0]) && valido;
        valido = comprobarValidacion($("#concesionario")[0]) && valido;
        valido = comprobarValidacion($("#rol")[0]) && valido;
        valido = comprobarValidacion($("#tel")[0]) && valido;
        if (modo === "anadir") {
            datos.password = $("#password").prop("value");
            valido = comprobarValidacion($("#password")[0]) && valido;
        }

        if (!valido) {
            event.preventDefault();
            event.stopPropagation();
            $("#mensajeToast").text("Algunos campos no son válidos.");
            toast.show();
        }
        else if (modo === "Editando") {
            editarUsuario(idUsuarioSeleccionado, datos, toast, false);
        }
        else if (modo === "anadir") {
            anadirUsuario(datos, toast);
        }
        else if (modo === "Borrando") {
            borrarUsuario(idUsuarioSeleccionado, toast);
        }
    });

    //comprobacion en vivo de los campos
    $("#nombre").on("input", function () {
        comprobarNombre(this);
    });


    $("#email").on("input", function () {
        const patron = /^[A-Za-z0-9._%+-]+@carricoche\.es$/;
        if (patron.test(this.value)) {
            this.classList.add('is-valid');
            this.classList.remove('is-invalid');
        } else {
            this.classList.add('is-invalid');
            this.classList.remove('is-valid');
        }
    });

    $("#password").on("input", function () {
        comprobarValidacion(this);
    });

    $("#rol").on("input", function () {
        comprobarValidacion(this);
    });

    $("#tel").on("input", function () {
        comprobarValidacion(this);
    });

    $("#concesionario").on("input", function () {
        comprobarValidacion(this);
    });
})

//CARGAR TABLA DE USUARIOS
function cargarUsuarios(toast) {
    $.ajax({
        url: "/api/usuarios/",
        method: "GET",
        contentType: "application/json",
        success: function (data, textStatus, jqXHR) {
            $("#infoUsuarios").empty();
            usuarios = data.usuarios;
            usuarios.forEach(usuario => {
                $("#infoUsuarios").append(
                    `<tr>
                        <td>${usuario.id_usuario}</td>
                        <td>${usuario.nombre}</td>
                        <td>${usuario.correo}</td>
                        <td>${usuario.rol}</td>
                        <td>${usuario.telefono || "-"}</td>
                        <td>${usuario.concesionario}</td>
                        <td>${usuario.ciudad}</td>
                        <td>
                            <button class="btn btn-primary editButton" type="button" aria-label="Editar a ${usuario.nombre}" data-id_usuario="${usuario.id_usuario}">
                                <i class="bi bi-pencil"></i>
                            </button>
                        </td>
                        <td>
                            <button class="btn btn-danger deleteButton" type="button" aria-label="Eliminar a ${usuario.nombre}" data-id_usuario="${usuario.id_usuario}">
                                <i class="bi bi-trash3"></i>
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

//ACTIVAR O DESACTIVAR EL FORM
function activarModal(desactivado) {
    $("#nombre").prop("disabled", desactivado);
    $("#email").prop("disabled", desactivado);
    $("#tel").prop("disabled", desactivado);
    $("#concesionario").prop("disabled", desactivado);
    $("#rol").prop("disabled", desactivado);
    $("#password").prop("disabled", desactivado);
    $("#password").prop("required", desactivado);
}

//CARGAR FORM BORRAR O EDITAR
function cargarModal(id, accion, toast, callback) {
    $.ajax({
        url: "/api/usuarios/" + id,
        method: "GET",
        contentType: "application/json",
        success: function (data, textStatus, jqXHR) {
            usuario = data.usuario;
            disable = accion === "Borrando";
            cargarConcesionarios(toast, function () {
                $("#concesionario").prop("value", usuario.id_concesionario).prop("disabled", disable);
            });
            $("#tituloModal").text(accion + " a " + usuario.nombre);
            $("#nombre").prop("value", usuario.nombre).prop("disabled", disable);
            $("#email").prop("value", usuario.correo).prop("disabled", disable);
            $("#tel").prop("value", usuario.telefono).prop("disabled", disable);
            $("#rol").prop("value", usuario.rol).prop("disabled", disable);
            $("#password").prop("required", disable);
            if (disable) {
                $("#botonModal").text("Borrar");
                $("#botonModal").prop("aria-label", "Borrar a " + usuario.nombre);
            }
            else {
                $("#botonModal").text("Editar");
                $("#botonModal").prop("aria-label", "Editar a " + usuario.nombre);
            }
            callback();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#mensajeToast").text(jqXHR.responseJSON?.error || errorThrown);
            toast.show();
        }
    });
}

//EDITAR USUARIO
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

//AÑADIR USUARIO
function anadirUsuario(datos, toast) {
    $.ajax({
        url: "/api/usuarios/crear",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(datos),
        success: function (data, textStatus, jqXHR) {
            $("#modalAccion").modal("hide");
            if (data.id && data.id > 0) {
                editarUsuario(data.id, datos, toast, true);
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

//CARGAR SELECT DE CONCESIONARIOS DEL FORM 
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

//BORRAR USUARIO
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

////Validaciones////
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