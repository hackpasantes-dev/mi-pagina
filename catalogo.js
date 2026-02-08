const usuario = JSON.parse(localStorage.getItem("usuario"));
if (!usuario) {
  window.location.href = "login.html";
}

document.getElementById("saludo").textContent =
  "Bienvenido, " + usuario.nombre;

const SUPABASE_URL = "https://xtzthkkzsznnfvvytvvm.supabase.co";
const SUPABASE_KEY = "sb_publishable_pgpdiWZfzds85tvhanzmVA_vKbAzdsU";

const db = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

async function cargarPeliculas() {
  const { data, error } = await db
    .from("peliculas")
    .select("*");

  const contenedor = document.getElementById("peliculas");
  contenedor.innerHTML = "";

  data.forEach(p => {
    contenedor.innerHTML += `
      <div class="card">
        <h4>${p.titulo}</h4>
        <p>${p.anio} • ${p.duracion}</p>
        <video src="${p.video_url}" controls></video>
      </div>
    `;
  });
}

cargarPeliculas();

document.getElementById("logout").onclick = () => {
  localStorage.removeItem("usuario");
  window.location.href = "login.html";
};
