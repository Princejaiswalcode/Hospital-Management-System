
document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const token = sessionStorage.getItem("token");

  if (!user || !token) {
    window.location.href = "/frontend/html/login.html";
    return;
  }

  applyUserInfo(user);
  applyRoleAccess(user.role);
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

function applyRoleAccess(role) {
  const cleanRole = role.trim().toLowerCase();
  document.querySelectorAll("[data-role]").forEach(el => {
    const allowedRoles = el.dataset.role.split(",").map(r => r.trim().toLowerCase());
    if (!allowedRoles.includes(cleanRole)) el.style.display = "none";
  });
}

async function loadBillsFromAPI(token) {
  try {
    const res = await fetch("http://localhost:5000/api/billing/my", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    const text = await res.text();

    if (text.includes("<html>")) {
      console.error("Received HTML instead of JSON");
      return;
    }

    const json = JSON.parse(text);
    renderBills(json.data);

  } catch (err) {
    console.error(err);
  }
}

function renderBills(bills = []) {
  const tbody = document.getElementById("bills");
  tbody.innerHTML = "";

  if (!bills.length) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;">No bills found</td></tr>`;
    return;
  }

  bills.forEach(b => {
    const tr = document.createElement("tr");
    const date = new Date(b.bill_date).toLocaleDateString();

    tr.innerHTML = `
      <td>#${b.bill_id}</td>
      <td>₹${b.total_amount}</td>
      <td>${b.payment_status}</td>
      <td>${date}</td>
    `;

    tbody.appendChild(tr);
  });
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerText = value;
}

function capitalize(text = "") {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function setupLogout() {
  const btn = document.querySelector(".logout");
  if (btn) {
    btn.onclick = () => {
      sessionStorage.clear();
      window.location.href = "/frontend/html/login.html";
    };
  }
}