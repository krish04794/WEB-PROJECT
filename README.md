# College Event Manager (Practical Submission)

How to run locally:

1. Open this folder in VS Code.
2. Use a simple static server to avoid CORS issues when fetching JSON:
   - With VS Code Live Server: Right-click `index.html` → "Open with Live Server".
   - Or with Node: `npx serve` (or `npx http-server`). Then open the shown URL.

Project structure:

- `index.html`: Home with hero, events, and registration form
- `assets/css/styles.css`: Global responsive styles
- `assets/js/utils.js`: Helpers for fetching, ids, and escaping
- `assets/js/site.js`: Page logic, event render, form handling
- `data/*.json`: Seed data for events, speakers, sponsors, students, gallery

Extend next:

- Build dedicated pages for events, schedule, speakers, sponsors, gallery, contact
- Persist registrations to a backend or Google Sheets API
- Add service worker for offline caching


