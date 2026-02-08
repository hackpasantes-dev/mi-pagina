console.log("Login JS conectado");

const SUPABASE_URL = "https://xtzthkkzsznnfvvytvvm.supabase.co";
const SUPABASE_KEY = "sb_publishable_pgpdiWZfzds85tvhanzmVA_vKbAzdsU";

const db = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

const form = document.getElementById("loginForm");
const mensaje = document.getElementById("mensaje");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  mensaje.textContent = "Verificando...";
  mensaje.style.color = "white";

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await db
    .from("usuarios")
    .select("*")
    .eq("email", email)
    .eq("password", password)
    .single();

  if (error || !data) {
    mensaje.textContent = "❌ Correo o contraseña incorrectos";
    mensaje.style.color = "red";
  } else {
    // ✅ GUARDAR SESIÓN
    localStorage.setItem("usuario", JSON.stringify(data));

    mensaje.textContent = "✅ Bienvenido " + data.nombre;
    mensaje.style.color = "green";

    // ✅ REDIRIGIR AL CATÁLOGO
    setTimeout(() => {
      window.location.href = "catalogo.html";
    }, 1000);
  }
});
