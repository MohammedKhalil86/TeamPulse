import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api.config';
import { Goal } from '../models/team-pulse.models';

@Injectable({ providedIn: 'root' })
export class GoalsApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  getGoals(): Observable<Goal[]> {
    return this.http.get<Goal[]>(`${this.apiBaseUrl}/goals`);
  }

  getMemberGoals(memberId: number): Observable<Goal[]> {
    return this.http.get<Goal[]>(`${this.apiBaseUrl}/members/${memberId}/goals`);
  }

  getTeamGoals(teamId: number): Observable<Goal[]> {
    return this.http.get<Goal[]>(`${this.apiBaseUrl}/teams/${teamId}/goals`);
  }

  createGoal(goal: Goal): Observable<Goal> {
    return this.http.post<Goal>(`${this.apiBaseUrl}/goals`, goal);
  }

  updateGoal(id: number, goal: Goal): Observable<Goal> {
    return this.http.put<Goal>(`${this.apiBaseUrl}/goals/${id}`, goal);
  }

  deleteGoal(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/goals/${id}`);
  }
}
