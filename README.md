# TeamPulse

TeamPulse helps engineering managers and team members understand team health, track goals, review feedback, follow evaluations, and keep delivery signals visible in one simple workspace.

TeamPulse v2 is both a product-shaped Angular application and a learning project. The normal app UI is business-facing; technical explanations live in the docs, Learning Lab, MCP Servers page, and Run Locally page.

- GitHub repository: https://github.com/MohammedKhalil86/TeamPulse
- License: MIT, see [LICENSE](LICENSE)

> TeamPulse uses sample workspace data. Do not enter real employee or company information.

## Requirements

- Node.js LTS supported by Angular 21. The project was prepared with Node.js 24 LTS; Node.js 22 LTS is also suitable for Angular 21.
- npm.
- Angular CLI is optional. Use the project scripts from `frontend/package.json`; installing `@angular/cli@21.2.9` globally is only a convenience.
- .NET SDK compatible with the `net10.0` backend project for the Local API setup.

Angular packages are pinned in `frontend/package.json`. Do not change Angular package versions unless that is a deliberate project step.

## Project Structure

```text
TeamPulse/
  backend/
    TeamPulse.Api/       ASP.NET Core Minimal API for local development
  frontend/              Angular 21 standalone application
  shared/
    seed-data/           Shared JSON seed data used by both setups
  docs/                  Product, architecture, learning, and workflow docs
  LICENSE                MIT license
  README.md
  TeamPulse.sln
```

## Local API Setup

Use this setup for normal local development and guided coding. Angular calls the ASP.NET Core Minimal API through the existing `HttpClient` services.

Run the backend:

```bash
cd backend/TeamPulse.Api
dotnet run
```

Backend URLs:

- HTTP: `http://localhost:5001`
- HTTPS: `https://localhost:7001`
- Swagger: `http://localhost:5001/swagger`
- Health: `http://localhost:5001/health`

Run the frontend:

```bash
cd frontend
npm install
npm start
```

Open:

```text
http://localhost:4200
```

Local development configuration lives in `frontend/src/environments/environment.ts` and uses:

```text
http://localhost:5001/api
```

## GitHub Pages Setup

The GitHub Pages setup publishes the Angular frontend as static files at:

```text
https://mohammedkhalil86.github.io/TeamPulse/
```

It uses the same shared seed data from `shared/seed-data/`, copied into the frontend build output as `assets/seed-data/*.json`. On first load, the browser initializes namespaced `localStorage` records. Create, edit, and delete actions persist in that browser until site data is cleared or the seed version changes.

Build for GitHub Pages:

```bash
cd frontend
npm run build:github-pages
```

Output folder:

```text
frontend/dist/teampulse-frontend/browser
```

The GitHub Pages build sets the base path to `/TeamPulse/`, keeps clean Angular routes, copies seed JSON assets, creates `.nojekyll`, and copies `index.html` to `404.html` so direct route refreshes can fall back to the Angular app.

Optional local preview:

```bash
cd frontend
npm run preview:github-pages -- --host 127.0.0.1
```

Open:

```text
http://127.0.0.1:4300/TeamPulse
```

## Demo Credentials

Managers:

| Email | Password |
| --- | --- |
| `manager1@teampulse.demo` | `TeamPulse-Manager-2026!` |
| `manager2@teampulse.demo` | `TeamPulse-Manager-2026!` |

Team members:

| Email | Password |
| --- | --- |
| `member1@teampulse.demo` | `TeamPulse-Member-2026!` |
| `member2@teampulse.demo` | `TeamPulse-Member-2026!` |

## Main App Pages

- `/login`: product sign-in with sample credentials and sample-data notice.
- `/dashboard`: role-aware manager or team member overview.
- `/teams` and `/teams/:id`: teams list and team detail.
- `/members` and `/members/:id`: member directory and profile.
- `/evaluations`: evaluation management and personal evaluations.
- `/feedback`: feedback feed and creation.
- `/goals`: goal tracking and management.
- `/how-teampulse-works`: role-aware business guide.

## Learning Pages

- `/learning/angular`: Angular concept explorer with searchable filters and real code walkthroughs.
- `/learning/angular/:featureId`: Angular concept detail page.
- `/learning/mcp-servers`: development-time MCP server guide for AI-assisted coding workflows.
- `/learning/run-locally`: local setup, GitHub Pages setup, and troubleshooting guide.
- `/angular-lab` and `/angular-lab/:featureId`: old route redirects kept for compatibility.

## Data And Backend Scope

TeamPulse uses sample data only. The backend keeps data in memory and reloads from shared JSON seed files when it starts. The GitHub Pages setup initializes browser storage from the same JSON files.

The project intentionally does not include a production database, Entity Framework, ASP.NET Identity, JWT authentication, password hashing, or runtime AI features.

## Documentation Map

Start here:

- [Project Overview](docs/00-project-overview.md)
- [Business Scope](docs/01-business-scope.md)
- [Architecture](docs/03-architecture.md)
- [Frontend Structure](docs/04-frontend-structure.md)
- [Backend API](docs/05-backend-api.md)
- [Seeded Data Plan](docs/08-seeded-data-plan.md)
- [Learning Lab](docs/13-learning-lab.md)
- [Deployment Plan](docs/16-deployment-plan.md)
- [Demo Script](docs/19-demo-script.md)

## Common Troubleshooting

If `npm install` fails, confirm your Node.js and npm versions first, then remove `frontend/node_modules` and try again.

If the frontend cannot reach the backend in the Local API setup, confirm `dotnet run` is active in `backend/TeamPulse.Api`, then check `http://localhost:5001/health`.

If login fails, use the exact seeded email and password from this README. The sample passwords are case-sensitive.

If GitHub Pages shows a blank page, confirm the build used `npm run build:github-pages` so the base path is `/TeamPulse/`.

If a deep GitHub Pages route refresh returns a 404, confirm `404.html` exists beside `index.html` in `frontend/dist/teampulse-frontend/browser`.

If GitHub Pages data looks stale, clear site data for the browser tab or change the seed version in `shared/seed-data/seed-metadata.json` as part of an intentional seed update.

## Contribution Notes

- Keep the backend and Local API setup intact.
- Keep Angular `HttpClient` services visible for learners.
- Keep GitHub Pages setup aligned with shared seed data.
- Keep normal business UI free of setup labels and implementation jargon.
- Update docs and `docs/18-change-log.md` with each meaningful change.
- Run the relevant build command when app or backend files change.
