#!/usr/bin/env bash
# Activates an uploaded release on the server. Run by CI as the deploy user:
#   bash activate.sh <release-id>
# Expects /var/www/ceo.zedfo.app/releases/<release-id> to hold the unpacked
# bundle (.output/ for the site, backend/ for Laravel with vendor/ installed).
set -euo pipefail

APP=/var/www/ceo.zedfo.app
RELEASE="$APP/releases/$1"
SHARED="$APP/shared"
KEEP=5

test -d "$RELEASE" || { echo "No release at $RELEASE" >&2; exit 1; }

# Shared state lives outside releases: settings, uploads/logs, and the database.
ln -sfn "$SHARED/backend/.env" "$RELEASE/backend/.env"
rm -rf "$RELEASE/backend/storage"
ln -sfn "$SHARED/backend/storage" "$RELEASE/backend/storage"

cd "$RELEASE/backend"
php artisan migrate --force
# Starting content is seeded once only, so later edits and deletions in the admin stick.
if [ ! -f "$SHARED/.seeded" ]; then
    php artisan db:seed --force
    touch "$SHARED/.seeded"
fi
php artisan storage:link --force
php artisan optimize
php artisan filament:optimize

# Switch atomically, then restart the site server onto the new code.
ln -sfn "$RELEASE" "$APP/current.next"
mv -Tf "$APP/current.next" "$APP/current"
sudo /usr/bin/systemctl restart ceo-zedfo-web

# Keep the newest few releases for quick rollback.
cd "$APP/releases"
ls -1t | tail -n +$((KEEP + 1)) | xargs -r rm -rf

echo "Activated $1"
