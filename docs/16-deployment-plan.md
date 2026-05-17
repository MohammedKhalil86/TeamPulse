# Deployment Plan

TeamPulse is local-first. Deployment is optional and should not complicate the workshop. The project now has a GitHub Pages-ready frontend build while keeping the local ASP.NET Core API setup unchanged.

## Local First

Run backend:

```bash
cd backend/TeamPulse.Api
dotnet run
```

Run frontend:

```bash
cd frontend
npm install
npm start
```

## Frontend Hosting Options

The Angular app can be built as static files:

```bash
cd frontend
npm run build
```

Possible static hosting options include:

- GitHub Pages.
- Cloudflare Pages.
- Netlify.
- Vercel.
- Azure Static Web Apps.
- Any static web server.

Free hosting plans can change over time and are not guaranteed forever.

## GitHub Pages Frontend

Repository:

```text
https://github.com/MohammedKhalil86/TeamPulse
```

GitHub Pages project path:

```text
https://mohammedkhalil86.github.io/TeamPulse/
```

Build the GitHub Pages-ready frontend:

```bash
cd frontend
npm run build:github-pages
```

Output folder:

```text
frontend/dist/teampulse-frontend/browser
```

The `github-pages` Angular build configuration sets:

```text
baseHref: /TeamPulse/
```

This keeps path-based Angular routing and avoids hash routing.

The production/static environment is used for this build. Seed JSON files from `shared/seed-data/` are copied into:

```text
frontend/dist/teampulse-frontend/browser/assets/seed-data/
```

### 404 Fallback

GitHub Pages serves `404.html` for unknown direct URLs. For clean Angular routes such as `/TeamPulse/dashboard`, TeamPulse uses an SPA fallback:

1. Build the Angular app.
2. Copy `index.html` to `404.html`.
3. Include `.nojekyll`.

The `build:github-pages` script runs `scripts/create-github-pages-404.mjs`, which creates:

```text
frontend/dist/teampulse-frontend/browser/404.html
frontend/dist/teampulse-frontend/browser/.nojekyll
```

### Local Preview

Without installing extra packages, preview the GitHub Pages configuration with:

```bash
cd frontend
npm run preview:github-pages -- --host 127.0.0.1
```

Open:

```text
http://127.0.0.1:4300/TeamPulse
```

The Angular dev server can also serve deep routes such as:

```text
http://127.0.0.1:4300/TeamPulse/dashboard
```

### Manual Deployment Sketch

No GitHub Actions deployment is added yet. Manual publishing can be done later by taking the contents of:

```text
frontend/dist/teampulse-frontend/browser
```

and publishing those files to the configured GitHub Pages source, such as a `gh-pages` branch or another Pages source selected in repository settings.

## Backend Hosting Options

The ASP.NET Core Minimal API can be hosted on:

- Render.
- Railway.
- Koyeb.
- Fly.io.
- Azure App Service if available.
- Azure Container Apps.
- A VM or container host.

Free tiers and availability are not guaranteed forever.

## API URL Preparation

The current API base URL is defined in:

```text
frontend/src/environments/environment.ts
frontend/src/environments/environment.production.ts
```

The Angular app reads this value through `frontend/src/app/core/api/api.config.ts`.

For local development, keep:

```ts
apiBaseUrl: 'http://localhost:5001/api'
```

For GitHub Pages static hosting, `frontend/src/environments/environment.production.ts` uses the static data setup and does not require a deployed backend.

For a future hosted API deployment, change the production API URL to the deployed backend API URL, for example:

```ts
apiBaseUrl: 'https://your-teampulse-api.example.com/api'
```

Deployment checklist:

- Enable production CORS origin.
- Decide whether HTTP or HTTPS is required by the hosting provider.
- Document the deployed frontend and backend URLs.
- Rebuild the frontend after changing the production API URL.
