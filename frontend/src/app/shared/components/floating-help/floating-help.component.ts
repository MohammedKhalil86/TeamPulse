import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TabsModule } from 'primeng/tabs';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { HelpService } from '../../../core/help/help.service';
import { HelpFeatureRef, LEVEL_ORDER, LearnerLevel } from '../../../core/help/help.data';

@Component({
  selector: 'tp-floating-help',
  standalone: true,
  imports: [ButtonModule, DialogModule, RouterLink, TabsModule, TagModule, TooltipModule],
  template: `
    <button
      pButton
      type="button"
      class="help-button"
      icon="pi pi-question"
      [rounded]="true"
      pTooltip="Explain the Angular magic behind this page"
      tooltipPosition="left"
      aria-label="Open page help"
      (click)="visible.set(true)"
    ></button>

    <p-dialog
      [header]="dialogTitle()"
      [modal]="true"
      [visible]="visible()"
      (visibleChange)="visible.set($event)"
      [style]="{ width: 'min(64rem, calc(100vw - 2rem))' }"
      [contentStyle]="{ 'max-height': '78vh', 'overflow-y': 'auto' }"
      styleClass="tp-help-dialog"
    >
      <div class="help-root">
        <!-- Level selector -->
        <div class="level-bar">
          <span class="level-label">Learner level</span>
          <div class="level-buttons">
            @for (lvl of LEVELS; track lvl) {
              <button
                type="button"
                class="lvl-btn"
                [class.active]="learnerLevel() === lvl"
                (click)="learnerLevel.set(lvl)"
              >{{ lvl }}</button>
            }
          </div>
        </div>

        @if (entry(); as entry) {
          <p-tabs [value]="activeTab()" (valueChange)="activeTab.set($any($event))">
            <p-tablist>
              <p-tab value="overview"><i class="pi pi-info-circle"></i> Overview</p-tab>
              <p-tab value="angular"><i class="pi pi-bolt"></i> Angular</p-tab>
              <p-tab value="code"><i class="pi pi-code"></i> Code</p-tab>
              <p-tab value="diagram"><i class="pi pi-sitemap"></i> Diagram</p-tab>
              <p-tab value="lab"><i class="pi pi-graduation-cap"></i> Related Lab</p-tab>
            </p-tablist>

            <p-tabpanels>

              <!-- OVERVIEW TAB -->
              <p-tabpanel value="overview">
                <div class="tab-body">
                  <section class="overview-section">
                    <h4>What this page does</h4>
                    <p>{{ entry.businessOverview }}</p>
                  </section>

                  <section class="overview-section">
                    <h4>Actions available on this page</h4>
                    <ul class="action-list">
                      @for (action of entry.userActions; track action) {
                        <li>{{ action }}</li>
                      }
                    </ul>
                  </section>

                  @if (entry.primeNgComponents.length) {
                    <section class="overview-section">
                      <h4>PrimeNG components used</h4>
                      <div class="tag-cluster">
                        @for (comp of entry.primeNgComponents; track comp) {
                          <p-tag [value]="comp" severity="success" />
                        }
                      </div>
                    </section>
                  }
                </div>
              </p-tabpanel>

              <!-- ANGULAR TAB -->
              <p-tabpanel value="angular">
                <div class="tab-body">
                  @if (filteredFeatures().length === 0) {
                    <p class="empty-note">No Angular features match the selected learner level for this page.</p>
                  } @else {
                    <p class="level-note">
                      Showing features for <strong>{{ learnerLevel() }}</strong> level
                      @if (learnerLevel() !== 'Beginner') {
                        <span> (includes lower levels)</span>
                      }
                    </p>
                    <div class="feature-list">
                      @for (feat of filteredFeatures(); track feat.labId) {
                        <div class="feature-card">
                          <div class="feature-header">
                            <strong>{{ feat.name }}</strong>
                            <p-tag
                              [value]="feat.minLevel"
                              [severity]="levelSeverity(feat.minLevel)"
                            />
                          </div>
                          <p>{{ feat.pageNote }}</p>
                        </div>
                      }
                    </div>
                  }
                </div>
              </p-tabpanel>

              <!-- CODE TAB -->
              <p-tabpanel value="code">
                <div class="tab-body">
                  @if (filteredSnippets().length === 0) {
                    <div class="snippet-placeholder">
                      <p-tag value="No snippet at this level" severity="secondary" />
                      <p>
                        No code snippets are configured for the
                        <strong>{{ learnerLevel() }}</strong> level on this page yet.
                        Open <a routerLink="/learning/angular">Learning Lab → Angular</a>
                        for detailed code examples with diagrams.
                      </p>
                    </div>
                  } @else {
                    @for (snippet of filteredSnippets(); track snippet.label) {
                      <div class="snippet-block">
                        <div class="snippet-header">
                          <span class="snippet-label">{{ snippet.label }}</span>
                          <p-tag
                            [value]="snippet.minLevel"
                            [severity]="levelSeverity(snippet.minLevel)"
                          />
                        </div>
                        <pre><code>{{ snippet.code }}</code></pre>
                      </div>
                    }
                  }
                </div>
              </p-tabpanel>

              <!-- DIAGRAM TAB -->
              <p-tabpanel value="diagram">
                <div class="tab-body">
                  @if (entry.diagram) {
                    <pre class="diagram-block">{{ entry.diagram }}</pre>
                  } @else {
                    <p class="empty-note">No diagram available for this page.</p>
                  }
                </div>
              </p-tabpanel>

              <!-- RELATED LAB TAB -->
              <p-tabpanel value="lab">
                <div class="tab-body">
                  @if (entry.relatedLabIds.length) {
                    <p class="level-note">Open a Learning Lab topic to see snippets, diagrams, and links to pages that use the concept.</p>
                    <div class="lab-links">
                      @for (id of entry.relatedLabIds; track id) {
                        <a
                          pButton
                          [routerLink]="['/learning/angular', id]"
                          icon="pi pi-graduation-cap"
                          [label]="labLinkLabel(id)"
                          severity="secondary"
                          (click)="visible.set(false)"
                        ></a>
                      }
                      <a
                        pButton
                        routerLink="/learning/angular"
                        icon="pi pi-list"
                        label="All Angular Topics"
                        (click)="visible.set(false)"
                      ></a>
                    </div>
                  } @else {
                    <p class="empty-note">No related lab entries for this page.</p>
                  }
                </div>
              </p-tabpanel>

            </p-tabpanels>
          </p-tabs>
        } @else {
          <div class="no-entry">
            <p>No page guide is available for this route yet.</p>
            <a pButton routerLink="/learning/angular" icon="pi pi-graduation-cap" label="Open Learning Lab" (click)="visible.set(false)"></a>
          </div>
        }
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

      .help-root {
        display: grid;
        gap: 1rem;
      }

      /* Level selector */
      .level-bar {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.75rem;
        border: 2px solid var(--tp-ink);
        border-radius: var(--tp-radius-sm);
        background: color-mix(in srgb, var(--tp-accent) 8%, var(--tp-panel));
        padding: 0.6rem 1rem;
      }

      .level-label {
        color: var(--tp-muted);
        font-size: 0.8rem;
        font-weight: 900;
        text-transform: uppercase;
        white-space: nowrap;
      }

      .level-buttons {
        display: flex;
        gap: 0.4rem;
      }

      .lvl-btn {
        border: 2px solid var(--tp-ink);
        border-radius: var(--tp-radius-sm);
        background: var(--tp-panel);
        box-shadow: 2px 2px 0 var(--tp-ink);
        color: var(--tp-text);
        cursor: pointer;
        font: inherit;
        font-size: 0.82rem;
        font-weight: 800;
        padding: 0.3rem 0.7rem;
        transition: background-color var(--tp-motion-fast), box-shadow var(--tp-motion-fast);
      }

      .lvl-btn.active {
        background: var(--tp-warning);
        box-shadow: 3px 3px 0 var(--tp-ink);
        color: #121212;
      }

      .lvl-btn:hover:not(.active) {
        background: color-mix(in srgb, var(--tp-warning) 35%, var(--tp-panel));
      }

      /* Tabs */
      p-tabs {
        display: block;
      }

      p-tab i {
        margin-right: 0.4rem;
      }

      /* Tab body */
      .tab-body {
        display: grid;
        gap: 1.25rem;
        padding: 0.25rem 0;
      }

      /* Overview */
      .overview-section h4 {
        margin: 0 0 0.5rem;
        font-size: 0.82rem;
        font-weight: 900;
        text-transform: uppercase;
        color: var(--tp-muted);
      }

      .overview-section p {
        margin: 0;
        color: var(--tp-muted);
        line-height: 1.65;
      }

      .action-list {
        margin: 0;
        padding-left: 1.25rem;
        color: var(--tp-muted);
        line-height: 1.75;
      }

      .tag-cluster {
        display: flex;
        flex-wrap: wrap;
        gap: 0.45rem;
      }

      /* Angular tab */
      .level-note {
        margin: 0;
        color: var(--tp-muted);
        font-size: 0.88rem;
        line-height: 1.5;
      }

      .feature-list {
        display: grid;
        gap: 0.65rem;
      }

      .feature-card {
        border: 2px solid var(--tp-ink);
        border-radius: var(--tp-radius-sm);
        background: color-mix(in srgb, var(--tp-accent) 6%, var(--tp-panel));
        padding: 0.75rem 1rem;
      }

      .feature-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
        margin-bottom: 0.4rem;
      }

      .feature-header strong {
        font-size: 0.95rem;
      }

      .feature-card p {
        margin: 0;
        color: var(--tp-muted);
        font-size: 0.92rem;
        line-height: 1.6;
      }

      /* Code tab */
      .snippet-placeholder {
        display: grid;
        gap: 0.75rem;
        justify-items: start;
      }

      .snippet-placeholder p {
        margin: 0;
        color: var(--tp-muted);
        line-height: 1.65;
      }

      .snippet-placeholder a {
        color: var(--tp-accent);
        font-weight: 700;
      }

      .snippet-block {
        display: grid;
        gap: 0.5rem;
      }

      .snippet-header {
        display: flex;
        align-items: center;
        gap: 0.6rem;
      }

      .snippet-label {
        font-size: 0.85rem;
        font-weight: 800;
        color: var(--tp-text);
      }

      pre {
        overflow: auto;
        border: 2px solid var(--tp-ink);
        border-radius: var(--tp-radius-sm);
        background: #121212;
        color: #65ffb5;
        font-size: 0.85rem;
        line-height: 1.55;
        margin: 0;
        padding: 1rem;
        white-space: pre-wrap;
        word-break: break-word;
      }

      /* Diagram tab */
      .diagram-block {
        background: color-mix(in srgb, var(--tp-accent) 4%, var(--tp-panel));
        color: var(--tp-text);
        font-size: 0.88rem;
        line-height: 1.7;
      }

      /* Related Lab tab */
      .lab-links {
        display: flex;
        flex-wrap: wrap;
        gap: 0.55rem;
      }

      /* Empty / no entry */
      .empty-note {
        margin: 0;
        color: var(--tp-muted);
        font-style: italic;
      }

      .no-entry {
        display: grid;
        gap: 1rem;
        justify-items: start;
        padding: 0.5rem 0;
      }

      .no-entry p {
        margin: 0;
        color: var(--tp-muted);
      }
    `
  ]
})
export class FloatingHelpComponent {
  protected readonly help = inject(HelpService);
  protected readonly entry = this.help.currentEntry;

