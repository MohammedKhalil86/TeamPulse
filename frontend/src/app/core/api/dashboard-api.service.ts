import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api.config';
import { ManagerDashboard, MemberDashboard } from '../models/team-pulse.models';

@Injectable({ providedIn: 'root' })
export class DashboardApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  getManagerDashboard(): Observable<ManagerDashboard> {
    return this.http.get<ManagerDashboard>(`${this.apiBaseUrl}/dashboard/manager`);
  }

  getMemberDashboard(userId: number): Observable<MemberDashboard> {
    return this.http.get<MemberDashboard>(`${this.apiBaseUrl}/dashboard/member/${userId}`);
  }
}
