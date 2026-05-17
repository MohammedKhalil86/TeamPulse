# Angular Feature to Page Map

| Angular Feature | Used In | Why It Exists | Main Files/Folders |
| --- | --- | --- | --- |
| Standalone Components | All pages and shared UI | Modern Angular structure without NgModules | `frontend/src/app/features`, `frontend/src/app/shared/components` |
| Routing | All app navigation | Public login plus authenticated shell routes, Learning Lab child routes, old Angular Lab redirects, plus Not Found fallback | `frontend/src/app/app.routes.ts` |
| Lazy Loading | Route components | Keep page code split by route, including Learning Lab child pages | `app.routes.ts`, `features/*` |
| Route Guards | Protected app shell and data routes | `authGuard` redirects unauthenticated users to login; `roleGuard` validates the active app role before entering any business data route | `core/guards/auth.guard.ts`, `core/guards/role.guard.ts` |
| Role-based UI | Dashboard, Teams, Members, Evaluations, Feedback, Goals, How TeamPulse Works | Manager/member workflows differ | `core/auth`, feature components |
| Services | API, auth, theme, storage, loading | Share state and HTTP logic | `core/api`, `core/auth`, `core/theme`, `core/storage` |
| Dependency Injection | Services and API URL | Keep dependencies configurable and testable | `app.config.ts`, `core/api/api.config.ts` |
| HttpClient | All backend data pages | Use real Minimal API calls | `core/api` |
| Interceptors | Global loading | Track HTTP activity centrally | `core/interceptors` |
| Signals | Auth, theme, page state | Simple reactive state | `core/auth`, `core/theme`, feature pages |
| Computed State | Dashboard, filters, How TeamPulse Works | Derive page summaries and role-aware guide content | `dashboard`, list pages, `features/how-teampulse-works` |
| Reactive Forms | Login and CRUD dialogs | Validated user input | `features/login`, `features/teams`, `features/members`, `features/evaluations`, `features/feedback`, `features/goals` |
| Validators | Forms | Required fields and score/progress bounds | Feature page form builders |
| Pipes | Scores, risk, dates | Consistent display formatting | `shared/pipes` |
| Directives | Risk/score highlights | Reusable visual rules | `shared/directives` |
| Component Inputs (`input()`) | Shared cards, badges, help, Angular learning detail | Reusable UI configured by parent pages; `FloatingHelpComponent` and Angular learning detail use the signal-based `input()` API | `shared/components`, `features/angular-lab` |
| Component Outputs | Page header and empty state actions | Child components emit parent actions | `page-header`, `empty-state` |
| Reusable Components | All business pages | Consistent visual system | `shared/components` |
| PrimeNG Components | Tables, dialogs, forms, charts | Production-like UI controls | Feature pages and shared components |
| Theming | Whole app | Custom light/dark visual identity | `styles.scss`, `styles/_theme.scss`, `core/theme` |
| Dark/Light Mode | Shell and login | Persisted user theme choice | `ThemeService`, layout |
| Angular Animations | Shell/page transitions | Smooth route and card entrances; `[@.disabled]` respects `prefers-reduced-motion` | `shared/animations`, `core/layout` |
| LocalStorage | Session and theme | Persist fake auth/theme locally | `core/storage`, `core/auth`, `core/theme` |
| Error Handling | API-driven pages | Show failures through state/toast patterns | Feature pages, API subscriptions |
| Loading States | API-driven pages | Communicate pending HTTP work | `core/interceptors`, `shared/components/loading-state` |

## HelpService and Floating Help

`HelpService` (`core/help/help.service.ts`) watches `Router` events and exposes a `currentEntry` computed signal that resolves the active `PageHelpEntry` from `core/help/help.data.ts`. It uses the same Angular patterns as other services in the project:

- `signal()` to store the current URL
- `computed()` to derive the active page help entry
- `NavigationEnd` subscription to update the URL signal

`FloatingHelpComponent` injects `HelpService` directly and is fully self-contained. It uses `TooltipModule` (`primeng/tooltip`) for the hover hint and `TabsModule` for the five-tab dialog layout. The help dialog adapts to a learner level selector (Beginner / Intermediate / Advanced) using additional `computed()` values that filter feature refs and code snippets by `minLevel`.

Content in `help.data.ts` links each page to its Angular features using `labId` keys that match `AngularLabFeature.id` values in `angular-lab.data.ts`, creating a two-way connection between the help popup and the Learning Lab explorer.

## Route Guard Detail

`authGuard` is applied to the outer authenticated shell route (the `''` path with `AppLayoutComponent`). It redirects unauthenticated users to `/login` with a `returnUrl` query parameter.

`roleGuard` is applied to all business data child routes: `teams`, `teams/:id`, `members`, `members/:id`, `evaluations`, `feedback`, and `goals`. It is also applied to the business guide route `how-teampulse-works`. Each carries `data: { roles: ['Manager', 'TeamMember'] }`. The guard validates that the current session holds a recognised app role before loading the page. Learning Lab routes are intentionally left without `roleGuard` so both roles and any visitor with a session can access the learning content freely.

Learning Lab Angular routes at `/learning/angular` and `/learning/angular/:featureId` use this map as an in-app learning experience. Old `/angular-lab` and `/angular-lab/:featureId` links redirect to the new Learning Lab routes.
