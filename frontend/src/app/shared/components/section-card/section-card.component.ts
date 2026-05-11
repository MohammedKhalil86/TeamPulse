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
        padding: 1rem;
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
        margin-bottom: 1rem;
      }

      h3,
      p {
        margin: 0;
      }

      p {
        margin-top: 0.35rem;
        color: var(--tp-muted);
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
