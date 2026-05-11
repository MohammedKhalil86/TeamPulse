import { Component, Input } from '@angular/core';

@Component({
  selector: 'tp-app-logo',
  standalone: true,
  template: `
    <div class="logo" [class.logo-large]="size === 'large'" [class.logo-compact]="compact" aria-label="TeamPulse">
      <span class="mark">
        <span class="initials">TP</span>
        <svg viewBox="0 0 84 28" aria-hidden="true">
          <polyline points="2,15 15,15 21,5 30,24 39,10 47,15 82,15" />
        </svg>
      </span>
      @if (!compact) {
        <span class="wordmark">
          <strong>TeamPulse</strong>
          <small>Engineering signal</small>
        </span>
      }
    </div>
  `,
  styles: [
    `
      .logo {
        display: inline-flex;
        align-items: center;
        gap: 0.75rem;
        color: var(--tp-text);
      }

      .mark {
        position: relative;
        display: grid;
        width: 3rem;
        height: 3rem;
        place-items: center;
        border: 3px solid var(--tp-ink);
        border-radius: var(--tp-radius-sm);
        background: var(--tp-accent);
        box-shadow: var(--tp-shadow-sm);
        color: var(--tp-accent-contrast);
        overflow: hidden;
      }

      .initials {
        z-index: 1;
        font-weight: 900;
      }

      svg {
        position: absolute;
        right: -0.45rem;
        bottom: 0.15rem;
        width: 2.5rem;
        height: 1rem;
        fill: none;
        stroke: currentColor;
        stroke-width: 4;
        stroke-linecap: round;
        stroke-linejoin: round;
        animation: tp-pulse-line 1s ease-in-out infinite;
      }

      .wordmark {
        display: grid;
        gap: 0.08rem;
      }

      strong {
        font-size: 1rem;
        line-height: 1;
      }

      small {
        color: var(--tp-muted);
        font-size: 0.72rem;
        font-weight: 800;
        text-transform: uppercase;
      }

      .logo-large .mark {
        width: 4.5rem;
        height: 4.5rem;
        box-shadow: var(--tp-shadow-lg);
      }

      .logo-large strong {
        font-size: 2.35rem;
      }

      .logo-large small {
        font-size: 0.9rem;
      }

      @keyframes tp-pulse-line {
        0%,
        100% {
          opacity: 0.72;
          transform: translateX(0) scaleY(1);
        }

        50% {
          opacity: 1;
          transform: translateX(-0.15rem) scaleY(1.18);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        svg {
          animation: none;
        }
      }
    `
  ]
})
export class AppLogoComponent {
  @Input() size: 'default' | 'large' = 'default';
  @Input() compact = false;
}
