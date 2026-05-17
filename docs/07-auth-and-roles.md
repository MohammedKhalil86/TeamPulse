# Auth and Roles

TeamPulse uses fake authentication for workshop purposes. There is no JWT, no ASP.NET Identity, no password hashing, and no real authentication server.

## Demo Credentials

Managers:

| Email | Password |
| --- | --- |
| `manager1@teampulse.demo` | `TeamPulse-Manager-2026!` |
| `manager2@teampulse.demo` | `TeamPulse-Manager-2026!` |

Team Members:

| Email | Password |
| --- | --- |
| `member1@teampulse.demo` | `TeamPulse-Member-2026!` |
| `member2@teampulse.demo` | `TeamPulse-Member-2026!` |

All seeded manager users use `TeamPulse-Manager-2026!`. All seeded team member users use `TeamPulse-Member-2026!`. Generic demo fallback users, if added later, should use `TeamPulse-Demo-2026!`.

## Fake Login Flow

Local API setup:

1. The login page posts email/password to `POST /api/auth/login`.
2. The backend validates against seeded users in memory.
3. The backend returns a simple session object: `userId`, `fullName`, `email`, `appRole`, `businessTitle`, `teamId`.
4. `AuthService` stores the session in localStorage under `teampulse.v2.session`.
5. Guards and layout navigation read the current session.
6. Logout calls `POST /api/auth/logout` and clears the session key.

Static hosting setup:

1. The login page calls the same `AuthService.login(...)` method.
2. `StaticDataStore` initializes localStorage from `assets/seed-data/users.json` if needed.
3. The seeded user email/password is validated in the browser.
4. `AuthService` stores the same session shape under `teampulse.v2.session`.
5. Guards, role behavior, and logout use the same frontend session flow.

## Role Behavior

| Area | Manager | Team Member |
| --- | --- | --- |
| Dashboard | Organization/team dashboard | Personal dashboard |
| Teams | View, create, edit, delete | View only |
| Members | View, create, edit, delete | Limited/team view |
| Member Profile | Any member, manage notes | Own relevant data only |
| Evaluations | View/create/edit/delete | Own evaluations only |
| Feedback | View all, create/delete | Own feedback and team recognition |
| Goals | Manage team/member goals | Own goals |
| Learning Lab | Full access | Full access |

The backend does not enforce production authorization. The authenticated shell is protected by `AuthGuard`; the `RoleGuard` exists for route-level role restrictions when needed, while the current business pages mostly demonstrate role behavior through navigation, scoped data, and conditional UI actions.
