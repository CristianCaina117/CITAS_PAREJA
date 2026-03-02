// =============================
// FORMATEAR FECHA BONITA
// =============================
function formatearFechaBonita(textoFecha) {
  const fecha = new Date(textoFecha + "T00:00:00");

  const opciones = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };

  const fechaFormateada = fecha.toLocaleDateString("es-ES", opciones);

  return fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);
}

// =============================
// INICIALIZAR CALENDARIOS
// =============================
document.addEventListener("DOMContentLoaded", function () {

  flatpickr("#date1", {
    dateFormat: "Y-m-d",
    minDate: "today",
    locale: "es"
  });

  flatpickr("#date2", {
    dateFormat: "Y-m-d",
    minDate: "today",
    locale: "es"
  });

  flatpickr("#date3", {
    dateFormat: "Y-m-d",
    minDate: "today",
    locale: "es"
  });

});

// =============================
// LEER PARAMETROS DEL LINK
// =============================
const params = new URLSearchParams(window.location.search);
const phoneNumber = params.get("phone");
const fromName = params.get("from");

// =============================
// RESPUESTA SI
// =============================
window.handleYes = function () {

  const date1 = document.getElementById("date1").value;
  const date2 = document.getElementById("date2").value;
  const date3 = document.getElementById("date3").value;

  const response = document.getElementById("response");

  response.innerHTML = `
    <h2>Escoge una fecha 💕</h2>
    <div class="date-options">
      ${date1 ? `<button class="date-pill">${formatearFechaBonita(date1)}</button>` : ""}
      ${date2 ? `<button class="date-pill">${formatearFechaBonita(date2)}</button>` : ""}
      ${date3 ? `<button class="date-pill">${formatearFechaBonita(date3)}</button>` : ""}
    </div>
  `;

  const buttons = document.querySelectorAll(".date-pill");

  buttons.forEach(btn => {
    btn.addEventListener("click", function () {

    if (btn.classList.contains("selected")) return;

    buttons.forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");

    const fechaElegida = btn.textContent;

    response.innerHTML = `
        <h2>Perfecto 💕 entonces nos vemos el</h2>
        <h1 style="margin-top:15px">${fechaElegida}</h1>
    `;

    lanzarConfeti();

    // 📲 ENVIAR A WHATSAPP
    if (phoneNumber) {
        const mensaje = `Hola ${fromName || ""} 💕 acepté la cita para el ${fechaElegida} 😍`;
        const urlWhatsApp = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(mensaje)}`;

        setTimeout(() => {
        window.open(urlWhatsApp, "_blank");
        }, 1500);
    }

    });
  });
};

// =============================
// CONFETI
// =============================
function lanzarConfeti() {

  const duration = 3 * 1000;
  const animationEnd = Date.now() + duration;

  const interval = setInterval(function () {
    if (Date.now() > animationEnd) {
      return clearInterval(interval);
    }

    confetti({
      particleCount: 3,
      spread: 60,
      origin: { y: 0.6 }
    });

  }, 200);
}