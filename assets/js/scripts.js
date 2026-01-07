

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}


$(document).ready(function () {
//redireccionar en caso de sesion abierta
  const path = window.location.pathname;
  const pagina = path.split("/").pop();
  const usuarioLogueado = localStorage.getItem("usuarioLogueado");


  if ((pagina === "" || pagina === "index.html") && !usuarioLogueado) {
    window.location.href = "./assets/pages/login.html";
    return;
  }

  const paginasProtegidas = [
    "menu.html",
    "deposit.html",
    "sendmoney.html",
    "transactions.html"
  ];

  if (paginasProtegidas.includes(pagina) && !usuarioLogueado) {
    window.location.href = "../../index.html";
    return;
  }
//fin de redireccionar
//validaciones antes de enviar los datos
    $("#emailSesion").on("input", function () {
        let email = $(this).val().trim();

        if (email === "") {
            $("#error-emailSesion").text("El email es obligatorio").removeAttr("hidden");
        } else if (!validarEmail(email)) {
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
//fin validaciones
//envio de form con login
  $("#loginForm").on("submit", function (e) {
    e.preventDefault();

    const email = $("#emailSesion").val().trim();
    const password = $("#password").val().trim();

    if (!email || !password || password.length < 6) return;

    localStorage.setItem("usuarioLogueado", "true");

    $("#loader").removeClass("d-none");

    setTimeout(() => {
      window.location.href = "menu.html";
    }, 2000);
  });

  $(".action-btn").on("click", function () {
    const url = $(this).data("url");

    $("#loader").removeClass("d-none");

    setTimeout(() => {
      window.location.href = url;
    }, 2000);
  });
//fin de login con loader incluido

//logout
  $("#logout").on("click", function (e) {
    e.preventDefault();


    localStorage.removeItem("usuarioLogueado");
    window.location.href = "../../index.html";
});

});
