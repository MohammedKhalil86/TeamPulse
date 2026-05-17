import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { StorageService } from '../storage/storage.service';

export type ThemeMode = 'light' | 'dark';

const THEME_KEY = 'teampulse.theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storage = inject(StorageService);
  private readonly selectedTheme = signal<ThemeMode>(this.storage.get<ThemeMode>(THEME_KEY) ?? 'light');

  readonly theme = this.selectedTheme.asReadonly();
  readonly isDark = computed(() => this.selectedTheme() === 'dark');

  constructor() {
    // Learning Lab: effect()
    // Effects are for side effects: sync the theme signal to the DOM class and localStorage.
    effect(() => {
      const theme = this.selectedTheme();
      document.documentElement.classList.toggle('app-dark', theme === 'dark');
      this.storage.set(THEME_KEY, theme);
    });
  }

  toggle(): void {
    this.selectedTheme.update((theme) => (theme === 'dark' ? 'light' : 'dark'));
  }
}
