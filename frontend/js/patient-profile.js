document.addEventListener("DOMContentLoaded", loadProfile);

async function loadProfile() {
  const token = sessionStorage.getItem("token");
  const user = JSON.parse(sessionStorage.getItem("user"));

  if (!token || !user) {
    window.location.href = "/frontend/html/login.html";
    return;
  }

  // Header info (same style as dashboard)
  document.getElementById("headerUserName").innerText = user.full_name;
  document.getElementById("userAvatar").innerText =
    user.full_name.charAt(0).toUpperCase();

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

    if (!res.ok) throw new Error(json.message || "Failed to load profile");

    const p = json; // Directly access the returned object (no 'data' field)

    // Ensure the response has the correct structure before accessing properties
    if (p) {
      setText("name", `${p.first_name} ${p.last_name}`);
      setText("age", p.age); // Assuming 'age' is being calculated or passed directly
      setText("gender", p.gender === 'M' ? 'Male' : 'Female'); // Display gender
      setText("phone", p.phone || "-"); // Ensure phone number is available
      setText("email", p.email || "-"); // Ensure email is available
      setText("status", p.status || "-"); // Ensure status is available
    } else {
      throw new Error("Patient data is missing or malformed");
    }

  } catch (err) {
    console.error(err);
    showToast("error", err.message || "Failed to load profile");
  }
}

/* helper */
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerText = value || "-";
}