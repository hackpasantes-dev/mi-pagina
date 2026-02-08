console.log("JS conectado");

const SUPABASE_URL = "https://xtzthkkzsznnfvvytvvm.supabase.co";
const SUPABASE_KEY = "sb_publishable_pgpdiWZfzds85tvhanzmVA_vKbAzdsU";

// 👇 NO usar const supabase = ...
const db = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

const form = document.getElementById("registroForm");
const mensaje = document.getElementById("mensaje");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  mensaje.textContent = "Enviando...";
  mensaje.style.color = "white";

  const nombre = document.getElementById("nombre").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await db
    .from("usuarios")
    .insert([{ nombre, email, password }]);

  if (error) {
    console.error(error);
    mensaje.textContent = "❌ " + error.message;
    mensaje.style.color = "red";
  } else {
    mensaje.textContent = "✅ Registro exitoso";
    mensaje.style.color = "green";
    form.reset();
  }
});
