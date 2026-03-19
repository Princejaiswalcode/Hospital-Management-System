import { apiFetch } from "./api.js";

document.addEventListener("DOMContentLoaded", function () {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const token = sessionStorage.getItem("token");

  if (!user || !token) {
    window.location.href = "/frontend/html/login.html";
    return;
  }

  applyRoleAccess(user.role);
  loadUserInfo(user);
  loadAppointments(user);
  bindBookingModal();
  setupLogout();
});


/* ===============================
   USER INFO (HEADER)
================================ */
function loadUserInfo(user) {
  document.getElementById("welcomeText").innerText =
    "Welcome, " + user.full_name;

  document.getElementById("headerUserName").innerText =
    user.full_name;

  document.getElementById("userAvatar").innerText =
    user.full_name.charAt(0).toUpperCase();
}


/* ===============================
   ROLE ACCESS (SIDEBAR)
================================ */
function applyRoleAccess(role) {
  const cleanRole = role.trim().toLowerCase();

  document.querySelectorAll("[data-role]").forEach(function (el) {
    const allowedRoles = el.dataset.role
      .split(",")
      .map(r => r.trim().toLowerCase());

    if (!allowedRoles.includes(cleanRole)) {
      el.style.display = "none";
    }
  });
}


/* ===============================
   TABLE HEADER
================================ */
function setTableHeader(role) {
  const firstTh = document.querySelector("thead tr th:first-child");
  if (firstTh) {
    firstTh.innerText = role === "doctor" ? "Patient" : "Doctor";
  }
}


/* ===============================
   LOAD APPOINTMENTS
================================ */
async function loadAppointments(user) {
  try {
    const role = user.role.toLowerCase();

    setTableHeader(role);

    const endpoint =
      role === "doctor"
        ? "http://localhost:5000/api/appointments/doctor"
        : "http://localhost:5000/api/appointments/patient";

    const res = await apiFetch(endpoint);

    renderAppointments(res.data || res || [], role);

  } catch (err) {
    console.error("Failed to load appointments:", err);

    document.getElementById("appointments").innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center;padding:20px;color:red">
          Failed to load appointments
        </td>
      </tr>
    `;
  }
}


/* ===============================
   RENDER
================================ */
function renderAppointments(list, role) {
  const tbody = document.getElementById("appointments");
  tbody.innerHTML = "";

  if (!list || list.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center;padding:20px;color:#888">
          No appointments found
        </td>
      </tr>
    `;
    return;
  }

  list.forEach(a => {
    const tr = document.createElement("tr");

    const name = role === "doctor" ? a.patient_name : a.doctor_name;
    const statusClass = (a.status || "").toLowerCase();

    tr.innerHTML = `
      <td>${name}</td>
      <td>${new Date(a.appointment_date).toLocaleDateString("en-IN")}</td>
      <td>${a.appointment_time}</td>
      <td>${a.type || "Consultation"}</td>
      <td>
        <span class="badge ${statusClass}">
          ${a.status}
        </span>
      </td>
    `;

    tbody.appendChild(tr);
  });
}


/* ===============================
   MODAL + BOOKING
================================ */
function bindBookingModal() {
  const btn = document.getElementById("btnShowForm");
  const modal = document.getElementById("appointmentModal");
  const backdrop = document.getElementById("modalBackdrop");
  const cancel = document.getElementById("btnCancelForm");
  const form = document.getElementById("appointmentForm");

  if (!btn || !modal || !backdrop || !cancel || !form) return;

  // OPEN
  btn.onclick = async function () {
    modal.classList.remove("hidden");
    backdrop.classList.remove("hidden");
    document.body.style.overflow = "hidden";

    await loadDoctors();
    setupTimeSlots();
  };

  // CLOSE
  function closeModal() {
    modal.classList.add("hidden");
    backdrop.classList.add("hidden");
    document.body.style.overflow = "auto";
    form.reset();
  }

  cancel.onclick = closeModal;
  backdrop.onclick = closeModal;

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeModal();
  });

  // SUBMIT ✅ FIXED
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const token = sessionStorage.getItem("token");
    const user = JSON.parse(sessionStorage.getItem("user"));

    const payload = {
      patient_id: user.patient_id || user.id || null,
      doctor_id: document.getElementById("doctorSelect").value || null,
      appointment_date: document.getElementById("appointmentDate").value || null,
      appointment_time: document.getElementById("appointmentTime").value || null,
      reason: document.getElementById("appointmentReason").value.trim() || null
    };

    console.log("PAYLOAD:", payload);

    // validation
    if (
      !payload.patient_id ||
      !payload.doctor_id ||
      !payload.appointment_date ||
      !payload.appointment_time ||
      !payload.reason
    ) {
      alert("Please fill all fields properly");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Server error:", data);
        alert(data.message || "Booking failed ❌");
        return;
      }

      alert("Appointment booked successfully ✅");

      closeModal();
      loadAppointments(user);

    } catch (err) {
      console.error("Network error:", err);
      alert("Server not reachable ❌");
    }
  });
}


/* ===============================
   LOAD DOCTORS
================================ */
async function loadDoctors() {
  try {
    const token = sessionStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/doctors", {
      headers: { Authorization: "Bearer " + token }
    });

    const result = await res.json();
    const list = result.data || result;

    const select = document.getElementById("doctorSelect");
    if (!select) return;

    select.innerHTML = '<option value="">Select Doctor</option>';

    list.forEach(d => {
      const opt = document.createElement("option");
      opt.value = d.doctor_id;
      opt.textContent = "Dr. " + d.first_name + " " + d.last_name;
      select.appendChild(opt);
    });

  } catch (err) {
    console.error("Doctor load failed", err);
  }
}


/* ===============================
   TIME SLOTS
================================ */
function setupTimeSlots() {
  const doctorSelect = document.getElementById("doctorSelect");

  if (!doctorSelect) return;

  doctorSelect.onchange = function () {
    const time = document.getElementById("appointmentTime");

    if (!time) return;

    time.innerHTML = `
      <option value="">Select Time</option>
      <option value="09:30">09:30</option>
      <option value="10:30">10:30</option>
      <option value="11:30">11:30</option>
      <option value="15:00">15:00</option>
      <option value="16:00">16:00</option>
    `;
  };
}


/* ===============================
   LOGOUT
================================ */
function setupLogout() {
  const btn = document.querySelector(".logout");

  if (btn) {
    btn.onclick = function () {
      sessionStorage.clear();
      window.location.href = "/frontend/html/login.html";
    };
  }
}