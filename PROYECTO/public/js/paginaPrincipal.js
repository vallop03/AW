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

