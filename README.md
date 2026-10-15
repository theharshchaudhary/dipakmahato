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

## Deploying (ceo.zedfo.app)

Pushing to `redesign` runs [.github/workflows/deploy.yml](.github/workflows/deploy.yml):

1. **Test** — frontend typecheck, lint and tests; backend test suite.
2. **Build** — the SSR site (`.output/`) and the backend with production dependencies.
3. **Release** — the bundle is copied to the server, unpacked into
   `/var/www/ceo.zedfo.app/releases/<commit>`, and [deploy/activate.sh](deploy/activate.sh)
   links shared state, runs migrations, switches `current`, and restarts the site.
   The last 5 releases are kept.

Server layout (Ubuntu, nginx, PHP 8.2-FPM, Node 20):

| Piece | Where | Config in repo |
| --- | --- | --- |
| nginx site | `/etc/nginx/sites-available/ceo.zedfo.app` | [deploy/nginx](deploy/nginx/ceo.zedfo.app.conf) |
| PHP-FPM pool (user `ceozedfo`) | `/etc/php/8.2/fpm/pool.d/ceozedfo.conf` | [deploy/php-fpm](deploy/php-fpm/ceozedfo.conf) |
| Site service (Node, port 3210) | `ceo-zedfo-web.service` | [deploy/systemd](deploy/systemd/ceo-zedfo-web.service) |
| Settings, uploads, database | `/var/www/ceo.zedfo.app/shared/` | — (never deployed over) |

`/admin`, `/livewire`, `/api` and `/storage` go to Laravel; everything else to the Node site,
which reads content from Laravel on `127.0.0.1:8090`. GitHub Actions connects as `ceozedfo`
with a deploy key (secrets `DEPLOY_SSH_KEY`, `DEPLOY_KNOWN_HOSTS`, `DEPLOY_HOST`,
`DEPLOY_USER`); that user may only restart its own service.

**Rollback:** point `current` at an earlier release and restart:
`ln -sfn /var/www/ceo.zedfo.app/releases/<commit> /var/www/ceo.zedfo.app/current && sudo systemctl restart ceo-zedfo-web`.

**HTTPS:** once DNS points `ceo.zedfo.app` at the server, run `certbot --nginx -d ceo.zedfo.app` as root.

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
