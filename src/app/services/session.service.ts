import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ControlSession, Session } from '../models/types';
import { CreateSession } from '../models/create-session';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private _baseUrl = 'https://api.btcis.me';
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

  registerUser(sessionId: string, userName: string): Observable<User> {
    const user = { name: userName };
    return this._httpClient.post(`${this._baseUrl}/v1/sessions/${sessionId}/users`, user).pipe(
      map(value => <User>value)
    )
  }

  connect(sessionId: string, consumer: (message: string) => void): HubConnection {
    const connection = new HubConnectionBuilder()
      .withUrl(`${this._baseUrl}/v1/sessions`)
      .build();
    connection.on(sessionId, message => consumer(message));
    connection.start()
      .then(() => console.log('connection started'))
      .catch((err) => console.log('error while establishing signalr connection: ' + err));

    return connection;
  }
}
