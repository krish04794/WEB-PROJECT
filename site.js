document.addEventListener("DOMContentLoaded", async () => {
  const navToggleButton = document.getElementById("navToggle");
  const nav = document.getElementById("siteNav");
  const eventList = document.getElementById("eventList");
  const eventSelect = document.getElementById("eventSelect");
  const registerForm = document.getElementById("registerForm");

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  if (navToggleButton && nav) {
    navToggleButton.addEventListener("click", () => {
      nav.classList.toggle("open");
    });
  }

  // Load events
  try {
    const events = await fetchJson("data/events.json");
    renderEvents(events, eventList);
    populateEventSelect(events, eventSelect);
  } catch (err) {
    if (eventList) {
      eventList.innerHTML = `<li class="card">Failed to load events.</li>`;
    }
  }

  // Register form handler (stores to localStorage)
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(registerForm);
      const fullName = String(formData.get("fullName") || "").trim();
      const email = String(formData.get("email") || "").trim();
      const eventId = String(formData.get("eventId") || "").trim();

      const errors = [];
      if (!fullName) errors.push("Full Name is required");
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("Valid Email is required");
      if (!eventId) errors.push("Please choose an event");

      if (errors.length) {
        alert(errors.join("\n"));
        return;
      }

      const registration = { id: cryptoRandomId(), fullName, email, eventId, createdAt: new Date().toISOString() };
      const key = "cem_registrations";
      const existing = safeJsonParse(localStorage.getItem(key), []);
      existing.push(registration);
      localStorage.setItem(key, JSON.stringify(existing));
      registerForm.reset();
      alert("Registration saved locally! You can extend this to send to a backend.");
    });
  }
});

function renderEvents(events, container) {
  if (!container) return;
  if (!Array.isArray(events) || events.length === 0) {
    container.innerHTML = `<li class="card">No events yet.</li>`;
    return;
  }
  container.innerHTML = events.slice(0, 6).map((ev) => `
    <li class="card">
      <h3>${escapeHtml(ev.title)}</h3>
      <div class="meta">${escapeHtml(ev.date)} • ${escapeHtml(ev.venue || "TBA")}</div>
      ${ev.image ? `<img src="${escapeAttr(ev.image)}" alt="${escapeAttr(ev.title)}" />` : ""}
      <div>
        ${(ev.tags || []).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join(" ")}
      </div>
    </li>
  `).join("");
}

function populateEventSelect(events, selectEl) {
  if (!selectEl) return;
  if (!Array.isArray(events)) return;
  for (const ev of events) {
    const opt = document.createElement("option");
    opt.value = String(ev.id);
    opt.textContent = ev.title;
    selectEl.appendChild(opt);
  }
}

