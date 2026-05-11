# Demo Script

Use this script for a practical workshop walkthrough. Recommended order: Manager flow first, then Team Member flow, then a short code walkthrough using Angular Lab.

## Manager Flow

1. Start the backend with `dotnet run` from `backend/TeamPulse.Api`.
2. Start the frontend with `npm start` from `frontend`.
3. Open `http://localhost:4200`.
4. Login as Manager:
   - Email: `manager1@teampulse.demo`
   - Password: `Manager@123`
5. Show the Dashboard:
   - Team totals.
   - Member totals.
   - Health and goal summaries.
   - PrimeNG charts.
6. Open Teams:
   - Search/filter teams.
   - Add or edit a team.
   - Open a team detail page.
7. Open Members:
   - Demonstrate pagination.
   - Demonstrate sorting.
   - Demonstrate global search.
   - Filter by risk, team, and seniority.
8. Open a Member Profile:
   - Review skills, scores, evaluations, goals, feedback.
   - Add a one-to-one note.
9. Open Evaluations:
   - Create an evaluation.
   - Show validation and toast feedback.
10. Open Goals:
   - Filter goals.
   - Show progress bars and statuses.
11. Switch dark/light theme.
12. Open floating help and explain page-level learning content.
13. Open Angular Lab:
   - Search for a feature.
   - Open a detail page.
   - Follow links back to real app pages.
14. Open Swagger at `http://localhost:5001/swagger` to show the Minimal API contract.
15. Logout.

## Team Member Flow

1. Login as Team Member:
   - Email: `member1@teampulse.demo`
   - Password: `Member@123`
2. Show the member dashboard.
3. Open Teams and Members to show limited/read-only behavior.
4. Open own Member Profile.
5. Open Evaluations, Feedback, and Goals to show own-scoped data.
6. Show Angular Lab is still available.
7. Logout.

The demo should emphasize that role restrictions are frontend workshop behavior, not production security.
