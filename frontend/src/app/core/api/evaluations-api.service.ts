import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL, DATA_MODE } from './api.config';
import { StaticDataStore } from '../data/static-data-store.service';
import { Evaluation } from '../models/team-pulse.models';

@Injectable({ providedIn: 'root' })
export class EvaluationsApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);
  private readonly dataMode = inject(DATA_MODE);
  private readonly staticData = inject(StaticDataStore);

  getEvaluations(): Observable<Evaluation[]> {
    if (this.dataMode === 'static') {
      return this.staticData.getEvaluations();
    }

    return this.http.get<Evaluation[]>(`${this.apiBaseUrl}/evaluations`);
  }

  getMemberEvaluations(memberId: number): Observable<Evaluation[]> {
    if (this.dataMode === 'static') {
      return this.staticData.getMemberEvaluations(memberId);
    }

    return this.http.get<Evaluation[]>(`${this.apiBaseUrl}/members/${memberId}/evaluations`);
  }

  createEvaluation(evaluation: Evaluation): Observable<Evaluation> {
    if (this.dataMode === 'static') {
      return this.staticData.createEvaluation(evaluation);
    }

    return this.http.post<Evaluation>(`${this.apiBaseUrl}/evaluations`, evaluation);
  }

  updateEvaluation(id: number, evaluation: Evaluation): Observable<Evaluation> {
    if (this.dataMode === 'static') {
      return this.staticData.updateEvaluation(id, evaluation);
    }

    return this.http.put<Evaluation>(`${this.apiBaseUrl}/evaluations/${id}`, evaluation);
  }

  deleteEvaluation(id: number): Observable<void> {
    if (this.dataMode === 'static') {
      return this.staticData.deleteEvaluation(id);
    }

    return this.http.delete<void>(`${this.apiBaseUrl}/evaluations/${id}`);
  }
}
