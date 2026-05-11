import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../auth/auth.service';
import { LoadingService } from '../interceptors/loading.service';
import { ThemeService } from '../theme/theme.service';
import { AppLogoComponent } from '../../shared/components/app-logo/app-logo.component';
import { FloatingHelpComponent } from '../../shared/components/floating-help/floating-help.component';
import { RoleChipComponent } from '../../shared/components/role-chip/role-chip.component';
import { routeTransition } from '../../shared/animations/route-transition.animation';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  managerOnly?: boolean;
}

@Component({
  selector: 'tp-app-layout',
  standalone: true,
  imports: [AppLogoComponent, ButtonModule, FloatingHelpComponent, RoleChipComponent, RouterLink, RouterLinkActive, RouterOutlet],
  animations: [routeTransition],
  template: `
    <div class="app-frame">
      <aside class="sidebar">
        <tp-app-logo />
        <nav aria-label="Primary navigation">
          @for (item of visibleNavItems(); track item.route) {
            <a [routerLink]="item.route" routerLinkActive="active">
              <i [class]="item.icon"></i>
              <span>{{ item.label }}</span>
            </a>
          }
        </nav>
      </aside>

      <section class="workspace">
        <header class="topbar">
          <div>
            <p class="eyebrow">Atos Angular Workshop</p>
            <h1>{{ pageTitle() }}</h1>
          </div>
          <div class="topbar-actions">
            @if (loading.isLoading()) {
              <span class="loader">Loading</span>
            }
            <tp-role-chip [role]="auth.currentUser()?.appRole ?? 'Guest'" />
            <button
              pButton
              type="button"
              [icon]="theme.isDark() ? 'pi pi-sun' : 'pi pi-moon'"
              [rounded]="true"
              [text]="true"
              aria-label="Toggle theme"
              (click)="theme.toggle()"
            ></button>
            <button pButton type="button" icon="pi pi-sign-out" label="Logout" severity="secondary" (click)="logout()"></button>
          </div>
        </header>

        <main [@.disabled]="reducedMotion()" [@routeTransition]="pageTitle()">
          <router-outlet />
        </main>
      </section>

      <tp-floating-help
        [title]="pageTitle() + ' Help'"
        [businessPurpose]="helpContent().businessPurpose"
        [angularFeatures]="helpContent().angularFeatures"
        [primeNgComponents]="helpContent().primeNgComponents"
        [labEntries]="helpContent().labEntries"
      />
    </div>
  `,
  styles: [
    `
      .app-frame {
        display: grid;
        min-height: 100vh;
        grid-template-columns: 17rem 1fr;
        background: var(--tp-surface);
      }

      .sidebar {
        position: sticky;
        top: 0;
        display: flex;
        height: 100vh;
        flex-direction: column;
        gap: 2rem;
        border-right: 3px solid var(--tp-ink);
        background: var(--tp-panel);
        padding: 1.25rem;
      }

      nav {
        display: grid;
        gap: 0.5rem;
      }

      nav a {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        border: 2px solid transparent;
        border-radius: 0.35rem;
        padding: 0.75rem;
        color: var(--tp-text);
        font-weight: 800;
      }

      nav a.active,
      nav a:hover {
        border-color: var(--tp-ink);
        background: var(--tp-warning);
        box-shadow: 4px 4px 0 var(--tp-ink);
        color: #121212;
      }

      .workspace {
        min-width: 0;
      }

      .topbar {
        position: sticky;
        top: 0;
        z-index: 5;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        border-bottom: 3px solid var(--tp-ink);
        background: color-mix(in srgb, var(--tp-panel) 94%, transparent);
        padding: 1rem 1.5rem;
        backdrop-filter: blur(12px);
      }

      .eyebrow,
      h1 {
        margin: 0;
      }

      .eyebrow {
        color: var(--tp-muted);
        font-size: 0.72rem;
        font-weight: 900;
        text-transform: uppercase;
      }

      h1 {
        font-size: 1.35rem;
      }

      .topbar-actions {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .loader {
        border: 2px solid var(--tp-ink);
        background: var(--tp-success);
        box-shadow: 3px 3px 0 var(--tp-ink);
        color: #071312;
        font-size: 0.78rem;
        font-weight: 900;
        padding: 0.35rem 0.55rem;
      }

      main {
        padding: 1.5rem;
      }

      @media (max-width: 920px) {
        .app-frame {
          grid-template-columns: 1fr;
        }

        .sidebar {
          position: static;
          height: auto;
          border-right: 0;
          border-bottom: 3px solid var(--tp-ink);
        }

        nav {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .topbar {
          align-items: flex-start;
          flex-direction: column;
        }

        .topbar-actions {
          flex-wrap: wrap;
        }
      }
    `
  ]
})
export class AppLayoutComponent {
  protected readonly auth = inject(AuthService);
  protected readonly loading = inject(LoadingService);
  protected readonly theme = inject(ThemeService);
  private readonly router = inject(Router);

