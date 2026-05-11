import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api.config';
import { Evaluation } from '../models/team-pulse.models';

@Injectable({ providedIn: 'root' })
export class EvaluationsApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  getEvaluations(): Observable<Evaluation[]> {
    return this.http.get<Evaluation[]>(`${this.apiBaseUrl}/evaluations`);
  }

  getMemberEvaluations(memberId: number): Observable<Evaluation[]> {
    return this.http.get<Evaluation[]>(`${this.apiBaseUrl}/members/${memberId}/evaluations`);
  }

  createEvaluation(evaluation: Evaluation): Observable<Evaluation> {
    return this.http.post<Evaluation>(`${this.apiBaseUrl}/evaluations`, evaluation);
  }

  updateEvaluation(id: number, evaluation: Evaluation): Observable<Evaluation> {
    return this.http.put<Evaluation>(`${this.apiBaseUrl}/evaluations/${id}`, evaluation);
  }

  deleteEvaluation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/evaluations/${id}`);
  }
}
