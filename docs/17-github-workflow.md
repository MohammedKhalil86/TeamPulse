# GitHub Workflow

TeamPulse can be initialized as a normal Git repository from the project root.

## Initialize

```bash
git init
git add .
git commit -m "Initialize TeamPulse workshop foundation"
```

## Connect Remote

```bash
git remote add origin https://github.com/<owner>/<repo>.git
git branch -M main
git push -u origin main
```

## Branch Guidance

Use short feature branches for workshop phases:

```bash
git checkout -b feature/dashboard
git checkout -b feature/teams-members
git checkout -b docs/traceability
```

## Suggested Commit Messages

- `Create TeamPulse solution foundation`
- `Implement Minimal API seeded backend`
- `Implement Angular core architecture`
- `Add shared UI design system`
- `Implement dashboard feature`
- `Implement teams and members features`
- `Implement evaluations feedback and goals`
- `Implement Angular Lab`
- `Harden workshop documentation`

## Pull Request Notes

Each PR should mention:

- Pages or APIs changed.
- Docs updated.
- Build commands run.
- Any intentional TODOs.
