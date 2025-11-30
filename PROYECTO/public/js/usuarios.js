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


    $("#botonModal").on("click", function (event) {

        let datos = {
            nombre: $("#nombre").prop("value"),
            correo: $("#email").prop("value"),
            telefono: $("#tel").prop("value"),
            concesionario: $("#concesionario").prop("value"),
            rol: $("#rol").prop("value")
        };

        if (modo === "editar") {
            editarUsuario(idUsuarioSeleccionado, datos, toast);
        }

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
            $("#concesionario").prop("value", usuario.concesionario);
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