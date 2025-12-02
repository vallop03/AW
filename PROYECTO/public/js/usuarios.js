let modo = "Editando";
let idUsuarioSeleccionado = null;
$(cargarUsuarios);
$(function () {
    const resultToast = document.querySelector("#registerResultToast .toast");
    const toast = new bootstrap.Toast(resultToast);

    //Cuando se le da al botón de editar (el del lápiz)
    $("#infoUsuarios").on("click", ".editButton", function (event) {
        $("#registroUsuarioForm .is-valid, #registroUsuarioForm .is-invalid").removeClass("is-valid is-invalid");
        idUsuarioSeleccionado = $(this).data("id_usuario");
        if (idUsuarioSeleccionado) {
            modo = "Editando";
            $("#grupoPassword").hide();
            cargarModal(idUsuarioSeleccionado, modo);
            $("#modalAccion").modal("show");
        }
    });

    //Cuando se le da a crear usuario
    $("#anadirUsuarioBoton").on("click", function (event) {
        $("#registroUsuarioForm .is-valid, #registroUsuarioForm .is-invalid").removeClass("is-valid is-invalid");
        modo = "anadir";
        $("#tituloModal").text("Creando usuario");
        $("#grupoPassword").show();
        $("#password").prop("required", true);
        $("#registroUsuarioForm")[0].reset(); //para limpiar el form
        $("#modalAccion").modal("show");
    });

    //Cuando se le da a enviar tras crear/ modificar o eliminar
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
            $("#mensajeToast").text("Algunos campos son no son válidos.");
            toast.show();
        }
        else if (modo === "Editando") {
            editarUsuario(idUsuarioSeleccionado, datos, toast);
        }
        else if (modo === "anadir") {
            anadirUsuario(datos, toast);
        }
    });

    $("#nombre").on("input", function () {
        comprobarNombre(this);
    });

    $("#email").on("input", function () {
        comprobarValidacion(this);
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

function cargarUsuarios() {
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
                            <button class="btn btn-primary editButton" type="button" data-id_usuario="${usuario.id_usuario}">
                                <i class="bi bi-pencil"></i>
                            </button>
                        </td>
                        <td>
                            <button class="btn btn-danger deleteButton" type="button" data-id_usuario="${usuario.id_usuario}">
                                <i class="bi bi-trash3"></i>
                            </button>
                        </td>
                    </tr>`);
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Se ha producido un error: " + errorThrown);
        }
    });
}

function cargarModal(id, accion) {
    $.ajax({
        url: "/api/usuarios/" + id,
        method: "GET",
        contentType: "application/json",
        success: function (data, textStatus, jqXHR) {
            usuario = data.usuario;
            $("#tituloModal").text(accion + " a " + usuario.nombre);
            $("#nombre").prop("value", usuario.nombre);
            $("#email").prop("value", usuario.correo);
            $("#tel").prop("value", usuario.telefono);
            $("#concesionario").prop("value", usuario.id_concesionario);
            $("#rol").prop("value", usuario.rol);
            $("#password").prop("required", false);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Se ha producido un error: " + errorThrown);
        }
    });
}

function editarUsuario(id, datos, toast) {
    $.ajax({
        url: "/api/usuarios/" + idUsuarioSeleccionado,
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify(datos),
        success: function (data, textStatus, jqXHR) {
            $("#modalAccion").modal("hide");
            $("#mensajeToast").text(data.mensaje);
            toast.show();
            cargarUsuarios();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            toast.show();
            $("#mensajeToast").text("errorThrown");
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
            $("#mensajeToast").text(data.mensaje);
            toast.show();
            cargarUsuarios();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            toast.show();
            $("#mensajeToast").text(jqXHR.responseJSON?.error);
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