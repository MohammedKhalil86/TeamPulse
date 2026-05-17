export type LabDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type LabStatus = 'Implemented' | 'Partially implemented' | 'Conceptual' | 'Future extension';

export interface AngularLabFeature {
  id: string;
  name: string;
  explanation: string;
  difficulty: LabDifficulty;
  week: number;
  category: string;
  status: LabStatus;
  statusNotes?: string;
  codeWalkthroughIds: string[];
  pages: string[];
  pageLinks: Array<{ label: string; route: string }>;
  whyTeamPulseUsesIt: string;
  components: string[];
  snippet: string;
  diagram: string;
  primeNgComponents: string[];
}

type AngularLabFeatureInput = Omit<AngularLabFeature, 'week' | 'category' | 'status' | 'statusNotes' | 'codeWalkthroughIds'> &
  Partial<Pick<AngularLabFeature, 'week' | 'category' | 'status' | 'statusNotes' | 'codeWalkthroughIds'>>;

const ANGULAR_FEATURE_METADATA: Record<string, Partial<Pick<AngularLabFeature, 'week' | 'category' | 'status' | 'statusNotes' | 'codeWalkthroughIds'>>> = {
  'standalone-components': { week: 1, category: 'Components', status: 'Implemented', codeWalkthroughIds: ['shared-ui'] },
  routing: { week: 1, category: 'Routing', status: 'Implemented', codeWalkthroughIds: ['app-routes'] },
  'lazy-loading': { week: 2, category: 'Routing', status: 'Implemented', codeWalkthroughIds: ['lazy-routes'] },
  'route-guards': { week: 2, category: 'Routing', status: 'Implemented', codeWalkthroughIds: ['auth-guards'] },
  'role-based-ui': { week: 2, category: 'State and roles', status: 'Implemented', codeWalkthroughIds: ['role-ui'] },
  services: { week: 2, category: 'Services and data', status: 'Implemented', codeWalkthroughIds: ['api-services'] },
  'dependency-injection': { week: 2, category: 'Services and data', status: 'Implemented', codeWalkthroughIds: ['di'] },
  'http-client': { week: 3, category: 'Services and data', status: 'Implemented', codeWalkthroughIds: ['http-client'] },
  interceptors: { week: 3, category: 'Services and data', status: 'Implemented', codeWalkthroughIds: ['loading-interceptor'] },
  signals: { week: 3, category: 'State and roles', status: 'Implemented', codeWalkthroughIds: ['signals'] },
  'computed-state': { week: 3, category: 'State and roles', status: 'Implemented', codeWalkthroughIds: ['computed-state'] },
  'reactive-forms': { week: 4, category: 'Forms', status: 'Implemented', codeWalkthroughIds: ['reactive-forms'] },
  validators: { week: 4, category: 'Forms', status: 'Implemented', codeWalkthroughIds: ['validators'] },
  pipes: { week: 4, category: 'Templates', status: 'Implemented', codeWalkthroughIds: ['pipes'] },
  directives: { week: 4, category: 'Templates', status: 'Implemented', codeWalkthroughIds: ['directives'] },
  'component-inputs': { week: 1, category: 'Components', status: 'Implemented', codeWalkthroughIds: ['component-inputs'] },
  'component-outputs': { week: 1, category: 'Components', status: 'Implemented', codeWalkthroughIds: ['component-outputs'] },
  'reusable-components': { week: 1, category: 'Components', status: 'Implemented', codeWalkthroughIds: ['reusable-components'] },
  'primeng-components': { week: 4, category: 'UI library', status: 'Implemented', codeWalkthroughIds: ['primeng'] },
  theming: { week: 5, category: 'UI and styling', status: 'Implemented', codeWalkthroughIds: ['theming'] },
  'dark-light-mode': { week: 5, category: 'UI and styling', status: 'Implemented', codeWalkthroughIds: ['theming'] },
  'angular-animations': { week: 5, category: 'UI and styling', status: 'Implemented', codeWalkthroughIds: ['animations'] },
  localstorage: { week: 5, category: 'Browser platform', status: 'Implemented', codeWalkthroughIds: ['local-storage'] },
  'error-handling': { week: 5, category: 'Application quality', status: 'Implemented', codeWalkthroughIds: ['error-handling'] },
  'loading-states': { week: 5, category: 'Application quality', status: 'Implemented', codeWalkthroughIds: ['loading-states'] }
};

