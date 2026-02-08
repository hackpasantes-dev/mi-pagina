if (!localStorage.getItem("admin")) {
  window.location.href = "admin-login.html";
}

const SUPABASE_URL = "https://xtzthkkzsznnfvvytvvm.supabase.co";
const SUPABASE_KEY = "sb_publishable_pgpdiWZfzds85tvhanzmVA_vKbAzdsU";
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.getElementById("logout").onclick = () => {
  localStorage.removeItem("admin");
  window.location.href = "admin-login.html";
};

document.getElementById("subir").onclick = async () => {
  const titulo = document.getElementById("titulo").value;
  const anio = document.getElementById("anio").value;
  const duracion = document.getElementById("duracion").value;
  const file = document.getElementById("video").files[0];

  const fileName = `${Date.now()}-${file.name}`;

  const { data: uploadData, error: uploadError } =
    await db.storage.from("videos").upload(fileName, file);

  if (uploadError) {
    msg.textContent = "❌ Error subiendo video";
    return;
  }

  const video_url = `${SUPABASE_URL}/storage/v1/object/public/videos/${fileName}`;

  const { error } = await db.from("peliculas").insert([
    { titulo, anio, duracion, video_url }
  ]);

  msg.textContent = error
    ? "❌ Error guardando película"
    : "✅ Película subida correctamente";
};
