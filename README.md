# dipakmahato

Personal website of Dipak Kumar Mahato — entrepreneur and CEO of Zedfo. Every page is edited in
an admin panel; nothing on the public site is hard-coded.

```
visitor ──> frontend (TanStack Start, React SSR, Node) ──server-side fetch──> backend (Laravel 12 API)
editor  ──> backend /admin (Filament 4) ─────────────────────────────────────────┘        │
                                                                                   MySQL / SQLite
```

| Folder      | What it is                                                                |
| ----------- | ------------------------------------------------------------------------- |
| `/`         | Public site. Server-rendered React; fetches content from the API.         |
| `backend/`  | Laravel API (`/api/*`) and the admin panel (`/admin`).                    |

The browser never talks to Laravel directly: pages are rendered on the Node server, so search
engines receive complete HTML, and the API address stays private.

## What the admin manages

| Admin section     | Controls                                                                                  |
| ----------------- | ----------------------------------------------------------------------------------------- |
| **Pages**         | Every text block on Home, About, Writing, Ventures and Contact; menu labels and order; each page's Google title, description and share image |
| **Essays**        | Rich-text essays with topics, cover images, draft / scheduled / published, featured flag   |
| **Ventures**      | Company details, milestones, website, brand image and screenshots                         |
| **Messages**      | Contact-form inbox (also emailed to the address in Site settings)                         |
| **Site settings** | Name, other names people search for, job, company, portrait, email, social profiles, public URL, Google/Bing verification codes |
| **Admin users**   | Who can sign in                                                                           |

Changes appear on the site immediately — API responses are cached and the cache is cleared on
every save.

## Running locally

Requirements: Node 22+, npm 11+ (`npx npm@11 install` if `npm install` fails with
`reading 'edgesOut'`), PHP 8.2+ with `intl`, Composer.

```sh
# 1. Backend — http://localhost:8000/admin
cd backend
composer install
cp .env.example .env          # SQLite by default; set ADMIN_EMAIL / ADMIN_PASSWORD if you like
php artisan key:generate
php artisan migrate --seed    # prints the admin login if ADMIN_PASSWORD is empty
php artisan storage:link
php artisan serve --port=8000

# 2. Frontend — http://localhost:8080
cd ..
npm install
npm run dev                   # talks to http://127.0.0.1:8000/api unless API_URL is set
```

## Checks

```sh
npm run typecheck && npm run lint && npm test     # frontend
cd backend && php artisan test                    # API + every admin screen
```

## Deploying

Two apps, one database:

1. **Backend** (any PHP host, e.g. `admin.example.com`): upload `backend/`, point the web root at
   `backend/public`, use MySQL in `.env` (`DB_CONNECTION=mysql` …), set `APP_ENV=production`,
   `APP_DEBUG=false`, `APP_URL`, `FRONTEND_URL`, mail settings, then run
   `php artisan migrate --force --seed`, `php artisan storage:link`, `php artisan optimize`.
2. **Frontend** (any Node host, e.g. `example.com`): `npm ci && npm run build`, then run
   `API_URL=https://admin.example.com/api node .output/server/index.mjs`. For other platforms set
   Nitro's preset at build time, e.g. `NITRO_PRESET=vercel npm run build`.
3. In the admin, set **Site settings → Public site URL** to the live address. Canonical links,
   the sitemap and structured data all use it.

## Getting found on Google

The site does the technical part: server-rendered HTML; the name in every page title, the home
`<h1>` and descriptions; a canonical URL per page; `sitemap.xml` and `robots.txt`; and a
schema.org graph that identifies the site as the official home of the person (with alternate
names like "Dipak Mahato", job, company and linked profiles).

No site can guarantee the top result — Google decides. What moves it most, after launch:

1. **Own domain**, ideally the name (e.g. `dipakmahato.com`).
2. **Google Search Console**: add the site, paste the verification code into Site settings, and
   submit `https://<domain>/sitemap.xml`. Do the same in Bing Webmaster Tools.
3. **Fill Site settings completely**: real email, LinkedIn and every other official profile
   (they become `sameAs` links), portrait, company website.
4. **Link back to the site** from LinkedIn, Zedfo's website, X/Facebook/Instagram bios, and any
   interviews or press. Links from these trusted pages are the strongest signal.
5. **Publish essays regularly** — replace the draft placeholders with real writing.
6. Keep the name spelled the same way everywhere.
