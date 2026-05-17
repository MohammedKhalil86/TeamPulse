# TeamPulse

TeamPulse helps engineering managers and team members track goals, feedback, evaluations, skills, and team health in a simple visual workspace. The repository also supports Angular learning through docs and the in-app Learning Lab.

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
| `manager1@teampulse.demo` | `TeamPulse-Manager-2026!` |
| `manager2@teampulse.demo` | `TeamPulse-Manager-2026!` |

Team Members:

| Email | Password |
| --- | --- |
| `member1@teampulse.demo` | `TeamPulse-Member-2026!` |
| `member2@teampulse.demo` | `TeamPulse-Member-2026!` |

## Main Pages

- `/login`: product sign-in with sample credentials.
- `/dashboard`: role-aware dashboard.
- `/teams` and `/teams/:id`: teams list and detail.
- `/members` and `/members/:id`: member directory and profile.
- `/evaluations`: evaluation management and personal evaluations.
- `/feedback`: feedback feed and creation.
- `/goals`: goal tracking and management.
- `/learning/angular` and `/learning/angular/:featureId`: Angular concept explorer (redirects from `/angular-lab`).
- `/learning/mcp-servers`: MCP Servers — five development-time AI tools explained.
- `/learning/run-locally`: Run Locally — local API setup, GitHub Pages build, troubleshooting.

## Backend Scope

The backend uses in-memory sample data only. There is no database, Entity Framework, JWT, ASP.NET Identity, password hashing, or real authentication server.

## Documentation Map

Start with:

- `docs/00-project-overview.md`
- `docs/03-architecture.md`
- `docs/04-frontend-structure.md`
- `docs/05-backend-api.md`
- `docs/10-angular-feature-to-page-map.md`
- `docs/11-page-specifications.md`
- `docs/13-learning-lab.md`
- `docs/19-demo-script.md`

## Deployment Note

TeamPulse is local-first. Static frontend hosting options include GitHub Pages, Cloudflare Pages, Netlify, and Vercel. Backend hosting options include Render, Railway, Koyeb, Fly.io, and Azure App Service if available. Free hosting plans are not guaranteed forever.

GitHub Pages build:

```bash
cd frontend
npm run build:github-pages
```

The output is written to `frontend/dist/teampulse-frontend/browser` with `/TeamPulse/` as the base path, copied seed JSON assets, and a `404.html` fallback for clean Angular routes. See `docs/16-deployment-plan.md`.

## Recommended Demo Order

1. Login as `manager1@teampulse.demo`.
2. Show Dashboard, Teams, Members, Member Profile, Evaluations, Goals, theme switch, floating help, and Angular Lab.
3. Logout.
4. Login as `member1@teampulse.demo`.
5. Show the personal dashboard and restricted/limited views.

## GitHub Note

The project can be initialized with Git from the root folder. See `docs/17-github-workflow.md` for branch and commit guidance.
