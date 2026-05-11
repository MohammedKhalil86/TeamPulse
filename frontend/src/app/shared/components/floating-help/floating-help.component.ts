import { Component, input, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'tp-floating-help',
  standalone: true,
  imports: [ButtonModule, DialogModule, TagModule],
  template: `
    <button
      pButton
      type="button"
      class="help-button"
      icon="pi pi-question"
      [rounded]="true"
      aria-label="Open page help"
      (click)="visible.set(true)"
    ></button>

    <p-dialog
      [header]="title()"
      [modal]="true"
      [visible]="visible()"
      (visibleChange)="visible.set($event)"
      [style]="{ width: 'min(42rem, calc(100vw - 2rem))' }"
      styleClass="tp-help-dialog"
    >
      <div class="help-content">
        <section>
          <h3>Business Purpose</h3>
          <p>{{ businessPurpose() }}</p>
        </section>

        <section>
          <h3>Angular Features Used</h3>
          <div class="tag-list">
            @for (item of angularFeatures(); track item) {
              <p-tag [value]="item" severity="info" />
            }
          </div>
        </section>

        <section>
          <h3>PrimeNG Components Used</h3>
          <div class="tag-list">
            @for (item of primeNgComponents(); track item) {
              <p-tag [value]="item" severity="success" />
            }
          </div>
        </section>

        <section>
          <h3>Related Angular Lab Entries</h3>
          <ul>
            @for (entry of labEntries(); track entry) {
              <li>{{ entry }}</li>
            }
          </ul>
        </section>
      </div>
    </p-dialog>
  `,
  styles: [
    `
      .help-button {
        position: fixed;
        right: 1.5rem;
        bottom: 1.5rem;
        z-index: 20;
        border: 3px solid var(--tp-ink);
        box-shadow: var(--tp-shadow-md);
      }

      .help-content {
        display: grid;
        gap: 1rem;
      }

      h3 {
        margin: 0 0 0.4rem;
      }

      p {
        margin: 0;
        color: var(--tp-muted);
        line-height: 1.6;
      }

      .tag-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      ul {
        margin: 0;
        padding-left: 1.25rem;
      }
    `
  ]
})
export class FloatingHelpComponent {
  readonly title = input('Page Help');
  readonly businessPurpose = input('Understand what this page helps the user decide or complete.');
  readonly angularFeatures = input<string[]>([]);
  readonly primeNgComponents = input<string[]>([]);
  readonly labEntries = input<string[]>([]);

  protected readonly visible = signal(false);
}
