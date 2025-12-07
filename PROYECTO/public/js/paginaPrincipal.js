$(function () {
    cargarTema();
    cargarFuente();

    const body = $("body");
    const table = $("table");

    ///////////////////TEMA////////////////////
    // Botón para cambiar a tema claro
    $("#tema-claro").on("click", function () {
        body.removeClass("dark-mode");
        if (table) {
            table.removeClass("table-dark");
        }
        $.ajax({
            url: "/api/preferencias/tema",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ tema: "claro" })
        });
    });

    // Botón para cambiar a tema oscuro
    $("#tema-oscuro").on("click", function () {
        body.addClass("dark-mode");
        if (table) {
            table.addClass("table-dark");
        }
        $.ajax({
            url: "/api/preferencias/tema",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ tema: "oscuro" })
        });
    });

    ////////////////////TAMAÑO DE FUENTE//////////////////
    $("#fuente-pequena").on("click", function () {
        body.removeClass("fuente-normal fuente-grande").addClass("fuente-pequena");
        guardarFuente("pequena");
    });

    // Tamaño normal
    $("#fuente-normal").on("click", function () {
        body.removeClass("fuente-pequena fuente-grande").addClass("fuente-normal");
        guardarFuente("normal");
    });

    // Tamaño grande
    $("#fuente-grande").on("click", function () {
        body.removeClass("fuente-pequena fuente-normal").addClass("fuente-grande");
        guardarFuente("grande");
    });
})

function cargarTema() {
    const body = $("body");
    const table = $("table");

    $.ajax({
        url: "/api/preferencias/tema",
        method: "GET",
        contentType: "application/json",
        success: function (data) {
            if (data.tema === "oscuro") {
                body.addClass("dark-mode");
                if (table) {
                    table.addClass("table-dark");
                }
            } else {
                body.removeClass("dark-mode");
                if (table) {
                    table.removeClass("table-dark");
                }
            }
        }
    });
}

function cargarFuente() {
    const body = $("body");

    $.ajax({
        url: "/api/preferencias/fuente",
        method: "GET",
        contentType: "application/json",
        success: function (data) {
            body.removeClass("fuente-pequena fuente-normal fuente-grande");

            if (data.fuente === "pequena")
                body.addClass("fuente-pequena");
            else if (data.fuente === "grande")
                body.addClass("fuente-grande");
            else
                body.addClass("fuente-normal");
        }
    });
}

function guardarFuente(fuente) {
    $.ajax({
        url: "/api/preferencias/fuente",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ fuente })
    });
}