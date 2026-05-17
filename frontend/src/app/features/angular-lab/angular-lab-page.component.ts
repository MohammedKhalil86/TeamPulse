import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { SectionCardComponent } from '../../shared/components/section-card/section-card.component';
import { ANGULAR_LAB_FEATURES, LabDifficulty, LabStatus } from './angular-lab.data';

@Component({
  selector: 'tp-angular-lab-page',
  standalone: true,
  imports: [ButtonModule, CardModule, FormsModule, PageHeaderComponent, RouterLink, SectionCardComponent, SelectModule, TagModule],
  template: `
    <tp-page-header
      eyebrow="Learning Lab / Angular"
      title="Angular learning map"
      subtitle="See how TeamPulse pages demonstrate Angular concepts, PrimeNG usage, state, routing, forms, architecture, and roadmap topics."
    />

    <tp-section-card title="Explore Angular Topics" subtitle="Filter the learning map and open topic details for project-specific explanations.">
      <div class="lab-toolbar">
        <input type="search" placeholder="Search features or pages" [value]="search()" (input)="search.set($any($event.target).value)" />
        <p-select [options]="weekOptions()" [ngModel]="weekFilter()" (ngModelChange)="weekFilter.set($event)" placeholder="Week" [showClear]="true" />
        <p-select
          [options]="difficultyOptions"
          [ngModel]="difficultyFilter()"
          (ngModelChange)="difficultyFilter.set($event)"
          placeholder="Difficulty"
          [showClear]="true"
        />
        <p-select
          [options]="categoryOptions()"
          [ngModel]="categoryFilter()"
          (ngModelChange)="categoryFilter.set($event)"
          placeholder="Category"
          [showClear]="true"
        />
        <p-select [options]="statusOptions" [ngModel]="statusFilter()" (ngModelChange)="statusFilter.set($event)" placeholder="Status" [showClear]="true" />
      </div>
    </tp-section-card>

    <section class="lab-grid">
      @for (feature of filteredFeatures(); track feature.id) {
        <p-card styleClass="lab-card tp-interactive-card">
          <ng-template #title>{{ feature.name }}</ng-template>
          <ng-template #subtitle>
            <div class="card-tags">
              <p-tag [value]="'Week ' + feature.week" severity="secondary" />
              <p-tag [value]="feature.difficulty" [severity]="difficultySeverity(feature.difficulty)" />
              <p-tag [value]="feature.status" [severity]="statusSeverity(feature.status)" />
            </div>
          </ng-template>
          <p>{{ feature.explanation }}</p>
          <p class="category">{{ feature.category }}</p>
          <div class="page-list">
            @for (page of feature.pages.slice(0, 4); track page) {
              <span>{{ page }}</span>
            }
          </div>
          <ng-template #footer>
            <a pButton [routerLink]="['/learning/angular', feature.id]" icon="pi pi-arrow-right" label="Open Details"></a>
          </ng-template>
        </p-card>
      }
    </section>
  `,
  styles: [
    `
      .lab-toolbar {
        display: flex;
        flex-wrap: wrap;
        gap: var(--tp-space-3);
        align-items: center;
      }

      input {
        min-width: min(26rem, 100%);
        border: 2px solid var(--tp-ink);
        border-radius: var(--tp-radius-sm);
        background: var(--tp-panel);
        color: var(--tp-text);
        font: inherit;
        font-weight: 800;
        padding: 0.75rem;
      }

      .lab-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 1rem;
        margin-top: 1rem;
      }

      :host ::ng-deep .lab-card {
        height: 100%;
      }

      p {
        color: var(--tp-muted);
        line-height: 1.55;
      }

      .card-tags {
        display: flex;
        flex-wrap: wrap;
        gap: var(--tp-space-2);
      }

      .category {
        margin-top: var(--tp-space-3);
        color: var(--tp-text);
        font-size: 0.85rem;
        font-weight: 900;
        text-transform: uppercase;
      }

      .page-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.45rem;
        margin: 1rem 0;
      }

      .page-list span {
        border: 2px solid var(--tp-ink);
        border-radius: var(--tp-radius-sm);
        background: var(--tp-warning);
        box-shadow: var(--tp-shadow-xs);
        color: #121212;
        font-size: 0.8rem;
        font-weight: 900;
        padding: 0.3rem 0.45rem;
      }

      @media (max-width: 1180px) {
        .lab-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (max-width: 760px) {
        .lab-grid {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class AngularLabPageComponent {
  protected readonly features = ANGULAR_LAB_FEATURES;
  protected readonly search = signal('');
  protected readonly weekFilter = signal<number | null>(null);
  protected readonly difficultyFilter = signal<LabDifficulty | null>(null);
  protected readonly categoryFilter = signal<string | null>(null);
  protected readonly statusFilter = signal<LabStatus | null>(null);
  protected readonly difficultyOptions: LabDifficulty[] = ['Beginner', 'Intermediate', 'Advanced'];
  protected readonly statusOptions: LabStatus[] = ['Implemented', 'Partially implemented', 'Conceptual', 'Future extension'];

  protected readonly weekOptions = computed(() => [...new Set(this.features.map((feature) => feature.week))].sort((a, b) => a - b));
  protected readonly categoryOptions = computed(() => [...new Set(this.features.map((feature) => feature.category))].sort());

  protected readonly filteredFeatures = computed(() => {
    const term = this.search().trim().toLowerCase();
    return this.features.filter((feature) => {
      const matchesTerm =
        !term ||
        feature.name.toLowerCase().includes(term) ||
        feature.explanation.toLowerCase().includes(term) ||
        feature.category.toLowerCase().includes(term) ||
        feature.status.toLowerCase().includes(term) ||
        feature.pages.some((page) => page.toLowerCase().includes(term));
      const matchesWeek = !this.weekFilter() || feature.week === this.weekFilter();
      const matchesDifficulty = !this.difficultyFilter() || feature.difficulty === this.difficultyFilter();
      const matchesCategory = !this.categoryFilter() || feature.category === this.categoryFilter();
      const matchesStatus = !this.statusFilter() || feature.status === this.statusFilter();
      return matchesTerm && matchesWeek && matchesDifficulty && matchesCategory && matchesStatus;
    });
  });

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
}
