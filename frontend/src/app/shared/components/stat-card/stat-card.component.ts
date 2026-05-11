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
        min-height: 9.5rem;
        align-content: space-between;
        border: 3px solid var(--tp-ink);
        border-radius: var(--tp-radius);
        background: linear-gradient(145deg, var(--tp-panel), color-mix(in srgb, var(--tp-accent) 12%, var(--tp-panel)));
        box-shadow: var(--tp-shadow-md);
        padding: 1rem;
      }

      i {
        width: fit-content;
        border: 2px solid var(--tp-ink);
        background: var(--tp-hot);
        box-shadow: var(--tp-shadow-xs);
        color: #121212;
        font-size: 1.15rem;
        padding: 0.55rem;
      }

      span {
        color: var(--tp-muted);
        font-weight: 900;
        text-transform: uppercase;
      }

      strong {
        font-size: 2.5rem;
        line-height: 1;
      }

      small {
        color: var(--tp-success);
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
