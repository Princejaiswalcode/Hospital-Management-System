document.addEventListener("DOMContentLoaded", loadProfile);

async function loadProfile() {
  const token = sessionStorage.getItem("token");
  const user = JSON.parse(sessionStorage.getItem("user"));

  if (!token || !user) {
    window.location.href = "/frontend/html/login.html";
    return;
  }

  /* ===============================
     HEADER (ALWAYS FROM SESSION)
  ================================ */
  setText("headerUserName", user.full_name);
  setText("userAvatar", user.full_name?.charAt(0).toUpperCase());

  try {
    const res = await fetch("http://localhost:5000/api/patients/me/profile", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (res.status === 401) {
      sessionStorage.clear();
      window.location.href = "/frontend/html/login.html";
      return;
    }

    const json = await res.json();

    if (!res.ok) {
      console.error("Backend error:", json);
      throw new Error(json.message || "Failed to load profile");
    }

    /* ===============================
       HANDLE RESPONSE SAFELY
    ================================ */
    const p = json.data || json; // supports both formats

    if (!p || !p.first_name) {
      throw new Error("Invalid profile data");
    }

    /* ===============================
       SET PROFILE DATA
    ================================ */

    // Name
    const fullName = `${p.first_name} ${p.last_name}`;
    setText("name", fullName);

    // Avatar (big)
    setText("avatarLarge", p.first_name.charAt(0).toUpperCase());

    // Patient ID
    setText("patientId", p.patient_id || user.user_id);

    // Basic Info
    setText("age", p.age || "-");

    setText(
      "gender",
      p.gender === "M"
        ? "Male"
        : p.gender === "F"
        ? "Female"
        : "-"
    );

    setText("phone", p.phone || "-");
    setText("email", p.email || "-");
    setText("address", p.address || "-");

    /* ===============================
       STATUS (WITH COLOR FIX)
    ================================ */
    const statusEl = document.getElementById("status");

    if (statusEl) {
      const statusText = p.status || "Unknown";
      statusEl.innerText = statusText;

      // dynamic colors
      const s = statusText.toLowerCase();

      if (s.includes("admitted")) {
        statusEl.style.background = "#fee2e2";
        statusEl.style.color = "#dc2626";
      } else if (s.includes("discharged")) {
        statusEl.style.background = "#dcfce7";
        statusEl.style.color = "#16a34a";
      } else {
        statusEl.style.background = "#e0e7ff";
        statusEl.style.color = "#1d4ed8";
      }
    }

  } catch (err) {
    console.error("Profile load error:", err);
    showToast("error", err.message || "Failed to load profile");
  }
}

/* ===============================
   HELPER
================================ */
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerText = value ?? "-";
}