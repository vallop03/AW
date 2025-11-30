$(cargarUsuarios);

$(function () {
    let modo = "editar";
    $("#infoUsuarios").on("click", ".editButton", function (event) {
        const id = $(this).data("id_usuario");
        if (id) {
            modo = "editar";
            $("#grupoPassword").hide();
            $("#modalAccion").modal("show");
            editarUsuario(id);
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

            $.ajax({
                url: "/api/usuarios/" + id,
                method: "PUT",
                contentType: "application/json",
                data: JSON.stringify(datos),
                success: function (data, textStatus, jqXHR) {
                    $("#modalAccion").modal("hide");
                    alert("Usuario creado");
                    cargarTablaUsuarios();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert("Error al crear: " + errorThrown);
                }
            })

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

function editarUsuario(id) {
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