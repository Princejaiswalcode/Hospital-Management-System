document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const token = sessionStorage.getItem("token");

  if (!user || !token) {
    window.location.href = "/frontend/html/login.html";
    return;
  }

  loadUser(user);
  loadDashboard(token);
});

/* USER */
function loadUser(user) {
  const name = user.full_name || "User";

  document.getElementById("welcomeText").innerText = `Welcome, ${name}`;
  document.getElementById("headerUserName").innerText = name;
  document.getElementById("userAvatar").innerText = name[0];
  document.getElementById("profileAvatar").innerText = name[0];

  document.getElementById("profileName").innerText = name;
  document.getElementById("profileInfo").innerText =
  `Patient ID: #${user.patient_id || user.id || "-"}`;
}

/* LOAD DATA */
async function loadDashboard(token) {
  try {
    const res = await fetch("http://localhost:5000/api/dashboard/patient", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const json = await res.json();
    renderData(json.data || {});
  } catch (err) {
    console.error(err);
  }
}

/* RENDER */
function renderData(data) {
  document.getElementById("appointmentCount").innerText =
    data.appointments?.length || 0;

  document.getElementById("treatmentCount").innerText =
    data.treatments?.length || 0;

  document.getElementById("pendingBills").innerText =
    data.pendingBills || 0;

  renderAppointments(data.appointments || []);
  renderTreatments(data.treatments || []);
}

/* APPOINTMENTS */
function renderAppointments(list) {
  const container = document.getElementById("appointments");
  container.innerHTML = "";

  list.forEach(a => {
    const div = document.createElement("div");
    div.className = "list-item";

    div.innerHTML = `
      <div class="list-title">${a.doctor_name || "Doctor"}</div>
      <div class="list-sub">
        ${a.date || ""} • ${a.time || ""}
      </div>
    `;

    container.appendChild(div);
  });
}
const links = document.querySelectorAll(".nav-link");

links.forEach(link => {
  if (link.href === window.location.href) {
    link.classList.add("active");
  }
});
/* TREATMENTS */
function renderTreatments(list) {
  const container = document.getElementById("treatments");
  container.innerHTML = "";

  list.forEach(t => {
    const div = document.createElement("div");
    div.className = "list-item";

    div.innerHTML = `
      <div class="list-title">${t.title || t.diagnosis}</div>
      <div class="list-sub">${t.notes || ""}</div>
    `;

    container.appendChild(div);
  });
}