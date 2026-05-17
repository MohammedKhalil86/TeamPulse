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
import { AuthService } from '../../core/auth/auth.service';
import { MembersApiService } from '../../core/api/members-api.service';
import { TeamsApiService } from '../../core/api/teams-api.service';
import { MemberProfile, RiskLevel, Seniority, Team } from '../../core/models/team-pulse.models';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { RiskBadgeComponent } from '../../shared/components/risk-badge/risk-badge.component';
import { ScoreBadgeComponent } from '../../shared/components/score-badge/score-badge.component';
import { SectionCardComponent } from '../../shared/components/section-card/section-card.component';
import { RiskHighlightDirective } from '../../shared/directives/risk-highlight.directive';
import { ScoreHighlightDirective } from '../../shared/directives/score-highlight.directive';

@Component({
  selector: 'tp-members-page',
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
    RiskHighlightDirective,
    RouterLink,
    ScoreBadgeComponent,
    ScoreHighlightDirective,
    SectionCardComponent,
    SelectModule,
    TableModule
  ],
  template: `
    @if (loading()) {
      <tp-loading-state variant="skeleton" />
    } @else {
      <tp-page-header
        eyebrow="Members"
        title="Engineering people grid"
        [subtitle]="isManager() ? 'Manage, filter, and understand every member profile.' : 'View the members connected to your team.'"
        [actionLabel]="isManager() ? 'Add Member' : ''"
        actionIcon="pi pi-user-plus"
        (action)="openCreateDialog()"
      />

      <tp-section-card title="Member Directory" subtitle="Pagination, sorting, filtering, and role-aware data visibility.">
        <div class="toolbar">
          <input pInputText type="search" placeholder="Global search" [value]="search()" (input)="search.set($any($event.target).value)" />
          <p-select [options]="riskOptions" [ngModel]="riskFilter()" (ngModelChange)="riskFilter.set($event)" placeholder="Risk" [showClear]="true" />
          <p-select
            [options]="seniorityOptions"
            [ngModel]="seniorityFilter()"
            (ngModelChange)="seniorityFilter.set($event)"
            placeholder="Seniority"
            [showClear]="true"
          />
          <p-select
            [options]="teamOptions()"
            [ngModel]="teamFilter()"
            (ngModelChange)="teamFilter.set($event)"
            optionLabel="label"
            optionValue="value"
            placeholder="Team"
            [showClear]="true"
            [disabled]="!isManager()"
          />
        </div>

        @if (filteredMembers().length) {
          <p-table
            [value]="filteredMembers()"
            [paginator]="true"
            [rows]="10"
            [rowsPerPageOptions]="[10, 20, 30]"
            [sortMode]="'multiple'"
            responsiveLayout="scroll"
          >
            <ng-template #header>
              <tr>
                <th pSortableColumn="fullName">Name <p-sortIcon field="fullName" /></th>
                <th pSortableColumn="role">Role <p-sortIcon field="role" /></th>
                <th pSortableColumn="seniority">Seniority <p-sortIcon field="seniority" /></th>
                <th>Team</th>
                <th pSortableColumn="performanceScore">Performance <p-sortIcon field="performanceScore" /></th>
                <th pSortableColumn="engagementScore">Engagement <p-sortIcon field="engagementScore" /></th>
                <th>Risk</th>
                <th>Skills</th>
                <th>Actions</th>
              </tr>
            </ng-template>
            <ng-template #body let-member>
              <tr [tpRiskHighlight]="member.riskLevel">
                <td><a [routerLink]="['/members', member.id]">{{ member.fullName }}</a></td>
                <td>{{ member.role }}</td>
                <td>{{ member.seniority }}</td>
                <td>{{ teamName(member.teamId) }}</td>
                <td [tpScoreHighlight]="member.performanceScore"><tp-score-badge [score]="member.performanceScore" /></td>
                <td [tpScoreHighlight]="member.engagementScore"><tp-score-badge [score]="member.engagementScore" /></td>
                <td><tp-risk-badge [risk]="member.riskLevel" /></td>
                <td class="skills">{{ member.skills.join(', ') }}</td>
                <td>
                  <div class="row-actions">
                    <a pButton [routerLink]="['/members', member.id]" icon="pi pi-eye" [text]="true" aria-label="View member"></a>
                    @if (isManager()) {
                      <button pButton type="button" icon="pi pi-pencil" [text]="true" aria-label="Edit member" (click)="openEditDialog(member)"></button>
                      <button
                        pButton
                        type="button"
                        icon="pi pi-trash"
                        severity="danger"
                        [text]="true"
                        aria-label="Delete member"
                        (click)="deleteMember(member)"
                      ></button>
                    }
                  </div>
                </td>
              </tr>
            </ng-template>
          </p-table>
        } @else {
          <tp-empty-state title="No members found" message="Try changing the search, risk, team, or seniority filters." />
        }
      </tp-section-card>

      <p-dialog
        [header]="editingMemberId() ? 'Edit Member' : 'Add Member'"
        [modal]="true"
        [visible]="dialogVisible()"
        (visibleChange)="dialogVisible.set($event)"
        [style]="{ width: 'min(48rem, calc(100vw - 2rem))' }"
      >
        <form class="member-form" [formGroup]="memberForm" (ngSubmit)="saveMember()">
          <div class="form-grid">
            <label>Full name <input pInputText formControlName="fullName" /></label>
            <label>Role <input pInputText formControlName="role" /></label>
          </div>
          <div class="form-grid">
            <label>
              Seniority
              <p-select formControlName="seniority" [options]="seniorityOptions" />
            </label>
            <label>
              Team
              <p-select formControlName="teamId" [options]="teamOptions()" optionLabel="label" optionValue="value" />
            </label>
          </div>
          <label>Skills <input pInputText formControlName="skillsText" placeholder="Angular, TypeScript, PrimeNG" /></label>
          <div class="form-grid">
            <label>Performance <p-inputnumber formControlName="performanceScore" [min]="0" [max]="100" /></label>
            <label>Engagement <p-inputnumber formControlName="engagementScore" [min]="0" [max]="100" /></label>
            <label>
              Risk
              <p-select formControlName="riskLevel" [options]="riskOptions" />
            </label>
          </div>
          <div class="dialog-actions">
            <button pButton type="button" label="Cancel" severity="secondary" (click)="dialogVisible.set(false)"></button>
            <button pButton type="submit" label="Save Member" icon="pi pi-check" [disabled]="memberForm.invalid"></button>
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
        margin-bottom: 1rem;
      }

      .skills {
        min-width: 15rem;
      }

      .member-form {
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

      @media (max-width: 760px) {
        .form-grid {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class MembersPageComponent {
  private readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly membersApi = inject(MembersApiService);
  private readonly teamsApi = inject(TeamsApiService);

  protected readonly loading = signal(true);
  protected readonly members = signal<MemberProfile[]>([]);
  protected readonly teams = signal<Team[]>([]);
  protected readonly search = signal('');
  protected readonly riskFilter = signal<RiskLevel | null>(null);
  protected readonly seniorityFilter = signal<Seniority | null>(null);
  protected readonly teamFilter = signal<number | null>(null);
  protected readonly dialogVisible = signal(false);
  protected readonly editingMemberId = signal<number | null>(null);
  protected readonly riskOptions: RiskLevel[] = ['Low', 'Medium', 'High'];
  protected readonly seniorityOptions: Seniority[] = ['Junior', 'Mid', 'Senior', 'Lead'];
  protected readonly isManager = computed(() => this.auth.hasRole('Manager'));

  protected readonly teamOptions = computed(() => this.teams().map((team) => ({ label: team.name, value: team.id })));

  protected readonly visibleMembers = computed(() => {
    const session = this.auth.currentUser();
    if (this.isManager()) {
      return this.members();
    }

    return this.members().filter((member) => member.teamId === session?.teamId);
  });

  protected readonly filteredMembers = computed(() => {
    const term = this.search().trim().toLowerCase();
    return this.visibleMembers().filter((member) => {
      const matchesSearch =
        !term ||
        member.fullName.toLowerCase().includes(term) ||
        member.role.toLowerCase().includes(term) ||
        member.skills.some((skill) => skill.toLowerCase().includes(term));
      const matchesRisk = !this.riskFilter() || member.riskLevel === this.riskFilter();
      const matchesSeniority = !this.seniorityFilter() || member.seniority === this.seniorityFilter();
      const matchesTeam = !this.teamFilter() || member.teamId === this.teamFilter();
      return matchesSearch && matchesRisk && matchesSeniority && matchesTeam;
    });
  });

  protected readonly memberForm = this.fb.nonNullable.group({
    fullName: ['', Validators.required],
    role: ['', Validators.required],
    seniority: this.fb.nonNullable.control<Seniority>('Mid', Validators.required),
    teamId: [1, Validators.required],
    skillsText: ['', Validators.required],
    performanceScore: [80, [Validators.required, Validators.min(0), Validators.max(100)]],
    engagementScore: [80, [Validators.required, Validators.min(0), Validators.max(100)]],
    riskLevel: this.fb.nonNullable.control<RiskLevel>('Low', Validators.required)
  });

  constructor() {
    this.load();
  }

  protected load(): void {
    forkJoin({
      members: this.membersApi.getMembers(),
      teams: this.teamsApi.getTeams()
    }).subscribe({
      next: ({ members, teams }) => {
        this.members.set(members);
        this.teams.set(teams);
        if (!this.isManager()) {
          this.teamFilter.set(this.auth.currentUser()?.teamId ?? null);
        }
      },
      complete: () => this.loading.set(false)
    });
  }

  protected teamName(teamId: number): string {
    return this.teams().find((team) => team.id === teamId)?.name ?? `Team ${teamId}`;
  }

  protected openCreateDialog(): void {
    this.editingMemberId.set(null);
    this.memberForm.reset({
      fullName: '',
      role: '',
      seniority: 'Mid',
      teamId: this.teams()[0]?.id ?? 1,
      skillsText: '',
      performanceScore: 80,
      engagementScore: 80,
      riskLevel: 'Low'
    });
    this.dialogVisible.set(true);
  }

  protected openEditDialog(member: MemberProfile): void {
    this.editingMemberId.set(member.id);
    this.memberForm.setValue({
      fullName: member.fullName,
      role: member.role,
      seniority: member.seniority,
      teamId: member.teamId,
      skillsText: member.skills.join(', '),
      performanceScore: member.performanceScore,
      engagementScore: member.engagementScore,
      riskLevel: member.riskLevel
    });
    this.dialogVisible.set(true);
  }

  protected saveMember(): void {
    if (this.memberForm.invalid) {
      return;
    }

    const value = this.memberForm.getRawValue();
    const existing = this.editingMemberId()
      ? this.members().find((member) => member.id === this.editingMemberId())
      : null;
    const member: MemberProfile = {
      id: this.editingMemberId() ?? 0,
      userId: existing?.userId ?? this.nextUserId(),
      fullName: value.fullName,
      role: value.role,
      seniority: value.seniority,
      teamId: value.teamId,
      skills: value.skillsText.split(',').map((skill) => skill.trim()).filter(Boolean),
      performanceScore: value.performanceScore,
      engagementScore: value.engagementScore,
      riskLevel: value.riskLevel
    };

    const request = this.editingMemberId()
      ? this.membersApi.updateMember(this.editingMemberId()!, member)
      : this.membersApi.createMember(member);

    request.subscribe((saved) => {
      this.members.update((members) =>
        this.editingMemberId() ? members.map((item) => (item.id === saved.id ? saved : item)) : [...members, saved]
      );
      this.dialogVisible.set(false);
    });
  }

  protected deleteMember(member: MemberProfile): void {
    this.membersApi.deleteMember(member.id).subscribe(() => {
      this.members.update((members) => members.filter((item) => item.id !== member.id));
    });
  }

  private nextUserId(): number {
    return Math.max(...this.members().map((member) => member.userId), 1000) + 1;
  }
}
