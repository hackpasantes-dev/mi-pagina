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

// CARGAR PELÍCULAS
async function cargarPeliculas() {
  const { data, error } = await db
    .from("peliculas")
    .select("*");

  if (error) {
    console.log(error);
    return;
  }

  if (!data || data.length === 0) return;

  /* ===== HERO ===== */
  const hero = document.getElementById("hero");
  const heroTitulo = document.getElementById("heroTitulo");
  const heroDescripcion = document.getElementById("heroDescripcion");
  const heroPlay = document.getElementById("heroPlay");

  // Tomamos la primera película como destacada
  const destacada = data[0];

  hero.style.backgroundImage = `url(${destacada.imagen_url})`;
  heroTitulo.textContent = destacada.titulo;
  heroDescripcion.textContent =
    `${destacada.anio} • ${destacada.duracion}`;

  heroPlay.onclick = () => abrirModal(destacada.video_url);

  /* ===== CATALOGO ===== */
  const contenedor = document.getElementById("peliculas");
  contenedor.innerHTML = "";

  data.forEach(p => {
    contenedor.innerHTML += `
      <div class="card" onclick="abrirModal('${p.video_url}')">
        <img src="${p.imagen_url}" alt="${p.titulo}">
      </div>
    `;
  });
}


// ABRIR MODAL
function abrirModal(url) {
  const modal = document.getElementById("modal");
  const video = document.getElementById("modalVideo");

  video.src = url;
  modal.style.display = "flex";
}

// CERRAR MODAL
document.getElementById("cerrar").onclick = () => {
  const modal = document.getElementById("modal");
  const video = document.getElementById("modalVideo");

  modal.style.display = "none";
  video.pause();
  video.src = "";
};

// LOGOUT
document.getElementById("logout").onclick = () => {
  localStorage.removeItem("usuario");
  window.location.href = "login.html";
};

// INICIAR
cargarPeliculas();