  protected readonly learnerLevel = signal<LearnerLevel>('Beginner');
  protected readonly visible = signal(false);
  protected readonly activeTab = signal('overview');

  protected readonly LEVELS: LearnerLevel[] = ['Beginner', 'Intermediate', 'Advanced'];

  protected readonly dialogTitle = computed(() => {
    const entry = this.entry();
    return entry ? `${entry.pageTitle} — Angular Guide` : 'Page Guide';
  });

  protected readonly filteredFeatures = computed<HelpFeatureRef[]>(() => {
    const entry = this.entry();
    if (!entry) return [];
    const maxOrder = LEVEL_ORDER[this.learnerLevel()];
    return entry.angularFeatures.filter((f) => LEVEL_ORDER[f.minLevel] <= maxOrder);
  });

  protected readonly filteredSnippets = computed(() => {
    const entry = this.entry();
    if (!entry) return [];
    const maxOrder = LEVEL_ORDER[this.learnerLevel()];
    return entry.codeSnippets.filter((s) => LEVEL_ORDER[s.minLevel] <= maxOrder);
  });

  protected levelSeverity(level: LearnerLevel): 'success' | 'info' | 'warn' {
    if (level === 'Beginner') return 'success';
    if (level === 'Intermediate') return 'info';
    return 'warn';
  }

  protected labLinkLabel(id: string): string {
    return id
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }
}
