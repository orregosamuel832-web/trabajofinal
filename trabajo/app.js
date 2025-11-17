const catalogo = [
    { id: 1, marca: "Mazda", modelo: "Mazda 3", precio: 95000000, motor: "2.0L", potencia: "153 HP", transmision: "Automática", consumo: "45 km/galón", img: "images/mazda3.jpg" },
    { id: 2, marca: "Mazda", modelo: "CX-30", precio: 130000000, motor: "2.5L", potencia: "186 HP", transmision: "Automática", consumo: "40 km/galón", img: "images/cx30.jpg" },
    { id: 3, marca: "Mazda", modelo: "CX-5", precio: 165000000, motor: "2.5L Turbo", potencia: "250 HP", transmision: "Automática", consumo: "35 km/galón", img: "images/cx5.jpg" }
];

function formatCOP(n) {
    return new Intl.NumberFormat('es-CO').format(n) + " COP";
}

const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const usuario = loginForm.querySelector('input[type="text"]').value.trim();
        const pass = loginForm.querySelector('input[type="password"]').value.trim();
        if (!usuario || !pass) { showToast("Completa usuario y contraseña"); return; }
        const userGuardado = JSON.parse(localStorage.getItem("usuarioRegistrado"));
        if (!userGuardado) { showToast("No existe ninguna cuenta registrada"); return; }
        if (usuario !== userGuardado.usuario || pass !== userGuardado.pass) { showToast("Credenciales incorrectas"); return; }
        localStorage.setItem("usuarioLogueado", usuario);
        document.body.classList.add('page-out');
        setTimeout(() => location.href = "inicio.html", 400);
    });
}

const registerForm = document.getElementById("registerForm");
if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
        e.preventDefault();
        alert("Registro exitoso. Ahora inicia sesión.");
        window.location.href = "index.html";
    });
}

const gridContainer = document.getElementById('catalog-grid');
if (gridContainer) {
    catalogo.forEach(item => {
        const card = document.createElement('article');
        card.className = 'card car-card';
        card.innerHTML = `
      <div class="car-img-wrap">
        <img src="${item.img}" alt="${item.modelo}" onerror="this.src='images/placeholder.jpg'">
      </div>
      <h3>${item.marca} ${item.modelo}</h3>
      <p class="price">${formatCOP(item.precio)}</p>
      <div class="card-actions">
        <button class="btn small" onclick="verFicha(${item.id})">Ficha</button>
        <button class="btn small outline" onclick="seleccionarVenta(${item.id})">Comprar - WhatsApp</button>
      </div>
    `;
        gridContainer.appendChild(card);
    });
}

function verFicha(id) {
    const item = catalogo.find(c => c.id === id);
    if (!item) return;

    document.querySelectorAll("#overlay-ficha, #ficha-modal").forEach(e => e.remove());

    document.body.insertAdjacentHTML("beforeend", `
    <div id="overlay-ficha" class="overlay"></div>

    <div id="ficha-modal" class="ficha-card">
      <button class="btn-cerrar" onclick="cerrarFicha()">✖</button>
      <h2>${item.marca} ${item.modelo}</h2>
      <img src="${item.img}" alt="${item.modelo}">

      <ul class="ficha-lista">
        <li><strong>Motor:</strong> ${item.motor}</li>
        <li><strong>Potencia:</strong> ${item.potencia}</li>
        <li><strong>Transmisión:</strong> ${item.transmision}</li>
        <li><strong>Consumo:</strong> ${item.consumo}</li>
        <li><strong>Precio:</strong> ${formatCOP(item.precio)}</li>
      </ul>
    </div>
    
  `);
    document.body.style.overflow = "hidden";


    document.getElementById("overlay-ficha").onclick = cerrarFicha;
}

function cerrarFicha() {
    const modal = document.getElementById("ficha-modal");
    const overlay = document.getElementById("overlay-ficha");

    if (!modal || !overlay) return;

    modal.classList.add("ficha-salir");
    overlay.classList.add("overlay-salir");

    setTimeout(() => {
        modal.remove();
        overlay.remove();
        document.body.style.overflow = "auto";
    }, 200);
}

function seleccionarVenta(id) {
    const item = catalogo.find(c => c.id === id);
    if (!item) return;
    sessionStorage.setItem('carroSeleccionado', JSON.stringify(item));
    const telefono = "573001112233";
    const texto = encodeURIComponent(`Hola, estoy interesado en el ${item.marca} ${item.modelo} - ${formatCOP(item.precio)}.`);
    window.open(`https://wa.me/${telefono}?text=${texto}`, '_blank');
}

const seleccionadoCont = document.getElementById('seleccionado');
if (seleccionadoCont) {
    const sel = sessionStorage.getItem('carroSeleccionado');
    if (sel) {
        const item = JSON.parse(sel);
        seleccionadoCont.innerHTML = `<p>Interesado en: <strong>${item.marca} ${item.modelo}</strong> — ${formatCOP(item.precio)}</p>`;
    } else {
        seleccionadoCont.innerHTML = `<p>No ha seleccionado un vehículo.</p>`;
    }
}

const contactoForm = document.getElementById('contactForm');
if (contactoForm) {
    contactoForm.addEventListener('submit', e => {
        e.preventDefault();
        const nombre = contactoForm.querySelector('input[name="nombre"]').value.trim();
        const email = contactoForm.querySelector('input[name="email"]').value.trim();
        const mensaje = contactoForm.querySelector('textarea[name="mensaje"]').value.trim();
        if (!nombre || !email || !mensaje) { showToast("Llena todos los campos del formulario."); return; }
        contactoForm.reset();
        showToast("Mensaje enviado.");
    });
}

function showToast(text) {
    let t = document.getElementById('toast');
    if (!t) {
        t = document.createElement('div');
        t.id = 'toast';
        document.body.appendChild(t);
    }
    t.textContent = text;
    t.className = 'show';
    setTimeout(() => t.className = t.className.replace('show', ''), 2000);
}

const paginasProtegidas = ["inicio.html", "concesionarios.html", "contacto.html"];
const paginaActual = window.location.pathname.split("/").pop();

if (paginasProtegidas.includes(paginaActual)) {
    if (!localStorage.getItem("usuarioLogueado")) {
        window.location.href = "index.html";
    }
}
