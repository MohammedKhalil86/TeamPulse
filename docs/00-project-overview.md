# Project Overview

TeamPulse is a product-shaped Angular application for engineering team health, goals, feedback, evaluations, and member visibility. TeamPulse v2 also includes a Learning Lab so learners can study the real Angular implementation behind the product.

The app models a small engineering organization with managers, teams, team members, goals, evaluations, feedback, and one-to-one notes. The product shape is close enough to a real internal platform to make the exercises useful, while the implementation stays intentionally compact.

Repository: `https://github.com/MohammedKhalil86/TeamPulse`

License: MIT.

Data notice: TeamPulse uses sample workspace data. Do not enter real employee or company information.

## Current Scope

- Angular standalone frontend in `frontend/`.
- ASP.NET Core Minimal API backend in `backend/TeamPulse.Api/`.
- Shared JSON seeded data under `shared/seed-data/`.
- Local API setup with ASP.NET Core Minimal API and in-memory data.
- GitHub Pages setup with static seed JSON and browser localStorage.
- Sample login/logout only.
- English UI only.
- Arabic names written in English in demo data.
- Documentation in `docs/`.

## Main Pages

| Page | Route | Purpose |
| --- | --- | --- |
| Login | `/login` | Sample session login with demo credentials |
| Dashboard | `/dashboard` | Role-aware manager/member overview |
| Teams | `/teams`, `/teams/:id` | Team list, team maintenance, team detail |
| Members | `/members`, `/members/:id` | Member directory and member profile |
| Evaluations | `/evaluations` | Evaluation review and manager CRUD |
| Feedback | `/feedback` | Feedback feed and creation |
| Goals | `/goals` | Team/member goals and progress |
| How TeamPulse Works | `/how-teampulse-works` | Role-aware business guide |
| Learning Lab | `/learning/angular`, `/learning/angular/:featureId` | Map Angular concepts and roadmap topics to real app pages |
| MCP Servers | `/learning/mcp-servers` | Development-time MCP server guide |
| Run Locally | `/learning/run-locally` | Local API and GitHub Pages setup guide |

## Non-Goals

TeamPulse does not include a production database, Entity Framework, JWT, ASP.NET Identity, a real authentication server, password hashing, or runtime AI features. These are intentionally excluded so the project remains focused on Angular, PrimeNG, local API integration, and static publishing.
