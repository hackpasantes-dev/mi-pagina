const usuario = JSON.parse(localStorage.getItem("usuario"));

if (!usuario) {
window.location.href = "login.html";
}

const SUPABASE_URL = "https://xtzthkkzsznnfvvytvvm.supabase.co";
const SUPABASE_KEY = "sb_publishable_pgpdiWZfzds85tvhanzmVA_vKbAzdsU";

const db = window.supabase.createClient(
SUPABASE_URL,
SUPABASE_KEY
);

let player = null;

/* =========================
CARGAR PELÍCULAS
========================= */
async function cargarPeliculas() {
const { data, error } = await db
.from("peliculas")
.select("*");

if (error) {
console.log(error);
return;
}

if (!data || data.length === 0) return;

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

const contenedor = document.getElementById("peliculas");
contenedor.innerHTML = "";

data.forEach(p => {
contenedor.innerHTML += `       <div class="card" onclick="abrirModal('${p.video_url}')">         <img src="${p.imagen_url}" alt="${p.titulo}">       </div>
    `;
});
}

/* =========================
ABRIR MODAL
========================= */
function abrirModal(url) {
const modal = document.getElementById("modal");
const video = document.getElementById("modalVideo");

modal.style.display = "flex";

// limpiar player anterior
if (player) {
player.destroy();
player = null;
}

// 🔥 FORMA CORRECTA
video.src = url;
video.load();

player = new Plyr(video, {
controls: [
'play',
'progress',
'current-time',
'duration',
'mute',
'volume',
'fullscreen'
],
clickToPlay: true,
hideControls: false
});

player.on('ready', () => {

```
const controls = document.querySelector('.plyr__controls');
if (!controls) return;

// evitar duplicados
if (controls.querySelector('.custom-back')) return;

const back = document.createElement('button');
back.innerHTML = '⏪';
back.className = 'plyr__control custom-back';
back.onclick = () => player.currentTime -= 10;

const forward = document.createElement('button');
forward.innerHTML = '⏩';
forward.className = 'plyr__control custom-forward';
forward.onclick = () => player.currentTime += 10;

controls.prepend(back);
controls.appendChild(forward);
```

});

player.play();
}

/* =========================
CERRAR MODAL
========================= */
function cerrarModal() {
const modal = document.getElementById("modal");
const video = document.getElementById("modalVideo");

if (player) {
player.destroy();
player = null;
}

// 🔥 LIMPIEZA REAL
video.pause();
video.removeAttribute("src");
video.load();

modal.style.display = "none";
}

/* =========================
EVENTOS
========================= */
document.addEventListener("DOMContentLoaded", () => {

document.getElementById("cerrar").onclick = cerrarModal;

document.getElementById("modal").addEventListener("click", (e) => {
if (e.target.id === "modal") cerrarModal();
});

});

/* ESC (PC) */
document.addEventListener("keydown", (e) => {
if (e.key === "Escape") cerrarModal();
});

/* PAUSA AUTOMÁTICA */
document.addEventListener("visibilitychange", () => {
if (document.hidden && player) {
player.pause();
}
});

/* LOGOUT */
document.getElementById("logout").onclick = () => {
localStorage.removeItem("usuario");
window.location.href = "login.html";
};

/* INICIAR */
cargarPeliculas();

/* MENU */
const toggle = document.getElementById("menuToggle");
const menu = document.getElementById("menu");

if (toggle) {
toggle.addEventListener("click", () => {
menu.classList.toggle("active");
});
}
