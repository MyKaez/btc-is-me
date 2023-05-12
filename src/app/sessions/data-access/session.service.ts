import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { User } from '../models/user';
import { SessionHostInfo, Session, SessionInfo, SessionAction } from '../models/session';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private _baseUrl = 'https://api.btcis.me';
  //private _baseUrl = 'https://localhost:5001';

  constructor(private _httpClient: HttpClient) { }

  getSession(sessionId: string): Observable<SessionInfo> {
    return this._httpClient.get(`${this._baseUrl}/v1/sessions/${sessionId}`).pipe(
      map(value => <SessionInfo>value)
    )
  }

  createSession(session: Session): Observable<SessionHostInfo> {
    return this._httpClient.post(`${this._baseUrl}/v1/sessions`, session).pipe(
      map(value => <SessionHostInfo>value)
    )
  }

  sendMessage(session: SessionHostInfo, action: SessionAction, message?: Message): Observable<SessionInfo> {
    const req = {
      controlId: session.controlId,
      action: action,
      data: message
    };
    return this._httpClient.post(`${this._baseUrl}/v1/sessions/${session.id}/actions`, req).pipe(
      map(value => <SessionInfo>value)
    )
  }

  registerUser(sessionId: string, userName: string): Observable<User> {
    const user = { name: userName };
    return this._httpClient.post(`${this._baseUrl}/v1/sessions/${sessionId}/users`, user).pipe(
      map(value => <User>value)
    )
  }

  sendUserMessage(sessionId: string, userId: string, message: Message): Observable<User> {
    return this._httpClient.post(`${this._baseUrl}/v1/sessions/${sessionId}/users/${userId}/actions`, message).pipe(
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
