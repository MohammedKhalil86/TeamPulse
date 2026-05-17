# Project Overview

TeamPulse is an Angular workshop sample project for Atos. It is a realistic but intentionally simple engineering team management application used to demonstrate Angular concepts and PrimeNG usage in a business-app context.

The app models a small engineering organization with managers, teams, team members, goals, evaluations, feedback, and one-to-one notes. The product shape is close enough to a real internal platform to make the exercises useful, while the implementation stays small enough for workshops.

## Current Scope

- Angular standalone frontend in `frontend/`.
- ASP.NET Core Minimal API backend in `backend/TeamPulse.Api/`.
- In-memory seeded data only.
- Fake login/logout only.
- English UI only.
- Arabic names written in English in demo data.
- Documentation in `docs/`.

## Main Pages

| Page | Route | Purpose |
| --- | --- | --- |
| Login | `/login` | Fake session login with demo credentials |
| Dashboard | `/dashboard` | Role-aware manager/member overview |
| Teams | `/teams`, `/teams/:id` | Team list, team maintenance, team detail |
| Members | `/members`, `/members/:id` | Member directory and member profile |
| Evaluations | `/evaluations` | Evaluation review and manager CRUD |
| Feedback | `/feedback` | Feedback feed and creation |
| Goals | `/goals` | Team/member goals and progress |
| Learning Lab | `/learning/angular`, `/learning/angular/:featureId` | Map Angular concepts and roadmap topics to real app pages |

## Non-Goals

TeamPulse does not include a real database, Entity Framework, JWT, ASP.NET Identity, a real authentication server, or runtime AI features. These are intentionally excluded so the workshop remains focused on Angular and PrimeNG.
