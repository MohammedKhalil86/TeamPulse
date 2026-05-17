import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { AuthService } from '../../core/auth/auth.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { SectionCardComponent } from '../../shared/components/section-card/section-card.component';

interface GuideCard {
  icon: string;
  title: string;
  description: string;
  route: string;
  action: string;
}

interface WorkflowStep {
  label: string;
  route: string;
}

@Component({
  selector: 'tp-how-teampulse-works-page',
  standalone: true,
  imports: [ButtonModule, PageHeaderComponent, RouterLink, SectionCardComponent, TagModule],
  template: `
    <tp-page-header
      eyebrow="How TeamPulse Works"
      [title]="isManager() ? 'Guide your team with clear signals' : 'Understand your work and growth signals'"
      [subtitle]="
        isManager()
          ? 'Use TeamPulse to connect team health, goals, feedback, evaluations, and risk into one practical management rhythm.'
          : 'Use TeamPulse to follow your goals, feedback, evaluations, profile information, and team context in one place.'
      "
    />

    <section class="guide-hero">
      <div class="role-panel">
        <p-tag [value]="isManager() ? 'Manager guide' : 'Team member guide'" severity="info" />
        <h3>{{ currentUserName() }}</h3>
        <p>
          {{
            isManager()
              ? 'This guide focuses on reading team-level patterns, spotting risk early, and keeping growth conversations grounded in visible work.'
              : 'This guide focuses on reading your own progress, understanding feedback, and staying aligned with your team goals.'
          }}
        </p>
      </div>

      <div class="sample-notice">
        <i class="pi pi-info-circle" aria-hidden="true"></i>
        <span>TeamPulse uses sample workspace data. Do not enter real employee or company information.</span>
      </div>
    </section>

    <section class="guide-grid">
      @for (card of guideCards(); track card.title) {
        <tp-section-card [title]="card.title" [interactive]="true">
          <div class="guide-card-body">
            <span class="guide-icon"><i [class]="card.icon" aria-hidden="true"></i></span>
            <p>{{ card.description }}</p>
            <a pButton [routerLink]="card.route" [label]="card.action" icon="pi pi-arrow-right"></a>
          </div>
        </tp-section-card>
      }
    </section>

    <tp-section-card
      title="Suggested Workflow"
      [subtitle]="
        isManager()
          ? 'A simple weekly rhythm for reviewing delivery, people growth, and early warning signs.'
          : 'A personal rhythm for staying aware of goals, feedback, and evaluation trends.'
      "
    >
      <div class="workflow">
        @for (step of workflowSteps(); track step.label; let index = $index) {
          <a class="workflow-step" [routerLink]="step.route">
            <span class="step-number">{{ index + 1 }}</span>
            <span>{{ step.label }}</span>
            <i class="pi pi-arrow-right" aria-hidden="true"></i>
          </a>
        }
      </div>
    </tp-section-card>

    <section class="signals-grid">
      <tp-section-card title="How To Read The Signals" subtitle="TeamPulse is designed for quick scanning first, then deeper review.">
        <div class="signal-list">
          @for (signal of signalNotes(); track signal.label) {
            <article>
              <strong>{{ signal.label }}</strong>
              <p>{{ signal.description }}</p>
            </article>
          }
        </div>
      </tp-section-card>

      <tp-section-card title="What To Do Next" subtitle="Use the guide as a jumping-off point, not a separate reporting task.">
        <div class="next-actions">
          @for (action of nextActions(); track action.label) {
            <a pButton [routerLink]="action.route" [label]="action.label" [icon]="action.icon" severity="secondary"></a>
          }
        </div>
      </tp-section-card>
    </section>
  `,
  styles: [
    `
      :host {
        display: grid;
        gap: var(--tp-space-5);
      }

      .guide-hero {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(18rem, 0.45fr);
        gap: var(--tp-space-5);
        align-items: stretch;
      }

      .role-panel,
      .sample-notice {
        border: 3px solid var(--tp-ink);
        border-radius: var(--tp-radius);
        background: var(--tp-panel);
        box-shadow: var(--tp-shadow-md);
      }

      .role-panel {
        display: grid;
        gap: var(--tp-space-3);
        padding: var(--tp-space-5);
      }

      .role-panel h3,
      .role-panel p,
      .guide-card-body p,
      .signal-list p {
        margin: 0;
      }

      .role-panel h3 {
        font-size: clamp(1.65rem, 3vw, 2.75rem);
        line-height: 1;
      }

      .role-panel p,
      .guide-card-body p,
      .signal-list p {
        color: var(--tp-muted);
        line-height: 1.65;
      }

      .sample-notice {
        display: flex;
        gap: var(--tp-space-3);
        align-items: center;
        align-self: center;
        background: color-mix(in srgb, var(--tp-warning) 24%, var(--tp-panel));
        padding: var(--tp-space-4);
        font-weight: 800;
        line-height: 1.45;
      }

      .sample-notice i {
        color: var(--tp-accent);
        font-size: 1.35rem;
      }

      .guide-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: var(--tp-space-5);
      }

      .guide-card-body {
        display: grid;
        gap: var(--tp-space-4);
        align-content: start;
        min-height: 12rem;
      }

      .guide-icon {
        display: inline-grid;
        width: 3rem;
        height: 3rem;
        place-items: center;
        border: 3px solid var(--tp-ink);
        background: var(--tp-pink);
        box-shadow: var(--tp-shadow-xs);
        color: #121212;
        font-size: 1.25rem;
      }

      .workflow {
        display: grid;
        grid-template-columns: repeat(5, minmax(0, 1fr));
        gap: var(--tp-space-3);
      }

      .workflow-step {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) auto;
        gap: var(--tp-space-3);
        align-items: center;
        min-height: 5.5rem;
        border: 3px solid var(--tp-ink);
        border-radius: var(--tp-radius-sm);
        background: var(--tp-soft-blue);
        box-shadow: var(--tp-shadow-sm);
        color: var(--tp-text);
        font-weight: 900;
        line-height: 1.25;
        padding: var(--tp-space-4);
        transition:
          box-shadow var(--tp-motion-fast),
          transform var(--tp-motion-fast);
      }

      .workflow-step:hover {
        box-shadow: var(--tp-shadow-md);
        transform: translate(-1px, -1px);
      }

      .step-number {
        display: inline-grid;
        width: 2rem;
        height: 2rem;
        place-items: center;
        border: 2px solid var(--tp-ink);
        background: var(--tp-warning);
        color: #121212;
        font-weight: 950;
      }

      .signals-grid {
        display: grid;
        grid-template-columns: minmax(0, 1.1fr) minmax(18rem, 0.55fr);
        gap: var(--tp-space-5);
      }

      .signal-list {
        display: grid;
        gap: var(--tp-space-3);
      }

      .signal-list article {
        display: grid;
        gap: var(--tp-space-2);
        border: 2px solid var(--tp-ink);
        border-radius: var(--tp-radius-sm);
        background: var(--tp-soft-blue);
        padding: var(--tp-space-4);
      }

      .next-actions {
        display: flex;
        flex-wrap: wrap;
        gap: var(--tp-space-3);
      }

      @media (max-width: 1180px) {
        .guide-grid,
        .workflow {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (max-width: 820px) {
        .guide-hero,
        .guide-grid,
        .workflow,
        .signals-grid {
          grid-template-columns: 1fr;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .workflow-step,
        .workflow-step:hover {
          transition: none;
          transform: none;
        }
      }
    `
  ]
})
export class HowTeamPulseWorksPageComponent {
  private readonly auth = inject(AuthService);

