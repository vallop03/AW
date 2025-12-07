$(function () {
  cargarTema();

  // Botón para cambiar a tema claro
  $("#btnClaro").on("click", function () {
    body.removeClass("dark-mode");
    $.ajax({
      url: "/api/preferencias/tema",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ tema: "claro" })
    });
  });

  // Botón para cambiar a tema oscuro
  $("#btnOscuro").on("click", function () {
    body.addClass("dark-mode");
    $.ajax({
      url: "/api/preferencias/tema",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ tema: "oscuro" })
    });
  });
})

function cargarTema() {
  const body = $("body");
  $.ajax({
    url: "/api/preferencias/tema",
    method: "GET",
    contentType: "application/json",
    success: function (data) {
      if (data.tema === "oscuro") {
        body.addClass("dark-mode");
      } else {
        body.removeClass("dark-mode");
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {

  const btnClaro = document.getElementById("tema-claro");
  const btnOscuro = document.getElementById("tema-oscuro");

  const body = document.body;

  btnClaro.addEventListener("click", function (e) {
    body.classList.remove("dark-mode");
    localStorage.setItem("tema", "claro");
  });

  btnOscuro.addEventListener("click", function (e) {
    body.classList.add("dark-mode");

    localStorage.setItem("tema", "oscuro");
  });

  const temaGuardado = localStorage.getItem("tema");
  if (temaGuardado === "oscuro") {
    body.classList.add("dark-mode");
  }

});

