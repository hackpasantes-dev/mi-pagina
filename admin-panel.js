// 🔐 PROTEGER PANEL
if (!localStorage.getItem("admin")) {
  window.location.href = "admin-login.html";
}

const SUPABASE_URL = "https://xtzthkkzsznnfvvytvvm.supabase.co";
const SUPABASE_KEY = "sb_publishable_pgpdiWZfzds85tvhanzmVA_vKbAzdsU";

const db = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

const msg = document.getElementById("msg");

// 🚪 LOGOUT
document.getElementById("logout").onclick = () => {
  localStorage.removeItem("admin");
  window.location.href = "admin-login.html";
};

// ============================
// 📤 SUBIR PELÍCULA
// ============================

document.getElementById("subir").onclick = async () => {

  const titulo = document.getElementById("titulo").value;
  const anio = document.getElementById("anio").value;
  const duracion = document.getElementById("duracion").value;
  const imagen_url = document.getElementById("imagen").value;
  const file = document.getElementById("video").files[0];

  if (!titulo || !anio || !duracion || !file || !imagen_url) {
    msg.textContent = "Por favor Completa todos los campos";
    return;
  }

  msg.textContent = "Subiendo video...";

  const fileName = `${Date.now()}-${file.name}`;

  const { error: uploadError } =
    await db.storage.from("videos").upload(fileName, file);

  if (uploadError) {
    msg.textContent = "Error subiendo video";
    return;
  }

  const video_url =
    `${SUPABASE_URL}/storage/v1/object/public/videos/${fileName}`;

  const { error } = await db.from("peliculas").insert([
    { titulo, anio, duracion, video_url, imagen_url }
  ]);

  if (error) {
    msg.textContent = "Error guardando película";
  } else {
    msg.textContent = "Película subida correctamente";
    limpiarFormulario();
    cargarPeliculasAdmin();
  }
};

// ============================
// 📋 LISTAR PELÍCULAS
// ============================

async function cargarPeliculasAdmin() {
  const { data, error } = await db.from("peliculas").select("*");

  const lista = document.getElementById("listaPeliculas");
  lista.innerHTML = "";

  if (error) {
    lista.innerHTML = "Error cargando películas";
    return;
  }

  data.forEach(p => {
    lista.innerHTML += `
      <div class="item-admin">
        <img src="${p.imagen_url}" width="60">
        <strong>${p.titulo}</strong>
        <button onclick="editar('${p.id}')">Editar</button>
        <button onclick="eliminar('${p.id}')">Eliminar</button>
      </div>
    `;
  });
}

// ============================
// ✏ EDITAR
// ============================

async function editar(id) {
  const nuevoTitulo = prompt("Nuevo título:");
  const nuevaImagen = prompt("Nueva URL de imagen:");

  if (!nuevoTitulo || !nuevaImagen) return;

  const { error } = await db
    .from("peliculas")
    .update({
      titulo: nuevoTitulo,
      imagen_url: nuevaImagen
    })
    .eq("id", id);

  if (error) {
    alert("❌ Error actualizando");
  } else {
    alert("✅ Película actualizada");
    cargarPeliculasAdmin();
  }
}

// ============================
// 🗑 ELIMINAR
// ============================

async function eliminar(id) {

  const confirmar = confirm("¿Seguro que quieres eliminar esta película?");
  if (!confirmar) return;

  const { error } = await db
    .from("peliculas")
    .delete()
    .eq("id", id);

  if (error) {
    alert("❌ Error eliminando");
  } else {
    alert("✅ Película eliminada");
    cargarPeliculasAdmin();
  }
}

// ============================
// 🧹 LIMPIAR FORMULARIO
// ============================

function limpiarFormulario() {
  document.getElementById("titulo").value = "";
  document.getElementById("anio").value = "";
  document.getElementById("duracion").value = "";
  document.getElementById("imagen").value = "";
  document.getElementById("video").value = "";
}

// INICIAR
cargarPeliculasAdmin();
