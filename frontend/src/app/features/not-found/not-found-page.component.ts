import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'tp-not-found-page',
  standalone: true,
  imports: [ButtonModule, RouterLink],
  template: `
    <main class="not-found-page">
      <div class="not-found-card">
        <p class="eyebrow">404</p>
        <h1>Page not found</h1>
        <p>The URL you followed does not match any TeamPulse page.</p>
        <a pButton routerLink="/dashboard" icon="pi pi-arrow-left" label="Back to Dashboard"></a>
      </div>
    </main>
  `,
  styles: [
    `
      .not-found-page {
        display: grid;
        min-height: 100vh;
        place-items: center;
        background:
          linear-gradient(135deg, color-mix(in srgb, var(--tp-accent) 18%, transparent), transparent 35%),
          linear-gradient(315deg, color-mix(in srgb, var(--tp-hot) 14%, transparent), transparent 38%),
          var(--tp-surface);
        padding: 2rem;
      }

      .not-found-card {
        display: grid;
        max-width: 28rem;
        gap: 1rem;
        border: 3px solid var(--tp-ink);
        border-radius: var(--tp-radius);
        background: var(--tp-panel);
        box-shadow: var(--tp-shadow-lg);
        padding: 2.5rem;
        text-align: center;
      }

      .eyebrow {
        margin: 0;
        font-size: 5rem;
        font-weight: 900;
        line-height: 1;
        color: var(--tp-accent);
        text-shadow: 4px 4px 0 var(--tp-ink);
      }

      h1 {
        margin: 0;
        font-size: 2rem;
      }

      p:last-of-type {
        margin: 0;
        color: var(--tp-muted);
        line-height: 1.6;
      }

      a {
        justify-self: center;
        border: 2px solid var(--tp-ink);
        box-shadow: var(--tp-shadow-sm);
        font-weight: 900;
      }
    `
  ]
})
export class NotFoundPageComponent {}
