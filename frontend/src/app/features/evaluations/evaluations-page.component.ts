import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { TableModule } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { EvaluationsApiService } from '../../core/api/evaluations-api.service';
import { MembersApiService } from '../../core/api/members-api.service';
import { AuthService } from '../../core/auth/auth.service';
import { Evaluation, MemberProfile } from '../../core/models/team-pulse.models';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ScoreBadgeComponent } from '../../shared/components/score-badge/score-badge.component';
import { SectionCardComponent } from '../../shared/components/section-card/section-card.component';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { ScoreHighlightDirective } from '../../shared/directives/score-highlight.directive';

@Component({
  selector: 'tp-evaluations-page',
  standalone: true,
  imports: [
    ButtonModule,
    DialogModule,
    EmptyStateComponent,
    InputNumberModule,
    InputTextModule,
    LoadingStateComponent,
    PageHeaderComponent,
    ReactiveFormsModule,
    ScoreBadgeComponent,
    ScoreHighlightDirective,
    SectionCardComponent,
    SelectModule,
    SliderModule,
    StatCardComponent,
    TableModule,
    TextareaModule,
    ToastModule
  ],
  template: `
    <p-toast />
    @if (loading()) {
      <tp-loading-state variant="skeleton" />
    } @else {
      <tp-page-header
        eyebrow="Evaluations"
        title="Performance review console"
        [subtitle]="isManager() ? 'Create and maintain seeded evaluations.' : 'Review your own seeded evaluation history.'"
        [actionLabel]="isManager() ? 'Add Evaluation' : ''"
        actionIcon="pi pi-plus"
        (action)="openCreateDialog()"
      />

      <section class="stat-grid">
        <tp-stat-card label="Evaluations" [value]="visibleEvaluations().length" icon="pi pi-star" trend="Visible records" />
        <tp-stat-card label="Average Score" [value]="averageScore()" icon="pi pi-chart-line" trend="All score dimensions" />
        <tp-stat-card label="High Scores" [value]="highScoreCount()" icon="pi pi-arrow-up" trend="Average >= 85" />
      </section>

      <tp-section-card title="Evaluation Records" subtitle="Scores are loaded from the Minimal API and scoped by fake role.">
        @if (visibleEvaluations().length) {
          <p-table [value]="visibleEvaluations()" [paginator]="true" [rows]="10" [sortMode]="'multiple'" responsiveLayout="scroll">
            <ng-template #header>
              <tr>
                <th>Member</th>
                <th pSortableColumn="period">Period <p-sortIcon field="period" /></th>
                <th>Average</th>
                <th>Technical</th>
                <th>Communication</th>
                <th>Ownership</th>
                <th>Teamwork</th>
                <th>Delivery</th>
                <th>Comments</th>
                <th>Actions</th>
              </tr>
            </ng-template>
            <ng-template #body let-evaluation>
              <tr [tpScoreHighlight]="evaluationAverage(evaluation)">
                <td>{{ memberName(evaluation.memberId) }}</td>
                <td>{{ evaluation.period }}</td>
                <td><tp-score-badge [score]="evaluationAverage(evaluation)" /></td>
                <td>{{ evaluation.technicalScore }}</td>
                <td>{{ evaluation.communicationScore }}</td>
                <td>{{ evaluation.ownershipScore }}</td>
                <td>{{ evaluation.teamworkScore }}</td>
                <td>{{ evaluation.deliveryScore }}</td>
                <td class="comments">{{ evaluation.comments }}</td>
                <td>
                  @if (isManager()) {
                    <div class="row-actions">
                      <button pButton type="button" icon="pi pi-pencil" [text]="true" (click)="openEditDialog(evaluation)"></button>
                      <button pButton type="button" icon="pi pi-trash" severity="danger" [text]="true" (click)="deleteEvaluation(evaluation)"></button>
                    </div>
                  }
                </td>
              </tr>
            </ng-template>
          </p-table>
        } @else {
          <tp-empty-state title="No evaluations" message="No evaluations match this role scope." />
        }
      </tp-section-card>

      <p-dialog
        [header]="editingEvaluationId() ? 'Edit Evaluation' : 'Add Evaluation'"
        [modal]="true"
        [visible]="dialogVisible()"
        (visibleChange)="dialogVisible.set($event)"
        [style]="{ width: 'min(50rem, calc(100vw - 2rem))' }"
      >
        <form class="evaluation-form" [formGroup]="evaluationForm" (ngSubmit)="saveEvaluation()">
          <div class="form-grid">
            <label>
              Member
              <p-select formControlName="memberId" [options]="memberOptions()" optionLabel="label" optionValue="value" />
            </label>
            <label>Period <input pInputText formControlName="period" placeholder="2026 Q2" /></label>
          </div>

          @for (field of scoreFields; track field.control) {
            <label class="score-field">
              <span>{{ field.label }}: {{ evaluationForm.controls[field.control].value }}</span>
              <p-slider [formControlName]="field.control" [min]="0" [max]="100" />
              <p-inputnumber [formControlName]="field.control" [min]="0" [max]="100" />
            </label>
          }

          <label>Comments <textarea pTextarea formControlName="comments" rows="4"></textarea></label>
          <div class="dialog-actions">
            <button pButton type="button" label="Cancel" severity="secondary" (click)="dialogVisible.set(false)"></button>
            <button pButton type="submit" label="Save Evaluation" icon="pi pi-check" [disabled]="evaluationForm.invalid"></button>
          </div>
        </form>
      </p-dialog>
    }
  `,
  styles: [
    `
      .stat-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .comments {
        min-width: 18rem;
      }

      .row-actions,
      .dialog-actions {
        display: flex;
        gap: 0.5rem;
        justify-content: flex-end;
      }

      .evaluation-form {
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
        gap: 0.45rem;
        font-weight: 900;
      }

      .score-field {
        grid-template-columns: 10rem 1fr 7rem;
        align-items: center;
      }

      @media (max-width: 860px) {
        .stat-grid,
        .form-grid,
        .score-field {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class EvaluationsPageComponent {
  private readonly auth = inject(AuthService);
  private readonly evaluationsApi = inject(EvaluationsApiService);
  private readonly fb = inject(FormBuilder);
  private readonly membersApi = inject(MembersApiService);
  private readonly messages = inject(MessageService);

  protected readonly loading = signal(true);
  protected readonly evaluations = signal<Evaluation[]>([]);
  protected readonly members = signal<MemberProfile[]>([]);
  protected readonly dialogVisible = signal(false);
  protected readonly editingEvaluationId = signal<number | null>(null);
  protected readonly isManager = computed(() => this.auth.hasRole('Manager'));

  protected readonly scoreFields = [
    { label: 'Technical', control: 'technicalScore' as const },
    { label: 'Communication', control: 'communicationScore' as const },
    { label: 'Ownership', control: 'ownershipScore' as const },
    { label: 'Teamwork', control: 'teamworkScore' as const },
    { label: 'Delivery', control: 'deliveryScore' as const }
  ];

  protected readonly evaluationForm = this.fb.nonNullable.group({
    memberId: [1, Validators.required],
    period: ['', Validators.required],
    technicalScore: [80, [Validators.required, Validators.min(0), Validators.max(100)]],
    communicationScore: [80, [Validators.required, Validators.min(0), Validators.max(100)]],
    ownershipScore: [80, [Validators.required, Validators.min(0), Validators.max(100)]],
    teamworkScore: [80, [Validators.required, Validators.min(0), Validators.max(100)]],
    deliveryScore: [80, [Validators.required, Validators.min(0), Validators.max(100)]],
    comments: ['', [Validators.required, Validators.minLength(8)]]
  });

  protected readonly visibleEvaluations = computed(() => {
    if (this.isManager()) {
      return this.evaluations();
    }

    const ownMember = this.ownMember();
    return ownMember ? this.evaluations().filter((evaluation) => evaluation.memberId === ownMember.id) : [];
  });

  protected readonly memberOptions = computed(() =>
    this.members().map((member) => ({ label: member.fullName, value: member.id }))
  );

  protected readonly averageScore = computed(() => {
    const items = this.visibleEvaluations();
    if (!items.length) {
      return 0;
    }

    return Math.round(items.reduce((total, item) => total + this.evaluationAverage(item), 0) / items.length);
  });

  protected readonly highScoreCount = computed(
    () => this.visibleEvaluations().filter((evaluation) => this.evaluationAverage(evaluation) >= 85).length
  );

  constructor() {
    forkJoin({
      evaluations: this.evaluationsApi.getEvaluations(),
      members: this.membersApi.getMembers()
    }).subscribe({
      next: ({ evaluations, members }) => {
        this.evaluations.set(evaluations);
        this.members.set(members);
      },
      complete: () => this.loading.set(false)
    });
  }

  protected memberName(memberId: number): string {
    return this.members().find((member) => member.id === memberId)?.fullName ?? `Member ${memberId}`;
  }

  protected evaluationAverage(evaluation: Evaluation): number {
    return Math.round(
      (evaluation.technicalScore +
        evaluation.communicationScore +
        evaluation.ownershipScore +
        evaluation.teamworkScore +
        evaluation.deliveryScore) /
        5
    );
  }

  protected openCreateDialog(): void {
    this.editingEvaluationId.set(null);
    this.evaluationForm.reset({
      memberId: this.members()[0]?.id ?? 1,
      period: '2026 Q2',
      technicalScore: 80,
      communicationScore: 80,
      ownershipScore: 80,
      teamworkScore: 80,
      deliveryScore: 80,
      comments: ''
    });
    this.dialogVisible.set(true);
  }

  protected openEditDialog(evaluation: Evaluation): void {
    this.editingEvaluationId.set(evaluation.id);
    this.evaluationForm.setValue({
      memberId: evaluation.memberId,
      period: evaluation.period,
      technicalScore: evaluation.technicalScore,
      communicationScore: evaluation.communicationScore,
      ownershipScore: evaluation.ownershipScore,
      teamworkScore: evaluation.teamworkScore,
      deliveryScore: evaluation.deliveryScore,
      comments: evaluation.comments
    });
    this.dialogVisible.set(true);
  }

  protected saveEvaluation(): void {
    if (this.evaluationForm.invalid) {
      this.evaluationForm.markAllAsTouched();
      return;
    }

    const value = this.evaluationForm.getRawValue();
    const evaluation: Evaluation = {
      id: this.editingEvaluationId() ?? 0,
      ...value,
      createdAt: new Date().toISOString()
    };
    const request = this.editingEvaluationId()
      ? this.evaluationsApi.updateEvaluation(this.editingEvaluationId()!, evaluation)
      : this.evaluationsApi.createEvaluation(evaluation);

    request.subscribe((saved) => {
      this.evaluations.update((items) =>
        this.editingEvaluationId() ? items.map((item) => (item.id === saved.id ? saved : item)) : [saved, ...items]
      );
      this.dialogVisible.set(false);
      this.messages.add({ severity: 'success', summary: 'Evaluation saved', detail: memberNameSafe(this.members(), saved.memberId) });
    });
  }

  protected deleteEvaluation(evaluation: Evaluation): void {
    this.evaluationsApi.deleteEvaluation(evaluation.id).subscribe(() => {
      this.evaluations.update((items) => items.filter((item) => item.id !== evaluation.id));
      this.messages.add({ severity: 'success', summary: 'Evaluation deleted', detail: evaluation.period });
    });
  }

  private ownMember(): MemberProfile | undefined {
    const session = this.auth.currentUser();
    return this.members().find((member) => member.userId === session?.userId);
  }
}

function memberNameSafe(members: MemberProfile[], memberId: number): string {
  return members.find((member) => member.id === memberId)?.fullName ?? `Member ${memberId}`;
}
