# Seeded Data Plan

Seed data lives in `backend/TeamPulse.Api/Data/SeedData.cs` and is loaded into `TeamPulseDataStore`.

## Seed Shape

- 5 managers.
- Around 60 team members.
- 5 teams:
  - Frontend Squad
  - Backend Squad
  - Platform Squad
  - QA Squad
  - Delivery Squad
- Each team has one manager and roughly 10 to 15 members.
- Arabic names are written in English.
- UI text remains English only.

## Seeded Business Data

| Data | Purpose |
| --- | --- |
| Users | Fake login and role identity |
| Teams | Team dashboard, team list, details, filters |
| Member profiles | Member directory, paging, sorting, filtering |
| Evaluations | Evaluation page and dashboard scoring |
| Goals | Goals page, progress bars, dashboard goal summaries |
| Feedback | Feedback feed, recent feedback, member profile history |
| One-to-one notes | Manager-only notes on member profiles |

## Reset Behavior

Data resets when the backend process restarts. This is intentional and keeps demos repeatable.
