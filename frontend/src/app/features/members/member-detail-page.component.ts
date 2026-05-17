import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { EvaluationsApiService } from '../../core/api/evaluations-api.service';
import { FeedbackApiService } from '../../core/api/feedback-api.service';
import { GoalsApiService } from '../../core/api/goals-api.service';
import { MembersApiService } from '../../core/api/members-api.service';
import { NotesApiService } from '../../core/api/notes-api.service';
import { TeamsApiService } from '../../core/api/teams-api.service';
import { AuthService } from '../../core/auth/auth.service';
import { Evaluation, Feedback, Goal, MemberProfile, OneToOneNote, Team } from '../../core/models/team-pulse.models';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { RiskBadgeComponent } from '../../shared/components/risk-badge/risk-badge.component';
import { ScoreBadgeComponent } from '../../shared/components/score-badge/score-badge.component';
import { SectionCardComponent } from '../../shared/components/section-card/section-card.component';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { FriendlyDatePipe } from '../../shared/pipes/friendly-date.pipe';

@Component({
  selector: 'tp-member-detail-page',
  standalone: true,
  imports: [
    ButtonModule,
    DialogModule,
    EmptyStateComponent,
    FriendlyDatePipe,
    LoadingStateComponent,
    PageHeaderComponent,
    ProgressBarModule,
    ReactiveFormsModule,
    RiskBadgeComponent,
    RouterLink,
    ScoreBadgeComponent,
    SectionCardComponent,
    StatCardComponent,
    TableModule,
    TagModule,
    TextareaModule
  ],
  template: `
    @if (loading()) {
      <tp-loading-state variant="skeleton" />
    } @else if (restricted()) {
      <tp-empty-state
        icon="pi pi-lock"
        title="Profile access is limited"
        message="Team members can only view profile data relevant to their role."
        actionLabel="Back to Members"
        actionIcon="pi pi-arrow-left"
        (action)="backLink.click()"
      />
      <a #backLink routerLink="/members" hidden></a>
    } @else if (member(); as member) {
      <tp-page-header
        eyebrow="Member Profile"
        [title]="member.fullName"
        [subtitle]="member.role + ' - ' + member.seniority + ' - ' + teamName(member.teamId)"
        actionLabel="Back to Members"
        actionIcon="pi pi-arrow-left"
        (action)="backLink.click()"
      />
      <a #backLink routerLink="/members" hidden></a>

      <section class="stat-grid">
        <tp-stat-card label="Performance" [value]="member.performanceScore" icon="pi pi-chart-line" trend="Profile score" />
        <tp-stat-card label="Engagement" [value]="member.engagementScore" icon="pi pi-heart" trend="Engagement signal" />
        <tp-stat-card label="Evaluations" [value]="evaluations().length" icon="pi pi-star" trend="Review history" />
        <tp-stat-card label="Goals" [value]="goals().length" icon="pi pi-flag" trend="Personal goals" />
      </section>

      <section class="profile-grid">
        <tp-section-card title="Profile Header" subtitle="Core member profile fields.">
          <div class="profile-header">
            <div>
              <strong>{{ member.fullName }}</strong>
              <span>{{ member.role }} &middot; {{ member.seniority }}</span>
            </div>
            <tp-score-badge [score]="member.performanceScore" />
            <tp-risk-badge [risk]="member.riskLevel" />
          </div>
        </tp-section-card>

        <tp-section-card title="Skills" subtitle="Skills used for team planning and profile context.">
          <div class="skill-cloud">
            @for (skill of member.skills; track skill) {
              <span>{{ skill }}</span>
            }
          </div>
        </tp-section-card>
      </section>

      <section class="profile-grid">
        <tp-section-card title="Evaluations" subtitle="Technical, communication, ownership, teamwork, and delivery scores.">
          <p-table [value]="evaluations()" responsiveLayout="scroll">
            <ng-template #header>
              <tr><th>Period</th><th>Technical</th><th>Communication</th><th>Ownership</th><th>Teamwork</th><th>Delivery</th></tr>
            </ng-template>
            <ng-template #body let-evaluation>
              <tr>
                <td>{{ evaluation.period }}</td>
                <td>{{ evaluation.technicalScore }}</td>
                <td>{{ evaluation.communicationScore }}</td>
                <td>{{ evaluation.ownershipScore }}</td>
                <td>{{ evaluation.teamworkScore }}</td>
                <td>{{ evaluation.deliveryScore }}</td>
              </tr>
            </ng-template>
          </p-table>
        </tp-section-card>

        <tp-section-card title="Goals" subtitle="Personal goals and progress.">
          <div class="stack">
            @for (goal of goals(); track goal.id) {
              <article class="item-row">
                <div>
                  <strong>{{ goal.title }}</strong>
                  <span>{{ goal.status }} &middot; due {{ goal.dueDate | friendlyDate }}</span>
                </div>
                <p-progressbar [value]="goal.progress" />
              </article>
            } @empty {
              <tp-empty-state title="No goals" message="No personal goals are available for this member." />
            }
          </div>
        </tp-section-card>

        <tp-section-card title="Feedback" subtitle="Recognition, improvement, risk, and general feedback.">
          <div class="stack">
            @for (item of feedback(); track item.id) {
              <article class="item-row">
                <p-tag [value]="item.type" />
                <p>{{ item.message }}</p>
                <small>{{ item.createdAt | friendlyDate }}</small>
              </article>
            } @empty {
              <tp-empty-state title="No feedback" message="No feedback is available for this member." />
            }
          </div>
        </tp-section-card>

        <tp-section-card title="1:1 Notes" subtitle="Manager-owned coaching and follow-up notes.">
          @if (isManager()) {
            <button pButton type="button" icon="pi pi-plus" label="Add Note" (click)="openNoteDialog()"></button>
          }
          <div class="stack note-stack">
            @for (note of notes(); track note.id) {
              <article class="item-row">
                <p>{{ note.note }}</p>
                <small>{{ note.createdAt | friendlyDate }}</small>
                @if (isManager()) {
                  <button pButton type="button" icon="pi pi-trash" severity="danger" [text]="true" (click)="deleteNote(note)"></button>
                }
              </article>
            } @empty {
              <tp-empty-state title="No notes" message="Manager notes will appear here." />
            }
          </div>
        </tp-section-card>
      </section>

      <p-dialog
        header="Add 1:1 Note"
        [modal]="true"
        [visible]="noteDialogVisible()"
        (visibleChange)="noteDialogVisible.set($event)"
        [style]="{ width: 'min(38rem, calc(100vw - 2rem))' }"
      >
        <form class="note-form" [formGroup]="noteForm" (ngSubmit)="saveNote(member)">
          <label>Note <textarea pTextarea rows="5" formControlName="note"></textarea></label>
          <div class="dialog-actions">
            <button pButton type="button" label="Cancel" severity="secondary" (click)="noteDialogVisible.set(false)"></button>
            <button pButton type="submit" label="Save Note" icon="pi pi-check" [disabled]="noteForm.invalid"></button>
          </div>
        </form>
      </p-dialog>
    }
  `,
  styles: [
    `
      .stat-grid,
      .profile-grid {
        display: grid;
        gap: var(--tp-space-5);
        margin-bottom: var(--tp-space-5);
      }

      .stat-grid {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }

      .profile-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .profile-header,
      .item-row {
        display: grid;
        gap: var(--tp-space-3);
        border: 2px solid var(--tp-ink);
        border-radius: var(--tp-radius-sm);
        background: color-mix(in srgb, var(--tp-accent) 8%, var(--tp-panel));
        padding: var(--tp-space-4);
      }

      .profile-header {
        grid-template-columns: minmax(0, 1fr) auto auto;
        align-items: center;
        column-gap: var(--tp-space-5);
      }

      .profile-header > div,
      .item-row > div {
        display: grid;
        gap: var(--tp-space-1);
        min-width: 0;
      }

      .profile-header strong,
      .item-row strong {
        overflow-wrap: anywhere;
      }

      .skill-cloud {
        display: flex;
        flex-wrap: wrap;
        gap: var(--tp-space-3);
      }

      .skill-cloud span {
        border: 2px solid var(--tp-ink);
        border-radius: var(--tp-radius-sm);
        background: var(--tp-warning);
        box-shadow: var(--tp-shadow-xs);
        color: #121212;
        font-weight: 900;
        padding: 0.5rem 0.7rem;
      }

      .stack {
        display: grid;
        gap: var(--tp-space-3);
        margin-top: var(--tp-space-3);
      }

      .note-form {
        display: grid;
        gap: var(--tp-space-4);
      }

      label {
        display: grid;
        gap: var(--tp-space-2);
        font-weight: 900;
      }

      .dialog-actions {
        display: flex;
        justify-content: flex-end;
        gap: var(--tp-space-3);
      }

      span,
      small,
      p {
        color: var(--tp-muted);
      }

      @media (max-width: 960px) {
        .stat-grid,
        .profile-grid,
        .profile-header {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class MemberDetailPageComponent {
  private readonly auth = inject(AuthService);
  private readonly evaluationsApi = inject(EvaluationsApiService);
  private readonly fb = inject(FormBuilder);
  private readonly feedbackApi = inject(FeedbackApiService);
  private readonly goalsApi = inject(GoalsApiService);
  private readonly membersApi = inject(MembersApiService);
  private readonly notesApi = inject(NotesApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly teamsApi = inject(TeamsApiService);

  protected readonly loading = signal(true);
  protected readonly restricted = signal(false);
  protected readonly member = signal<MemberProfile | null>(null);
  protected readonly teams = signal<Team[]>([]);
  protected readonly evaluations = signal<Evaluation[]>([]);
  protected readonly goals = signal<Goal[]>([]);
  protected readonly feedback = signal<Feedback[]>([]);
  protected readonly notes = signal<OneToOneNote[]>([]);
  protected readonly noteDialogVisible = signal(false);
  protected readonly isManager = computed(() => this.auth.hasRole('Manager'));

  protected readonly noteForm = this.fb.nonNullable.group({
    note: ['', Validators.required]
  });

  constructor() {
    this.load();
  }

  protected load(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    forkJoin({
      member: this.membersApi.getMember(id),
      teams: this.teamsApi.getTeams(),
      evaluations: this.evaluationsApi.getMemberEvaluations(id),
      goals: this.goalsApi.getMemberGoals(id),
      feedback: this.feedbackApi.getMemberFeedback(id),
      notes: this.notesApi.getMemberNotes(id)
    }).subscribe({
      next: ({ member, teams, evaluations, goals, feedback, notes }) => {
        const session = this.auth.currentUser();
        const canView = this.isManager() || member.userId === session?.userId;
        this.restricted.set(!canView);
        this.member.set(canView ? member : null);
        this.teams.set(teams);
        this.evaluations.set(canView ? evaluations : []);
        this.goals.set(canView ? goals : []);
        this.feedback.set(canView ? feedback : []);
        this.notes.set(canView ? notes : []);
      },
      complete: () => this.loading.set(false)
    });
  }

  protected teamName(teamId: number): string {
    return this.teams().find((team) => team.id === teamId)?.name ?? `Team ${teamId}`;
  }

  protected openNoteDialog(): void {
    this.noteForm.reset({ note: '' });
    this.noteDialogVisible.set(true);
  }

  protected saveNote(member: MemberProfile): void {
    if (this.noteForm.invalid) {
      return;
    }

    const note: OneToOneNote = {
      id: 0,
      memberId: member.id,
      managerId: this.auth.currentUser()?.userId ?? 0,
      note: this.noteForm.getRawValue().note,
      createdAt: new Date().toISOString()
    };

    this.notesApi.createNote(note).subscribe((saved) => {
      this.notes.update((notes) => [saved, ...notes]);
      this.noteDialogVisible.set(false);
    });
  }

  protected deleteNote(note: OneToOneNote): void {
    this.notesApi.deleteNote(note.id).subscribe(() => {
      this.notes.update((notes) => notes.filter((item) => item.id !== note.id));
    });
  }
}
