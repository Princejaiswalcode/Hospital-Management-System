document.addEventListener("DOMContentLoaded", () => {
  checkRoleAccess();
  loadUserInfo();
  setupFormActions();
  loadBills();
  setupLogout();
});

/* =========================
   ROLE CHECK
========================= */
function checkRoleAccess() {
  const user = JSON.parse(sessionStorage.getItem("user"));

  if (!user || !["admin", "accounts"].includes(user.role)) {
    showToast("error", "Access denied");
    window.location.href = "/frontend/html/dashboard.html";
  }
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

/* =========================
   FORM ACTIONS
========================= */
function setupFormActions() {
  const formCard = document.getElementById("billFormCard");
  const toggleBtn = document.getElementById("toggleBillForm");
  const cancelBtn = document.getElementById("cancelBillBtn");
  const generateBtn = document.getElementById("generateBillBtn");

  const consultation = document.getElementById("consultationCharge");
  const medicine = document.getElementById("medicineCharge");
  const room = document.getElementById("roomCharge");

  toggleBtn.onclick = () => {
    formCard.classList.toggle("hidden");
  };

  cancelBtn.onclick = () => {
    formCard.classList.add("hidden");
  };

  [consultation, medicine, room].forEach(input =>
    input.addEventListener("input", updateTotal)
  );

  generateBtn.onclick = createBill;
}

/* =========================
   TOTAL CALC
========================= */
function updateTotal() {
  const consultation = Number(document.getElementById("consultationCharge").value);
  const medicine = Number(document.getElementById("medicineCharge").value);
  const room = Number(document.getElementById("roomCharge").value);

  const total = consultation + medicine + room;
  document.getElementById("totalAmount").innerText = `₹${total.toFixed(2)}`;
}

/* =========================
   LOAD BILLS
========================= */
function loadBills() {
  const token = sessionStorage.getItem("token");
  const table = document.getElementById("billingTable");
  table.innerHTML = "";

  fetch("http://localhost:5000/api/billing", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(response => {
      const data = response.data;

      data.forEach(b => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
          <td>#${b.patient_id}</td>
          <td><strong>${b.patient_name}</strong></td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
          <td><strong>₹${b.total_amount}</strong></td>
          <td>${b.bill_date}</td>
          <td>
            <span class="badge ${b.payment_status.toLowerCase()}">
              ${b.payment_status}
            </span>
          </td>
          <td>
            ${
              b.payment_status === "Pending"
                ? `<a href="#" onclick="markPaid(${b.bill_id})">Mark as Paid</a>`
                : "-"
            }
          </td>
        `;

        table.appendChild(tr);
      });
    })
    .catch(() => showToast("error", "Failed to load bills"));
}

/* =========================
   CREATE BILL
========================= */
function createBill() {
  const token = sessionStorage.getItem("token");

  const consultation = Number(document.getElementById("consultationCharge").value);
  const medicine = Number(document.getElementById("medicineCharge").value);
  const room = Number(document.getElementById("roomCharge").value);

  const total = consultation + medicine + room;

  const payload = {
    patient_id: document.getElementById("patientSelect").value,
    total_amount: total,
    payment_status: "Pending",
    bill_date: new Date().toISOString().split("T")[0]
  };

  fetch("http://localhost:5000/api/billing", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  })
    .then(res => {
      if (!res.ok) throw new Error();
      showToast("success", "Bill generated");
      document.getElementById("billFormCard").classList.add("hidden");
      loadBills();
    })
    .catch(() => showToast("error", "Failed to generate bill"));
}

/* =========================
   MARK PAID
========================= */
function markPaid(id) {
  const token = sessionStorage.getItem("token");

  fetch(`http://localhost:5000/api/billing/${id}/pay`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(() => {
      showToast("success", "Payment updated");
      loadBills();
    });
}

/* =========================
   LOGOUT
========================= */
function setupLogout() {
  document.querySelector(".logout").onclick = () => {
    sessionStorage.clear();
    window.location.href = "/frontend/html/login.html";
  };
}
