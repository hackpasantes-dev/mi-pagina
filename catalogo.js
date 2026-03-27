// =========================
// VALIDAR USUARIO
// =========================
const usuario = JSON.parse(localStorage.getItem("usuario"));

if (!usuario) {
  window.location.href = "login.html";
}

// =========================
// SUPABASE
// =========================
const SUPABASE_URL = "https://xtzthkkzsznnfvvytvvm.supabase.co";
const SUPABASE_KEY = "sb_publishable_pgpdiWZfzds85tvhanzmVA_vKbAzdsU";

const db = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

let player; // 🎬 Plyr global

// =========================
// CARGAR PELICULAS
// =========================
async function cargarPeliculas() {
  const { data, error } = await db
    .from("peliculas")
    .select("*");

  if (error) {
    console.log("Error:", error);
    return;
  }

  if (!data || data.length === 0) return;

  /* ===== HERO ===== */
  const hero = document.getElementById("hero");
  const heroTitulo = document.getElementById("heroTitulo");
  const heroDescripcion = document.getElementById("heroDescripcion");
  const heroPlay = document.getElementById("heroPlay");

  const destacada = data[0];

  hero.style.backgroundImage = `url(${destacada.imagen_url})`;
  heroTitulo.textContent = destacada.titulo;
  heroDescripcion.textContent =
    `${destacada.anio} • ${destacada.duracion}`;

  heroPlay.onclick = () => abrirModal(destacada.video_url);

  /* ===== TOP 10 🔥 ===== */
  const contenedorTop10 = document.getElementById("top10");
  contenedorTop10.innerHTML = "";

  data.slice(0, 10).forEach((p, index) => {
    const card = document.createElement("div");
    card.classList.add("card-top");

    card.innerHTML = `
      <span class="numero">${index + 1}</span>
      <img src="${p.imagen_url}" alt="${p.titulo}">
    `;

    card.onclick = () => abrirModal(p.video_url);

    contenedorTop10.appendChild(card);

    // animación tipo Netflix
    setTimeout(() => {
      card.classList.add("show");
    }, index * 120);
  });

  /* ===== CATALOGO ===== */
  const contenedor = document.getElementById("peliculas");
  contenedor.innerHTML = "";

  data.forEach(p => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <img src="${p.imagen_url}" alt="${p.titulo}">
    `;

    card.onclick = () => abrirModal(p.video_url);

    // 🔥 efecto Netflix: cambiar hero al pasar mouse
    card.onmouseenter = () => {
      hero.style.backgroundImage = `url(${p.imagen_url})`;
      heroTitulo.textContent = p.titulo;
      heroDescripcion.textContent =
        `${p.anio} • ${p.duracion}`;
      heroPlay.onclick = () => abrirModal(p.video_url);
    };

    contenedor.appendChild(card);
  });
}

// =========================
// ABRIR MODAL VIDEO
// =========================
function abrirModal(url) {
  const modal = document.getElementById("modal");
  const video = document.getElementById("modalVideo");

  modal.style.display = "flex";

  if (player) {
    player.destroy();
  }

  video.innerHTML = `<source src="${url}" type="video/mp4">`;

  player = new Plyr(video, {
    controls: [
      'play',
      'progress',
      'current-time',
      'duration',
      'mute',
      'volume',
      'settings',
      'fullscreen'
    ]
  });

  player.on("ready", () => {
    const controls = document.querySelector(".plyr__controls");

    const back = document.createElement("button");
    back.innerHTML = "⏪ 10s";
    back.className = "plyr__control";
    back.onclick = () => player.currentTime -= 10;

    const forward = document.createElement("button");
    forward.innerHTML = "10s ⏩";
    forward.className = "plyr__control";
    forward.onclick = () => player.currentTime += 10;

    controls.prepend(back);
    controls.appendChild(forward);
  });
}

// =========================
// CERRAR MODAL
// =========================
function cerrarModal() {
  const modal = document.getElementById("modal");

  if (player) {
    player.destroy();
    player = null;
  }

  modal.style.display = "none";
}

// =========================
// EVENTOS
// =========================
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("cerrar").onclick = cerrarModal;

  document.getElementById("modal").addEventListener("click", (e) => {
    if (e.target.id === "modal") cerrarModal();
  });
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") cerrarModal();
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden && player) {
    player.pause();
  }
});

// =========================
// LOGOUT
// =========================
document.getElementById("logout").onclick = () => {
  localStorage.removeItem("usuario");
  window.location.href = "login.html";
};

// =========================
// MENU
// =========================
const toggle = document.getElementById("menuToggle");
const menu = document.getElementById("menu");

if (toggle) {
  toggle.addEventListener("click", () => {
    menu.classList.toggle("active");
  });
}

// =========================
// INICIAR
// =========================
cargarPeliculas();