  protected readonly isManager = computed(() => this.auth.hasRole('Manager'));
  protected readonly currentUserName = computed(() => this.auth.currentUser()?.fullName ?? 'TeamPulse user');

  protected readonly guideCards = computed<GuideCard[]>(() =>
    this.isManager()
      ? [
          {
            icon: 'pi pi-heart',
            title: 'Team Health',
            description: 'Health combines delivery, engagement, and risk indicators so you can see which squads need attention before small issues spread.',
            route: '/dashboard',
            action: 'Open Dashboard'
          },
          {
            icon: 'pi pi-flag',
            title: 'Goals',
            description: 'Goals show the current commitments for teams and individuals, including progress, due dates, and blocked work.',
            route: '/goals',
            action: 'Review Goals'
          },
          {
            icon: 'pi pi-comments',
            title: 'Feedback',
            description: 'Feedback captures recognition, improvement notes, risk observations, and coaching context across the workspace.',
            route: '/feedback',
            action: 'Read Feedback'
          }
        ]
      : [
          {
            icon: 'pi pi-flag',
            title: 'Personal Goals',
            description: 'Your goals show what you are working toward, current progress, due dates, and whether anything needs support.',
            route: '/goals',
            action: 'Check Goals'
          },
          {
            icon: 'pi pi-comments',
            title: 'Feedback',
            description: 'Feedback helps you see recognition, coaching notes, and useful context from recent work.',
            route: '/feedback',
            action: 'Read Feedback'
          },
          {
            icon: 'pi pi-user',
            title: 'Profile And Skills',
            description: 'Your profile gathers role, seniority, skills, performance, engagement, and team context in one place.',
            route: '/members',
            action: 'Open Members'
          }
        ]
  );

