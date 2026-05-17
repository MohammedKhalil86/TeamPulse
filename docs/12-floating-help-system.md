# Floating Help System

The floating help system provides page-level Angular learning guidance without adding runtime AI features.

## Purpose

- Explain the business purpose of the current page.
- Identify Angular concepts actually implemented on the page.
- Identify PrimeNG components used.
- Show relevant real code from the project.
- Show a simple text-based architecture diagram.
- Link to related Learning Lab topics.
- Adapt content to a selected learner level: Beginner, Intermediate, or Advanced.

## Architecture

| Piece | Location | Responsibility |
| --- | --- | --- |
| Help content data | `frontend/src/app/core/help/help.data.ts` | All page entries, feature refs, fallback snippets, diagrams |
| Code walkthrough data | `frontend/src/app/features/learning/code-walkthroughs.data.ts` | Curated commented code excerpts linked to Learning Lab feature IDs |
| Help service | `frontend/src/app/core/help/help.service.ts` | Resolves current page entry and related walkthroughs by watching `Router` events |
| Help component | `frontend/src/app/shared/components/floating-help/` | Floating button, tooltip, dialog, tabs, level selector |
| Page usage | `AppLayoutComponent` template | `<tp-floating-help />` with no inputs needed |

`AppLayoutComponent` simply includes `<tp-floating-help />` with no bindings. Help content stays in a dedicated data file and service so it can be maintained without editing the layout shell.

## Content Model

### `PageHelpEntry`

```typescript
export interface PageHelpEntry {
  routePrefix: string | string[];
  pageTitle: string;
  businessOverview: string;
  userActions: string[];
  angularFeatures: HelpFeatureRef[];
  primeNgComponents: string[];
  relatedLabIds: string[];
  diagram: string;
  codeSnippets: HelpCodeSnippet[];
}
```

`codeSnippets` are fallback snippets. The preferred Code tab content comes from curated `CodeWalkthrough` records matched through `relatedLabIds`.

### `CodeWalkthrough`

```typescript
export interface CodeWalkthrough {
  id: string;
  title: string;
  filePath: string;
  language: 'typescript' | 'csharp' | 'json' | 'scss' | 'html';
  featureIds: string[];
  code: string;
  highlightedLines?: number[];
}
```

### `HelpFeatureRef`

```typescript
export interface HelpFeatureRef {
  labId: string;
  name: string;
  minLevel: LearnerLevel;
  pageNote: string;
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

`LEVEL_ORDER` maps levels to integers `{ Beginner: 0, Intermediate: 1, Advanced: 2 }`. Features and snippets with `LEVEL_ORDER[minLevel] <= LEVEL_ORDER[selectedLevel]` are shown, so Intermediate includes Beginner content.

## HelpService

```typescript
@Injectable({ providedIn: 'root' })
export class HelpService {
  private readonly router = inject(Router);
  private readonly currentUrl = signal(this.router.url);

  readonly currentEntry = computed<PageHelpEntry | undefined>(() =>
    findPageHelpEntry(this.currentUrl())
  );

  readonly currentWalkthroughs = computed(() => {
    const entry = this.currentEntry();
    return entry ? getCodeWalkthroughsForFeatures(entry.relatedLabIds) : [];
  });

  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => this.currentUrl.set(event.urlAfterRedirects));
  }
}
```

## FloatingHelpComponent

The component is self-contained with no `input()` bindings. It injects `HelpService` and manages dialog state internally.

| Signal or computed | Purpose |
| --- | --- |
| `learnerLevel` | Selected learner level |
| `visible` | Dialog open or closed state |
| `activeTab` | Active tab in the dialog |
| `currentEntry` | Current page help entry |
| `filteredFeatures` | Features visible at the selected level |
| `filteredWalkthroughs` | Real commented code walkthroughs related to the current page |
| `filteredLegacySnippets` | Fallback snippets visible at the selected level |
| `filteredSnippets` | Combined walkthrough/snippet count for empty-state handling |

The floating button uses `pTooltip="Explain the Angular magic behind this page"` with `tooltipPosition="left"` from `primeng/tooltip`. `TooltipModule` is part of the existing PrimeNG 21 installation.

Dialog width is `min(64rem, calc(100vw - 2rem))`. Content max height is `78vh` with vertical scrolling.

## Popup Tabs

| Tab | Value | Content |
| --- | --- | --- |
| Overview | `overview` | Business overview, user actions, PrimeNG components |
| Angular | `angular` | Angular features filtered by learner level, each with a page-specific note |
| Code | `code` | Curated commented code walkthroughs, fallback snippets, and honest empty state if none are available |
| Diagram | `diagram` | Text-based architecture mental model |
| Related Lab | `lab` | Links to `/learning/angular/:featureId` for each related lab ID |

## Content Rules

- `angularFeatures` must only reference features with status `Implemented` or `Partially implemented` in `angular-lab.data.ts`.
- `Conceptual` and `Future extension` lab entries must not appear in page-level help until they have real project implementation examples.
- Prefer curated `CodeWalkthrough` records over ad hoc `codeSnippets`.
- Walkthrough code should be short, real, and commented with `Learning Lab:` where the comment helps explain an Angular concept.
- `codeSnippets` must show real code from the project or an honest empty state. Never claim code is available if it is not.
- Do not present technical data setup choices as normal product modes in help content. Technical setup belongs in Learning Lab / Run Locally.

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
| `/learning/angular` | Learning Lab - Angular |
| `/learning/mcp-servers` | Learning Lab - MCP Servers |
| `/learning/run-locally` | Learning Lab - Run Locally |

## Adding a New Page

1. Add a new `PageHelpEntry` object to `PAGE_HELP_ENTRIES` in `help.data.ts`.
2. Set `routePrefix` to the exact route path or an array of prefixes.
3. List only `angularFeatures` that are actually used by the page.
4. Set a meaningful `diagram`.
5. Add or reuse a `CodeWalkthrough` record when the page demonstrates a reusable Angular concept.
6. Add fallback `codeSnippets` only when the walkthrough catalog is not enough.
7. Confirm conceptual and future roadmap topics are not shown as implemented page help.

The help system is static documentation inside the app. It does not call any AI service or generate content at runtime.
