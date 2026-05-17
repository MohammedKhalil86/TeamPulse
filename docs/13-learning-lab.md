# Learning Lab

Learning Lab is the in-app learning area for TeamPulse. It groups Angular learning, MCP Servers, and Run Locally guidance while keeping the existing Angular concept map intact.

The Angular section connects Angular concepts to real TeamPulse screens so learners can study the actual app instead of isolated snippets.

## Routes

| Route | Purpose |
| --- | --- |
| `/learning` | Redirects to `/learning/angular` |
| `/learning/angular` | Searchable/filterable Angular topic explorer |
| `/learning/angular/:featureId` | Detail page for one Angular concept or roadmap topic |
| `/learning/mcp-servers` | MCP Servers lesson — five dev-time MCP servers explained |
| `/learning/run-locally` | Local setup guide — clone, run, build, troubleshoot |
| `/angular-lab` | Redirects to `/learning/angular` for old links |
| `/angular-lab/:featureId` | Redirects to `/learning/angular/:featureId` for old links |

The detail page uses the Angular `input()` signal API with `withComponentInputBinding()` to receive the `featureId` route parameter reactively. Navigating between lab entries updates the displayed feature without reloading the component.

## Angular Topic Explorer

The explorer preserves the existing Angular feature entries, including standalone components, routing, lazy loading, guards, role-based UI, services, dependency injection, HttpClient, interceptors, signals, computed state, Reactive Forms, validators, pipes, directives, component inputs (`input()` signal API), component outputs, reusable components, PrimeNG, theming, dark/light mode, animations, LocalStorage, error handling, and loading states.

It also includes roadmap/course topics for Angular CLI, npm/npx, project structure, TypeScript essentials, templates, bindings, change detection, RxJS, deployment, NgRx, GraphQL, SSR/SSG, and Angular CLI vs Nx.

Each feature card shows:

- Feature name.
- Short explanation.
- Week.
- Difficulty level.
- Category.
- Status.
- Pages using the feature.
- Link to details.

The explorer supports filters for search, week, difficulty, category, and status.

## Metadata

Each Angular learning entry includes:

- `week`
- `category`
- `status`
- `statusNotes`
- `codeWalkthroughIds`

Status values are:

- `Implemented`
- `Partially implemented`
- `Conceptual`
- `Future extension`

Implemented and partially implemented entries are candidates for future code walkthroughs. Conceptual and future extension entries are roadmap material and should not be referenced from page-level floating help until implemented.

## Detail Pages

Each detail page includes:

- What the feature is.
- Why TeamPulse uses it.
- Pages and components that use it.
- Short code snippet from the project where practical.
- Text-based diagram or visual explanation.
- Related PrimeNG components when relevant.
- Links to real pages that demonstrate the concept.

Main source file:

```text
frontend/src/app/features/angular-lab/angular-lab.data.ts
```

## input() Signal API

`FloatingHelpComponent` and the Angular detail page both use the `input()` signal API introduced in Angular 17. The Angular entry for "Component Inputs" covers this pattern and links to relevant pages. Learners can compare the `input()` approach in shared components against the older `@Input()` decorator in components that have not yet been migrated.

## MCP Servers Page

Route: `/learning/mcp-servers`

Source: `frontend/src/app/features/learning/mcp-servers-page.component.ts`

Covers five development-time Model Context Protocol servers:

| MCP | Purpose |
| --- | --- |
| Angular CLI MCP | Run Angular CLI commands (`ng generate`, `ng build`) via an AI agent |
| PrimeNG MCP | Get accurate PrimeNG 19 component API examples without hallucination |
| GitHub MCP Server | Read issues, PRs, and repo metadata from inside an AI chat session |
| Context7 | Pull live library documentation into any AI prompt |
| Playwright MCP | Drive a real browser from the AI agent for testing and UI inspection |

For each MCP the page includes:

- What it is.
- Why it helps.
- How it can help TeamPulse development.
- Example safe setup idea.
- Example prompt (safe, project-specific).
- Common mistakes.
- Safety notes.
- AI tool comparison (Claude Code, Codex, GitHub Copilot).

**Important framing rules (enforced in the component):**

- MCPs are development-time helpers only.
- TeamPulse users do not need MCPs to use the app.
- TeamPulse has no runtime AI features.
- The page explicitly reminds readers of this in a bottom section card.

## Run Locally Page

Route: `/learning/run-locally`

Source: `frontend/src/app/features/learning/run-locally-page.component.ts`

The page is organized into three tabs:

### Local Setup tab

- GitHub repository link: `https://github.com/MohammedKhalil86/TeamPulse`
- Requirements: Git, Node.js LTS (22 or 24), npm, Angular CLI (optional), .NET SDK 10.
- Run backend: `cd backend/TeamPulse.Api && dotnet run` → `http://localhost:5001`.
- Run frontend: `cd frontend && npm install && npm start` → `http://localhost:4200`.
- Build commands table: `npm run build`, `npm run build:github-pages`, `npm run preview:github-pages`.
- Explains that the Angular frontend calls the ASP.NET Core Minimal API over HTTP.

### GitHub Pages tab

- Explains the static `dataMode: 'static'` setup.
- Explains that seed JSON from `shared/seed-data/` is loaded into browser localStorage.
- Explains that create/edit/delete actions persist to localStorage only and reset when site data is cleared.
- Explains shared seed data between local API and static build.
- Emphasizes that GitHub Pages is a demo convenience, not a production deployment model.

### Troubleshooting tab

- `node` or `npm` not recognized.
- `npm install` fails or takes a long time.
- Browser weak password warning (resolved with current credentials).
- Stale localStorage or site data.
- GitHub Pages 404 on direct URL or page refresh.

**Data notice (shown at top of page):**

> TeamPulse uses sample workspace data. Do not enter real employee or company information.

Learning Lab is practical project guidance, not official Angular documentation.
