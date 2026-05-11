# Change Log

## 2026-05-03 — Post-review fixes

Applied all fixes from the comprehensive project review.

**Priority 1 — Critical fixes:**
- Fixed member dashboard loading bug: replaced nested `getMemberEvaluations` subscription inside `getMemberDashboard` with a `switchMap` pipeline so `loading.set(false)` fires only after both observables complete.
- Fixed Angular Lab detail stale route parameter: replaced `route.snapshot.paramMap` with the `input()` signal API (`readonly featureId = input<string>('')`) using `withComponentInputBinding()`, so navigating between lab entries updates the displayed feature reactively.

**Priority 2 — Important cleanup:**
- Applied `roleGuard` with `data: { roles: ['Manager', 'TeamMember'] }` to all business data child routes (`teams`, `teams/:id`, `members`, `members/:id`, `evaluations`, `feedback`, `goals`). Angular Lab routes are intentionally left without `roleGuard`. The guard import in `app.routes.ts` is no longer dead.
- Fixed `LoadingService`: renamed the raw signal exposure to `activeRequestCount` and added `isLoading` as a `computed(() => this.activeRequests() > 0)` boolean signal. All template usages still work with `loading.isLoading()`.
- Removed redundant `TeamPulseLogoComponent` wrapper (`shared/components/logo/`). `AppLogoComponent` is the single canonical logo component.
- Removed no-op `this.theme.theme()` call and `ThemeService` injection from `LoginPageComponent` constructor. Theme applies via `ThemeService` effect at startup without the login page touching it.
- Simplified `AuthService`: removed the redundant `isAuthenticated()` method. Updated `authGuard` to use `auth.isLoggedIn()` (the existing computed signal).

**Priority 3 — Workshop improvements:**
- Converted `FloatingHelpComponent` inputs to the `input()` signal API. Template updated to call inputs as signal functions (`title()`, `businessPurpose()`, etc.). Caller bindings in `AppLayoutComponent` are unchanged.
- Diversified seeded feedback: added `GetFeedbackType` and `GetFeedbackMessage` helpers in `SeedData.cs` that distribute all four `FeedbackType` values (`Recognition`, `Improvement`, `Risk`, `General`) with varied realistic messages across the 60 seeded members.
- Extracted `UsersApiService` (`core/api/users-api.service.ts`) for `getUsers()` and `getUser(id)`. Removed those methods from `MembersApiService`. Updated `TeamsPageComponent` and `TeamDetailPageComponent` to inject `UsersApiService`.

**Priority 4 — Optional improvements:**
- Added `NotFoundPageComponent` (`features/not-found/`). Wildcard route `**` now navigates to `/not-found` instead of silently redirecting to dashboard.
- Added direct `prefers-reduced-motion` handling for the route transition animation. `AppLayoutComponent` now reads `window.matchMedia('(prefers-reduced-motion: reduce)')` into a `reducedMotion` signal and binds `[@.disabled]="reducedMotion()"` on the animated `<main>` element.

**Documentation:**
- `docs/05-backend-api.md`: corrected manager login response example (`fullName` was wrong).
- `docs/14-primeng-usage.md`: added explicit section clarifying that PrimeNG MCP is development-time assistance only and TeamPulse has no runtime AI feature.
- `docs/12-floating-help-system.md`: documented why help content is centralised in `AppLayoutComponent` rather than distributed across feature pages; added `FloatingHelpComponent` `input()` API usage examples.
- `docs/10-angular-feature-to-page-map.md`: updated Route Guards row to accurately reflect `roleGuard` wiring; updated Component Inputs row to mention `input()` signal API; added route guard detail section; added reduced-motion animation note.
- `docs/13-angular-lab.md`: added note about `input()` signal API usage in detail page and `FloatingHelpComponent`.
- `README.md`: replaced overly specific Node/npm version pin with minimum/recommended version guidance.
- Follow-up review cleanup: added manager dashboard API error handling so loading clears on manager dashboard failures, and removed the root `AppComponent` no-op theme signal read while still instantiating `ThemeService`.

## 2026-05-03

Created the TeamPulse solution foundation:

