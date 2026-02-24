window.addEventListener("DOMContentLoaded", () => {
  loadUserInfo();
  applyRolePermissions();
  setupFormToggle();
  loadWards();
  loadAdmissions();
  setupLogout();
});

/* USER INFO */
function loadUserInfo() {
  const user = sessionStorage.getItem("user");
  if (!user) {
    window.location.href = "/frontend/html/login.html";
    return;
  }

  const data = JSON.parse(user);

  const userName = document.getElementById("userName");
  const headerUserName = document.getElementById("headerUserName");
  const userRole = document.getElementById("userRole");
  const userAvatar = document.getElementById("userAvatar");

  if (userName) userName.innerText = data.full_name;
  if (headerUserName) headerUserName.innerText = data.full_name;
  if (userRole) userRole.innerText = data.role + " Dashboard";
  if (userAvatar) userAvatar.innerText = data.full_name.charAt(0).toUpperCase();
}
/* ROLE BASED UI */
function applyRolePermissions() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  if (!user) return;

  if (user.role.toLowerCase() !== "admin") {
    document.querySelectorAll(".admin-only").forEach(el => el.remove());
  }
}

/* FORM TOGGLE */
function setupFormToggle() {
  const form = document.getElementById("admitFormCard");
  const toggleAdmitBtn = document.getElementById("toggleAdmitBtn");
  const cancelAdmitBtn = document.getElementById("cancelAdmitBtn");

  if (!form || !toggleAdmitBtn || !cancelAdmitBtn) return;

  toggleAdmitBtn.addEventListener("click", () => {
    form.classList.toggle("hidden");
  });

  cancelAdmitBtn.addEventListener("click", () => {
    form.classList.add("hidden");
  });
}

/* LOAD WARDS */
async function loadWards() {
  try {
    const token = sessionStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/wards", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const result = await res.json();

    if (!result.success) {
      throw new Error("Failed to load wards");
    }

    const wards = result.data;

    const grid = document.getElementById("wardGrid");
    grid.innerHTML = "";

    wards.forEach(w => {
      const occupied = w.total_beds - w.available_beds;
      const percent = (occupied / w.total_beds) * 100;

      const card = document.createElement("div");
      card.className = "ward-card";
      card.innerHTML = `
        <h4>${w.ward_name}</h4>
        <p>Total: ${w.total_beds} beds</p>
        <p>Occupied: <span class="red">${occupied}</span></p>
        <p>Available: <span class="green">${w.available_beds}</span></p>
        <div class="progress">
          <div class="progress-bar" style="width:${percent}%"></div>
        </div>
      `;

      grid.appendChild(card);
    });

  } catch (err) {
    console.error(err);
    Swal.fire("Error", "Failed to load wards", "error");
  }
}

/* LOAD ADMISSIONS */
function loadAdmissions() {
  const mockAdmissions = [
    {
      id: "#1",
      name: "Rajesh Kumar",
      ward: "General Ward A",
      admit: "2026-01-10",
      discharge: "-",
      status: "Active"
    },
    {
      id: "#3",
      name: "Suresh Patel",
      ward: "ICU",
      admit: "2026-01-12",
      discharge: "-",
      status: "Active"
    }
  ];

  const table = document.getElementById("admissionTable");
  table.innerHTML = "";

  mockAdmissions.forEach(a => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${a.id}</td>
      <td><strong>${a.name}</strong></td>
      <td>${a.ward}</td>
      <td>${a.admit}</td>
      <td>${a.discharge}</td>
      <td><span class="badge active">${a.status}</span></td>
      <td class="admin-only">
        <button class="link-btn">Discharge</button>
      </td>
    `;
    table.appendChild(tr);
  });
}

/* LOGOUT */
function setupLogout() {
  document.querySelector(".logout").onclick = () => {
    sessionStorage.clear();
    window.location.href = "/frontend/html/login.html";
  };
}
