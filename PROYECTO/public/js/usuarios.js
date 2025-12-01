let modo = "editar";
let idUsuarioSeleccionado = null;
$(cargarUsuarios);
$(function () {
    const resultToast = document.querySelector("#registerResultToast .toast");
    const toast = new bootstrap.Toast(resultToast);
    $("#infoUsuarios").on("click", ".editButton", function (event) {
        idUsuarioSeleccionado = $(this).data("id_usuario");
        if (idUsuarioSeleccionado) {
            modo = "editar";
            $("#grupoPassword").hide();
            $("#modalAccion").modal("show");
            cargarModal(idUsuarioSeleccionado);
        }
    });

    $("#anadirUsuarioBoton").on("click", function (event) {
        modo = "anadir";
        $("#grupoPassword").show();
        $("#modalAccion").modal("show");

    });

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
        if(modo === "anadir"){
            datos.password = $("#password").prop("value");           
            valido = comprobarValidacion($("#password")[0]) && valido;
        }

        if (!valido) {
            event.preventDefault();
            event.stopPropagation();
            $("#mensajeToast").text("Algunos campos son no son válidos.");
            toast.show();
        }
        else if (modo === "editar") {
            editarUsuario(idUsuarioSeleccionado, datos, toast);
        }
        else if (modo === "anadir") {

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

function cargarModal(id) {
    $.ajax({
        url: "/api/usuarios/" + id,
        method: "GET",
        contentType: "application/json",
        success: function (data, textStatus, jqXHR) {
            usuario = data.usuario;
            $("#registroUsuarioForm").prop("method")
            $("#tituloModal").text("Editando a " + usuario.nombre);
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
            $("#mensajeToast").text("Usuario actualizado correctamente");
            toast.show();
            cargarUsuarios();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            toast.show();
            $("#mensajeToast").text("Error en el servidor");
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