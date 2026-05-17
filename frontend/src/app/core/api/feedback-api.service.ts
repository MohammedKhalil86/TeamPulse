import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL, DATA_MODE } from './api.config';
import { StaticDataStore } from '../data/static-data-store.service';
import { Feedback } from '../models/team-pulse.models';

@Injectable({ providedIn: 'root' })
export class FeedbackApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);
  private readonly dataMode = inject(DATA_MODE);
  private readonly staticData = inject(StaticDataStore);

  getFeedback(): Observable<Feedback[]> {
    if (this.dataMode === 'static') {
      return this.staticData.getFeedback();
    }

    return this.http.get<Feedback[]>(`${this.apiBaseUrl}/feedback`);
  }

  getMemberFeedback(memberId: number): Observable<Feedback[]> {
    if (this.dataMode === 'static') {
      return this.staticData.getMemberFeedback(memberId);
    }

    return this.http.get<Feedback[]>(`${this.apiBaseUrl}/members/${memberId}/feedback`);
  }

  createFeedback(feedback: Feedback): Observable<Feedback> {
    if (this.dataMode === 'static') {
      return this.staticData.createFeedback(feedback);
    }

    return this.http.post<Feedback>(`${this.apiBaseUrl}/feedback`, feedback);
  }

  deleteFeedback(id: number): Observable<void> {
    if (this.dataMode === 'static') {
      return this.staticData.deleteFeedback(id);
    }

    return this.http.delete<void>(`${this.apiBaseUrl}/feedback/${id}`);
  }
}
