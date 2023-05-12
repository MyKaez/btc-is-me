import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { SessionHostInfo, Session, SessionInfo, SessionAction } from '../models/session';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(@Inject('BTCIS.ME-API') private _url: string, private _httpClient: HttpClient) { }

  getSession(sessionId: string): Observable<SessionInfo> {
    return this._httpClient.get(`${this._url}/v1/sessions/${sessionId}`).pipe(
      map(value => <SessionInfo>value)
    )
  }

  createSession(session: Session): Observable<SessionHostInfo> {
    return this._httpClient.post(`${this._url}/v1/sessions`, session).pipe(
      map(value => <SessionHostInfo>value)
    )
  }

  sendMessage(session: SessionHostInfo, action: SessionAction, message?: Message): Observable<SessionInfo> {
    const req = {
      controlId: session.controlId,
      action: action,
      data: message
    };
    return this._httpClient.post(`${this._url}/v1/sessions/${session.id}/actions`, req).pipe(
      map(value => <SessionInfo>value)
    )
  }

  connect(sessionId: string, listener: (connection: HubConnection) => void): HubConnection {
    const connection = new HubConnectionBuilder()
      .withUrl(`${this._url}/v1/sessions`)
      .build();

    listener(connection);

    connection.start()
      .then(() => console.log('connection started'))
      .catch((err) => console.log('error while establishing signalr connection: ' + err));

    return connection;
  }
}
