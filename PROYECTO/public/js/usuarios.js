$(cargarUsuarios);

$(function () {
    $("#infoUsuarios").on("click", ".editButton", function (event) {
        const id = $(this).data("id_usuario");
        if (id)
            editarUsuario(id);
    });
    
})

function cargarUsuarios() {
    $.ajax({
        url: "/api/usuarios/",
        method: "GET",
        contentType: "application/json",
        success: function (data, textStatus, jqXHR) {
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
        url: "/api/usuarios/:id",
        method: "GET",
        contentType: "application/json",
        success: function (data, textStatus, jqXHR) {
            $("#tituloModal").text("Editando usuario con ID" + id);
            $("#cuerpoModal").append(`<form id="registroUsuarioForm" novalidate method="POST" action="/registroUsuario">
                    <div class="mb-3">
                        <label for="nombre" class="form-label">Nombre*</label>
                        <input type="text" class="form-control" id="nombre" name="nombre" required>
                        <span class="invalid-feedback" aria-live="polite">
                            Por favor, introduce un nombre válido con más de 2 carácteres.
                        </span>
                    </div>
                    <div class="mb-3">
                        <label for="email" class="form-label">Correo electrónico*</label>
                        <input type="email" class="form-control" id="email" name="email" required>
                        <span class="invalid-feedback" aria-live="polite">
                            Por favor, introduce un correo electrónico válido.
                        </span>
                    </div>
                    <div class="mb-3">
                        <label for="password" class="form-label">Contraseña*</label>
                        <input type="password" class="form-control" id="password" name="password"
                            pattern="(?=.*\d)(?=.*[A-Z])(?=.*[@$!%*?&.,;:_\-]).{8,}" required>
                        <span class="invalid-feedback" aria-live="polite">
                            La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter
                            especial.
                        </span>
                    </div>

                    <div class="mb-3">
                        <label for="tel" class="form-label">Teléfono</label>
                        <input id="tel" type="tel" class="form-control" name="tel" pattern="[0-9]{9}">
                        <span class="invalid-feedback" aria-live="polite">
                            Por favor, introduce un número de teléfono válido de 9 dígitos.
                        </span>
                    </div>

                    <div class="mb-4">
                        <label for="concesionario" class="form-label">Concesionario*</label>
                        <select class="form-select" id="concesionario" name="concesionario" required>
                            <option selected disabled value="">Selecciona un concesionario</option>
                            <option value="1">Mercedes</option>
                        </select>
                        <span class="invalid-feedback" aria-live="polite">
                            Por favor, selecciona un concesionario.
                        </span>
                    </div>

                    <div class="mb-4">
                            <label for="rol" class="form-label">Rol*</label>
                            <select class="form-select" id="rol" name="rol" required>
                                <option selected disabled value="">Selecciona un rol</option>
                                <option value="empleado">Empleado</option>
                                <option value="admin">Administrador</option>
                            </select>
                            <span class="invalid-feedback" aria-live="polite">
                                Por favor, selecciona un rol.
                            </span>
                    </div>

                    <div class="mt-3">
                        <button id="resetBtn" class="btn btn-secondary" type="reset">Limpiar</button>
                        <button class="btn btn-primary ms-2" type="submit">Enviar</button>
                    </div>
                </form>`)
                $("#modal").show;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Se ha producido un error: " + errorThrown);
        }
    });
}