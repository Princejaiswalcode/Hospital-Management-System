document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("loginForm")
    .addEventListener("submit", login);
});

function login(e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value; // ignored for now
  const role = document.getElementById("role").value;

  fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username,
      password,
      role
    })
  })
    .then(res => {
      if (!res.ok) throw new Error("Login failed");
      return res.json();
    })
    .then(data => {
      sessionStorage.setItem("user", JSON.stringify({
        name: data.name,
        role: data.role
      }));

      window.location.href = "/frontend/html/dashboard.html";
    })
    .catch(() => {
      alert("Invalid credentials (backend rejected request)");
    });
}
