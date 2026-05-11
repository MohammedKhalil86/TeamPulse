# UI Design System

TeamPulse uses a futuristic SaaS dashboard style with Neo-Brutalism-inspired details.

## Visual Principles

- Strong borders.
- High contrast.
- Clear cards and sections.
- Bold active states.
- Playful but professional motion.
- Dense enough for business workflows.
- Responsive layouts for workshop demos.

## Theme System

Theme state is managed by `ThemeService` in `frontend/src/app/core/theme`. The selected theme is persisted in LocalStorage and applied through a root class.

The app supports:

- Light mode.
- Dark mode.
- PrimeNG theme integration.
- Custom CSS variables in `frontend/src/styles/_theme.scss`.

## Shared Components

| Component | Purpose |
| --- | --- |
| `page-header` | Page title, subtitle, optional action |
| `stat-card` | Dashboard and profile metrics |
| `score-badge` | Score display with visual level |
| `risk-badge` | Low/Medium/High risk display |
| `empty-state` | No-data states |
| `loading-state` | Skeleton/spinner states |
| `floating-help` | Page-level learning/help dialog |
| `app-logo` | Animated TeamPulse wordmark |
| `role-chip` | Current role indicator |
| `section-card` | Strong-bordered content section |

## Pulse Logo

The TeamPulse logo is a reusable animated component. It includes a pulse/heartbeat visual that animates roughly once per second and respects reduced-motion preferences.

## Motion

The app uses route/page transitions, entrance animations, and card hover transitions. Motion should help orientation, not distract from workflow tasks.
