document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const token = sessionStorage.getItem("token");

  if (!user || !token) {
    window.location.href = "/frontend/html/login.html";
    return;
  }

  applyUserInfo(user);
  loadBillsFromAPI(token);
  setupLogout();
});

function applyUserInfo(user) {
  const name = user.full_name || "User";

  setText("welcomeText", `Welcome, ${name}`);
  setText("headerUserName", name);
  setText("userRole", `${capitalize(user.role)} Dashboard`);
  setText("userAvatar", name.charAt(0).toUpperCase());
}

async function loadBillsFromAPI(token) {
  try {
    const res = await fetch("http://localhost:5000/api/billing/my", {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Failed to fetch bills");

    const json = await res.json();

    const bills = json.data || [];
    renderBills(bills);
    calculateSummary(bills);

  } catch (err) {
    console.error(err);
  }
}

function renderBills(bills) {
  const tbody = document.getElementById("bills");
  tbody.innerHTML = "";

  if (!bills.length) {
    tbody.innerHTML = `<tr><td colspan="6">No bills found</td></tr>`;
    return;
  }

  bills.forEach(b => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${formatDate(b.bill_date)}</td>
      <td>₹${b.consultation_fee || 0}</td>
      <td>₹${b.medicine_cost || 0}</td>
      <td>₹${b.room_charges || 0}</td>
      <td><b>₹${b.total_amount}</b></td>
      <td>
        <span class="badge ${b.payment_status === "Paid" ? "paid" : "pending"}">
          ${b.payment_status}
        </span>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

function calculateSummary(bills) {
  let total = 0, paid = 0, pending = 0;

  bills.forEach(b => {
    total += Number(b.total_amount);

    if (b.payment_status === "Paid") {
      paid += Number(b.total_amount);
    } else {
      pending += Number(b.total_amount);
    }
  });

  setText("totalAmount", `₹${total}`);
  setText("paidAmount", `₹${paid}`);
  setText("pendingAmount", `₹${pending}`);

  if (pending > 0) {
    const box = document.getElementById("reminderBox");
    box.style.display = "block";
    box.innerHTML = `
      <b>Payment Reminder</b><br>
      You have a pending amount of ₹${pending}. Please clear your dues.
    `;
  }
}

/* helpers */
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerText = value;
}

function capitalize(text = "") {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN");
}

function setupLogout() {
  document.querySelector(".logout").onclick = () => {
    sessionStorage.clear();
    window.location.href = "/frontend/html/login.html";
  };
}