  protected readonly workflowSteps = computed<WorkflowStep[]>(() =>
    this.isManager()
      ? [
          { label: 'Start from Dashboard', route: '/dashboard' },
          { label: 'Review team health', route: '/teams' },
          { label: 'Check members and risks', route: '/members' },
          { label: 'Update goals', route: '/goals' },
          { label: 'Review feedback and evaluations', route: '/feedback' }
        ]
      : [
          { label: 'Review dashboard', route: '/dashboard' },
          { label: 'Check own goals', route: '/goals' },
          { label: 'Read feedback', route: '/feedback' },
          { label: 'Track evaluation trends', route: '/evaluations' }
        ]
  );

  protected readonly signalNotes = computed(() =>
    this.isManager()
      ? [
          {
            label: 'Evaluations',
            description: 'Use evaluation scores to understand skill growth, delivery habits, communication, ownership, and teamwork over time.'
          },
          {
            label: 'Risk Signals',
            description: 'High-risk members or teams deserve early follow-up, goal review, and a closer look at recent feedback.'
          },
          {
            label: 'Team Health',
            description: 'Health is most useful as a trend and conversation starter, not as a replacement for manager judgment.'
          }
        ]
      : [
          {
            label: 'Evaluations',
            description: 'Evaluation history helps you see patterns in technical delivery, communication, ownership, and teamwork.'
          },
          {
            label: 'Team Health',
            description: 'Team health gives context for how your squad is doing and where shared delivery or engagement needs attention.'
          },
          {
            label: 'Skills',
            description: 'Skills and profile information make it easier to discuss strengths, growth areas, and possible next opportunities.'
          }
        ]
  );

  protected readonly nextActions = computed(() =>
    this.isManager()
      ? [
          { label: 'Dashboard', icon: 'pi pi-chart-line', route: '/dashboard' },
          { label: 'Members', icon: 'pi pi-users', route: '/members' },
          { label: 'Evaluations', icon: 'pi pi-star', route: '/evaluations' },
          { label: 'Goals', icon: 'pi pi-flag', route: '/goals' }
        ]
      : [
          { label: 'Dashboard', icon: 'pi pi-chart-line', route: '/dashboard' },
          { label: 'Goals', icon: 'pi pi-flag', route: '/goals' },
          { label: 'Feedback', icon: 'pi pi-comments', route: '/feedback' },
          { label: 'Evaluations', icon: 'pi pi-star', route: '/evaluations' }
        ]
  );
}
