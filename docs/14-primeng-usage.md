# PrimeNG Usage

PrimeNG is the main component library for TeamPulse. The app customizes PrimeNG visually through the TeamPulse theme and uses PrimeIcons for iconography.

## Components Used

| PrimeNG Component | Used In |
| --- | --- |
| Button | Login, shell, all action pages |
| Card | Dashboard, Feedback, Learning Lab |
| Dialog | Teams, Members, Evaluations, Feedback, Goals, Floating Help |
| Table/DataTable | Teams, Members, Evaluations, Goals, detail sections |
| Select/Dropdown | Login, filters, forms |
| InputText/Password/Textarea | Login and CRUD forms |
| Slider/InputNumber | Evaluation scores and numeric form fields |
| DatePicker | Feedback and Goals filters/forms |
| Tag | Risk, status, type, role, lab difficulty |
| ProgressBar | Dashboard and Goals |
| Chart | Dashboard charts backed by Chart.js |
| Tabs | Learning Lab Angular details and member-style sections where useful |
| Accordion | Learning Lab Angular detail supporting content |
| Panel | Learning Lab Angular details |
| Toast | Save/delete feedback on form-heavy pages |
| Skeleton/Spinner patterns | Loading state component |

## PrimeNG MCP — Development Assistance Only

A PrimeNG MCP server may be available in some AI coding environments. If available, it was used during development as a coding assistant for PrimeNG-heavy work such as tables, dialogs, charts, forms, and theming.

**PrimeNG MCP is development-time tooling only.**

- It is not a runtime dependency.
- It is not bundled in the Angular app.
- It does not run at app startup or during user sessions.
- TeamPulse has no AI runtime feature of any kind.
- There is no AI summary generation, no in-app AI assistant, and no AI-generated content at runtime.

The finished app is a standard Angular + ASP.NET Core application for the Local API setup, with a GitHub Pages setup that serves the Angular frontend statically from shared seed data. No AI service is called at runtime.
