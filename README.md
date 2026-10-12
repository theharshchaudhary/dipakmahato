# dipakmahato

Personal website of Dipak Kumar Mahato — entrepreneur and CEO of Zedfo.

Built with [TanStack Start](https://tanstack.com/start) (React 19, SSR), Tailwind CSS v4 and Vite.
The server build uses [Nitro](https://nitro.build), so it can deploy to any Node host or edge platform.

## Development

Requires Node.js 22+ and npm 11+ (npm 10 has a peer-dependency resolver bug with this tree —
use `npx npm@11 install` if `npm install` fails with `reading 'edgesOut'`).

```sh
npm install
npm run dev        # http://localhost:8080
```

## Scripts

| Command             | What it does                                     |
| ------------------- | ------------------------------------------------ |
| `npm run dev`       | Start the dev server with HMR                    |
| `npm run build`     | Build client + SSR server into `.output/`        |
| `npm start`         | Run the built Node server                        |
| `npm run typecheck` | Type-check with `tsc`                            |
| `npm run lint`      | Lint with ESLint + Prettier                      |
| `npm test`          | Run Vitest                                       |

## Deploying

`npm run build` targets Node by default (`node .output/server/index.mjs`). To target another
platform, set Nitro's preset at build time, for example:

```sh
NITRO_PRESET=vercel npm run build
NITRO_PRESET=cloudflare-module npm run build
```

## Content

All site content lives in `src/data/` — profile, ventures and articles. Pages render from those
files, so updating copy never requires touching components.
