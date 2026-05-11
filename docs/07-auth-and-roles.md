# Auth and Roles

TeamPulse uses fake authentication for workshop purposes. There is no JWT, no ASP.NET Identity, no password hashing, and no real authentication server.

## Demo Credentials

Managers:

| Email | Password |
| --- | --- |
| `manager1@teampulse.demo` | `Manager@123` |
| `manager2@teampulse.demo` | `Manager@123` |

Team Members:

| Email | Password |
| --- | --- |
| `member1@teampulse.demo` | `Member@123` |
| `member2@teampulse.demo` | `Member@123` |

## Fake Login Flow

1. The login page posts email/password to `POST /api/auth/login`.
2. The backend validates against seeded users in memory.
3. The backend returns a simple session object: `userId`, `fullName`, `email`, `appRole`, `businessTitle`, `teamId`.
4. `AuthService` stores the session in LocalStorage.
5. Guards and layout navigation read the current session.
6. Logout calls `POST /api/auth/logout` and clears LocalStorage.

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
| Angular Lab | Full access | Full access |

The backend does not enforce production authorization. The authenticated shell is protected by `AuthGuard`; the `RoleGuard` exists for route-level role restrictions when needed, while the current business pages mostly demonstrate role behavior through navigation, scoped data, and conditional UI actions.
