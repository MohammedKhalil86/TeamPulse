import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';
import { AuthService } from '../../core/auth/auth.service';
import { MembersApiService } from '../../core/api/members-api.service';
import { TeamsApiService } from '../../core/api/teams-api.service';
import { UsersApiService } from '../../core/api/users-api.service';
import { MemberProfile, RiskLevel, Team, User } from '../../core/models/team-pulse.models';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { RiskBadgeComponent } from '../../shared/components/risk-badge/risk-badge.component';
import { ScoreBadgeComponent } from '../../shared/components/score-badge/score-badge.component';
import { SectionCardComponent } from '../../shared/components/section-card/section-card.component';

@Component({
  selector: 'tp-teams-page',
  standalone: true,
  imports: [
    ButtonModule,
    DialogModule,
    EmptyStateComponent,
    FormsModule,
    InputNumberModule,
    InputTextModule,
    LoadingStateComponent,
    PageHeaderComponent,
    ReactiveFormsModule,
    RiskBadgeComponent,
    RouterLink,
    ScoreBadgeComponent,
    SectionCardComponent,
    SelectModule,
    TableModule,
    TextareaModule
  ],
  template: `
    @if (loading()) {
      <tp-loading-state variant="skeleton" />
    } @else {
      <tp-page-header
        eyebrow="Teams"
        title="Squad operating map"
        subtitle="Search, compare, and maintain engineering teams using seeded Minimal API data."
        [actionLabel]="isManager() ? 'Add Team' : ''"
        actionIcon="pi pi-plus"
        (action)="openCreateDialog()"
      />

      <tp-section-card title="Teams Directory" subtitle="Health, delivery, engagement, risk, managers, and member counts.">
        <div class="toolbar">
          <input pInputText type="search" placeholder="Search teams" [value]="search()" (input)="search.set($any($event.target).value)" />
          <p-select
            [options]="riskOptions"
            [ngModel]="riskFilter()"
            (ngModelChange)="riskFilter.set($event)"
            placeholder="Risk"
            [showClear]="true"
          />
        </div>

        @if (filteredTeams().length) {
          <p-table [value]="filteredTeams()" [paginator]="true" [rows]="8" [sortMode]="'multiple'" responsiveLayout="scroll">
            <ng-template #header>
              <tr>
                <th pSortableColumn="name">Team <p-sortIcon field="name" /></th>
                <th>Manager</th>
                <th>Mission</th>
                <th pSortableColumn="healthScore">Health <p-sortIcon field="healthScore" /></th>
                <th pSortableColumn="deliveryScore">Delivery <p-sortIcon field="deliveryScore" /></th>
                <th pSortableColumn="engagementScore">Engagement <p-sortIcon field="engagementScore" /></th>
                <th>Risk</th>
                <th>Members</th>
                <th>Actions</th>
              </tr>
            </ng-template>
            <ng-template #body let-team>
              <tr>
                <td><a [routerLink]="['/teams', team.id]">{{ team.name }}</a></td>
                <td>{{ managerName(team.managerId) }}</td>
                <td class="mission">{{ team.mission }}</td>
                <td><tp-score-badge [score]="team.healthScore" /></td>
                <td><tp-score-badge [score]="team.deliveryScore" /></td>
                <td><tp-score-badge [score]="team.engagementScore" /></td>
                <td><tp-risk-badge [risk]="team.riskLevel" /></td>
                <td>{{ memberCount(team.id) }}</td>
                <td>
                  <div class="row-actions">
                    <a pButton [routerLink]="['/teams', team.id]" icon="pi pi-eye" [text]="true" aria-label="View team"></a>
                    @if (isManager()) {
                      <button pButton type="button" icon="pi pi-pencil" [text]="true" aria-label="Edit team" (click)="openEditDialog(team)"></button>
                      <button
                        pButton
                        type="button"
                        icon="pi pi-trash"
                        severity="danger"
                        [text]="true"
                        aria-label="Delete team"
                        (click)="deleteTeam(team)"
                      ></button>
                    }
                  </div>
                </td>
              </tr>
            </ng-template>
          </p-table>
        } @else {
          <tp-empty-state icon="pi pi-search" title="No teams found" message="Adjust the search or risk filter." />
        }
      </tp-section-card>

      <p-dialog
        [header]="editingTeamId() ? 'Edit Team' : 'Add Team'"
        [modal]="true"
        [visible]="dialogVisible()"
        (visibleChange)="dialogVisible.set($event)"
        [style]="{ width: 'min(46rem, calc(100vw - 2rem))' }"
      >
        <form class="team-form" [formGroup]="teamForm" (ngSubmit)="saveTeam()">
          <label>Name <input pInputText formControlName="name" /></label>
          <label>Mission <textarea pTextarea formControlName="mission" rows="3"></textarea></label>
          <label>
            Manager
            <p-select formControlName="managerId" [options]="managerOptions()" optionLabel="label" optionValue="value" />
          </label>
          <div class="form-grid">
            <label>Health <p-inputnumber formControlName="healthScore" [min]="0" [max]="100" /></label>
            <label>Delivery <p-inputnumber formControlName="deliveryScore" [min]="0" [max]="100" /></label>
            <label>Engagement <p-inputnumber formControlName="engagementScore" [min]="0" [max]="100" /></label>
          </div>
          <label>
            Risk
            <p-select formControlName="riskLevel" [options]="riskOptions" />
          </label>
          <div class="dialog-actions">
            <button pButton type="button" label="Cancel" severity="secondary" (click)="dialogVisible.set(false)"></button>
            <button pButton type="submit" label="Save Team" icon="pi pi-check" [disabled]="teamForm.invalid"></button>
          </div>
        </form>
      </p-dialog>
    }
  `,
  styles: [
    `
      .toolbar,
      .row-actions,
      .dialog-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        align-items: center;
      }

      .toolbar {
        justify-content: space-between;
        margin-bottom: 1rem;
      }

      .mission {
        min-width: 18rem;
      }

      .team-form {
        display: grid;
        gap: 1rem;
      }

      label {
        display: grid;
        gap: 0.35rem;
        font-weight: 900;
      }

      .form-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 1rem;
      }

      .dialog-actions {
        justify-content: flex-end;
      }

      @media (max-width: 760px) {
        .form-grid {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class TeamsPageComponent {
  private readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly membersApi = inject(MembersApiService);
  private readonly teamsApi = inject(TeamsApiService);
  private readonly usersApi = inject(UsersApiService);

  protected readonly loading = signal(true);
  protected readonly teams = signal<Team[]>([]);
  protected readonly members = signal<MemberProfile[]>([]);
  protected readonly users = signal<User[]>([]);
  protected readonly search = signal('');
  protected readonly riskFilter = signal<RiskLevel | null>(null);
  protected readonly dialogVisible = signal(false);
  protected readonly editingTeamId = signal<number | null>(null);
  protected readonly riskOptions: RiskLevel[] = ['Low', 'Medium', 'High'];
  protected readonly isManager = computed(() => this.auth.hasRole('Manager'));

  protected readonly managerOptions = computed(() =>
    this.users()
      .filter((user) => user.appRole === 'Manager')
      .map((user) => ({ label: user.fullName, value: user.id }))
  );

  protected readonly filteredTeams = computed(() => {
    const term = this.search().trim().toLowerCase();
    return this.teams().filter((team) => {
      const matchesSearch =
        !term ||
        team.name.toLowerCase().includes(term) ||
        team.mission.toLowerCase().includes(term) ||
        this.managerName(team.managerId).toLowerCase().includes(term);
      const matchesRisk = !this.riskFilter() || team.riskLevel === this.riskFilter();
      return matchesSearch && matchesRisk;
    });
  });

  protected readonly teamForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    mission: ['', Validators.required],
    managerId: [1, Validators.required],
    healthScore: [80, [Validators.required, Validators.min(0), Validators.max(100)]],
    deliveryScore: [80, [Validators.required, Validators.min(0), Validators.max(100)]],
    engagementScore: [80, [Validators.required, Validators.min(0), Validators.max(100)]],
    riskLevel: this.fb.nonNullable.control<RiskLevel>('Low', Validators.required)
  });

  constructor() {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    forkJoin({
      teams: this.teamsApi.getTeams(),
      members: this.membersApi.getMembers(),
      users: this.usersApi.getUsers()
    }).subscribe({
      next: ({ teams, members, users }) => {
        this.teams.set(teams);
        this.members.set(members);
        this.users.set(users);
      },
      complete: () => this.loading.set(false)
    });
  }

  protected managerName(managerId: number): string {
    return this.users().find((user) => user.id === managerId)?.fullName ?? `Manager ${managerId}`;
  }

  protected memberCount(teamId: number): number {
    return this.members().filter((member) => member.teamId === teamId).length;
  }

  protected openCreateDialog(): void {
    this.editingTeamId.set(null);
    this.teamForm.reset({
      name: '',
      mission: '',
      managerId: this.managerOptions()[0]?.value ?? 1,
      healthScore: 80,
      deliveryScore: 80,
      engagementScore: 80,
      riskLevel: 'Low'
    });
    this.dialogVisible.set(true);
  }

  protected openEditDialog(team: Team): void {
    this.editingTeamId.set(team.id);
    this.teamForm.setValue({
      name: team.name,
      mission: team.mission,
      managerId: team.managerId,
      healthScore: team.healthScore,
      deliveryScore: team.deliveryScore,
      engagementScore: team.engagementScore,
      riskLevel: team.riskLevel
    });
    this.dialogVisible.set(true);
  }

  protected saveTeam(): void {
    if (this.teamForm.invalid) {
      return;
    }

    const value = this.teamForm.getRawValue();
    const team: Team = { id: this.editingTeamId() ?? 0, ...value };
    const request = this.editingTeamId()
      ? this.teamsApi.updateTeam(this.editingTeamId()!, team)
      : this.teamsApi.createTeam(team);

    request.subscribe((saved) => {
      this.teams.update((teams) =>
        this.editingTeamId() ? teams.map((team) => (team.id === saved.id ? saved : team)) : [...teams, saved]
      );
      this.dialogVisible.set(false);
    });
  }

  protected deleteTeam(team: Team): void {
    this.teamsApi.deleteTeam(team.id).subscribe(() => {
      this.teams.update((teams) => teams.filter((item) => item.id !== team.id));
    });
  }
}
