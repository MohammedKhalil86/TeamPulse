# Deployment Plan

TeamPulse is local-first. Deployment is optional and should not complicate the workshop.

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

Before deployment, change `frontend/src/environments/environment.production.ts` to the deployed backend API URL, for example:

```ts
apiBaseUrl: 'https://your-teampulse-api.example.com/api'
```

Deployment checklist:

- Enable production CORS origin.
- Decide whether HTTP or HTTPS is required by the hosting provider.
- Document the deployed frontend and backend URLs.
- Rebuild the frontend after changing the production API URL.
