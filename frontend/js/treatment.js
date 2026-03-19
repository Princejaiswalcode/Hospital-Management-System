document.addEventListener("DOMContentLoaded", () => {

  const user = JSON.parse(sessionStorage.getItem("user"));

  if (!user) {
    location.href = "/frontend/html/login.html";
    return;
  }

  const role = user.role.trim().toLowerCase();

  loadUserInfo(user);
  applyRolePermissions(role);
  applySidebarRoleAccess(role);

  if (["doctor","admin"].includes(role)) {
    loadAppointmentsForTreatment();
  }

  if (role === "admin") {
    loadDoctorsForAdmin();
  }

  loadTreatments(role);

  setupFormActions(role);
  setupLogout();

});


/* =========================
   USER INFO
========================= */
function loadUserInfo(user) {

  document.getElementById("userName").innerText = user.full_name;
  document.getElementById("headerUserName").innerText = user.full_name;
  document.getElementById("userRole").innerText = `${user.role} Dashboard`;
  document.getElementById("userAvatar").innerText =
    user.full_name.charAt(0).toUpperCase();

}


/* =========================
   ROLE PERMISSIONS
========================= */
function applyRolePermissions(role) {

  const addBtn = document.getElementById("addTreatmentBtn");
  const formCard = document.getElementById("treatmentFormCard");
  const doctorContainer = document.getElementById("doctorSelectContainer");

  /* Hide everything by default */
  if (addBtn) addBtn.style.display = "none";
  if (formCard) formCard.classList.add("hidden");
  if (doctorContainer) doctorContainer.classList.add("hidden");

  /* ADMIN */
  if (role === "admin") {
    if (addBtn) addBtn.style.display = "block";
    if (doctorContainer) doctorContainer.classList.remove("hidden");
  }

  /* DOCTOR */
  if (role === "doctor") {
    if (addBtn) addBtn.style.display = "block";
  }

}


/* =========================
   LOAD APPOINTMENTS
========================= */
function loadAppointmentsForTreatment() {

  const token = sessionStorage.getItem("token");

  fetch("http://localhost:5000/api/appointments", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then(res => res.json())
  .then(res => {

    const appointmentSelect =
      document.getElementById("appointmentSelect");

    if (!appointmentSelect) return;

    appointmentSelect.innerHTML =
      `<option value="">Select Appointment</option>`;

    const list = res.data ?? res;

    list.forEach(a => {

      const opt = document.createElement("option");

      opt.value = `${a.appointment_id}|${a.patient_id}`;
      opt.textContent =
        `#${a.appointment_id} - ${a.patient_name}`;

      appointmentSelect.appendChild(opt);

    });

  })
  .catch(() => {
    console.error("Failed to load appointments");
  });

}


/* =========================
   LOAD TREATMENTS
========================= */
function loadTreatments(role) {

  let url = null;

  if (role === "admin" || role === "nurse")
    url = "/api/treatments/all";

  else if (role === "doctor")
    url = "/api/treatments/doctor";

  else if (role === "patient")
    url = "/api/treatments/my";

  if (!url) {
    renderTreatments([]);
    return;
  }

  fetch(`http://localhost:5000${url}`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`
    }
  })
  .then(res => res.json())
  .then(res => {
    const list = res.data ?? res;
    renderTreatments(list);
  })
  .catch(() => {

    const table = document.getElementById("treatmentTable");

    if (table) {
      table.innerHTML =
      `<tr>
        <td colspan="6" style="text-align:center">
        Failed to load treatments
        </td>
      </tr>`;
    }

  });
}


/* =========================
   RENDER TREATMENTS
========================= */
function renderTreatments(list = []) {

  const table = document.getElementById("treatmentTable");

  if (!table) return;

  table.innerHTML = "";

  if (!list.length) {
    table.innerHTML =
      `<tr>
        <td colspan="6" style="text-align:center">
        No treatments
        </td>
      </tr>`;
    return;
  }

  list.forEach(t => {

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>#${t.patient_id}</td>
      <td><strong>${t.patient_name}</strong></td>
      <td>${t.diagnosis}</td>
      <td>${t.medicines}</td>
      <td>${t.doctor_name || "-"}</td>
      <td>${new Date(t.treatment_date).toLocaleDateString("en-IN")}</td>
    `;

    table.appendChild(row);

  });

}


