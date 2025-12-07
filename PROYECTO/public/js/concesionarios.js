let modo = "Editando";
let idConcesionarioSeleccionado = null;
$(function () {
    const resultToast = document.querySelector("#registerResultToast .toast");
    const toast = new bootstrap.Toast(resultToast);
    cargarConcesionarios(toast);
    
        ////////////////PARTE DE LA PRIMERA VISTA (LA TABLA)/////////////

    //Cuando se le da al botón de editar (el del lápiz)
    $("#infoConcesionarios").on("click", ".editButton", function (event) {
        $("#registroConcesionarioForm .is-valid, #registroConcesionarioForm .is-invalid").removeClass("is-valid is-invalid");
        idConcesionarioSeleccionado = $(this).data("id_concesionario");
        if (idConcesionarioSeleccionado) {
            modo = "Editando";
            cargarModal(idConcesionarioSeleccionado, modo);
            $("#modalAccion_c").modal("show");
        }
    });

    //Cuando se le da al botón de eliminar (la papelera)
    $("#infoConcesionarios").on("click", ".deleteButton", function (event) {
        $("#registroConcesionarioForm .is-valid, #registroConcesionarioForm .is-invalid").removeClass("is-valid is-invalid");
        idConcesionarioSeleccionado = $(this).data("id_concesionario");
        if (idConcesionarioSeleccionado) {
            modo = "Borrando";
            cargarModal(idConcesionarioSeleccionado, modo);
            $("#modalAccion_c").modal("show");
        }
    });

    //Cuando se le da a crear usuario
    $("#anadirConcesionarioBoton").on("click", function (event) {
        $("#registroConcesionarioForm .is-valid, #registroConcesionarioForm .is-invalid").removeClass("is-valid is-invalid");
        modo = "anadir";
        $("#tituloModal_c").text("Creando concesionario");
        activarModal(false); //hace que los campos del form se activen para escribir
        $("#botonModal_c").text("Añadir");
        $("#registroConcesionarioForm")[0].reset(); //para limpiar el form
        $("#modalAccion_c").modal("show");
    });

    //Cuando se le da a anadir por JSON
    $("#anadirPorJSONBoton").on("click", function (event) {
        $("#inputJSON").click();  // abre el selector de archivos
    });

    // Leer el archivo JSON cuando se seleccione
    $("#inputJSON").on("change", function (event) {
        const archivo = event.target.files[0];
        if (!archivo) return;

        const lector = new FileReader();

        lector.onload = function(e) {
            try {
                const lista = JSON.parse(e.target.result);
                
                let exitos = 0;
                let fallos = 0;
                let fallosDetalle = [];
                
                if (!Array.isArray(lista)) {
                    alert("El archivo debe contener una lista JSON.");
                    return;
                }

                lista.forEach(concesionario => { //Se añaden los concesionarios uno a uno
                    const datos = {
                        nombre: concesionario.nombre || "",
                        ciudad: concesionario.ciudad || "",
                        direccion: concesionario.direccion || "",
                        telefono: concesionario.telefono_contacto || ""
                    };

                    if (comprobarValidacionJSON(datos)) {
                        anadirConcesionario(datos, toast);
                        toast.hide();
                        exitos++;

                    } else {
                        fallos++;
                        fallosDetalle.push(datos.nombre || "Sin nombre");
                    }
                });

                //Resumen importaciones
                let mensajeResumen = `Importación finalizada.\nConcesionarios añadidos: ${exitos}\nConcesionarios inválidos: ${fallos}`;
                if(fallosDetalle.length > 0){
                    mensajeResumen += `\nFallo en: ${fallosDetalle.join(", ")}`;
                }
                $("#mensajeToast").html(mensajeResumen);
                toast.show();

            } catch (err) {
                $("#mensajeToast").text("Algo ha salido mal leyendo el JSON: " + err.message);
                toast.show();
            }
        };

        lector.readAsText(archivo);
    });

     /////////////PARTE DEL MODAL/////////////

    //Cuando se le da a enviar tras crear/ modificar o eliminar del modal, comprueba la validacion
    //de todos los campos y despues llama a su respectiva funcion de crear/modificar o eliminar
    $("#botonModal_c").on("click", function (event) {

        let datos = {
            nombre: $("#nombre_c").prop("value"),
            ciudad: $("#ciudad_c").prop("value"),
            direccion: $("#dir_c").prop("value"),
            telefono: $("#tel_c").prop("value")
        };

        let valido = comprobarNombre($("#nombre_c")[0]);
        valido = comprobarValidacion($("#ciudad_c")[0]) && valido;
        valido = comprobarValidacion($("#dir_c")[0]) && valido;
        valido = comprobarValidacion($("#tel_c")[0]) && valido;
        if (!valido) {
            event.preventDefault();
            event.stopPropagation();
            $("#mensajeToast").text("Algunos campos no son válidos.");
            toast.show();
        }
        else if (modo === "Editando") {
            editarConcesionario(idConcesionarioSeleccionado, datos, toast, false);
        }
        else if (modo === "anadir") {
            anadirConcesionario(datos, toast);
        }
        else if (modo === "Borrando") {
            borrarConcesionario(idConcesionarioSeleccionado, toast);
        }
    });

    //comprobacion en vivo de los campos
    $("#nombre_c").on("input", function () {
        comprobarNombre(this);
    });

    $("#ciudad_c").on("input", function () {
        comprobarValidacion(this);
    });

    $("#dir_c").on("input", function () {
        comprobarValidacion(this);
    });

    $("#tel_c").on("input", function () {
        comprobarValidacion(this);
    });  
})

