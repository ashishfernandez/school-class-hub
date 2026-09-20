# Recovery & Backup Guide — KANGAROOS Class Hub

This document explains where everything lives and how to get back up and running
if your computer crashes, is lost, or you switch to a new machine.

**Live site:** https://gissvroos.com
**GitHub repo:** https://github.com/ashishfernandez/school-class-hub

---

## TL;DR — Am I safe if my computer dies?

**Yes.** Nothing critical lives only on your computer:

| Thing | Where it lives | Survives a crash? |
|-------|----------------|-------------------|
| Live website | Vercel (cloud) | ✅ Stays online 24/7 |
| Source code + full history | GitHub (cloud) | ✅ |
| Extra code backup | OneDrive (cloud) | ✅ |
| Shared data (announcements/events) | Supabase (cloud) | ✅ |
| `node_modules/`, `dist/` | Only your computer | ❌ but auto-regenerated |

The only local-only folders (`node_modules/`, `dist/`) are **not real work** — they're
rebuilt automatically with one command.

---

## Recover onto a new computer

1. **Install the tools**
   - [Node.js](https://nodejs.org) (LTS version)
   - [Git](https://git-scm.com)

2. **Clone the repo**
   ```bash
   git clone https://github.com/ashishfernandez/school-class-hub.git
   cd school-class-hub
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Run it locally (optional)**
   ```bash
   npm run dev
   ```
   Open the URL it prints (usually http://localhost:5173).

That's it — you're back exactly where you left off.

> Running locally without the Supabase keys (see below) is fine: the app
> automatically falls back to per-browser `localStorage`. The **live** site on
> Vercel already has the keys configured, so it is unaffected.

---

## Local development against the SHARED database (optional)

Only needed if you want your local copy to read/write the same data as the live site.

1. In the project root, create a file named `.env.local`
2. Add these two lines (values from Supabase → Project Settings → API):
   ```
   VITE_SUPABASE_URL=https://YOUR-PROJECT-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```
3. Restart `npm run dev`.

`.env.local` is intentionally **not** committed to GitHub (it's in `.gitignore`).

---

## Deploying changes

Any change you commit and push to the `main` branch auto-deploys to gissvroos.com:

```bash
git add -A
git commit -m "Describe your change"
git push origin main
```

Vercel builds and publishes automatically (~1 minute).

---

## Accounts that tie everything together (keep these logins safe!)

These are the *only* things not stored in the code. Keep the passwords in a
password manager:

- **GitHub** — https://github.com (source code)
- **Vercel** — https://vercel.com (hosting / deployments / env vars)
- **Supabase** — https://supabase.com (shared database + API keys)
- **GoDaddy** — https://godaddy.com (the gissvroos.com domain + DNS)

### Key DNS settings (in GoDaddy) for reference
| Type | Name | Value |
|------|------|-------|
| A | `@` | `216.198.79.1` |
| CNAME | `www` | `de9d69dfdc8d57be.vercel-dns-017.com` |

### Admin Portal
- The Parent Rep Admin Portal password is set in `src/components/AdminPortalModal.jsx`.

---

## Restore the database schema (only if Supabase is ever wiped)

The table definitions live in `supabase/schema.sql`. To rebuild the tables:
Supabase Dashboard → SQL Editor → paste the contents of that file → Run.
