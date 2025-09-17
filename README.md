# BOD Impact Dashboard

Mini Dashboard System for **BOD** 

## Demo Access

```
Email:    demo@bod.consulting
Password: demo123
URL:      http://localhost:8080
```

> Mock login is used to demonstrate protected routes. No real accounts.

---

## Data & Persistence (Read this first)

* **API**: The app uses **MockAPI.io** for real CRUD persistence.
  Base URL: `https://68c6e0bf442c663bd028347b.mockapi.io/api/v1`
* **Resources**: `projects` and `team-members` (CRUD).
* **Metrics**: Shown with small static mock data to demonstrate charts.

---

## Quick Start

**Prerequisites:** Node.js 18+ and pnpm

```bash
pnpm install
pnpm dev
```

App runs on `http://localhost:8080` (your dev server may print a different port if 8080 is taken).

---

## Tech Stack

* **Frontend:** React 18 + TypeScript, Vite
* **UI:** Tailwind CSS, shadcn/ui
* **State & Data:** React Context + Custom Hooks 
* **Routing:** React Router v6 (protected routes)
* **Charts:** Recharts

---

## API Endpoints (MockAPI)

Base: `https://68c6e0bf442c663bd028347b.mockapi.io/api/v1`

* `GET /projects` — list projects (supports `?page`, `?limit`)

* `POST /projects` — create project

* `PUT /projects/:id` — update project

* `DELETE /projects/:id` — delete project

* `GET /team-members` — list members

* `POST /team-members` — create member

* `PUT /team-members/:id` — update member

* `DELETE /team-members/:id` — delete member

> If the API is unreachable, the UI surfaces a clear error with a retry option.

---
