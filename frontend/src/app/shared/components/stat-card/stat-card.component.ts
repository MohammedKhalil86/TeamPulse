import { Component, Input } from '@angular/core';

@Component({
  selector: 'tp-stat-card',
  standalone: true,
  template: `
    <article class="stat-card tp-interactive-card tp-enter">
      <i [class]="icon"></i>
      <span>{{ label }}</span>
      <strong>{{ value }}</strong>
      @if (trend) {
        <small>{{ trend }}</small>
      }
    </article>
  `,
  styles: [
    `
      .stat-card {
        display: grid;
        min-height: 9rem;
        align-content: space-between;
        gap: var(--tp-space-2);
        border: 3px solid var(--tp-ink);
        border-radius: var(--tp-radius);
        background: linear-gradient(145deg, var(--tp-panel), color-mix(in srgb, var(--tp-accent) 12%, var(--tp-panel)));
        box-shadow: var(--tp-shadow-md);
        padding: var(--tp-space-4);
      }

      i {
        width: fit-content;
        border: 2px solid var(--tp-ink);
        background: var(--tp-hot);
        box-shadow: var(--tp-shadow-xs);
        color: #121212;
        font-size: 1.05rem;
        padding: 0.5rem;
      }

      span {
        color: var(--tp-muted);
        font-size: 0.84rem;
        font-weight: 900;
        text-transform: uppercase;
      }

      strong {
        font-size: clamp(2rem, 3vw, 2.45rem);
        line-height: 1;
      }

      small {
        color: var(--tp-success);
        font-size: 0.84rem;
        font-weight: 900;
      }
    `
  ]
})
export class StatCardComponent {
  @Input({ required: true }) label = '';
  @Input({ required: true }) value: string | number = '';
  @Input() icon = 'pi pi-chart-line';
  @Input() trend = '';
}
