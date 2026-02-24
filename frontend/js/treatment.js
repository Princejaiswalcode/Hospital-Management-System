document.addEventListener("DOMContentLoaded", () => {
  loadUserInfo();
  applyRolePermissions();
  loadAppointmentsForTreatment();
  loadTreatments();
  setupFormActions();
  setupLogout();
});

function loadUserInfo() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  if (!user) location.href = "/frontend/html/login.html";

  userName.innerText = user.full_name;
  headerUserName.innerText = user.full_name;
  userRole.innerText = `${user.role} Dashboard`;
  userAvatar.innerText = user.full_name[0].toUpperCase();
}

function applyRolePermissions() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  if (["nurse", "reception", "patient"].includes(user.role)) {
    addTreatmentBtn.style.display = "none";
    treatmentFormCard.classList.add("hidden");
  }
}

/* APPOINTMENTS */
function loadAppointmentsForTreatment() {
  fetch("http://localhost:5000/api/appointments", {
    headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` }
  })
    .then(r => r.json())
    .then(r => {
      appointmentSelect.innerHTML =
        `<option value="">Select Appointment</option>`;
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
    .then(r => renderTreatments(r.data));
}

function renderTreatments(list) {
  treatmentTable.innerHTML = "";

  if (!list.length) {
    treatmentTable.innerHTML =
      `<tr><td colspan="5" style="text-align:center">No treatments</td></tr>`;
    return;
  }

  list.forEach(t => {
    treatmentTable.innerHTML += `
      <tr>
        <td>#${t.patient_id}</td>
        <td><strong>${t.patient_name}</strong></td>
        <td>${t.diagnosis}</td>
        <td>${t.prescription}</td>
        <td>${new Date(t.treatment_date).toLocaleDateString("en-IN")}</td>
      </tr>`;
  });
}

/* FORM */
function setupFormActions() {
  addTreatmentBtn.onclick = () =>
    treatmentFormCard.classList.remove("hidden");

  cancelTreatmentBtn.onclick = () => {
    treatmentFormCard.classList.add("hidden");
    clearForm();
  };

  saveTreatmentBtn.onclick = submitTreatment;
}

function submitTreatment() {
  const raw = appointmentSelect.value;
  if (!raw || !diagnosis.value || !medicines.value) {
    showToast("error", "Fill all fields");
    return;
  }

  const [appointment_id, patient_id] = raw.split("|");

  fetch("http://localhost:5000/api/treatments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`
    },
    body: JSON.stringify({
      appointment_id,
      patient_id,
      diagnosis: diagnosis.value,
      medicines: medicines.value
    })
  })
    .then(r => {
      if (!r.ok) throw new Error();
      return r.json();
    })
    .then(() => {
      showToast("success", "Treatment added");
      treatmentFormCard.classList.add("hidden");
      clearForm();
      loadTreatments();
    })
    
    .catch(() => showToast("error", "Failed to add treatment"));

}

function clearForm() {
  appointmentSelect.value = "";
  diagnosis.value = "";
  medicines.value = "";
}

function setupLogout() {
  document.querySelector(".logout").onclick = () => {
    sessionStorage.clear();
    location.href = "/frontend/html/login.html";
  };
}
