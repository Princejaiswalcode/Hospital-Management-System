document.addEventListener("DOMContentLoaded", () => {
  checkRoleAccess();
  loadUserInfo();
  setupModal();
  loadBills();
  loadPatients();
  setupLogout();
});

/* ROLE CHECK */
function checkRoleAccess() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  if (!user || !["admin", "accounts"].includes(user.role)) {
    showToast("error", "Access denied");
    window.location.href = "/frontend/html/dashboard.html";
  }
}

/* USER INFO */
function loadUserInfo() {
  const data = JSON.parse(sessionStorage.getItem("user"));
  userName.innerText = data.full_name;
  headerUserName.innerText = data.full_name;
  userRole.innerText = data.role + " Dashboard";
  userAvatar.innerText = data.full_name.charAt(0).toUpperCase();
}

/* MODAL LOGIC */
function setupModal() {
  const modal = document.getElementById("billFormModal");
  const openBtn = document.getElementById("toggleBillForm");
  const cancelBtn = document.getElementById("cancelBillBtn");

  openBtn.onclick = () => modal.classList.remove("hidden");
  cancelBtn.onclick = () => modal.classList.add("hidden");

  modal.onclick = (e) => {
    if (e.target === modal) modal.classList.add("hidden");
  };

  ["consultationCharge", "medicineCharge", "roomCharge"].forEach(id => {
    document.getElementById(id).addEventListener("input", updateTotal);
  });

  document.getElementById("generateBillBtn").onclick = createBill;
}

/* TOTAL */
function updateTotal() {
  const c = Math.max(0, Number(consultationCharge.value) || 0);
  const m = Math.max(0, Number(medicineCharge.value) || 0);
  const r = Math.max(0, Number(roomCharge.value) || 0);

  consultationCharge.value = c;
  medicineCharge.value = m;
  roomCharge.value = r;

  totalAmount.innerText = `₹${(c + m + r).toFixed(2)}`;
}

/* LOAD BILLS */
function loadBills() {
  const token = sessionStorage.getItem("token");

  fetch("http://localhost:5000/api/billing", {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(res => {
      billingTable.innerHTML = "";

      res.data.forEach(b => {
        billingTable.innerHTML += `
          <tr>
            <td>#${b.patient_id}</td>
            <td><strong>${b.patient_name}</strong></td>
            <td>${b.consultation_charge}</td>
            <td>${b.medicine_charge}</td>
            <td>${b.room_charge}</td>
            <td><strong>₹${b.total_amount}</strong></td>
            <td>${b.bill_date}</td>
            <td><span class="badge ${b.payment_status.toLowerCase()}">${b.payment_status}</span></td>
            <td>${b.payment_status === "Pending"
              ? `<a href="#" onclick="markPaid(${b.bill_id})">Mark as Paid</a>`
              : "-"}</td>
          </tr>`;
      });
    });
}

/* LOAD PATIENTS */
function loadPatients() {
  const token = sessionStorage.getItem("token");

  fetch("http://localhost:5000/api/patients", {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(data => {
      patientSelect.innerHTML = `<option value="">Select Patient</option>`;
      data.forEach(p => {
        patientSelect.innerHTML += `<option value="${p.patient_id}">
          ${p.first_name} ${p.last_name}
        </option>`;
      });
    });
}

/* CREATE BILL */
function createBill() {
  const token = sessionStorage.getItem("token");

  const c = Number(consultationCharge.value);
  const m = Number(medicineCharge.value);
  const r = Number(roomCharge.value);

  const payload = {
    patient_id: patientSelect.value,
    consultation_charge: c,
    medicine_charge: m,
    room_charge: r,
    total_amount: c + m + r,
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
    .then(() => {
      showToast("success", "Bill generated");
      billFormModal.classList.add("hidden");
      loadBills();
    });
}

/* MARK PAID */
function markPaid(id) {
  const token = sessionStorage.getItem("token");

  fetch(`http://localhost:5000/api/billing/${id}/pay`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` }
  }).then(() => loadBills());
}

/* LOGOUT */
function setupLogout() {
  document.querySelector(".logout").onclick = () => {
    sessionStorage.clear();
    window.location.href = "/frontend/html/login.html";
  };
}