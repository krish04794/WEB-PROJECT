const API_BASE = "http://localhost:3001/api";

// Basic auth helpers
function getStoredUsers(){
  return JSON.parse(localStorage.getItem("cem_users") || "[]");
}
function setStoredUsers(users){
  localStorage.setItem("cem_users", JSON.stringify(users));
}
function setToken(token){
  localStorage.setItem("cem_token", token);
}
function getToken(){
  return localStorage.getItem("cem_token");
}
function clearToken(){
  localStorage.removeItem("cem_token");
}
function isAuthed(){
  return Boolean(getToken());
}

// Navbar auth link (Login/Logout)
function renderAuthLink(){
  const nav = document.getElementById("siteNav");
  if (!nav) return;
  let link = nav.querySelector('[data-auth-link="true"]');
  if (!link) {
    link = document.createElement("a");
    link.className = "nav-link";
    link.setAttribute("data-auth-link", "true");
    nav.appendChild(link);
  }
  if (isAuthed()) {
    link.textContent = "Logout";
    link.href = "#logout";
    link.addEventListener("click", (e) => {
      e.preventDefault();
      clearToken();
      alert("Logged out.");
      window.location.href = "index.html";
    }, { once: true });
  } else {
    link.textContent = "Login";
    link.href = "login.html";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  const navToggle = document.getElementById("navToggle");
  const siteNav = document.getElementById("siteNav");
  if (navToggle && siteNav) navToggle.addEventListener("click", () => siteNav.classList.toggle("open"));

  renderAuthLink();

  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const toRegister = document.getElementById("toRegister");
  if (toRegister) toRegister.addEventListener("click", () => document.getElementById("registerForm").scrollIntoView({ behavior: "smooth" }));

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const form = new FormData(loginForm);
      const payload = { email: String(form.get("email")||"").trim(), password: String(form.get("password")||"") };
      if (!payload.email || !payload.password) { alert("Email and password required"); return; }
      try {
        const res = await fetch(`${API_BASE}/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error("Login failed");
        const data = await res.json();
        setToken(data.token || "server-token");
        alert("Logged in!");
        window.location.href = "index.html";
      } catch (err) {
        // Local fallback auth
        const users = getStoredUsers();
        const found = users.find(u => u.email.toLowerCase() === payload.email.toLowerCase() && u.password === payload.password);
        if (!found) { alert("Invalid credentials. If server is down, register first."); return; }
        setToken("local-demo-token");
        alert("Logged in (local mode).");
        window.location.href = "index.html";
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const form = new FormData(registerForm);
      const payload = { name: String(form.get("name")||"").trim(), email: String(form.get("email")||"").trim(), password: String(form.get("password")||"") };
      if (!payload.name || !payload.email || payload.password.length < 6) { alert("Fill all fields (password min 6 chars)"); return; }
      try {
        const res = await fetch(`${API_BASE}/auth/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error("Register failed");
        const data = await res.json();
        setToken(data.token || "server-token");
        alert("Registered! You're now logged in.");
        window.location.href = "index.html";
      } catch (err) {
        // Local fallback registration
        const users = getStoredUsers();
        if (users.some(u => u.email.toLowerCase() === payload.email.toLowerCase())) { alert("Email already exists (local mode)"); return; }
        users.push({ name: payload.name, email: payload.email, password: payload.password });
        setStoredUsers(users);
        setToken("local-demo-token");
        alert("Registered locally. You're now logged in.");
        window.location.href = "index.html";
      }
    });
  }
});

// Expose minimal API for page guards if needed
window.cemAuth = { isAuthed, getToken, logout: () => { clearToken(); renderAuthLink(); } };




