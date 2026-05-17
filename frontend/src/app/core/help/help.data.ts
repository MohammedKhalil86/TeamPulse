export type LearnerLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface HelpFeatureRef {
  labId: string;
  name: string;
  minLevel: LearnerLevel;
  pageNote: string;
}

export interface HelpCodeSnippet {
  label: string;
  code: string;
  minLevel: LearnerLevel;
}

export interface PageHelpEntry {
  routePrefix: string | string[];
  pageTitle: string;
  businessOverview: string;
  userActions: string[];
  angularFeatures: HelpFeatureRef[];
  primeNgComponents: string[];
  relatedLabIds: string[];
  diagram: string;
  codeSnippets: HelpCodeSnippet[];
}

export const PAGE_HELP_ENTRIES: PageHelpEntry[] = [
  {
    routePrefix: '/dashboard',
    pageTitle: 'Dashboard',
    businessOverview:
      'The Dashboard adapts to the current role. Managers see a whole-workspace view: team health scores, high-risk members, goal completion, and recent feedback. Team members see their personal profile, evaluation trend, own goals, and recent feedback directed at them.',
    userActions: [
      'View team health and overall risk signals (Manager)',
      'Click through to a specific team or member profile (Manager)',
      'Track personal evaluation scores and goal progress (Team Member)',
      'Read recent feedback assigned to you (Team Member)',
      'Switch theme or log out from the topbar'
    ],
    angularFeatures: [
      { labId: 'signals', name: 'Signals', minLevel: 'Beginner', pageNote: 'Loaded teams, members, evaluations, and goals are stored in `signal<T[]>([])` fields. Setting the signal triggers re-rendering.' },
      { labId: 'services', name: 'Services', minLevel: 'Beginner', pageNote: '`DashboardApiService` isolates the HTTP calls so the component does not call `HttpClient` directly.' },
      { labId: 'component-inputs', name: 'Component Inputs', minLevel: 'Beginner', pageNote: '`StatCardComponent` receives `label`, `value`, and optional `icon` via `@Input()` bindings.' },
      { labId: 'reusable-components', name: 'Reusable Components', minLevel: 'Beginner', pageNote: 'Stat cards, section cards, score badges, and risk badges all come from `shared/components` and are reused with no copy-paste.' },
      { labId: 'computed-state', name: 'Computed State', minLevel: 'Intermediate', pageNote: 'Averages, risk counts, and goal completion ratios are `computed()` values derived from the loaded data signals — they update automatically.' },
      { labId: 'role-based-ui', name: 'Role-based UI', minLevel: 'Intermediate', pageNote: '`isManager()` is a `computed()` that reads the session role. The template uses `@if (isManager())` to switch between manager and member dashboard sections.' },
      { labId: 'http-client', name: 'HttpClient', minLevel: 'Intermediate', pageNote: 'The component calls `forkJoin([teams$, members$, evaluations$, goals$, feedback$])` to load all dashboard data in parallel and update signals when all calls complete.' },
      { labId: 'error-handling', name: 'Error Handling', minLevel: 'Advanced', pageNote: 'The `error` callback in the subscribe ensures `loading.set(false)` fires even when the API fails, so the spinner never gets stuck.' }
    ],
    primeNgComponents: ['ProgressBar', 'Tag', 'Chart', 'Button', 'Card'],
    relatedLabIds: ['signals', 'computed-state', 'role-based-ui', 'http-client', 'services', 'reusable-components'],
    diagram: `Login → AuthGuard → read session role
  ↓
  Manager path                 Member path
  ─────────────────────────    ─────────────────────────
  forkJoin([teams, members,    forkJoin([ownProfile,
  evals, goals, feedback])      goals, feedback, evals])
  ↓                            ↓
  signal updates               signal updates
  ↓                            ↓
  computed summaries            computed summaries
  ↓                            ↓
  template (stat cards,        template (profile card,
  charts, risk table)          progress bars, feed)`,
    codeSnippets: [
      {
        label: 'Signal for loaded teams list',
        code: `protected readonly teams = signal<Team[]>([]);

ngOnInit() {
  this.dashboardApi.getManagerDashboard().subscribe({
    next: (data) => this.teams.set(data.teams),
    error: () => this.loading.set(false)
  });
}`,
        minLevel: 'Beginner'
      },
      {
        label: 'Computed high-risk count from signals',
        code: `protected readonly highRiskCount = computed(
  () => this.members().filter(m => m.riskLevel === 'High').length
);`,
        minLevel: 'Intermediate'
      },
      {
        label: 'Role check with computed()',
        code: `private readonly auth = inject(AuthService);
protected readonly isManager = computed(
  () => this.auth.currentUser()?.appRole === 'Manager'
);`,
        minLevel: 'Intermediate'
      }
    ]
  },

  {
    routePrefix: '/teams',
    pageTitle: 'Teams',
    businessOverview:
      'The Teams page lists all squads with their health scores, member counts, risk distribution, and goal progress. Managers can add, edit, and delete teams via a dialog form. Team members get a read-only squad comparison view.',
    userActions: [
      'Search teams by name',
      'Filter by department',
      'Open a team detail page',
      'Add, edit, or delete a team (Manager only)'
    ],
    angularFeatures: [
      { labId: 'signals', name: 'Signals', minLevel: 'Beginner', pageNote: '`teams`, `loading`, `dialogVisible`, and `editingTeam` are all `signal()` fields that drive the template state.' },
      { labId: 'component-outputs', name: 'Component Outputs', minLevel: 'Beginner', pageNote: 'The page header emits an `(action)` event when the Add button is clicked; the page catches it and calls `openCreateDialog()`.' },
      { labId: 'reactive-forms', name: 'Reactive Forms', minLevel: 'Intermediate', pageNote: 'The create/edit dialog holds a `FormGroup` built with `FormBuilder.nonNullable.group({...})`. Binding uses `[formGroup]` and `formControlName`.' },
      { labId: 'validators', name: 'Validators', minLevel: 'Intermediate', pageNote: 'Team name uses `Validators.required`. Member count uses `Validators.min(1)` and `Validators.max(200)`. The Save button is disabled when `teamForm.invalid`.' },
      { labId: 'computed-state', name: 'Computed State', minLevel: 'Intermediate', pageNote: '`filteredTeams` is a `computed()` that applies the active search text and department filter to the loaded `teams` signal.' },
      { labId: 'role-based-ui', name: 'Role-based UI', minLevel: 'Intermediate', pageNote: 'Add, edit, and delete buttons are wrapped in `@if (isManager())` so team members see the table without maintenance controls.' },
      { labId: 'http-client', name: 'HttpClient', minLevel: 'Intermediate', pageNote: '`TeamsApiService` calls `GET /api/teams`, `POST /api/teams`, `PUT /api/teams/:id`, and `DELETE /api/teams/:id` using injected `HttpClient`.' }
    ],
    primeNgComponents: ['Table', 'Dialog', 'Select', 'InputText', 'InputNumber', 'Textarea', 'Button', 'Tag', 'Toast'],
    relatedLabIds: ['signals', 'reactive-forms', 'validators', 'computed-state', 'role-based-ui', 'http-client'],
    diagram: `TeamsApiService.getTeams()
  → signal(teams[])
  → computed filteredTeams (name search + dept filter)
  → p-table rows

Manager only:
  "Add Team" → openCreateDialog()
    → FormGroup (name, dept, size)
    → Validators.required, min/max
    → Save → POST /api/teams → teams signal update`,
    codeSnippets: [
      {
        label: 'Filtered teams with computed()',
        code: `protected readonly filteredTeams = computed(() => {
  const term = this.search().toLowerCase();
  return this.teams().filter(t =>
    !term || t.name.toLowerCase().includes(term)
  );
});`,
        minLevel: 'Intermediate'
      },
      {
        label: 'Reactive form for create/edit',
        code: `this.teamForm = this.fb.nonNullable.group({
  name: ['', Validators.required],
  department: ['', Validators.required],
  memberCount: [5, [Validators.min(1), Validators.max(200)]]
});`,
        minLevel: 'Intermediate'
      }
    ]
  },

  {
    routePrefix: ['/teams/'],
    pageTitle: 'Team Detail',
    businessOverview:
      'Team Detail brings together the full picture for one squad: health overview, member roster with scores, active goals, feedback summary, and risk highlights. Useful for a manager preparing a 1:1 or sprint retrospective.',
    userActions: [
      'Review team health score and risk distribution',
      'Browse team members with scores and risk levels',
      'Check active goals and completion progress',
      'Read recent team feedback'
    ],
    angularFeatures: [
      { labId: 'routing', name: 'Routing', minLevel: 'Beginner', pageNote: 'The `teamId` parameter comes from the URL `/teams/:id`. The component reads it from the activated route snapshot.' },
      { labId: 'signals', name: 'Signals', minLevel: 'Beginner', pageNote: 'Separate signals hold the team record, member list, goals, and feedback so each section updates independently.' },
      { labId: 'reusable-components', name: 'Reusable Components', minLevel: 'Beginner', pageNote: 'Score badges and risk badges from `shared/components` are reused in the member rows and the team header.' },
      { labId: 'computed-state', name: 'Computed State', minLevel: 'Intermediate', pageNote: 'Goal completion percentage and average health score are `computed()` values derived from the signals without touching the API again.' },
      { labId: 'http-client', name: 'HttpClient', minLevel: 'Intermediate', pageNote: 'On init the component calls multiple API services in parallel to load the team, members, goals, and feedback for the one team ID.' }
    ],
    primeNgComponents: ['Table', 'ProgressBar', 'Tag', 'Button', 'Card'],
    relatedLabIds: ['routing', 'signals', 'computed-state', 'http-client', 'reusable-components'],
    diagram: `Route /teams/:id
  → teamId → parallel API calls
    ├─ TeamsApiService.getTeam(id)
    ├─ MembersApiService.getTeamMembers(id)
    ├─ GoalsApiService.getTeamGoals(id)
    └─ FeedbackApiService.getTeamFeedback(id)
  → signals: team, members, goals, feedback
  → computed: healthAvg, goalCompletionPct
  → section cards: overview | members | goals | feedback`,
    codeSnippets: [
      {
        label: 'Multiple signals for aggregated page data',
        code: `protected readonly team = signal<Team | null>(null);
protected readonly members = signal<Member[]>([]);
protected readonly goals = signal<Goal[]>([]);
protected readonly feedback = signal<Feedback[]>([]);`,
        minLevel: 'Beginner'
      },
      {
        label: 'Computed goal completion percentage',
        code: `protected readonly goalCompletionPct = computed(() => {
  const goals = this.goals();
  if (!goals.length) return 0;
  const done = goals.filter(g => g.status === 'Completed').length;
  return Math.round((done / goals.length) * 100);
});`,
        minLevel: 'Intermediate'
      }
    ]
  },

  {
    routePrefix: '/members',
    pageTitle: 'Members',
    businessOverview:
      'The Members page is a searchable, filterable directory of all engineers in the workspace. Managers maintain member profiles; team members can browse the directory but cannot make changes.',
    userActions: [
      'Search members by name',
      'Filter by team, risk level, or seniority',
      'Sort and paginate the member table',
      'Open a member profile',
      'Add, edit, or delete a member (Manager only)'
    ],
    angularFeatures: [
      { labId: 'signals', name: 'Signals', minLevel: 'Beginner', pageNote: '`members`, `loading`, `dialogVisible`, and filter state are all `signal()` fields.' },
      { labId: 'reactive-forms', name: 'Reactive Forms', minLevel: 'Intermediate', pageNote: 'The add/edit member dialog uses a typed `FormGroup` with `FormBuilder`. The form is reset or patched when the dialog opens.' },
      { labId: 'validators', name: 'Validators', minLevel: 'Intermediate', pageNote: 'Required name, valid email format, and score range checks are applied with `Validators.required`, `Validators.email`, and `Validators.min/max`.' },
      { labId: 'computed-state', name: 'Computed State', minLevel: 'Intermediate', pageNote: '`filteredMembers` is a `computed()` that chains search text, team filter, risk level filter, and seniority filter together.' },
      { labId: 'role-based-ui', name: 'Role-based UI', minLevel: 'Intermediate', pageNote: 'Add, edit, and delete actions are hidden from team members. The table header differs per role.' },
      { labId: 'http-client', name: 'HttpClient', minLevel: 'Intermediate', pageNote: '`MembersApiService` and `UsersApiService` are both injected to load member profiles and user display names.' },
      { labId: 'directives', name: 'Directives', minLevel: 'Advanced', pageNote: '`[tpRiskHighlight]="member.riskLevel"` is a custom attribute directive that adds a background color class to table rows based on risk level.' }
    ],
    primeNgComponents: ['Table', 'Dialog', 'Select', 'InputText', 'InputNumber', 'Button', 'Tag', 'Toast'],
    relatedLabIds: ['signals', 'reactive-forms', 'validators', 'computed-state', 'role-based-ui', 'http-client', 'directives'],
    diagram: `MembersApiService.getMembers()
  → signal(members[])
  → computed filteredMembers:
      search text filter
      → team filter
      → risk filter
      → seniority filter
  → p-table [paginator]="true" [rows]="10"
  → [tpRiskHighlight] directive on rows (Advanced)`,
    codeSnippets: [
      {
        label: 'Chained computed filter',
        code: `protected readonly filteredMembers = computed(() => {
  const term = this.search().toLowerCase();
  return this.members().filter(m => {
    const matchesName = !term || m.name.toLowerCase().includes(term);
    const matchesTeam = !this.teamFilter() || m.teamId === this.teamFilter();
    const matchesRisk = !this.riskFilter() || m.riskLevel === this.riskFilter();
    return matchesName && matchesTeam && matchesRisk;
  });
});`,
        minLevel: 'Intermediate'
      },
      {
        label: 'Custom risk-highlight directive on a table row',
        code: `<tr [tpRiskHighlight]="member.riskLevel">
  <td>{{ member.name }}</td>
</tr>`,
        minLevel: 'Advanced'
      }
    ]
  },

  {
    routePrefix: ['/members/'],
    pageTitle: 'Member Profile',
    businessOverview:
      'Member Profile is the deep view for one engineer. It shows skill scores, evaluation history, goals, feedback, and a manager section for 1:1 notes. Managers can also edit the profile and add notes here.',
    userActions: [
      'Review skill scores and risk level',
      'Read evaluation history with scores and comments',
      'Track the member\'s goals and progress',
      'Read feedback about this member',
      'Add or edit 1:1 notes (Manager only)',
      'Edit member profile data (Manager only)'
    ],
    angularFeatures: [
      { labId: 'routing', name: 'Routing', minLevel: 'Beginner', pageNote: 'The `memberId` parameter is read from the URL `/members/:id` via the activated route.' },
      { labId: 'signals', name: 'Signals', minLevel: 'Beginner', pageNote: 'Each data section (member, evaluations, goals, feedback, notes) has its own `signal()` field that updates independently.' },
      { labId: 'reusable-components', name: 'Reusable Components', minLevel: 'Beginner', pageNote: 'Score badges and risk badges are reused directly from `shared/components`. The section card structures all data panels consistently.' },
      { labId: 'computed-state', name: 'Computed State', minLevel: 'Intermediate', pageNote: 'Average scores across evaluations, skill group summaries, and the high-risk flag are all `computed()` values.' },
      { labId: 'http-client', name: 'HttpClient', minLevel: 'Intermediate', pageNote: 'Multiple API services load the member profile, evaluations, goals, feedback, and notes on route activation.' },
      { labId: 'reactive-forms', name: 'Reactive Forms', minLevel: 'Intermediate', pageNote: 'The manager 1:1 notes form and the edit-member dialog both use `FormGroup` with reactive bindings.' },
      { labId: 'role-based-ui', name: 'Role-based UI', minLevel: 'Intermediate', pageNote: 'The notes section and edit actions are rendered only for the Manager role. Team members see a stripped-down read-only view.' }
    ],
    primeNgComponents: ['Table', 'Dialog', 'Textarea', 'ProgressBar', 'Tag', 'Button', 'Toast'],
    relatedLabIds: ['routing', 'signals', 'computed-state', 'http-client', 'reactive-forms', 'role-based-ui'],
    diagram: `Route /members/:id
  → memberId
  → parallel calls:
    ├─ getmember(id)       → member signal
    ├─ getEvaluations(id)  → evaluations signal
    ├─ getGoals(id)        → goals signal
    ├─ getFeedback(id)     → feedback signal
    └─ getNotes(id)        → notes signal (manager only)
  → computed: avgScore, skillGroups, highRisk
  → tabs: Overview | Evaluations | Goals | Feedback | Notes (manager)`,
    codeSnippets: [
      {
        label: 'Reading route param on init',
        code: `readonly memberId = input<string>('');
// or via ActivatedRoute:
const id = this.route.snapshot.paramMap.get('id');`,
        minLevel: 'Beginner'
      },
      {
        label: 'Computed average score across evaluations',
        code: `protected readonly avgScore = computed(() => {
  const evals = this.evaluations();
  if (!evals.length) return 0;
  const total = evals.reduce((s, e) => s + e.technicalScore, 0);
  return Math.round(total / evals.length);
});`,
        minLevel: 'Intermediate'
      }
    ]
  },

  {
    routePrefix: '/evaluations',
    pageTitle: 'Evaluations',
    businessOverview:
      'Evaluations capture structured performance reviews with technical, communication, and collaboration scores plus a written comment. Managers maintain the full evaluation list and can create/edit/delete records. Team members see only their own evaluations.',
    userActions: [
      'View all evaluations (Manager)',
      'Create, edit, or delete an evaluation (Manager)',
      'View own evaluation history (Team Member)',
      'Read scores and reviewer comments'
    ],
    angularFeatures: [
      { labId: 'signals', name: 'Signals', minLevel: 'Beginner', pageNote: '`evaluations`, `loading`, `dialogVisible`, and `selectedEvaluation` are `signal()` fields. The template responds automatically when they change.' },
      { labId: 'reactive-forms', name: 'Reactive Forms', minLevel: 'Intermediate', pageNote: 'The create/edit dialog uses a `FormGroup` with score controls bound to PrimeNG `p-slider` and `p-inputnumber` components.' },
      { labId: 'validators', name: 'Validators', minLevel: 'Intermediate', pageNote: 'Score fields use `Validators.min(0)` and `Validators.max(100)`. The comment field uses `Validators.required`.' },
      { labId: 'role-based-ui', name: 'Role-based UI', minLevel: 'Intermediate', pageNote: 'Managers see all evaluations and the Add button. Team members see only their own records without write controls.' },
      { labId: 'error-handling', name: 'Error Handling', minLevel: 'Intermediate', pageNote: '`MessageService` from PrimeNG shows a toast on save/delete success or API error so the user knows the action outcome.' }
    ],
    primeNgComponents: ['Table', 'Dialog', 'Select', 'Slider', 'InputNumber', 'Textarea', 'Button', 'Tag', 'Toast'],
    relatedLabIds: ['signals', 'reactive-forms', 'validators', 'role-based-ui', 'error-handling'],
    diagram: `Role = Manager
  → GET /api/evaluations (all)
  → Table with Add / Edit / Delete controls
  → Dialog: FormGroup (technicalScore, commScore, collabScore, comment)
    → Validators.min(0), max(100), required
    → POST or PUT → signal update → toast

Role = Team Member
  → GET /api/evaluations?memberId=X (own only)
  → Read-only table, no write controls`,
    codeSnippets: [
      {
        label: 'Evaluation form with score validators',
        code: `this.evalForm = this.fb.nonNullable.group({
  technicalScore:      [80, [Validators.required, Validators.min(0), Validators.max(100)]],
  communicationScore:  [75, [Validators.required, Validators.min(0), Validators.max(100)]],
  comment:             ['', Validators.required]
});`,
        minLevel: 'Intermediate'
      },
      {
        label: 'Toast on save/error',
        code: `this.evalApi.createEvaluation(payload).subscribe({
  next: () => {
    this.load();
    this.messageService.add({ severity: 'success', summary: 'Saved' });
  },
  error: () => this.messageService.add({ severity: 'error', summary: 'Save failed' })
});`,
        minLevel: 'Intermediate'
      }
    ]
  },

  {
    routePrefix: '/feedback',
    pageTitle: 'Feedback',
    businessOverview:
      'Feedback captures recognition, improvement suggestions, risk signals, and general coaching notes across the workspace. Managers see and manage all feedback. Team members see their own feedback and their team\'s recognition.',
    userActions: [
      'Filter feedback by type, member, date range, or text',
      'Read feedback cards and table view',
      'Add a new feedback record (Manager)',
      'Delete a feedback record (Manager)'
    ],
    angularFeatures: [
      { labId: 'signals', name: 'Signals', minLevel: 'Beginner', pageNote: '`feedback`, `loading`, and all filter state signals drive the template without manual change detection.' },
      { labId: 'pipes', name: 'Pipes', minLevel: 'Beginner', pageNote: 'The `friendlyDate` pipe formats ISO timestamps to readable relative dates like "3 days ago" throughout the feedback cards.' },
      { labId: 'computed-state', name: 'Computed State', minLevel: 'Intermediate', pageNote: '`filteredFeedback` is a `computed()` that chains type, member, date, and text filters across the loaded `feedback` signal.' },
      { labId: 'role-based-ui', name: 'Role-based UI', minLevel: 'Intermediate', pageNote: 'Managers see all feedback with delete and add controls. Team members see only their own feedback plus team-wide recognition records.' },
      { labId: 'reactive-forms', name: 'Reactive Forms', minLevel: 'Intermediate', pageNote: 'The add feedback dialog uses `FormGroup` with a `p-select` for type, a `p-datepicker` for date, and a required comment textarea.' }
    ],
    primeNgComponents: ['Card', 'Table', 'Dialog', 'Select', 'DatePicker', 'Textarea', 'Button', 'Tag', 'Toast'],
    relatedLabIds: ['signals', 'computed-state', 'role-based-ui', 'reactive-forms', 'pipes'],
    diagram: `FeedbackApiService.getFeedback()
  → signal(feedback[])
  → computed filteredFeedback:
      typeFilter   (Recognition / Improvement / Risk / General)
      memberFilter (specific user)
      dateFilter   (start date)
      textSearch   (comment text)
  → p-card grid + p-table
  {{ item.createdAt | friendlyDate }}   ← pipe in action`,
    codeSnippets: [
      {
        label: 'Multi-filter computed feedback list',
        code: `protected readonly filteredFeedback = computed(() =>
  this.feedback().filter(f => {
    const matchesType   = !this.typeFilter()   || f.type === this.typeFilter();
    const matchesMember = !this.memberFilter() || f.memberId === this.memberFilter();
    const matchesText   = !this.textSearch()   || f.comment.toLowerCase()
                            .includes(this.textSearch().toLowerCase());
    return matchesType && matchesMember && matchesText;
  })
);`,
        minLevel: 'Intermediate'
      },
      {
        label: 'FriendlyDate pipe usage',
        code: `<!-- template -->
{{ feedback.createdAt | friendlyDate }}

// pipe implementation (shared/pipes/friendly-date.pipe.ts)
transform(value: string): string {
  const diff = Date.now() - new Date(value).getTime();
  const days = Math.floor(diff / 86_400_000);
  return days === 0 ? 'Today' : \`\${days} day\${days > 1 ? 's' : ''} ago\`;
}`,
        minLevel: 'Beginner'
      }
    ]
  },

  {
    routePrefix: '/goals',
    pageTitle: 'Goals',
    businessOverview:
      'Goals track objectives at team and individual level with status, progress percentage, and due dates. Managers maintain the full goal list. Team members track their own goals and see a personal progress summary.',
    userActions: [
      'Filter goals by status, owner, or search text',
      'Read goal progress bars',
      'Add, edit, or delete a goal (Manager)',
      'View own goals and mark progress (Team Member)'
    ],
    angularFeatures: [
      { labId: 'signals', name: 'Signals', minLevel: 'Beginner', pageNote: 'Goals list, filter state, and dialog visibility are all `signal()` fields that keep the template in sync.' },
      { labId: 'reactive-forms', name: 'Reactive Forms', minLevel: 'Intermediate', pageNote: 'The create/edit dialog uses a `FormGroup` with title, description, due date, owner, status, and progress fields.' },
      { labId: 'validators', name: 'Validators', minLevel: 'Intermediate', pageNote: 'Title and status are required. Progress uses `Validators.min(0)` and `Validators.max(100)`.' },
      { labId: 'computed-state', name: 'Computed State', minLevel: 'Intermediate', pageNote: '`filteredGoals` chains owner, status, and search filters. `completedCount` and `avgProgress` are derived from the filtered list.' },
      { labId: 'role-based-ui', name: 'Role-based UI', minLevel: 'Intermediate', pageNote: 'Managers see team-wide goals with add/edit/delete. Team members see their own goals subset with a personal summary header.' }
    ],
    primeNgComponents: ['Table', 'Dialog', 'Select', 'DatePicker', 'InputNumber', 'ProgressBar', 'Tag', 'Button', 'Toast'],
    relatedLabIds: ['signals', 'reactive-forms', 'validators', 'computed-state', 'role-based-ui'],
    diagram: `GoalsApiService.getGoals()
  → signal(goals[])
  → computed filteredGoals:
      ownerFilter (member or team)
      statusFilter (In Progress / Completed / Not Started)
      searchText
  → p-table rows
  → p-progressbar [value]="goal.progress"
  → computed completedCount, avgProgress for summary row`,
    codeSnippets: [
      {
        label: 'Goals form group with validators',
        code: `this.goalForm = this.fb.nonNullable.group({
  title:    ['', Validators.required],
  status:   ['In Progress', Validators.required],
  dueDate:  [''],
  progress: [0, [Validators.min(0), Validators.max(100)]]
});`,
        minLevel: 'Intermediate'
      },
      {
        label: 'Computed average progress',
        code: `protected readonly avgProgress = computed(() => {
  const goals = this.filteredGoals();
  if (!goals.length) return 0;
  return Math.round(goals.reduce((s, g) => s + g.progress, 0) / goals.length);
});`,
        minLevel: 'Intermediate'
      }
    ]
  },

  {
    routePrefix: '/how-teampulse-works',
    pageTitle: 'How TeamPulse Works',
    businessOverview:
      'This guide explains how to read TeamPulse signals and take action. Managers see a guide for interpreting team health, running evaluations, and responding to risk signals. Team members see a personal guide for goals, feedback, and evaluation scores.',
    userActions: [
      'Read the role-specific guide',
      'Navigate to relevant business pages via guide links'
    ],
    angularFeatures: [
      { labId: 'routing', name: 'Routing', minLevel: 'Beginner', pageNote: 'This is a lazy-loaded child route (`/how-teampulse-works`) inside the authenticated shell. It loads only when first visited.' },
      { labId: 'signals', name: 'Signals', minLevel: 'Beginner', pageNote: 'The component reads the current user role from `AuthService` which stores the session in a `signal()`.' },
      { labId: 'route-guards', name: 'Route Guards', minLevel: 'Intermediate', pageNote: 'Both `authGuard` and `roleGuard` protect this route. `roleGuard` accepts `[Manager, TeamMember]` — any authenticated user can access the guide.' },
      { labId: 'computed-state', name: 'Computed State', minLevel: 'Intermediate', pageNote: 'Guide card content and which sections are visible are driven by `computed()` values that read the role signal.' },
      { labId: 'role-based-ui', name: 'Role-based UI', minLevel: 'Intermediate', pageNote: 'The template has two main branches: `@if (isManager())` renders the manager workflow; otherwise the team member workflow is shown.' }
    ],
    primeNgComponents: ['Button', 'Tag', 'Card'],
    relatedLabIds: ['routing', 'lazy-loading', 'route-guards', 'signals', 'computed-state', 'role-based-ui'],
    diagram: `Route /how-teampulse-works
  → authGuard (authenticated?)
  → roleGuard (Manager or TeamMember?)
  → inject AuthService → read role signal
  → computed isManager()
  → @if (isManager()) {
      Manager guide: health metrics, evaluations, risk actions
    } @else {
      Member guide: personal goals, feedback, own evaluations
    }`,
    codeSnippets: [
      {
        label: 'Lazy route with dual guards',
        code: `{
  path: 'how-teampulse-works',
  canActivate: [authGuard, roleGuard],
  data: { roles: ['Manager', 'TeamMember'] },
  loadComponent: () => import('./features/how-teampulse-works/...')
}`,
        minLevel: 'Intermediate'
      }
    ]
  },

  {
    routePrefix: ['/learning/angular'],
    pageTitle: 'Learning Lab — Angular',
    businessOverview:
      'The Angular explorer maps every TeamPulse page and feature to the Angular concept that powers it. Use the filters to narrow by week, difficulty, category, or status, then open a detail page for code snippets, diagrams, and links to live pages.',
    userActions: [
      'Search topics by name, page, or keyword',
      'Filter by week, difficulty, category, or status',
      'Open a topic detail card for code examples and links'
    ],
    angularFeatures: [
      { labId: 'signals', name: 'Signals', minLevel: 'Beginner', pageNote: 'Search text, week, difficulty, category, and status filters are all `signal()` fields that update as the user types or selects.' },
      { labId: 'computed-state', name: 'Computed State', minLevel: 'Intermediate', pageNote: '`filteredFeatures` is a `computed()` that evaluates all active filters in one pass over the static lab data array.' },
      { labId: 'routing', name: 'Routing', minLevel: 'Beginner', pageNote: 'Each topic card links to `/learning/angular/:featureId`. The detail page uses the `input()` signal API to receive the `featureId` route parameter.' },
      { labId: 'reusable-components', name: 'Reusable Components', minLevel: 'Beginner', pageNote: 'The page header and section card are both shared components used without any modification.' }
    ],
    primeNgComponents: ['Card', 'Select', 'Tag', 'Button', 'Tabs', 'Accordion', 'Table'],
    relatedLabIds: ['signals', 'computed-state', 'routing', 'lazy-loading', 'reusable-components'],
    diagram: `ANGULAR_LAB_FEATURES (static array)
  → search signal + 4 filter signals
  → computed filteredFeatures
  → @for card grid
  → routerLink /learning/angular/:featureId
    → AngularLabDetailPageComponent
      → input() featureId signal → findLabFeature(id)`,
    codeSnippets: [
      {
        label: 'Signal-driven filter pipeline',
        code: `protected readonly filteredFeatures = computed(() => {
  const term = this.search().trim().toLowerCase();
  return this.features.filter(f => {
    const matchesTerm     = !term || f.name.toLowerCase().includes(term);
    const matchesWeek     = !this.weekFilter()       || f.week === this.weekFilter();
    const matchesDiff     = !this.difficultyFilter() || f.difficulty === this.difficultyFilter();
    const matchesCategory = !this.categoryFilter()   || f.category === this.categoryFilter();
    const matchesStatus   = !this.statusFilter()     || f.status === this.statusFilter();
    return matchesTerm && matchesWeek && matchesDiff && matchesCategory && matchesStatus;
  });
});`,
        minLevel: 'Intermediate'
      }
    ]
  },

  {
    routePrefix: '/learning/mcp-servers',
    pageTitle: 'Learning Lab — MCP Servers',
    businessOverview:
      'This page explains five development-time Model Context Protocol servers that can assist when building or studying TeamPulse. MCPs run during an AI coding session only — they are not part of the TeamPulse runtime and TeamPulse users never interact with them.',
    userActions: [
      'Switch between MCP tabs (Angular CLI, PrimeNG, GitHub, Context7, Playwright)',
      'Expand common mistakes and safety notes',
      'Compare AI tool workflows (Claude Code, Codex, Copilot)'
    ],
    angularFeatures: [
      { labId: 'standalone-components', name: 'Standalone Components', minLevel: 'Beginner', pageNote: 'This is a self-contained standalone component with no shared state. All data lives in a static array inside the file.' },
      { labId: 'routing', name: 'Routing', minLevel: 'Beginner', pageNote: 'The route `/learning/mcp-servers` lazy-loads `McpServersPageComponent` only when the user first navigates here.' },
      { labId: 'lazy-loading', name: 'Lazy Loading', minLevel: 'Intermediate', pageNote: 'The Angular build creates a separate JS chunk for this page, so it does not add to the initial bundle.' }
    ],
    primeNgComponents: ['Tabs', 'TabList', 'TabPanel', 'Accordion', 'Panel', 'Tag'],
    relatedLabIds: ['standalone-components', 'routing', 'lazy-loading'],
    diagram: `Route /learning/mcp-servers
  → lazy chunk: mcp-servers-page-component
  → static MCP_ENTRIES array (no API, no signals)
  → @for tabs + tab panels
  → accordion: mistakes | safety | AI tools`,
    codeSnippets: [
      {
        label: 'Lazy-loaded component route',
        code: `{
  path: 'learning/mcp-servers',
  loadComponent: () => import('./features/learning/mcp-servers-page.component')
                    .then(m => m.McpServersPageComponent),
  title: 'Learning Lab - MCP Servers | TeamPulse'
}`,
        minLevel: 'Beginner'
      }
    ]
  },

  {
    routePrefix: '/learning/run-locally',
    pageTitle: 'Learning Lab - Run Locally',
    businessOverview:
      'The Run Locally guide covers everything needed to clone TeamPulse, run the ASP.NET Core Minimal API backend and Angular frontend together, understand the GitHub Pages static build, and troubleshoot common setup issues.',
    userActions: [
      'Follow the local setup steps',
      'Compare the Local API setup with the GitHub Pages setup',
      'Troubleshoot common setup problems'
    ],
    angularFeatures: [
      { labId: 'standalone-components', name: 'Standalone Components', minLevel: 'Beginner', pageNote: 'A self-contained standalone component with no services, no HTTP calls, and no state management needed for a static guide page.' },
      { labId: 'routing', name: 'Routing', minLevel: 'Beginner', pageNote: 'Lazy-loaded via `loadComponent` in `app.routes.ts`. The browser downloads this chunk only when the user visits the page.' },
      { labId: 'lazy-loading', name: 'Lazy Loading', minLevel: 'Intermediate', pageNote: 'The Angular build bundles this page into a separate chunk named `run-locally-page-component` visible in the build output.' }
    ],
    primeNgComponents: ['Tabs', 'TabList', 'TabPanel', 'Accordion', 'Panel', 'Tag'],
    relatedLabIds: ['standalone-components', 'routing', 'lazy-loading'],
    diagram: `Route /learning/run-locally
  -> lazy chunk: run-locally-page-component
  -> static content only (no API, no signals)
  -> tabs: Local Setup | GitHub Pages | Troubleshooting
  -> accordion in Troubleshooting tab`,
    codeSnippets: [
      {
        label: 'No signals needed for a static page',
        code: `// RunLocallyPageComponent has no signals, no OnInit,
// no injected services — just a template with tabs and accordions.
@Component({ standalone: true, imports: [TabsModule, AccordionModule, ...] })
export class RunLocallyPageComponent {}`,
        minLevel: 'Beginner'
      }
    ]
  }
];

export function findPageHelpEntry(url: string): PageHelpEntry | undefined {
  const path = url.split('?')[0];
  return PAGE_HELP_ENTRIES.find((entry) => {
    const prefixes = Array.isArray(entry.routePrefix) ? entry.routePrefix : [entry.routePrefix];
    return prefixes.some((prefix) => path === prefix || path.startsWith(prefix + '/') || path.startsWith(prefix));
  });
}

export const LEVEL_ORDER: Record<LearnerLevel, number> = {
  Beginner: 0,
  Intermediate: 1,
  Advanced: 2
};
