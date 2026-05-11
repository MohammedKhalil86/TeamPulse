import { Component, Input } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'tp-loading-state',
  standalone: true,
  imports: [ProgressSpinnerModule, SkeletonModule],
  template: `
    <section class="loading-state" [class.compact]="compact">
      @if (variant === 'skeleton') {
        <p-skeleton height="2rem" />
        <p-skeleton height="7rem" />
        <p-skeleton height="2rem" width="60%" />
      } @else {
        <p-progress-spinner ariaLabel="Loading" />
        <p>{{ message }}</p>
      }
    </section>
  `,
  styles: [
    `
      .loading-state {
        display: grid;
        gap: 1rem;
        place-items: center;
        border: 3px solid var(--tp-ink);
        border-radius: var(--tp-radius);
        background: var(--tp-panel);
        box-shadow: var(--tp-shadow-md);
        padding: 2rem;
      }

      .compact {
        border-width: 2px;
        box-shadow: none;
        padding: 1rem;
      }

      p {
        margin: 0;
        color: var(--tp-muted);
        font-weight: 800;
      }
    `
  ]
})
export class LoadingStateComponent {
  @Input() variant: 'spinner' | 'skeleton' = 'skeleton';
  @Input() message = 'Loading TeamPulse data';
  @Input() compact = false;
}
