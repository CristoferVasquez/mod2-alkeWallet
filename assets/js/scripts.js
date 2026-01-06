document.addEventListener("DOMContentLoaded", () => {

  const usuarioLogueado = localStorage.getItem("usuarioLogueado");

  if (
    window.location.pathname.endsWith("index.html") &&
    !usuarioLogueado
  ) {
    window.location.href = "./assets/pages/login.html";
    return;
  }


  if (window.location.pathname.includes("login.html")) {

    $(".action-btn").on("click", function () {
      const url = $(this).data("url");

      $("#loader").removeClass("d-none");

      localStorage.setItem("usuarioLogueado", "true");

      setTimeout(() => {
        window.location.href = url;
      }, 2000);
    });

  }

});

function validarFormatoEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

$(document).ready(function () {

// inicio de validacion validacion e ingreso de datos de form
    $("#emailSesion").on("input", function () {
        let email = $(this).val().trim();

        if (email === "") {
            $("#error-emailSesion").text("El email es obligatorio").removeAttr("hidden");
        } else if (!validarFormatoEmail(email)) {
            $("#error-emailSesion").text("Formato de email inválido").removeAttr("hidden");
        } else {
            $("#error-emailSesion").attr("hidden", true);
        }
    });

    $("#password").on("input", function () {
        let password = $(this).val().trim();

        if (password === "") {
            $("#error-password").text("La contraseña es obligatoria").removeAttr("hidden");
        } else if (password.length < 6) {
            $("#error-password").text("Mínimo 6 caracteres").removeAttr("hidden");
        } else {
            $("#error-password").attr("hidden", true);
        }
    });

    $("#loginForm").on("submit", function (e) {
        let email = $("#emailSesion").val().trim();
        let password = $("#password").val().trim();
        let valido = true;

        if (email === "" || !validarFormatoEmail(email)) {
            $("#error-emailSesion").text("Ingrese un email válido").removeAttr("hidden");
            valido = false;
        }

        if (password === "" || password.length < 6) {
            $("#error-password").text("Contraseña inválida").removeAttr("hidden");
            valido = false;
        }

        if (!valido) {
            e.preventDefault(); 
        }
    });

    $(".action-btn").on("click", function () {
        const url = $(this).data("url");
        $("#loader").removeClass("d-none");

        setTimeout(() => {
            window.location.href = url;
        }, 2000);
    });

/* fin validacion de email
----------------------------------------------------------------------*/


})

