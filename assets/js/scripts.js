

function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

const infoContactos = JSON.parse(localStorage.getItem("contactos")) || [];
const infoMovimientos = JSON.parse(localStorage.getItem("movimientos")) || [];


function calcularSaldo() {
  let saldo = 0;
  infoMovimientos.forEach(mov => {
    saldo += mov.tipo ? mov.monto : -mov.monto;
    });
  $("#saldo").text(`$ ${saldo.toLocaleString("es-CL")}`);
        
}

function obtenerSaldoActual() {
  let saldo = 0;
  const movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];

  movimientos.forEach(mov => {
    saldo += mov.tipo ? mov.monto : -mov.monto;
  });

  return saldo;
}

localStorage.setItem("contactos", JSON.stringify(infoContactos));
localStorage.setItem("movimientos", JSON.stringify(infoMovimientos));


function obtenerContactos() {
  return JSON.parse(localStorage.getItem("contactos")) || [];
}

function guardarContactos(contactos) {
  localStorage.setItem("contactos", JSON.stringify(contactos));
}

function renderizarContactos(contactos, contenedor) {
  contenedor.empty();

  if (contactos.length === 0) {
    contenedor.append(
      `<li class="list-group-item text-muted">Sin resultados</li>`
    );
    return;
  }

  contactos.forEach(c => {
    contenedor.append(`
      <li class="list-group-item">
        <div class="d-flex justify-content-between align-items-start">

          <div class="form-check mr-3">
            <input
              class="form-check-input contacto-radio"
              type="radio"
              name="contactoSeleccionado"
              value="${c._index}"
            >
            <label class="form-check-label">
              <strong>${c.nombre} ${c.apellido}</strong><br>
              <small>${c.alias} · ${c.nombreBanco} · ${c.numeroCBU}</small>
            </label>
          </div>

          <div class="flujo-envio d-none" data-index="${c._index}">
            <input
              type="number"
              class="form-control form-control-sm monto-input mb-1"
              placeholder="$ Monto"
              min="1"
            >
            <button
              class="btn btn-sm btn-primary w-100 btn-enviar"
              disabled
            >
              Enviar
            </button>
          </div>

        </div>
      </li>
    `);
  });
}


function getTipoTransaccion(movimiento) {
  return movimiento?.Categoria?.toLowerCase() || "";
}


if (!localStorage.getItem("movimientos")) {
  localStorage.setItem("movimientos", JSON.stringify([]));
}

function mostrarUltimosMovimientos(filtro = "todos") {
  const lista = $("#listaMovimientos");
  lista.empty();

  let movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];

  if (filtro !== "todos") {
    movimientos = movimientos.filter(mov => {
      const categoria = getTipoTransaccion(mov);

      if (filtro === "compra")
        return categoria === "compra";

      if (filtro === "deposito")
        return categoria === "deposito" || categoria === "deposito_misma_cuenta";

      if (filtro === "transferencia_recibida")
        return categoria === "transferencia_recibida";

      if (filtro === "transferencia")
        return categoria === "transferencia" || categoria === "transferencia_tercero";

      return true;
    });
  }

  if (movimientos.length === 0) {
    lista.append(`
      <li class="list-group-item text-muted text-center">
        No hay movimientos para este filtro
      </li>
    `);
    return;
  }

  movimientos.forEach(mov => {
    lista.append(`
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <div>
          <strong>${mov.data}</strong><br>
          <small class="text-muted">
            ${formatearCategoria(mov.Categoria)}
          </small>
        </div>
        <span class="${mov.tipo ? "text-success" : "text-danger"}">
          ${mov.tipo ? "+" : "-"}$${Number(mov.monto).toLocaleString("es-CL")}
        </span>
      </li>
    `);
  });
}

function formatearCategoria(categoria) {
  if (!categoria) return "Sin categoría";

  const cat = categoria.toLowerCase();

  switch (cat) {
    case "compra":
      return "Compra";
    case "deposito":
      return "Depósito";
    case "deposito_misma_cuenta":
      return "Depósito misma cuenta";
    case "transferencia_recibida":
      return "Transferencia recibida";
    case "transferencia":
    case "transferencia_tercero":
      return "Transferencia enviada";
    default:
      return categoria;
  }
}

