import { computed, inject, Injectable, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { findPageHelpEntry, PageHelpEntry } from './help.data';
import { getCodeWalkthroughsForFeatures } from '../../features/learning/code-walkthroughs.data';

@Injectable({ providedIn: 'root' })
export class HelpService {
  private readonly router = inject(Router);
  private readonly currentUrl = signal(this.router.url);

  readonly currentEntry = computed<PageHelpEntry | undefined>(() =>
    findPageHelpEntry(this.currentUrl())
  );

  readonly currentWalkthroughs = computed(() => {
    const entry = this.currentEntry();
    return entry ? getCodeWalkthroughsForFeatures(entry.relatedLabIds) : [];
  });

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.currentUrl.set(event.urlAfterRedirects));
  }
}
