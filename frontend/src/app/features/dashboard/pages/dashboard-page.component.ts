import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import 'chart.js/auto';
import type { ChartData, ChartOptions } from 'chart.js';
import { forkJoin, of, switchMap } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';
import { DashboardApiService } from '../../../core/api/dashboard-api.service';
import { EvaluationsApiService } from '../../../core/api/evaluations-api.service';
import { GoalsApiService } from '../../../core/api/goals-api.service';
import { MembersApiService } from '../../../core/api/members-api.service';
import { AuthService } from '../../../core/auth/auth.service';
import {
  Evaluation,
  Feedback,
  Goal,
  ManagerDashboard,
  MemberDashboard,
  MemberProfile,
  Team
} from '../../../core/models/team-pulse.models';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { RiskBadgeComponent } from '../../../shared/components/risk-badge/risk-badge.component';
import { ScoreBadgeComponent } from '../../../shared/components/score-badge/score-badge.component';
import { SectionCardComponent } from '../../../shared/components/section-card/section-card.component';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';
import { FriendlyDatePipe } from '../../../shared/pipes/friendly-date.pipe';

interface SkillCount {
  skill: string;
  count: number;
}

interface TeamMemberCount {
  team: Team;
  count: number;
}

@Component({
  selector: 'tp-dashboard-page',
  standalone: true,
  imports: [
    ButtonModule,
    ChartModule,
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
    TagModule
  ],
  template: `
    @if (loading()) {
      <tp-loading-state variant="skeleton" />
    } @else {
      @if (isManager()) {
        @if (managerDashboard(); as dashboard) {
          <section class="dashboard manager-dashboard">
            <tp-page-header
              eyebrow="Manager Dashboard"
              title="Engineering command center"
              subtitle="Organization-level team health, delivery signals, goals, and feedback in one view."
              actionLabel="Review Teams"
              actionIcon="pi pi-sitemap"
              (action)="goToTeams()"
            />

            <section class="stat-grid">
              <tp-stat-card label="Total Teams" [value]="dashboard.teamCount" icon="pi pi-sitemap" trend="Active squads" />
              <tp-stat-card label="Total Members" [value]="dashboard.memberCount" icon="pi pi-users" trend="Across all teams" />
              <tp-stat-card label="Avg Health" [value]="dashboard.averageHealthScore" icon="pi pi-heart" trend="Team signal" />
              <tp-stat-card
                label="Eval Complete"
                [value]="evaluationCompletion() + '%'"
                icon="pi pi-check-circle"
                trend="Q1 coverage"
              />
              <tp-stat-card
                label="High Risk"
                [value]="dashboard.highRiskMemberCount"
                icon="pi pi-exclamation-triangle"
                trend="Needs attention"
              />
              <tp-stat-card label="Goal Progress" [value]="goalsProgress() + '%'" icon="pi pi-flag" trend="Active goals" />
            </section>

            <section class="dashboard-grid manager-grid">
              <div class="dashboard-column">
                <tp-section-card title="Team Health Overview" subtitle="Health, delivery, engagement, and risk by squad.">
                  <div class="chart-shell">
                    <p-chart type="bar" [data]="teamHealthChart()" [options]="barChartOptions" />
                  </div>
                  <div class="team-health-list">
                    @for (team of dashboard.teams; track team.id) {
                      <article class="team-row">
                        <div>
                          <strong>{{ team.name }}</strong>
                          <span>{{ team.mission }}</span>
                        </div>
                        <tp-score-badge [score]="team.healthScore" />
                        <p-progressbar [value]="team.deliveryScore" [showValue]="false" />
                        <tp-risk-badge [risk]="team.riskLevel" />
                      </article>
                    }
                  </div>
                </tp-section-card>

                <tp-section-card title="Skills Distribution" subtitle="Top skills extracted from member profiles.">
                  <div class="skill-cloud">
                    @for (skill of skillsDistribution(); track skill.skill) {
                      <span>
                        {{ skill.skill }}
                        <strong>{{ skill.count }}</strong>
                      </span>
                    }
                  </div>
                </tp-section-card>

                <tp-section-card title="Goals Progress Summary" subtitle="Upcoming goals and completion signals.">
                  <div class="chart-shell compact-chart">
                    <p-chart type="doughnut" [data]="goalStatusChart()" [options]="doughnutChartOptions" />
                  </div>
                  <div class="goal-list">
                    @for (goal of dashboard.upcomingGoals; track goal.id) {
                      <article>
                        <div>
                          <strong>{{ goal.title }}</strong>
                          <span>{{ goal.status }}</span>
                        </div>
                        <p-progressbar [value]="goal.progress" />
                      </article>
                    }
                  </div>
                </tp-section-card>
              </div>

              <div class="dashboard-column">
                <tp-section-card title="Members by Team" subtitle="Distribution for paging, filtering, and chart exercises.">
                  <div class="chart-shell compact-chart">
                    <p-chart type="doughnut" [data]="membersByTeamChart()" [options]="doughnutChartOptions" />
                  </div>
                  <div class="bar-list">
                    @for (item of membersByTeam(); track item.team.id) {
                      <div class="bar-row">
                        <span>{{ item.team.name }}</span>
                        <div class="bar-track">
                          <div class="bar-fill" [style.width.%]="memberBarWidth(item.count)"></div>
                        </div>
                        <strong>{{ item.count }}</strong>
                      </div>
                    }
                  </div>
                </tp-section-card>

                <tp-section-card title="Recent Feedback" subtitle="Latest feedback across teams.">
                  <div class="feedback-list">
                    @for (item of dashboard.recentFeedback; track item.id) {
                      <article>
                        <p-tag [value]="item.type" severity="info" />
                        <p>{{ item.message }}</p>
                        <small>{{ item.createdAt | friendlyDate }}</small>
                      </article>
                    }
                  </div>
                </tp-section-card>

                <tp-section-card title="Quick Links" subtitle="Jump into management workflows.">
                  <div class="quick-links">
                    <a pButton routerLink="/teams" icon="pi pi-sitemap" label="Teams"></a>
                    <a pButton routerLink="/members" icon="pi pi-users" label="Members" severity="secondary"></a>
                    <a pButton routerLink="/evaluations" icon="pi pi-star" label="Evaluations" severity="secondary"></a>
                    <a pButton routerLink="/goals" icon="pi pi-flag" label="Goals" severity="secondary"></a>
                  </div>
                </tp-section-card>
              </div>
            </section>
          </section>
        }
      } @else {
        @if (memberDashboard(); as dashboard) {
          <section class="dashboard member-dashboard">
            <tp-page-header
              eyebrow="Team Member Dashboard"
              [title]="'Welcome back, ' + dashboard.user.fullName"
              subtitle="Your profile, goals, feedback, evaluation signals, and next actions in one focused workspace."
            />

            @if (dashboard.profile; as profile) {
              <section class="stat-grid">
                <tp-stat-card label="Performance" [value]="profile.performanceScore" icon="pi pi-chart-line" trend="Current profile" />
                <tp-stat-card label="Engagement" [value]="profile.engagementScore" icon="pi pi-heart" trend="Team signal" />
                <tp-stat-card label="Goals" [value]="dashboard.goals.length" icon="pi pi-flag" trend="Personal goals" />
                <tp-stat-card
                  label="Feedback"
                  [value]="dashboard.recentFeedback.length"
                  icon="pi pi-comments"
                  trend="Recent notes"
                />
              </section>

              <section class="dashboard-grid">
                <tp-section-card title="Profile Summary" subtitle="Role, skills, scores, and team context.">
                  <div class="profile-panel">
                    <div>
                      <strong>{{ profile.fullName }}</strong>
                      <span>{{ profile.role }} &middot; {{ profile.seniority }}</span>
                    </div>
                    <tp-score-badge [score]="profile.performanceScore" />
                    <tp-risk-badge [risk]="profile.riskLevel" />
                  </div>
                </tp-section-card>

                <tp-section-card title="Team Overview" subtitle="The team connected to your profile.">
                  @if (dashboard.team; as team) {
                    <article class="team-focus">
                      <h3>{{ team.name }}</h3>
                      <p>{{ team.mission }}</p>
                      <div class="team-scores">
                        <span>Health {{ team.healthScore }}</span>
                        <span>Delivery {{ team.deliveryScore }}</span>
                        <span>Engagement {{ team.engagementScore }}</span>
                      </div>
                    </article>
                  }
                </tp-section-card>

                <tp-section-card title="Own Goals" subtitle="Your active development and delivery goals." id="goals">
                  <div class="goal-list">
                    @for (goal of dashboard.goals; track goal.id) {
                      <article>
                        <div>
                          <strong>{{ goal.title }}</strong>
                          <span>{{ goal.status }} &middot; due {{ goal.dueDate | friendlyDate }}</span>
                        </div>
                        <p-progressbar [value]="goal.progress" />
                      </article>
                    } @empty {
                      <tp-empty-state title="No goals yet" message="Member goals will appear here." />
                    }
                  </div>
                </tp-section-card>

                <tp-section-card title="Own Recent Feedback" subtitle="Recent feedback attached to your member profile." id="feedback">
                  <div class="feedback-list">
                    @for (item of dashboard.recentFeedback; track item.id) {
                      <article>
                        <p-tag [value]="item.type" severity="info" />
                        <p>{{ item.message }}</p>
                        <small>{{ item.createdAt | friendlyDate }}</small>
                      </article>
                    } @empty {
                      <tp-empty-state title="No feedback yet" message="Feedback will appear here." />
                    }
                  </div>
                </tp-section-card>

                <tp-section-card title="Evaluation Trend" subtitle="Score movement from evaluation history.">
                  @if (memberEvaluationChart(); as chartData) {
                    <div class="chart-shell">
                      <p-chart type="bar" [data]="chartData" [options]="barChartOptions" />
                    </div>
                  }
                  <div class="trend-list">
                    @for (evaluation of memberEvaluations(); track evaluation.id) {
                      <article>
                        <span>{{ evaluation.period }}</span>
                        <div>
                          <label>Technical</label>
                          <p-progressbar [value]="evaluation.technicalScore" />
                        </div>
                        <div>
                          <label>Delivery</label>
                          <p-progressbar [value]="evaluation.deliveryScore" />
                        </div>
                      </article>
                    } @empty {
                      <tp-empty-state title="No evaluations yet" message="Evaluation history will appear here when records are available." />
                    }
                  </div>
                </tp-section-card>

                <tp-section-card title="Skills Summary" subtitle="Skills from your member profile.">
                  <div class="skill-cloud">
                    @for (skill of profile.skills; track skill) {
                      <span>{{ skill }}</span>
                    }
                  </div>
                </tp-section-card>

                <tp-section-card title="Quick Links" subtitle="Move through your most useful TeamPulse views.">
                  <div class="quick-links">
                    <a pButton [routerLink]="['/members', profile.id]" icon="pi pi-user" label="Own Profile"></a>
                    <a pButton routerLink="/dashboard" fragment="goals" icon="pi pi-flag" label="Own Goals" severity="secondary"></a>
                    <a
                      pButton
                      routerLink="/dashboard"
                      fragment="feedback"
                      icon="pi pi-comments"
                      label="Own Feedback"
                      severity="secondary"
                    ></a>
                    <a pButton routerLink="/learning/angular" icon="pi pi-bolt" label="Learning Lab" severity="secondary"></a>
                  </div>
                </tp-section-card>
              </section>
            }
          </section>
        }
      }
    }
  `,
  styles: [
    `
      .dashboard {
        display: grid;
        gap: var(--tp-space-5);
      }

      .stat-grid {
        display: grid;
        grid-template-columns: repeat(6, minmax(0, 1fr));
        gap: var(--tp-space-4);
      }

      .dashboard-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--tp-space-5);
        align-items: start;
      }

      .manager-grid {
        grid-template-columns: minmax(0, 1.1fr) minmax(22rem, 0.9fr);
      }

      .dashboard-column {
        display: grid;
        gap: var(--tp-space-5);
        min-width: 0;
      }

      .team-health-list,
      .goal-list,
      .feedback-list,
      .trend-list {
        display: grid;
        gap: var(--tp-space-3);
      }

      .chart-shell {
        min-height: 17rem;
        margin-bottom: var(--tp-space-4);
        border: 2px solid var(--tp-ink);
        border-radius: var(--tp-radius-sm);
        background:
          linear-gradient(135deg, color-mix(in srgb, var(--tp-accent) 10%, transparent), transparent 45%),
          var(--tp-surface);
        padding: var(--tp-space-3);
      }

      .compact-chart {
        display: grid;
        min-height: 15rem;
        place-items: center;
      }

      .team-row,
      .goal-list article,
      .feedback-list article,
      .trend-list article,
      .profile-panel {
        display: grid;
        gap: var(--tp-space-3);
        border: 2px solid var(--tp-ink);
        border-radius: var(--tp-radius-sm);
        background: color-mix(in srgb, var(--tp-accent) 7%, var(--tp-panel));
        padding: var(--tp-space-4);
      }

      .team-row {
        grid-template-columns: minmax(0, 1fr) minmax(6rem, auto) minmax(5.5rem, 0.38fr) auto;
        align-items: center;
        column-gap: var(--tp-space-4);
      }

      .team-row span {
        display: block;
        overflow-wrap: anywhere;
      }

      .goal-list article > div,
      .profile-panel > div {
        display: grid;
        gap: var(--tp-space-1);
        min-width: 0;
      }

      .goal-list strong {
        overflow-wrap: anywhere;
      }

      strong,
      label {
        font-weight: 900;
      }

      span,
      small,
      p {
        color: var(--tp-muted);
      }

      p {
        margin: 0;
        line-height: 1.55;
      }

      .bar-list {
        display: grid;
        gap: var(--tp-space-3);
      }

      .bar-row {
        display: grid;
        grid-template-columns: 8rem 1fr 2rem;
        gap: var(--tp-space-3);
        align-items: center;
      }

      .bar-track {
        height: 1.25rem;
        border: 2px solid var(--tp-ink);
        background: var(--tp-surface);
      }

      .bar-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--tp-accent), var(--tp-hot));
      }

      .skill-cloud,
      .quick-links,
      .team-scores {
        display: flex;
        flex-wrap: wrap;
        gap: var(--tp-space-3);
      }

      .skill-cloud span,
      .team-scores span {
        border: 2px solid var(--tp-ink);
        border-radius: var(--tp-radius-sm);
        background: var(--tp-warning);
        box-shadow: var(--tp-shadow-xs);
        color: #121212;
        font-weight: 900;
        padding: 0.5rem 0.7rem;
      }

      .skill-cloud strong {
        margin-left: 0.35rem;
      }

      .team-focus h3 {
        margin: 0;
        font-size: 2rem;
      }

      .team-focus {
        display: grid;
        gap: 1rem;
      }

      @media (max-width: 1260px) {
        .stat-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .manager-grid {
          grid-template-columns: 1fr;
        }

        .team-row {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 860px) {
        .stat-grid,
        .dashboard-grid {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class DashboardPageComponent {
  // Learning Lab: Dependency injection
  // The page asks Angular for the services it needs instead of constructing them manually.
  protected readonly auth = inject(AuthService);
  private readonly dashboardApi = inject(DashboardApiService);
  private readonly evaluationsApi = inject(EvaluationsApiService);
  private readonly goalsApi = inject(GoalsApiService);
  private readonly membersApi = inject(MembersApiService);
  private readonly router = inject(Router);

  protected readonly loading = signal(true);
  // Learning Lab: Signals
  // Loaded API data lives in signals so the template and chart computed values update reactively.
  protected readonly managerDashboard = signal<ManagerDashboard | null>(null);
  protected readonly memberDashboard = signal<MemberDashboard | null>(null);
  protected readonly members = signal<MemberProfile[]>([]);
  protected readonly goals = signal<Goal[]>([]);
  protected readonly evaluations = signal<Evaluation[]>([]);
  protected readonly memberEvaluations = signal<Evaluation[]>([]);
  protected readonly isManager = computed(() => this.auth.hasRole('Manager'));

  protected readonly barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#7b8492',
          font: { weight: 'bold' }
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(120, 130, 150, 0.18)' },
        ticks: { color: '#7b8492', font: { weight: 'bold' } }
      },
      y: {
        beginAtZero: true,
        max: 100,
        grid: { color: 'rgba(120, 130, 150, 0.18)' },
        ticks: { color: '#7b8492', font: { weight: 'bold' } }
      }
    }
  };

  protected readonly doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#7b8492',
          font: { weight: 'bold' }
        }
      }
    },
    cutout: '62%'
  };

  protected readonly evaluationCompletion = computed(() => {
    // Learning Lab: computed()
    // The percentage is derived from signals; it recalculates when dashboard or evaluations data changes.
    const memberCount = this.managerDashboard()?.memberCount ?? 0;
    if (!memberCount) {
      return 0;
    }

    return Math.round((this.evaluations().length / memberCount) * 100);
  });

  protected readonly goalsProgress = computed(() => {
    const goals = this.goals();
    if (!goals.length) {
      return 0;
    }

    return Math.round(goals.reduce((total, goal) => total + goal.progress, 0) / goals.length);
  });

  protected readonly skillsDistribution = computed<SkillCount[]>(() => {
    const counts = new Map<string, number>();
    for (const member of this.members()) {
      for (const skill of member.skills) {
        counts.set(skill, (counts.get(skill) ?? 0) + 1);
      }
    }

    return [...counts.entries()]
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  });

  protected readonly membersByTeam = computed<TeamMemberCount[]>(() => {
    const dashboard = this.managerDashboard();
    if (!dashboard) {
      return [];
    }

    return dashboard.teams.map((team) => ({
      team,
      count: this.members().filter((member) => member.teamId === team.id).length
    }));
  });

  protected readonly teamHealthChart = computed<ChartData<'bar'>>(() => {
    // Learning Lab: PrimeNG charts + Chart.js
    // PrimeNG renders the chart, while Chart.js types keep the data structure honest.
    const teams = this.managerDashboard()?.teams ?? [];

    return {
      labels: teams.map((team) => team.name),
      datasets: [
        {
          label: 'Health',
          data: teams.map((team) => team.healthScore),
          backgroundColor: '#00d1ff',
          borderColor: '#121212',
          borderWidth: 2
        },
        {
          label: 'Delivery',
          data: teams.map((team) => team.deliveryScore),
          backgroundColor: '#ff4ecd',
          borderColor: '#121212',
          borderWidth: 2
        },
        {
          label: 'Engagement',
          data: teams.map((team) => team.engagementScore),
          backgroundColor: '#65ffb5',
          borderColor: '#121212',
          borderWidth: 2
        }
      ]
    };
  });

  protected readonly membersByTeamChart = computed<ChartData<'doughnut'>>(() => {
    const items = this.membersByTeam();

    return {
      labels: items.map((item) => item.team.name),
      datasets: [
        {
          data: items.map((item) => item.count),
          backgroundColor: ['#00d1ff', '#ff4ecd', '#65ffb5', '#ffe45e', '#ff7a7d'],
          borderColor: '#121212',
          borderWidth: 2
        }
      ]
    };
  });

  protected readonly goalStatusChart = computed<ChartData<'doughnut'>>(() => {
    const statusOrder = ['NotStarted', 'InProgress', 'Blocked', 'Completed'];
    const counts = new Map(statusOrder.map((status) => [status, 0]));

    for (const goal of this.goals()) {
      counts.set(goal.status, (counts.get(goal.status) ?? 0) + 1);
    }

    return {
      labels: statusOrder,
      datasets: [
        {
          data: statusOrder.map((status) => counts.get(status) ?? 0),
          backgroundColor: ['#d9dee7', '#00d1ff', '#ff7a7d', '#65ffb5'],
          borderColor: '#121212',
          borderWidth: 2
        }
      ]
    };
  });

  protected readonly memberEvaluationChart = computed<ChartData<'bar'> | null>(() => {
    const latest = this.memberEvaluations()[0] ?? this.memberDashboard()?.latestEvaluation;
    if (!latest) {
      return null;
    }

    return {
      labels: ['Technical', 'Communication', 'Ownership', 'Teamwork', 'Delivery'],
      datasets: [
        {
          label: latest.period,
          data: [
            latest.technicalScore,
            latest.communicationScore,
            latest.ownershipScore,
            latest.teamworkScore,
            latest.deliveryScore
          ],
          backgroundColor: ['#00d1ff', '#ff4ecd', '#65ffb5', '#ffe45e', '#ff7a7d'],
          borderColor: '#121212',
          borderWidth: 2
        }
      ]
    };
  });

  constructor() {
    const user = this.auth.currentUser();

    if (this.isManager()) {
      // Learning Lab: RxJS forkJoin()
      // Manager dashboard data loads in parallel and updates signals once all requests complete.
      forkJoin({
        dashboard: this.dashboardApi.getManagerDashboard(),
        members: this.membersApi.getMembers(),
        goals: this.goalsApi.getGoals(),
        evaluations: this.evaluationsApi.getEvaluations()
      }).subscribe({
        next: ({ dashboard, members, goals, evaluations }) => {
          this.managerDashboard.set(dashboard);
          this.members.set(members);
          this.goals.set(goals);
          this.evaluations.set(evaluations);
        },
        error: () => this.loading.set(false),
        complete: () => this.loading.set(false)
      });
    } else if (user) {
      this.dashboardApi.getMemberDashboard(user.userId).pipe(
        switchMap((dashboard) => {
          // Learning Lab: RxJS switchMap()
          // The second request depends on the member profile returned by the first dashboard request.
          this.memberDashboard.set(dashboard);
          if (!dashboard.profile) {
            return of<Evaluation[]>([]);
          }
          return this.evaluationsApi.getMemberEvaluations(dashboard.profile.id);
        })
      ).subscribe({
        next: (evaluations) => this.memberEvaluations.set(evaluations),
        error: () => this.loading.set(false),
        complete: () => this.loading.set(false)
      });
    }
  }

  protected memberBarWidth(count: number): number {
    const max = Math.max(...this.membersByTeam().map((item) => item.count), 1);
    return Math.round((count / max) * 100);
  }

  protected goToTeams(): void {
    this.router.navigateByUrl('/teams');
  }
}
