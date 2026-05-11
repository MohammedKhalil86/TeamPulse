# Architecture

TeamPulse uses a separated frontend/backend architecture.

```text
Browser
  |
  | Angular standalone app
  | http://localhost:4200
  v
HttpClient services
  |
  | CORS-enabled HTTP calls
  | API base: http://localhost:5001/api
  v
ASP.NET Core Minimal API
  | 
  | Singleton in-memory data store
  v
Seeded demo data
```

## Frontend

The frontend lives in `frontend/`. It is an Angular 21.2.9 standalone app with routing, PrimeNG, fake auth, role-aware layout, feature pages, shared UI components, and typed API services.

## Backend

The backend lives in `backend/TeamPulse.Api/`. It is an ASP.NET Core Minimal API targeting `net10.0`, with Swagger, CORS for Angular local development, and seeded in-memory data.

## Local Running

- Frontend: `http://localhost:4200`
- Backend HTTP: `http://localhost:5001`
- Backend HTTPS: `https://localhost:7001`
- Swagger: `http://localhost:5001/swagger` or `https://localhost:7001/swagger`
- Health: `GET http://localhost:5001/health`

## No Database Decision

The app uses in-memory seeded data because the workshop is about Angular. Restarting the backend resets the data. This is expected and useful for demos.
