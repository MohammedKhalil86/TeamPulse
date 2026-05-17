import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'tp-page-header',
  standalone: true,
  imports: [ButtonModule],
  template: `
    <header class="page-header tp-enter">
      <div>
        <p class="eyebrow">{{ eyebrow }}</p>
        <h2>{{ title }}</h2>
        @if (subtitle) {
          <p class="subtitle">{{ subtitle }}</p>
        }
      </div>
      @if (actionLabel) {
        <button pButton type="button" [icon]="actionIcon" [label]="actionLabel" (click)="action.emit()"></button>
      }
    </header>
  `,
  styles: [
    `
      .page-header {
        display: flex;
        align-items: end;
        justify-content: space-between;
        gap: var(--tp-space-5);
        margin-bottom: var(--tp-space-5);
      }

      .eyebrow {
        display: inline-block;
        margin: 0 0 0.55rem;
        border: 2px solid var(--tp-ink);
        background: var(--tp-warning);
        box-shadow: var(--tp-shadow-xs);
        color: #121212;
        font-size: 0.78rem;
        font-weight: 900;
        padding: 0.25rem 0.5rem;
        text-transform: uppercase;
      }

      h2 {
        margin: 0;
        font-size: clamp(2rem, 4vw, 4.75rem);
        line-height: 0.95;
      }

      .subtitle {
        max-width: 48rem;
        margin: var(--tp-space-3) 0 0;
        color: var(--tp-muted);
        font-size: 1.02rem;
        line-height: 1.65;
      }

      @media (max-width: 720px) {
        .page-header {
          align-items: stretch;
          flex-direction: column;
        }
      }
    `
  ]
})
export class PageHeaderComponent {
  @Input() eyebrow = 'TeamPulse';
  @Input({ required: true }) title = '';
  @Input() subtitle = '';
  @Input() actionLabel = '';
  @Input() actionIcon = 'pi pi-plus';
  @Output() readonly action = new EventEmitter<void>();
}
