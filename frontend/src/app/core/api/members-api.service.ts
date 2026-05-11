import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api.config';
import { MemberProfile } from '../models/team-pulse.models';

@Injectable({ providedIn: 'root' })
export class MembersApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  getMembers(): Observable<MemberProfile[]> {
    return this.http.get<MemberProfile[]>(`${this.apiBaseUrl}/members`);
  }

  getMember(id: number): Observable<MemberProfile> {
    return this.http.get<MemberProfile>(`${this.apiBaseUrl}/members/${id}`);
  }

  getTeamMembers(teamId: number): Observable<MemberProfile[]> {
    return this.http.get<MemberProfile[]>(`${this.apiBaseUrl}/teams/${teamId}/members`);
  }

  createMember(member: MemberProfile): Observable<MemberProfile> {
    return this.http.post<MemberProfile>(`${this.apiBaseUrl}/members`, member);
  }

  updateMember(id: number, member: MemberProfile): Observable<MemberProfile> {
    return this.http.put<MemberProfile>(`${this.apiBaseUrl}/members/${id}`, member);
  }

  deleteMember(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/members/${id}`);
  }
}
