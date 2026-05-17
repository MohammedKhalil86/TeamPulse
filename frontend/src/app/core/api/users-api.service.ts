import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL, DATA_MODE } from './api.config';
import { StaticDataStore } from '../data/static-data-store.service';
import { User } from '../models/team-pulse.models';

@Injectable({ providedIn: 'root' })
export class UsersApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);
  private readonly dataMode = inject(DATA_MODE);
  private readonly staticData = inject(StaticDataStore);

  getUsers(): Observable<User[]> {
    if (this.dataMode === 'static') {
      return this.staticData.getUsers();
    }

    return this.http.get<User[]>(`${this.apiBaseUrl}/users`);
  }

  getUser(id: number): Observable<User> {
    if (this.dataMode === 'static') {
      return this.staticData.getUser(id);
    }

    return this.http.get<User>(`${this.apiBaseUrl}/users/${id}`);
  }
}
