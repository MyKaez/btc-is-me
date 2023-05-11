import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ControlSession, Session } from '../models/types';
import { CreateSession } from '../models/create-session';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  _baseUrl = 'https://api.btcis.me';
  //private _baseUrl = 'https://localhost:5001';

  constructor(private _httpClient: HttpClient) { }

  getSession(sessionId: string): Observable<Session> {
    return this._httpClient.get(`${this._baseUrl}/v1/sessions/${sessionId}`).pipe(
      map(value => <Session>value)
    )
  }

  createSession(session: CreateSession): Observable<ControlSession> {
    return this._httpClient.post(`${this._baseUrl}/v1/sessions`, session).pipe(
      map(value => <ControlSession>value)
    )
  }
}
