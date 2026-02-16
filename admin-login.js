document.getElementById("login").addEventListener("click", () => {
  const user = document.getElementById("user").value;
  const pass = document.getElementById("pass").value;

  if (user === "admin" && pass === "12345") {
    localStorage.setItem("admin", "true");
    window.location.href = "admin-panel.html";
  } else {
    document.getElementById("msg").textContent = "❌ Credenciales incorrectas";
  }
});

