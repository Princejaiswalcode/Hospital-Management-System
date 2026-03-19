document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const token = sessionStorage.getItem("token");

  if (!user || !token) {
    window.location.href = "/frontend/html/login.html";
    return;
  }

  applyUserInfo(user);
  applyRoleAccess(user.role);
  loadDashboardFromAPI(token);
  setupLogout();
});

/* ===============================
   USER INFO
================================ */
function applyUserInfo(user) {
  const name = user.full_name || "User";

  document.getElementById("welcomeText").innerText = `Welcome, ${name}`;
  document.getElementById("headerUserName").innerText = name;
  document.getElementById("userRole").innerText =
    `${capitalize(user.role)} Dashboard`;
  document.getElementById("userAvatar").innerText =
    name.charAt(0).toUpperCase();
}

/* ===============================
   ROLE ACCESS
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
   LOAD DASHBOARD
================================ */
async function loadDashboardFromAPI(token) {
  try {

    const res = await fetch("http://localhost:5000/api/dashboard", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (res.status === 401) {
      sessionStorage.clear();
      window.location.href="/frontend/html/login.html";
      return;
    }

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.message || "Dashboard load failed");
    }

    renderDashboard(json.data);

  } catch (err) {
    console.error(err);
    showToast("error","Dashboard load failed");
  }
}

/* ===============================
   RENDER DASHBOARD
================================ */
function renderDashboard(data = {}) {

  setText("totalPatients", (data.totalPatients || 0).toLocaleString());
  setText("todayAppointments", data.todayAppointments || 0);
  setText("admittedPatients", data.admittedPatients || 0);
  setText("pendingBills", data.pendingBills || 0);
  setText("treatmentsCompleted", data.treatmentsCompleted || 0);
  setText("totalBeds", data.totalBeds || 0);

  if (data.lists) {

    renderRecentPatients(data.lists.recentPatients || []);
    renderUpcomingAppointments(data.lists.upcomingAppointments || []);
    renderWardOccupancy(data.lists.wardOccupancy || []);
    renderRecentBills(data.lists.recentBills || []);

  }
}

/* ===============================
   LIST RENDERERS
================================ */
function renderRecentPatients(list = []) {
  const container = document.getElementById("recentPatients");
  if (!container) return;

  container.innerHTML = "";

  list.forEach(p => {
    const div = document.createElement("div");
    div.className = "list-item";

    const statusClass = (p.status || "").toLowerCase();

    div.innerHTML = `
      <div class="list-info">
        <div class="list-title">${p.first_name} ${p.last_name}</div>
        <div class="list-sub">
          ID: #${p.patient_id} • ${p.age} yrs • ${p.gender}
        </div>
      </div>

      <span class="status ${statusClass}">
        ${p.status || ""}
      </span>
    `;

    container.appendChild(div);
  });
}

function renderUpcomingAppointments(list = []) {
  const container = document.getElementById("upcomingAppointments");
  if (!container) return;

  container.innerHTML = "";

  list.forEach(a => {
    const div = document.createElement("div");
    div.className = "list-item";

    div.innerHTML = `
      <div class="list-info">
        <div class="list-title">${a.first_name} ${a.last_name}</div>
        <div class="list-sub">${a.doctor_name || ""}</div>
      </div>

      <div class="list-meta">
        <div>${a.appointment_time}</div>
        <div>${a.appointment_date}</div>
      </div>
    `;

    container.appendChild(div);
  });
}

function renderWardOccupancy(list = []) {
  const div = document.getElementById("wardOccupancy");
  if (!div) return;

  div.innerHTML = "";
  list.forEach(w => {
    const p = document.createElement("p");
    p.textContent =
      `${w.ward_name}: ${w.available_beds}/${w.total_beds} beds available`;
    div.appendChild(p);
  });
}

function renderRecentBills(list = []) {
  const container = document.getElementById("recentBills");
  if (!container) return;

  container.innerHTML = "";

  list.forEach(b => {
    const div = document.createElement("div");
    div.className = "list-item";

    div.innerHTML = `
      <div class="list-info">
        <div class="list-title">${b.first_name} ${b.last_name}</div>
        <div class="list-sub">₹${b.total_amount}</div>
      </div>

      <span class="status ${b.payment_status.toLowerCase()}">
        ${b.payment_status}
      </span>
    `;

    container.appendChild(div);
  });
}
/* ===============================
   HELPERS
================================ */
function setText(id, value) {
  const el = document.getElementById(id);
  if (el && value !== undefined && value !== null) {
    el.innerText = value;
  }
}

function capitalize(text = "") {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
function renderWardCards(containerId, wards) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  wards.forEach(function (w) {
    const occupied = w.total_beds - w.available_beds;
    const percent = (occupied / w.total_beds) * 100;

    const card = document.createElement("div");
    card.className = "ward-card";

    card.innerHTML =
      "<h4>" + w.ward_name + "</h4>" +
      "<p>Total: " + w.total_beds + "</p>" +
      "<p>Occupied: <span class='danger'>" + occupied + "</span></p>" +
      "<p>Available: <span class='success'>" + w.available_beds + "</span></p>" +
      "<div class='progress'>" +
      "<div class='progress-bar' style='width:" + percent + "%'></div>" +
      "</div>";

    container.appendChild(card);
  });
}
async function loadDashboardWards() {
  try {
    const token = sessionStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/wards", {
      headers: { Authorization: "Bearer " + token },
      cache: "no-store"
    });

    if (!res.ok) throw new Error("API failed");

    const result = await res.json();
    const wards = result.data || result;

    renderWardCards("dashboardWardCards", wards);

  } catch (err) {
    console.error("Dashboard ward error:", err);
  }
}
document.addEventListener("DOMContentLoaded", function () {
  loadDashboardWards();
});
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

const navLinks = document.querySelectorAll(".nav-link");
const pages = document.querySelectorAll(".page");

navLinks.forEach(link => {
  link.addEventListener("click", () => {

    // Remove active from all links
    navLinks.forEach(l => l.classList.remove("active"));

    // Add active to clicked link
    link.classList.add("active");

    // Hide all pages
    pages.forEach(p => p.classList.remove("active"));

    // Show selected page
    const pageId = "page-" + link.dataset.page;
    document.getElementById(pageId)?.classList.add("active");
  });
});
