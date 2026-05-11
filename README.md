# TeamPulse

TeamPulse is an Angular workshop sample project for Atos. It is a realistic but intentionally simple engineering team management app for demonstrating Angular concepts, PrimeNG components, and frontend/backend integration.

## Project Structure

```text
TeamPulse/
  frontend/              Angular 21.2.9 standalone application
  backend/
    TeamPulse.Api/       ASP.NET Core Minimal API
  docs/                  Workshop, architecture, and traceability docs
  README.md
```

## Requirements

- Node.js 22 LTS or newer supported by Angular 21 (Node.js 24 LTS was used during this project setup).
- npm 10 or newer (npm 11 was used during this project setup).
- Angular CLI 21.2.9 (`npm install -g @angular/cli@21.2.9`).
- .NET SDK 10.0 or newer compatible SDK for the `net10.0` backend project.

Angular packages are pinned to exact version `21.2.9`. Do not upgrade them unless explicitly requested.

## Run Backend

```bash
cd backend/TeamPulse.Api
dotnet run
```

Backend URLs:

- HTTP: `http://localhost:5001`
- HTTPS: `https://localhost:7001`
- Swagger: `http://localhost:5001/swagger`
- Health: `http://localhost:5001/health`

## Run Frontend

```bash
cd frontend
npm install
npm start
```

Frontend URL:

```text
http://localhost:4200
```

The frontend API base URL is configured in:

```text
frontend/src/environments/environment.ts
frontend/src/environments/environment.production.ts
```

Local default:

```text
http://localhost:5001/api
```

## Demo Credentials

Managers:

| Email | Password |
| --- | --- |
| `manager1@teampulse.demo` | `Manager@123` |
| `manager2@teampulse.demo` | `Manager@123` |

Team Members:

| Email | Password |
| --- | --- |
| `member1@teampulse.demo` | `Member@123` |
| `member2@teampulse.demo` | `Member@123` |

## Main Pages

- `/login`: fake login.
- `/dashboard`: role-aware dashboard.
- `/teams` and `/teams/:id`: teams list and detail.
- `/members` and `/members/:id`: member directory and profile.
- `/evaluations`: evaluation management and personal evaluations.
- `/feedback`: feedback feed and creation.
- `/goals`: goal tracking and management.
- `/angular-lab` and `/angular-lab/:featureId`: Angular concept explorer.

## Backend Scope

The backend uses in-memory seeded data only. There is no database, Entity Framework, JWT, ASP.NET Identity, password hashing, or real authentication server.

## Documentation Map

Start with:

- `docs/00-project-overview.md`
- `docs/03-architecture.md`
- `docs/04-frontend-structure.md`
- `docs/05-backend-api.md`
- `docs/10-angular-feature-to-page-map.md`
- `docs/11-page-specifications.md`
- `docs/13-angular-lab.md`
- `docs/19-demo-script.md`

## Deployment Note

TeamPulse is local-first. Static frontend hosting options include GitHub Pages, Cloudflare Pages, Netlify, and Vercel. Backend hosting options include Render, Railway, Koyeb, Fly.io, and Azure App Service if available. Production deployment needs an updated frontend API URL and production CORS settings. Free hosting plans are not guaranteed forever.

## Recommended Demo Order

1. Login as `manager1@teampulse.demo`.
2. Show Dashboard, Teams, Members, Member Profile, Evaluations, Goals, theme switch, floating help, and Angular Lab.
3. Logout.
4. Login as `member1@teampulse.demo`.
5. Show the personal dashboard and restricted/limited views.

## GitHub Note

The project can be initialized with Git from the root folder. See `docs/17-github-workflow.md` for branch and commit guidance.
