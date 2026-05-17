# Page Specifications

| Page | Business Purpose | Angular Features | PrimeNG Components | API Dependencies | Role Behavior |
| --- | --- | --- | --- | --- | --- |
| Login `/login` | Present TeamPulse, theme switching, sample-data notice, and sample sign-in | Reactive Forms, validators, services, LocalStorage | Product hero, role select, input, password, buttons, theme toggle | `POST /api/auth/login`, `POST /api/auth/logout` | Public; picks Manager or Team Member sample credentials |
| Dashboard `/dashboard` | Summarize manager or member work | Role rendering, signals, computed state, HttpClient | Cards, tags, progress bars, charts, buttons | `/api/dashboard/manager`, `/api/dashboard/member/{userId}` | Manager sees organization view; member sees personal view |
| Teams `/teams` | Browse and maintain teams | Reactive Forms, filtering, role-based actions | Table, dialog, inputs, selects, buttons, tags | `/api/teams`, `/api/users`, `/api/members` | Manager CRUD; member read-only |
| Team Detail `/teams/:id` | Inspect one team | Route params, services, reusable components | Tables, tags, buttons, cards | `/api/teams/{id}`, `/api/teams/{teamId}/members`, `/api/teams/{teamId}/goals`, `/api/feedback` | Authenticated view |
| Members `/members` | Browse member directory | Pagination, sorting, filters, Reactive Forms | DataTable, dialog, select, inputs, buttons | `/api/members`, `/api/teams` | Manager CRUD; member limited/team view |
| Member Detail `/members/:id` | Inspect member profile | Route params, role checks, forms | Section cards, table/list, progress, tags, dialog | `/api/members/{id}`, `/api/members/{id}/evaluations`, `/api/members/{id}/goals`, `/api/members/{id}/feedback`, `/api/members/{id}/notes`, `/api/notes` | Manager can manage notes; member sees own relevant data |
| Evaluations `/evaluations` | Manage evaluation reviews | Reactive Forms, validators, computed averages | Table, dialog, sliders, textarea, toast | `/api/evaluations`, `/api/members/{memberId}/evaluations`, `/api/members` | Manager CRUD; member own evaluations |
| Feedback `/feedback` | Track recognition, improvement, risk, general feedback | Reactive Forms, filters, role checks | Cards, table/list, dialog, tags, date picker, toast | `/api/feedback`, `/api/members/{memberId}/feedback`, `/api/members` | Manager all/create/delete; member own and team recognition |
| Goals `/goals` | Track team and member goals | Reactive Forms, filters, progress state | Table, dialog, progress bar, date picker, tags, toast | `/api/goals`, `/api/members/{memberId}/goals`, `/api/teams/{teamId}/goals`, `/api/members`, `/api/teams` | Manager CRUD; member own goals |
| How TeamPulse Works `/how-teampulse-works` | Explain how to read TeamPulse business signals and suggested workflows | Lazy route, route guard, signals, computed role-aware content, router links | Guide cards, tags, buttons | None; uses active session role only | Manager sees team-health workflow; team member sees personal-growth workflow |
| Angular Lab `/angular-lab` | Map Angular concepts to pages | Search/filter state, reusable components | Cards, tags, buttons, select | Static app metadata in `angular-lab.data.ts` | Authenticated learning page |
| Angular Lab Detail `/angular-lab/:featureId` | Explain one Angular concept in TeamPulse | Route params, data lookup, links | Tabs, accordion, panel, table, tags, buttons | Static app metadata in `angular-lab.data.ts` | Authenticated learning page |

Every authenticated page uses the app shell, role chip, theme toggle, logout, and floating help system. The topbar intentionally avoids a repeated fixed page title; page titles live in each page header.

The authenticated shell sidebar is expanded by default and can be collapsed by the user. Collapsed state persists with `teampulse.v2.sidebarCollapsed`, keeps icons visible, hides labels visually, and preserves accessible labels/tooltips. This is a layout preference only; it must not change routing, roles, data loading, or normal business UI copy.

## Layout And Readability Notes

- Dashboard should use an intentional two-column manager layout on wide screens so charts, lists, and quick links stay visually balanced without large empty gaps.
- Page and section headers should give subtitles enough line-height and spacing from action buttons.
- Card titles, badges, tags, and metadata should use wrapping gaps instead of touching or relying on fragile margins.
- Detail pages should avoid cramped title/status rows, especially member and team profile sections.
- Tables, forms, dialogs, and chips should remain readable in both dark and light themes, with comfortable small text and control spacing.
- How TeamPulse Works should stay business-facing and role-aware, with diagrams or workflow cards that explain product usage without setup labels.

## Public UI Copy Notes

- Login page copy should be business-oriented and product-facing.
- Normal business pages should not expose workshop, fake-auth, backend/API, or technical setup wording.
- Learning Lab, docs, and contextual help may still explain Angular, HttpClient, API services, and workshop learning goals where that context is useful.
