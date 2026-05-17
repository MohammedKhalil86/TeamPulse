# Data Model

Backend models live in `backend/TeamPulse.Api/Models`. Frontend interfaces live in `frontend/src/app/core/models/team-pulse.models.ts`.

Shared seed data lives in `shared/seed-data/` as camelCase JSON files. The backend deserializes those files into the same model types listed below and keeps the current in-memory store behavior.

## Enums

| Enum | Values |
| --- | --- |
| `AppRole` | `Manager`, `TeamMember` |
| `RiskLevel` | `Low`, `Medium`, `High` |
| `Seniority` | `Junior`, `Mid`, `Senior`, `Lead` |
| `OwnerType` | `Team`, `Member` |
| `GoalStatus` | `NotStarted`, `InProgress`, `Blocked`, `Completed` |
| `FeedbackType` | `Recognition`, `Improvement`, `Risk`, `General` |

## Models

| Model | Fields |
| --- | --- |
| `User` | `id`, `fullName`, `email`, `password`, `appRole`, `businessTitle`, `teamId`, `avatarUrl` |
| `Team` | `id`, `name`, `mission`, `managerId`, `healthScore`, `deliveryScore`, `engagementScore`, `riskLevel` |
| `MemberProfile` | `id`, `userId`, `fullName`, `role`, `seniority`, `teamId`, `skills`, `performanceScore`, `engagementScore`, `riskLevel` |
| `Evaluation` | `id`, `memberId`, `period`, `technicalScore`, `communicationScore`, `ownershipScore`, `teamworkScore`, `deliveryScore`, `comments`, `createdAt` |
| `Goal` | `id`, `title`, `description`, `ownerType`, `ownerId`, `progress`, `status`, `dueDate` |
| `Feedback` | `id`, `memberId`, `fromUserId`, `type`, `message`, `createdAt` |
| `OneToOneNote` | `id`, `memberId`, `managerId`, `note`, `createdAt` |

## Dashboard Contracts

The dashboard endpoints return aggregate view models rather than raw tables only. These models combine teams, members, evaluations, goals, feedback, and notes into page-friendly shapes for manager and member dashboards.

## Persistence

There is no persistence beyond process memory. Create/update/delete operations mutate the singleton in-memory store for the current backend run only.

## Seed Relationships

The shared seed data preserves the TeamPulse relationships:

- `User` records include managers and team member identities.
- `Team.managerId` points to a manager user.
- `MemberProfile.userId` points to a team member user.
- `MemberProfile.teamId` points to a team.
- `Evaluation.memberId` points to a member profile.
- `Goal.ownerType` and `Goal.ownerId` point to either a member profile or a team.
- `Feedback.memberId` points to the target member and `fromUserId` points to a seeded user.
- `OneToOneNote.managerId` points to a manager user and `memberId` points to a member profile.
