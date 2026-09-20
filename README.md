# 🏫 Classroom Hub - Dynamic School Class Website

A dynamic, modern, beautifully styled web application built for your kid's school class. Features announcements, an interactive live calendar of events, automated 4-day advance WhatsApp reminders, dynamic light/dark modes with color accents, and a step-by-step GoDaddy custom domain deployment guide.

![GitHub Repo](https://img.shields.io/badge/GitHub-ashishfernandez%2Fschool--class--hub-blue?style=flat-square&logo=github)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## ✨ Features

- **🎨 Dynamic Theme & Aesthetics Engine**:
  - Light & Dark mode switch with glassmorphism UI elements.
  - 5 Custom Accent Color Palettes (*Sunburst Gold*, *Ocean Cyan*, *Electric Pink*, *Emerald Mint*, *Cosmic Violet*).
  - Smooth micro-animations and ambient glowing backdrops.

- **📢 Top Section: General Announcements**:
  - Pinned high-priority banner ticker.
  - Categorized notices (*Urgent*, *Homework*, *Field Trip*, *General*, *Party*).
  - Instant text search across all notices.
  - Admin modal to post new announcements dynamically.

- **📅 Bottom Section: Live Calendar of Events**:
  - Month Grid and Agenda List views.
  - Event details modal with time, location, organizer, and `.ics` file download (supports Apple Calendar, Google Calendar, Outlook).
  - Event creation modal with date picker and reminder calculation.

- **💬 WhatsApp Automated 4-Day Reminder Engine**:
  - Automatic calculation of reminder dates `(Event Date - 4 Days)`.
  - Dashboard monitoring all upcoming events and dispatch status (`Due Today`, `Scheduled`, `Passed`).
  - Instant 1-click WhatsApp web dispatch with pre-filled event templates.
  - Standalone 24/7 background scheduler script (`server/whatsapp-scheduler.js`) powered by Twilio / Meta WhatsApp API.

- **🌐 GoDaddy Custom Domain Live Deployment Guide**:
  - Interactive setup wizard for connecting your GoDaddy domain (e.g., `ourclass4b.com`).
  - DNS records quick-copy helper for A Record (`76.76.21.21`) and CNAME (`cname.vercel-dns.com`).

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Lucide Icons, Canvas Confetti
- **Styling**: Vanilla CSS with custom properties & glassmorphism layout
- **Backend Scheduler**: Node.js, `node-cron`, Twilio SDK

---

## 🚀 Quick Start (Local)

```bash
# 1. Clone repository
git clone https://github.com/ashishfernandez/school-class-hub.git
cd school-class-hub

# 2. Install dependencies
npm install

# 3. Launch local dev server
npm run dev
```

Local site will launch at `http://localhost:5173`.

---

## 🤖 24/7 WhatsApp Background Scheduler Setup

To run automated background reminders 4 days before every event:

```bash
cd server
npm install
npm start
```

---

## 🌐 Connecting GoDaddy Custom Domain

1. Deploy repository to Vercel or Netlify.
2. In your GoDaddy DNS settings:
   - Add **A Record**: Host `@` -> Points to `76.76.21.21`
   - Add **CNAME Record**: Host `www` -> Points to `cname.vercel-dns.com`
3. Domain SSL will activate automatically within 5-15 minutes!
