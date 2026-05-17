import { InjectionToken } from '@angular/core';
import { environment } from '../../../environments/environment';

export type DataMode = 'api' | 'static';

// Learning Lab: Injection tokens
// Environment values become injectable dependencies, which keeps services testable and mode-aware.
export const DATA_MODE = new InjectionToken<DataMode>('DATA_MODE', {
  providedIn: 'root',
  factory: () => environment.dataMode
});

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => environment.apiBaseUrl
});

export const STATIC_SEED_DATA_BASE_URL = new InjectionToken<string>('STATIC_SEED_DATA_BASE_URL', {
  providedIn: 'root',
  factory: () => environment.seedDataBaseUrl
});
