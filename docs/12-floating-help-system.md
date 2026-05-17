# Floating Help System

The floating help system provides page-level Angular learning guidance without adding runtime AI features.

## Purpose

- Explain the business purpose of the current page.
- Identify the Angular concepts actually implemented on the page (not conceptual-only).
- Identify PrimeNG components used.
- Show relevant code snippets from the project.
- Show a simple text-based architecture diagram.
- Link to related Learning Lab topics.
- Adapt content to a selected learner level (Beginner / Intermediate / Advanced).

## Architecture

| Piece | Location | Responsibility |
| --- | --- | --- |
| Help content data | `frontend/src/app/core/help/help.data.ts` | All page entries, feature refs, snippets, diagrams |
| Help service | `frontend/src/app/core/help/help.service.ts` | Resolves current page entry by watching `Router` events |
| Help component | `frontend/src/app/shared/components/floating-help/` | Floating button, tooltip, dialog, tabs, level selector |
| Page usage | `AppLayoutComponent` template | `<tp-floating-help />` — no inputs needed |

## Why Content Moved to a Dedicated Data File

In the previous implementation, all help content was defined inside a `helpContent` computed signal in `AppLayoutComponent`. The new architecture moves it to a standalone data file and service for three reasons:

- The data file can be read and updated without touching the shell layout component.
- `HelpService` is tree-shakeable and injectable anywhere — not locked to the layout.
- The `FloatingHelpComponent` is now fully self-contained: it injects `HelpService` directly and requires no inputs from its parent.

`AppLayoutComponent` now simply includes `<tp-floating-help />` with no bindings.

## Content Model

### `PageHelpEntry`

```typescript
export interface PageHelpEntry {
  routePrefix: string | string[];  // URL prefix for route matching
  pageTitle: string;               // shown in dialog header
  businessOverview: string;        // what the page does for the user
  userActions: string[];           // actions available on the page
  angularFeatures: HelpFeatureRef[];
  primeNgComponents: string[];
  relatedLabIds: string[];         // IDs from ANGULAR_LAB_FEATURES
  diagram: string;                 // text-based architecture mental model
  codeSnippets: HelpCodeSnippet[];
}
```

### `HelpFeatureRef`

```typescript
export interface HelpFeatureRef {
  labId: string;        // key in ANGULAR_LAB_FEATURES (angular-lab.data.ts)
  name: string;         // display name
  minLevel: LearnerLevel; // Beginner | Intermediate | Advanced
  pageNote: string;     // how this specific page uses this feature
}
```

### `HelpCodeSnippet`

```typescript
export interface HelpCodeSnippet {
  label: string;
  code: string;
  minLevel: LearnerLevel;
}
```

### `LearnerLevel`

```typescript
export type LearnerLevel = 'Beginner' | 'Intermediate' | 'Advanced';
```

`LEVEL_ORDER` maps levels to integers `{ Beginner: 0, Intermediate: 1, Advanced: 2 }`. Features and snippets with `LEVEL_ORDER[minLevel] <= LEVEL_ORDER[selectedLevel]` are shown, so Intermediate always includes Beginner content.

## HelpService

```typescript
@Injectable({ providedIn: 'root' })
export class HelpService {
  private readonly router = inject(Router);
  private readonly currentUrl = signal(this.router.url);

  readonly currentEntry = computed<PageHelpEntry | undefined>(() =>
    findPageHelpEntry(this.currentUrl())
  );

  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => this.currentUrl.set(event.urlAfterRedirects));
  }
}
```

The service uses the same `NavigationEnd` subscription pattern as `AppLayoutComponent` to track the current URL reactively.

## FloatingHelpComponent

The component is self-contained with no `input()` bindings. It injects `HelpService` and manages all state internally.

Internal signals:

| Signal | Type | Purpose |
| --- | --- | --- |
| `learnerLevel` | `signal<LearnerLevel>('Beginner')` | Currently selected learner level |
| `visible` | `signal(false)` | Dialog open/close state |
| `activeTab` | `signal('overview')` | Active tab in the dialog |

Computed values:

| Computed | Source | Result |
| --- | --- | --- |
| `dialogTitle` | `entry.pageTitle` | `"Dashboard — Angular Guide"` |
| `filteredFeatures` | `entry.angularFeatures` + level | Features visible at the selected level |
| `filteredSnippets` | `entry.codeSnippets` + level | Snippets visible at the selected level |

### Tooltip

The floating button uses `pTooltip="Explain the Angular magic behind this page"` with `tooltipPosition="left"` from `primeng/tooltip`. No extra package is needed — `TooltipModule` is part of the existing PrimeNG 21 installation.

### Dialog size

Width: `min(64rem, calc(100vw - 2rem))`.
Content max-height: `78vh` with `overflow-y: auto`.

## Popup Tabs

| Tab | Value | Content |
| --- | --- | --- |
| Overview | `overview` | Business overview, user actions, PrimeNG components |
| Angular | `angular` | Angular features filtered by learner level, each with a page-specific note |
| Code | `code` | Code snippets filtered by level; honest placeholder if none available |
| Diagram | `diagram` | Text-based architecture mental model |
| Related Lab | `lab` | Links to `/learning/angular/:featureId` for each related lab ID |

## Content Rules

- `angularFeatures` must only reference features with status `Implemented` or `Partially implemented` in `angular-lab.data.ts`.
- `Conceptual` and `Future extension` lab entries must not appear in page-level help until they have real project implementation examples.
- `codeSnippets` must show real code from the project or an honest placeholder. Never claim code is available if it is not.
- No API mode, demo mode, mock mode, or setup wording in help content. Technical setup belongs in Learning Lab / Run Locally.

## Covered Pages

| Route | Entry Title |
| --- | --- |
| `/dashboard` | Dashboard |
| `/teams` | Teams |
| `/teams/:id` | Team Detail |
| `/members` | Members |
| `/members/:id` | Member Profile |
| `/evaluations` | Evaluations |
| `/feedback` | Feedback |
| `/goals` | Goals |
| `/how-teampulse-works` | How TeamPulse Works |
| `/learning/angular` | Learning Lab — Angular |
| `/learning/mcp-servers` | Learning Lab — MCP Servers |
| `/learning/run-locally` | Learning Lab — Run Locally |

## Adding a New Page

1. Add a new `PageHelpEntry` object to `PAGE_HELP_ENTRIES` in `help.data.ts`.
2. Set `routePrefix` to the exact route path or an array of prefixes.
3. List only `angularFeatures` that are actually used by the page.
4. Set a meaningful `diagram` and at least one `codeSnippet` if practical.
5. The service and component pick up the new entry automatically — no other files need changes.

The help system is static documentation inside the app. It does not call any AI service or generate content at runtime.
