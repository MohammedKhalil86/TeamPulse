import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { API_BASE_URL, DATA_MODE } from '../api/api.config';
import { StaticDataStore } from '../data/static-data-store.service';
import { AppRole, LoginRequest, LoginResponse } from '../models/team-pulse.models';
import { StorageService } from '../storage/storage.service';

const SESSION_KEY = 'teampulse.v2.session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);
  private readonly dataMode = inject(DATA_MODE);
  private readonly staticData = inject(StaticDataStore);
  private readonly storage = inject(StorageService);
  private readonly user = signal<LoginResponse | null>(this.storage.get<LoginResponse>(SESSION_KEY));

  readonly currentUser = this.user.asReadonly();
  readonly isLoggedIn = computed(() => this.user() !== null);

  login(request: LoginRequest): Observable<LoginResponse> {
    const loginRequest =
      this.dataMode === 'static'
        ? this.staticData.login(request)
        : this.http.post<LoginResponse>(`${this.apiBaseUrl}/auth/login`, request);

    return loginRequest.pipe(
      tap((session) => {
        this.user.set(session);
        this.storage.set(SESSION_KEY, session);
      })
    );
  }

  logout(): void {
    if (this.dataMode === 'api') {
      this.http.post(`${this.apiBaseUrl}/auth/logout`, {}).subscribe({ error: () => undefined });
    }

    this.storage.remove(SESSION_KEY);
    this.user.set(null);
  }

  hasRole(role: AppRole | AppRole[]): boolean {
    const user = this.user();
    const roles = Array.isArray(role) ? role : [role];
    return !!user && roles.includes(user.appRole);
  }
}
