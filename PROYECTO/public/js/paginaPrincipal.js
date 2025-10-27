document.addEventListener("DOMContentLoaded", function () {

  const btnClaro = document.getElementById("tema-claro");
  const btnOscuro = document.getElementById("tema-oscuro");
  const titulo = document.querySelector(".titulo");

  const body = document.body;

  const temaGuardado = localStorage.getItem("tema");
  if (temaGuardado === "oscuro") {
    titulo.classList.add("dark-mode");
    body.classList.add("dark-mode");
  }

  btnClaro.addEventListener("click", function (e) {
    body.classList.remove("dark-mode");
    titulo.classList.remove("dark-mode");
    localStorage.setItem("tema", "claro");
  });

  btnOscuro.addEventListener("click", function (e) {
    body.classList.add("dark-mode");
    titulo.classList.add("dark-mode");
    localStorage.setItem("tema", "oscuro");
  });

});

// Example starter JavaScript for disabling form submissions if there are invalid fields

const form = document.getElementById("reservaForm");
form.addEventListener('submit', function (event) {
  if (!form.checkValidity()) {
    event.preventDefault()
    event.stopPropagation()
  }
  form.classList.add('was-validated');
});




document.getElementById("resetBtn").addEventListener("click", function () {
  const form = document.getElementById("reservaForm");
  form.classList.remove('was-validated');
});