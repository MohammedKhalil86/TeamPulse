# AI Coding Agent Guidelines

These rules are for Codex, Claude, and other coding agents working on TeamPulse.

## Preserve Project Intent

- Keep TeamPulse focused on Angular workshop learning.
- Keep the backend intentionally simple.
- Do not add a database.
- Do not add Entity Framework.
- Do not add ASP.NET Identity.
- Do not add JWT.
- Do not add real authentication.
- Do not add AI runtime features.
- Preserve the Manager and Team Member role model.
- Preserve English-only UI.
- Preserve Arabic names written in English in seeded data.

## Dependency Rules

- Do not change Angular package versions unless explicitly requested.
- Angular packages are pinned to `21.2.9`.
- Ask before adding or skipping dependencies required for planned features.
- If a dependency is needed, explain why and provide the exact install command.
- Do not add packages unrelated to the TeamPulse scope.

## Documentation Rules

- Keep docs updated with every implementation phase.
- Do not leave empty placeholders.
- Do not document features that do not exist.
- If code and docs mismatch, update docs or add an explicit TODO note.
- Update `docs/18-change-log.md` after meaningful changes.

## PrimeNG Rules

- Use PrimeNG heavily for business UI.
- Use PrimeNG MCP for PrimeNG-heavy work when available.
- Keep PrimeNG usage visually aligned with the TeamPulse design system.

## Code Rules

- Prefer existing project patterns.
- Keep frontend and backend separated.
- Keep role restrictions visible in the Angular UI.
- Use real HTTP calls to the Minimal API.
- Do not use Angular in-memory-web-api.
