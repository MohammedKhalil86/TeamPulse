import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL, DATA_MODE } from './api.config';
import { StaticDataStore } from '../data/static-data-store.service';
import { MemberProfile } from '../models/team-pulse.models';

@Injectable({ providedIn: 'root' })
export class MembersApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);
  private readonly dataMode = inject(DATA_MODE);
  private readonly staticData = inject(StaticDataStore);

  getMembers(): Observable<MemberProfile[]> {
    if (this.dataMode === 'static') {
      return this.staticData.getMembers();
    }

    return this.http.get<MemberProfile[]>(`${this.apiBaseUrl}/members`);
  }

  getMember(id: number): Observable<MemberProfile> {
    if (this.dataMode === 'static') {
      return this.staticData.getMember(id);
    }

    return this.http.get<MemberProfile>(`${this.apiBaseUrl}/members/${id}`);
  }

  getTeamMembers(teamId: number): Observable<MemberProfile[]> {
    if (this.dataMode === 'static') {
      return this.staticData.getTeamMembers(teamId);
    }

    return this.http.get<MemberProfile[]>(`${this.apiBaseUrl}/teams/${teamId}/members`);
  }

  createMember(member: MemberProfile): Observable<MemberProfile> {
    if (this.dataMode === 'static') {
      return this.staticData.createMember(member);
    }

    return this.http.post<MemberProfile>(`${this.apiBaseUrl}/members`, member);
  }

  updateMember(id: number, member: MemberProfile): Observable<MemberProfile> {
    if (this.dataMode === 'static') {
      return this.staticData.updateMember(id, member);
    }

    return this.http.put<MemberProfile>(`${this.apiBaseUrl}/members/${id}`, member);
  }

  deleteMember(id: number): Observable<void> {
    if (this.dataMode === 'static') {
      return this.staticData.deleteMember(id);
    }

    return this.http.delete<void>(`${this.apiBaseUrl}/members/${id}`);
  }
}
