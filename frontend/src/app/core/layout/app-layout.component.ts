import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../auth/auth.service';
import { LoadingService } from '../interceptors/loading.service';
import { StorageService } from '../storage/storage.service';
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
    <div class="app-frame" [class.sidebar-collapsed]="sidebarCollapsed()">
      <aside class="sidebar">
        <div class="sidebar-header">
          <tp-app-logo [compact]="sidebarCollapsed()" />
          <button
            pButton
            type="button"
            [icon]="sidebarCollapsed() ? 'pi pi-angle-right' : 'pi pi-angle-left'"
            [rounded]="true"
            [text]="true"
            [attr.aria-label]="sidebarCollapsed() ? 'Expand navigation' : 'Collapse navigation'"
            [title]="sidebarCollapsed() ? 'Expand navigation' : 'Collapse navigation'"
            (click)="toggleSidebar()"
          ></button>
        </div>
        <nav aria-label="Primary navigation">
          @for (item of visibleNavItems(); track item.route) {
            <a [routerLink]="item.route" routerLinkActive="active" [attr.aria-label]="item.label" [title]="sidebarCollapsed() ? item.label : null">
              <i [class]="item.icon"></i>
              <span>{{ item.label }}</span>
            </a>
          }
        </nav>
      </aside>

      <section class="workspace">
        <header class="topbar">
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
        grid-template-columns: 17rem minmax(0, 1fr);
        background: var(--tp-surface);
        transition: grid-template-columns var(--tp-motion);
      }

      .app-frame.sidebar-collapsed {
        grid-template-columns: 5.75rem minmax(0, 1fr);
      }

      .sidebar {
        position: sticky;
        top: 0;
        display: flex;
        height: 100vh;
        flex-direction: column;
        gap: var(--tp-space-5);
        border-right: 3px solid var(--tp-ink);
        background: var(--tp-panel);
        padding: var(--tp-space-5);
        transition:
          padding var(--tp-motion),
          width var(--tp-motion);
      }

      .sidebar-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--tp-space-3);
        min-width: 0;
      }

      .app-frame.sidebar-collapsed .sidebar {
        padding: var(--tp-space-4) var(--tp-space-3);
      }

      .app-frame.sidebar-collapsed .sidebar-header {
        justify-content: center;
      }

      .app-frame.sidebar-collapsed .sidebar-header button {
        position: absolute;
        right: -1.05rem;
        top: 4.6rem;
        border: 2px solid var(--tp-ink);
        background: var(--tp-panel);
        box-shadow: var(--tp-shadow-xs);
      }

      nav {
        display: grid;
        gap: var(--tp-space-2);
      }

      nav a {
        display: flex;
        align-items: center;
        gap: var(--tp-space-3);
        border: 2px solid transparent;
        border-radius: 0.35rem;
        min-height: 2.85rem;
        padding: 0.75rem;
        color: var(--tp-text);
        font-weight: 800;
        line-height: 1.2;
        transition:
          background-color var(--tp-motion-fast),
          box-shadow var(--tp-motion-fast),
          color var(--tp-motion-fast);
      }

      nav a i {
        width: 1.15rem;
        text-align: center;
      }

      .app-frame.sidebar-collapsed nav a {
        justify-content: center;
        padding-inline: 0;
      }

      .app-frame.sidebar-collapsed nav a span {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip: rect(0 0 0 0);
        white-space: nowrap;
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
        justify-content: flex-end;
        gap: 1rem;
        border-bottom: 3px solid var(--tp-ink);
        background: color-mix(in srgb, var(--tp-panel) 94%, transparent);
        min-height: 4.25rem;
        padding: var(--tp-space-4) var(--tp-space-6);
        backdrop-filter: blur(12px);
      }

      .topbar-actions {
        display: flex;
        align-items: center;
        gap: var(--tp-space-3);
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
        padding: var(--tp-space-6);
      }

      @media (max-width: 920px) {
        .app-frame {
          grid-template-columns: 1fr;
        }

        .app-frame.sidebar-collapsed {
          grid-template-columns: 1fr;
        }

        .sidebar {
          position: static;
          height: auto;
          border-right: 0;
          border-bottom: 3px solid var(--tp-ink);
        }

        .app-frame.sidebar-collapsed .sidebar {
          padding: var(--tp-space-5);
        }

        .app-frame.sidebar-collapsed .sidebar-header {
          justify-content: space-between;
        }

        .app-frame.sidebar-collapsed .sidebar-header button {
          position: static;
        }

        .app-frame.sidebar-collapsed nav a {
          justify-content: flex-start;
          padding: 0.75rem;
        }

        .app-frame.sidebar-collapsed nav a span {
          position: static;
          width: auto;
          height: auto;
          overflow: visible;
          clip: auto;
          white-space: normal;
        }

        nav {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .topbar {
          align-items: center;
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
  private readonly storage = inject(StorageService);
  private readonly router = inject(Router);

  private readonly sidebarCollapsedKey = 'teampulse.v2.sidebarCollapsed';
  protected readonly sidebarCollapsed = signal(this.storage.get<boolean>(this.sidebarCollapsedKey) ?? false);

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
    { label: 'How TeamPulse Works', icon: 'pi pi-compass', route: '/how-teampulse-works' },
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
          'The dashboard adapts by role: managers see team and organization signals, while team members see their own profile, goals, feedback, and evaluation data.',
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
        businessPurpose: 'Feedback captures recognition, improvement, risk, and general coaching signals across the workspace.',
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

    if (url === '/how-teampulse-works') {
      return {
        businessPurpose:
          'How TeamPulse Works gives managers and team members a role-aware guide for reading health, goals, feedback, evaluations, and risk signals.',
        angularFeatures: ['Lazy route', 'Route guard', 'Signals', 'Computed role-aware content', 'Router links'],
        primeNgComponents: ['Button', 'Tag'],
        labEntries: ['Routing', 'Route guards', 'Signals and computed values', 'Role-based UI']
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
      businessPurpose: `Use ${this.pageTitle()} to explore TeamPulse workflows and sample workspace data.`,
      angularFeatures: ['Standalone components', 'Router', 'Route guards', 'Signals', 'HttpClient'],
      primeNgComponents: ['Button', 'Tag', 'Dialog', 'Table', 'Card'],
      labEntries: ['Routing', 'HttpClient', 'PrimeNG']
    };
  });

  protected logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }

  protected toggleSidebar(): void {
    this.sidebarCollapsed.update((collapsed) => {
      const next = !collapsed;
      this.storage.set(this.sidebarCollapsedKey, next);
      return next;
    });
  }
}
