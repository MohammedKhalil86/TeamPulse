import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL, DATA_MODE } from './api.config';
import { StaticDataStore } from '../data/static-data-store.service';
import { Team } from '../models/team-pulse.models';

@Injectable({ providedIn: 'root' })
export class TeamsApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);
  private readonly dataMode = inject(DATA_MODE);
  private readonly staticData = inject(StaticDataStore);

  getTeams(): Observable<Team[]> {
    if (this.dataMode === 'static') {
      return this.staticData.getTeams();
    }

    return this.http.get<Team[]>(`${this.apiBaseUrl}/teams`);
  }

  getTeam(id: number): Observable<Team> {
    if (this.dataMode === 'static') {
      return this.staticData.getTeam(id);
    }

    return this.http.get<Team>(`${this.apiBaseUrl}/teams/${id}`);
  }

  createTeam(team: Team): Observable<Team> {
    if (this.dataMode === 'static') {
      return this.staticData.createTeam(team);
    }

    return this.http.post<Team>(`${this.apiBaseUrl}/teams`, team);
  }

  updateTeam(id: number, team: Team): Observable<Team> {
    if (this.dataMode === 'static') {
      return this.staticData.updateTeam(id, team);
    }

    return this.http.put<Team>(`${this.apiBaseUrl}/teams/${id}`, team);
  }

  deleteTeam(id: number): Observable<void> {
    if (this.dataMode === 'static') {
      return this.staticData.deleteTeam(id);
    }

    return this.http.delete<void>(`${this.apiBaseUrl}/teams/${id}`);
  }
}
