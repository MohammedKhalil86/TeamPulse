import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL, DATA_MODE } from './api.config';
import { StaticDataStore } from '../data/static-data-store.service';
import { ManagerDashboard, MemberDashboard } from '../models/team-pulse.models';

@Injectable({ providedIn: 'root' })
export class DashboardApiService {
  // Learning Lab: HttpClient services
  // Feature pages depend on this service instead of constructing URLs or calling HttpClient directly.
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);
  private readonly dataMode = inject(DATA_MODE);
  private readonly staticData = inject(StaticDataStore);

  getManagerDashboard(): Observable<ManagerDashboard> {
    if (this.dataMode === 'static') {
      return this.staticData.getManagerDashboard();
    }

    // Learning Lab: Local API setup
    // In local development this calls the ASP.NET Core Minimal API through HttpClient.
    return this.http.get<ManagerDashboard>(`${this.apiBaseUrl}/dashboard/manager`);
  }

  getMemberDashboard(userId: number): Observable<MemberDashboard> {
    if (this.dataMode === 'static') {
      return this.staticData.getMemberDashboard(userId);
    }

    return this.http.get<MemberDashboard>(`${this.apiBaseUrl}/dashboard/member/${userId}`);
  }
}
