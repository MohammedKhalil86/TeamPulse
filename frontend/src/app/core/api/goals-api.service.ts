import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL, DATA_MODE } from './api.config';
import { StaticDataStore } from '../data/static-data-store.service';
import { Goal } from '../models/team-pulse.models';

@Injectable({ providedIn: 'root' })
export class GoalsApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);
  private readonly dataMode = inject(DATA_MODE);
  private readonly staticData = inject(StaticDataStore);

  getGoals(): Observable<Goal[]> {
    if (this.dataMode === 'static') {
      return this.staticData.getGoals();
    }

    return this.http.get<Goal[]>(`${this.apiBaseUrl}/goals`);
  }

  getMemberGoals(memberId: number): Observable<Goal[]> {
    if (this.dataMode === 'static') {
      return this.staticData.getMemberGoals(memberId);
    }

    return this.http.get<Goal[]>(`${this.apiBaseUrl}/members/${memberId}/goals`);
  }

  getTeamGoals(teamId: number): Observable<Goal[]> {
    if (this.dataMode === 'static') {
      return this.staticData.getTeamGoals(teamId);
    }

    return this.http.get<Goal[]>(`${this.apiBaseUrl}/teams/${teamId}/goals`);
  }

  createGoal(goal: Goal): Observable<Goal> {
    if (this.dataMode === 'static') {
      return this.staticData.createGoal(goal);
    }

    return this.http.post<Goal>(`${this.apiBaseUrl}/goals`, goal);
  }

  updateGoal(id: number, goal: Goal): Observable<Goal> {
    if (this.dataMode === 'static') {
      return this.staticData.updateGoal(id, goal);
    }

    return this.http.put<Goal>(`${this.apiBaseUrl}/goals/${id}`, goal);
  }

  deleteGoal(id: number): Observable<void> {
    if (this.dataMode === 'static') {
      return this.staticData.deleteGoal(id);
    }

    return this.http.delete<void>(`${this.apiBaseUrl}/goals/${id}`);
  }
}
