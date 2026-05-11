# Floating Help System

The floating help system provides page-level workshop guidance without adding runtime AI features.

## Purpose

- Explain the business purpose of the current page.
- Identify Angular concepts used by the page.
- Identify PrimeNG components used by the page.
- Point learners to related Angular Lab entries.

## Implementation

| Piece | Location | Responsibility |
| --- | --- | --- |
| Help component | `frontend/src/app/shared/components/floating-help` | Floating button and dialog UI |
| Help content mapping | `frontend/src/app/core/layout/app-layout.component.ts` | Chooses content by current route |
| Page usage | Authenticated shell | Shows help on protected pages |

## Why Content Lives in AppLayoutComponent

Help content for all pages is defined inside a single `helpContent` computed signal in `AppLayoutComponent`, not distributed across individual feature page components.

This is a deliberate design choice:

- `AppLayoutComponent` already owns the current route URL via `Router`, so it can read `router.url` directly without input passing.
- Centralising all help content in one place makes it easy for workshop maintainers to review and update guidance without hunting across feature folders.
- Feature pages stay focused on their business logic and API calls; they do not need to know about the help system.
- The `FloatingHelpComponent` is a pure presentational component that receives its content through `input()` signal bindings from `AppLayoutComponent`.

If a new page is added, add a new `if (url === '/new-page')` block to `helpContent()` in `AppLayoutComponent`.

## FloatingHelpComponent inputs

`FloatingHelpComponent` uses the Angular `input()` signal API:

```typescript
readonly title = input('Page Help');
readonly businessPurpose = input('...');
readonly angularFeatures = input<string[]>([]);
readonly primeNgComponents = input<string[]>([]);
readonly labEntries = input<string[]>([]);
```

These are bound from `AppLayoutComponent` with standard property binding:

```html
<tp-floating-help
  [title]="pageTitle() + ' Help'"
  [businessPurpose]="helpContent().businessPurpose"
  [angularFeatures]="helpContent().angularFeatures"
  [primeNgComponents]="helpContent().primeNgComponents"
  [labEntries]="helpContent().labEntries"
/>
```

## Content Model

Each help entry includes:

- Business purpose.
- Angular features used.
- PrimeNG components used.
- Related Angular Lab entries.

Current covered pages include Dashboard, Teams, Team Details, Members, Member Profile, Evaluations, Feedback, Goals, and Angular Lab.

The help system is static documentation inside the app. It does not call an AI service and does not generate content at runtime.
