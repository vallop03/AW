$(function () {
    const resultToast = document.querySelector("#registerResultToast .toast");
    const toast = new bootstrap.Toast(resultToast);
    cargarReservas(usuarioActual.id_usuario, toast);

    $("#infoReservas").on("click", ".activateButton", function (event) {
        idReservaSeleccionada = $(this).data("id_reserva");
        cambiarEstado("activa", idReservaSeleccionada, toast);
    });

    $("#infoReservas").on("click", ".cancelButton", function (event) {
        idReservaSeleccionada = $(this).data("id_reserva");
        cambiarEstado("cancelada", idReservaSeleccionada, toast);
    });

    $("#infoReservas").on("click", ".finalizeButton", function (event) {
        idReservaSeleccionada = $(this).data("id_reserva");
        cambiarEstado("finalizada", idReservaSeleccionada, toast);
    });
})

function cargarReservas(id, toast) {
    $.ajax({
        url: "/api/reservas/idUsuario/" + id,
        method: "GET",
        contentType: "application/json",
        success: function (data, textStatus, jqXHR) {
            $("#infoReservas").empty();
            reservas = data.reservas;

            if (reservas.length === 0) {
                $("#contenedorReservas").append(`
                    <div class="d-flex flex-column align-items-center justify-content-center text-center p-5">
                        <i class="bi bi-calendar-event-fill" style="font-size: 3rem; color: #6c757d;"></i>
                        <h5 class="mt-3">No se han encontrado reservas</h5>
                        <p class="text-muted">Añade una nueva reserva.</p>
                    </div>`
                );
                return;
            }
            reservas.forEach(reserva => {
                const recogida = new Date(reserva.fecha_inicio).toLocaleString("es-ES", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit"
                });
                const devolucion = new Date(reserva.fecha_fin).toLocaleString("es-ES", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit"
                });
                $("#infoReservas").append(
                    `<tr>
                        <td>${reserva.id_reserva}</td>
                        <td>${reserva.matricula}</td>
                        <td>${recogida}</td>
                        <td>${devolucion}</td>
                        <td>${reserva.estado}</td>
                        <td>
                            <button class="btn btn-success activateButton btn-sm" title="Activar" aria-label="Activar" data-id_reserva="${reserva.id_reserva}"><i class="bi bi-check-circle"></i></button>
                            <button class="btn btn-danger btn-sm cancelButton" title="Cancelar" aria-label="Cancelar" data-id_reserva="${reserva.id_reserva}"><i class="bi bi-x-circle"></i></button>
                            <button class="btn btn-secondary btn-sm finalizeButton" title="Finalizar" aria-label="Finalizar" data-id_reserva="${reserva.id_reserva}"><i class="bi bi-stop-circle"></i></button>
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

function cambiarEstado(estado, idReserva, toast) {
    $.ajax({
        url: "/api/reservas/" + estado + "/" + idReserva,
        method: "PUT",
        contentType: "application/json",
        success: function (data, textStatus, jqXHR) {
            $("#modalAccion").modal("hide");
            $("#mensajeToast").text(data.mensaje);
            toast.show();
            cargarReservas(usuarioActual.id_usuario, toast);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#mensajeToast").text(jqXHR.responseJSON?.error || errorThrown);
            toast.show();
        }
    })

}