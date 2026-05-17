# AI Coding Agent Guidelines

These rules are for Codex, Claude, and other coding agents working on TeamPulse.

## Preserve Project Intent

- Keep TeamPulse focused on product-shaped Angular learning.
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
- Preserve both learner-friendly setup names: Local API setup and GitHub Pages setup.

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
- Keep README and docs aligned with actual scripts, routes, credentials, and seed data.
- If code and docs mismatch, update docs or add an explicit TODO note.
- Update `docs/18-change-log.md` after meaningful changes.

## MCP Server Rules

MCP servers are development-time tools used by AI coding agents during a session. They are not part of the TeamPulse application runtime.

- Do not add runtime AI features to TeamPulse.
- Do not claim MCP servers are TeamPulse application features.
- Do not expose credentials, tokens, or private setup in Learning Lab content.
- MCP content in Learning Lab must remain generic and safe for public learners.
- Learning Lab covers: Angular CLI MCP, PrimeNG MCP, GitHub MCP Server, Context7, Playwright MCP.
- For each MCP, content must include: what it is, why it helps, TeamPulse use case, setup idea, example prompt, common mistakes, safety notes, and AI tool comparison (Claude Code, Codex, GitHub Copilot).
- Always note that TeamPulse users do not need MCPs to use the app.

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
