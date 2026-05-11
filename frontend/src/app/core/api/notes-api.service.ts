import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api.config';
import { OneToOneNote } from '../models/team-pulse.models';

@Injectable({ providedIn: 'root' })
export class NotesApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  getMemberNotes(memberId: number): Observable<OneToOneNote[]> {
    return this.http.get<OneToOneNote[]>(`${this.apiBaseUrl}/members/${memberId}/notes`);
  }

  createNote(note: OneToOneNote): Observable<OneToOneNote> {
    return this.http.post<OneToOneNote>(`${this.apiBaseUrl}/notes`, note);
  }

  deleteNote(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/notes/${id}`);
  }
}