function cargarConcesionarios(toast) {
    $.ajax({
        url: "/api/concesionarios/",
        method: "GET",
        contentType: "application/json",
        success: function (data, textStatus, jqXHR) {
            $("#infoConcesionarios").empty();
            concesionarios = data.concesionarios;
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
                        <td>
                            <button class="btn btn-danger deleteButton" type="button" data-id_concesionario="${concesionario.id_concesionario}">
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

function activarModal(desactivado) {
    $("#nombre_c").prop("disabled", desactivado);
    $("#ciudad_c").prop("disabled", desactivado);
    $("#dir_c").prop("disabled", desactivado);
    $("#tel_c").prop("disabled", desactivado);
}

function cargarModal(id, accion, toast) {
    $.ajax({
        url: "/api/concesionarios/" + id,
        method: "GET",
        contentType: "application/json",
        success: function (data, textStatus, jqXHR) {
            concesionario = data.concesionario;
            disable = accion === "Borrando";
            $("#tituloModal_c").text(accion + " a " + concesionario.nombre);
            $("#nombre_c").prop("value", concesionario.nombre).prop("disabled", disable);
            $("#ciudad_c").prop("value", concesionario.ciudad).prop("disabled", disable);
            $("#dir_c").prop("value", concesionario.direccion).prop("disabled", disable);
            $("#tel_c").prop("value", concesionario.telefono_contacto).prop("disabled", disable);
            if (disable) {
                $("#botonModal_c").text("Borrar");
            }
            else {
                $("#botonModal_c").text("Editar");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#mensajeToast").text(jqXHR.responseJSON?.error || errorThrown);
            toast.show();
        }
    });
}

function editarConcesionario(id, datos, toast, reactivar) {
    $.ajax({
        url: "/api/concesionarios/editar/" + id,
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify(datos),
        success: function (data, textStatus, jqXHR) {
            console.log('hola', data);
            $("#modalAccion_c").modal("hide");
            if (reactivar) {
                $("#mensajeToast").text("Concesionario reactivado correctamente");
            }
            else {
                $("#mensajeToast").text(data.mensaje);
            }
            toast.show();
            cargarConcesionarios(toast);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#mensajeToast").text(jqXHR.responseJSON?.error || errorThrown);
            toast.show();
        }
    })
}

function anadirConcesionario(datos, toast) {
    $.ajax({
        url: "/api/concesionarios/crear",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(datos),
        success: function (data, textStatus, jqXHR) {
            $("#modalAccion_c").modal("hide");
            $("#mensajeToast").text(data.mensaje);
            toast.show();
            cargarConcesionarios(toast);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#mensajeToast").text(jqXHR.responseJSON?.error || errorThrown);
            toast.show();
            
        }
    })
}

function borrarConcesionario(id, toast) {
    $.ajax({
        url: "/api/concesionarios/borrar/" + id,
        method: "PUT",
        contentType: "application/json",
        success: function (data, textStatus, jqXHR) {
            $("#modalAccion_c").modal("hide");
            $("#mensajeToast").text(data.mensaje);
            toast.show();
            cargarConcesionarios(toast);
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

function comprobarValidacionJSON(input) {
    if (!input.nombre || input.nombre.trim().length < 3) return false;
    if (!input.ciudad || input.ciudad.trim() === "") return false;
    if (!input.direccion || input.direccion.trim() === "") return false;
    if (!/^\d{9}$/.test(input.telefono || "")) return false;
    return true;
}