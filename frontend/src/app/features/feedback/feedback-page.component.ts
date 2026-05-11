import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { FeedbackApiService } from '../../core/api/feedback-api.service';
import { MembersApiService } from '../../core/api/members-api.service';
import { AuthService } from '../../core/auth/auth.service';
import { Feedback, FeedbackType, MemberProfile } from '../../core/models/team-pulse.models';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { SectionCardComponent } from '../../shared/components/section-card/section-card.component';
import { FriendlyDatePipe } from '../../shared/pipes/friendly-date.pipe';

@Component({
  selector: 'tp-feedback-page',
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    DatePickerModule,
    DialogModule,
    EmptyStateComponent,
    FormsModule,
    FriendlyDatePipe,
    InputTextModule,
    LoadingStateComponent,
    PageHeaderComponent,
    ReactiveFormsModule,
    SectionCardComponent,
    SelectModule,
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
        eyebrow="Feedback"
        title="Signals and recognition feed"
        [subtitle]="isManager() ? 'Review and create feedback across all seeded members.' : 'Review your own feedback and team recognition.'"
        [actionLabel]="isManager() ? 'Add Feedback' : ''"
        actionIcon="pi pi-comment"
        (action)="openCreateDialog()"
      />

      <tp-section-card title="Feedback Filters" subtitle="Filter by type, member, and created date.">
        <div class="toolbar">
          <input pInputText type="search" placeholder="Search message" [value]="search()" (input)="search.set($any($event.target).value)" />
          <p-select [options]="typeOptions" [ngModel]="typeFilter()" (ngModelChange)="typeFilter.set($event)" placeholder="Type" [showClear]="true" />
          <p-select
            [options]="memberOptions()"
            [ngModel]="memberFilter()"
            (ngModelChange)="memberFilter.set($event)"
            optionLabel="label"
            optionValue="value"
            placeholder="Member"
            [showClear]="true"
            [disabled]="!isManager()"
          />
          <p-datepicker [ngModel]="dateFilter()" (ngModelChange)="dateFilter.set($event)" placeholder="Created date" [showIcon]="true" />
        </div>
      </tp-section-card>

      <section class="feedback-grid">
        @for (item of filteredFeedback(); track item.id) {
          <p-card styleClass="feedback-card">
            <ng-template #title>
              <span>{{ memberName(item.memberId) }}</span>
            </ng-template>
            <ng-template #subtitle>
              <p-tag [value]="item.type" [severity]="feedbackSeverity(item.type)" />
            </ng-template>
            <p>{{ item.message }}</p>
            <small>{{ item.createdAt | friendlyDate }}</small>
          </p-card>
        } @empty {
          <tp-empty-state title="No feedback found" message="Adjust the type, member, date, or text filters." />
        }
      </section>

      <tp-section-card title="Feedback Table" subtitle="The same data as a sortable workshop-friendly table.">
        <p-table [value]="filteredFeedback()" [paginator]="true" [rows]="10" responsiveLayout="scroll">
          <ng-template #header>
            <tr><th>Member</th><th>From</th><th>Type</th><th>Message</th><th>Created</th><th>Actions</th></tr>
          </ng-template>
          <ng-template #body let-item>
            <tr>
              <td>{{ memberName(item.memberId) }}</td>
              <td>{{ item.fromUserId }}</td>
              <td><p-tag [value]="item.type" [severity]="feedbackSeverity(item.type)" /></td>
              <td class="message">{{ item.message }}</td>
              <td>{{ item.createdAt | friendlyDate }}</td>
              <td>
                @if (isManager()) {
                  <button pButton type="button" icon="pi pi-trash" severity="danger" [text]="true" (click)="deleteFeedback(item)"></button>
                }
              </td>
            </tr>
          </ng-template>
        </p-table>
      </tp-section-card>

      <p-dialog
        header="Add Feedback"
        [modal]="true"
        [visible]="dialogVisible()"
        (visibleChange)="dialogVisible.set($event)"
        [style]="{ width: 'min(42rem, calc(100vw - 2rem))' }"
      >
        <form class="feedback-form" [formGroup]="feedbackForm" (ngSubmit)="saveFeedback()">
          <label>
            Member
            <p-select formControlName="memberId" [options]="memberOptions()" optionLabel="label" optionValue="value" />
          </label>
          <label>
            Type
            <p-select formControlName="type" [options]="typeOptions" />
          </label>
          <label>Message <textarea pTextarea formControlName="message" rows="5"></textarea></label>
          <div class="dialog-actions">
            <button pButton type="button" label="Cancel" severity="secondary" (click)="dialogVisible.set(false)"></button>
            <button pButton type="submit" label="Save Feedback" icon="pi pi-check" [disabled]="feedbackForm.invalid"></button>
          </div>
        </form>
      </p-dialog>
    }
  `,
  styles: [
    `
      .toolbar,
      .dialog-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        align-items: center;
      }

      .feedback-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 1rem;
        margin: 1rem 0;
      }

      :host ::ng-deep .feedback-card {
        min-height: 13rem;
      }

      .message {
        min-width: 18rem;
      }

      .feedback-form {
        display: grid;
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

      @media (max-width: 980px) {
        .feedback-grid {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class FeedbackPageComponent {
  private readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly feedbackApi = inject(FeedbackApiService);
  private readonly membersApi = inject(MembersApiService);
  private readonly messages = inject(MessageService);

  protected readonly loading = signal(true);
  protected readonly feedback = signal<Feedback[]>([]);
  protected readonly members = signal<MemberProfile[]>([]);
  protected readonly search = signal('');
  protected readonly typeFilter = signal<FeedbackType | null>(null);
  protected readonly memberFilter = signal<number | null>(null);
  protected readonly dateFilter = signal<Date | null>(null);
  protected readonly dialogVisible = signal(false);
  protected readonly isManager = computed(() => this.auth.hasRole('Manager'));
  protected readonly typeOptions: FeedbackType[] = ['Recognition', 'Improvement', 'Risk', 'General'];

  protected readonly memberOptions = computed(() =>
    this.visibleMembers().map((member) => ({ label: member.fullName, value: member.id }))
  );

  protected readonly visibleMembers = computed(() => {
    if (this.isManager()) {
      return this.members();
    }

    const session = this.auth.currentUser();
    return this.members().filter((member) => member.teamId === session?.teamId);
  });

  protected readonly visibleFeedback = computed(() => {
    if (this.isManager()) {
      return this.feedback();
    }

    const session = this.auth.currentUser();
    const ownMember = this.members().find((member) => member.userId === session?.userId);
    const teamMemberIds = new Set(this.visibleMembers().map((member) => member.id));
    return this.feedback().filter(
      (item) => item.memberId === ownMember?.id || (item.type === 'Recognition' && teamMemberIds.has(item.memberId))
    );
  });

  protected readonly filteredFeedback = computed(() => {
    const term = this.search().trim().toLowerCase();
    const date = this.dateFilter();
    return this.visibleFeedback().filter((item) => {
      const created = new Date(item.createdAt);
      const matchesText = !term || item.message.toLowerCase().includes(term) || this.memberName(item.memberId).toLowerCase().includes(term);
      const matchesType = !this.typeFilter() || item.type === this.typeFilter();
      const matchesMember = !this.memberFilter() || item.memberId === this.memberFilter();
      const matchesDate =
        !date ||
        (created.getFullYear() === date.getFullYear() &&
          created.getMonth() === date.getMonth() &&
          created.getDate() === date.getDate());
      return matchesText && matchesType && matchesMember && matchesDate;
    });
  });

  protected readonly feedbackForm = this.fb.nonNullable.group({
    memberId: [1, Validators.required],
    type: this.fb.nonNullable.control<FeedbackType>('Recognition', Validators.required),
    message: ['', [Validators.required, Validators.minLength(8)]]
  });

  constructor() {
    forkJoin({
      feedback: this.feedbackApi.getFeedback(),
      members: this.membersApi.getMembers()
    }).subscribe({
      next: ({ feedback, members }) => {
        this.feedback.set(feedback);
        this.members.set(members);
      },
      complete: () => this.loading.set(false)
    });
  }

  protected memberName(memberId: number): string {
    return this.members().find((member) => member.id === memberId)?.fullName ?? `Member ${memberId}`;
  }

  protected feedbackSeverity(type: FeedbackType): 'success' | 'warn' | 'danger' | 'info' | 'secondary' {
    if (type === 'Recognition') {
      return 'success';
    }

    if (type === 'Improvement') {
      return 'warn';
    }

    return type === 'Risk' ? 'danger' : 'info';
  }

  protected openCreateDialog(): void {
    this.feedbackForm.reset({
      memberId: this.visibleMembers()[0]?.id ?? 1,
      type: 'Recognition',
      message: ''
    });
    this.dialogVisible.set(true);
  }

  protected saveFeedback(): void {
    if (this.feedbackForm.invalid) {
      this.feedbackForm.markAllAsTouched();
      return;
    }

    const value = this.feedbackForm.getRawValue();
    const item: Feedback = {
      id: 0,
      memberId: value.memberId,
      fromUserId: this.auth.currentUser()?.userId ?? 0,
      type: value.type,
      message: value.message,
      createdAt: new Date().toISOString()
    };

    this.feedbackApi.createFeedback(item).subscribe((saved) => {
      this.feedback.update((items) => [saved, ...items]);
      this.dialogVisible.set(false);
      this.messages.add({ severity: 'success', summary: 'Feedback saved', detail: this.memberName(saved.memberId) });
    });
  }

  protected deleteFeedback(item: Feedback): void {
    this.feedbackApi.deleteFeedback(item.id).subscribe(() => {
      this.feedback.update((items) => items.filter((existing) => existing.id !== item.id));
      this.messages.add({ severity: 'success', summary: 'Feedback deleted', detail: this.memberName(item.memberId) });
    });
  }
}
