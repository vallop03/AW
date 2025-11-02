document.addEventListener("DOMContentLoaded", function () {

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

});