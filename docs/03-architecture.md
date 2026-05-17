# Architecture

TeamPulse supports two technical data setups while keeping the same business UI and route structure.

```text
Browser
  |
  | Angular standalone app
  | http://localhost:4200
  v
HttpClient services
  |
  +-- Local API setup
  |     |
  |     | CORS-enabled HTTP calls
  |     | API base: http://localhost:5001/api
  |     v
  |   ASP.NET Core Minimal API
  |     |
  |     | Singleton in-memory data store
  |     v
  |   shared/seed-data JSON
  |
  +-- GitHub Pages/static setup
        |
        | Reads assets/seed-data JSON
        | Persists edits in browser localStorage
        v
      shared/seed-data JSON copied into frontend build
```

## Frontend

The frontend lives in `frontend/`. It is an Angular 21.2.9 standalone app with routing, PrimeNG, fake auth, role-aware layout, feature pages, shared UI components, typed API services, and a static localStorage-backed data store for GitHub Pages builds.

The environment configuration controls the data setup:

- `src/environments/environment.ts`: `dataMode: 'api'` for local development.
- `src/environments/environment.production.ts`: `dataMode: 'static'` for static hosting.

The normal business UI does not display the active data setup.

## Backend

The backend lives in `backend/TeamPulse.Api/`. It is an ASP.NET Core Minimal API targeting `net10.0`, with Swagger, CORS for Angular local development, and seeded in-memory data.

## Local Running

- Frontend: `http://localhost:4200`
- Backend HTTP: `http://localhost:5001`
- Backend HTTPS: `https://localhost:7001`
- Swagger: `http://localhost:5001/swagger` or `https://localhost:7001/swagger`
- Health: `GET http://localhost:5001/health`

## No Database Decision

The local API setup uses in-memory seeded data because the workshop is about Angular. Restarting the backend resets API data. The GitHub Pages/static setup initializes browser localStorage from the same seed JSON and keeps edits in that browser until the seed version changes or storage is cleared.