/* =========================
   FORM ACTIONS
========================= */
function setupFormActions(role) {

  if (!["doctor","admin"].includes(role)) return;

  const addBtn = document.getElementById("addTreatmentBtn");
  const cancelBtn = document.getElementById("cancelTreatmentBtn");
  const saveBtn = document.getElementById("saveTreatmentBtn");
  const formCard = document.getElementById("treatmentFormCard");

  if (!addBtn || !cancelBtn || !saveBtn || !formCard) return;

  // ✅ FORCE HIDDEN INIT
  formCard.classList.add("hidden");

  // ✅ OPEN MODAL
  addBtn.onclick = () => {
    formCard.classList.remove("hidden");
  };

  // ✅ CLOSE BUTTON
  cancelBtn.onclick = () => {
    formCard.classList.add("hidden");
    clearForm();
  };

  // ✅ CLICK OUTSIDE CLOSE
  formCard.onclick = (e) => {
    if (e.target === formCard) {
      formCard.classList.add("hidden");
      clearForm();
    }
  };

  // ✅ ESC CLOSE
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      formCard.classList.add("hidden");
      clearForm();
    }
  });

  // ✅ SUBMIT
  saveBtn.onclick = submitTreatment;
}


/* =========================
   SUBMIT TREATMENT
========================= */
function submitTreatment() {

  const user = JSON.parse(sessionStorage.getItem("user"));
  const role = user.role.trim().toLowerCase();

  const appointmentSelect =
    document.getElementById("appointmentSelect");

  const diagnosis =
    document.getElementById("diagnosis");

  const medicines =
    document.getElementById("medicines");

  if (!appointmentSelect.value ||
      !diagnosis.value ||
      !medicines.value) {

    showToast("error","Fill all fields");
    return;
  }

  const [appointment_id, patient_id] =
    appointmentSelect.value.split("|");

  const body = {
    appointment_id: Number(appointment_id),
    patient_id: Number(patient_id),
    diagnosis: diagnosis.value,
    medicines: medicines.value
  };

  if (role === "admin") {

    const doctorSelect =
      document.getElementById("doctorSelect");

    if (!doctorSelect.value) {
      showToast("error","Select doctor");
      return;
    }

    body.doctor_id = Number(doctorSelect.value);

  }

  fetch("http://localhost:5000/api/treatments", {

    method:"POST",

    headers:{
      "Content-Type":"application/json",
      Authorization:`Bearer ${sessionStorage.getItem("token")}`
    },

    body:JSON.stringify(body)

  })
  .then(res => {

    if (!res.ok) throw new Error();

    return res.json();

  })
  .then(() => {

    showToast("success","Treatment added");

    document
      .getElementById("treatmentFormCard")
      .classList.add("hidden");

    clearForm();

    loadTreatments(role);

  })
  .catch(() =>
    showToast("error","Failed to add treatment")
  );

}


/* =========================
   CLEAR FORM
========================= */
function clearForm() {

  const appointment =
    document.getElementById("appointmentSelect");

  const diagnosis =
    document.getElementById("diagnosis");

  const medicines =
    document.getElementById("medicines");

  const doctor =
    document.getElementById("doctorSelect");

  if (appointment) appointment.value="";
  if (diagnosis) diagnosis.value="";
  if (medicines) medicines.value="";
  if (doctor) doctor.value="";

}


/* =========================
   LOAD DOCTORS (ADMIN)
========================= */
function loadDoctorsForAdmin() {

  const select =
    document.getElementById("doctorSelect");

  if (!select) return;

  fetch("http://localhost:5000/api/doctors",{

    headers:{
      Authorization:
      `Bearer ${sessionStorage.getItem("token")}`
    }

  })
  .then(r=>r.json())
  .then(r=>{

    const list = r.data ?? r;

    select.innerHTML =
      `<option value="">Select Doctor</option>`;

    list.forEach(d=>{

      const opt=document.createElement("option");

      opt.value=d.doctor_id;
      opt.textContent=
        `${d.first_name} ${d.last_name}`;

      select.appendChild(opt);

    });

  })
  .catch(()=>
    showToast("error","Failed to load doctors")
  );

}


/* =========================
   LOGOUT
========================= */
function setupLogout() {

  const btn=document.querySelector(".logout");

  if(!btn) return;

  btn.onclick=()=>{

    sessionStorage.clear();

    location.href="/frontend/html/login.html";

  };

}

function applySidebarRoleAccess(role) {

  const cleanRole = role.trim().toLowerCase();

  document.querySelectorAll("[data-role]").forEach(el => {

    const allowed = el.dataset.role
      .split(",")
      .map(r => r.trim().toLowerCase());

    if (!allowed.includes(cleanRole)) {
      el.style.display = "none";
    }

  });

}