import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { FeedbackApiService } from '../../core/api/feedback-api.service';
import { GoalsApiService } from '../../core/api/goals-api.service';
import { MembersApiService } from '../../core/api/members-api.service';
import { TeamsApiService } from '../../core/api/teams-api.service';
import { UsersApiService } from '../../core/api/users-api.service';
import { Feedback, Goal, MemberProfile, Team, User } from '../../core/models/team-pulse.models';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { RiskBadgeComponent } from '../../shared/components/risk-badge/risk-badge.component';
import { ScoreBadgeComponent } from '../../shared/components/score-badge/score-badge.component';
import { SectionCardComponent } from '../../shared/components/section-card/section-card.component';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { FriendlyDatePipe } from '../../shared/pipes/friendly-date.pipe';

@Component({
  selector: 'tp-team-detail-page',
  standalone: true,
  imports: [
    ButtonModule,
    EmptyStateComponent,
    FriendlyDatePipe,
    LoadingStateComponent,
    PageHeaderComponent,
    ProgressBarModule,
    RiskBadgeComponent,
    RouterLink,
    ScoreBadgeComponent,
    SectionCardComponent,
    StatCardComponent,
    TableModule,
    TagModule
  ],
  template: `
    @if (loading()) {
      <tp-loading-state variant="skeleton" />
    } @else if (team(); as team) {
      <tp-page-header
        eyebrow="Team Detail"
        [title]="team.name"
        [subtitle]="team.mission"
        actionLabel="Back to Teams"
        actionIcon="pi pi-arrow-left"
        (action)="backLink.click()"
      />
      <a #backLink routerLink="/teams" hidden></a>

      <section class="stat-grid">
        <tp-stat-card label="Health" [value]="team.healthScore" icon="pi pi-heart" trend="Team score" />
        <tp-stat-card label="Delivery" [value]="team.deliveryScore" icon="pi pi-send" trend="Delivery score" />
        <tp-stat-card label="Engagement" [value]="team.engagementScore" icon="pi pi-bolt" trend="Engagement score" />
        <tp-stat-card label="Members" [value]="members().length" icon="pi pi-users" trend="Current team" />
      </section>

      <section class="detail-grid">
        <tp-section-card title="Overview" subtitle="Manager, risk, and score highlights.">
          <div class="overview">
            <div>
              <span>Manager</span>
              <strong>{{ managerName(team.managerId) }}</strong>
            </div>
            <tp-score-badge [score]="team.healthScore" />
            <tp-risk-badge [risk]="team.riskLevel" />
          </div>
          <div class="score-stack">
            <label>Delivery</label>
            <p-progressbar [value]="team.deliveryScore" />
            <label>Engagement</label>
            <p-progressbar [value]="team.engagementScore" />
          </div>
        </tp-section-card>

        <tp-section-card title="Risk Highlights" subtitle="Members and feedback that need attention.">
          <div class="risk-grid">
            <article>
              <span>High-risk members</span>
              <strong>{{ highRiskMembers().length }}</strong>
            </article>
            <article>
              <span>Risk feedback</span>
              <strong>{{ riskFeedback().length }}</strong>
            </article>
          </div>
        </tp-section-card>

        <tp-section-card title="Team Goals" subtitle="Seeded team-level goals from the API.">
          <div class="goal-list">
            @for (goal of goals(); track goal.id) {
              <article>
                <div>
                  <strong>{{ goal.title }}</strong>
                  <span>{{ goal.status }} &middot; due {{ goal.dueDate | friendlyDate }}</span>
                </div>
                <p-progressbar [value]="goal.progress" />
              </article>
            } @empty {
              <tp-empty-state title="No team goals" message="No team goals are seeded for this team." />
            }
          </div>
        </tp-section-card>

        <tp-section-card title="Feedback Summary" subtitle="Feedback connected to team members.">
          <div class="feedback-list">
            @for (item of teamFeedback(); track item.id) {
              <article>
                <p-tag [value]="item.type" />
                <p>{{ item.message }}</p>
                <small>{{ item.createdAt | friendlyDate }}</small>
              </article>
            } @empty {
              <tp-empty-state title="No feedback" message="No feedback is linked to this team yet." />
            }
          </div>
        </tp-section-card>
      </section>

      <tp-section-card title="Team Members" subtitle="Linked member profiles for this team.">
        <p-table [value]="members()" [paginator]="true" [rows]="8" responsiveLayout="scroll">
          <ng-template #header>
            <tr><th>Name</th><th>Role</th><th>Seniority</th><th>Performance</th><th>Engagement</th><th>Risk</th></tr>
          </ng-template>
          <ng-template #body let-member>
            <tr>
              <td><a [routerLink]="['/members', member.id]">{{ member.fullName }}</a></td>
              <td>{{ member.role }}</td>
              <td>{{ member.seniority }}</td>
              <td><tp-score-badge [score]="member.performanceScore" /></td>
              <td><tp-score-badge [score]="member.engagementScore" /></td>
              <td><tp-risk-badge [risk]="member.riskLevel" /></td>
            </tr>
          </ng-template>
        </p-table>
      </tp-section-card>
    }
  `,
  styles: [
    `
      .stat-grid,
      .detail-grid {
        display: grid;
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .stat-grid {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }

      .detail-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .overview,
      .risk-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 0.75rem;
        align-items: center;
      }

      .risk-grid article,
      .goal-list article,
      .feedback-list article {
        display: grid;
        gap: 0.5rem;
        border: 2px solid var(--tp-ink);
        border-radius: var(--tp-radius-sm);
        background: color-mix(in srgb, var(--tp-hot) 8%, var(--tp-panel));
        padding: 0.85rem;
      }

      .score-stack,
      .goal-list,
      .feedback-list {
        display: grid;
        gap: 0.75rem;
      }

      span,
      small,
      p {
        color: var(--tp-muted);
      }

      strong {
        font-weight: 900;
      }

      @media (max-width: 960px) {
        .stat-grid,
        .detail-grid,
        .overview,
        .risk-grid {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class TeamDetailPageComponent {
  private readonly feedbackApi = inject(FeedbackApiService);
  private readonly goalsApi = inject(GoalsApiService);
  private readonly membersApi = inject(MembersApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly teamsApi = inject(TeamsApiService);
  private readonly usersApi = inject(UsersApiService);

  protected readonly loading = signal(true);
  protected readonly team = signal<Team | null>(null);
  protected readonly members = signal<MemberProfile[]>([]);
  protected readonly users = signal<User[]>([]);
  protected readonly goals = signal<Goal[]>([]);
  protected readonly feedback = signal<Feedback[]>([]);

  protected readonly highRiskMembers = computed(() => this.members().filter((member) => member.riskLevel === 'High'));
  protected readonly teamFeedback = computed(() => {
    const ids = new Set(this.members().map((member) => member.id));
    return this.feedback().filter((item) => ids.has(item.memberId)).slice(0, 8);
  });
  protected readonly riskFeedback = computed(() => this.teamFeedback().filter((item) => item.type === 'Risk'));

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    forkJoin({
      team: this.teamsApi.getTeam(id),
      members: this.membersApi.getTeamMembers(id),
      users: this.usersApi.getUsers(),
      goals: this.goalsApi.getTeamGoals(id),
      feedback: this.feedbackApi.getFeedback()
    }).subscribe({
      next: ({ team, members, users, goals, feedback }) => {
        this.team.set(team);
        this.members.set(members);
        this.users.set(users);
        this.goals.set(goals);
        this.feedback.set(feedback);
      },
      complete: () => this.loading.set(false)
    });
  }

  protected managerName(managerId: number): string {
    return this.users().find((user) => user.id === managerId)?.fullName ?? `Manager ${managerId}`;
  }
}
