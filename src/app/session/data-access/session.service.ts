import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Observable, map } from 'rxjs';
import { Session, SessionAction, SessionControlInfo, SessionInfo } from '../models/session';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  constructor(@Inject('BTCIS.ME-API') private url: string, private httpClient: HttpClient) { }

  getSession(sessionId: string): Observable<SessionInfo> {
    return this.httpClient.get(`${this.url}/v1/sessions/${sessionId}`).pipe(
      map(value => <SessionInfo>value)
    )
  }

  getAll(): Observable<SessionInfo[]> {
    return this.httpClient.get(`${this.url}/v1/sessions`).pipe(
      map(value => <SessionInfo[]>value)
    )
  }

  createSession(session: Session): Observable<SessionControlInfo> {
    return this.httpClient.post(`${this.url}/v1/sessions`, session).pipe(
      map(value => <SessionControlInfo>value)
    )
  }

  sendMessage(session: SessionControlInfo, action: SessionAction, message?: Message): Observable<SessionInfo> {
    const req = {
      controlId: session.controlId,
      action: action,
      data: message
    };
    return this.httpClient.post(`${this.url}/v1/sessions/${session.id}/actions`, req).pipe(
      map(value => <SessionInfo>value)
    )
  }

  connect(init: (connection: HubConnection) => void, onStart: (connection: HubConnection) => void): HubConnection {
    const connection = new HubConnectionBuilder()
      .withUrl(`${this.url}/sessions-hub`)
      .build();

    init(connection);

    connection.start()
      .then(() => {
        console.log('connection started');
        onStart(connection);
      })
      .catch((err) => console.log('error while establishing signalr connection: ' + err));

    return connection;
  }
}
