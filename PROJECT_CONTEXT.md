# Project Context: Veterinary Clinic Frontend

This file summarizes the current repository so future work can start from its architecture and known behavior. Update it when the app structure, routes, setup, or API integration changes.

## Project overview

- Front end for a veterinary clinic administration app.
- Built with React 19, TypeScript, and Vite (ES modules).
- Uses Material UI (MUI) with Emotion, React Router, TanStack Query, and Axios.
- Forms-related dependencies are installed (`react-hook-form`, `zod`, and `@hookform/resolvers`), but the current owner form components are empty and those libraries are not yet used in source.
- This repository contains the browser client only. The API client currently targets a separate local backend.

## Start and build

Run from the repository root:

```powershell
npm.cmd ci
npm.cmd run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`). `npm.cmd` works around PowerShell environments where the `npm` PowerShell script is blocked by execution policy.

Available scripts in `package.json`:

- `npm.cmd run dev` — start Vite development server.
- `npm.cmd run build` — run TypeScript project builds, then create the Vite production bundle in `dist/`.
- `npm.cmd run lint` — run ESLint.
- `npm.cmd run preview` — serve a production build locally.

`package-lock.json` is committed; use `npm.cmd ci` to install its locked dependency graph. If TypeScript reports that imports such as `@mui/material` cannot be found, first complete/retry dependency installation and restart the editor's TypeScript server. A partial `node_modules` directory is not proof that installation completed. The last recorded local attempt stalled before npm completed and created its Windows executable shims, so dependency installation still needs confirmation on this machine.

## Source layout

- `src/main.tsx` — React DOM entry point, imports global CSS, renders `App` in `StrictMode`.
- `src/App.tsx` — composes application-wide providers and router.
- `src/app/providers/AppProviders.tsx` — wraps the app in the MUI theme and query providers.
- `src/app/providers/QueryProvider.tsx` — creates a module-level TanStack `QueryClient` and supplies it.
- `src/app/theme/theme.ts` — light MUI theme; primary blue `#1976d2`, default background `#f5f6f8`, Roboto/Arial font stack.
- `src/app/router/AppRouter.tsx` — browser routes; `/` redirects to `/dashboard`; `/dashboard` renders inside `AdminLayout`.
- `src/layouts/AdminLayout.tsx` — permanent-sidebar admin shell and main content area.
- `src/components/common/Sidebar.tsx` — navigation items for Dashboard, Owners, Pets, Vets, Clinics, Visits, and Availability.
- `src/features/dashboard/pages/DashboardPage.tsx` — currently a simple Dashboard heading.
- `src/features/visit/pages/VisitsPage.tsx` — visit administration with a booking dialog that fetches real openings for the selected pet, vet, visit type, and duration across the next 31 days.
- `src/features/visit/api/visitApi.ts` — visit operations and available-slot search via `GET /visits/available-slots/range`.
- `src/features/owner/` — initial owner feature scaffold: API helper, owner request types, and page/component files. `OwnerCreatePage.tsx`, `OwnerEditPage.tsx`, `OwnerForm.tsx`, and `OwnerTable.tsx` are currently empty. `pages/OwnerListPage.tsx` currently contains only `getOwners()`, which requests `GET /owners/page`; consider moving this API helper into `api/ownerApi.ts` as the feature develops.
- `src/lib/api.ts` — Axios instance with JSON headers and an environment-configurable `VITE_API_BASE_URL` (defaults to same-origin `/api`).
- `src/index.css` — minimal page/root margin and height reset.
- `public/` — static favicon and icon SVG assets.

## Current routes and incompleteness

Only `/` and `/dashboard` are registered. The other sidebar links do not yet have routes and will not render their intended feature pages. The owner feature is a scaffold rather than a completed UI or CRUD flow. No authentication, environment-based API URL, error handling strategy, or deployed backend configuration is present in the current source.

## API and owner data

The Axios client defaults to `/api`; Vite proxies that prefix to `http://localhost:8010`, matching the Spring Boot backend's default port. Set `VITE_API_PROXY_TARGET` to change the development proxy target. For direct deployed API calls, set `VITE_API_BASE_URL` to the API `/api` URL and configure CORS on the backend. Owner creation posts an `OwnerCreateRequest` to `/owners`; listing requests `/owners/page`, matching the backend controller routes.

Visit booking loads available slots for a 31-day date range after the user selects a pet and veterinarian. It uses `GET /visits/available-slots/range` and submits the selected slot through `POST /visits`.

Owner request types are in `src/features/owner/types/owner.ts`:

- `PersonCreateRequest`: optional title, first name, last name, national ID.
- `ProfileCreateRequest`: required email and mobile number; optional birth date and photo.
- `AddressCreateRequest`: required country, province, city, building number, address, and default-address flag; other address/location fields are optional.
- `OwnerCreateRequest`: combines `person`, `profile`, and `address`.

## Tooling notes

- Vite configuration is in `vite.config.ts` and enables `@vitejs/plugin-react`.
- TypeScript uses separate app and Node/Vite configs referenced by `tsconfig.json`; app source is under `src`.
- ESLint configuration is in `eslint.config.js`, covering TypeScript/TSX, recommended TypeScript rules, React Hooks, and React Refresh.
- `README.md` contains the frontend setup and API proxy configuration.