$(document).ready(function () {

  /* ---------- router ---------- */

  const pagina = window.location.pathname.split("/").pop();
  const usuarioLogueado = localStorage.getItem("usuarioLogueado");

  if ((pagina === "" || pagina === "index.html") && !usuarioLogueado) {
    window.location.replace("./assets/pages/login.html");
    return;
  }

  const paginasProtegidas = [
    "menu.html",
    "deposit.html",
    "sendmoney.html",
    "transactions.html"
  ];

  if (paginasProtegidas.includes(pagina) && !usuarioLogueado) {
    window.location.replace("./assets/pages/login.html");
    return;
  }
  /*------------validaciones pre login ----------*/

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


  /* ---------- login ---------- */

  $("#emailSesion").on("input", function () {
    const email = $(this).val().trim();
    $("#error-emailSesion")
      .toggleClass("d-none", email !== "" && validarEmail(email));
  });

  $("#password").on("input", function () {
    const password = $(this).val().trim();
    $("#error-password")
      .toggleClass("d-none", password.length >= 6);
  });

  $("#loginForm").on("submit", function (e) {
    e.preventDefault();

    const email = $("#emailSesion").val().trim();
    const password = $("#password").val().trim();

    if (!email || !validarEmail(email) || password.length < 6) return;

    localStorage.setItem("usuarioLogueado", "true");
    $("#loader").removeClass("d-none");

    setTimeout(() => {
      window.location.replace("menu.html");
    }, 1500);
  });

  $(".action-btn").on("click", function () {
    const url = $(this).data("url");
    $("#loader").removeClass("d-none");
    setTimeout(() => window.location.href = url, 1500);
  });

  $("#logout").on("click", function (e) {
    e.preventDefault();
    localStorage.removeItem("usuarioLogueado");
    window.location.replace("../../index.html");
  });

  /* ---------- ver contactos y agregar ---------- */

  let contactos = obtenerContactos()
    .map((c, i) => ({ ...c, _index: i }));

  renderizarContactos(contactos, $("#listaContactos"));

  $("#searchContact").on("keyup", function () {
    const termino = $(this).val().toLowerCase().trim();

    if (!termino) {
      $("#filtroContactos").addClass("d-none");
      $("#listaContactos").removeClass("d-none");
      return;
    }

    const filtrados = contactos.filter(c =>
      c.nombre.toLowerCase().includes(termino) ||
      c.apellido.toLowerCase().includes(termino) ||
      (c.alias && c.alias.toLowerCase().includes(termino)) ||
      (c.numeroCBU && c.numeroCBU.includes(termino))
    );

    $("#listaContactos").addClass("d-none");
    $("#filtroContactos").removeClass("d-none");

    renderizarContactos(filtrados, $("#filtroContactos"));
  });

  $("#btnGuardarContacto").on("click", function () {

    const nuevo = {
      nombre: $("#nombre").val().trim(),
      apellido: $("#apellido").val().trim(),
      numeroCBU: $("#cbu").val().trim(),
      alias: $("#alias").val().trim(),
      nombreBanco: $("#banco").val().trim()
    };

    if (
      !nuevo.nombre ||
      !nuevo.apellido ||
      !/^\d{6,22}$/.test(nuevo.numeroCBU)
    ) return;

    contactos.push({ ...nuevo, _index: contactos.length });
    guardarContactos(contactos);

    renderizarContactos(contactos, $("#listaContactos"));
    $("#modalContacto").modal("hide");
    $("#nombre, #apellido, #cbu, #alias, #banco").val("");
  });

  /* ---------- transferencias ---------- */

  $(document).on("change", ".contacto-radio", function () {
    const index = $(this).val();
    $(".flujo-envio").addClass("d-none");
    $(`.flujo-envio[data-index="${index}"]`).removeClass("d-none");
  });

$(document).on("input", ".monto-input", function () {
  const monto = Number($(this).val());
  const saldo = obtenerSaldoActual();

  $(this)
    .closest(".flujo-envio")
    .find(".btn-enviar")
    .prop("disabled", !(monto > 0 && monto <= saldo));
});

  $(document).on("click", ".btn-enviar", function () {
    const flujo = $(this).closest(".flujo-envio");
    const index = flujo.data("index");
    const monto = Number(flujo.find(".monto-input").val());

    if (!(monto > 0)) return;
    
    const saldoActual = obtenerSaldoActual();

  if (monto > saldoActual) {
    alert("Saldo insuficiente. El monto a transferir supera el saldo disponible.");
    return;
  }

    const contacto = contactos.find(c => c._index === index);

    infoMovimientos.push({
      data: `Transferencia a ${contacto.nombre}`,
      tipo: false,
      Categoria: "transferencia_tercero",
      monto
    });

    localStorage.setItem("movimientos", JSON.stringify(infoMovimientos));

    $("#mensaje-envio").html(`
      Transferencia realizada a <strong>${contacto.nombre}</strong>
      por <strong>$${monto.toLocaleString("es-CL")}</strong>
    `);

    $("#confirmacion-envio")
      .removeClass("d-none")
      .hide()
      .fadeIn();

    $(".flujo-envio").addClass("d-none");
    $("input[name='contactoSeleccionado']").prop("checked", false);

    setTimeout(() => $("#confirmacion-envio").fadeOut(), 3000);
  });


    /*-----------Mostrar los movimientos y filtro--------------- */
    mostrarUltimosMovimientos("todos");

    $("#filtroMovimientos").on("change", function () {
        mostrarUltimosMovimientos($(this).val());
    });

    /*-----------------Depositos-------------- */

    calcularSaldo();

    $("#depositForm").on("submit", function (e) {
        e.preventDefault();

        const monto = parseInt($("#depositAmount").val());
        if (isNaN(monto) || monto <= 0) return;

        infoMovimientos.push({
            data: "Depósito",
            tipo: true,
            Categoria:"deposito_misma_cuenta",
            monto
        });

        localStorage.setItem("movimientos", JSON.stringify(infoMovimientos));
        calcularSaldo();

        $("#alert-container").html(`
            <div class="alert alert-success text-center fade show">
                 Depósito realizado por <strong>$${monto.toLocaleString("es-CL")}</strong><br>
                <small>Redirigiendo al menú principal...</small>
            </div>
        `);

        $("#depositAmount").val("");

        setTimeout(() => {
            window.location.href = "menu.html";
        }, 2000);
    });


});