- Added root `README.md`.
- Added Angular frontend structure under `frontend/`.
- Configured standalone Angular bootstrap, routing, SCSS, HttpClient, animations, PrimeNG, PrimeIcons, and theme readiness.
- Added ASP.NET Core Minimal API backend under `backend/TeamPulse.Api/`.
- Added Swagger, CORS for Angular local development, `/health`, and seeded in-memory read endpoints.
- Added backend folders for `Models/`, `Data/`, `Endpoints/`, and `Services/`.
- Added workshop documentation files under `docs/`.
- Resolved the frontend dependency blocker after Node.js, npm, and Angular CLI became available.
- Aligned Angular frontend packages to exact version `21.2.9`.
- Verified `npm install` and `npm run build` now succeed for the frontend.
- Implemented the ASP.NET Core Minimal API backend with fake auth, manager/member dashboards, users, teams, members, evaluations, goals, feedback, and one-to-one notes endpoints.
- Replaced the initial small seed set with in-memory workshop data for 5 managers, 60 team members, 5 teams, evaluations, goals, feedback, and notes.
- Verified the backend builds and a runtime smoke test succeeds for health, fake login, teams, members, and manager dashboard endpoints.
- Implemented Angular core architecture with `core/api`, `core/auth`, `core/guards`, `core/interceptors`, `core/layout`, `core/models`, `core/theme`, and `core/storage`.
- Added fake login/logout with `localStorage` session persistence, protected routes, role-based navigation, and manager-only route restrictions.
- Added the authenticated app shell with sidebar, topbar, current role indicator, logout, theme toggle, global loading state, and animated TeamPulse logo.
- Added the Neo-Brutalism-inspired login page using PrimeNG controls and real HTTP login calls to the ASP.NET Core API.
- Added initial routed feature pages for dashboard, teams, members, evaluations, feedback, goals, and Angular Lab.
- Verified `npm run build` succeeds and smoke-tested backend health, fake manager login, and the Angular `/login` dev route.
- Added reusable shared UI foundation components: page header, stat card, score badge, risk badge, empty state, loading state, floating help, app logo, role chip, and section card.
- Added shared pipes for score labels, risk labels, and friendly dates.
- Added shared directives for score and risk highlighting.
- Added route/page transition animation, global entrance/hover motion utilities, and reduced-motion support.
- Expanded theme tokens and PrimeNG visual overrides for the TeamPulse Neo-Brutalism-inspired style.
- Verified the frontend builds after the shared UI foundation changes.
- Implemented the role-aware Dashboard feature for `/dashboard`.
- Added manager dashboard sections for team totals, member totals, average health, evaluation completion, high-risk members, goal progress, team health, recent feedback, skills distribution, members by team, and quick links.
- Added team member dashboard sections for profile summary, personal goals, recent feedback, evaluation trend, team overview, skills summary, and quick links.
- Added dashboard-specific floating help content covering role-based rendering, API services, signals/computed values, PrimeNG dashboard components, and shared stat-card usage.
- Verified the frontend builds after the dashboard implementation.
- Updated AI coding agent guidelines to require asking before adding or skipping dependencies required for planned features, including package/tool rationale and exact install commands.
- Enhanced the Dashboard feature with PrimeNG Chart components backed by Chart.js for team health, members by team, goals status, and member evaluation score visuals.
- Kept CSS-based chart-style bars where they still provide useful quick scanning.
- Verified the frontend builds after adding dashboard chart support.
- Implemented Teams and Team Details features with searchable/filterable PrimeNG tables, manager-only team add/edit/delete dialogs, score/risk display, team members, goals, feedback summary, and risk highlights.
- Implemented Members and Member Profile features with PrimeNG DataTable pagination, sorting, global search, risk/team/seniority filters, manager-only member add/edit/delete dialogs, profile sections, evaluations, goals, feedback, and manager 1:1 notes.
- Opened Teams routes to all authenticated users while keeping team maintenance actions manager-only.
- Added page-specific floating help content for Teams, Team Details, Members, and Member Profile.
- Implemented Evaluations feature with manager create/view/edit/delete, team-member own evaluations, Reactive Forms validation, PrimeNG dialog, sliders, textarea, table, toast, average score, and score indicators.
- Implemented Feedback feature with manager all-feedback view/create/delete, team-member own/team recognition view, type/member/date/text filters, PrimeNG cards, table, tags, dialog, and toast.
- Implemented Goals feature with manager team/member goal management, team-member own goals, status/owner/text filters, progress bars, PrimeNG dialog, date picker, table, tags, and toast.
- Opened Evaluations, Feedback, and Goals routes to authenticated users while keeping write actions role-scoped.
- Added page-specific floating help content for Evaluations, Feedback, and Goals.
- Implemented Angular Lab with a searchable/filterable Angular concept map and detail pages at `/angular-lab/:featureId`.
- Added Angular Lab entries for standalone components, routing, lazy loading, guards, role-based UI, services, dependency injection, HttpClient, interceptors, signals, computed state, reactive forms, validators, pipes, directives, inputs, outputs, reusable components, PrimeNG, theming, dark/light mode, animations, LocalStorage, error handling, and loading states.
- Added project-based snippets, diagrams, related PrimeNG component notes, and links from Angular Lab details to real TeamPulse pages.
- Added page-specific floating help content for Angular Lab.
- Verified the frontend builds after the Angular Lab implementation.
- Hardened the documentation set with traceability across business features, Angular features, PrimeNG components, backend APIs, frontend pages, and source folders.
- Rewrote the root README with requirements, run commands, credentials, page map, documentation map, deployment note, and GitHub note.
- Added a root `.gitignore` for Angular, .NET, IDE, build, and local secret artifacts.
- Added Angular environment files for local and production API base URL configuration.
- Updated deployment documentation with GitHub Pages, Cloudflare Pages, Netlify, Vercel, Render, Railway, Koyeb, Fly.io, and Azure App Service guidance.
- Added recommended demo order to the README and strengthened the workshop demo script.
- Re-verified backend and frontend builds, Swagger, `/health`, manager/member fake logins, seeded data counts, CORS for Angular localhost, and a team CRUD smoke cycle.
- Polished global PrimeNG table, paginator, dialog, input, and chart styling for more consistent workshop pages.
