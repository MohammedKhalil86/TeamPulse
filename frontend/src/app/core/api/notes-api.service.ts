import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL, DATA_MODE } from './api.config';
import { StaticDataStore } from '../data/static-data-store.service';
import { OneToOneNote } from '../models/team-pulse.models';

@Injectable({ providedIn: 'root' })
export class NotesApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);
  private readonly dataMode = inject(DATA_MODE);
  private readonly staticData = inject(StaticDataStore);

  getMemberNotes(memberId: number): Observable<OneToOneNote[]> {
    if (this.dataMode === 'static') {
      return this.staticData.getMemberNotes(memberId);
    }

    return this.http.get<OneToOneNote[]>(`${this.apiBaseUrl}/members/${memberId}/notes`);
  }

  createNote(note: OneToOneNote): Observable<OneToOneNote> {
    if (this.dataMode === 'static') {
      return this.staticData.createNote(note);
    }

    return this.http.post<OneToOneNote>(`${this.apiBaseUrl}/notes`, note);
  }

  deleteNote(id: number): Observable<void> {
    if (this.dataMode === 'static') {
      return this.staticData.deleteNote(id);
    }

    return this.http.delete<void>(`${this.apiBaseUrl}/notes/${id}`);
  }
}