function normalizeLearningRoute(route: string): string {
  if (route === '/angular-lab') {
    return '/learning/angular';
  }

  if (route.startsWith('/angular-lab/')) {
    return route.replace('/angular-lab/', '/learning/angular/');
  }

  return route;
}

function normalizeFeature(feature: AngularLabFeatureInput): AngularLabFeature {
  const metadata = ANGULAR_FEATURE_METADATA[feature.id] ?? {};

  return {
    ...feature,
    pageLinks: feature.pageLinks.map((link) => ({ ...link, route: normalizeLearningRoute(link.route) })),
    week: feature.week ?? metadata.week ?? 1,
    category: feature.category ?? metadata.category ?? 'Angular fundamentals',
    status: feature.status ?? metadata.status ?? 'Implemented',
    statusNotes: feature.statusNotes ?? metadata.statusNotes,
    codeWalkthroughIds: feature.codeWalkthroughIds ?? metadata.codeWalkthroughIds ?? []
  };
}

const EXISTING_ANGULAR_LAB_FEATURES: AngularLabFeatureInput[] = [
  {
    id: 'standalone-components',
    name: 'Standalone Components',
    explanation: 'Components declare their own imports instead of relying on NgModules.',
    difficulty: 'Beginner',
    pages: ['All routed pages', 'Shared UI components'],
    pageLinks: [{ label: 'Dashboard', route: '/dashboard' }],
    whyTeamPulseUsesIt: 'Every page and shared widget is standalone so learners can see dependencies directly.',
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
    pages: ['Dashboard', 'Teams', 'Members', 'Learning Lab'],
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
    pageLinks: [{ label: 'Angular learning', route: '/learning/angular' }],
    whyTeamPulseUsesIt: 'Feature pages stay separated and route chunks stay focused.',
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
    explanation: 'The UI changes based on the sample Manager or TeamMember session.',
    difficulty: 'Intermediate',
    pages: ['Dashboard', 'Teams', 'Members', 'Evaluations', 'Feedback', 'Goals'],
    pageLinks: [
      { label: 'Dashboard', route: '/dashboard' },
      { label: 'Evaluations', route: '/evaluations' }
    ],
    whyTeamPulseUsesIt: 'Managers can maintain data, while team members get scoped read-only views.',
    components: ['AuthService', 'AppLayoutComponent', 'DashboardPageComponent'],
    snippet: "@if (isManager()) { <button pButton label=\"Add Goal\" /> }",
    diagram: 'Sample session role -> computed isManager -> conditional actions',
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
    whyTeamPulseUsesIt: 'TeamPulse forms prevent empty titles, comments, and invalid score ranges.',
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
    whyTeamPulseUsesIt: 'TeamPulse demonstrates real SaaS UI patterns with tables, dialogs, forms, charts, tags, and toasts.',
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
    whyTeamPulseUsesIt: 'Route transitions make the app feel active without distracting from the product flow.',
    components: ['route-transition.animation.ts', 'AppLayoutComponent'],
    snippet: "animations: [routeTransition]",
    diagram: 'Route change -> trigger -> subtle entrance motion',
    primeNgComponents: []
  },
  {
    id: 'localstorage',
    name: 'LocalStorage',
    explanation: 'LocalStorage persists sample session and theme preference.',
    difficulty: 'Beginner',
    pages: ['Login', 'App shell'],
    pageLinks: [{ label: 'Login', route: '/login' }],
    whyTeamPulseUsesIt: 'Sample auth remains local-first and simple for learning.',
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
    whyTeamPulseUsesIt: 'TeamPulse pages show practical feedback without adding a heavy error framework.',
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

const ROADMAP_ANGULAR_FEATURES: AngularLabFeatureInput[] = [
  {
    id: 'angular-cli',
    name: 'Angular CLI',
    explanation: 'The Angular CLI creates, serves, builds, and configures Angular projects.',
    difficulty: 'Beginner',
    week: 1,
    category: 'Tooling',
    status: 'Partially implemented',
    statusNotes: 'TeamPulse already uses Angular CLI commands; a deeper walkthrough will be added later.',
    codeWalkthroughIds: ['npm-scripts', 'lazy-routes'],
    pages: ['Learning Lab', 'Project setup'],
    pageLinks: [{ label: 'Angular learning', route: '/learning/angular' }],
    whyTeamPulseUsesIt: 'The project is built and served through Angular CLI scripts so learners use the same tooling they will use in real projects.',
    components: ['angular.json', 'package.json'],
    snippet: 'npm run start\nnpm run build',
    diagram: 'Command -> Angular CLI -> dev server or production build',
    primeNgComponents: []
  },
  {
    id: 'npm-npx',
    name: 'npm / npx',
    explanation: 'npm installs and runs package scripts; npx executes package binaries when needed.',
    difficulty: 'Beginner',
    week: 1,
    category: 'Tooling',
    status: 'Partially implemented',
    statusNotes: 'TeamPulse uses npm scripts; package-management teaching notes will be expanded later.',
    codeWalkthroughIds: ['npm-scripts'],
    pages: ['Project setup'],
    pageLinks: [{ label: 'Angular learning', route: '/learning/angular' }],
    whyTeamPulseUsesIt: 'Learners run the frontend through package scripts without changing package versions during guided steps.',
    components: ['package.json', 'package-lock.json'],
    snippet: 'npm run build',
    diagram: 'npm script -> local Angular CLI binary -> build output',
    primeNgComponents: []
  },
  {
    id: 'project-structure',
    name: 'Project Structure',
    explanation: 'Angular projects are organized by features, core services, shared UI, styles, and environment configuration.',
    difficulty: 'Beginner',
    week: 1,
    category: 'Architecture',
    status: 'Implemented',
    statusNotes: 'The TeamPulse frontend already follows a feature/core/shared structure.',
    codeWalkthroughIds: ['lazy-routes', 'api-services', 'shared-ui'],
    pages: ['Whole app'],
    pageLinks: [{ label: 'Dashboard', route: '/dashboard' }],
    whyTeamPulseUsesIt: 'The structure keeps business features separate while sharing auth, API, storage, layout, and visual components.',
    components: ['core', 'features', 'shared', 'styles'],
    snippet: 'src/app/core\nsrc/app/features\nsrc/app/shared',
    diagram: 'core services + shared UI -> feature pages',
    primeNgComponents: []
  },
  {
    id: 'typescript-essentials',
    name: 'TypeScript Essentials',
    explanation: 'Types, interfaces, unions, and typed function signatures make Angular code safer and easier to navigate.',
    difficulty: 'Beginner',
    week: 1,
    category: 'TypeScript',
    status: 'Implemented',
    statusNotes: 'TeamPulse models and feature components already use typed entities and unions.',
    codeWalkthroughIds: ['typescript-models'],
    pages: ['All feature pages'],
    pageLinks: [{ label: 'Members', route: '/members' }],
    whyTeamPulseUsesIt: 'Shared TeamPulse models keep API services, forms, and templates aligned.',
    components: ['team-pulse.models.ts', 'Feature components'],
    snippet: "export type AppRole = 'Manager' | 'TeamMember';",
    diagram: 'Model type -> service response -> component state -> template',
    primeNgComponents: []
  },
  {
    id: 'templates',
    name: 'Templates',
    explanation: 'Templates bind component state to HTML, Angular control flow, and child components.',
    difficulty: 'Beginner',
    week: 2,
    category: 'Templates',
    status: 'Implemented',
    codeWalkthroughIds: ['templates'],
    pages: ['All feature pages'],
    pageLinks: [{ label: 'Goals', route: '/goals' }],
    whyTeamPulseUsesIt: 'The app uses template control flow to show loading, empty, role-aware, and data-driven states.',
    components: ['DashboardPageComponent', 'GoalsPageComponent'],
    snippet: '@if (loading()) { <tp-loading-state /> } @else { ... }',
    diagram: 'Component state -> template control flow -> visible UI',
    primeNgComponents: ['Button', 'Table', 'Tag']
  },
  {
    id: 'bindings',
    name: 'Bindings',
    explanation: 'Property, event, class, and attribute bindings connect template markup to component state and actions.',
    difficulty: 'Beginner',
    week: 2,
    category: 'Templates',
    status: 'Implemented',
    codeWalkthroughIds: ['bindings', 'validators'],
    pages: ['All feature pages'],
    pageLinks: [{ label: 'Teams', route: '/teams' }],
    whyTeamPulseUsesIt: 'Bindings drive filters, form controls, buttons, aria labels, theme buttons, and route links.',
    components: ['AppLayoutComponent', 'Feature pages'],
    snippet: '[routerLink]="item.route" (click)="toggleSidebar()"',
    diagram: 'Template binding -> component property or method',
    primeNgComponents: ['Button', 'Select']
  },
  {
    id: 'change-detection',
    name: 'Change Detection',
    explanation: 'Change detection updates rendered views when state changes.',
    difficulty: 'Intermediate',
    week: 3,
    category: 'State and roles',
    status: 'Partially implemented',
    statusNotes: 'TeamPulse uses zoneless change detection and signals; a focused lesson will be added later.',
    codeWalkthroughIds: ['app-config', 'signals', 'computed-state'],
    pages: ['Whole app'],
    pageLinks: [{ label: 'Dashboard', route: '/dashboard' }],
    whyTeamPulseUsesIt: 'Signals and computed values keep UI updates explicit as filters, loaded data, theme, and session state change.',
    components: ['app.config.ts', 'Feature pages'],
    snippet: 'provideZonelessChangeDetection()',
    diagram: 'Signal update -> dependency tracking -> template refresh',
    primeNgComponents: []
  },
  {
    id: 'rxjs',
    name: 'RxJS',
    explanation: 'RxJS represents asynchronous streams and operators for HTTP workflows.',
    difficulty: 'Intermediate',
    week: 3,
    category: 'Services and data',
    status: 'Implemented',
    statusNotes: 'TeamPulse uses Observable-based HTTP services and operators for loading flows.',
    codeWalkthroughIds: ['rxjs', 'static-seed-data', 'loading-interceptor'],
    pages: ['Dashboard', 'Members', 'Details'],
    pageLinks: [{ label: 'Dashboard', route: '/dashboard' }],
    whyTeamPulseUsesIt: 'HTTP services return Observables, and detail pages combine multiple requests where needed.',
    components: ['DashboardPageComponent', 'MemberDetailPageComponent', 'API services'],
    snippet: 'forkJoin({ member, evaluations, goals, feedback })',
    diagram: 'Observable request(s) -> subscription -> signal update',
    primeNgComponents: []
  },
  {
    id: 'deployment',
    name: 'Deployment',
    explanation: 'Deployment prepares the Angular app for static hosting with the correct base path and built assets.',
    difficulty: 'Intermediate',
    week: 6,
    category: 'Deployment',
    status: 'Partially implemented',
    statusNotes: 'GitHub Pages build preparation exists; deeper publishing guidance belongs in the Run Locally and deployment lessons.',
    codeWalkthroughIds: ['deployment', 'npm-scripts'],
    pages: ['Build output'],
    pageLinks: [{ label: 'Angular learning', route: '/learning/angular' }],
    whyTeamPulseUsesIt: 'The app can be built for a repository path while preserving local development.',
    components: ['angular.json', 'package.json', 'scripts/create-github-pages-404.mjs'],
    snippet: 'npm run build:github-pages',
    diagram: 'Angular build -> dist output -> static host',
    primeNgComponents: []
  },
  {
    id: 'ngrx',
    name: 'NgRx',
    explanation: 'NgRx is a state management library for larger Angular applications.',
    difficulty: 'Advanced',
    week: 6,
    category: 'Future architecture',
    status: 'Future extension',
    statusNotes: 'TeamPulse currently uses services, signals, and computed state instead of NgRx.',
    codeWalkthroughIds: [],
    pages: ['Future extension'],
    pageLinks: [{ label: 'Angular learning', route: '/learning/angular' }],
    whyTeamPulseUsesIt: 'NgRx is useful to discuss as an option for larger state graphs, but it is not needed for the current app size.',
    components: [],
    snippet: 'No NgRx store is implemented in TeamPulse v2.',
    diagram: 'Action -> reducer/effect -> store -> selector',
    primeNgComponents: []
  },
  {
    id: 'graphql',
    name: 'GraphQL',
    explanation: 'GraphQL lets clients request shaped data from a graph-oriented API.',
    difficulty: 'Advanced',
    week: 6,
    category: 'Future architecture',
    status: 'Future extension',
    statusNotes: 'TeamPulse currently uses REST-style API services.',
    codeWalkthroughIds: [],
    pages: ['Future extension'],
    pageLinks: [{ label: 'Angular learning', route: '/learning/angular' }],
    whyTeamPulseUsesIt: 'GraphQL can be compared with REST later, but the current learner path keeps the API surface simple.',
    components: [],
    snippet: 'No GraphQL client is implemented in TeamPulse v2.',
    diagram: 'Component -> GraphQL query -> graph response',
    primeNgComponents: []
  },
  {
    id: 'ssr-ssg',
    name: 'SSR / SSG',
    explanation: 'Server-side rendering and static generation can improve first-load behavior and crawlability for some Angular apps.',
    difficulty: 'Advanced',
    week: 6,
    category: 'Future architecture',
    status: 'Future extension',
    statusNotes: 'TeamPulse currently uses a client-rendered Angular app.',
    codeWalkthroughIds: [],
    pages: ['Future extension'],
    pageLinks: [{ label: 'Angular learning', route: '/learning/angular' }],
    whyTeamPulseUsesIt: 'SSR and SSG are useful architectural options, but the current GitHub Pages path is static client rendering.',
    components: [],
    snippet: 'No Angular SSR server is implemented in TeamPulse v2.',
    diagram: 'Request -> server/static render -> hydrated Angular app',
    primeNgComponents: []
  },
  {
    id: 'angular-cli-vs-nx',
    name: 'Angular CLI vs Nx',
    explanation: 'Angular CLI is the standard Angular tooling path; Nx adds monorepo orchestration and advanced workspace tooling.',
    difficulty: 'Intermediate',
    week: 6,
    category: 'Tooling',
    status: 'Conceptual',
    statusNotes: 'TeamPulse uses Angular CLI only; Nx is included as a comparison topic.',
    codeWalkthroughIds: [],
    pages: ['Learning Lab'],
    pageLinks: [{ label: 'Angular learning', route: '/learning/angular' }],
    whyTeamPulseUsesIt: 'Learners should understand when standard Angular CLI is enough and when Nx may be useful.',
    components: ['angular.json', 'package.json'],
    snippet: 'TeamPulse is not an Nx workspace.',
    diagram: 'Angular CLI app vs Nx workspace',
    primeNgComponents: []
  }
];

export const ANGULAR_LAB_FEATURES: AngularLabFeature[] = [
  ...EXISTING_ANGULAR_LAB_FEATURES,
  ...ROADMAP_ANGULAR_FEATURES
].map(normalizeFeature);

export function findLabFeature(id: string | null): AngularLabFeature | undefined {
  return ANGULAR_LAB_FEATURES.find((feature) => feature.id === id);
}
