export type LabDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface AngularLabFeature {
  id: string;
  name: string;
  explanation: string;
  difficulty: LabDifficulty;
  pages: string[];
  pageLinks: Array<{ label: string; route: string }>;
  whyTeamPulseUsesIt: string;
  components: string[];
  snippet: string;
  diagram: string;
  primeNgComponents: string[];
}

export const ANGULAR_LAB_FEATURES: AngularLabFeature[] = [
  {
    id: 'standalone-components',
    name: 'Standalone Components',
    explanation: 'Components declare their own imports instead of relying on NgModules.',
    difficulty: 'Beginner',
    pages: ['All routed pages', 'Shared UI components'],
    pageLinks: [{ label: 'Dashboard', route: '/dashboard' }],
    whyTeamPulseUsesIt: 'Every page and shared widget is standalone so workshop attendees can see dependencies directly.',
    components: ['DashboardPageComponent', 'TeamsPageComponent', 'StatCardComponent'],
    snippet: "@Component({ standalone: true, imports: [ButtonModule, SectionCardComponent] })",
    diagram: 'Route -> Standalone Page -> Shared Standalone Components',
    primeNgComponents: ['Button', 'Table', 'Dialog', 'Tag']
  },
  {
    id: 'routing',
    name: 'Routing',
    explanation: 'Angular Router maps URLs to pages and detail routes.',
    difficulty: 'Beginner',
    pages: ['Dashboard', 'Teams', 'Members', 'Angular Lab'],
    pageLinks: [
      { label: 'Teams', route: '/teams' },
      { label: 'Members', route: '/members' }
    ],
    whyTeamPulseUsesIt: 'The app uses feature routes for business pages and parameterized routes for detail pages.',
    components: ['app.routes.ts', 'TeamDetailPageComponent', 'MemberDetailPageComponent'],
    snippet: "{ path: 'members/:id', loadComponent: () => import('./features/members/member-detail-page.component') }",
    diagram: '/members -> list page\n/members/:id -> member profile',
    primeNgComponents: ['Button']
  },
  {
    id: 'lazy-loading',
    name: 'Lazy Loading',
    explanation: 'Feature pages are loaded only when a route needs them.',
    difficulty: 'Intermediate',
    pages: ['All feature routes'],
    pageLinks: [{ label: 'Angular Lab', route: '/angular-lab' }],
    whyTeamPulseUsesIt: 'Workshop pages stay separated and route chunks stay focused.',
    components: ['app.routes.ts'],
    snippet: "loadComponent: () => import('./features/goals/goals-page.component').then((m) => m.GoalsPageComponent)",
    diagram: 'Router request -> dynamic import -> feature component',
    primeNgComponents: []
  },
  {
    id: 'route-guards',
    name: 'Route Guards',
    explanation: 'Guards decide if a user can activate a route.',
    difficulty: 'Intermediate',
    pages: ['Authenticated app shell'],
    pageLinks: [{ label: 'Dashboard', route: '/dashboard' }],
    whyTeamPulseUsesIt: 'Anonymous users are redirected to login before reaching business pages.',
    components: ['auth.guard.ts', 'role.guard.ts'],
    snippet: "return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });",
    diagram: 'Route request -> AuthGuard -> allow or redirect',
    primeNgComponents: []
  },
  {
    id: 'role-based-ui',
    name: 'Role-based UI',
    explanation: 'The UI changes based on the fake Manager or TeamMember session.',
    difficulty: 'Intermediate',
    pages: ['Dashboard', 'Teams', 'Members', 'Evaluations', 'Feedback', 'Goals'],
    pageLinks: [
      { label: 'Dashboard', route: '/dashboard' },
      { label: 'Evaluations', route: '/evaluations' }
    ],
    whyTeamPulseUsesIt: 'Managers can maintain data, while team members get scoped read-only views.',
    components: ['AuthService', 'AppLayoutComponent', 'DashboardPageComponent'],
    snippet: "@if (isManager()) { <button pButton label=\"Add Goal\" /> }",
    diagram: 'Fake session role -> computed isManager -> conditional actions',
    primeNgComponents: ['Button', 'Tag']
  },
  {
    id: 'services',
    name: 'Services',
    explanation: 'Services isolate state, API calls, storage, and theme behavior.',
    difficulty: 'Beginner',
    pages: ['All data pages'],
    pageLinks: [{ label: 'Goals', route: '/goals' }],
    whyTeamPulseUsesIt: 'Pages stay focused on UI while services handle API and session behavior.',
    components: ['AuthService', 'TeamsApiService', 'ThemeService'],
    snippet: "private readonly teamsApi = inject(TeamsApiService);",
    diagram: 'Component -> Service -> Minimal API',
    primeNgComponents: []
  },
  {
    id: 'dependency-injection',
    name: 'Dependency Injection',
    explanation: 'Angular provides services and tokens where components need them.',
    difficulty: 'Beginner',
    pages: ['All feature pages'],
    pageLinks: [{ label: 'Members', route: '/members' }],
    whyTeamPulseUsesIt: 'Components inject API services, AuthService, Router, and form builders.',
    components: ['DashboardPageComponent', 'AuthService'],
    snippet: "private readonly http = inject(HttpClient);",
    diagram: 'Injector -> Service instance -> Component',
    primeNgComponents: []
  },
  {
    id: 'http-client',
    name: 'HttpClient',
    explanation: 'HttpClient calls the ASP.NET Core Minimal API.',
    difficulty: 'Intermediate',
    pages: ['Dashboard', 'Teams', 'Members', 'Evaluations', 'Feedback', 'Goals'],
    pageLinks: [{ label: 'Teams', route: '/teams' }],
    whyTeamPulseUsesIt: 'All business data comes from seeded API endpoints, not Angular in-memory data.',
    components: ['DashboardApiService', 'MembersApiService', 'GoalsApiService'],
    snippet: "return this.http.get<Team[]>(`${this.apiBaseUrl}/teams`);",
    diagram: 'Page -> ApiService -> HttpClient -> /api endpoint',
    primeNgComponents: []
  },
  {
    id: 'interceptors',
    name: 'Interceptors',
    explanation: 'Interceptors observe or transform HTTP requests globally.',
    difficulty: 'Intermediate',
    pages: ['Authenticated shell'],
    pageLinks: [{ label: 'Dashboard', route: '/dashboard' }],
    whyTeamPulseUsesIt: 'The loading interceptor tracks active HTTP requests for the topbar loading indicator.',
    components: ['http-loading.interceptor.ts', 'LoadingService'],
    snippet: "return next(request).pipe(finalize(() => loading.stop()));",
    diagram: 'Http request -> interceptor -> API -> response -> loading stop',
    primeNgComponents: []
  },
  {
    id: 'signals',
    name: 'Signals',
    explanation: 'Signals hold reactive local state.',
    difficulty: 'Intermediate',
    pages: ['Dashboard', 'Teams', 'Members', 'Goals'],
    pageLinks: [{ label: 'Dashboard', route: '/dashboard' }],
    whyTeamPulseUsesIt: 'Pages use signals for loaded data, dialog visibility, filters, and loading state.',
    components: ['DashboardPageComponent', 'TeamsPageComponent'],
    snippet: "protected readonly teams = signal<Team[]>([]);",
    diagram: 'API result -> signal update -> template refresh',
    primeNgComponents: []
  },
  {
    id: 'computed-state',
    name: 'Computed State',
    explanation: 'Computed values derive read-only state from signals.',
    difficulty: 'Intermediate',
    pages: ['Dashboard', 'Teams', 'Members', 'Goals'],
    pageLinks: [{ label: 'Goals', route: '/goals' }],
    whyTeamPulseUsesIt: 'Filters, averages, progress summaries, and role checks are derived instead of duplicated.',
    components: ['DashboardPageComponent', 'GoalsPageComponent'],
    snippet: "protected readonly filteredGoals = computed(() => this.visibleGoals().filter(...));",
    diagram: 'Signals -> computed summary -> template',
    primeNgComponents: []
  },
  {
    id: 'reactive-forms',
    name: 'Reactive Forms',
    explanation: 'Reactive Forms model form state in TypeScript.',
    difficulty: 'Intermediate',
    pages: ['Login', 'Teams', 'Members', 'Evaluations', 'Feedback', 'Goals'],
    pageLinks: [
      { label: 'Teams', route: '/teams' },
      { label: 'Goals', route: '/goals' }
    ],
    whyTeamPulseUsesIt: 'Create/edit dialogs use typed form groups and validators.',
    components: ['TeamsPageComponent', 'EvaluationsPageComponent'],
    snippet: "this.fb.nonNullable.group({ name: ['', Validators.required] });",
    diagram: 'FormGroup -> PrimeNG controls -> submit -> API service',
    primeNgComponents: ['Dialog', 'Select', 'InputNumber', 'Textarea', 'DatePicker']
  },
  {
    id: 'validators',
    name: 'Validators',
    explanation: 'Validators enforce required fields and score ranges before submit.',
    difficulty: 'Beginner',
    pages: ['Teams', 'Members', 'Evaluations', 'Feedback', 'Goals'],
    pageLinks: [{ label: 'Evaluations', route: '/evaluations' }],
    whyTeamPulseUsesIt: 'Workshop forms prevent empty titles, comments, and invalid score ranges.',
    components: ['EvaluationsPageComponent', 'GoalsPageComponent'],
    snippet: "technicalScore: [80, [Validators.required, Validators.min(0), Validators.max(100)]]",
    diagram: 'Input -> validator -> valid form -> save enabled',
    primeNgComponents: ['InputNumber', 'Textarea']
  },
  {
    id: 'pipes',
    name: 'Pipes',
    explanation: 'Pipes format values for templates.',
    difficulty: 'Beginner',
    pages: ['Dashboard', 'Teams', 'Members', 'Feedback', 'Goals'],
    pageLinks: [{ label: 'Feedback', route: '/feedback' }],
    whyTeamPulseUsesIt: 'Friendly dates and score/risk labels keep templates readable.',
    components: ['friendly-date.pipe.ts', 'score-label.pipe.ts', 'risk-label.pipe.ts'],
    snippet: "{{ item.createdAt | friendlyDate }}",
    diagram: 'Raw value -> pipe -> readable UI text',
    primeNgComponents: ['Tag']
  },
  {
    id: 'directives',
    name: 'Directives',
    explanation: 'Directives add behavior or styling to existing elements.',
    difficulty: 'Intermediate',
    pages: ['Members', 'Evaluations'],
    pageLinks: [{ label: 'Members', route: '/members' }],
    whyTeamPulseUsesIt: 'Score and risk highlight directives mark rows and cells based on data.',
    components: ['score-highlight.directive.ts', 'risk-highlight.directive.ts'],
    snippet: "<tr [tpRiskHighlight]=\"member.riskLevel\">",
    diagram: 'Element + directive input -> CSS classes',
    primeNgComponents: ['Table']
  },
  {
    id: 'component-inputs',
    name: 'Component Inputs',
    explanation: 'Inputs pass data from parent components to child components.',
    difficulty: 'Beginner',
    pages: ['All feature pages'],
    pageLinks: [{ label: 'Dashboard', route: '/dashboard' }],
    whyTeamPulseUsesIt: 'Shared UI components receive labels, values, scores, risks, and help content.',
    components: ['StatCardComponent', 'PageHeaderComponent', 'FloatingHelpComponent'],
    snippet: "<tp-stat-card label=\"Goals\" [value]=\"filteredGoals().length\" />",
    diagram: 'Parent data -> @Input -> shared component',
    primeNgComponents: []
  },
  {
    id: 'component-outputs',
    name: 'Component Outputs',
    explanation: 'Outputs emit events from a child component to a parent component.',
    difficulty: 'Beginner',
    pages: ['Teams', 'Dashboard'],
    pageLinks: [{ label: 'Teams', route: '/teams' }],
    whyTeamPulseUsesIt: 'Page headers and empty states emit action clicks without knowing page logic.',
    components: ['PageHeaderComponent', 'EmptyStateComponent'],
    snippet: "<tp-page-header actionLabel=\"Add Team\" (action)=\"openCreateDialog()\" />",
    diagram: 'Button click -> @Output action -> parent method',
    primeNgComponents: ['Button']
  },
  {
    id: 'reusable-components',
    name: 'Reusable Components',
    explanation: 'Reusable components keep repeated UI patterns consistent.',
    difficulty: 'Beginner',
    pages: ['All business pages'],
    pageLinks: [{ label: 'Dashboard', route: '/dashboard' }],
    whyTeamPulseUsesIt: 'Cards, badges, page headers, loading states, and help dialogs share one visual language.',
    components: ['page-header', 'stat-card', 'score-badge', 'risk-badge', 'section-card'],
    snippet: "<tp-section-card title=\"Goals\"><ng-content /></tp-section-card>",
    diagram: 'Shared component -> reused across feature pages',
    primeNgComponents: ['Card', 'Tag', 'ProgressBar']
  },
  {
    id: 'primeng-components',
    name: 'PrimeNG Components',
    explanation: 'PrimeNG provides business UI controls used throughout TeamPulse.',
    difficulty: 'Beginner',
    pages: ['All business pages'],
    pageLinks: [{ label: 'Members', route: '/members' }],
    whyTeamPulseUsesIt: 'The workshop practices real SaaS UI patterns with tables, dialogs, forms, charts, tags, and toasts.',
    components: ['TeamsPageComponent', 'GoalsPageComponent', 'DashboardPageComponent'],
    snippet: "<p-table [value]=\"members()\" [paginator]=\"true\" [rows]=\"10\">",
    diagram: 'PrimeNG module import -> component template -> styled business UI',
    primeNgComponents: ['Table', 'Dialog', 'Select', 'Chart', 'Toast', 'Tag']
  },
  {
    id: 'theming',
    name: 'Theming',
    explanation: 'Theme tokens define colors, shadows, radii, and motion.',
    difficulty: 'Intermediate',
    pages: ['Whole app'],
    pageLinks: [{ label: 'Dashboard', route: '/dashboard' }],
    whyTeamPulseUsesIt: 'The Neo-Brutalism-inspired style stays consistent through CSS variables.',
    components: ['_theme.scss', 'styles.scss'],
    snippet: "--tp-shadow-md: 7px 7px 0 var(--tp-ink);",
    diagram: 'CSS token -> shared component style -> app-wide theme',
    primeNgComponents: ['Button', 'Card', 'Dialog']
  },
  {
    id: 'dark-light-mode',
    name: 'Dark/Light Mode',
    explanation: 'The app toggles between light and dark token sets.',
    difficulty: 'Intermediate',
    pages: ['Whole app'],
    pageLinks: [{ label: 'Dashboard', route: '/dashboard' }],
    whyTeamPulseUsesIt: 'The app shell persists the selected theme and PrimeNG uses the configured dark selector.',
    components: ['ThemeService', 'AppLayoutComponent'],
    snippet: "document.documentElement.classList.toggle('app-dark', theme === 'dark');",
    diagram: 'Theme toggle -> localStorage -> .app-dark -> CSS tokens',
    primeNgComponents: ['Button']
  },
  {
    id: 'angular-animations',
    name: 'Angular Animations',
    explanation: 'Angular animations add route/page motion.',
    difficulty: 'Intermediate',
    pages: ['Authenticated shell'],
    pageLinks: [{ label: 'Teams', route: '/teams' }],
    whyTeamPulseUsesIt: 'Route transitions make the app feel active without distracting from workshop learning.',
    components: ['route-transition.animation.ts', 'AppLayoutComponent'],
    snippet: "animations: [routeTransition]",
    diagram: 'Route change -> trigger -> subtle entrance motion',
    primeNgComponents: []
  },
  {
    id: 'localstorage',
    name: 'LocalStorage',
    explanation: 'LocalStorage persists fake session and theme preference.',
    difficulty: 'Beginner',
    pages: ['Login', 'App shell'],
    pageLinks: [{ label: 'Login', route: '/login' }],
    whyTeamPulseUsesIt: 'Fake auth remains local-first and simple for the workshop.',
    components: ['StorageService', 'AuthService', 'ThemeService'],
    snippet: "this.storage.set(SESSION_KEY, session);",
    diagram: 'Login response -> StorageService -> browser localStorage',
    primeNgComponents: []
  },
  {
    id: 'error-handling',
    name: 'Error Handling',
    explanation: 'Pages handle failed login and display action feedback with toasts.',
    difficulty: 'Intermediate',
    pages: ['Login', 'Evaluations', 'Feedback', 'Goals'],
    pageLinks: [{ label: 'Evaluations', route: '/evaluations' }],
    whyTeamPulseUsesIt: 'Workshop pages show practical feedback without adding a heavy error framework.',
    components: ['LoginPageComponent', 'MessageService'],
    snippet: "error: () => this.error.set('Login failed. Use one of the seeded demo users.')",
    diagram: 'API action -> success/error path -> user feedback',
    primeNgComponents: ['Toast']
  },
  {
    id: 'loading-states',
    name: 'Loading States',
    explanation: 'Loading states communicate that API data is being fetched.',
    difficulty: 'Beginner',
    pages: ['All API-backed pages'],
    pageLinks: [{ label: 'Members', route: '/members' }],
    whyTeamPulseUsesIt: 'The app uses a global loading interceptor and shared loading-state component.',
    components: ['LoadingService', 'LoadingStateComponent'],
    snippet: "@if (loading()) { <tp-loading-state variant=\"skeleton\" /> }",
    diagram: 'HTTP request -> loading signal -> skeleton or topbar indicator',
    primeNgComponents: ['Skeleton', 'ProgressSpinner']
  }
];

export function findLabFeature(id: string | null): AngularLabFeature | undefined {
  return ANGULAR_LAB_FEATURES.find((feature) => feature.id === id);
}
