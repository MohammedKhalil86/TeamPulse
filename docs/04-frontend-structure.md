# Frontend Structure

The Angular app is organized by responsibility and feature.

```text
frontend/src/app/
  core/
    api/
    auth/
    data/
    guards/
    interceptors/
    layout/
    models/
    storage/
    theme/
  shared/
    animations/
    components/
    directives/
    pipes/
  features/
    angular-lab/         Legacy folder name for Angular learning pages
    learning/
    dashboard/
    evaluations/
    feedback/
    goals/
    login/
    members/
    teams/
  app.config.ts
  app.routes.ts
```

## Folder Responsibilities

| Folder | Responsibility |
| --- | --- |
| `core/api` | Typed HttpClient services for backend endpoints |
| `core/auth` | Sample login/logout and current session state |
| `core/data` | Static seed-data loader and localStorage-backed data store for static hosting |
| `core/guards` | Auth and role route guards |
| `core/interceptors` | HTTP loading interceptor and loading service |
| `core/layout` | Authenticated app shell, sidebar, topbar, page help mapping |
| `core/models` | TypeScript interfaces matching backend data contracts |
| `core/storage` | LocalStorage wrapper |
| `core/theme` | Light/dark theme persistence and DOM class handling |
| `shared/animations` | Reusable route/page animation definitions |
| `shared/components` | Page header, cards, badges, states, logo, floating help |
| `shared/directives` | Score/risk visual highlighting |
| `shared/pipes` | Score, risk, and friendly date formatting |
| `features/*` | Route-level business and learning pages |

Angular route components are lazy-loaded from `app.routes.ts`. Shared UI stays generic; business logic stays inside feature pages and core API services.

## Data Setup Switch

Existing services in `core/api` keep their HttpClient calls visible and retain their public method shapes. They read the `DATA_MODE` token from `api.config.ts`:

- `api`: call the ASP.NET Core Minimal API using `HttpClient`.
- `static`: delegate to `StaticDataStore`, which loads `assets/seed-data/*.json` and persists create/edit/delete changes in localStorage.

Production builds copy root `shared/seed-data/*.json` into `assets/seed-data/` through `angular.json`. No normal business page shows the active setup.
