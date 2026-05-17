# Backend API

The backend is an ASP.NET Core Minimal API in `backend/TeamPulse.Api`. It uses in-memory data through `TeamPulseDataStore`.

The Local API setup keeps the REST endpoints visible for learners and local development. The GitHub Pages setup does not remove or replace this backend; it uses the same shared seed JSON through the Angular static data store.

Base URL used by the Angular app:

```text
http://localhost:5001/api
```

Swagger is enabled in development at `/swagger`.

## Endpoints

| Area | Method | Endpoint |
| --- | --- | --- |
| Health | GET | `/health` |
| Auth | POST | `/api/auth/login` |
| Auth | POST | `/api/auth/logout` |
| Dashboard | GET | `/api/dashboard/manager` |
| Dashboard | GET | `/api/dashboard/member/{userId}` |
| Users | GET | `/api/users` |
| Users | GET | `/api/users/{id}` |
| Teams | GET | `/api/teams` |
| Teams | GET | `/api/teams/{id}` |
| Teams | POST | `/api/teams` |
| Teams | PUT | `/api/teams/{id}` |
| Teams | DELETE | `/api/teams/{id}` |
| Members | GET | `/api/members` |
| Members | GET | `/api/members/{id}` |
| Members | GET | `/api/teams/{teamId}/members` |
| Members | POST | `/api/members` |
| Members | PUT | `/api/members/{id}` |
| Members | DELETE | `/api/members/{id}` |
| Evaluations | GET | `/api/evaluations` |
| Evaluations | GET | `/api/members/{memberId}/evaluations` |
| Evaluations | POST | `/api/evaluations` |
| Evaluations | PUT | `/api/evaluations/{id}` |
| Evaluations | DELETE | `/api/evaluations/{id}` |
| Goals | GET | `/api/goals` |
| Goals | GET | `/api/members/{memberId}/goals` |
| Goals | GET | `/api/teams/{teamId}/goals` |
| Goals | POST | `/api/goals` |
| Goals | PUT | `/api/goals/{id}` |
| Goals | DELETE | `/api/goals/{id}` |
| Feedback | GET | `/api/feedback` |
| Feedback | GET | `/api/members/{memberId}/feedback` |
| Feedback | POST | `/api/feedback` |
| Feedback | DELETE | `/api/feedback/{id}` |
| Notes | GET | `/api/members/{memberId}/notes` |
| Notes | POST | `/api/notes` |
| Notes | DELETE | `/api/notes/{id}` |

## Important Examples

Login request:

```json
{
  "email": "manager1@teampulse.demo",
  "password": "TeamPulse-Manager-2026!"
}
```

Login response:

```json
{
  "userId": 1,
  "fullName": "Hassan Mahmoud",
  "email": "manager1@teampulse.demo",
  "appRole": "Manager",
  "businessTitle": "Engineering Manager",
  "teamId": 1
}
```

Create team request:

```json
{
  "name": "Frontend Squad",
  "mission": "Build usable Angular product experiences",
  "managerId": 1,
  "healthScore": 84,
  "deliveryScore": 88,
  "engagementScore": 81,
  "riskLevel": "Low"
}
```

Create evaluation request:

```json
{
  "memberId": 12,
  "period": "Q2 2026",
  "technicalScore": 82,
  "communicationScore": 78,
  "ownershipScore": 86,
  "teamworkScore": 84,
  "deliveryScore": 80,
  "comments": "Consistent delivery with strong ownership.",
  "createdAt": "2026-05-03T00:00:00Z"
}
```

The API does not enforce production authorization. Role limits are demonstrated in the Angular UI.
