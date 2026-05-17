# Seeded Data Plan

Seed data lives in root shared JSON files under `shared/seed-data/`.

The ASP.NET Core Minimal API loads these files at startup through `SeedData.Create(...)` and `SeedDataLoader`. The Angular production/static build also copies these files into `assets/seed-data/` so GitHub Pages can run without the backend.

## Shared Seed Files

```text
shared/seed-data/
  seed-metadata.json
  users.json
  teams.json
  members.json
  evaluations.json
  goals.json
  feedback.json
  notes.json
```

`seed-metadata.json` includes the seed version, generation timestamp, source note, and expected record counts. Data files use camelCase JSON property names, string enum values, ISO date-time strings, and `YYYY-MM-DD` date-only values.

## Seed Shape

- 65 users.
- 5 managers.
- 60 team member users.
- 5 teams:
  - Frontend Squad
  - Backend Squad
  - Platform Squad
  - QA Squad
  - Delivery Squad
- 60 member profiles.
- 60 evaluations.
- 70 goals.
- 60 feedback records.
- 30 one-to-one notes.
- Each team has one manager and 12 members.
- Arabic names are written in English.
- UI text remains English only.

## Seeded Business Data

| Data | Purpose |
| --- | --- |
| Users | Sample login and role identity |
| Teams | Team dashboard, team list, details, filters |
| Member profiles | Member directory, paging, sorting, filtering |
| Evaluations | Evaluation page and dashboard scoring |
| Goals | Goals page, progress bars, dashboard goal summaries |
| Feedback | Feedback feed, recent feedback, member profile history |
| One-to-one notes | Manager-only notes on member profiles |

## Reset Behavior

Data resets when the backend process restarts. The JSON files are source data only; create/update/delete API calls mutate the singleton in-memory store for the current backend run.

In the static frontend setup, the browser initializes localStorage from the seed JSON when no saved data exists or when the saved seed version does not match `seed-metadata.json`. Create/edit/delete actions then persist in browser localStorage. There is no visible reset control in the business UI.

## Backend Loading

`TeamPulseDataStore` receives `IHostEnvironment`, asks `SeedData.Create(environment.ContentRootPath)` for a `TeamPulseSeed`, and keeps the loaded lists in memory. `SeedDataLoader` searches upward from the backend content root until it finds `shared/seed-data`.

Startup fails with a clear error if a JSON file is missing, malformed, has counts that do not match metadata, has duplicate ids, uses old demo passwords, or breaks required relationships between users, teams, members, evaluations, goals, feedback, and notes.

## Frontend Static Loading

`frontend/angular.json` copies `../shared/seed-data/*.json` into `assets/seed-data/` during Angular builds. `StaticDataStore` fetches those assets with `HttpClient`, tracks `seedVersion`, and stores editable collections under namespaced localStorage keys:

- `teampulse.v2.seedVersion`
- `teampulse.v2.users`
- `teampulse.v2.teams`
- `teampulse.v2.members`
- `teampulse.v2.evaluations`
- `teampulse.v2.goals`
- `teampulse.v2.feedback`
- `teampulse.v2.notes`
- `teampulse.v2.session`

This lets the Local API setup and GitHub Pages setup share the same source seed data while keeping the REST API implementation in the codebase.
