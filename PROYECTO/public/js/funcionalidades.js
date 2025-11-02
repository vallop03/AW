document.addEventListener("DOMContentLoaded", function () {


    const body = document.body;

    const temaGuardado = localStorage.getItem("tema");
    if (temaGuardado === "oscuro") {
        body.classList.add("dark-mode");
    }

});