document.addEventListener("DOMContentLoaded", () => {
  loadUserInfo();
  loadPatients();
  setupLogout();
});

/* USER INFO */
function loadUserInfo() {
  const user = sessionStorage.getItem("user");
  if (!user) {
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

/* LOAD PATIENTS */
function loadPatients() {
  fetch("http://localhost:5000/api/patients")
    .then(res => res.json())
    .then(data => {
      const table = document.getElementById("patientsTable");
      table.innerHTML = "";

      data.forEach(p => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
          <td><strong>${p.name}</strong></td>
          <td>${p.age} / ${p.gender}</td>
          <td>${p.contact}</td>
          <td>${p.address}</td>
          <td>
            <span class="badge ${p.status.toLowerCase()}">
              ${p.status}
            </span>
          </td>
        `;

        table.appendChild(tr);
      });
    })
    .catch(() => {
      showToast("error", "Failed to load patients");
    });
}

document.getElementById("patientForm").addEventListener("submit", registerPatient);

function registerPatient(e) {
  e.preventDefault();

  const patientData = {
    name: document.getElementById("name").value,
    gender: document.getElementById("gender").value,
    age: document.getElementById("age").value,
    contact: document.getElementById("contact").value,
    address: document.getElementById("address").value,
    status: document.getElementById("status").value
  };

  fetch("http://localhost:5000/api/patients", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(patientData)
  })
    .then(res => {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .then(() => {
      showToast("success", "Patient registered successfully");
      document.getElementById("patientForm").reset();
      loadPatients(); // refresh table
    })
    .catch(() => {
      showToast("error", "Failed to register patient");
    });
}


/* LOGOUT */
function setupLogout() {
  document.querySelector(".logout").addEventListener("click", () => {
    sessionStorage.clear();
    window.location.href = "login.html";
  });
}
