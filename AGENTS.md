# AGENTS.md

## Cursor Cloud specific instructions

This repo is a static personal portfolio site (`index.html`, `about/`, `portfolio/`,
`experience/`, `blog/`, `admin/`) plus Vercel serverless functions in `api/*.js` that
read/write a MySQL database. The public site degrades gracefully to hard-coded content
when the API/DB is unavailable (see `db-loader.js`), so a running DB is only required to
exercise the dynamic content and the admin CMS.

### Running the app locally

- Full stack (recommended): `npm run dev` starts `dev-server.js` on http://localhost:3000.
  It serves the static site AND executes the `api/*.js` handlers against the database
  configured in `.env`. This is the way to test dynamic projects/testimonials/blog and the
  admin panel end-to-end.
- Static only: `npm start` runs `live-server` on :8080. It does NOT run `api/*`, so the site
  shows only the static fallback content (no admin/CMS).
- `vercel dev` (the production-equivalent runner) requires Vercel credentials and will fail
  with "No existing credentials found"; use `npm run dev` locally instead. `dev-server.js`
  reimplements Vercel's routing (static files + `/api/*` handlers + `vercel.json`-style
  rewrites) without needing credentials.

### Database (local MariaDB)

- A local MariaDB server is installed. It is not managed by systemd, so start it manually
  each session if it is not already running:
  `sudo mariadbd-safe &` (wait a few seconds; verify with `sudo mariadb -e "SELECT VERSION();"`).
- Database `portfolio_db` (user `portfolio` / password `portfolio_pass`) is seeded with the
  schema from `admin/MYSQL_SETUP.sql` plus the `blog_posts` table from `DATABASE_SETUP.md`.
- Local DB credentials live in `.env` (gitignored, read by `dotenv` in `dev-server.js`). The
  committed `vercel.json` contains the production Hostinger DB credentials used only in
  Vercel deployments.
- Seeded admin login for the CMS: `admin@example.com` / `admin123`. Recreate/reset it any
  time via `GET /api/create_admin?email=<e>&password=<p>`.

### Lint / test / build

- There is no linter, test framework, or build step configured. `npm run build` does not
  exist (Vercel treats this as a static project). "Testing" here means running `npm run dev`
  and exercising the pages/API manually.
