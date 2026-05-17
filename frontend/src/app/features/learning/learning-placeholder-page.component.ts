import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { SectionCardComponent } from '../../shared/components/section-card/section-card.component';

@Component({
  selector: 'tp-learning-placeholder-page',
  standalone: true,
  imports: [ButtonModule, PageHeaderComponent, RouterLink, SectionCardComponent, TagModule],
  template: `
    <tp-page-header
      eyebrow="Learning Lab"
      [title]="isMcpPage() ? 'MCP Servers' : 'Run Locally'"
      [subtitle]="
        isMcpPage()
          ? 'A focused MCP Servers learning page will be added in the next implementation step.'
          : 'A focused local setup guide will be added in the next implementation step.'
      "
    />

    <section class="placeholder-grid">
      <tp-section-card [title]="isMcpPage() ? 'Coming Next: MCP Servers' : 'Coming Next: Run Locally'">
        <div class="placeholder-body">
          <p-tag value="Planned lesson" severity="info" />
          <p>
            {{
              isMcpPage()
                ? 'This page is reserved for explaining how MCP servers fit into the TeamPulse learning workflow.'
                : 'This page is reserved for explaining the local development workflow for TeamPulse.'
            }}
          </p>
          <a pButton routerLink="/learning/angular" icon="pi pi-bolt" label="Open Angular Learning" severity="secondary"></a>
        </div>
      </tp-section-card>
    </section>
  `,
  styles: [
    `
      .placeholder-grid {
        max-width: 52rem;
      }

      .placeholder-body {
        display: grid;
        gap: var(--tp-space-4);
        justify-items: start;
      }

      p {
        max-width: 42rem;
        margin: 0;
        color: var(--tp-muted);
        line-height: 1.65;
      }
    `
  ]
})
export class LearningPlaceholderPageComponent {
  private readonly router = inject(Router);

  protected readonly isMcpPage = computed(() => this.router.url.includes('/learning/mcp-servers'));
}
