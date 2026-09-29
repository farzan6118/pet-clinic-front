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
- `src/features/owner/` — initial owner feature scaffold: API helper, owner request types, and page/component files. `OwnerCreatePage.tsx`, `OwnerEditPage.tsx`, `OwnerForm.tsx`, and `OwnerTable.tsx` are currently empty. `pages/OwnerListPage.tsx` currently contains only `getOwners()`, which requests `GET /owners/page`; consider moving this API helper into `api/ownerApi.ts` as the feature develops.
- `src/lib/api.ts` — Axios instance with JSON headers and `baseURL` set to `http://localhost:8080/api`.
- `src/index.css` — minimal page/root margin and height reset.
- `public/` — static favicon and icon SVG assets.

## Current routes and incompleteness

Only `/` and `/dashboard` are registered. The other sidebar links do not yet have routes and will not render their intended feature pages. The owner feature is a scaffold rather than a completed UI or CRUD flow. No authentication, environment-based API URL, error handling strategy, or deployed backend configuration is present in the current source.

## API and owner data

The Axios client assumes a backend reachable at `http://localhost:8080/api`. Owner creation posts an `OwnerCreateRequest` to `/owners`; listing requests `/owners/page`. These endpoints and the payload contract are assumptions in the current frontend and should be matched against the backend before integration.

Owner request types are in `src/features/owner/types/owner.ts`:

- `PersonCreateRequest`: optional title, first name, last name, national ID.
- `ProfileCreateRequest`: required email and mobile number; optional birth date and photo.
- `AddressCreateRequest`: required country, province, city, building number, address, and default-address flag; other address/location fields are optional.
- `OwnerCreateRequest`: combines `person`, `profile`, and `address`.

## Tooling notes

- Vite configuration is in `vite.config.ts` and enables `@vitejs/plugin-react`.
- TypeScript uses separate app and Node/Vite configs referenced by `tsconfig.json`; app source is under `src`.
- ESLint configuration is in `eslint.config.js`, covering TypeScript/TSX, recommended TypeScript rules, React Hooks, and React Refresh.
- `README.md` is still the generic React + TypeScript + Vite starter README; this context file describes the actual app state.
