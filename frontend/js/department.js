document.addEventListener("DOMContentLoaded", () => {
  loadUserInfo();
  loadDashboardStats();
  loadTodayAppointments();
  loadRecentPatients();
  setupLogout();
});

/* USER INFO */
function loadUserInfo() {
  const user = sessionStorage.getItem("user");

  if (!user) {
    showToast("error", "Please login again");
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

/* DASHBOARD STATS */
function loadDashboardStats() {
  fetch("http://localhost:5000/api/dashboard/stats")
    .then(res => res.json())
    .then(data => {
      document.getElementById("totalPatients").innerText = data.totalPatients;
      document.getElementById("todayAppointments").innerText = data.todayAppointments;
      document.getElementById("newRegistrations").innerText = data.newRegistrations;
    })
    .catch(() => showToast("error", "Failed to load statistics"));
}

/* TODAY APPOINTMENTS */
function loadTodayAppointments() {
  fetch("http://localhost:5000/api/dashboard/appointments")
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("appointmentsList");
      list.innerHTML = "";

      data.forEach(a => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${a.patientName}</strong><br>${a.doctorName} • ${a.time}`;
        list.appendChild(li);
      });
    })
    .catch(() => showToast("error", "Failed to load appointments"));
}

/* RECENT PATIENTS */
function loadRecentPatients() {
  fetch("http://localhost:5000/api/dashboard/patients")
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("patientsList");
      list.innerHTML = "";

      data.forEach(p => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${p.name}</strong><br>${p.status}`;
        list.appendChild(li);
      });
    })
    .catch(() => showToast("error", "Failed to load patients"));
}

/* LOGOUT */
function setupLogout() {
  document.querySelector(".logout").addEventListener("click", () => {
    sessionStorage.clear();
    window.location.href = "login.html";
  });
}
