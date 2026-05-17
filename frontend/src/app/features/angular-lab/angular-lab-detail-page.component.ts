import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { TagModule } from 'primeng/tag';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { SectionCardComponent } from '../../shared/components/section-card/section-card.component';
import { CodeWalkthrough, getCodeWalkthroughs } from '../learning/code-walkthroughs.data';
import { ANGULAR_LAB_FEATURES, findLabFeature, LabDifficulty, LabStatus } from './angular-lab.data';

@Component({
  selector: 'tp-angular-lab-detail-page',
  standalone: true,
  imports: [
    AccordionModule,
    ButtonModule,
    EmptyStateComponent,
    PageHeaderComponent,
    PanelModule,
    RouterLink,
    SectionCardComponent,
    TableModule,
    TabsModule,
    TagModule
  ],
  template: `
    @if (feature(); as feature) {
      <tp-page-header
        eyebrow="Learning Lab / Angular"
        [title]="feature.name"
        [subtitle]="feature.explanation"
        actionLabel="Back to Angular"
        actionIcon="pi pi-arrow-left"
        (action)="backLink.click()"
      />
      <a #backLink routerLink="/learning/angular" hidden></a>

      <section class="detail-grid">
        <tp-section-card title="Learning View" subtitle="How this Angular concept appears inside TeamPulse.">
          <div class="fact-list">
            <div>
              <span>Week</span>
              <strong>{{ feature.week }}</strong>
            </div>
            <div>
              <span>Category</span>
              <strong>{{ feature.category }}</strong>
            </div>
            <div>
              <span>Difficulty</span>
              <p-tag [value]="feature.difficulty" [severity]="difficultySeverity(feature.difficulty)" />
            </div>
            <div>
              <span>Status</span>
              <p-tag [value]="feature.status" [severity]="statusSeverity(feature.status)" />
            </div>
            <div>
              <span>Pages</span>
              <strong>{{ feature.pages.length }}</strong>
            </div>
            <div>
              <span>Components</span>
              <strong>{{ feature.components.length }}</strong>
            </div>
          </div>
        </tp-section-card>

        <tp-section-card title="Diagram" subtitle="A simple mental model for learners.">
          <pre>{{ feature.diagram }}</pre>
        </tp-section-card>
      </section>

      <p-tabs value="overview">
        <p-tablist>
          <p-tab value="overview">Overview</p-tab>
          <p-tab value="usage">TeamPulse Usage</p-tab>
          <p-tab value="code">Code</p-tab>
          <p-tab value="links">Links</p-tab>
        </p-tablist>
        <p-tabpanels>
          <p-tabpanel value="overview">
            <p-panel header="What it is">
              <p>{{ feature.explanation }}</p>
            </p-panel>
            <p-panel header="Why TeamPulse uses it">
              <p>{{ feature.whyTeamPulseUsesIt }}</p>
            </p-panel>
            @if (feature.statusNotes) {
              <p-panel header="Status notes">
                <p>{{ feature.statusNotes }}</p>
              </p-panel>
            }
          </p-tabpanel>

          <p-tabpanel value="usage">
            <p-table [value]="feature.components" responsiveLayout="scroll">
              <ng-template #header>
                <tr><th>Component or file</th></tr>
              </ng-template>
              <ng-template #body let-item>
                <tr><td>{{ item }}</td></tr>
              </ng-template>
            </p-table>

            <p-accordion>
              <p-accordion-panel value="pages">
                <p-accordion-header>Pages using this feature</p-accordion-header>
                <p-accordion-content>
                  <div class="tag-list">
                    @for (page of feature.pages; track page) {
                      <p-tag [value]="page" severity="info" />
                    }
                  </div>
                </p-accordion-content>
              </p-accordion-panel>

              @if (feature.primeNgComponents.length) {
                <p-accordion-panel value="primeng">
                  <p-accordion-header>Related PrimeNG components</p-accordion-header>
                  <p-accordion-content>
                    <div class="tag-list">
                      @for (component of feature.primeNgComponents; track component) {
                        <p-tag [value]="component" severity="success" />
                      }
                    </div>
                  </p-accordion-content>
                </p-accordion-panel>
              }
            </p-accordion>
          </p-tabpanel>

          <p-tabpanel value="code">
            @if (walkthroughs().length) {
              <div class="walkthrough-list">
                @for (walkthrough of walkthroughs(); track walkthrough.id) {
                  <article class="walkthrough-card">
                    <header>
                      <div>
                        <h3>{{ walkthrough.title }}</h3>
                        <span>{{ walkthrough.filePath }}</span>
                      </div>
                      <p-tag [value]="walkthrough.language" severity="secondary" />
                    </header>
                    <pre class="code-walkthrough"><code>@for (line of codeLines(walkthrough); track line.number) {
<span class="code-line" [class.highlight]="line.highlighted"><span class="line-number">{{ line.number }}</span><span class="line-text">{{ line.text }}</span></span>
}</code></pre>
                  </article>
                }
              </div>
            }
            <p-panel header="Project snippet">
              <pre><code>{{ feature.snippet }}</code></pre>
            </p-panel>
          </p-tabpanel>

          <p-tabpanel value="links">
            <div class="link-grid">
              @for (link of feature.pageLinks; track link.route) {
                <a pButton [routerLink]="link.route" icon="pi pi-external-link" [label]="link.label"></a>
              }
              <a pButton routerLink="/learning/angular" icon="pi pi-list" label="All Angular Topics" severity="secondary"></a>
            </div>
          </p-tabpanel>
        </p-tabpanels>
      </p-tabs>
    } @else {
      <tp-empty-state
        icon="pi pi-search"
        title="Learning topic not found"
        message="The requested Angular learning topic does not exist."
        actionLabel="Back to Angular"
        actionIcon="pi pi-arrow-left"
        (action)="backLink.click()"
      />
      <a #backLink routerLink="/learning/angular" hidden></a>
    }
  `,
  styles: [
    `
      .detail-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .fact-list {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 0.75rem;
      }

      .fact-list div {
        border: 2px solid var(--tp-ink);
        border-radius: var(--tp-radius-sm);
        background: color-mix(in srgb, var(--tp-accent) 10%, var(--tp-panel));
        padding: 0.75rem;
      }

      .fact-list span {
        display: block;
        color: var(--tp-muted);
        font-size: 0.78rem;
        font-weight: 900;
        text-transform: uppercase;
      }

      pre {
        overflow: auto;
        border: 2px solid var(--tp-ink);
        border-radius: var(--tp-radius-sm);
        background: #121212;
        color: #65ffb5;
        font-size: 0.9rem;
        line-height: 1.55;
        padding: 1rem;
        white-space: pre-wrap;
      }

      .walkthrough-list {
        display: grid;
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .walkthrough-card {
        display: grid;
        gap: 0.75rem;
      }

      .walkthrough-card header {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        align-items: center;
        justify-content: space-between;
      }

      .walkthrough-card h3 {
        margin: 0;
        font-size: 1rem;
      }

      .walkthrough-card header span {
        color: var(--tp-muted);
        font-family: var(--tp-font-code);
        font-size: 0.82rem;
      }

      .code-walkthrough {
        padding: 0.35rem 0;
      }

      .code-line {
        display: grid;
        grid-template-columns: 3rem minmax(0, 1fr);
        gap: 0.75rem;
        padding: 0 1rem;
      }

      .code-line.highlight {
        background: color-mix(in srgb, var(--tp-warning) 18%, transparent);
      }

      .line-number {
        color: #9aa6b2;
        text-align: right;
        user-select: none;
      }

      .line-text {
        white-space: pre-wrap;
      }

      p {
        color: var(--tp-muted);
        line-height: 1.65;
      }

      .tag-list,
      .link-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 0.65rem;
      }

      p-accordion {
        display: block;
        margin-top: 1rem;
      }

      @media (max-width: 900px) {
        .detail-grid,
        .fact-list {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class AngularLabDetailPageComponent {
  // Learning Lab: input() API + withComponentInputBinding()
  // The featureId route parameter is assigned to this signal input by the router.
  readonly featureId = input<string>('');
  protected readonly features = ANGULAR_LAB_FEATURES;
  protected readonly feature = computed(() => findLabFeature(this.featureId() || null));
  protected readonly walkthroughs = computed(() => getCodeWalkthroughs(this.feature()?.codeWalkthroughIds ?? []));

  protected difficultySeverity(difficulty: LabDifficulty): 'success' | 'warn' | 'danger' | 'info' {
    if (difficulty === 'Beginner') {
      return 'success';
    }

    return difficulty === 'Intermediate' ? 'info' : 'warn';
  }

  protected statusSeverity(status: LabStatus): 'success' | 'warn' | 'danger' | 'info' | 'secondary' {
    if (status === 'Implemented') {
      return 'success';
    }

    if (status === 'Partially implemented') {
      return 'info';
    }

    return status === 'Conceptual' ? 'warn' : 'secondary';
  }

  protected codeLines(walkthrough: CodeWalkthrough): Array<{ number: number; text: string; highlighted: boolean }> {
    const highlighted = new Set(walkthrough.highlightedLines ?? []);
    return walkthrough.code.split('\n').map((text, index) => ({
      number: index + 1,
      text,
      highlighted: highlighted.has(index + 1)
    }));
  }
}
