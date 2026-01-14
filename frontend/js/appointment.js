document.addEventListener("DOMContentLoaded", () => {
  loadUserInfo();
  loadAppointments();
  setupLogout();
});

/* USER INFO */
function loadUserInfo() {
  const user = sessionStorage.getItem("user");
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const data = JSON.parse(user);
  document.getElementById("userName").innerText = data.name;
  document.getElementById("headerUserName").innerText = data.name;
  document.getElementById("userRole").innerText = data.role + " Dashboard";
  document.getElementById("userAvatar").innerText =
    data.name.charAt(0).toUpperCase();
}

/* LOAD APPOINTMENTS */
function loadAppointments() {
  fetch("http://localhost:5000/api/appointments")
    .then(res => res.json())
    .then(data => {
      const table = document.getElementById("appointmentsTable");
      table.innerHTML = "";

      data.forEach(a => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
          <td><strong>${a.patient}</strong></td>
          <td>${a.doctor}</td>
          <td>${a.date}</td>
          <td>${a.time}</td>
          <td>${a.type}</td>
          <td>
            <span class="badge ${a.status.toLowerCase()}">
              ${a.status}
            </span>
          </td>
        `;

        table.appendChild(tr);
      });
    })
    .catch(() => {
      showToast("error", "Failed to load appointments");
    });
}

/* LOGOUT */
function setupLogout() {
  document.querySelector(".logout").addEventListener("click", () => {
    sessionStorage.clear();
    window.location.href = "/frontend/html/login.html";
  });
}
