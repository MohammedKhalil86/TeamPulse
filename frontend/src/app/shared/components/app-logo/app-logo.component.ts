import { Component, Input } from '@angular/core';

@Component({
  selector: 'tp-app-logo',
  standalone: true,
  template: `
    <div class="logo" [class.logo-large]="size === 'large'" [class.logo-compact]="compact" aria-label="TeamPulse">
      <span class="mark">
        <span class="spark spark-one"></span>
        <span class="spark spark-two"></span>
        <span class="initials">TP</span>
        <svg viewBox="0 0 116 34" aria-hidden="true">
          <polyline class="pulse-shadow" points="4,19 18,19 26,8 36,29 48,5 58,19 70,19 78,11 86,25 96,19 112,19" />
          <polyline class="pulse-line" points="4,19 18,19 26,8 36,29 48,5 58,19 70,19 78,11 86,25 96,19 112,19" />
        </svg>
      </span>
      @if (!compact) {
        <span class="wordmark">
          <strong>TeamPulse</strong>
        </span>
      }
    </div>
  `,
  styles: [
    `
      .logo {
        display: inline-flex;
        align-items: center;
        gap: 0.85rem;
        color: var(--tp-text);
      }

      .mark {
        position: relative;
        display: grid;
        width: 4.75rem;
        height: 3rem;
        place-items: center;
        border: 3px solid var(--tp-ink);
        border-radius: var(--tp-radius-sm);
        background:
          linear-gradient(135deg, color-mix(in srgb, var(--tp-spark) 86%, #ffffff), var(--tp-accent) 58%, var(--tp-hot));
        box-shadow: var(--tp-shadow-sm);
        color: var(--tp-accent-contrast);
        overflow: hidden;
      }

      .initials {
        z-index: 2;
        font-weight: 900;
        letter-spacing: 0;
        transform: translateX(-0.85rem);
      }

      .spark {
        position: absolute;
        z-index: 1;
        width: 0.48rem;
        height: 0.48rem;
        border: 2px solid var(--tp-ink);
        background: var(--tp-warning);
        box-shadow: 2px 2px 0 var(--tp-ink);
        transform: rotate(45deg);
        animation: tp-spark 1.15s ease-in-out infinite;
      }

      .spark-one {
        top: 0.32rem;
        right: 0.55rem;
      }

      .spark-two {
        right: 1.38rem;
        bottom: 0.34rem;
        width: 0.32rem;
        height: 0.32rem;
        background: var(--tp-spark);
        animation-delay: 180ms;
      }

      svg {
        position: absolute;
        right: -0.18rem;
        bottom: 0.42rem;
        width: 3.85rem;
        height: 1.25rem;
        fill: none;
        stroke-linecap: round;
        stroke-linejoin: round;
      }

      .pulse-shadow {
        stroke: var(--tp-ink);
        stroke-width: 8;
      }

      .pulse-line {
        stroke: #ffffff;
        stroke-width: 3.25;
        stroke-dasharray: 42 86;
        animation: tp-pulse-line 1.05s ease-in-out infinite;
      }

      .wordmark {
        display: grid;
      }

      strong {
        font-size: 1.18rem;
        line-height: 1;
      }

      .logo-large .mark {
        width: 7.75rem;
        height: 4.9rem;
        box-shadow: var(--tp-shadow-lg);
      }

      .logo-large strong {
        font-size: 2.7rem;
      }

      .logo-large .initials {
        font-size: 1.45rem;
        transform: translateX(-1.48rem);
      }

      .logo-large svg {
        right: 0.05rem;
        bottom: 0.82rem;
        width: 5.55rem;
        height: 1.8rem;
      }

      @keyframes tp-pulse-line {
        0%,
        100% {
          opacity: 0.7;
          stroke-dashoffset: 70;
          transform: translateX(0) scaleY(1);
        }

        50% {
          opacity: 1;
          stroke-dashoffset: 14;
          transform: translateX(-0.08rem) scaleY(1.24);
        }
      }

      @keyframes tp-spark {
        0%,
        100% {
          opacity: 0.55;
          transform: rotate(45deg) scale(0.78);
        }

        45% {
          opacity: 1;
          transform: rotate(45deg) scale(1.2);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .pulse-line,
        .spark {
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
