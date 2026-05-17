import { Component, Input } from '@angular/core';

@Component({
  selector: 'tp-section-card',
  standalone: true,
  template: `
    <section class="section-card tp-enter" [class.interactive]="interactive">
      @if (title || subtitle) {
        <header>
          @if (title) {
            <h3>{{ title }}</h3>
          }
          @if (subtitle) {
            <p>{{ subtitle }}</p>
          }
        </header>
      }
      <ng-content />
    </section>
  `,
  styles: [
    `
      .section-card {
        border: 3px solid var(--tp-ink);
        border-radius: var(--tp-radius);
        background: var(--tp-panel);
        box-shadow: var(--tp-shadow-md);
        padding: var(--tp-space-5);
      }

      .interactive {
        transition:
          transform var(--tp-motion-fast),
          box-shadow var(--tp-motion-fast);
      }

      .interactive:hover {
        box-shadow: var(--tp-shadow-lg);
        transform: translate(-2px, -2px);
      }

      header {
        display: grid;
        gap: var(--tp-space-2);
        margin-bottom: var(--tp-space-5);
      }

      h3,
      p {
        margin: 0;
      }

      p {
        color: var(--tp-muted);
        font-size: 0.96rem;
        line-height: 1.6;
      }

      @media (prefers-reduced-motion: reduce) {
        .interactive,
        .interactive:hover {
          transition: none;
          transform: none;
        }
      }
    `
  ]
})
export class SectionCardComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() interactive = false;
}
