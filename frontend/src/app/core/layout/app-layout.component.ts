import { Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
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
  route?: string;
  managerOnly?: boolean;
  children?: NavItem[];
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
          @for (item of visibleNavItems(); track item.label) {
            @if (item.children?.length) {
              <div class="nav-group" [class.active-group]="isNavItemActive(item)">
                <div class="nav-group-label" [attr.aria-label]="item.label" [title]="sidebarCollapsed() ? item.label : null">
                  <i [class]="item.icon"></i>
                  <span>{{ item.label }}</span>
                </div>
                <div class="nav-children">
                  @for (child of item.children; track child.route) {
                    <a
                      [routerLink]="child.route"
                      routerLinkActive="active"
                      [attr.aria-label]="child.label"
                      [title]="sidebarCollapsed() ? child.label : null"
                    >
                      <i [class]="child.icon"></i>
                      <span>{{ child.label }}</span>
                    </a>
                  }
                </div>
              </div>
            } @else {
              <a [routerLink]="item.route" routerLinkActive="active" [attr.aria-label]="item.label" [title]="sidebarCollapsed() ? item.label : null">
                <i [class]="item.icon"></i>
                <span>{{ item.label }}</span>
              </a>
            }
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

      <tp-floating-help />
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

      nav a,
      .nav-group-label {
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

      nav a i,
      .nav-group-label i {
        width: 1.15rem;
        text-align: center;
      }

      .nav-group {
        display: grid;
        gap: var(--tp-space-2);
      }

      .nav-group-label {
        color: var(--tp-muted);
        cursor: default;
        font-size: 0.78rem;
        min-height: 2.35rem;
        text-transform: uppercase;
      }

      .nav-group.active-group .nav-group-label {
        color: var(--tp-text);
      }

      .nav-children {
        display: grid;
        gap: var(--tp-space-2);
        border-left: 2px solid color-mix(in srgb, var(--tp-ink) 55%, transparent);
        margin-left: 0.55rem;
        padding-left: 0.55rem;
      }

      .app-frame.sidebar-collapsed nav a {
        justify-content: center;
        padding-inline: 0;
      }

      .app-frame.sidebar-collapsed .nav-group-label {
        justify-content: center;
        padding-inline: 0;
      }

      .app-frame.sidebar-collapsed .nav-children {
        border-left: 0;
        margin-left: 0;
        padding-left: 0;
      }

      .app-frame.sidebar-collapsed nav a span,
      .app-frame.sidebar-collapsed .nav-group-label span {
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

        .app-frame.sidebar-collapsed .nav-group-label {
          justify-content: flex-start;
          padding: 0.75rem;
        }

        .app-frame.sidebar-collapsed .nav-children {
          border-left: 2px solid color-mix(in srgb, var(--tp-ink) 55%, transparent);
          margin-left: 0.55rem;
          padding-left: 0.55rem;
        }

        .app-frame.sidebar-collapsed nav a span,
        .app-frame.sidebar-collapsed .nav-group-label span {
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
  private readonly currentUrl = signal(this.router.url);

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
    {
      label: 'Learning Lab',
      icon: 'pi pi-graduation-cap',
      children: [
        { label: 'Angular', icon: 'pi pi-bolt', route: '/learning/angular' },
        { label: 'MCP Servers', icon: 'pi pi-server', route: '/learning/mcp-servers' },
        { label: 'Run Locally', icon: 'pi pi-desktop', route: '/learning/run-locally' }
      ]
    }
  ];

  protected readonly visibleNavItems = computed(() =>
    this.navItems.filter((item) => !item.managerOnly || this.auth.hasRole('Manager'))
  );

  protected readonly pageTitle = computed(() => {
    const url = this.currentUrl().split('?')[0];
    const current = this.findNavItem(url);
    return current?.label ?? 'TeamPulse';
  });

  protected logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }

  protected isNavItemActive(item: NavItem): boolean {
    const url = this.currentUrl().split('?')[0];
    return !!item.children?.some((child) => child.route && url.startsWith(child.route));
  }

  protected toggleSidebar(): void {
    this.sidebarCollapsed.update((collapsed) => {
      const next = !collapsed;
      this.storage.set(this.sidebarCollapsedKey, next);
      return next;
    });
  }

  private findNavItem(url: string): NavItem | undefined {
    for (const item of this.navItems) {
      if (item.route && url.startsWith(item.route)) {
        return item;
      }

      const child = item.children?.find((navChild) => navChild.route && url.startsWith(navChild.route));

      if (child) {
        return child;
      }
    }

    return undefined;
  }

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.currentUrl.set(event.urlAfterRedirects));
  }
}
