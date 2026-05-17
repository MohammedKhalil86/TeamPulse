export interface CodeWalkthrough {
  id: string;
  title: string;
  filePath: string;
  language: 'typescript' | 'csharp' | 'json' | 'scss' | 'html';
  featureIds: string[];
  code: string;
  highlightedLines?: number[];
}

export const CODE_WALKTHROUGHS: CodeWalkthrough[] = [
  {
    id: 'app-config',
    title: 'Application providers and router binding',
    filePath: 'frontend/src/app/app.config.ts',
    language: 'typescript',
    featureIds: ['change-detection', 'http-client', 'interceptors'],
    highlightedLines: [4, 5, 6, 7],
    code: `providers: [
  provideZonelessChangeDetection(),
  // Learning Lab: withComponentInputBinding()
  // Route parameters such as /learning/angular/:featureId can flow directly into input() properties.
  provideRouter(routes, withComponentInputBinding()),
  // Learning Lab: HttpClient + interceptors
  // withInterceptors() registers cross-cutting HTTP behavior without changing each API service.
  provideHttpClient(withFetch(), withInterceptors([httpLoadingInterceptor]))
]`
  },
  {
    id: 'lazy-routes',
    title: 'Lazy-loaded standalone route',
    filePath: 'frontend/src/app/app.routes.ts',
    language: 'typescript',
    featureIds: ['lazy-loading', 'standalone-components', 'angular-cli', 'project-structure'],
    highlightedLines: [3, 4],
    code: `{
  path: 'dashboard',
  // Learning Lab: Lazy loading
  // loadComponent() keeps each page in its own route chunk until the user navigates there.
  loadComponent: () =>
    import('./features/dashboard/pages/dashboard-page.component').then((m) => m.DashboardPageComponent),
  title: 'Dashboard | TeamPulse'
}`
  },
  {
    id: 'app-routes',
    title: 'Learning Lab routes and legacy redirects',
    filePath: 'frontend/src/app/app.routes.ts',
    language: 'typescript',
    featureIds: ['routing', 'deployment'],
    highlightedLines: [1, 6, 7, 8],
    code: `{ path: 'learning', pathMatch: 'full', redirectTo: '/learning/angular' },
{
  path: 'learning/angular/:featureId',
  loadComponent: () =>
    import('./features/angular-lab/angular-lab-detail-page.component').then((m) => m.AngularLabDetailPageComponent)
},
// Learning Lab: Redirect routes
// Old Angular Lab deep links stay valid after the Learning Lab route restructure.
{ path: 'angular-lab/:featureId', redirectTo: '/learning/angular/:featureId' }`
  },
  {
    id: 'auth-guards',
    title: 'Auth guard redirects with UrlTree',
    filePath: 'frontend/src/app/core/guards/auth.guard.ts',
    language: 'typescript',
    featureIds: ['route-guards', 'routing'],
    highlightedLines: [7, 8],
    code: `export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) {
    return true;
  }

  // Learning Lab: Route guards
  // Returning a UrlTree redirects without manually navigating inside the guard.
  return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};`
  },
  {
    id: 'role-ui',
    title: 'Role-aware dashboard switch',
    filePath: 'frontend/src/app/features/dashboard/pages/dashboard-page.component.ts',
    language: 'typescript',
    featureIds: ['role-based-ui', 'templates', 'bindings'],
    highlightedLines: [1, 4, 5],
    code: `@if (isManager()) {
  @if (managerDashboard(); as dashboard) {
    <tp-page-header eyebrow="Manager Dashboard" title="Engineering command center" />
  }
} @else {
  @if (memberDashboard(); as dashboard) {
    <tp-page-header eyebrow="Team Member Dashboard" [title]="'Welcome back, ' + dashboard.user.fullName" />
  }
}`
  },
  {
    id: 'api-services',
    title: 'Service hides API vs static data implementation',
    filePath: 'frontend/src/app/core/api/dashboard-api.service.ts',
    language: 'typescript',
    featureIds: ['services', 'local-api-setup', 'static-github-pages-data'],
    highlightedLines: [2, 8, 9],
    code: `@Injectable({ providedIn: 'root' })
export class DashboardApiService {
  // Learning Lab: HttpClient services
  // Feature pages depend on this service instead of constructing URLs or calling HttpClient directly.
  private readonly http = inject(HttpClient);

  getManagerDashboard(): Observable<ManagerDashboard> {
    if (this.dataMode === 'static') {
      return this.staticData.getManagerDashboard();
    }

    // Learning Lab: Local API setup
    // In local development this calls the ASP.NET Core Minimal API through HttpClient.
    return this.http.get<ManagerDashboard>(apiUrl);
  }
}`
  },
  {
    id: 'di',
    title: 'Dependency injection in a feature page',
    filePath: 'frontend/src/app/features/dashboard/pages/dashboard-page.component.ts',
    language: 'typescript',
    featureIds: ['dependency-injection'],
    highlightedLines: [1, 2, 3],
    code: `// Learning Lab: Dependency injection
// The page asks Angular for the services it needs instead of constructing them manually.
protected readonly auth = inject(AuthService);
private readonly dashboardApi = inject(DashboardApiService);
private readonly evaluationsApi = inject(EvaluationsApiService);
private readonly router = inject(Router);`
  },
  {
    id: 'http-client',
    title: 'Typed HttpClient call',
    filePath: 'frontend/src/app/core/api/dashboard-api.service.ts',
    language: 'typescript',
    featureIds: ['http-client', 'local-api-setup'],
    highlightedLines: [3, 4],
    code: `getMemberDashboard(userId: number): Observable<MemberDashboard> {
  if (this.dataMode === 'static') {
    return this.staticData.getMemberDashboard(userId);
  }

  return this.http.get<MemberDashboard>(apiUrl);
}`
  },
  {
    id: 'loading-interceptor',
    title: 'HTTP interceptor with finalize()',
    filePath: 'frontend/src/app/core/interceptors/http-loading.interceptor.ts',
    language: 'typescript',
    featureIds: ['interceptors', 'loading-states', 'error-handling'],
    highlightedLines: [5, 6],
    code: `export const httpLoadingInterceptor: HttpInterceptorFn = (request, next) => {
  const loading = inject(LoadingService);
  loading.start();

  // Learning Lab: Interceptors + finalize()
  // finalize() runs for success and error responses, so the global loading count cannot stay stuck.
  return next(request).pipe(finalize(() => loading.stop()));
};`
  },
  {
    id: 'signals',
    title: 'Signals store loaded dashboard state',
    filePath: 'frontend/src/app/features/dashboard/pages/dashboard-page.component.ts',
    language: 'typescript',
    featureIds: ['signals'],
    highlightedLines: [2, 3],
    code: `protected readonly loading = signal(true);
// Learning Lab: Signals
// Loaded API data lives in signals so the template and chart computed values update reactively.
protected readonly managerDashboard = signal<ManagerDashboard | null>(null);
protected readonly members = signal<MemberProfile[]>([]);
protected readonly goals = signal<Goal[]>([]);`
  },
  {
    id: 'computed-state',
    title: 'Computed dashboard percentage',
    filePath: 'frontend/src/app/features/dashboard/pages/dashboard-page.component.ts',
    language: 'typescript',
    featureIds: ['computed-state'],
    highlightedLines: [2, 3],
    code: `protected readonly evaluationCompletion = computed(() => {
  // Learning Lab: computed()
  // The percentage is derived from signals; it recalculates when dashboard or evaluations data changes.
  const memberCount = this.managerDashboard()?.memberCount ?? 0;
  return memberCount ? Math.round((this.evaluations().length / memberCount) * 100) : 0;
});`
  },
  {
    id: 'reactive-forms',
    title: 'Reactive login form model',
    filePath: 'frontend/src/app/features/login/login-page.component.ts',
    language: 'typescript',
    featureIds: ['reactive-forms', 'validators'],
    highlightedLines: [2, 3],
    code: `protected readonly form = this.fb.nonNullable.group({
  // Learning Lab: Reactive forms + validators
  // The form model owns validation; the template only binds controls and submit state.
  role: this.fb.nonNullable.control<AppRole>('Manager', Validators.required),
  email: ['', [Validators.required, Validators.email]],
  password: ['', Validators.required]
});`
  },
  {
    id: 'validators',
    title: 'Template uses reactive form validity',
    filePath: 'frontend/src/app/features/login/login-page.component.ts',
    language: 'html',
    featureIds: ['validators', 'template-bindings'],
    highlightedLines: [4],
    code: `<form [formGroup]="form" (ngSubmit)="login()">
  <input pInputText type="email" formControlName="email" autocomplete="username" />
  <p-password formControlName="password" [feedback]="false" [toggleMask]="true" />
  <button pButton type="submit" label="Login" [disabled]="form.invalid || busy()"></button>
</form>`
  },
  {
    id: 'pipes',
    title: 'Custom pipe keeps date formatting reusable',
    filePath: 'frontend/src/app/shared/pipes/friendly-date.pipe.ts',
    language: 'typescript',
    featureIds: ['pipes'],
    highlightedLines: [2, 3],
    code: `export class FriendlyDatePipe implements PipeTransform {
  // Learning Lab: Custom pipes
  // Pipes keep display formatting reusable and keep date math out of templates.
  transform(value: string | Date | null | undefined): string {
    if (!value) {
      return 'No date';
    }
  }
}`
  },
  {
    id: 'directives',
    title: 'Custom directive projects CSS classes',
    filePath: 'frontend/src/app/shared/directives/risk-highlight.directive.ts',
    language: 'typescript',
    featureIds: ['directives'],
    highlightedLines: [4, 5],
    code: `export class RiskHighlightDirective {
  @Input('tpRiskHighlight') risk: RiskLevel | string | null | undefined;

  // Learning Lab: Custom directives
  // HostBinding lets a directive project data-driven CSS classes onto the element that uses it.
  @HostBinding('class.tp-risk-high') get high(): boolean {
    return this.risk === 'High';
  }
}`
  },
  {
    id: 'component-inputs',
    title: 'input() receives a route parameter',
    filePath: 'frontend/src/app/features/angular-lab/angular-lab-detail-page.component.ts',
    language: 'typescript',
    featureIds: ['component-inputs', 'with-component-input-binding', 'route-params'],
    highlightedLines: [2, 3],
    code: `export class AngularLabDetailPageComponent {
  // Learning Lab: input() API + withComponentInputBinding()
  // The featureId route parameter is assigned to this signal input by the router.
  readonly featureId = input<string>('');
  protected readonly feature = computed(() => findLabFeature(this.featureId() || null));
}`
  },
  {
    id: 'component-outputs',
    title: 'Shared page header emits actions',
    filePath: 'frontend/src/app/shared/components/page-header/page-header.component.ts',
    language: 'typescript',
    featureIds: ['component-outputs'],
    highlightedLines: [5, 6],
    code: `export class PageHeaderComponent {
  @Input() actionLabel = '';
  @Input() actionIcon = 'pi pi-plus';
  // Learning Lab: Component outputs
  // The shared header emits a semantic action event while the page decides what it means.
  @Output() readonly action = new EventEmitter<void>();
}`
  },
  {
    id: 'shared-ui',
    title: 'Standalone shared component',
    filePath: 'frontend/src/app/shared/components/page-header/page-header.component.ts',
    language: 'typescript',
    featureIds: ['standalone-components', 'reusable-components', 'component-inputs'],
    highlightedLines: [2, 3, 8, 9],
    code: `@Component({
  selector: 'tp-page-header',
  standalone: true,
  imports: [ButtonModule],
  template: '<header>...</header>'
})
export class PageHeaderComponent {
  // Learning Lab: Component inputs
  // Parent pages configure the shared header without duplicating the header template.
  @Input({ required: true }) title = '';
}`
  },
  {
    id: 'reusable-components',
    title: 'Reusable dashboard card bindings',
    filePath: 'frontend/src/app/features/dashboard/pages/dashboard-page.component.ts',
    language: 'html',
    featureIds: ['reusable-components', 'bindings'],
    highlightedLines: [1, 2],
    code: `<tp-stat-card label="Total Teams" [value]="dashboard.teamCount" icon="pi pi-sitemap" trend="Active squads" />
<tp-stat-card label="Avg Health" [value]="dashboard.averageHealthScore" icon="pi pi-heart" trend="Team signal" />`
  },
  {
    id: 'primeng',
    title: 'PrimeNG chart component backed by computed data',
    filePath: 'frontend/src/app/features/dashboard/pages/dashboard-page.component.ts',
    language: 'typescript',
    featureIds: ['primeng-components', 'chartjs-primeng-charts'],
    highlightedLines: [2, 3],
    code: `<p-chart type="bar" [data]="teamHealthChart()" [options]="barChartOptions" />

// Learning Lab: PrimeNG charts + Chart.js
// PrimeNG renders the chart, while Chart.js types keep the data structure honest.
protected readonly teamHealthChart = computed<ChartData<'bar'>>(() => ({ labels, datasets }));`
  },
  {
    id: 'theming',
    title: 'Theme tokens and app-wide theme service',
    filePath: 'frontend/src/app/core/theme/theme.service.ts',
    language: 'typescript',
    featureIds: ['theming', 'dark-light-mode', 'theme-mode'],
    highlightedLines: [6, 7],
    code: `readonly isDark = computed(() => this.selectedTheme() === 'dark');

constructor() {
  // Learning Lab: effect()
  // Effects are for side effects: sync the theme signal to the DOM class and localStorage.
  effect(() => {
    const theme = this.selectedTheme();
    document.documentElement.classList.toggle('app-dark', theme === 'dark');
  });
}`
  },
  {
    id: 'animations',
    title: 'Reusable route transition animation',
    filePath: 'frontend/src/app/shared/animations/route-transition.animation.ts',
    language: 'typescript',
    featureIds: ['angular-animations'],
    highlightedLines: [1, 2],
    code: `// Learning Lab: Angular animations
// A reusable trigger gives routed pages a consistent entrance without each page owning animation code.
export const routeTransition = trigger('routeTransition', [
  transition('* <=> *', [
    style({ opacity: 0, transform: 'translateY(10px)' }),
    animate('180ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
  ])
]);`
  },
  {
    id: 'local-storage',
    title: 'Safe localStorage wrapper',
    filePath: 'frontend/src/app/core/storage/storage.service.ts',
    language: 'typescript',
    featureIds: ['localstorage'],
    highlightedLines: [6, 7],
    code: `try {
  return JSON.parse(value) as T;
} catch {
  // Learning Lab: localStorage
  // Bad browser storage should fail closed and clear itself instead of crashing every page load.
  localStorage.removeItem(key);
  return null;
}`
  },
  {
    id: 'static-seed-data',
    title: 'Static seed initialization for GitHub Pages',
    filePath: 'frontend/src/app/core/data/static-data-store.service.ts',
    language: 'typescript',
    featureIds: ['static-github-pages-data', 'shared-json-seed-data'],
    highlightedLines: [6, 7, 11, 12],
    code: `this.initialization$ ??= this.loadMetadata().pipe(
  switchMap((metadata) => {
    const currentVersion = this.storage.get<string>(SEED_VERSION_KEY);
    if (currentVersion === metadata.seedVersion && this.hasAllCollections()) {
      return of(undefined);
    }
    // Learning Lab: shared JSON seed data + static setup
    // GitHub Pages builds load the same seed JSON files as the backend, then persist them in namespaced localStorage keys.
    return this.loadSeedCollections();
  })
);

// Learning Lab: RxJS forkJoin()
// All seed files load in parallel; the store initializes only after every collection has arrived.`
  },
  {
    id: 'rxjs',
    title: 'forkJoin and switchMap in the dashboard',
    filePath: 'frontend/src/app/features/dashboard/pages/dashboard-page.component.ts',
    language: 'typescript',
    featureIds: ['rxjs'],
    highlightedLines: [2, 9],
    code: `if (this.isManager()) {
  // Learning Lab: RxJS forkJoin()
  // Manager dashboard data loads in parallel and updates signals once all requests complete.
  forkJoin({ dashboard, members, goals, evaluations }).subscribe(...);
} else if (user) {
  this.dashboardApi.getMemberDashboard(user.userId).pipe(
    switchMap((dashboard) => {
      // Learning Lab: RxJS switchMap()
      // The second request depends on the member profile returned by the first dashboard request.
      return this.evaluationsApi.getMemberEvaluations(dashboard.profile.id);
    })
  );
}`
  },
  {
    id: 'templates',
    title: 'Control flow templates',
    filePath: 'frontend/src/app/features/dashboard/pages/dashboard-page.component.ts',
    language: 'html',
    featureIds: ['templates', 'control-flow-templates'],
    highlightedLines: [1, 3, 5],
    code: `@if (loading()) {
  <tp-loading-state variant="skeleton" />
} @else {
  @if (isManager()) {
    <section class="dashboard manager-dashboard">...</section>
  } @else {
    <section class="dashboard member-dashboard">...</section>
  }
}`
  },
  {
    id: 'bindings',
    title: 'Property and event binding',
    filePath: 'frontend/src/app/features/login/login-page.component.ts',
    language: 'html',
    featureIds: ['bindings', 'event-binding', 'template-binding'],
    highlightedLines: [2, 3],
    code: `<button
  [icon]="theme.isDark() ? 'pi pi-sun' : 'pi pi-moon'"
  [attr.aria-label]="theme.isDark() ? 'Switch to light theme' : 'Switch to dark theme'"
  (click)="theme.toggle()"
></button>`
  },
  {
    id: 'typescript-models',
    title: 'TypeScript union models',
    filePath: 'frontend/src/app/core/models/team-pulse.models.ts',
    language: 'typescript',
    featureIds: ['typescript-essentials'],
    highlightedLines: [1, 2],
    code: `// Learning Lab: TypeScript essentials
// Union types model allowed business values and prevent accidental strings in forms, services, and templates.
export type AppRole = 'Manager' | 'TeamMember';
export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface User {
  id: number;
  appRole: AppRole;
  teamId: number | null;
}`
  },
  {
    id: 'npm-scripts',
    title: 'npm scripts run the Angular CLI',
    filePath: 'frontend/package.json',
    language: 'json',
    featureIds: ['npm-npx', 'angular-cli'],
    highlightedLines: [2, 3],
    code: `"scripts": {
  "start": "ng serve",
  "build": "ng build",
  "build:github-pages": "ng build --configuration github-pages && node scripts/create-github-pages-404.mjs"
}`
  },
  {
    id: 'deployment',
    title: 'GitHub Pages 404 fallback script',
    filePath: 'frontend/scripts/create-github-pages-404.mjs',
    language: 'typescript',
    featureIds: ['deployment'],
    highlightedLines: [1, 2],
    code: `// Learning Lab: Deployment
// GitHub Pages serves 404.html for deep links, so the script copies the Angular index fallback.
copyFileSync(indexPath, fallbackPath);
writeFileSync(nojekyllPath, '');`
  },
  {
    id: 'shared-seed-loader',
    title: 'Backend seed loader uses shared JSON',
    filePath: 'backend/TeamPulse.Api/Data/SeedDataLoader.cs',
    language: 'csharp',
    featureIds: ['shared-json-seed-data', 'local-api-setup'],
    highlightedLines: [4, 5],
    code: `public static TeamPulseSeed Load(string contentRootPath)
{
    var seedDataPath = FindSeedDataPath(contentRootPath);

    // Learning Lab: Shared JSON seed data
    // The backend and static Angular build read the same root shared/seed-data files.
    var seed = new TeamPulseSeed(
        LoadRequired<List<User>>(seedDataPath, "users.json"),
        LoadRequired<List<Team>>(seedDataPath, "teams.json"));
}`
  },
  {
    id: 'error-handling',
    title: 'Login error state',
    filePath: 'frontend/src/app/features/login/login-page.component.ts',
    language: 'typescript',
    featureIds: ['error-handling'],
    highlightedLines: [4, 5],
    code: `this.auth.login(credentials).subscribe({
  next: () => this.router.navigateByUrl(returnUrl),
  error: () => {
    this.error.set('Login failed. Check the sample credentials and try again.');
    this.busy.set(false);
  }
});`
  },
  {
    id: 'loading-states',
    title: 'Global loading state from request count',
    filePath: 'frontend/src/app/core/interceptors/loading.service.ts',
    language: 'typescript',
    featureIds: ['loading-states'],
    highlightedLines: [3, 4],
    code: `private readonly activeRequests = signal(0);
readonly activeRequestCount = this.activeRequests.asReadonly();
// Learning Lab: computed()
// The topbar only needs a boolean, derived from the request counter signal.
readonly isLoading = computed(() => this.activeRequests() > 0);`
  }
];

export function getCodeWalkthroughs(ids: string[]): CodeWalkthrough[] {
  const idSet = new Set(ids);
  return CODE_WALKTHROUGHS.filter((walkthrough) => idSet.has(walkthrough.id));
}

export function getCodeWalkthroughsForFeatures(featureIds: string[]): CodeWalkthrough[] {
  const featureIdSet = new Set(featureIds);
  return CODE_WALKTHROUGHS.filter((walkthrough) => walkthrough.featureIds.some((featureId) => featureIdSet.has(featureId)));
}
