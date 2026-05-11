import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api.config';
import { Team } from '../models/team-pulse.models';

@Injectable({ providedIn: 'root' })
export class TeamsApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.apiBaseUrl}/teams`);
  }

  getTeam(id: number): Observable<Team> {
    return this.http.get<Team>(`${this.apiBaseUrl}/teams/${id}`);
  }

  createTeam(team: Team): Observable<Team> {
    return this.http.post<Team>(`${this.apiBaseUrl}/teams`, team);
  }

  updateTeam(id: number, team: Team): Observable<Team> {
    return this.http.put<Team>(`${this.apiBaseUrl}/teams/${id}`, team);
  }

  deleteTeam(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/teams/${id}`);
  }
}
