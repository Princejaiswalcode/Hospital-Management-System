document.addEventListener("DOMContentLoaded", () => {
  loadUserInfo();
  applyRoleAccess();
  setupFormToggle();
  loadStaff();
  loadSalaryHistory();
  setupLogout();
});

/* =========================
   HELPER: AUTH HEADER
========================= */
function authHeader() {
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${sessionStorage.getItem("token")}`
  };
}

/* USER INFO */
function loadUserInfo() {
  const user = sessionStorage.getItem("user");
  if (!user) {
    window.location.href = "/frontend/html/login.html";
    return;
  }

  const data = JSON.parse(user);
  userName.innerText = data.full_name;
  headerUserName.innerText = data.full_name;
  userRole.innerText = data.role + " Dashboard";
  userAvatar.innerText = data.full_name.charAt(0).toUpperCase();
}

/* ROLE ACCESS */
function applyRoleAccess() {
  const user = JSON.parse(sessionStorage.getItem("user"));

  if (!["admin", "accounts"].includes(user.role.toLowerCase())) {
    document.getElementById("toggleSalaryForm").style.display = "none";
    document.getElementById("salaryForm").style.display = "none";
  }
}

/* FORM TOGGLE */
function setupFormToggle() {
  const openBtn = document.getElementById("toggleSalaryForm");
  const form = document.getElementById("salaryForm");
  const cancelBtn = document.getElementById("cancelSalaryForm");

  form.classList.add("hidden");

  openBtn.onclick = () => {
    form.classList.remove("hidden");
  };

  cancelBtn.onclick = () => {
    form.classList.add("hidden");
  };

  form.onclick = (e) => {
    if (e.target === form) {
      form.classList.add("hidden");
    }
  };
}

/* LOAD STAFF */
function loadStaff() {
  const staffCards = document.getElementById("staffCards");
  const staffSelect = document.getElementById("staffSelect");
const staff = [
  {
    id: 61,
    name: "Dr. Arun Mehta",
    role: "Doctor",
    type: "doctor",
    salary: 80000
  },
  {
    id: 21, // ✅ CORRECT nurse_id from DB
    name: "Kavita Singh",
    role: "Nurse",
    type: "nurse",
    salary: 35000
  }
];

  staffCards.innerHTML = "";
  staffSelect.innerHTML = `<option value="">Select Staff</option>`;

  staff.forEach(s => {
    staffCards.innerHTML += `
      <div class="staff-card">
        <div class="avatar-circle">${s.name.charAt(0)}</div>
        <h4>${s.name}</h4>
        <p>${s.role}</p>
        ${s.specialization ? `<p>Specialization: ${s.specialization}</p>` : ""}
        <p>Contact: ${s.contact}</p>
        <p class="salary">Salary: ₹${s.salary.toLocaleString()}</p>
      </div>
    `;

    // 🔥 IMPORTANT: store type
    staffSelect.innerHTML += `
      <option value="${s.id}" data-type="${s.type}">
        ${s.name}
      </option>
    `;
  });
}

/* LOAD SALARY HISTORY */
function loadSalaryHistory() {
  const salaryTable = document.getElementById("salaryTable");

  fetch("http://localhost:5000/api/salary", {
    headers: authHeader()
  })
    .then(res => {
      if (!res.ok) throw new Error("Unauthorized");
      return res.json();
    })
    .then(res => {
      const data = res.data;

      salaryTable.innerHTML = "";

      if (!data || data.length === 0) {
        salaryTable.innerHTML = `<tr><td colspan="4">No records found</td></tr>`;
        return;
      }

      data.forEach(h => {
        salaryTable.innerHTML += `
          <tr>
            <td><strong>${h.employee_name}</strong></td>
            <td>₹${Number(h.amount).toLocaleString()}</td>
            <td>${new Date(h.payment_date).toLocaleDateString()}</td>
            <td><span class="badge paid">Paid</span></td>
          </tr>
        `;
      });
    })
    .catch(err => {
      console.error(err);
      showToast("error", "Failed to load salary history");
    });
}

/* PROCESS SALARY */
document.getElementById("processSalaryBtn").onclick = () => {
  const staffSelect = document.getElementById("staffSelect");
  const salaryAmount = document.getElementById("salaryAmount");
  const paymentDate = document.getElementById("paymentDate");
  const form = document.getElementById("salaryForm");

  const selectedOption = staffSelect.selectedOptions[0];
  const employee_type = selectedOption?.dataset.type;

  const amount = Math.max(0, Number(salaryAmount.value) || 0);

  if (!staffSelect.value || !employee_type || amount <= 0 || !paymentDate.value) {
    showToast("error", "Please fill all fields correctly");
    return;
  }

  const payload = {
    employee_id: staffSelect.value,
    employee_type: employee_type, // ✅ FIXED
    amount: amount,
    payment_date: paymentDate.value,
    payment_month: new Date(paymentDate.value).getMonth() + 1,
    payment_year: new Date(paymentDate.value).getFullYear(),
    payment_method: "cash"
  };

  fetch("http://localhost:5000/api/salary", {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify(payload)
  })
    .then(res => {
      if (!res.ok) throw new Error();

      showToast("success", "Salary payment processed");

      form.classList.add("hidden");

      salaryAmount.value = "";
      staffSelect.value = "";
      paymentDate.value = "";

      loadSalaryHistory();
    })
    .catch(() => {
      showToast("error", "Failed to process salary");
    });
};

/* INPUT CLEANING */
document.getElementById("salaryAmount").addEventListener("input", (e) => {
  let value = e.target.value;

  if (value < 0) value = 0;
  value = value.replace(/^0+/, "");

  e.target.value = value;
});

/* LOGOUT */
function setupLogout() {
  document.querySelector(".logout").onclick = () => {
    sessionStorage.clear();
    window.location.href = "/frontend/html/login.html";
  };
}