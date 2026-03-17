window.addEventListener("DOMContentLoaded", () => {
  loadUserInfo();
  applyRolePermissions();
  setupFormToggle();
  setupAdmitHandler();
  loadWards();
  loadAdmissions();
  setupLogout();

  const user = JSON.parse(sessionStorage.getItem("user"));

  if (user && user.role.toLowerCase() === "admin") {
    loadPatients();
  }
});

/* ================= USER INFO ================= */
function loadUserInfo() {
  const user = sessionStorage.getItem("user");
  if (!user) {
    window.location.href = "/frontend/html/login.html";
    return;
  }

  const data = JSON.parse(user);

  document.getElementById("userName").innerText = data.full_name;
  document.getElementById("headerUserName").innerText = data.full_name;
  document.getElementById("userRole").innerText = data.role + " Dashboard";
  document.getElementById("userAvatar").innerText =
    data.full_name.charAt(0).toUpperCase();
}

/* ================= ROLE UI ================= */
function applyRolePermissions() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  if (!user) return;

  if (user.role.toLowerCase() !== "admin") {
    document.querySelectorAll(".admin-only").forEach(el => el.remove());
  }
}

/* ================= FORM TOGGLE ================= */
function setupFormToggle() {
  const form = document.getElementById("admitFormCard");
  const toggleBtn = document.getElementById("toggleAdmitBtn");
  const cancelBtn = document.getElementById("cancelAdmitBtn");

  if (!form || !toggleBtn || !cancelBtn) return;

  toggleBtn.addEventListener("click", () => {
    form.classList.toggle("hidden");
  });

  cancelBtn.addEventListener("click", () => {
    form.classList.add("hidden");
  });
}

/* ================= LOAD WARDS ================= */
/* ================= LOAD WARDS ================= */
async function loadWards() {
  try {

    const token = sessionStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/wards", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error("API request failed");
    }

    const result = await res.json();

    console.log("Wards API response:", result); // debug

    const wards = result.data || result; // handle both formats

    const grid = document.getElementById("wardGrid");
    const wardSelect = document.getElementById("wardSelect");

    if (!grid || !wardSelect) return;

    grid.innerHTML = "";
    wardSelect.innerHTML = `<option value="">Select Ward</option>`;

    wards.forEach(w => {

      const occupied = w.total_beds - w.available_beds;
      const percent = (occupied / w.total_beds) * 100;

      /* Ward card */
      const card = document.createElement("div");
      card.className = "ward-card";

      card.innerHTML = `
        <h4>${w.ward_name}</h4>
        <p>Total: ${w.total_beds}</p>
        <p>Occupied: <span class="red">${occupied}</span></p>
        <p>Available: <span class="green">${w.available_beds}</span></p>
        <div class="progress">
          <div class="progress-bar" style="width:${percent}%"></div>
        </div>
      `;

      grid.appendChild(card);

      /* Dropdown option */
      const option = document.createElement("option");
      option.value = w.ward_id;
      option.textContent = `${w.ward_name} (${w.available_beds} beds available)`;

      if (w.available_beds <= 0) {
        option.disabled = true;
      }

      wardSelect.appendChild(option);

    });

  } catch (err) {

    console.error("Ward load error:", err);

    Swal.fire("Error", "Failed to load wards", "error");

  }
}

/* ================= LOAD PATIENTS ================= */
async function loadPatients() {
  try {

    const token = sessionStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/patients", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error("API request failed");
    }

    const patients = await res.json();   // backend returns ARRAY

    const select = document.getElementById("patientSelect");

    if (!select) return;

    select.innerHTML = `<option value="">Select Patient</option>`;

    patients.forEach(p => {
      const opt = document.createElement("option");
      opt.value = p.patient_id;
      opt.textContent = `${p.first_name} ${p.last_name}`;
      select.appendChild(opt);
    });

  } catch (err) {
    console.error("Patient load error:", err);
    Swal.fire("Error", "Failed to load patients", "error");
  }
}

/* ================= LOAD ADMISSIONS ================= */
async function loadAdmissions() {
  try {
    const token = sessionStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/admissions", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const result = await res.json();
    const table = document.getElementById("admissionTable");
    table.innerHTML = "";

    result.data.forEach(a => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>#${a.patient_id}</td>
        <td><strong>${a.patient_name}</strong></td>
        <td>${a.ward_name}</td>
        <td>${a.admission_date}</td>
        <td>${a.discharge_date || "-"}</td>
        <td>
          <span class="badge ${a.discharge_date ? "discharged" : "active"}">
            ${a.discharge_date ? "Discharged" : "Active"}
          </span>
        </td>
        <td class="admin-only">
          ${!a.discharge_date 
            ? `<button onclick="dischargePatient(${a.admission_id})" class="link-btn">Discharge</button>`
            : ""}
        </td>
      `;

      table.appendChild(tr);
    });

  } catch (err) {
    Swal.fire("Error", "Failed to load admissions", "error");
  }
}

/* ================= ADMIT PATIENT ================= */
function setupAdmitHandler() {
  const admitBtn = document.getElementById("admitBtn");
  if (!admitBtn) return;

  admitBtn.addEventListener("click", admitPatient);
}

function admitPatient() {
  const token = sessionStorage.getItem("token");

  const patient_id = document.getElementById("patientSelect").value;
  const ward_id = document.getElementById("wardSelect").value;
  const admission_date = document.getElementById("admissionDate").value;

  if (!patient_id || !ward_id || !admission_date) {
    Swal.fire("Error", "All fields are required", "error");
    return;
  }

  const payload = {
    patient_id: Number(patient_id),
    ward_id: Number(ward_id),
    admission_date
  };

  fetch("http://localhost:5000/api/admissions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  })
  .then(async res => {
    const text = await res.text();

    if (!res.ok) {
      throw new Error(text);
    }

    return JSON.parse(text);
  })
  .then(data => {
    Swal.fire("Success", "Patient admitted successfully", "success");

    document.getElementById("admitFormCard").classList.add("hidden");

    loadWards();
    loadAdmissions();
  })
  .catch(err => {
    console.error(err);
    Swal.fire("Error", "Admission failed", "error");
  });
}
/* ================= DISCHARGE ================= */
async function dischargePatient(id) {
  try {
    const token = sessionStorage.getItem("token");

    const res = await fetch(
      `http://localhost:5000/api/admissions/discharge/${id}`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    const result = await res.json();

    if (!res.ok) throw new Error(result.message);

    Swal.fire("Success", "Patient discharged", "success");

    loadWards();
    loadAdmissions();

  } catch (err) {
    Swal.fire("Error", err.message || "Discharge failed", "error");
  }
}

/* ================= LOGOUT ================= */
function setupLogout() {
  document.querySelector(".logout").onclick = () => {
    sessionStorage.clear();
    window.location.href = "/frontend/html/login.html";
  };
}