import { Component, Input } from '@angular/core';
import { ProgressBarModule } from 'primeng/progressbar';
import { ScoreLabelPipe } from '../../pipes/score-label.pipe';

@Component({
  selector: 'tp-score-badge',
  standalone: true,
  imports: [ProgressBarModule, ScoreLabelPipe],
  template: `
    <span class="score-badge" [class.low]="score < 70" [class.medium]="score >= 70 && score < 85" [class.high]="score >= 85">
      <strong>{{ score }}</strong>
      <span>{{ score | scoreLabel }}</span>
      <p-progressbar [value]="score" [showValue]="false" />
    </span>
  `,
  styles: [
    `
      .score-badge {
        display: inline-grid;
        min-width: 8rem;
        gap: var(--tp-space-1);
        border: 2px solid var(--tp-ink);
        border-radius: var(--tp-radius-sm);
        background: var(--tp-panel);
        box-shadow: var(--tp-shadow-xs);
        padding: 0.5rem 0.6rem;
      }

      strong {
        font-size: 1.12rem;
        line-height: 1;
      }

      span span {
        color: var(--tp-muted);
        font-size: 0.76rem;
        font-weight: 900;
        text-transform: uppercase;
      }

      .low {
        background: color-mix(in srgb, var(--tp-danger) 22%, var(--tp-panel));
      }

      .medium {
        background: color-mix(in srgb, var(--tp-warning) 35%, var(--tp-panel));
      }

      .high {
        background: color-mix(in srgb, var(--tp-success) 30%, var(--tp-panel));
      }
    `
  ]
})
export class ScoreBadgeComponent {
  @Input({ required: true }) score = 0;
}
