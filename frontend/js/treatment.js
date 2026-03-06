document.addEventListener("DOMContentLoaded", () => {
  loadUserInfo();
  applyRolePermissions();
  loadAppointmentsForTreatment();
  loadDoctorsForAdmin(); // load doctors if user is admin
  loadTreatments();
  setupFormActions();
  setupLogout();
});

function loadUserInfo() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  if (!user) location.href = "/frontend/html/login.html";

  document.getElementById("userName").innerText = user.full_name;
  document.getElementById("headerUserName").innerText = user.full_name;
  document.getElementById("userRole").innerText = `${user.role} Dashboard`;
  document.getElementById("userAvatar").innerText = user.full_name[0].toUpperCase();
}

function applyRolePermissions() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  if (["nurse", "reception", "patient"].includes(user.role)) {
    document.getElementById("addTreatmentBtn").style.display = "none";
    document.getElementById("treatmentFormCard").classList.add("hidden");
  }
}

/* APPOINTMENTS */
function loadAppointmentsForTreatment() {
  fetch("http://localhost:5000/api/appointments", {
    headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` }
  })
    .then(r => r.json())
    .then(r => {
      const appointmentSelect = document.getElementById("appointmentSelect");
      appointmentSelect.innerHTML = `<option value="">Select Appointment</option>`;
      (r.data ?? r).forEach(a => {
        const opt = document.createElement("option");
        opt.value = `${a.appointment_id}|${a.patient_id}`;
        opt.textContent = `#${a.appointment_id} - ${a.patient_name}`;
        appointmentSelect.appendChild(opt);
      });
    });
}

/* LOAD TREATMENTS */
function loadTreatments() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  let url = "/api/treatments/my";
  if (user.role === "doctor") url = "/api/treatments/doctor";
  if (user.role === "admin") url = "/api/treatments/all";

  fetch(`http://localhost:5000${url}`, {
    headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` }
  })
    .then(r => r.json())
    .then(r => renderTreatments(r.data))
    .catch(() => {
      const table = document.getElementById("treatmentTable");
      table.innerHTML = `<tr><td colspan="6" style="text-align:center">Failed to load treatments</td></tr>`;
    });
}

function renderTreatments(list) {
  const table = document.getElementById("treatmentTable");
  table.innerHTML = "";

  if (!list || !list.length) {
    table.innerHTML = `<tr><td colspan="6" style="text-align:center">No treatments</td></tr>`;
    return;
  }

  list.forEach(t => {
    table.innerHTML += `
      <tr>
        <td>#${t.patient_id}</td>
        <td><strong>${t.patient_name}</strong></td>
        <td>${t.diagnosis}</td>
        <td>${t.medicines}</td>
        <td>${t.doctor_name || "-"}</td>
        <td>${new Date(t.treatment_date).toLocaleDateString("en-IN")}</td>
      </tr>`;
  });
}

/* FORM */
function setupFormActions() {
  const addBtn = document.getElementById("addTreatmentBtn");
  const cancelBtn = document.getElementById("cancelTreatmentBtn");
  const saveBtn = document.getElementById("saveTreatmentBtn");
  const formCard = document.getElementById("treatmentFormCard");

  addBtn.onclick = () => formCard.classList.remove("hidden");
  cancelBtn.onclick = () => {
    formCard.classList.add("hidden");
    clearForm();
  };
  saveBtn.onclick = submitTreatment;
}

function submitTreatment() {
  const appointmentSelect = document.getElementById("appointmentSelect");
  const diagnosis = document.getElementById("diagnosis");
  const medicines = document.getElementById("medicines");
  const user = JSON.parse(sessionStorage.getItem("user"));

  if (!appointmentSelect.value || !diagnosis.value || !medicines.value) {
    showToast("error", "Fill all fields");
    return;
  }

  const [appointment_id, patient_id] = appointmentSelect.value.split("|");
  const body = {
    appointment_id: Number(appointment_id),
    patient_id: Number(patient_id),
    diagnosis: diagnosis.value,
    medicines: medicines.value
  };

  if (user.role === "admin") {
    const doctorSelect = document.getElementById("doctorSelect");
    if (!doctorSelect || !doctorSelect.value) {
      showToast("error", "Select doctor for admin");
      return;
    }
    body.doctor_id = Number(doctorSelect.value);
  }

  fetch("http://localhost:5000/api/treatments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`
    },
    body: JSON.stringify(body)
  })
    .then(r => {
      if (!r.ok) throw new Error();
      return r.json();
    })
    .then(() => {
      showToast("success", "Treatment added");
      document.getElementById("treatmentFormCard").classList.add("hidden");
      clearForm();
      loadTreatments();
    })
    .catch(() => showToast("error", "Failed to add treatment"));
}

function clearForm() {
  document.getElementById("appointmentSelect").value = "";
  document.getElementById("diagnosis").value = "";
  document.getElementById("medicines").value = "";
  const doctorSelect = document.getElementById("doctorSelect");
  if (doctorSelect) doctorSelect.value = "";
}

/* LOGOUT */
function setupLogout() {
  document.querySelector(".logout").onclick = () => {
    sessionStorage.clear();
    location.href = "/frontend/html/login.html";
  };
}

/* LOAD DOCTORS FOR ADMIN */
function loadDoctorsForAdmin() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  if (user.role !== "admin") return;

  const container = document.getElementById("doctorSelectContainer");
  if (container) container.classList.remove("hidden");

  fetch("http://localhost:5000/api/doctors", {
    headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` }
  })
    .then(r => r.json())
    .then(r => {
      const select = document.getElementById("doctorSelect");
      (r.data ?? r).forEach(d => {
        const opt = document.createElement("option");
        opt.value = d.doctor_id;
        opt.textContent = `${d.first_name} ${d.last_name}`;
        select.appendChild(opt);
      });
    })
    .catch(() => showToast("error", "Failed to load doctors"));
}