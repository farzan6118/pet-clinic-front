# Pet Clinic Frontend

React 19 and TypeScript administration UI for the Pet Clinic Spring Boot API.

## Run locally

Start the backend with the `home` profile; it listens on `http://localhost:8010` by default. Then, from this repository, run:

```powershell
npm.cmd ci
npm.cmd run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`). Vite forwards `/api` requests to the backend, so browser requests use the same origin and do not need backend CORS configuration.

To use a backend on another host or port, set `VITE_API_PROXY_TARGET` in a local `.env` file, for example:

```dotenv
VITE_API_PROXY_TARGET=http://localhost:8010
```

For a deployment where the frontend talks directly to the API, set `VITE_API_BASE_URL` to the API's `/api` base URL. That API must allow the frontend origin through CORS. Leave it unset for local Vite development, where `/api` is proxied automatically.

## Scripts

- `npm.cmd run dev` starts Vite.
- `npm.cmd run build` type-checks and creates the production bundle in `dist/`.
- `npm.cmd run lint` runs ESLint.
- `npm.cmd run preview` serves the production bundle locally.
