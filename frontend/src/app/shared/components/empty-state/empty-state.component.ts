import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'tp-empty-state',
  standalone: true,
  imports: [ButtonModule],
  template: `
    <section class="empty-state">
      <i [class]="icon"></i>
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
      @if (actionLabel) {
        <button pButton type="button" [label]="actionLabel" [icon]="actionIcon" (click)="action.emit()"></button>
      }
    </section>
  `,
  styles: [
    `
      .empty-state {
        display: grid;
        justify-items: center;
        gap: 0.75rem;
        border: 3px dashed var(--tp-ink);
        border-radius: var(--tp-radius);
        background: color-mix(in srgb, var(--tp-warning) 10%, var(--tp-panel));
        padding: 2rem;
        text-align: center;
      }

      i {
        border: 3px solid var(--tp-ink);
        background: var(--tp-accent);
        box-shadow: var(--tp-shadow-sm);
        color: #071312;
        font-size: 1.75rem;
        padding: 0.85rem;
      }

      h3,
      p {
        margin: 0;
      }

      p {
        color: var(--tp-muted);
      }
    `
  ]
})
export class EmptyStateComponent {
  @Input() icon = 'pi pi-inbox';
  @Input({ required: true }) title = '';
  @Input({ required: true }) message = '';
  @Input() actionLabel = '';
  @Input() actionIcon = 'pi pi-plus';
  @Output() readonly action = new EventEmitter<void>();
}
