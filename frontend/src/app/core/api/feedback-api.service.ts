import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api.config';
import { Feedback } from '../models/team-pulse.models';

@Injectable({ providedIn: 'root' })
export class FeedbackApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  getFeedback(): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(`${this.apiBaseUrl}/feedback`);
  }

  getMemberFeedback(memberId: number): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(`${this.apiBaseUrl}/members/${memberId}/feedback`);
  }

  createFeedback(feedback: Feedback): Observable<Feedback> {
    return this.http.post<Feedback>(`${this.apiBaseUrl}/feedback`, feedback);
  }

  deleteFeedback(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/feedback/${id}`);
  }
}
