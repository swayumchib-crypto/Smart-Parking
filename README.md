# SmartPark AI — Intelligent Parking Management

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![No Build](https://img.shields.io/badge/Build-None-0ea5e9)](#getting-started)
[![Demo Mode](https://img.shields.io/badge/Data-Sample%20%2F%20Demo-f59e0b)](#demo-mode)

**SmartPark** is an IoT- and AI-inspired parking dashboard. It shows which spaces are free or taken, maps occupancy across floors, surfaces camera and alert status, and presents historical patterns plus illustrative forecasts — so drivers spend less time circling lots, burning fuel, and hunting for a spot.

This repository is a **client-side web dashboard**. It runs entirely in the browser with bundled sample data (no backend, sensors, or live cameras required).

> **Demo mode:** the UI is fully interactive, but occupancy, cameras, alerts, and forecasts are sample records — not a live lot.

---

## Table of contents

- [Why this exists](#why-this-exists)
- [Features](#features)
- [Screens](#screens)
- [Architecture](#architecture)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [How it works](#how-it-works)
- [Sample dataset](#sample-dataset)
- [Customization](#customization)
- [Roadmap](#roadmap)
- [Tech stack](#tech-stack)
- [Contributing](#contributing)
- [License](#license)

---

## Why this exists

Finding parking is a small daily tax on time, fuel, and attention. SmartPark models a control-room view of a multi-zone lot:

1. **See** occupancy at a glance (dashboard + live-style map).
2. **Understand** demand over hours, days, and months (analytics + heatmap).
3. **Anticipate** when the lot will fill (illustrative AI forecasts).
4. **Operate** zones, cameras, and alerts from one admin shell.

The current build is a high-fidelity **prototype / demo** of that operator console. It is designed so a real IoT feed (ultrasonic / magnetic sensors, ANPR cameras, or an occupancy API) can replace `js/data.js` later without rewriting the UI.

---

## Features

| Area | What you get |
| --- | --- |
| **Dashboard** | KPI cards (total / available / occupied slots, entries, avg duration, detection accuracy), occupancy charts, recent activity, and a detection log with filters. |
| **Parking map** | Interactive grid for Floors A, B, and C. Filter by available / occupied / reserved / disabled. Click a stall for vehicle, type, and duration. |
| **Analytics** | Today / week / year views, occupancy lines, weekly comparison, 7×24 heatmap, monthly trend, zone donut, peak-hour table, CSV export. |
| **Predictions** | Next-6-hours occupancy, confidence bars, sample model metrics (accuracy, MAE, RMSE, R²), forecast vs observed, “best time to park”. |
| **Zones** | Main Building, East Wing, Annex, VIP, EV charging, and accessible parking with occupancy bars. |
| **Cameras** | Six camera cards with status, resolution, FPS, detection rate, and uptime (one sample camera is offline). |
| **Alerts** | Critical / warning / info items. Mark all read, dismiss, persist state in `localStorage`. |
| **Settings** | Dark / light theme, display and notification preferences (saved locally). |
| **Search** | Global search across slots, zones, cameras, alerts, and log entries — jump straight to the matching page. |
| **UX** | Responsive sidebar, toast notifications, auto-refresh of the current view, no npm or bundler. |

Charts are drawn with **custom SVG / CSS** — no Chart.js, D3, or other chart libraries.

---

## Screens

| Page | Purpose |
| --- | --- |
| **Dashboard** | Facility snapshot and recent detections |
| **Parking Map** | Stall-level layout by floor |
| **Analytics** | Historical occupancy and demand |
| **Predictions** | Sample AI availability forecast |
| **Zones** | Zone occupancy and camera assignment |
| **Cameras** | Feed status and detection health |
| **Alerts** | Capacity, offline camera, and pattern warnings |
| **Settings** | Theme and operator preferences |

---

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                     index.html                           │
│   Sidebar  ·  Top bar (search / refresh)  ·  Content     │
└────────────────────────────┬─────────────────────────────┘
                             │  App.loadPage(name)
                             ▼
┌─────────────┬──────────────┬──────────────┬──────────────┐
│ dashboard.js│ parkingmap.js│ analytic.js  │ prediction.js│
│  + zones / cameras / alerts / settings in app.js         │
└──────┬──────┴──────┬───────┴──────┬───────┴──────┬───────┘
       │             │              │              │
       ▼             ▼              ▼              ▼
                 DummyData (js/data.js)
       slots · hourly/weekly/monthly · heatmap · cameras
       zones · alerts · detection log · predictions
                             │
                             ▼
                      Charts (js/charts.js)
              bar · line · donut · heatmap (SVG)
```

Everything is **vanilla JavaScript** on a single page. Navigation does not reload the browser; `App` swaps HTML into `#contentArea` and calls each page’s `init()`.

---

## Project structure

```
Smart-Parking/
├── index.html              # Shell: sidebar, top bar, content mount
├── css/
│   └── style.css           # Dark/light theme, layout, components
├── js/
│   ├── data.js             # Sample dataset + occupancy helpers
│   ├── charts.js           # Bar, line, donut, heatmap (no deps)
│   ├── dashboard.js        # Dashboard page
│   ├── parkingmap.js       # Floor map + slot detail
│   ├── analytic.js         # Analytics + CSV export
│   ├── prediction.js       # Forecast UI
│   └── app.js              # Router, search, theme, alerts, settings
└── README.md
```

Load order in `index.html`:

`data.js` → `charts.js` → `dashboard.js` → `parkingmap.js` → `analytic.js` → `prediction.js` → `app.js`

---

## Getting started

No Node, Python, or package manager. Any static file server (or a double-click, with caveats) works.

### 1. Clone

```bash
git clone https://github.com/swayumchib-crypto/Smart-Parking.git
cd Smart-Parking
```

### 2. Open the dashboard

**Option A — Python**

```bash
python3 -m http.server 8080
```

Then visit [http://localhost:8080](http://localhost:8080).

**Option B — Node**

```bash
npx --yes serve .
```

**Option C — VS Code**

Install [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) and “Open with Live Server” on `index.html`.

**Option D — file protocol**

You can open `index.html` directly in a browser. Google Fonts (Inter) needs network access; everything else is local.

### 3. Deploy (optional)

This is a static site. Drop the folder on **GitHub Pages**, Netlify, Cloudflare Pages, or any nginx/Apache host. Set the site root to the repository root so `css/` and `js/` resolve.

---

## How it works

### Routing

`App.loadPage('dashboard' | 'parking-map' | 'analytics' | 'predictions' | 'zones' | 'cameras' | 'alerts' | 'settings')` updates the nav highlight, title, breadcrumb, and inner HTML.

### Slot statuses

| Status | Meaning |
| --- | --- |
| `available` | Empty, can be taken |
| `occupied` | Vehicle present (plate + type + since) |
| `reserved` | Held for a booking |
| `disabled` | Out of service |

Occupancy color: **green** &lt; 60%, **yellow** 60–84%, **red** ≥ 85%.

### Theme & alerts

- Theme is stored as `smartpark-theme` (`dark` \| `light`) in `localStorage`.
- Alert read/dismissed flags are stored as `smartpark-alerts`.

### Search

The top-bar search indexes stall IDs, zone names, camera IDs, alert titles, and detection-log rows. Selecting a result navigates and scrolls/highlights the match (slots open on the map).

---

## Sample dataset

Defined in [`js/data.js`](js/data.js). Snapshot:

| Item | Sample value |
| --- | --- |
| Total stalls | 60 (Floor A 24 · B 20 · C 16) |
| Occupied / available / reserved / disabled | 27 / 29 / 2 / 2 |
| Today’s entries / exits | 187 / 160 |
| Average duration | 3h 24m |
| Detection accuracy (dashboard) | 97.3% |
| Zones | 6 (general, VIP, EV, accessible) |
| Cameras | 6 (CAM-06 sample offline) |
| Vehicle plates | Jammu & Kashmir series (`JK…`) |

Forecasts and model metrics (94.2% accuracy, MAE 3.1, RMSE 4.7, R² 0.92) are **illustrative** — there is no trained model in this repo.

To swap in your own numbers, edit `DummyData` and keep the same shapes (`parkingSlots`, `hourlyOccupancy`, `zones`, `cameras`, `alerts`, `predictions`, …). Helper methods `getOccupancyPercentage()`, `getFloorStats()`, and `getOccupancyColor()` are used across pages.

---

## Customization

| Goal | Where |
| --- | --- |
| Change stall layout / occupancy | `js/data.js` → `parkingSlots` |
| Change KPIs | `js/data.js` → `overview` |
| Add a zone or camera | `zones` / `cameras` arrays |
| Brand colors | `css/style.css` → `:root` and `:root[data-theme="light"]` |
| New page | Add a `data-page` item in `index.html`, a renderer, and a `case` in `App.loadPage` |
| Connect a live API | Replace `DummyData` fields with `fetch()` results; keep the object shape so pages do not change |

---

## Roadmap

Ideas for turning the demo into a production system:

- [ ] REST / WebSocket feed from occupancy sensors or ANPR cameras
- [ ] Real ML service for the Predictions page (replace static `predictions`)
- [ ] Auth and role-based access (operator vs admin)
- [ ] Persist bookings and reservations on a backend
- [ ] Live camera streams instead of sample placeholders
- [ ] Public driver view (“nearest free stall”) in addition to the admin console
- [ ] PWA / mobile layout polish for on-site staff

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Markup | HTML5 |
| Style | CSS3 custom properties, dark + light themes, Inter (Google Fonts) |
| Logic | Vanilla ES6+ (no framework, no bundler) |
| Charts | Custom SVG in `charts.js` |
| Persistence | `localStorage` (theme, alerts) |
| Data | In-memory sample objects in `data.js` |

**Requirements:** a modern browser (Chrome, Firefox, Edge, Safari). No build step.

---

## Contributing

Issues and pull requests are welcome.

1. Fork the repo and create a branch (`git checkout -b feature/your-idea`).
2. Keep pages data-driven — prefer editing `data.js` over hard-coding numbers in views.
3. Match existing naming (`DashboardPage`, `ParkingMapPage`, …) and the `App.loadPage` switch.
4. Open a PR with a short description of the change.

---
