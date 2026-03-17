import { apiFetch } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const token = sessionStorage.getItem("token");

  if (!user || !token) {
    window.location.href = "/frontend/html/login.html";
    return;
  }

  applyRoleAccess(user.role);
  loadAppointments(user);
  setupLogout();
});


/* ===============================
   ROLE ACCESS (SIDEBAR)
================================ */
function applyRoleAccess(role) {
  const cleanRole = role.trim().toLowerCase();

  document.querySelectorAll("[data-role]").forEach(el => {
    const allowedRoles = el.dataset.role
      .split(",")
      .map(r => r.trim().toLowerCase());

    if (!allowedRoles.includes(cleanRole)) {
      el.style.display = "none";
    }
  });
}


/* ===============================
   LOAD APPOINTMENTS
================================ */
async function loadAppointments(user) {
  try {
    const role = user.role.toLowerCase();

    const endpoint =
      role === "doctor"
        ? "http://localhost:5000/api/appointments/doctor"
        : "http://localhost:5000/api/appointments/patient";

    const res = await apiFetch(endpoint);

    // 🔧 Updated line as requested
    renderAppointments(res.data || res || [], role);

  } catch (err) {
    console.error("Failed to load appointments:", err);

    const tbody = document.getElementById("appointments");

    tbody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align:center;padding:20px;color:red">
          Failed to load appointments
        </td>
      </tr>
    `;
  }
}


/* ===============================
   RENDER APPOINTMENTS
================================ */
function renderAppointments(list = [], role) {

  const tbody = document.getElementById("appointments");
  tbody.innerHTML = "";

  if (list.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align:center;padding:20px;color:#888">
          No appointments found
        </td>
      </tr>
    `;
    return;
  }

  list.forEach(a => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${role === "doctor" ? a.patient_name : a.doctor_name}</td>
      <td>${new Date(a.appointment_date).toLocaleDateString("en-IN")}</td>
      <td>${a.appointment_time}</td>
      <td>${a.status}</td>
    `;

    tbody.appendChild(tr);
  });

}


/* ===============================
   LOGOUT
================================ */
function setupLogout() {
  const btn = document.querySelector(".logout");

  if (btn) {
    btn.onclick = () => {
      sessionStorage.clear();
      window.location.href = "/frontend/html/login.html";
    };
  }
}