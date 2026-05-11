# Angular Lab

Angular Lab is the in-app learning map for TeamPulse. It connects Angular concepts to real screens so workshop attendees can learn from the actual app instead of isolated snippets.

## Routes

| Route | Purpose |
| --- | --- |
| `/angular-lab` | Searchable/filterable Angular feature explorer |
| `/angular-lab/:featureId` | Detail page for one Angular concept |

The detail page uses the Angular `input()` signal API with `withComponentInputBinding()` to receive the `featureId` route parameter reactively. Navigating between lab entries updates the displayed feature without reloading the component.

## Feature Explorer

The explorer lists Angular features such as standalone components, routing, lazy loading, guards, role-based UI, services, dependency injection, HttpClient, interceptors, signals, computed state, Reactive Forms, validators, pipes, directives, component inputs (`input()` signal API), component outputs, reusable components, PrimeNG, theming, dark/light mode, animations, LocalStorage, error handling, and loading states.

Each feature card shows:

- Feature name.
- Short explanation.
- Difficulty level.
- Pages using the feature.
- Link to details.

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

`FloatingHelpComponent` and the Angular Lab detail page both use the `input()` signal API introduced in Angular 17. The Angular Lab entry for "Component Inputs" covers this pattern and links to relevant pages. Workshop attendees can compare the `input()` approach in shared components against the older `@Input()` decorator in components that have not yet been migrated.

Angular Lab is practical workshop guidance, not official Angular documentation.
