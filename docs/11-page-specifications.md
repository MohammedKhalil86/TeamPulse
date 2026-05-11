# Page Specifications

| Page | Business Purpose | Angular Features | PrimeNG Components | API Dependencies | Role Behavior |
| --- | --- | --- | --- | --- | --- |
| Login `/login` | Start fake session | Reactive Forms, validators, services, LocalStorage | Card-like layout, select, input, password, button | `POST /api/auth/login`, `POST /api/auth/logout` | Public; picks Manager or Team Member demo credentials |
| Dashboard `/dashboard` | Summarize manager or member work | Role rendering, signals, computed state, HttpClient | Cards, tags, progress bars, charts, buttons | `/api/dashboard/manager`, `/api/dashboard/member/{userId}` | Manager sees organization view; member sees personal view |
| Teams `/teams` | Browse and maintain teams | Reactive Forms, filtering, role-based actions | Table, dialog, inputs, selects, buttons, tags | `/api/teams`, `/api/users`, `/api/members` | Manager CRUD; member read-only |
| Team Detail `/teams/:id` | Inspect one team | Route params, services, reusable components | Tables, tags, buttons, cards | `/api/teams/{id}`, `/api/teams/{teamId}/members`, `/api/teams/{teamId}/goals`, `/api/feedback` | Authenticated view |
| Members `/members` | Browse member directory | Pagination, sorting, filters, Reactive Forms | DataTable, dialog, select, inputs, buttons | `/api/members`, `/api/teams` | Manager CRUD; member limited/team view |
| Member Detail `/members/:id` | Inspect member profile | Route params, role checks, forms | Section cards, table/list, progress, tags, dialog | `/api/members/{id}`, `/api/members/{id}/evaluations`, `/api/members/{id}/goals`, `/api/members/{id}/feedback`, `/api/members/{id}/notes`, `/api/notes` | Manager can manage notes; member sees own relevant data |
| Evaluations `/evaluations` | Manage evaluation reviews | Reactive Forms, validators, computed averages | Table, dialog, sliders, textarea, toast | `/api/evaluations`, `/api/members/{memberId}/evaluations`, `/api/members` | Manager CRUD; member own evaluations |
| Feedback `/feedback` | Track recognition, improvement, risk, general feedback | Reactive Forms, filters, role checks | Cards, table/list, dialog, tags, date picker, toast | `/api/feedback`, `/api/members/{memberId}/feedback`, `/api/members` | Manager all/create/delete; member own and team recognition |
| Goals `/goals` | Track team and member goals | Reactive Forms, filters, progress state | Table, dialog, progress bar, date picker, tags, toast | `/api/goals`, `/api/members/{memberId}/goals`, `/api/teams/{teamId}/goals`, `/api/members`, `/api/teams` | Manager CRUD; member own goals |
| Angular Lab `/angular-lab` | Map Angular concepts to pages | Search/filter state, reusable components | Cards, tags, buttons, select | Static app metadata in `angular-lab.data.ts` | Authenticated learning page |
| Angular Lab Detail `/angular-lab/:featureId` | Explain one Angular concept in TeamPulse | Route params, data lookup, links | Tabs, accordion, panel, table, tags, buttons | Static app metadata in `angular-lab.data.ts` | Authenticated learning page |

Every authenticated page uses the app shell, role chip, theme toggle, logout, and floating help system.
