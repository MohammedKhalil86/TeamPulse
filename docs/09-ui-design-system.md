# UI Design System

TeamPulse uses a futuristic SaaS dashboard style with Neo-Brutalism-inspired details.

## Visual Principles

- Strong borders.
- High contrast.
- Clear cards and sections.
- Bold active states.
- Playful but professional motion.
- Dense enough for business workflows.
- Responsive layouts for product demos and real-world screen sizes.
- Business-facing copy in normal app pages; technical learning language belongs in Learning Lab, docs, and contextual help.

## Theme System

Theme state is managed by `ThemeService` in `frontend/src/app/core/theme`. The selected theme is persisted in LocalStorage and applied through a root class.

The app supports:

- Light mode.
- Dark mode.
- PrimeNG theme integration.
- Custom CSS variables in `frontend/src/styles/_theme.scss`.

## Typography And Readability

TeamPulse keeps its bold Neo-Brutalism/futuristic personality, but the default reading rhythm is tuned for longer dashboard sessions:

- Headings, page titles, and the logo use the `--tp-font-heading` stack, preferring Space Grotesk when available and falling back to system UI fonts.
- Body copy uses the `--tp-font-body` stack, preferring Inter when available and falling back to system UI fonts.
- Code and technical labels use the `--tp-font-code` stack, preferring JetBrains Mono when available and falling back to monospace.
- Body text starts from a comfortable 16px baseline with increased line-height.
- Small helper text, subtitles, metadata, and card supporting copy should keep enough line-height and contrast to remain readable in both light and dark themes.

No external font package or remote font import is required; these are progressive font-family stacks.

## Spacing Utilities

Reusable spacing helpers live in `frontend/src/styles.scss` and should be preferred over one-off spacing fixes when a page needs simple rhythm adjustments:

| Utility | Purpose |
| --- | --- |
| `.tp-stack` | Vertical content stack |
| `.tp-stack-sm` | Compact vertical stack |
| `.tp-cluster` | Wrapping inline metadata, chips, buttons, or badges |
| `.tp-title-row` | Title plus status/badge row with wrapping gap |
| `.tp-meta-list` | Compact metadata rows that should wrap cleanly |
| `.tp-muted` | Standard subdued text color |

Use these utilities where content naturally clusters, such as card headings with status badges, metadata lines, chips near labels, or detail page subtitles.

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

## App Shell And Sidebar

The authenticated app shell has an expanded sidebar by default. Users can collapse it with the sidebar toggle:

- Expanded state shows the full logo and navigation labels.
- Collapsed state shows a compact logo and navigation icons only.
- Collapsed navigation links keep accessible labels through `aria-label` and browser tooltips.
- The collapsed state is persisted in LocalStorage under `teampulse.v2.sidebarCollapsed`.
- Mobile layout keeps navigation usable and does not force the compact desktop sidebar pattern.

The topbar stays business-focused with role/user context, theme switching, loading state, and logout.

## Pulse Logo

The TeamPulse logo is a reusable animated component with a larger rectangular mark, TeamPulse wordmark, active pulse line, and small spark accents. It does not include a tagline in normal UI. Motion respects reduced-motion preferences.

The browser favicon uses the same pulse/spark visual language through `frontend/public/favicon.svg`.

## Public UI Language

Normal business UI should feel like a product, not an internal training shell. Avoid visible labels such as learning-event names, sample-auth wording, API/backend details, or setup names on business pages.

The login page uses the public value proposition:

```text
Understand your team. Improve delivery. Grow people.
```

It also includes one concise sample-data notice so users know not to enter real employee or company information.

## Motion

The app uses route/page transitions, entrance animations, and card hover transitions. Motion should help orientation, not distract from workflow tasks.

Hover shadows and transforms should remain bold but comfortable. Avoid increasing motion or shadow distance in a way that makes dense dashboard pages feel jumpy.