  protected readonly reducedMotion = signal(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  private readonly navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'pi pi-chart-line', route: '/dashboard' },
    { label: 'Teams', icon: 'pi pi-sitemap', route: '/teams' },
    { label: 'Members', icon: 'pi pi-users', route: '/members' },
    { label: 'Evaluations', icon: 'pi pi-star', route: '/evaluations' },
    { label: 'Feedback', icon: 'pi pi-comments', route: '/feedback' },
    { label: 'Goals', icon: 'pi pi-flag', route: '/goals' },
    { label: 'Angular Lab', icon: 'pi pi-bolt', route: '/angular-lab' }
  ];

  protected readonly visibleNavItems = computed(() =>
    this.navItems.filter((item) => !item.managerOnly || this.auth.hasRole('Manager'))
  );

  protected readonly pageTitle = computed(() => {
    const url = this.router.url.split('?')[0];
    const current = this.navItems.find((item) => url.startsWith(item.route));
    return current?.label ?? 'TeamPulse';
  });

  protected readonly helpContent = computed(() => {
    const url = this.router.url.split('?')[0];

    if (url === '/dashboard') {
      return {
        businessPurpose:
          'The dashboard changes by fake role: managers see team and organization signals, while team members see their own profile, goals, feedback, and evaluation data.',
        angularFeatures: ['Role-based rendering', 'API services', 'Signals', 'Computed values', 'Conditional templates'],
        primeNgComponents: ['Button', 'ProgressBar', 'Tag', 'Dialog', 'Dashboard cards'],
        labEntries: ['Role-based UI', 'HttpClient services', 'Signals and computed values', 'Shared stat-card usage']
      };
    }

    if (url === '/teams') {
      return {
        businessPurpose: 'The Teams page compares squads and lets managers maintain team records while team members browse read-only data.',
        angularFeatures: ['Reactive Forms', 'Signals', 'Computed filters', 'Role-based actions', 'HTTP CRUD services'],
        primeNgComponents: ['Table', 'Dialog', 'Select', 'InputNumber', 'Textarea', 'Button'],
        labEntries: ['Reactive forms', 'PrimeNG dialogs', 'Role-based UI', 'Table filtering']
      };
    }

    if (url.startsWith('/teams/')) {
      return {
        businessPurpose: 'Team Detail brings together team overview, members, goals, feedback, and risk highlights for one squad.',
        angularFeatures: ['Route parameters', 'forkJoin', 'Signals', 'Computed summaries', 'Reusable components'],
        primeNgComponents: ['Table', 'ProgressBar', 'Tag', 'Button'],
        labEntries: ['Route params', 'Composition with shared components', 'API aggregation']
      };
    }

    if (url === '/members') {
      return {
        businessPurpose: 'The Members page demonstrates a realistic people directory with paging, sorting, filtering, and manager-only maintenance actions.',
        angularFeatures: ['Reactive Forms', 'Signals', 'Computed filters', 'Role-based lists', 'HTTP CRUD services'],
        primeNgComponents: ['Table', 'Dialog', 'Select', 'InputNumber', 'Button'],
        labEntries: ['DataTable pagination', 'Global search', 'Role-based filtering', 'Reactive forms']
      };
    }

    if (url.startsWith('/members/')) {
      return {
        businessPurpose: 'Member Profile focuses on one engineer with skills, scores, evaluations, goals, feedback, and manager 1:1 notes.',
        angularFeatures: ['Route parameters', 'Role checks', 'forkJoin', 'Reactive Forms', 'Signals'],
        primeNgComponents: ['Table', 'Dialog', 'Textarea', 'ProgressBar', 'Tag'],
        labEntries: ['Route params', 'Master detail pages', 'Manager-only actions', 'Form dialogs']
      };
    }

    if (url === '/evaluations') {
      return {
        businessPurpose: 'Evaluations let managers maintain review scores while team members review only their own evaluation history.',
        angularFeatures: ['Reactive Forms', 'Validators', 'Role-scoped rendering', 'Signals', 'HTTP CRUD services'],
        primeNgComponents: ['Table', 'Dialog', 'Select', 'Slider', 'InputNumber', 'Textarea', 'Toast'],
        labEntries: ['Reactive forms validation', 'Manager-only actions', 'Score indicators', 'Toast feedback']
      };
    }

    if (url === '/feedback') {
      return {
        businessPurpose: 'Feedback captures recognition, improvement, risk, and general coaching signals from seeded API data.',
        angularFeatures: ['Computed filters', 'Role-scoped lists', 'Reactive Forms', 'Signals', 'HTTP services'],
        primeNgComponents: ['Card', 'Table', 'Dialog', 'Select', 'DatePicker', 'Textarea', 'Tag', 'Toast'],
        labEntries: ['List filtering', 'Role-aware views', 'Dialog forms', 'PrimeNG tags']
      };
    }

    if (url === '/goals') {
      return {
        businessPurpose: 'Goals track team and member progress, showing managers editable goals and team members their own goals.',
        angularFeatures: ['Reactive Forms', 'Validators', 'Computed summaries', 'Signals', 'Role-based actions'],
        primeNgComponents: ['Table', 'Dialog', 'Select', 'DatePicker', 'InputNumber', 'ProgressBar', 'Tag', 'Toast'],
        labEntries: ['Progress UI', 'Owner filters', 'Reactive form dialogs', 'Computed state']
      };
    }

    if (url === '/angular-lab' || url.startsWith('/angular-lab/')) {
      return {
        businessPurpose:
          'Angular Lab maps TeamPulse business pages to Angular concepts so workshop attendees can learn from the actual app they are using.',
        angularFeatures: ['Feature map', 'Route parameters', 'Reusable components', 'Project snippets', 'Concept-to-page links'],
        primeNgComponents: ['Card', 'Tabs', 'Accordion', 'Panel', 'Tag', 'Button', 'Table'],
        labEntries: ['Use the grid to choose a concept', 'Open details for examples', 'Follow links to pages that demonstrate the concept']
      };
    }

    return {
      businessPurpose: `Use ${this.pageTitle()} to explore TeamPulse workflows with seeded API data.`,
      angularFeatures: ['Standalone components', 'Router', 'Route guards', 'Signals', 'HttpClient'],
      primeNgComponents: ['Button', 'Tag', 'Dialog', 'Table', 'Card'],
      labEntries: ['Routing', 'HttpClient', 'PrimeNG']
    };
  });

  protected logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
