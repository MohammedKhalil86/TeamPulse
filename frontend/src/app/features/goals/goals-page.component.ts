import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { GoalsApiService } from '../../core/api/goals-api.service';
import { MembersApiService } from '../../core/api/members-api.service';
import { TeamsApiService } from '../../core/api/teams-api.service';
import { AuthService } from '../../core/auth/auth.service';
import { Goal, GoalStatus, MemberProfile, OwnerType, Team } from '../../core/models/team-pulse.models';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { SectionCardComponent } from '../../shared/components/section-card/section-card.component';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { FriendlyDatePipe } from '../../shared/pipes/friendly-date.pipe';

@Component({
  selector: 'tp-goals-page',
  standalone: true,
  imports: [
    ButtonModule,
    DatePickerModule,
    DialogModule,
    EmptyStateComponent,
    FormsModule,
    FriendlyDatePipe,
    InputNumberModule,
    InputTextModule,
    LoadingStateComponent,
    PageHeaderComponent,
    ProgressBarModule,
    ReactiveFormsModule,
    SectionCardComponent,
    SelectModule,
    StatCardComponent,
    TableModule,
    TagModule,
    TextareaModule,
    ToastModule
  ],
  template: `
    <p-toast />
    @if (loading()) {
      <tp-loading-state variant="skeleton" />
    } @else {
      <tp-page-header
        eyebrow="Goals"
        title="Delivery and growth tracker"
        [subtitle]="isManager() ? 'Manage team and member goals from seeded data.' : 'Track your own seeded goals.'"
        [actionLabel]="isManager() ? 'Add Goal' : ''"
        actionIcon="pi pi-flag"
        (action)="openCreateDialog()"
      />

      <section class="stat-grid">
        <tp-stat-card label="Goals" [value]="filteredGoals().length" icon="pi pi-flag" trend="Visible goals" />
        <tp-stat-card label="Avg Progress" [value]="averageProgress() + '%'" icon="pi pi-chart-line" trend="Filtered set" />
        <tp-stat-card label="Blocked" [value]="blockedCount()" icon="pi pi-exclamation-triangle" trend="Needs action" />
        <tp-stat-card label="Completed" [value]="completedCount()" icon="pi pi-check-circle" trend="Done" />
      </section>

      <tp-section-card title="Goal Filters" subtitle="Filter by status, owner type, and owner.">
        <div class="toolbar">
          <input pInputText type="search" placeholder="Search goals" [value]="search()" (input)="search.set($any($event.target).value)" />
          <p-select [options]="statusOptions" [ngModel]="statusFilter()" (ngModelChange)="statusFilter.set($event)" placeholder="Status" [showClear]="true" />
          <p-select
            [options]="ownerTypeOptions"
            [ngModel]="ownerTypeFilter()"
            (ngModelChange)="ownerTypeFilter.set($event); ownerFilter.set(null)"
            placeholder="Owner type"
            [showClear]="true"
            [disabled]="!isManager()"
          />
          <p-select
            [options]="ownerOptions()"
            [ngModel]="ownerFilter()"
            (ngModelChange)="ownerFilter.set($event)"
            optionLabel="label"
            optionValue="value"
            placeholder="Owner"
            [showClear]="true"
            [disabled]="!isManager()"
          />
        </div>
      </tp-section-card>

      <tp-section-card title="Goals Table" subtitle="Progress bars and owner context are backed by the Minimal API.">
        @if (filteredGoals().length) {
          <p-table [value]="filteredGoals()" [paginator]="true" [rows]="10" [sortMode]="'multiple'" responsiveLayout="scroll">
            <ng-template #header>
              <tr>
                <th pSortableColumn="title">Title <p-sortIcon field="title" /></th>
                <th>Owner</th>
                <th>Status</th>
                <th pSortableColumn="progress">Progress <p-sortIcon field="progress" /></th>
                <th>Due</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </ng-template>
            <ng-template #body let-goal>
              <tr>
                <td>{{ goal.title }}</td>
                <td>{{ ownerLabel(goal) }}</td>
                <td><p-tag [value]="goal.status" [severity]="goalSeverity(goal.status)" /></td>
                <td class="progress-cell"><p-progressbar [value]="goal.progress" /></td>
                <td>{{ goal.dueDate | friendlyDate }}</td>
                <td class="description">{{ goal.description }}</td>
                <td>
                  @if (isManager()) {
                    <div class="row-actions">
                      <button pButton type="button" icon="pi pi-pencil" [text]="true" (click)="openEditDialog(goal)"></button>
                      <button pButton type="button" icon="pi pi-trash" severity="danger" [text]="true" (click)="deleteGoal(goal)"></button>
                    </div>
                  }
                </td>
              </tr>
            </ng-template>
          </p-table>
        } @else {
          <tp-empty-state title="No goals found" message="Adjust status, owner, or text filters." />
        }
      </tp-section-card>

      <p-dialog
        [header]="editingGoalId() ? 'Edit Goal' : 'Add Goal'"
        [modal]="true"
        [visible]="dialogVisible()"
        (visibleChange)="dialogVisible.set($event)"
        [style]="{ width: 'min(48rem, calc(100vw - 2rem))' }"
      >
        <form class="goal-form" [formGroup]="goalForm" (ngSubmit)="saveGoal()">
          <label>Title <input pInputText formControlName="title" /></label>
          <label>Description <textarea pTextarea formControlName="description" rows="3"></textarea></label>
          <div class="form-grid">
            <label>
              Owner Type
              <p-select formControlName="ownerType" [options]="ownerTypeOptions" />
            </label>
            <label>
              Owner
              <p-select formControlName="ownerId" [options]="formOwnerOptions()" optionLabel="label" optionValue="value" />
            </label>
          </div>
          <div class="form-grid">
            <label>Progress <p-inputnumber formControlName="progress" [min]="0" [max]="100" /></label>
            <label>
              Status
              <p-select formControlName="status" [options]="statusOptions" />
            </label>
          </div>
          <label>Due Date <p-datepicker formControlName="dueDate" [showIcon]="true" /></label>
          <div class="dialog-actions">
            <button pButton type="button" label="Cancel" severity="secondary" (click)="dialogVisible.set(false)"></button>
            <button pButton type="submit" label="Save Goal" icon="pi pi-check" [disabled]="goalForm.invalid"></button>
          </div>
        </form>
      </p-dialog>
    }
  `,
  styles: [
    `
      .stat-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .toolbar,
      .row-actions,
      .dialog-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        align-items: center;
      }

      .progress-cell {
        min-width: 12rem;
      }

      .description {
        min-width: 18rem;
      }

      .goal-form {
        display: grid;
        gap: 1rem;
      }

      .form-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 1rem;
      }

      label {
        display: grid;
        gap: 0.35rem;
        font-weight: 900;
      }

      .dialog-actions {
        justify-content: flex-end;
      }

      @media (max-width: 860px) {
        .stat-grid,
        .form-grid {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class GoalsPageComponent {
  private readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly goalsApi = inject(GoalsApiService);
  private readonly membersApi = inject(MembersApiService);
  private readonly messages = inject(MessageService);
  private readonly teamsApi = inject(TeamsApiService);

  protected readonly loading = signal(true);
  protected readonly goals = signal<Goal[]>([]);
  protected readonly members = signal<MemberProfile[]>([]);
  protected readonly teams = signal<Team[]>([]);
  protected readonly search = signal('');
  protected readonly statusFilter = signal<GoalStatus | null>(null);
  protected readonly ownerTypeFilter = signal<OwnerType | null>(null);
  protected readonly ownerFilter = signal<number | null>(null);
  protected readonly dialogVisible = signal(false);
  protected readonly editingGoalId = signal<number | null>(null);
  protected readonly isManager = computed(() => this.auth.hasRole('Manager'));
  protected readonly statusOptions: GoalStatus[] = ['NotStarted', 'InProgress', 'Blocked', 'Completed'];
  protected readonly ownerTypeOptions: OwnerType[] = ['Team', 'Member'];

  protected readonly visibleGoals = computed(() => {
    if (this.isManager()) {
      return this.goals();
    }

    const ownMember = this.ownMember();
    return ownMember ? this.goals().filter((goal) => goal.ownerType === 'Member' && goal.ownerId === ownMember.id) : [];
  });

  protected readonly filteredGoals = computed(() => {
    const term = this.search().trim().toLowerCase();
    return this.visibleGoals().filter((goal) => {
      const matchesText =
        !term ||
        goal.title.toLowerCase().includes(term) ||
        goal.description.toLowerCase().includes(term) ||
        this.ownerLabel(goal).toLowerCase().includes(term);
      const matchesStatus = !this.statusFilter() || goal.status === this.statusFilter();
      const matchesOwnerType = !this.ownerTypeFilter() || goal.ownerType === this.ownerTypeFilter();
      const matchesOwner = !this.ownerFilter() || goal.ownerId === this.ownerFilter();
      return matchesText && matchesStatus && matchesOwnerType && matchesOwner;
    });
  });

  protected readonly ownerOptions = computed(() => this.optionsForOwnerType(this.ownerTypeFilter()));
  protected readonly formOwnerOptions = computed(() => this.optionsForOwnerType(this.goalForm.controls.ownerType.value));

  protected readonly averageProgress = computed(() => {
    const goals = this.filteredGoals();
    if (!goals.length) {
      return 0;
    }

    return Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length);
  });

  protected readonly blockedCount = computed(() => this.filteredGoals().filter((goal) => goal.status === 'Blocked').length);
  protected readonly completedCount = computed(() => this.filteredGoals().filter((goal) => goal.status === 'Completed').length);

  protected readonly goalForm = this.fb.nonNullable.group({
    title: ['', Validators.required],
    description: ['', [Validators.required, Validators.minLength(8)]],
    ownerType: this.fb.nonNullable.control<OwnerType>('Team', Validators.required),
    ownerId: [1, Validators.required],
    progress: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
    status: this.fb.nonNullable.control<GoalStatus>('NotStarted', Validators.required),
    dueDate: this.fb.control<Date | null>(new Date(), Validators.required)
  });

  constructor() {
    forkJoin({
      goals: this.goalsApi.getGoals(),
      members: this.membersApi.getMembers(),
      teams: this.teamsApi.getTeams()
    }).subscribe({
      next: ({ goals, members, teams }) => {
        this.goals.set(goals);
        this.members.set(members);
        this.teams.set(teams);
      },
      complete: () => this.loading.set(false)
    });
  }

  protected ownerLabel(goal: Goal): string {
    if (goal.ownerType === 'Team') {
      return this.teams().find((team) => team.id === goal.ownerId)?.name ?? `Team ${goal.ownerId}`;
    }

    return this.members().find((member) => member.id === goal.ownerId)?.fullName ?? `Member ${goal.ownerId}`;
  }

  protected goalSeverity(status: GoalStatus): 'success' | 'warn' | 'danger' | 'info' | 'secondary' {
    if (status === 'Completed') {
      return 'success';
    }

    if (status === 'Blocked') {
      return 'danger';
    }

    return status === 'InProgress' ? 'info' : 'secondary';
  }

  protected openCreateDialog(): void {
    this.editingGoalId.set(null);
    this.goalForm.reset({
      title: '',
      description: '',
      ownerType: 'Team',
      ownerId: this.teams()[0]?.id ?? 1,
      progress: 0,
      status: 'NotStarted',
      dueDate: new Date()
    });
    this.dialogVisible.set(true);
  }

  protected openEditDialog(goal: Goal): void {
    this.editingGoalId.set(goal.id);
    this.goalForm.setValue({
      title: goal.title,
      description: goal.description,
      ownerType: goal.ownerType,
      ownerId: goal.ownerId,
      progress: goal.progress,
      status: goal.status,
      dueDate: new Date(goal.dueDate)
    });
    this.dialogVisible.set(true);
  }

  protected saveGoal(): void {
    if (this.goalForm.invalid) {
      this.goalForm.markAllAsTouched();
      return;
    }

    const value = this.goalForm.getRawValue();
    const goal: Goal = {
      id: this.editingGoalId() ?? 0,
      title: value.title,
      description: value.description,
      ownerType: value.ownerType,
      ownerId: value.ownerId,
      progress: value.progress,
      status: value.status,
      dueDate: toIsoDate(value.dueDate ?? new Date())
    };
    const request = this.editingGoalId() ? this.goalsApi.updateGoal(this.editingGoalId()!, goal) : this.goalsApi.createGoal(goal);

    request.subscribe((saved) => {
      this.goals.update((goals) =>
        this.editingGoalId() ? goals.map((item) => (item.id === saved.id ? saved : item)) : [saved, ...goals]
      );
      this.dialogVisible.set(false);
      this.messages.add({ severity: 'success', summary: 'Goal saved', detail: saved.title });
    });
  }

  protected deleteGoal(goal: Goal): void {
    this.goalsApi.deleteGoal(goal.id).subscribe(() => {
      this.goals.update((goals) => goals.filter((item) => item.id !== goal.id));
      this.messages.add({ severity: 'success', summary: 'Goal deleted', detail: goal.title });
    });
  }

  private optionsForOwnerType(ownerType: OwnerType | null) {
    if (ownerType === 'Member') {
      return this.members().map((member) => ({ label: member.fullName, value: member.id }));
    }

    return this.teams().map((team) => ({ label: team.name, value: team.id }));
  }

  private ownMember(): MemberProfile | undefined {
    const session = this.auth.currentUser();
    return this.members().find((member) => member.userId === session?.userId);
  }
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
